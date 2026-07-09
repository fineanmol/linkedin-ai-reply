/**
 * topcontent-extractor.js
 * Extracts trending posts from LinkedIn's OWN curated trending page
 * (linkedin.com/top-content/<category>/). This surfaces genuinely trending
 * posts by topic — from people the user doesn't follow — using LinkedIn's own
 * public, logged-in trending data. No third-party API, no scraping violation.
 *
 * The /top-content/ DOM differs from the feed: it renders <article> cards, and
 * the post's activity URN lives inside a share link
 * (facebook.com/sharer?u=...activity:ID), NOT in a feed-commentary_ anchor.
 */

import logger from '../utils/logger.js';
import { extractNameFromPhotoAlt } from '../utils/dom-helpers.js';

/** True if the current page is a LinkedIn top-content (trending) page. */
export function isTopContentPage() {
  return /linkedin\.com\/top-content\//.test(location.href);
}

function nameFromProfilePath(path) {
  if (!path) return null;
  // "/in/terezijasemenski" → "Terezijasemenski" (best-effort fallback only)
  const slug = path.replace(/^\/in\//, '').split('-')[0].replace(/[0-9]+$/, '');
  if (!slug) return null;
  return slug.charAt(0).toUpperCase() + slug.slice(1);
}

/**
 * Extract trending posts from the current /top-content/ page.
 * @returns {Array<{urn,authorName,authorHeadline,profilePath,text,permalink,reactionsApprox,alreadyCommentedByMe,isPromoted}>}
 */
export function extractTopContentPosts(root = document) {
  const cards = [...root.querySelectorAll('article, [class*="article"]')];
  const seen = new Set();
  const posts = [];

  for (const card of cards) {
    // ── URN + permalink from the share link (the reliable id here) ──────────
    const sharer = [...card.querySelectorAll('a[href*="sharer"], a[href*="activity"]')]
      .map(a => a.getAttribute('href') || '')
      .find(h => /activity/.test(h));
    let urn = null;
    if (sharer) {
      const m = decodeURIComponent(sharer).match(/activity:(\d+)/);
      if (m) urn = `urn:li:activity:${m[1]}`;
    }

    // ── Post text: largest text block in the card ───────────────────────────
    const textEls = [...card.querySelectorAll('p, span, div')]
      .map(e => (e.innerText || '').trim())
      .filter(t => t.length > 60);
    const text = (textEls.sort((a, b) => b.length - a.length)[0] || '').slice(0, 1000);
    if (text.length < 40) continue;

    const dedupKey = urn || text.slice(0, 80);
    if (seen.has(dedupKey)) continue;
    seen.add(dedupKey);

    // ── Author name ──────────────────────────────────────────────────────
    // Primary: the actor image alt / aria-label ("View profile for Jane Doe, MSc").
    let authorName = null;
    const altSrc = card.querySelector('img[alt]')?.getAttribute('alt')
      || [...card.querySelectorAll('[aria-label]')]
           .map(e => e.getAttribute('aria-label'))
           .find(a => /view profile for/i.test(a || ''));
    const fromAlt = extractNameFromPhotoAlt(altSrc);
    if (fromAlt && fromAlt.length <= 60) authorName = fromAlt.replace(/,\s*(MSc|PhD|MBA|MD|PMP|CFA)\b.*$/i, '').trim();

    const profLink = card.querySelector('a[href*="/in/"]')?.getAttribute('href')?.split('?')[0] || null;
    const profilePath = profLink ? profLink.replace(/^https?:\/\/[^/]+/, '').replace(/\/$/, '') : null;
    if (!authorName) authorName = nameFromProfilePath(profilePath) || 'A creator';

    // Headline: a medium-length line that isn't the post body or the name.
    const headline = textEls
      .filter(t => t !== text && t.length <= 140 && t !== authorName && /[a-z]/i.test(t))
      .find(t => /\b(CEO|Founder|Engineer|Helping|Head|Lead|Director|AI|building|teach)/i.test(t)) || '';

    posts.push({
      urn,
      authorName,
      authorHeadline: headline,
      profilePath,
      text,
      permalink: urn ? `https://www.linkedin.com/feed/update/${urn}/` : null,
      reactionsApprox: null,          // not reliably shown on this page
      alreadyCommentedByMe: false,    // can't tell from this page
      isPromoted: false,              // curated editorial content, never ads
    });
  }

  logger.log(`extractTopContentPosts: ${posts.length} trending posts from ${cards.length} cards`);
  return posts;
}
