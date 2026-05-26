/**
 * ui-injector.js
 * Injects the "AI Reply" button next to each comment's action bar.
 * Tracks already-processed comments to avoid duplicate injection.
 */

import { classifyIntent } from './intent-classifier.js';
import { extractCommentData, findAncestorPost, expandSeeMore } from '../utils/dom-helpers.js';
import { extractPostContent } from './comment-extractor.js';
import { ReplyPanel } from './reply-panel.js';
import { SELECTORS, UI } from '../utils/constants.js';
import logger from '../utils/logger.js';

// Track which comments have already been processed
const processedComments = new WeakSet();
// Track open panels (commentId → ReplyPanel)
const openPanels = new Map();

/**
 * Inject AI Reply button into a comment element.
 * @param {Element} commentEl - The comment item element
 * @param {string} postContent - The post's text content
 */
export function injectReplyButton(commentEl, postContent) {
  logger.log('injectReplyButton: processing comment element', commentEl);

  if (processedComments.has(commentEl)) {
    logger.log('injectReplyButton: comment already processed (WeakSet has it)');
    return;
  }

  const comment = extractCommentData(commentEl);

  // Fallback: if selectors couldn't find the text element, grab all visible
  // text directly from the comment element (strip action buttons etc.)
  if (!comment.text || comment.text.length < 3) {
    const raw = commentEl.innerText?.trim() || '';
    // Remove common action bar words that bleed into innerText
    const cleaned = raw
      .split('\n')
      .filter(line => !['Like', 'Reply', 'React', 'See more', 'See less', '•'].includes(line.trim()))
      .join(' ')
      .trim();
    if (cleaned.length >= 3) {
      comment.text = cleaned;
      logger.log('injectReplyButton: used raw innerText fallback, length:', cleaned.length);
    }
  }

  logger.log('injectReplyButton: extracted comment data:', {
    id: comment.id,
    author: comment.authorName,
    textLength: comment.text ? comment.text.length : 0,
    text: comment.text ? comment.text.slice(0, 100) : '(empty — no text found)'
  });

  if (!comment.text || comment.text.length < 3) {
    logger.log('injectReplyButton: comment text too short, skipping');
    return;
  }

  // Find the comment's social action bar
  const actionBar = commentEl.querySelector(
    '.comments-comment-social-bar, .comments-comment-item__social-bar, [class*="social-bar"]'
  );
  logger.log('injectReplyButton: comment social action bar found =', !!actionBar);
  if (!actionBar) {
    logger.log('injectReplyButton: action bar not found, commentEl layout:', commentEl.innerHTML.slice(0, 200) + '...');
    return;
  }

  // Check if button already exists
  const existingBtn = commentEl.querySelector(SELECTORS.AI_REPLY_BUTTON);
  logger.log('injectReplyButton: AI Reply button already exists =', !!existingBtn);
  if (existingBtn) return;

  processedComments.add(commentEl);

  // Classify intent immediately
  const { intent } = classifyIntent(comment.text);

  // Create the button
  const btn = document.createElement('button');
  btn.className = SELECTORS.AI_REPLY_BUTTON.slice(1); // remove leading dot
  btn.id = `${UI.BUTTON_ID_PREFIX}${comment.id}`;
  btn.setAttribute('aria-label', 'Generate AI reply suggestion');
  btn.setAttribute('data-comment-id', comment.id);
  btn.innerHTML = `
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l8-8"/><path d="M18 2h4v4"/>
    </svg>
    AI Reply
  `;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    handleButtonClick(btn, commentEl);
  });

  // Append after the last action in the bar
  actionBar.appendChild(btn);
  logger.info('injectReplyButton: SUCCESSFULLY injected button for comment', comment.id, '| intent:', intent);
}

async function handleButtonClick(btn, commentEl) {
  const postEl = findAncestorPost(commentEl);

  // Programmatically expand "see more" if present to get full context
  await expandSeeMore(commentEl);
  if (postEl) {
    await expandSeeMore(postEl);
  }

  // Extract fresh, fully-expanded data
  const comment = extractCommentData(commentEl);
  const postContent = postEl ? extractPostContent(postEl) : '';

  // Re-apply the raw-text fallback for click-time extraction too
  if (!comment.text || comment.text.length < 3) {
    const raw = commentEl.innerText?.trim() || '';
    const cleaned = raw
      .split('\n')
      .filter(line => !['Like', 'Reply', 'React', 'See more', 'See less', '•'].includes(line.trim()))
      .join(' ')
      .trim();
    if (cleaned.length >= 3) comment.text = cleaned;
  }

  logger.log('handleButtonClick: sending to LLM →', {
    commentId: comment.id,
    author: comment.authorName,
    text: comment.text.slice(0, 120),
    postContentLength: postContent.length,
  });

  const { intent } = classifyIntent(comment.text);

  const panelId = comment.id;

  // Toggle: if panel is already open for this comment, close it
  if (openPanels.has(panelId)) {
    openPanels.get(panelId).unmount();
    openPanels.delete(panelId);
    btn.classList.remove('active');
    return;
  }

  btn.classList.add('active');

  const panel = new ReplyPanel({
    commentId: comment.id,
    commentText: comment.text,
    authorName: comment.authorName,
    postContent,
    intent,
    onClose: () => {
      openPanels.delete(panelId);
      btn.classList.remove('active');
    },
    onApprove: ({ text }) => {
      logger.log('UIInjector: reply approved for comment', panelId);
      // Visual feedback on the button
      btn.innerHTML = `✓ Copied`;
      btn.classList.add('approved');
      setTimeout(() => {
        btn.innerHTML = `
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l8-8"/><path d="M18 2h4v4"/>
          </svg>
          AI Reply
        `;
        btn.classList.remove('approved');
      }, 3000);
    },
  });

  openPanels.set(panelId, panel);
  panel.mount(commentEl);
}

/**
 * Close all open panels (e.g., on navigation).
 */
export function closeAllPanels() {
  for (const panel of openPanels.values()) {
    panel.unmount();
  }
  openPanels.clear();
}

/**
 * Remove injected buttons from a post (e.g., when a post is no longer "mine").
 */
export function removeInjectedButtons(postEl) {
  postEl?.querySelectorAll(SELECTORS.AI_REPLY_BUTTON).forEach(btn => btn.remove());
}
