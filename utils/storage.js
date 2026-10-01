/**
 * storage.js
 * Typed wrapper around chrome.storage.local with defaults and migration support.
 */

import { STORAGE_KEYS, DEFAULT_SETTINGS, DEFAULT_STYLE_PROFILE } from './constants.js';

// ─── Generic get/set ──────────────────────────────────────────────────────

export async function storageGet(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, (result) => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve(result[key]);
    });
  });
}

export async function storageSet(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve();
    });
  });
}

export async function storageRemove(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, () => {
      if (chrome.runtime.lastError) reject(chrome.runtime.lastError);
      else resolve();
    });
  });
}

// ─── Per-key write queue ────────────────────────────────────────────────────
// chrome.storage has no transactions, so two concurrent read-modify-write
// calls (e.g. two addToReplyHistory()s from parallel generations) would both
// read the same array and the second write would drop the first's entry.
// Every read-modify-write for a key runs through a promise chain for that key,
// so they execute one after another. Inside a locked fn, use storageGet /
// storageSet directly — calling another locked helper for the SAME key from
// inside would deadlock.

const _keyQueues = new Map();

export function withStorageLock(key, fn) {
  const prev = _keyQueues.get(key) || Promise.resolve();
  const run = prev.then(() => fn());
  // The chain must survive a failed fn, and must not leak rejections.
  const tail = run.catch(() => {});
  _keyQueues.set(key, tail);
  tail.then(() => { if (_keyQueues.get(key) === tail) _keyQueues.delete(key); });
  return run;
}

// ─── Settings ─────────────────────────────────────────────────────────────

// Gemini model IDs retired by Google — auto-migrate saved settings off these
// so existing users don't keep hitting 404s with a stale stored model.
const DEAD_GEMINI_MODELS = new Set([
  'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash',
  'gemini-1.5-flash', 'gemini-1.5-pro',
]);

function mergeSettings(stored) {
  const settings = { ...DEFAULT_SETTINGS, ...(stored || {}) };
  if (DEAD_GEMINI_MODELS.has(settings.geminiModel)) {
    settings.geminiModel = DEFAULT_SETTINGS.geminiModel; // → gemini-flash-latest
  }
  return settings;
}

export async function getSettings() {
  return mergeSettings(await storageGet(STORAGE_KEYS.SETTINGS));
}

/** Merge a PARTIAL settings object into the stored settings (serialized). */
export async function saveSettings(settings) {
  return withStorageLock(STORAGE_KEYS.SETTINGS, async () => {
    const current = mergeSettings(await storageGet(STORAGE_KEYS.SETTINGS));
    await storageSet(STORAGE_KEYS.SETTINGS, { ...current, ...(settings || {}) });
  });
}

// ─── Style Profile ─────────────────────────────────────────────────────────

function hydrateStyleProfile(stored) {
  return {
    ...DEFAULT_STYLE_PROFILE,
    ...(stored || {}),
    fingerprint: {
      ...DEFAULT_STYLE_PROFILE.fingerprint,
      ...((stored || {}).fingerprint || {}),
    },
  };
}

export async function getStyleProfile() {
  return hydrateStyleProfile(await storageGet(STORAGE_KEYS.STYLE_PROFILE));
}

export async function saveStyleProfile(profile) {
  return withStorageLock(STORAGE_KEYS.STYLE_PROFILE, () => storageSet(STORAGE_KEYS.STYLE_PROFILE, profile));
}

/**
 * Serialized read-modify-write of the style profile. `mutator(profile)` may
 * mutate in place and/or return a value; return `false` to skip the write.
 * Resolves with the mutator's return value.
 */
export async function updateStyleProfile(mutator) {
  return withStorageLock(STORAGE_KEYS.STYLE_PROFILE, async () => {
    const profile = hydrateStyleProfile(await storageGet(STORAGE_KEYS.STYLE_PROFILE));
    const result = await mutator(profile);
    if (result !== false) await storageSet(STORAGE_KEYS.STYLE_PROFILE, profile);
    return result;
  });
}

