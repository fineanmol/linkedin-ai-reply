// The bundled service-worker message API, end to end, with mocked chrome.* and
// a mocked Ollama fetch: settings sanitizing for content scripts, reply cache
// keys, label/isLocal, the background-scraping gate and calendar source reuse.

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { installChromeMock } from './helpers/chrome-mock.mjs';
import { loadModule } from './helpers/load.mjs';

const delay = (ms) => new Promise((r) => setTimeout(r, ms));
const CS = { id: 'EXT', tab: { id: 7 }, url: 'https://www.linkedin.com/feed/' }; // content script
const EP = { id: 'EXT', url: 'chrome-extension://EXT/options/options.html' };   // extension page

let chromeState, MSG;
let fetchCount = 0;
const send = (type, payload, sender) =>
  new Promise((r) => { chromeState.listener({ type, payload }, sender, r); });

before(async () => {
  chromeState = installChromeMock({ jitterMs: 2 });
  globalThis.fetch = async (url, opts = {}) => {
    fetchCount++;
    const body = JSON.parse(opts.body || '{}');
    await new Promise((res, rej) => {
      const t = setTimeout(res, 30);
      opts.signal?.addEventListener('abort', () => { clearTimeout(t); rej(Object.assign(new Error('aborted'), { name: 'AbortError' })); });
    });
    const last = body.messages?.at(-1)?.content || '';
    let content = 'Great post! This approach breaks once retries kick in, see https://evil.example.com now.';
    if (last.includes('SOURCE POST')) content = "Here's a LinkedIn post:\n\nPara one.\n\n- bullet a\n- bullet b\n\nOur team learned this.";
    if (body.messages?.[0]?.content?.startsWith('Summarize')) content = 'Topic label';
    return { ok: true, status: 200, json: async () => ({ message: { content } }), text: async () => '' };
  };
  MSG = (await loadModule('utils/constants.js')).MSG;
  await loadModule('background/background.js');
  assert.equal(typeof chromeState.listener, 'function', 'onMessage listener registered');
  await send(MSG.SAVE_SETTINGS, { geminiApiKey: 'SECRET1', claudeApiKey: 'SECRET2', claudeBridgeToken: 'TOK', llmBackend: 'ollama' }, EP);
});

describe('settings sanitizing (contract 3)', () => {
  test('content-script GET_SETTINGS blanks keys and adds has*Key flags', async () => {
    const s = await send(MSG.GET_SETTINGS, null, CS);
    assert.equal(s.geminiApiKey, '');
    assert.equal(s.claudeApiKey, '');
    assert.equal(s.claudeBridgeToken, '');
    assert.equal(s.hasGeminiKey, true);
    assert.equal(s.hasClaudeKey, true);
  });

  test('SETTINGS_CHANGED broadcast carries no secrets', () => {
    assert.ok(chromeState.sentToTabs.length > 0);
    assert.equal(chromeState.sentToTabs.at(-1).type, MSG.SETTINGS_CHANGED);
    assert.doesNotMatch(JSON.stringify(chromeState.sentToTabs), /SECRET|TOK/);
  });

  test('content-script SAVE_SETTINGS is whitelisted and merged', async () => {
    const s = await send(MSG.GET_SETTINGS, null, CS);
    await send(MSG.SAVE_SETTINGS, { ...s, geminiApiKey: 'HACK', allowBackgroundScraping: true, enabled: false, ollamaModel: 'llama3.2:3b' }, CS);
    const full = await send(MSG.GET_SETTINGS, null, EP);
    assert.equal(full.geminiApiKey, 'SECRET1');
    assert.equal(full.allowBackgroundScraping, false);
    assert.equal(full.enabled, false);
    assert.equal(full.ollamaModel, 'llama3.2:3b');
    assert.ok(!('hasGeminiKey' in full), 'derived flags are not persisted');
    await send(MSG.SAVE_SETTINGS, { enabled: true }, EP);
    assert.equal((await send(MSG.GET_SETTINGS, null, EP)).claudeApiKey, 'SECRET2', 'extension partial save merges');
  });
});

