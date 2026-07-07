/**
 * post-detector.js
 * Resolves and caches the logged-in user's identity (name + profile path),
 * used to personalize the LLM prompt. (Post-ownership detection was removed —
 * the extension now assists on all posts' comments.)
 */

import { getLoggedInUserName, getLoggedInProfileUrl } from '../utils/dom-helpers.js';
import logger from '../utils/logger.js';
import { getMyIdentity, saveMyIdentity } from '../utils/storage.js';

let _cachedName = null;
let _cachedProfilePath = null;

/**
 * Refresh the cached identity of the logged-in user.
 * Call this once on page load and after navigation.
 */
export async function refreshMyIdentity() {
  try {
    logger.log('refreshMyIdentity: starting');
    // 1. Try loading from storage first (user manual settings or previously scraped)
    try {
      const saved = await getMyIdentity();
      if (saved.name) _cachedName = saved.name;
      if (saved.profileUrl) _cachedProfilePath = saved.profileUrl;
    } catch (err) {
      logger.error('PostDetector: failed to load identity from storage:', err);
    }

    // 2. Fallback/Update from DOM if missing or if name is 'Me'
    const domName = getLoggedInUserName();
    const domProfile = getLoggedInProfileUrl();

    if (domName && domName !== 'Me') {
      _cachedName = domName;
    }
    if (domProfile) {
      _cachedProfilePath = domProfile;
    }

    // Save back if we got new valid data
    if (_cachedName && _cachedName !== 'Me') {
      logger.log('refreshMyIdentity: saving identity to storage:', _cachedName, _cachedProfilePath);
      saveMyIdentity(_cachedName, _cachedProfilePath).catch((err) => {
        logger.error('PostDetector: failed to save identity to storage:', err);
      });
    }

    logger.info('PostDetector: loaded identity =', _cachedName, _cachedProfilePath);
  } catch (err) {
    logger.error('CRITICAL ERROR IN refreshMyIdentity:', err);
  }
}

/**
 * Returns the current known identity (name + profile path).
 */
export function getMyIdentityLocal() {
  return { name: _cachedName, profilePath: _cachedProfilePath };
}

// NOTE: The extension injects on ALL posts' comments (not just the user's own),
// so the previous isMyPost()/findMyPosts() ownership-detection engine has been
// removed as dead code. This module now only manages the logged-in user's
// identity, which is used to personalize the LLM prompt (userName).
