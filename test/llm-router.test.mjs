// llm-router + claude-client with mocked fetch and settings. The Anthropic SDK
// runs for real but its fetch is mocked — the real API is never called.

import { test, describe, before, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './helpers/load.mjs';

let llmRouter, cc, SETTINGS_KEY;
let stored = {};
let calls = [];
let responder = () => new Response('{}');

const json = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'content-type': 'application/json' } });
const msgs = [{ role: 'system', content: 'SYS' }, { role: 'user', content: 'hi' }];
const setSettings = (s) => { stored = s; };

before(async () => {
  globalThis.chrome = {
    runtime: { lastError: null },
    storage: { local: { get: (k, cb) => { const o = { [k]: stored }; if (cb) cb(o); else return Promise.resolve(o); } } },
  };
  globalThis.fetch = async (url, init = {}) => {
    const req = url instanceof Request ? url : null;
    const u = req ? req.url : String(url);
    const headers = new Headers(req ? req.headers : init.headers);
    const body = req ? await req.text() : init.body;
    calls.push({ url: u, method: req?.method || init.method || 'GET', headers, body, signal: init.signal });
    return responder(u, headers, body);
  };
  SETTINGS_KEY = (await loadModule('utils/constants.js')).STORAGE_KEYS.SETTINGS;
  ({ llmRouter } = await loadModule('background/llm-router.js'));
  cc = await loadModule('background/claude-client.js');
  assert.ok(SETTINGS_KEY);
});
beforeEach(() => { calls = []; });

describe('Claude bridge mode', () => {
  test('request shape: URL, model, messages, X-Bridge-Token; raw text + label returned', async () => {
    setSettings({ llmBackend: 'claude', claudeMode: 'bridge', claudeBridgeUrl: 'http://localhost:11435/', claudeBridgeToken: 'tok', claudeModel: 'claude-sonnet-5-5' });
    responder = () => json({ message: { role: 'assistant', content: '"raw reply"' } });
    const r = await llmRouter.chat(msgs);
    const c = calls.at(-1);
    assert.equal(c.url, 'http://localhost:11435/api/chat');
    assert.equal(c.method, 'POST');
    assert.equal(c.headers.get('x-bridge-token'), 'tok');
    assert.equal(c.headers.get('content-type'), 'application/json');
    assert.deepEqual(JSON.parse(c.body), { model: 'claude-sonnet-5-5', messages: msgs, stream: false });
    assert.deepEqual(r, { text: '"raw reply"', backend: 'claude', model: 'claude-sonnet-5-5', label: 'Claude (Claude Code bridge)', isLocal: false });
  });

  test('no token → no X-Bridge-Token header', async () => {
    setSettings({ ...stored, claudeBridgeToken: '' });
    responder = () => json({ message: { content: 'x' } });
    await llmRouter.chat(msgs);
    assert.equal(calls.at(-1).headers.get('x-bridge-token'), null);
  });

  test('checkBackend identifies the bridge by /api/version name', async () => {
    responder = () => json({ name: 'claude-bridge', status: 'running', version: '0.2.0' });
    let st = await llmRouter.checkBackend();
    assert.equal(calls.at(-1).url, 'http://localhost:11435/api/version');
    assert.equal(st.alive, true);
    assert.equal(st.isLocal, false);
    responder = () => json({ version: '0.5' }); // something else (e.g. Ollama) on that port
    st = await llmRouter.checkBackend();
    assert.equal(st.alive, false);
    assert.match(st.error, /npm run bridge/);
  });

  test('unreachable bridge → helpful error; 401 → token message', async () => {
    responder = () => { throw new TypeError('Failed to fetch'); };
    await assert.rejects(llmRouter.chat(msgs), /Claude bridge not reachable at http:\/\/localhost:11435\. Start it with: npm run bridge/);
    responder = () => json({ error: 'bad token' }, 401);
    await assert.rejects(llmRouter.chat(msgs), /token/i);
  });

  test('caller abort propagates as AbortError', async () => {
    const ac = new AbortController();
    responder = () => new Promise((_, rej) => { const s = calls.at(-1).signal; s.addEventListener('abort', () => rej(s.reason)); });
    const p = llmRouter.chat(msgs, ac.signal);
    setTimeout(() => ac.abort(), 10);
    await assert.rejects(p, (e) => e.name === 'AbortError');
  });
});

