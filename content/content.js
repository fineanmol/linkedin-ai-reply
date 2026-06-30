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
import { injectReplyButton, closeAllPanels } from './ui-injector.js';
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
    console.log('%c[LIAR] LinkedIn AI Reply Assistant content script loaded v1.0.2', 'color: #6366f1; font-weight: bold;');
    
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

  const POST_SELECTOR = '[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update';
  const allPosts = document.querySelectorAll(POST_SELECTOR);

  for (const postEl of allPosts) {
    // Always processPost — injectReplyButton deduplicates via its own WeakSet,
    // so we safely catch new comments loaded after the initial scan.
    if (!_processedPosts.has(postEl)) {
      _processedPosts.add(postEl);
      logger.log('scanAndProcess: New post found, processing comments');
    }
    processPost(postEl);
  }
}

function processPost(postEl) {
  const postContent = extractPostContent(postEl);
  const comments = extractComments(postEl);
  for (const comment of comments) {
    injectReplyButton(comment.element, postContent);
  }
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

chrome.runtime.onMessage.addListener((message) => {
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
  }
});

// ─── Boot ──────────────────────────────────────────────────────────────────

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
