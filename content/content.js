/**
 * content.js — Main Content Script Entry Point
 * Bootstraps all content-side modules.
 * Uses MutationObserver to handle LinkedIn's SPA navigation and dynamic content loading.
 */

import { refreshMyIdentity, isMyPost, getMyIdentityLocal } from './post-detector.js';
import { extractComments, extractPostContent } from './comment-extractor.js';
import { injectReplyButton, closeAllPanels } from './ui-injector.js';
import { getSettings } from '../utils/storage.js';
import { getCommentElementFromBar } from '../utils/dom-helpers.js';
import logger, { setDebugMode } from '../utils/logger.js';
import { MSG } from '../utils/constants.js';

// ─── State ─────────────────────────────────────────────────────────────────

let isEnabled = true;
let _mainObserver = null;
let _lastUrl = location.href;

// ─── Init ──────────────────────────────────────────────────────────────────

async function init() {
  try {
    logger.log('init() starting');
    const settings = await getSettings();
    logger.log('settings loaded:', settings);
    isEnabled = settings.enabled !== false;
    setDebugMode(settings.debugMode);

    if (!isEnabled) {
      logger.log('Extension is disabled. Skipping init.');
      return;
    }

    logger.info('LinkedIn AI Reply Assistant — content script loaded');

    // Detect identity
    logger.log('calling refreshMyIdentity()');
    await refreshMyIdentity();
    logger.log('refreshMyIdentity() completed');

    // Also save identity to storage for use by background worker
    const { name, profilePath } = getMyIdentityLocal();
    logger.log('my identity local:', name, profilePath);
    if (name) {
      chrome.runtime.sendMessage({
        type: 'SAVE_IDENTITY',
        payload: { name, profileUrl: profilePath },
      }).catch((err) => logger.error('SAVE_IDENTITY message failed:', err));
    }

    // Scan existing posts
    logger.log('scanning and processing existing posts');
    scanAndProcess();
    logger.log('scanAndProcess() completed');

    // Watch for new posts / comments loaded dynamically
    startObserver();
    logger.log('MutationObserver started');

    // Watch for SPA navigation (LinkedIn is a SPA)
    watchNavigation();
    logger.log('watchNavigation() active');
  } catch (err) {
    logger.error('CRITICAL ERROR DURING INIT:', err);
  }
}

// ─── Post & Comment Processing ─────────────────────────────────────────────

function debugLogCommentsSection(postEl) {
  const commentsSection = postEl.querySelector('.comments-comments-list, [class*="comments-list"]');
  if (!commentsSection) {
    logger.log('debugLogCommentsSection: comments section container not found in post');
    return;
  }
  logger.log('debugLogCommentsSection: comments section container found. Tag:', commentsSection.tagName, 'Class:', commentsSection.className);
  const children = commentsSection.querySelectorAll('*');
  const classNames = new Set();
  children.forEach(c => {
    if (c.className && typeof c.className === 'string') {
      c.className.split(/\s+/).forEach(cls => {
        if (cls.includes('comment')) classNames.add(cls);
      });
    }
  });
  logger.log('debugLogCommentsSection: comment-related classes inside comments section:', [...classNames]);
}

function scanAndProcess() {
  const allPosts = document.querySelectorAll(
    '.feed-shared-update-v2, [data-id*="urn:li:activity"], .occludable-update'
  );
  logger.log('scanAndProcess: total posts on page =', allPosts.length);

  for (const postEl of allPosts) {
    const isMine = isMyPost(postEl);
    if (!isMine) continue;
    logger.log('scanAndProcess: found my post!', postEl);
    processPost(postEl);
  }
}