/**
 * Add a new style sample to the profile, evicting oldest if over limit.
 */
export async function addStyleSample(sample) {
  const newSample = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...sample,
  };
  await updateStyleProfile((profile) => {
    profile.samples = [newSample, ...profile.samples].slice(0, profile.maxSamples);
  });
  return newSample;
}

// ─── Reply History ─────────────────────────────────────────────────────────

export async function getReplyHistory() {
  const stored = await storageGet(STORAGE_KEYS.REPLY_HISTORY);
  return stored || [];
}

export async function addToReplyHistory(entry) {
  const newEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...entry,
  };
  await withStorageLock(STORAGE_KEYS.REPLY_HISTORY, async () => {
    const history = (await storageGet(STORAGE_KEYS.REPLY_HISTORY)) || [];
    // Keep last 200 entries
    await storageSet(STORAGE_KEYS.REPLY_HISTORY, [newEntry, ...history].slice(0, 200));
  });
  return newEntry;
}

/** Serialized map over every history entry (e.g. mark one approved). */
export async function updateReplyHistory(mapFn) {
  return withStorageLock(STORAGE_KEYS.REPLY_HISTORY, async () => {
    const history = (await storageGet(STORAGE_KEYS.REPLY_HISTORY)) || [];
    await storageSet(STORAGE_KEYS.REPLY_HISTORY, history.map(mapFn));
  });
}

export async function clearReplyHistory() {
  return withStorageLock(STORAGE_KEYS.REPLY_HISTORY, () => storageRemove(STORAGE_KEYS.REPLY_HISTORY));
}

// ─── Engagement Queue ────────────────────────────────────────────────────────
// Items shape: { id, urn, authorName, authorHeadline, postText, permalink,
//   draftReply, relevance, whyEngage, status: 'queued'|'done'|'skipped', timestamp }

export async function getEngagementQueue() {
  const stored = await storageGet(STORAGE_KEYS.ENGAGEMENT_QUEUE);
  return stored || [];
}

export async function saveEngagementQueue(items) {
  return withStorageLock(STORAGE_KEYS.ENGAGEMENT_QUEUE, () => storageSet(STORAGE_KEYS.ENGAGEMENT_QUEUE, items || []));
}

/**
 * Merge new items into the queue, de-duplicating by urn (or permalink).
 * Existing items are preserved; only genuinely new targets are added.
 * Returns the number of items added.
 */
export async function addToEngagementQueue(newItems) {
  return withStorageLock(STORAGE_KEYS.ENGAGEMENT_QUEUE, async () => {
    const queue = (await storageGet(STORAGE_KEYS.ENGAGEMENT_QUEUE)) || [];
    const seen = new Set(queue.map(q => q.urn || q.permalink));
    let added = 0;
    for (const item of newItems) {
      const key = item.urn || item.permalink;
      if (key && seen.has(key)) continue;
      seen.add(key);
      queue.push({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        status: 'queued',
        ...item,
      });
      added++;
    }
    // Newest-first, cap at 100 to bound storage.
    queue.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    await storageSet(STORAGE_KEYS.ENGAGEMENT_QUEUE, queue.slice(0, 100));
    return added;
  });
}

export async function updateEngagementQueueItem(id, patch) {
  return withStorageLock(STORAGE_KEYS.ENGAGEMENT_QUEUE, async () => {
    const queue = (await storageGet(STORAGE_KEYS.ENGAGEMENT_QUEUE)) || [];
    const updated = queue.map(q => (q.id === id ? { ...q, ...patch } : q));
    await storageSet(STORAGE_KEYS.ENGAGEMENT_QUEUE, updated);
  });
}

export async function clearEngagementQueue() {
  return withStorageLock(STORAGE_KEYS.ENGAGEMENT_QUEUE, () => storageRemove(STORAGE_KEYS.ENGAGEMENT_QUEUE));
}

