/**
 * comment-extractor.js
 * Parses LinkedIn's comment thread DOM and returns structured comment data.
 */

import { getCommentElements, extractCommentData, getPostContent } from '../utils/dom-helpers.js';
import logger from '../utils/logger.js';

/**
 * Extract all comments from a post element.
 * @param {Element} postEl
 * @returns {Array<{ id, text, authorName, timestamp, element }>}
 */
export function extractComments(postEl) {
  const commentEls = getCommentElements(postEl);
  const comments = commentEls
    .map(el => {
      try {
        return extractCommentData(el);
      } catch (e) {
        logger.warn('Failed to extract comment:', e);
        return null;
      }
    })
    .filter(c => c && c.text.length > 0);

  logger.log(`CommentExtractor: found ${comments.length} comments`);
  return comments;
}

/**
 * Extract the post content text from a post element.
 * @param {Element} postEl
 * @returns {string}
 */
export function extractPostContent(postEl) {
  return getPostContent(postEl);
}

/**
 * Given a comment element, find its parent post element.
 * @param {Element} commentEl
 * @returns {Element|null}
 */
export function findParentPost(commentEl) {
  return commentEl.closest('.feed-shared-update-v2')
    || commentEl.closest('[data-id*="urn:li:activity"]')
    || commentEl.closest('.occludable-update');
}
