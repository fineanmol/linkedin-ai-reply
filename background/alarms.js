/**
 * alarms.js
 * A daily chrome.alarms tick that checks if TODAY has a queued, unposted
 * calendar entry and, if so, fires a chrome.notifications reminder.
 * Purely informational — never posts, edits, or approves anything.
 */

import { getCalendarPosts } from '../utils/storage.js';

const ALARM_NAME = 'liar-calendar-daily-check';
const NOTIFIED_PREFIX = 'liar_calendar_notified_';
const NOTIFIED_KEEP_DAYS = 7;

/**
 * Local-calendar date as YYYY-MM-DD. NOT toISOString() — that's UTC, so in
 * CET a post scheduled for "today" would match yesterday's key before 01:00.
 */
export function localDateKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function registerCalendarAlarm() {
  // The service worker re-runs this on every wake-up. Only create the alarm if
  // it doesn't exist yet — re-creating it would keep resetting the 1-minute
  // delay and the 12h period so it might never fire.
  chrome.alarms.get(ALARM_NAME)
    .then((existing) => {
      if (!existing) chrome.alarms.create(ALARM_NAME, { periodInMinutes: 60 * 12, delayInMinutes: 1 });
    })
    .catch(() => {});

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name !== ALARM_NAME) return;
    checkTodayAndNotify().catch(() => {});
  });

  chrome.notifications.onClicked.addListener((notifId) => {
    if (!notifId.startsWith('liar-calendar-')) return;
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html#calendar') });
  });
}

async function checkTodayAndNotify() {
  const todayKey = localDateKey();
  await pruneOldNotifiedFlags(todayKey);

  const posts = await getCalendarPosts();
  // Only a draft/edited post actually scheduled for TODAY (local date) — not
  // any unposted draft anywhere in the month.
  const actionable = posts.find(p =>
    ['draft', 'edited'].includes(p.status) && p.scheduledDate === todayKey
  );
  if (!actionable) return;

  const flagKey = `${NOTIFIED_PREFIX}${todayKey}`;
  const already = (await chrome.storage.local.get(flagKey))[flagKey];
  if (already) return;

  chrome.notifications.create(`liar-calendar-${actionable.id}`, {
    type: 'basic',
    iconUrl: chrome.runtime.getURL('assets/icon128.png'),
    title: 'A LinkedIn post draft is ready to review',
    message: `${(actionable.trendTopic || actionable.postText || 'Your scheduled post').slice(0, 100)} — review and post it yourself when ready.`,
    priority: 1,
  });
  await chrome.storage.local.set({ [flagKey]: true });
}

/** Drop liar_calendar_notified_<date> flags older than ~a week. */
async function pruneOldNotifiedFlags(todayKey) {
  const all = await chrome.storage.local.get(null);
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - NOTIFIED_KEEP_DAYS);
  const cutoffKey = localDateKey(cutoff);
  const stale = Object.keys(all).filter(k => {
    if (!k.startsWith(NOTIFIED_PREFIX)) return false;
    const date = k.slice(NOTIFIED_PREFIX.length);
    // YYYY-MM-DD compares correctly as a string. Malformed keys are dropped too.
    return !/^\d{4}-\d{2}-\d{2}$/.test(date) || (date < cutoffKey && date !== todayKey);
  });
  if (stale.length) await chrome.storage.local.remove(stale);
}
