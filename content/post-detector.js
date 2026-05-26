/**
 * post-detector.js
 * Determines if a LinkedIn post was authored by the currently logged-in user.
 * Uses multiple detection strategies with graceful fallbacks.
 */

import { getLoggedInUserName, getLoggedInProfileUrl, getPostAuthorName, getPostAuthorProfilePath } from '../utils/dom-helpers.js';
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
      logger.log('refreshMyIdentity: getting identity from storage');
      const saved = await getMyIdentity();
      logger.log('refreshMyIdentity: got identity from storage:', saved);
      if (saved.name) _cachedName = saved.name;
      if (saved.profileUrl) _cachedProfilePath = saved.profileUrl;
    } catch (err) {
      logger.error('PostDetector: failed to load identity from storage:', err);
    }

    // 2. Fallback/Update from DOM if missing or if name is 'Me'
    logger.log('refreshMyIdentity: extracting name and profile URL from DOM');
    const domName = getLoggedInUserName();
    logger.log('refreshMyIdentity: domName =', domName);
    const domProfile = getLoggedInProfileUrl();
    logger.log('refreshMyIdentity: domProfile =', domProfile);

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
 * Normalizes names for comparison, stripping out emojis, pronouns (e.g. (He/Him)), punctuation, and extra whitespace.
 */
function cleanNameForComparison(name) {
  if (!name) return '';
  return name.toLowerCase()
    .replace(/\s*\([^)]+\)/g, '') // remove pronouns in parentheses like (He/Him)
    .replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '') // remove emojis
    .replace(/[^a-z0-9\s]/g, '') // remove punctuation/special chars
    .replace(/\s+/g, ' ') // collapse consecutive whitespace
    .trim();
}

/**
 * Returns the current known identity (name + profile path).
 */
export function getMyIdentityLocal() {
  return { name: _cachedName, profilePath: _cachedProfilePath };
}

/**
 * Check if a post element was authored by the logged-in user.
 * @param {Element} postEl - The post container element
 * @returns {boolean}
 */
export function isMyPost(postEl) {
  if (!postEl) return false;

  // Fallback to DOM detection if cache is empty (race condition guard)
  if (!_cachedName || _cachedName === 'Me') {
    const domName = getLoggedInUserName();
    if (domName && domName !== 'Me') {
      _cachedName = domName;
      saveMyIdentity(_cachedName, _cachedProfilePath).catch(() => {});
    }
  }
  if (!_cachedProfilePath) {
    const domProfile = getLoggedInProfileUrl();
    if (domProfile) {
      _cachedProfilePath = domProfile;
      saveMyIdentity(_cachedName, _cachedProfilePath).catch(() => {});
    }
  }

  const postAuthorPath = getPostAuthorProfilePath(postEl);
  const postAuthorName = getPostAuthorName(postEl);

  // Strategy 1: Compare profile URLs (most reliable)
  if (_cachedProfilePath && postAuthorPath) {
    const mine = _cachedProfilePath.toLowerCase().replace(/\/$/, '');
    const theirs = postAuthorPath.toLowerCase().replace(/\/$/, '');
    if (mine === theirs || theirs.startsWith(mine)) {
      logger.info('PostDetector: MATCHED by profile URL | author:', postAuthorName, '| path:', postAuthorPath);
      return true;
    }
  }

  // Strategy 2: Compare display names (less reliable — name collisions, but handles pronoun/emoji cases now)
  if (_cachedName && _cachedName !== 'Me' && postAuthorName) {
    const mineClean = cleanNameForComparison(_cachedName);
    const theirsClean = cleanNameForComparison(postAuthorName);
    if (mineClean && theirsClean && mineClean === theirsClean) {
      logger.info('PostDetector: MATCHED by name | myName:', _cachedName, '| authorName:', postAuthorName);
      return true;
    }
  }

  // Strategy 3: Look for "Edit post" or ownership signals in the post's overflow menu
  const hasEditButton = !!postEl.querySelector(
    '[aria-label*="Edit post"], [data-control-name="edit_post"], .feed-shared-update-v2__control-menu button[aria-label*="Edit"]'
  );
  if (hasEditButton) {
    logger.info('PostDetector: MATCHED by edit button presence | author:', postAuthorName);
    return true;
  }

  logger.info('PostDetector: NO MATCH for post by author:', postAuthorName, 'path:', postAuthorPath, '| my identity:', { name: _cachedName, path: _cachedProfilePath });
  return false;
}

/**
 * Scan all visible posts and return only those authored by the user.
 * @returns {Element[]}
 */
export function findMyPosts() {
  const allPosts = document.querySelectorAll('.feed-shared-update-v2, [data-id*="urn:li:activity"]');
  return [...allPosts].filter(post => isMyPost(post));
}