// ─── Comments Log ────────────────────────────────────────────────────────────
// A record of comments the user confirmed they POSTED. Powers: activity
// counts/streak, a history view, and skip-already-engaged in future builds.
// Item shape: { id, urn, authorName, postText, comment, timestamp }

export async function getCommentsLog() {
  const stored = await storageGet(STORAGE_KEYS.COMMENTS_LOG);
  return stored || [];
}

export async function addToCommentsLog(entry) {
  return withStorageLock(STORAGE_KEYS.COMMENTS_LOG, async () => {
    const log = (await storageGet(STORAGE_KEYS.COMMENTS_LOG)) || [];
    // Dedup by urn so re-marking the same post doesn't double-count.
    if (entry.urn && log.some(l => l.urn === entry.urn)) return log;
    log.unshift({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...entry,
    });
    await storageSet(STORAGE_KEYS.COMMENTS_LOG, log.slice(0, 500));
    return log;
  });
}

/** Set of activity URNs the user has already engaged on (for skip logic). */
export async function getEngagedUrns() {
  const log = await getCommentsLog();
  return new Set(log.map(l => l.urn).filter(Boolean));
}

export function commentCounts(log) {
  const now = Date.now();
  const DAY = 86400000;
  const today = log.filter(l => now - (l.timestamp || 0) < DAY).length;
  const week = log.filter(l => now - (l.timestamp || 0) < 7 * DAY).length;
  return { today, week, total: log.length };
}

export async function clearCommentsLog() {
  return withStorageLock(STORAGE_KEYS.COMMENTS_LOG, () => storageRemove(STORAGE_KEYS.COMMENTS_LOG));
}

// ─── Connections Queue (welcome-message drafts) ──────────────────────────────
// Item shape: { id, profilePath, name, headline, connectedOn, draftMessage,
//   status: 'new'|'copied'|'done', timestamp }

export async function getConnectionsQueue() {
  const stored = await storageGet(STORAGE_KEYS.CONNECTIONS_QUEUE);
  return stored || [];
}

export async function saveConnectionsQueue(items) {
  return withStorageLock(STORAGE_KEYS.CONNECTIONS_QUEUE, () => storageSet(STORAGE_KEYS.CONNECTIONS_QUEUE, items || []));
}

/** Merge new connections, de-duping by profilePath. Returns count added. */
export async function addConnections(newItems) {
  return withStorageLock(STORAGE_KEYS.CONNECTIONS_QUEUE, async () => {
    const queue = (await storageGet(STORAGE_KEYS.CONNECTIONS_QUEUE)) || [];
    const seen = new Set(queue.map(q => q.profilePath));
    let added = 0;
    for (const item of newItems) {
      if (!item.profilePath || seen.has(item.profilePath)) continue;
      seen.add(item.profilePath);
      queue.push({
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        status: 'new',
        draftMessage: '',
        ...item,
      });
      added++;
    }
    await storageSet(STORAGE_KEYS.CONNECTIONS_QUEUE, queue.slice(0, 200));
    return added;
  });
}

export async function updateConnection(id, patch) {
  return withStorageLock(STORAGE_KEYS.CONNECTIONS_QUEUE, async () => {
    const queue = (await storageGet(STORAGE_KEYS.CONNECTIONS_QUEUE)) || [];
    await storageSet(STORAGE_KEYS.CONNECTIONS_QUEUE, queue.map(q => (q.id === id ? { ...q, ...patch } : q)));
  });
}

export async function clearConnectionsQueue() {
  return withStorageLock(STORAGE_KEYS.CONNECTIONS_QUEUE, () => storageRemove(STORAGE_KEYS.CONNECTIONS_QUEUE));
}

// ─── Content Calendar (friend-sync + trending, draft-only) ──────────────────
// Item shape: { id, day, stream:'friend'|'trending', status:'draft'|'edited'|'posted',
//   postText, suggestedTime, timezoneLabel, timestamp,
//   sourceFriendPostText?, sourceFriendPostDate?, trendTopic? }

