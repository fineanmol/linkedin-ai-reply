// Local-date helpers (calendar scheduling + the daily reminder alarm) under
// Europe/Berlin, where toISOString().slice(0,10) gives the PREVIOUS day for
// times between local midnight and 01:00/02:00.

import { test, describe, before } from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { ROOT, bundleModule } from './helpers/load.mjs';

let alarmsBundle;
before(async () => { alarmsBundle = await bundleModule('background/alarms.js'); });

function runChild(fakeNow) {
  const stdout = execFileSync(process.execPath, [join(ROOT, 'test/helpers/dates-child.mjs')], {
    env: { ...process.env, TZ: 'Europe/Berlin', FAKE_NOW: fakeNow, ALARMS_BUNDLE: alarmsBundle },
    encoding: 'utf8',
  });
  return JSON.parse(stdout.trim().split('\n').at(-1));
}

describe('local dates in Europe/Berlin', () => {
  test('00:30 CEST on 1 Oct is still 1 Oct locally (UTC says 30 Sep)', () => {
    const r = runChild('2026-09-30T22:30:00Z'); // = 2026-10-01 00:30 CEST
    assert.equal(r.tz, 'Europe/Berlin');
    assert.equal(r.isoSlice, '2026-09-30', 'sanity: the UTC slice is the previous day');
    assert.equal(r.localDateKey, '2026-10-01');
    assert.equal(r.localDateStr, '2026-10-01');
    assert.equal(r.scheduleFromStart, '2026-10-01');
  });

  test('daily alarm notifies only for the post scheduled on the local today, once', () => {
    const r = runChild('2026-09-30T22:30:00Z');
    assert.equal(r.alarmCreates, 1);
    assert.deepEqual(r.notified, ['liar-calendar-local']);
    assert.deepEqual(r.staleFlagsLeft, [], 'old and malformed notified-flags are pruned');
  });

  test('00:30 CET in winter (UTC+1)', () => {
    const r = runChild('2026-01-04T23:30:00Z'); // = 2026-01-05 00:30 CET
    assert.equal(r.isoSlice, '2026-01-04');
    assert.equal(r.localDateKey, '2026-01-05');
    assert.equal(r.localDateStr, '2026-01-05');
  });
});
