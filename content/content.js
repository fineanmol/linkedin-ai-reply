/**
 * content.js — Main Content Script Entry Point
 *
 * Performance-optimized rewrite:
 * - MutationObserver is DEBOUNCED (100ms) to batch LinkedIn's rapid DOM updates.
 * - Discards heavy per-node DOM scanning in favor of a fast document scan of matching posts.
 * - Remembers user's own posts to avoid repetitive author checks.
 * - Cleans up memory automatically.
 */

import { refreshMyIdentity, getMyIdentityLocal } from './post-detector.js';
import { extractComments, extractPostContent } from './comment-extractor.js';
import { extractFeedPosts } from './post-extractor.js';
import { extractTopContentPosts, isTopContentPage } from './topcontent-extractor.js';
import { mountQueuePanel } from './queue-panel.js';
import { injectReplyButton, closeAllPanels } from './ui-injector.js';
import { findAncestorPost } from '../utils/dom-helpers.js';
import { getSettings } from '../utils/storage.js';
import logger, { setDebugMode } from '../utils/logger.js';
import { MSG } from '../utils/constants.js';

// ─── State ─────────────────────────────────────────────────────────────────

let isEnabled = true;
let _mainObserver = null;
let _lastUrl = location.href;
let _debounceTimer = null;
const _processedPosts = new Set(); // Stores DOM elements of processed posts

// ─── Init ──────────────────────────────────────────────────────────────────

async function init() {
  try {
    // Unguarded console log so developers and users can see the extension loaded
    console.log('%c[LIAR] LinkedIn AI Reply Assistant content script loaded v1.0.5', 'color: #6366f1; font-weight: bold;');
    
    const settings = await getSettings();
    isEnabled = settings.enabled !== false;
    setDebugMode(settings.debugMode);

    if (!isEnabled) {
      logger.log('Extension is disabled.');
      return;
    }

    await refreshMyIdentity();

    const { name, profilePath } = getMyIdentityLocal();
    console.log('[LIAR] Loaded identity:', { name, profilePath });

    if (name) {
      chrome.runtime.sendMessage({
        type: 'SAVE_IDENTITY',
        payload: { name, profileUrl: profilePath },
      }).catch(() => {});
    }

    // Initial scan with a small delay to let LinkedIn finish rendering
    setTimeout(scanAndProcess, 1000);

    // Mount the on-page engagement-queue launcher (bottom-right).
    setTimeout(() => mountQueuePanel(), 1200);

    startObserver();
    watchNavigation();

    // Periodically refresh identity in case it wasn't available on startup
    setInterval(async () => {
      const { name } = getMyIdentityLocal();
      if (!name || name === 'Me') {
        await refreshMyIdentity();
      }
    }, 5000);

  } catch (err) {
    logger.error('CRITICAL ERROR DURING INIT:', err);
  }
}

// ─── Post & Comment Processing ─────────────────────────────────────────────

function scanAndProcess() {
  if (!isEnabled) return;

  // Clean up disconnected posts to prevent memory leaks
  for (const postEl of _processedPosts) {
    if (!postEl.isConnected) {
      _processedPosts.delete(postEl);
    }
  }

  // LinkedIn's 2026 DOM no longer puts urn:li:activity on the post container's
  // data-id/data-urn. Post containers have only obfuscated classes now. So we
  // scan the whole document for comment wrappers directly (via Reply-button /
  // comment-text anchors) and resolve each comment's post ancestor per-comment.
  const comments = extractComments(document);

  let totalComments = 0;
  for (const comment of comments) {
    try {
      const postEl = findAncestorPost(comment.element) || document;
      const postContent = extractPostContent(postEl);
      injectReplyButton(comment.element, postContent);
      totalComments++;
    } catch (e) {
      console.warn('[LIAR] comment processing threw:', e);
    }
  }

  // Always-on health signal. comments==0 → detection anchor failing;
  // comments>0 & buttons==0 → injection failing.
  const injected = document.querySelectorAll('.liar-ai-reply-btn').length;
  console.log(
    `%c[LIAR] scan: comments=${totalComments} buttons=${injected}`,
    'color:#0a66c2;font-weight:bold'
  );

  reportDetectionHealth(totalComments);
}

// ─── Detection Health Monitor ──────────────────────────────────────────────
// Makes a future DOM break VISIBLE instead of silent. If the page clearly has
// comment infrastructure (a comment composer, or a comment thread region) yet
// we detected zero comments, our anchors have almost certainly broken — warn
// loudly, once, with a pointer to where to fix it.
let _detectionBrokenReported = false;

