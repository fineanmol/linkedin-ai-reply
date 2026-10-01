// Child process for test/dates.test.mjs. Runs under whatever TZ the parent sets
// (Europe/Berlin), with the clock frozen at FAKE_NOW, and prints JSON results.
// Exercises: alarms.js localDateKey + the daily-check notification, and the
// options page's localDateStr (extracted from options.js — that file needs a DOM).

import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { installChromeMock } from './chrome-mock.mjs';
import { ROOT } from './load.mjs';

const FIXED = Date.parse(process.env.FAKE_NOW);
const RealDate = Date;
class FakeDate extends RealDate {
  constructor(...a) { if (a.length) super(...a); else super(FIXED); }
  static now() { return FIXED; }
}
globalThis.Date = FakeDate;

const state = installChromeMock({ jitterMs: 0 });
const alarms = await import(pathToFileURL(process.env.ALARMS_BUNDLE).href);

// options.js localDateStr, evaluated from the real source.
const optSrc = readFileSync(join(ROOT, 'options/options.js'), 'utf8');
const fnSrc = optSrc.match(/function localDateStr\(d\) \{[\s\S]*?\n\}/)[0];
const localDateStr = new Function(`${fnSrc}; return localDateStr;`)();

const now = new Date();
const out = {
  tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
  isoSlice: now.toISOString().slice(0, 10),
  localDateKey: alarms.localDateKey(),
  localDateStr: localDateStr(now),
  // options builds a schedule from a start date parsed as LOCAL midnight.
  scheduleFromStart: localDateStr(new Date(2026, 9, 1)),
};

// Two posts: one scheduled for the local today, one for the UTC "today".
state.store.liar_content_calendar = [
  { id: 'utc', status: 'draft', scheduledDate: out.isoSlice, postText: 'utc day' },
  { id: 'local', status: 'draft', scheduledDate: out.localDateKey, postText: 'local day' },
];
state.store.liar_calendar_notified_2020_bad = true;
state.store['liar_calendar_notified_2020-01-01'] = true;

alarms.registerCalendarAlarm();
await new Promise((r) => setTimeout(r, 10));
for (const f of state.alarmListeners) f({ name: 'liar-calendar-daily-check' });
await new Promise((r) => setTimeout(r, 50));
// Second tick the same day must not notify again.
for (const f of state.alarmListeners) f({ name: 'liar-calendar-daily-check' });
await new Promise((r) => setTimeout(r, 50));

out.alarmCreates = state.alarmCreates;
out.notified = state.notifications.map((n) => n.id);
out.staleFlagsLeft = Object.keys(state.store).filter((k) => k.startsWith('liar_calendar_notified_2020'));
console.log(JSON.stringify(out));
