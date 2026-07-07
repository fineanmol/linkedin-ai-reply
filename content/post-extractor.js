/**
 * post-extractor.js
 * Scans the LinkedIn FEED for posts worth engaging on, and returns structured
 * post metadata for the engagement-queue pipeline.
 *
 * Read-only: this NEVER acts on LinkedIn. It only extracts what's already on
 * screen, mirroring the comment-extractor's approach but at post level.
 */

import {
  qsAll, sel, findFeedPostRoot, getPostContent, getPostActor,
  getPostEngagementApprox, isPromotedPost, getPostUrn, getPostPermalink,
  didICommentOnPost,
} from '../utils/dom-helpers.js';
import { DETECTION } from '../utils/constants.js';
import { getMyIdentityLocal } from './post-detector.js';
import logger from '../utils/logger.js';

/**
 * Extract candidate feed posts from the current page.
 * @param {Element|Document} root
 * @returns {Array<{urn,authorName,authorHeadline,profilePath,text,permalink,reactionsApprox,alreadyCommentedByMe,isPromoted}>}
 */
export function extractFeedPosts(root = document) {
  const myIdentity = getMyIdentityLocal();
  const myPath = (myIdentity.profilePath || '').toLowerCase().replace(/\/$/, '');
  const myName = (myIdentity.name || '').toLowerCase().trim();

  // Anchor top-down on the post's own commentary text (feed-commentary_),
  // then resolve each to its post root. Dedup by URN (or a text hash fallback).
  const bodies = qsAll(sel(DETECTION.POST_COMMENTARY), root);
  const seen = new Set();
  const posts = [];

  for (const body of bodies) {
    let postEl;
    try {
      postEl = findFeedPostRoot(body) || body.closest('div');
    } catch (e) {
      continue;
    }
    if (!postEl) continue;

    const urn = getPostUrn(postEl);
    const text = getPostContent(postEl) || body.textContent?.trim() || '';
    const dedupKey = urn || text.slice(0, 80);
    if (!dedupKey || seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    if (text.length < 20) continue; // too little to comment meaningfully

    const promoted = isPromotedPost(postEl);
    const { name: authorName, profilePath, headline: authorHeadline } = getPostActor(postEl);

    // Skip the user's OWN posts — the queue is for engaging with others.
    const authorPath = (profilePath || '').toLowerCase().replace(/\/$/, '');
    const isMine =
      (myPath && authorPath && authorPath === myPath) ||
      (myName && authorName && authorName.toLowerCase().trim() === myName);
    if (isMine) continue;

    posts.push({
      urn,
      authorName: authorName || 'Someone',
      authorHeadline: authorHeadline || '',
      profilePath: profilePath || null,
      text,
      permalink: getPostPermalink(postEl),
      reactionsApprox: getPostEngagementApprox(postEl), // may be null (soft signal)
      alreadyCommentedByMe: didICommentOnPost(postEl, myIdentity),
      isPromoted: promoted,
    });
  }

  logger.log(`extractFeedPosts: ${posts.length} candidate posts (from ${bodies.length} bodies)`);
  return posts;
}
