// bridge/claude-bridge.js as a black box: a real server process on a free
// port, with CLAUDE_BIN pointing at a fake `claude` shell script. The fake's
// behaviour depends on the --model it is given:
//   opus   → reads stdin, prints a JSON result
//   sonnet → reads stdin, sleeps 1s, prints a JSON result
//   haiku  → exits at once WITHOUT reading stdin (provokes EPIPE)
// Every spawn appends a line to FAKE_LOG so tests can count spawns.

import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { mkdtempSync, writeFileSync, readFileSync, existsSync, rmSync, chmodSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ROOT } from './helpers/load.mjs';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const ORIGIN = 'chrome-extension://abcdefghijklmnop';
const TOKEN = 'test-bridge-token';

const dir = mkdtempSync(join(tmpdir(), 'liar-bridge-'));
const FAKE = join(dir, 'fake-claude.sh');
const LOG = join(dir, 'spawns.log');
writeFileSync(FAKE, `#!/bin/sh
echo "spawn $*" >> "$FAKE_LOG"
case "$*" in
  *haiku*) exit 3 ;;
  *sonnet*) cat > /dev/null; sleep 1; echo '{"is_error":false,"result":"slow ok"}' ;;
  *) cat > /dev/null; echo '{"is_error":false,"result":"  fake reply  "}' ;;
esac
`);
chmodSync(FAKE, 0o755);

const spawnCount = () => (existsSync(LOG) ? readFileSync(LOG, 'utf8').split('\n').filter(Boolean).length : 0);

function freePort() {
  return new Promise((resolve, reject) => {
    const srv = net.createServer();
    srv.unref();
    srv.on('error', reject);
    srv.listen(0, '127.0.0.1', () => { const { port } = srv.address(); srv.close(() => resolve(port)); });
  });
}

/** Raw HTTP request (lets us set Host / Origin, unlike fetch). */
function request(port, { method = 'GET', path = '/api/version', headers = {}, body, abortAfterMs } = {}) {
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method, path, headers: { Origin: ORIGIN, ...headers } }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8');
        let json = null; try { json = JSON.parse(text); } catch {}
        resolve({ status: res.statusCode, headers: res.headers, text, json });
      });
    });
    req.on('error', (e) => (abortAfterMs ? resolve({ aborted: true, error: e }) : reject(e)));
    if (abortAfterMs) setTimeout(() => req.destroy(), abortAfterMs);
    if (body !== undefined) req.end(typeof body === 'string' ? body : JSON.stringify(body));
    else req.end();
  });
}

const chat = (port, model, extra = {}) => request(port, {
  method: 'POST', path: '/api/chat',
  headers: { 'Content-Type': 'application/json', ...(extra.headers || {}) },
  body: extra.body || { model, stream: false, messages: [{ role: 'system', content: 'Be brief.' }, { role: 'user', content: 'hi' }] },
  abortAfterMs: extra.abortAfterMs,
});

