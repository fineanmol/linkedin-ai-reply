#!/usr/bin/env node
/**
 * claude-bridge.js
 * Local Ollama-compatible server that answers with Claude via the Claude Code CLI.
 * The extension's Claude backend (bridge mode) talks to it — no API key needed,
 * it uses whatever account the local `claude` CLI is logged in with.
 *
 * Usage:  npm run bridge
 * Env:    BRIDGE_PORT        (default 11435 — next to Ollama's 11434, so both can run)
 *         BRIDGE_MODEL       (default "opus" — used when the requested model isn't a Claude name)
 *         BRIDGE_CONCURRENCY (default 2 — max parallel `claude` processes)
 *         BRIDGE_TOKEN       (optional — if set, requests must send a matching X-Bridge-Token header)
 *         BRIDGE_TIMEOUT_MS  (default 170000 — per request, including time queued)
 *         CLAUDE_BIN         (default "claude")
 *
 * Security: binds to 127.0.0.1 only, sends no CORS headers (web pages can't
 * read responses), rejects foreign Host headers (DNS rebinding) and any Origin
 * that isn't a chrome-extension:// page.
 */

const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');

const VERSION = '0.2.0';
const PORT = Number(process.env.BRIDGE_PORT || 11435);
const DEFAULT_MODEL = process.env.BRIDGE_MODEL || 'opus';
const CONCURRENCY = Math.max(1, Number(process.env.BRIDGE_CONCURRENCY || 2));
const CLAUDE_BIN = process.env.CLAUDE_BIN || 'claude';
const TOKEN = process.env.BRIDGE_TOKEN || '';
const TIMEOUT_MS = Number(process.env.BRIDGE_TIMEOUT_MS) || 170_000; // just under the extension's 180s fetch timeout (queue wait counts)
const MAX_BODY_BYTES = 1024 * 1024; // 1 MB request body cap
const MAX_QUEUE = 20;              // max requests waiting for a slot

// Names shown in the extension's model dropdown (via /api/tags)
const MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-4-5'];

// Hosts we answer to (anything else is likely DNS rebinding)
const ALLOWED_HOSTS = new Set([`127.0.0.1:${PORT}`, `localhost:${PORT}`]);

// ─── Model mapping ─────────────────────────────────────────────────────────

function resolveModel(requested = '') {
  const m = String(requested || '').toLowerCase();
  if (m.includes('opus')) return 'opus';
  if (m.includes('sonnet')) return 'sonnet';
  if (m.includes('haiku')) return 'haiku';
  return DEFAULT_MODEL; // e.g. an Ollama-style name like "gemma2:2b"
}

// ─── Errors ────────────────────────────────────────────────────────────────

class BridgeError extends Error {
  constructor(message, status = 502) {
    super(message);
    this.status = status;
  }
}

const cancelled = () => new BridgeError('Request cancelled', 499);

// ─── Concurrency gate ──────────────────────────────────────────────────────

let active = 0;
const waiting = []; // { resolve, reject, signal, onAbort }

function acquireSlot(signal) {
  if (signal.aborted) return Promise.reject(cancelled());
  if (active < CONCURRENCY) {
    active++;
    return Promise.resolve();
  }
  if (waiting.length >= MAX_QUEUE) {
    return Promise.reject(new BridgeError('Bridge is busy — too many queued requests, try again shortly', 429));
  }
  return new Promise((resolve, reject) => {
    const entry = { resolve, reject, signal, onAbort: null };
    entry.onAbort = () => {
      // Drop the aborted waiter so it never takes a slot
      const i = waiting.indexOf(entry);
      if (i !== -1) waiting.splice(i, 1);
      reject(signal.reason instanceof BridgeError ? signal.reason : cancelled());
    };
    signal.addEventListener('abort', entry.onAbort, { once: true });
    waiting.push(entry);
  });
}

function releaseSlot() {
  // Hand the slot straight to the next live waiter (active count unchanged)
  while (waiting.length) {
    const next = waiting.shift();
    next.signal.removeEventListener('abort', next.onAbort);
    if (next.signal.aborted) {
      next.onAbort();
      continue;
    }
    next.resolve();
    return;
  }
  active--;
}

async function withSlot(signal, fn) {
  await acquireSlot(signal);
  try {
    if (signal.aborted) throw signal.reason instanceof BridgeError ? signal.reason : cancelled();
    return await fn();
  } finally {
    releaseSlot();
  }
}

// ─── Claude Code call ──────────────────────────────────────────────────────

/**
 * System messages become the system prompt; the rest is sent as a transcript
 * on stdin (a single user message is sent as-is).
 */
