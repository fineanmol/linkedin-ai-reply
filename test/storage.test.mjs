// utils/storage.js per-key write queue: concurrent read-modify-write helpers
// must not lose writes against an async, jittery chrome.storage.local.

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { installChromeMock } from './helpers/chrome-mock.mjs';
import { loadModule } from './helpers/load.mjs';

let chromeState, storage, K;
before(async () => {
  chromeState = installChromeMock({ jitterMs: 4 });
  storage = await loadModule('utils/storage.js');
  K = (await loadModule('utils/constants.js')).STORAGE_KEYS;
});

describe('storage write queue', () => {
  test('30 parallel addToReplyHistory keep every entry', async () => {
    await storage.clearReplyHistory();
    await Promise.all(Array.from({ length: 30 }, (_, i) => storage.addToReplyHistory({ n: i })));
    const h = await storage.getReplyHistory();
    assert.equal(h.length, 30);
    assert.deepEqual(new Set(h.map((e) => e.n)).size, 30);
  });

  test('parallel addCalendarPosts + updateCalendarPost lose nothing', async () => {
    await storage.clearCalendar();
    await Promise.all(Array.from({ length: 20 }, (_, i) => storage.addCalendarPosts([{ day: i + 1 }])));
    let posts = await storage.getCalendarPosts();
    assert.equal(posts.length, 20);
    await Promise.all(posts.map((p, i) => storage.updateCalendarPost(p.id, { x: i })));
    posts = await storage.getCalendarPosts();
    assert.ok(posts.every((p) => typeof p.x === 'number'), 'every update kept');
  });

  test('parallel engagement-queue adds and updates', async () => {
    await storage.clearEngagementQueue();
    await Promise.all(Array.from({ length: 15 }, (_, i) =>
      storage.addToEngagementQueue([{ id: `q${i}`, urn: `urn:li:activity:${i}`, text: `t${i}` }])));
    let q = await storage.getEngagementQueue();
    assert.equal(q.length, 15);
    await Promise.all(q.map((it) => storage.updateEngagementQueueItem(it.id, { status: 'drafted' })));
    q = await storage.getEngagementQueue();
    assert.ok(q.every((it) => it.status === 'drafted'));
  });

  test('parallel connection adds and updates', async () => {
    await storage.clearConnectionsQueue();
    await Promise.all(Array.from({ length: 12 }, (_, i) =>
      storage.addConnections([{ id: `c${i}`, name: `N${i}`, profilePath: `/in/n${i}/` }])));
    let c = await storage.getConnectionsQueue();
    assert.equal(c.length, 12);
    await Promise.all(c.map((it, i) => storage.updateConnection(it.id, { draftMessage: `m${i}` })));
    c = await storage.getConnectionsQueue();
    assert.ok(c.every((it) => typeof it.draftMessage === 'string'));
  });

  test('parallel partial saveSettings merge', async () => {
    await Promise.all([
      storage.saveSettings({ topics: 'a' }),
      storage.saveSettings({ queueSize: 9 }),
      storage.saveSettings({ llmBackend: 'claude' }),
    ]);
    const s = await storage.getSettings();
    assert.equal(s.topics, 'a');
    assert.equal(s.queueSize, 9);
    assert.equal(s.llmBackend, 'claude');
    assert.ok(chromeState.store[K.SETTINGS]);
  });

  test('lock chain survives a throwing fn', async () => {
    await assert.rejects(storage.withStorageLock('k', async () => { throw new Error('boom'); }), /boom/);
    assert.equal(await storage.withStorageLock('k', async () => 5), 5);
  });

  test('lock really serializes', async () => {
    const order = [];
    const slow = storage.withStorageLock('s', async () => { order.push('a1'); await new Promise((r) => setTimeout(r, 20)); order.push('a2'); });
    const fast = storage.withStorageLock('s', async () => { order.push('b'); });
    await Promise.all([slow, fast]);
    assert.deepEqual(order, ['a1', 'a2', 'b']);
  });
});
