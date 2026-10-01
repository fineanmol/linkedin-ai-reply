// Comment-id / cache-key hashing: near-identical comments must not collide
// (the old btoa(first 30 chars) key made "Great post about X" and
// "Great point about X" share a cached reply).

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { loadModule } from './helpers/load.mjs';

let dom;
before(async () => { dom = await loadModule('utils/dom-helpers.js'); });

describe('fnv1a32 (utils/dom-helpers.js)', () => {
  test('matches FNV-1a 32-bit reference vectors', () => {
    assert.equal(dom.fnv1a32(''), '811c9dc5');
    assert.equal(dom.fnv1a32('a'), 'e40c292c');
    assert.equal(dom.fnv1a32('foobar'), 'bf9cf968');
  });

  test('"Great post about X" vs "Great point about X" differ', () => {
    const long = ' about retries in distributed systems and why idempotency matters';
    assert.notEqual(dom.fnv1a32(`Bob\u0000Great post${long}`), dom.fnv1a32(`Bob\u0000Great point${long}`));
    // Same 30-char prefix, different tail — the old key's failure mode.
    const p = 'x'.repeat(40);
    assert.notEqual(dom.fnv1a32(`${p}A`), dom.fnv1a32(`${p}B`));
  });

  test('always 8 lowercase hex chars', () => {
    for (const s of ['', 'a', 'ü✓', 'x'.repeat(5000)]) assert.match(dom.fnv1a32(s), /^[0-9a-f]{8}$/);
  });
});