function reportDetectionHealth(foundComments) {
  if (foundComments > 0) {
    _detectionBrokenReported = false; // recovered; allow future warnings
    return;
  }
  // Signals that the page SHOULD have detectable comments:
  //  - a comment composer text editor, or
  //  - existing comment commentary text, or
  //  - a localized "Reply" control somewhere on the page.
  const hasCommentBox = !!document.querySelector(
    '[data-testid="ui-core-tiptap-text-editor-wrapper"], [contenteditable="true"][role="textbox"], [aria-label*="comment" i][contenteditable]'
  );
  const hasCommentText = !!document.querySelector('[componentkey^="comment-commentary_"]');

  if ((hasCommentBox || hasCommentText) && !_detectionBrokenReported) {
    _detectionBrokenReported = true;
    console.warn(
      '%c[LIAR] ⚠ Detection health: comment UI is present but 0 comments were detected. ' +
      'LinkedIn likely changed its DOM. Update the DETECTION anchors in utils/constants.js. ' +
      '(This warning fires once per page.)',
      'color:#e6a860;font-weight:bold'
    );
  }
}

function processPost(postEl) {
  const postContent = extractPostContent(postEl);
  const comments = extractComments(postEl);
  for (const comment of comments) {
    injectReplyButton(comment.element, postContent);
  }
  return comments.length;
}

// ─── Debounced MutationObserver ────────────────────────────────────────────

function startObserver() {
  if (_mainObserver) _mainObserver.disconnect();

  _mainObserver = new MutationObserver(() => {
    // Debounce: wait 100ms of silence before running the scan
    if (_debounceTimer) clearTimeout(_debounceTimer);
    _debounceTimer = setTimeout(scanAndProcess, 100);
  });

  _mainObserver.observe(document.body, { childList: true, subtree: true });
  logger.log('MutationObserver started (debounced)');
}

// ─── SPA Navigation Watcher ────────────────────────────────────────────────

function watchNavigation() {
  const originalPushState = history.pushState.bind(history);
  history.pushState = (...args) => {
    originalPushState(...args);
    onNavigate();
  };
  window.addEventListener('popstate', onNavigate);
}

async function onNavigate() {
  const newUrl = location.href;
  if (newUrl === _lastUrl) return;
  _lastUrl = newUrl;

  logger.log('Navigation detected →', newUrl);
  closeAllPanels();
  _processedPosts.clear(); // Clear cached posts on page navigation

  // LinkedIn's SPA nav can wipe our launcher from the DOM — re-mount it.
  setTimeout(() => mountQueuePanel(), 800);

  await refreshMyIdentity();
  const { name, profilePath } = getMyIdentityLocal();
  if (name) {
    chrome.runtime.sendMessage({
      type: 'SAVE_IDENTITY',
      payload: { name, profileUrl: profilePath },
    }).catch(() => {});
  }

  // Re-scan after page settles
  setTimeout(scanAndProcess, 1500);
}

// ─── Settings Change Listener ──────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'SETTINGS_CHANGED') {
    const { enabled, debugMode } = message.payload || {};
    if (typeof enabled === 'boolean') {
      isEnabled = enabled;
      if (!enabled) {
        closeAllPanels();
        _mainObserver?.disconnect();
        if (_debounceTimer) clearTimeout(_debounceTimer);
        _processedPosts.clear();
      } else {
        scanAndProcess();
        startObserver();
      }
    }
    if (typeof debugMode === 'boolean') setDebugMode(debugMode);
    return;
  }

  // Build engagement queue: extract feed posts from THIS page and hand them to
  // the background worker to score + queue. Triggered from popup/options.
  if (message.type === MSG.REQUEST_BUILD_QUEUE) {
    (async () => {
      try {
        // Pick the right extractor: LinkedIn's curated trending page uses a
        // different (article-card) DOM than the feed/hashtag/search pages.
        const posts = isTopContentPage()
          ? extractTopContentPosts(document)
          : extractFeedPosts(document);
        if (!posts.length) {
          const onLinkedIn = /linkedin\.com/.test(location.href);
          sendResponse({ ok: false, added: 0, reason: onLinkedIn ? 'no-posts-found' : 'not-on-feed' });
          return;
        }
        const resp = await chrome.runtime.sendMessage({ type: MSG.BUILD_QUEUE, payload: { posts } });
        console.log(`%c[LIAR] queue build: scanned=${resp?.scanned} added=${resp?.added}`, 'color:#0a66c2;font-weight:bold');
        sendResponse({ ok: true, ...resp });
      } catch (e) {
        console.warn('[LIAR] build queue failed:', e);
        sendResponse({ ok: false, error: e.message });
      }
    })();
    return true; // async response
  }
});

// ─── Boot ──────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
