/**
 * ui-injector.js
 * Injects the "AI Reply" button next to each comment's action bar.
 * Tracks already-processed comments to avoid duplicate injection.
 */

import { classifyIntent } from './intent-classifier.js';
import { extractCommentData, findAncestorPost, expandSeeMore, findActionBarInComment } from '../utils/dom-helpers.js';
import { extractPostContent } from './comment-extractor.js';
import { ReplyPanel } from './reply-panel.js';
import { SELECTORS, UI } from '../utils/constants.js';
import logger from '../utils/logger.js';
import * as icons from './ui/icons.js';

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
    const raw = commentEl.textContent?.trim() || '';
    // Remove common action bar words that bleed into textContent
    const cleaned = raw
      .split('\n')
      .filter(line => !['Like', 'Reply', 'React', 'See more', 'See less', '•'].includes(line.trim()))
      .join(' ')
      .trim();
    if (cleaned.length >= 3) {
      comment.text = cleaned;
      logger.log('injectReplyButton: used raw textContent fallback, length:', cleaned.length);
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

  // Find the comment's social action bar — 2026 strategy: anchor on Reply button text
  const actionBar = findActionBarInComment(commentEl);
  logger.log('injectReplyButton: comment action bar found =', !!actionBar);
  if (!actionBar) {
    logger.log('injectReplyButton: action bar not found — could not locate Reply button in comment');
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
    ${icons.LOGO_ICON}
    <span>AI Reply</span>
  `;

  // Critical layout styles set inline so LinkedIn's stylesheet / a clipping
  // parent can't hide the button. Inline styles win the cascade without !important.
  btn.style.cssText = [
    'display:inline-flex', 'align-items:center', 'gap:5px',
    'flex:0 0 auto', 'width:auto', 'height:auto', 'min-width:max-content',
    'visibility:visible', 'opacity:1', 'overflow:visible',
    'position:relative', 'z-index:10', 'margin-left:8px',
    'vertical-align:middle', 'pointer-events:auto',
  ].join(';');

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    e.preventDefault();
    handleButtonClick(btn, commentEl);
  });

  // Append after the last action in the bar. If the immediate action bar is a
  // tight/clipping wrapper, climb one level so the button isn't cut off.
  let target = actionBar;
  const cs = getComputedStyle(actionBar);
  if ((cs.overflow === 'hidden' || cs.overflowX === 'hidden') && actionBar.parentElement) {
    target = actionBar.parentElement;
  }
  target.appendChild(btn);

  // Verify the button actually rendered with a nonzero box; if not, log loudly
  // so field failures are visible without debug mode.
  requestAnimationFrame(() => {
    const r = btn.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) {
      console.warn('[LIAR] button injected but has zero size — parent may be hidden. comment:', comment.id, 'parent:', target.className);
    } else {
      console.log(`%c[LIAR] button visible ✓ (${Math.round(r.width)}×${Math.round(r.height)}) for comment ${comment.id}`, 'color:#22c55e');
    }
  });

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
    const raw = commentEl.textContent?.trim() || '';
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
      btn.innerHTML = `
        ${icons.CHECK_ICON}
        <span>Copied!</span>
      `;
      btn.classList.add('approved');
      setTimeout(() => {
        btn.innerHTML = `
          ${icons.LOGO_ICON}
          <span>AI Reply</span>
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
