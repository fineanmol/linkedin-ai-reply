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

// ─── Settings ─────────────────────────────────────────────────────────────

// Gemini model IDs retired by Google — auto-migrate saved settings off these
// so existing users don't keep hitting 404s with a stale stored model.
const DEAD_GEMINI_MODELS = new Set([
  'gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.0-flash',
  'gemini-1.5-flash', 'gemini-1.5-pro',
]);

export async function getSettings() {
  const stored = await storageGet(STORAGE_KEYS.SETTINGS);
  const settings = { ...DEFAULT_SETTINGS, ...(stored || {}) };
  if (DEAD_GEMINI_MODELS.has(settings.geminiModel)) {
    settings.geminiModel = DEFAULT_SETTINGS.geminiModel; // → gemini-flash-latest
  }
  return settings;
}

export async function saveSettings(settings) {
  const current = await getSettings();
  await storageSet(STORAGE_KEYS.SETTINGS, { ...current, ...settings });
}

// ─── Style Profile ─────────────────────────────────────────────────────────

export async function getStyleProfile() {
  const stored = await storageGet(STORAGE_KEYS.STYLE_PROFILE);
  return {
    ...DEFAULT_STYLE_PROFILE,
    ...(stored || {}),
    fingerprint: {
      ...DEFAULT_STYLE_PROFILE.fingerprint,
      ...((stored || {}).fingerprint || {}),
    },
  };
}

export async function saveStyleProfile(profile) {
  await storageSet(STORAGE_KEYS.STYLE_PROFILE, profile);
}

/**
 * Add a new style sample to the profile, evicting oldest if over limit.
 */
export async function addStyleSample(sample) {
  const profile = await getStyleProfile();
  const newSample = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...sample,
  };
  profile.samples = [newSample, ...profile.samples].slice(0, profile.maxSamples);
  await saveStyleProfile(profile);
  return newSample;
}

// ─── Reply History ─────────────────────────────────────────────────────────

export async function getReplyHistory() {
  const stored = await storageGet(STORAGE_KEYS.REPLY_HISTORY);
  return stored || [];
}

export async function addToReplyHistory(entry) {
  const history = await getReplyHistory();
  const newEntry = {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...entry,
  };
  // Keep last 200 entries
  const updated = [newEntry, ...history].slice(0, 200);
  await storageSet(STORAGE_KEYS.REPLY_HISTORY, updated);
  return newEntry;
}

export async function clearReplyHistory() {
  await storageRemove(STORAGE_KEYS.REPLY_HISTORY);
}

// ─── Engagement Queue ────────────────────────────────────────────────────────
// Items shape: { id, urn, authorName, authorHeadline, postText, permalink,
//   draftReply, relevance, whyEngage, status: 'queued'|'done'|'skipped', timestamp }

export async function getEngagementQueue() {
  const stored = await storageGet(STORAGE_KEYS.ENGAGEMENT_QUEUE);
  return stored || [];
}

export async function saveEngagementQueue(items) {
  await storageSet(STORAGE_KEYS.ENGAGEMENT_QUEUE, items || []);
}

/**
 * Merge new items into the queue, de-duplicating by urn (or permalink).
 * Existing items are preserved; only genuinely new targets are added.
 * Returns the number of items added.
 */
export async function addToEngagementQueue(newItems) {
  const queue = await getEngagementQueue();
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
  await saveEngagementQueue(queue.slice(0, 100));
  return added;
}

export async function updateEngagementQueueItem(id, patch) {
  const queue = await getEngagementQueue();
  const updated = queue.map(q => (q.id === id ? { ...q, ...patch } : q));
  await saveEngagementQueue(updated);
}

export async function clearEngagementQueue() {
  await storageRemove(STORAGE_KEYS.ENGAGEMENT_QUEUE);
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
  const log = await getCommentsLog();
  // Dedup by urn so re-marking the same post doesn't double-count.
  if (entry.urn && log.some(l => l.urn === entry.urn)) return log;
  log.unshift({
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    ...entry,
  });
  await storageSet(STORAGE_KEYS.COMMENTS_LOG, log.slice(0, 500));
  return log;
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
  await storageRemove(STORAGE_KEYS.COMMENTS_LOG);
}

// ─── Connections Queue (welcome-message drafts) ──────────────────────────────
// Item shape: { id, profilePath, name, headline, connectedOn, draftMessage,
//   status: 'new'|'copied'|'done', timestamp }

export async function getConnectionsQueue() {
  const stored = await storageGet(STORAGE_KEYS.CONNECTIONS_QUEUE);
  return stored || [];
}

export async function saveConnectionsQueue(items) {
  await storageSet(STORAGE_KEYS.CONNECTIONS_QUEUE, items || []);
}

/** Merge new connections, de-duping by profilePath. Returns count added. */
export async function addConnections(newItems) {
  const queue = await getConnectionsQueue();
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
  await saveConnectionsQueue(queue.slice(0, 200));
  return added;
}

export async function updateConnection(id, patch) {
  const queue = await getConnectionsQueue();
  await saveConnectionsQueue(queue.map(q => (q.id === id ? { ...q, ...patch } : q)));
}

export async function clearConnectionsQueue() {
  await storageRemove(STORAGE_KEYS.CONNECTIONS_QUEUE);
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