function toPrompt(messages) {
  const text = m => (typeof m.content === 'string' ? m.content : '');
  const system = messages.filter(m => m.role === 'system').map(text).join('\n\n').trim();
  const turns = messages.filter(m => m.role !== 'system' && text(m).trim());
  let prompt = turns.length === 1
    ? text(turns[0])
    : turns.map(m => `${m.role === 'assistant' ? 'Assistant' : 'User'}: ${text(m)}`).join('\n\n');
  // Only system content — give claude a minimal user turn instead of empty stdin
  if (!prompt.trim()) prompt = 'Follow the instructions above and respond.';
  return { system, prompt };
}

function writeSystemFile(system) {
  const file = path.join(os.tmpdir(), `claude-bridge-${process.pid}-${crypto.randomBytes(8).toString('hex')}.txt`);
  fs.writeFileSync(file, system, { mode: 0o600 });
  return file;
}

function runClaude({ model, messages, signal }) {
  if (signal.aborted) return Promise.reject(signal.reason instanceof BridgeError ? signal.reason : cancelled());

  const { system, prompt } = toPrompt(messages);
  const args = [
    '-p',
    '--model', model,
    '--output-format', 'json',
    '--tools', '',              // plain text generation — no file/shell access
    '--strict-mcp-config',      // don't load the user's MCP servers
    '--setting-sources', '',    // ignore user/project settings, hooks, CLAUDE.md
    '--no-session-persistence',
  ];

  // System prompt goes via a temp file — argv is visible in `ps` and size-limited
  let sysFile = null;
  if (system) {
    try {
      sysFile = writeSystemFile(system);
    } catch (e) {
      console.error(`[bridge] could not write system prompt file: ${e.message}`);
      return Promise.reject(new BridgeError('Bridge could not prepare the request'));
    }
    args.push('--system-prompt-file', sysFile);
  }
  const cleanup = () => {
    if (!sysFile) return;
    fs.rm(sysFile, { force: true }, () => {});
    sysFile = null;
  };

  return new Promise((resolve, reject) => {
    let child;
    try {
      child = spawn(CLAUDE_BIN, args, { stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
      cleanup();
      console.error(`[bridge] spawn failed: ${e.message}`);
      return reject(new BridgeError(`Could not start "${CLAUDE_BIN}" — is Claude Code installed?`));
    }

    let out = '';
    let err = '';
    let settled = false;
    const finish = (fn, value) => {
      if (settled) return;
      settled = true;
      signal.removeEventListener('abort', kill);
      cleanup();
      fn(value);
    };
    function kill() {
      if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
    }
    signal.addEventListener('abort', kill, { once: true });

    child.stdout.on('data', d => (out += d));
    child.stderr.on('data', d => (err += d));
    child.on('error', e => {
      console.error(`[bridge] "${CLAUDE_BIN}" failed to start: ${e.message}`);
      finish(reject, new BridgeError(`Could not start "${CLAUDE_BIN}" — is Claude Code installed?`));
    });
    // EPIPE etc. when claude exits before reading stdin — treat as child failure, never crash
    child.stdin.on('error', e => {
      if (e.code !== 'EPIPE') console.error(`[bridge] stdin error: ${e.message}`);
      kill();
    });
    child.on('close', (code, sig) => {
      if (settled) return; // already rejected via 'error' (e.g. ENOENT)
      if (signal.aborted) {
        return finish(reject, signal.reason instanceof BridgeError ? signal.reason : cancelled());
      }
      let data;
      try {
        data = JSON.parse(out);
      } catch {
        const detail = (err || out).trim().slice(0, 2000);
        console.error(`[bridge] claude exited ${code ?? sig}${detail ? `:\n${detail}` : ''}`);
        return finish(reject, new BridgeError(`claude exited with ${code ?? sig} — see bridge console for details`));
      }
      if (data.is_error) {
        console.error(`[bridge] claude returned an error: ${String(data.result || '').slice(0, 2000)}`);
        return finish(reject, new BridgeError(`claude returned an error: ${String(data.result || 'unknown').slice(0, 200)}`));
      }
      finish(resolve, String(data.result || '').trim());
    });

    child.stdin.end(prompt);
  });
}

// ─── HTTP server ───────────────────────────────────────────────────────────

// No CORS headers on purpose: a web page must never be able to read responses.
function send(res, status, body) {
  if (res.headersSent || res.writableEnded) return;
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

function readJson(req) {
  return new Promise((resolve, reject) => {
    const declared = Number(req.headers['content-length']);
    if (declared > MAX_BODY_BYTES) return reject(new BridgeError('request body too large', 413));
    const chunks = [];
    let size = 0;
    let done = false;
    req.on('data', d => {
      if (done) return;
      size += d.length;
      if (size > MAX_BODY_BYTES) {
        done = true;
        return reject(new BridgeError('request body too large', 413));
      }
      chunks.push(d);
    });
    req.on('end', () => {
      if (done) return;
      done = true;
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(new BridgeError('invalid JSON body', 400)); }
    });
    req.on('error', e => {
      if (done) return;
      done = true;
      reject(new BridgeError(e.message, 400));
    });
  });
}

/** Returns an [status, message] rejection, or null if the request may proceed. */
function checkRequest(req) {
  const host = String(req.headers.host || '').toLowerCase();
  if (!ALLOWED_HOSTS.has(host)) return [403, 'forbidden host'];
  const origin = req.headers.origin;
  if (origin !== undefined && !String(origin).startsWith('chrome-extension://')) return [403, 'forbidden origin'];
  if (req.method === 'OPTIONS') return [403, 'CORS preflight not allowed'];
  if (TOKEN) {
    const got = Buffer.from(String(req.headers['x-bridge-token'] || ''));
    const want = Buffer.from(TOKEN);
    if (got.length !== want.length || !crypto.timingSafeEqual(got, want)) return [401, 'missing or invalid X-Bridge-Token'];
  }
  return null;
}

const server = http.createServer(async (req, res) => {
  const denied = checkRequest(req);
  if (denied) {
    res.setHeader('Connection', 'close');
    return send(res, denied[0], { error: denied[1] });
  }

  const url = (req.url || '').split('?')[0];

  if (req.method === 'GET' && (url === '/' || url === '/api/version')) {
    return send(res, 200, { name: 'claude-bridge', status: 'running', version: VERSION });
  }

  if (req.method === 'GET' && url === '/api/tags') {
    return send(res, 200, { models: MODELS.map(name => ({ name, model: name })) });
  }

  if (req.method === 'POST' && url === '/api/chat') {
    // Timeout starts on arrival — time spent queued counts against it
    const abort = new AbortController();
    const timer = setTimeout(
      () => abort.abort(new BridgeError(`claude timed out after ${Math.round(TIMEOUT_MS / 1000)}s`, 504)),
      TIMEOUT_MS,
    );
    res.on('close', () => { if (!res.writableEnded) abort.abort(cancelled()); });

    let body;
    try {
      body = await readJson(req);
    } catch (e) {
      clearTimeout(timer);
      res.setHeader('Connection', 'close');
      return send(res, e.status || 400, { error: e.message });
    }
    if (!Array.isArray(body.messages) || !body.messages.length) {
      clearTimeout(timer);
      return send(res, 400, { error: 'messages[] is required' });
    }

    const requested = typeof body.model === 'string' ? body.model : '';
    const model = resolveModel(requested);
    const started = Date.now();
    try {
      const content = await withSlot(abort.signal, () => runClaude({ model, messages: body.messages, signal: abort.signal }));
      console.log(`[bridge] ${requested || '(default)'} → ${model} ok in ${((Date.now() - started) / 1000).toFixed(1)}s`);
      return send(res, 200, {
        model: requested || model,
        created_at: new Date().toISOString(),
        message: { role: 'assistant', content },
        done: true,
      });
    } catch (e) {
      const status = e instanceof BridgeError ? e.status : 502;
      const message = e instanceof BridgeError ? e.message : 'bridge error';
      console.error(`[bridge] ${requested || '(default)'} → ${model} failed after ${((Date.now() - started) / 1000).toFixed(1)}s: ${e.message}`);
      if (status !== 499) send(res, status, { error: message }); // 499 = client went away
      return;
    } finally {
      clearTimeout(timer);
    }
  }

  send(res, 404, { error: 'not found' });
});

server.on('clientError', (e, socket) => {
  if (socket.writable) socket.end('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n');
});

server.on('error', e => {
  if (e.code === 'EADDRINUSE') {
    console.error(`[bridge] Port ${PORT} is in use (another bridge running?). Set BRIDGE_PORT to another port and update the Claude bridge URL in extension settings.`);
    process.exit(1);
  }
  throw e;
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(
    `[bridge] Ollama-compatible Claude bridge v${VERSION} on http://localhost:${PORT} ` +
    `(default model: ${DEFAULT_MODEL}, concurrency: ${CONCURRENCY}, max queue: ${MAX_QUEUE}, ` +
    `token: ${TOKEN ? 'required (X-Bridge-Token)' : 'not required'}, claude: ${CLAUDE_BIN})`,
  );
});