export async function getCalendarPosts() {
  const stored = await storageGet(STORAGE_KEYS.CONTENT_CALENDAR);
  return stored || [];
}

export async function saveCalendarPosts(items) {
  return withStorageLock(STORAGE_KEYS.CONTENT_CALENDAR, () => storageSet(STORAGE_KEYS.CONTENT_CALENDAR, items || []));
}

/** Append newly generated posts (one per day). Returns the number added. */
export async function addCalendarPosts(newItems) {
  return withStorageLock(STORAGE_KEYS.CONTENT_CALENDAR, async () => {
    const posts = (await storageGet(STORAGE_KEYS.CONTENT_CALENDAR)) || [];
    let added = 0;
    for (const item of newItems) {
      posts.push({
        id: crypto.randomUUID(),
        status: 'draft',
        timestamp: Date.now(),
        ...item,
      });
      added++;
    }
    posts.sort((a, b) => (a.day || 0) - (b.day || 0));
    await storageSet(STORAGE_KEYS.CONTENT_CALENDAR, posts);
    return added;
  });
}

export async function updateCalendarPost(id, patch) {
  return withStorageLock(STORAGE_KEYS.CONTENT_CALENDAR, async () => {
    const posts = (await storageGet(STORAGE_KEYS.CONTENT_CALENDAR)) || [];
    await storageSet(STORAGE_KEYS.CONTENT_CALENDAR, posts.map(p => (p.id === id ? { ...p, ...patch } : p)));
  });
}

export async function deleteCalendarPost(id) {
  return withStorageLock(STORAGE_KEYS.CONTENT_CALENDAR, async () => {
    const posts = (await storageGet(STORAGE_KEYS.CONTENT_CALENDAR)) || [];
    await storageSet(STORAGE_KEYS.CONTENT_CALENDAR, posts.filter(p => p.id !== id));
  });
}

export async function clearCalendar() {
  await withStorageLock(STORAGE_KEYS.CONTENT_CALENDAR, () => storageRemove(STORAGE_KEYS.CONTENT_CALENDAR));
  await withStorageLock(STORAGE_KEYS.CALENDAR_BATCH_CONFIG, () => storageRemove(STORAGE_KEYS.CALENDAR_BATCH_CONFIG));
}

export async function getCalendarBatchConfig() {
  const stored = await storageGet(STORAGE_KEYS.CALENDAR_BATCH_CONFIG);
  return stored || null;
}

export async function saveCalendarBatchConfig(config) {
  return withStorageLock(STORAGE_KEYS.CALENDAR_BATCH_CONFIG, () => storageSet(STORAGE_KEYS.CALENDAR_BATCH_CONFIG, config));
}

/**
 * Serialized read-modify-write of the calendar batch config — used to CLAIM a
 * friend post atomically so two concurrent generations never use the same
 * source. `mutator(config)` mutates in place and returns a value; return
 * `false` to skip the write. Resolves with the mutator's return value
 * (`null` config is passed through when no batch exists).
 */
export async function updateCalendarBatchConfig(mutator) {
  return withStorageLock(STORAGE_KEYS.CALENDAR_BATCH_CONFIG, async () => {
    const config = (await storageGet(STORAGE_KEYS.CALENDAR_BATCH_CONFIG)) || null;
    const result = await mutator(config);
    if (config && result !== false) await storageSet(STORAGE_KEYS.CALENDAR_BATCH_CONFIG, config);
    return result;
  });
}

// ─── Identity ──────────────────────────────────────────────────────────────

export async function getMyIdentity() {
  const [name, profileUrl] = await Promise.all([
    storageGet(STORAGE_KEYS.MY_NAME),
    storageGet(STORAGE_KEYS.MY_PROFILE_URL),
  ]);
  return { name: name || null, profileUrl: profileUrl || null };
}

export async function saveMyIdentity(name, profileUrl) {
  await Promise.all([
    storageSet(STORAGE_KEYS.MY_NAME, name),
    storageSet(STORAGE_KEYS.MY_PROFILE_URL, profileUrl),
  ]);
}