async function startBridge(env = {}) {
  const port = await freePort();
  const child = spawn(process.execPath, [join(ROOT, 'bridge/claude-bridge.js')], {
    env: { ...process.env, BRIDGE_PORT: String(port), CLAUDE_BIN: FAKE, FAKE_LOG: LOG, BRIDGE_CONCURRENCY: '1', ...env },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  let output = '';
  child.stdout.on('data', (d) => (output += d));
  child.stderr.on('data', (d) => (output += d));
  const deadline = Date.now() + 10_000;
  for (;;) {
    if (child.exitCode !== null) throw new Error(`bridge exited early:\n${output}`);
    try {
      const r = await request(port, { headers: env.BRIDGE_TOKEN ? { 'X-Bridge-Token': env.BRIDGE_TOKEN } : {} });
      if (r.status === 200) break;
    } catch {}
    if (Date.now() > deadline) { child.kill('SIGKILL'); throw new Error(`bridge did not start:\n${output}`); }
    await delay(50);
  }
  return { port, child, output: () => output };
}

function stopBridge(b) {
  if (!b || b.child.exitCode !== null) return Promise.resolve();
  return new Promise((resolve) => {
    b.child.once('exit', resolve);
    b.child.kill('SIGTERM');
    setTimeout(() => { try { b.child.kill('SIGKILL'); } catch {} }, 2000).unref();
  });
}

let bridge, tokenBridge;
before(async () => {
  bridge = await startBridge();
  tokenBridge = await startBridge({ BRIDGE_TOKEN: TOKEN });
});
after(async () => {
  await Promise.all([stopBridge(bridge), stopBridge(tokenBridge)]);
  rmSync(dir, { recursive: true, force: true });
});

describe('claude-bridge identity + security', () => {
  test('/api/version identifies the bridge; /api/tags lists the 3 models', async () => {
    const v = await request(bridge.port);
    assert.equal(v.status, 200);
    assert.equal(v.json.name, 'claude-bridge');
    assert.equal(v.json.status, 'running');
    const t = await request(bridge.port, { path: '/api/tags' });
    assert.deepEqual(t.json.models.map((m) => m.name), ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-4-5']);
  });

  test('foreign Origin → 403', async () => {
    const r = await request(bridge.port, { headers: { Origin: 'https://evil.example' } });
    assert.equal(r.status, 403);
  });

  test('foreign Host (DNS rebinding) → 403', async () => {
    const r = await request(bridge.port, { headers: { Host: `evil.example:${bridge.port}` } });
    assert.equal(r.status, 403);
    const ok = await request(bridge.port, { headers: { Host: `localhost:${bridge.port}` } });
    assert.equal(ok.status, 200);
  });

  test('OPTIONS → 403 and no CORS headers anywhere', async () => {
    const r = await request(bridge.port, { method: 'OPTIONS', path: '/api/chat', headers: { 'Access-Control-Request-Method': 'POST' } });
    assert.equal(r.status, 403);
    for (const res of [r, await request(bridge.port), await chat(bridge.port, 'claude-opus-5-5')]) {
      assert.ok(!Object.keys(res.headers).some((h) => h.startsWith('access-control-')), JSON.stringify(res.headers));
    }
  });

  test('BRIDGE_TOKEN enforced → 401 without / with wrong token', async () => {
    assert.equal((await request(tokenBridge.port, { headers: {} })).status, 401);
    assert.equal((await request(tokenBridge.port, { headers: { 'X-Bridge-Token': 'wrong' } })).status, 401);
    assert.equal((await request(tokenBridge.port, { headers: { 'X-Bridge-Token': TOKEN } })).status, 200);
    const c = await chat(tokenBridge.port, 'claude-opus-5-5', { headers: { 'X-Bridge-Token': TOKEN } });
    assert.equal(c.status, 200);
  });

  test('body over 1 MB → 413', async () => {
    const big = JSON.stringify({ model: 'opus', messages: [{ role: 'user', content: 'x'.repeat(1_100_000) }] });
    const r = await chat(bridge.port, 'opus', { body: big });
    assert.equal(r.status, 413);
  });

  test('invalid JSON → 400', async () => {
    const r = await chat(bridge.port, 'opus', { body: '{nope' });
    assert.equal(r.status, 400);
  });
});

describe('claude-bridge chat', () => {
  test('successful chat returns an Ollama-shaped message.content', async () => {
    const r = await chat(bridge.port, 'claude-opus-5-5');
    assert.equal(r.status, 200, r.text);
    assert.equal(r.json.message.role, 'assistant');
    assert.equal(r.json.message.content, 'fake reply');
    assert.equal(r.json.done, true);
    const log = readFileSync(LOG, 'utf8');
    assert.match(log, /--system-prompt-file/, 'system prompt passed via file');
  });

  test('a CLI that exits without reading stdin (EPIPE) does not crash the server', async () => {
    const big = { model: 'claude-haiku-4-5', messages: [{ role: 'user', content: 'y'.repeat(800_000) }] };
    for (let i = 0; i < 2; i++) {
      const r = await chat(bridge.port, 'claude-haiku-4-5', { body: big });
      assert.equal(r.status, 502, r.text);
      assert.ok(r.json?.error);
    }
    const ok = await chat(bridge.port, 'claude-opus-5-5');
    assert.equal(ok.status, 200, 'server still serving after early-exit children');
    assert.equal(bridge.child.exitCode, null);
  });

  test('a request cancelled while queued never spawns claude', async () => {
    const before = spawnCount();
    const slow = chat(bridge.port, 'claude-sonnet-5-5');          // holds the only slot ~1s
    await delay(200);
    const cancelled = chat(bridge.port, 'claude-opus-5-5', { abortAfterMs: 200 }); // queued, then dropped
    const [a, b] = await Promise.all([slow, cancelled]);
    assert.equal(a.status, 200);
    assert.equal(a.json.message.content, 'slow ok');
    assert.ok(b.aborted);
    await delay(400);
    assert.equal(spawnCount() - before, 1, 'only the slow request spawned');
    assert.equal(bridge.child.exitCode, null);
  });
});