describe('GENERATE_REPLY', () => {
  const p = { commentId: 'c1', commentText: 'Great post about retries in distributed systems', authorName: 'Bob', postContent: 'Retries post', intent: 'general' };

  test('concurrent identical requests share one LLM call; response has label/isLocal; toComment applied', async () => {
    const before = fetchCount;
    const [a, b] = await Promise.all([send(MSG.GENERATE_REPLY, p, CS), send(MSG.GENERATE_REPLY, p, CS)]);
    assert.equal(fetchCount - before, 1);
    assert.equal(a.reply, b.reply);
    assert.equal(a.backend, 'ollama');
    assert.equal(a.label, 'Ollama');
    assert.equal(a.isLocal, true);
    assert.match(a.reply, /^This approach breaks/);
    assert.ok(!a.reply.includes('evil.example.com'));
  });

  test('cache hit keeps the label; "Great point…" gets a different cache key', async () => {
    const hit = await send(MSG.GENERATE_REPLY, p, CS);
    assert.equal(hit.cached, true);
    assert.equal(hit.label, 'Ollama');
    const other = await send(MSG.GENERATE_REPLY, { ...p, commentText: 'Great point about retries in distributed systems' }, CS);
    assert.ok(!other.cached, 'different comment text must not hit the cache');
  });

  test('CANCEL_REPLY works without authorName', async () => {
    const pending = send(MSG.GENERATE_REPLY, { ...p, commentId: 'c9' }, CS);
    await delay(5);
    const cr = await send(MSG.CANCEL_REPLY, { commentId: 'c9', commentText: p.commentText, intent: 'general' }, CS);
    const r = await pending;
    assert.ok(cr.cancelled);
    assert.ok(r.error);
  });
});

describe('background scraping gate (contract 4)', () => {
  test('DEEP_DRAFT_WELCOME and SCRAPE_FRIEND_PROFILE refuse without opening tabs', async () => {
    const g1 = await send(MSG.DEEP_DRAFT_WELCOME, { profilePath: '/in/x/' }, CS);
    const g2 = await send(MSG.SCRAPE_FRIEND_PROFILE, { friendProfileUrl: '/in/x' }, EP);
    for (const g of [g1, g2]) {
      assert.equal(g.code, 'SCRAPING_DISABLED');
      assert.match(g.error, /Background profile reading is off/);
    }
    assert.equal(chromeState.tabsCreated, 0);
  });

  test('a bad profilePath is rejected even when scraping is on', async () => {
    await send(MSG.SAVE_SETTINGS, { allowBackgroundScraping: true }, EP);
    const g = await send(MSG.DEEP_DRAFT_WELCOME, { profilePath: '/feed/../in/x' }, CS);
    assert.match(g.error, /Invalid/i);
    assert.equal(chromeState.tabsCreated, 0);
    await send(MSG.SAVE_SETTINGS, { allowBackgroundScraping: false }, EP);
  });
});

describe('calendar friend stream (contract 5)', () => {
  test('parallel days claim distinct sources; regenerate reuses its own source', async () => {
    await send(MSG.BUILD_CALENDAR_BATCH, {
      friendProfileUrl: '/in/f', ratio: { friend: 100, trending: 0 }, timeSlot: 'morning', totalDays: 3,
      selectedPosts: [{ text: 'P3' }, { text: 'P2' }, { text: 'P1' }],
    }, EP);
    const days = await Promise.all([1, 2, 3].map((d) => send(MSG.GENERATE_CALENDAR_POST, { day: d, stream: 'friend' }, EP)));
    const srcs = days.map((d) => d.post?.sourceFriendPostText);
    assert.equal(new Set(srcs).size, 3, `distinct sources: ${srcs}`);

    const post = days[0].post.postText;
    assert.ok(post.includes('\n\n- bullet a\n- bullet b'), 'toPost keeps bullets');
    assert.ok(post.includes('Our team'), 'toPost keeps "our team"');
    assert.ok(!post.startsWith("Here's"), 'toPost strips the preamble');

    const regen = await send(MSG.GENERATE_CALENDAR_POST, { day: days[1].post, stream: 'friend' }, EP);
    assert.equal(regen.post?.sourceFriendPostText, days[1].post.sourceFriendPostText);
    assert.equal(regen.post.day, 2);

    const none = await send(MSG.GENERATE_CALENDAR_POST, { day: 4, stream: 'friend' }, EP);
    assert.ok(none.error, 'exhausted friend queue → error, regenerate consumed nothing extra');
  });
});
