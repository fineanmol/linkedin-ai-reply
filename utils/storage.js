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

export async function getSettings() {
  const stored = await storageGet(STORAGE_KEYS.SETTINGS);
  return { ...DEFAULT_SETTINGS, ...(stored || {}) };
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