describe('Claude API mode', () => {
  test('toAnthropicMessages: system extracted, same-role merged, user first, no prefill', () => {
    assert.deepEqual(
      cc.toAnthropicMessages([
        { role: 'assistant', content: 'x' }, { role: 'system', content: 'A' },
        { role: 'user', content: 'u1' }, { role: 'user', content: 'u2' },
        { role: 'system', content: 'B' }, { role: 'assistant', content: 'pre' },
      ]),
      { system: 'A\n\nB', messages: [{ role: 'user', content: 'u1\n\nu2' }] }
    );
  });

  test('buildApiRequest: fallback beta + effort for opus/sonnet, neither for haiku, never temperature/top_p/thinking', () => {
    assert.deepEqual(cc.buildApiRequest('claude-opus-5-5', msgs), {
      model: 'claude-opus-5-5', max_tokens: 4096, system: 'SYS', messages: [{ role: 'user', content: 'hi' }],
      betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default', output_config: { effort: 'low' },
    });
    assert.ok(cc.buildApiRequest('claude-sonnet-5-5', msgs).betas);
    const h = cc.buildApiRequest('claude-haiku-4-5', msgs);
    assert.equal(h.betas, undefined);
    assert.equal(h.fallbacks, undefined);
    assert.equal(h.output_config, undefined);
    for (const m of ['claude-opus-5-5', 'claude-sonnet-5-5', 'claude-haiku-4-5']) {
      const q = cc.buildApiRequest(m, [...msgs, { role: 'assistant', content: 'prefill' }]);
      for (const k of ['temperature', 'top_p', 'top_k', 'thinking']) assert.ok(!(k in q), `${m} must not send ${k}`);
      assert.equal(q.messages.at(-1).role, 'user');
    }
  });

  test('missing key → clear error, status not alive, no network', async () => {
    setSettings({ llmBackend: 'claude', claudeMode: 'api', claudeApiKey: '', claudeModel: 'claude-opus-5-5' });
    const st = await llmRouter.checkBackend();
    assert.equal(st.alive, false);
    assert.equal(st.label, 'Claude (API)');
    await assert.rejects(llmRouter.chat(msgs), /Anthropic API key not configured/);
    assert.equal(calls.length, 0);
  });

  test('SDK request via mocked fetch: headers, body, text-only output', async () => {
    setSettings({ llmBackend: 'claude', claudeMode: 'api', claudeApiKey: 'sk-test', claudeModel: 'claude-opus-5-5' });
    const st = await llmRouter.checkBackend();
    assert.equal(st.alive, true);
    assert.equal(calls.length, 0, 'status check spends no tokens');
    responder = () => json({
      id: 'm', type: 'message', role: 'assistant', model: 'claude-opus-5-5', stop_reason: 'end_turn', usage: {},
      content: [{ type: 'thinking', thinking: 'zz' }, { type: 'text', text: 'Hello ' }, { type: 'text', text: 'there' }],
    });
    const r = await llmRouter.chat(msgs);
    const c = calls.at(-1);
    assert.match(c.url, /^https:\/\/api\.anthropic\.com\/v1\/messages\?beta=true$/);
    assert.equal(c.headers.get('x-api-key'), 'sk-test');
    assert.match(c.headers.get('anthropic-beta') || '', /server-side-fallback-2026-07-01/);
    const sent = JSON.parse(c.body);
    assert.equal(sent.system, 'SYS');
    assert.deepEqual(sent.messages, [{ role: 'user', content: 'hi' }]);
    assert.ok(!('temperature' in sent) && !('top_p' in sent) && !('thinking' in sent));
    assert.deepEqual(r, { text: 'Hello there', backend: 'claude', model: 'claude-opus-5-5', label: 'Claude (API)', isLocal: false });
  });

  test('refusal and typed errors are mapped', async () => {
    responder = () => json({ id: 'm', type: 'message', role: 'assistant', stop_reason: 'refusal', content: [], usage: {} });
    await assert.rejects(llmRouter.chat(msgs), /refusal/);
    responder = () => json({ type: 'error', error: { type: 'authentication_error', message: 'bad key' } }, 401);
    await assert.rejects(llmRouter.chat(msgs), /^Error: Invalid Anthropic API key$/);
    responder = () => json({ type: 'error', error: { type: 'invalid_request_error', message: 'nope' } }, 400);
    await assert.rejects(llmRouter.chat(msgs), /Anthropic API error 400: .*nope/);
  });
});

describe('Ollama / Gemini / auto', () => {
  test('auto falls back to Gemini and reports it truthfully; key goes in a header', async () => {
    setSettings({ llmBackend: 'auto', ollamaUrl: 'http://localhost:11434', ollamaModel: 'gemma2:2b', geminiApiKey: 'GKEY', geminiModel: 'gemini-flash-latest' });
    responder = (u) => (u.includes('11434') ? json({ error: 'down' }, 500) : json({ candidates: [{ content: { parts: [{ text: 'gem' }] } }] }));
    const r = await llmRouter.chat(msgs);
    const c = calls.at(-1);
    assert.ok(!c.url.includes('GKEY'));
    assert.equal(c.headers.get('x-goog-api-key'), 'GKEY');
    assert.deepEqual(r, { text: 'gem', backend: 'gemini', model: 'gemini-flash-latest', label: 'Gemini', isLocal: false });
  });

  test('auto checkBackend prefers a live Ollama', async () => {
    responder = (u) => (u.includes('11434') ? json({ models: [] }) : json({}));
    const st = await llmRouter.checkBackend();
    assert.equal(st.backend, 'ollama');
    assert.equal(st.isLocal, true);
  });

  test('ollama only: local result, raw text', async () => {
    setSettings({ llmBackend: 'ollama', ollamaUrl: 'http://localhost:11434', ollamaModel: 'gemma2:2b' });
    responder = () => json({ message: { content: ' "loc" ' } });
    const r = await llmRouter.chat(msgs);
    assert.equal(r.backend, 'ollama');
    assert.equal(r.label, 'Ollama');
    assert.equal(r.isLocal, true);
    assert.ok(!calls.some((c) => /anthropic|googleapis/.test(c.url)), 'no cloud call');
  });
});