function processPost(postEl) {
  if (postEl.dataset.liarProcessed) {
    logger.log('processPost: post already processed');
    return;
  }
  postEl.dataset.liarProcessed = '1';

  logger.log('processPost: starting processing on post');
  debugLogCommentsSection(postEl);

  const postContent = extractPostContent(postEl);
  const comments = extractComments(postEl);
  logger.log('processPost: extracted comments count =', comments.length);

  for (const comment of comments) {
    logger.log('processPost: injecting reply button into comment:', comment.id);
    injectReplyButton(comment.element, postContent);
  }

  // Also watch for new comments loading within this post
  watchPostForNewComments(postEl, postContent);
}

function watchPostForNewComments(postEl, postContent) {
  const commentsSection = postEl.querySelector(
    '.comments-comments-list, [class*="comments-list"]'
  );
  if (!commentsSection) {
    logger.log('watchPostForNewComments: commentsSection container not present yet');
    return;
  }

  logger.log('watchPostForNewComments: starting observer on comments section');
  const observer = new MutationObserver(() => {
    logger.log('watchPostForNewComments: mutation detected in comments section');
    const comments = extractComments(postEl);
    for (const comment of comments) {
      injectReplyButton(comment.element, postContent);
    }
  });

  observer.observe(commentsSection, { childList: true, subtree: true });
}

// ─── Main MutationObserver ─────────────────────────────────────────────────

function startObserver() {
  if (_mainObserver) _mainObserver.disconnect();

  _mainObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== Node.ELEMENT_NODE) continue;

        // Check if the added node is a post or contains posts
        const posts = node.matches?.('.feed-shared-update-v2, [data-id*="urn:li:activity"]')
          ? [node]
          : [...(node.querySelectorAll?.('.feed-shared-update-v2, [data-id*="urn:li:activity"]') || [])];

        for (const postEl of posts) {
          if (isMyPost(postEl)) {
            logger.log('MutationObserver: matched added post:', postEl);
            processPost(postEl);
          }
        }

        // Find social bars to locate comments
        const socialBarSelector = '.comments-comment-social-bar, .comments-comment-item__social-bar, [class*="social-bar"]';
        const bars = node.matches?.(socialBarSelector)
          ? [node]
          : [...(node.querySelectorAll?.(socialBarSelector) || [])];

        const commentEls = [];
        for (const bar of bars) {
          const commentEl = getCommentElementFromBar(bar);
          if (commentEl && !commentEls.includes(commentEl)) {
            commentEls.push(commentEl);
          }
        }

        if (commentEls.length > 0) {
          logger.log('MutationObserver: comment elements detected. Count =', commentEls.length);
        }

        for (const commentEl of commentEls) {
          const postEl = commentEl.closest('.feed-shared-update-v2, [data-id*="urn:li:activity"], .occludable-update');
          if (postEl && isMyPost(postEl)) {
            const postContent = extractPostContent(postEl);
            injectReplyButton(commentEl, postContent);
          }
        }
      }
    }
  });

  _mainObserver.observe(document.body, { childList: true, subtree: true });
  logger.log('Content: MutationObserver started');
}

// ─── SPA Navigation Watcher ────────────────────────────────────────────────

function watchNavigation() {
  // LinkedIn uses pushState navigation
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

  logger.log('Content: navigation detected →', newUrl);
  closeAllPanels();

  // Re-detect identity (might have navigated to profile page)
  refreshMyIdentity();
  const { name, profilePath } = getMyIdentityLocal();
  if (name) {
    chrome.runtime.sendMessage({
      type: 'SAVE_IDENTITY',
      payload: { name, profileUrl: profilePath },
    }).catch(() => {});
  }

  // Re-scan after a brief delay to let the new page render
  setTimeout(() => {
    // Reset processed flags
    document.querySelectorAll('[data-liar-processed]').forEach(el => {
      delete el.dataset.liarProcessed;
    });
    scanAndProcess();
  }, 1500);
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
      } else {
        scanAndProcess();
        startObserver();
      }
    }
    if (typeof debugMode === 'boolean') setDebugMode(debugMode);
  }
});

// ─── Boot ──────────────────────────────────────────────────────────────────

// Wait for the DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
