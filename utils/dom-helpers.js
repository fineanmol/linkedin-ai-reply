/**
 * dom-helpers.js
 * LinkedIn-specific DOM utilities.
 * Centralizing these makes it easy to update when LinkedIn changes their markup.
 */

import { SELECTORS, DETECTION, REPLY_WORDS as REPLY_WORDS_LIST } from './constants.js';
import logger from './logger.js';

// Set form of the localized "Reply" words (fast lookup), sourced from the
// single central list in constants.js.
const REPLY_WORDS = new Set(REPLY_WORDS_LIST);

// Join a DETECTION fallback list into a single querySelector string.
function sel(list) {
  return list.join(', ');
}

// ─── Safe Query Helpers ────────────────────────────────────────────────────

export function qs(selector, root = document) {
  try {
    return root.querySelector(selector);
  } catch (e) {
    logger.warn('qs failed for selector:', selector, e);
    return null;
  }
}

export function qsAll(selector, root = document) {
  try {
    return [...root.querySelectorAll(selector)];
  } catch (e) {
    logger.warn('qsAll failed for selector:', selector, e);
    return [];
  }
}

// ─── Text Extraction ───────────────────────────────────────────────────────

/**
 * Extract clean text from a LinkedIn text element.
 * LinkedIn wraps text in nested spans; this collapses it to plain text.
 */
export function extractText(element) {
  if (!element) return '';
  const clone = element.cloneNode(true);
  
  // Remove see more / see less elements
  clone.querySelectorAll(
    '.feed-shared-inline-show-more-text__see-more-less-toggle, ' +
    '[class*="see-more-less-toggle"], ' +
    '[class*="show-more-text__see-more-less-toggle"]'
  ).forEach(el => el.remove());

  // Also remove any buttons or links with text matching see more/less
  clone.querySelectorAll('button, a, [role="button"]').forEach(el => {
    const text = el.textContent?.toLowerCase() || '';
    if (
      text.includes('see more') ||
      text.includes('see less') ||
      text.includes('show less') ||
      text.includes('see translation')
    ) {
      el.remove();
    }
  });

  return clone.textContent?.trim() || '';
}

/**
 * Helper to dispatch mouse and pointer events to simulate a real user click.
 */
function simulateClick(el) {
  try {
    const opts = { bubbles: true, cancelable: true, view: window };
    el.dispatchEvent(new PointerEvent('pointerover', opts));
    el.dispatchEvent(new PointerEvent('pointerenter', opts));
    el.dispatchEvent(new PointerEvent('pointerdown', opts));
    el.dispatchEvent(new MouseEvent('mousedown', opts));
    el.focus?.();
    el.dispatchEvent(new PointerEvent('pointerup', opts));
    el.dispatchEvent(new MouseEvent('mouseup', opts));
    el.dispatchEvent(new MouseEvent('click', opts));
  } catch (e) {
    logger.warn('simulateClick failed, falling back to direct .click():', e);
    try {
      el.click();
    } catch (clickErr) {
      logger.warn('Fallback click failed:', clickErr);
    }
  }
}

/**
 * Programmatically clicks any "see more", "see translation", or "show more" buttons
 * inside the element to load/expand the full text content.
 * Polls for DOM/text updates up to 1500ms before resolving.
 */
export async function expandSeeMore(element) {
  if (!element) return;

  const findSeeMoreButtons = (el) => {
    const buttons = [
      ...el.querySelectorAll(
        '.feed-shared-inline-show-more-text__see-more-less-toggle, ' +
        '[class*="show-more-text__see-more-less-toggle"], ' +
        '[class*="show-more-text__see-more"], ' +
        '[class*="inline-show-more-text__see-more"], ' +
        'button.see-more, button.show-more, ' +
        'button[aria-label*="see more" i], button[aria-label*="show more" i]'
      )
    ];

    // Also check all buttons, anchors, and role="button" elements for text matches
    const allButtons = el.querySelectorAll('button, a, [role="button"]');
    for (const btn of allButtons) {
      const text = btn.textContent?.toLowerCase() || '';
      if (text.includes('see more') || text.includes('show more') || text.includes('see translation')) {
        if (!buttons.includes(btn)) {
          buttons.push(btn);
        }
      }
    }
    return buttons;
  };

  const seeMoreButtons = findSeeMoreButtons(element);
  if (seeMoreButtons.length === 0) return;

  const initialTextLen = element.textContent?.length || 0;
  logger.log(`expandSeeMore: clicking ${seeMoreButtons.length} see-more buttons. Initial text length: ${initialTextLen}`);

  for (const btn of seeMoreButtons) {
    simulateClick(btn);
  }

  // Poll for up to 1500ms checking if either:
  // 1. All see-more buttons are gone or hidden.
  // 2. The text content has grown significantly (e.g. by 15+ characters).
  const startTime = Date.now();
  const maxWait = 1500;

  while (Date.now() - startTime < maxWait) {
    const remainingButtons = findSeeMoreButtons(element).filter(btn => {
      return btn.isConnected && (btn.offsetWidth > 0 || btn.offsetHeight > 0);
    });

    const currentTextLen = element.textContent?.length || 0;

    if (remainingButtons.length === 0 || currentTextLen > initialTextLen + 15) {
      logger.log(`expandSeeMore: Expansion detected! Remaining buttons: ${remainingButtons.length}, text length grew from ${initialTextLen} to ${currentTextLen}. Wait time: ${Date.now() - startTime}ms`);
      break;
    }

    await new Promise(resolve => setTimeout(resolve, 50));
  }
}


// ─── LinkedIn Identity ─────────────────────────────────────────────────────

/**
 * Helper to clean up user display name from a profile photo's alt text.
 */
export function extractNameFromPhotoAlt(alt) {
  if (!alt) return null;
  let cleaned = alt.trim();
  const patterns = [
    /Add a comment as (.+)/i,
    /Comment as (.+)/i,
    /Reply as (.+)/i,
    /Post as (.+)/i,
    /Post update as (.+)/i,
    /View (.+?)'s profile/i,
    /(.+?)'s profile picture/i,
    /Photo of (.+?)/i,
    /Picture of (.+?)/i
  ];
  for (const pattern of patterns) {
    const match = cleaned.match(pattern);
    if (match) return match[1].trim();
  }
  // Fallback cleanup of common words
  cleaned = cleaned.replace(/profile picture/i, '')
                   .replace(/profile/i, '')
                   .replace(/photo of/i, '')
                   .replace(/picture of/i, '')
                   .replace(/add a comment as/i, '')
                   .replace(/comment as/i, '')
                   .replace(/reply as/i, '')
                   .replace(/post as/i, '')
                   .replace(/'s/g, '')
                   .trim();
  return cleaned || null;
}

/**
 * Try to get the logged-in user's name from multiple DOM cues.
 */
export function getLoggedInProfileUrl() {
  // 1. Look for any link containing "/in/" inside the navigation bar/header
  const navElement = document.querySelector('header, nav, [role="navigation"]');
  const navLinks = navElement ? navElement.querySelectorAll('a[href*="/in/"]') : [];
  for (const link of navLinks) {
    try {
      const url = new URL(link.href);
      const path = url.pathname.replace(/\/$/, '');
      if (path && path.startsWith('/in/') && !path.includes('/in/feed') && !path.includes('/in/contacts') && !path.includes('/in/search')) {
        return path;
      }
    } catch {}
  }

  // 2. Fallback: look at links outside feed and check if they are in left sidebar
  const links = document.querySelectorAll('a[href*="/in/"]');
  for (const link of links) {
    // Skip links inside posts or comments
    if (link.closest('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, .occludable-update, article')) {
      continue;
    }
    // Skip links inside right-hand widgets
    if (link.closest('[class*="aside"], [class*="right-rail"], [class*="sidebar-right"]')) {
      continue;
    }
    try {
      const url = new URL(link.href);
      const path = url.pathname.replace(/\/$/, '');
      if (path && path.startsWith('/in/') && !path.includes('/in/feed') && !path.includes('/in/contacts') && !path.includes('/in/search')) {
        return path;
      }
    } catch {}
  }

  // 3. Fallback: Check comment box avatar profile link
  const commentLink = qs('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"]');
  if (commentLink?.href) {
    try {
      const url = new URL(commentLink.href);
      return url.pathname.replace(/\/$/, '');
    } catch {}
  }

  return null;
}

export function getLoggedInUserName() {
  // A LinkedIn display name is short (≤~60 chars). Anything longer means we
  // over-captured a headline/bio, so reject it.
  const looksLikeName = (s) => s && s.toLowerCase() !== 'me' && s.length <= 60 && !s.includes('|');

  const profileUrl = getLoggedInProfileUrl();
  if (profileUrl) {
    // Find all links to this profile URL and extract name
    const links = document.querySelectorAll(`a[href*="${profileUrl}"]`);
    for (const link of links) {
      // 1. Image alt is the cleanest source (e.g. "View Anmol Agarwal's profile")
      const img = link.querySelector('img[alt]');
      if (img?.alt) {
        const name = extractNameFromPhotoAlt(img.alt);
        if (looksLikeName(name)) return name;
      }
      // 2. First non-hidden leaf span — avoids grabbing headline/location that
      //    live in sibling <p> elements inside the same link.
      const firstSpan = link.querySelector('span:not([aria-hidden="true"])');
      const spanText = firstSpan?.textContent?.trim();
      if (looksLikeName(spanText)) return spanText;
      // 3. Fall back to full text only if it's short enough to be a name.
      const text = extractText(link);
      if (looksLikeName(text)) return text;
    }
  }

  // 1. Try profile photo alt text from global nav bar or header
  const navElement = document.querySelector('header, nav, [role="navigation"]');
  const imgs = navElement ? navElement.querySelectorAll('img[alt]') : document.querySelectorAll('img[alt]');
  for (const img of imgs) {
    const name = extractNameFromPhotoAlt(img.alt);
    if (name && name.toLowerCase() !== 'me') return name;
  }

  // 2. Try left sidebar identity module on home feed page
  const sidebarName = qs('.feed-identity-module__name, .feed-identity-module__actor-meta a');
  if (sidebarName?.textContent?.trim()) {
    const name = sidebarName.textContent.trim();
    if (name && name.toLowerCase() !== 'me') return name;
  }

  return null;
}

// ─── Post Utilities ────────────────────────────────────────────────────────

/**
 * Given a post container element, return the author's name.
 */
export function getPostAuthorName(postEl) {
  const link = postEl.querySelector('a[href*="/in/"]');
  if (!link) {
    const nameEl = qs(SELECTORS.POST_AUTHOR_NAME, postEl)
      || qs('.update-components-actor__name span[aria-hidden="true"], .update-components-actor__name', postEl);
    return nameEl ? extractText(nameEl) : null;
  }
  const text = extractText(link);
  if (text) return text;
  return link.textContent?.trim() || null;
}

/**
 * Given a post container element, return the author's profile URL path.
 */
export function getPostAuthorProfilePath(postEl) {
  const link = postEl.querySelector('a[href*="/in/"]');
  if (!link?.href) return null;
  try {
    const url = new URL(link.href);
    return url.pathname.replace(/\/$/, '');
  } catch {
    return null;
  }
}

/**
 * Extract the post's main text content.
 */
export function getPostContent(postEl) {
  const contentEl = qs(SELECTORS.POST_CONTENT, postEl)
    || qs('[data-test-id="main-feed-activity-card__commentary"]', postEl)
    || qs('.update-components-text', postEl);
  return contentEl ? extractText(contentEl) : '';
}

// ─── Comment Utilities ─────────────────────────────────────────────────────

// ─── Comment Detection (2026 LinkedIn DOM) ────────────────────────────────
// LinkedIn now uses fully obfuscated CSS class names.
// We anchor detection on stable attributes instead.

/**
 * Find the button inside `el` whose VISIBLE text is exactly "Reply".
 * Checks span children to avoid matching aria-hidden spans.
 */
/**
 * Does this text look like a "Reply" action label?
 * Matches exact words AND aria-labels like "Reply to Anmol's comment"
 * (LinkedIn's 2026 buttons often use a descriptive aria-label, not bare "Reply").
 */
export function isReplyLabel(raw) {
  if (!raw) return false;
  const t = raw.trim().toLowerCase();
  if (!t) return false;
  if (REPLY_WORDS.has(t)) return true;
  // aria-label form: "reply to X's comment", "répondre à …", etc.
  // Match a reply word as the first token to avoid false positives.
  const firstToken = t.split(/[\s'’]/)[0];
  return REPLY_WORDS.has(firstToken);
}

export function findReplyButtonIn(el) {
  if (!el) return null;
  const buttons = el.querySelectorAll('button, [role="button"]');

  for (const btn of buttons) {
    // Strategy 1: Check non-hidden leaf spans
    const visibleSpans = btn.querySelectorAll('span:not([aria-hidden="true"])');
    for (const span of visibleSpans) {
      if (isReplyLabel(span.textContent)) return btn;
    }
    // Strategy 2: Check the full button text (for simple <button>Reply</button>)
    if (isReplyLabel(btn.textContent)) return btn;
    // Strategy 3: Check aria-label (handles "Reply to <name>'s comment")
    if (isReplyLabel(btn.getAttribute('aria-label'))) return btn;
  }
  return null;
}

/**
 * Starting from a text anchor (data-testid="expandable-text-box" or
 * componentkey^="comment-commentary_"), walk UP the DOM to find the
 * smallest ancestor that contains BOTH:
 *   1. A profile link  → a[href*="/in/"]
 *   2. A "Reply" button → found via findReplyButtonIn()
 *
 * This gives us the comment root wrapper regardless of class names.
 */
export function findCommentWrapperFromEl(el) {
  if (!el) return null;
  // First, check if the closest article or comment container matches
  const candidate = el.closest('article, .comments-comment-item, [class*="comment-item"], [class*="comment-entity"]');
  if (candidate) {
    const hasProfileLink = !!candidate.querySelector('a[href*="/in/"]');
    const hasReplyButton = !!findReplyButtonIn(candidate);
    if (hasProfileLink && hasReplyButton) return candidate;
  }

  // Fallback: walk up carefully, increase depth to 15 because comment card wrappers
  // can be nested divs without semantic classes.
  let current = el.parentElement;
  for (let depth = 0; depth < 15 && current && current !== document.body; depth++) {
    if (current === candidate) {
      current = current.parentElement;
      continue;
    }
    // Stop if we hit a major page section to avoid expensive sub-tree scans
    if (current.tagName === 'BODY' || current.tagName === 'HTML' || current.id === 'app-container') {
      break;
    }
    const hasProfileLink = !!current.querySelector('a[href*="/in/"]');
    if (hasProfileLink) {
      const hasReplyButton = !!findReplyButtonIn(current);
      if (hasReplyButton) return current;
    }
    current = current.parentElement;
  }
  return null;
}

/**
 * Find the action bar container within a comment element.
 *
 * Anchors on the Reply button, then walks UP to the real action-row wrapper.
 * LinkedIn's 2026 DOM often wraps the Reply button in a tight single-child
 * span/div that has `overflow:hidden` or a fixed width — appending our button
 * there makes it invisible (clipped) or zero-width. So we climb to the smallest
 * ancestor that ALSO contains a sibling action (Like / React) — i.e. the row
 * that actually holds multiple buttons — and inject there instead.
 */
export function findActionBarInComment(commentEl) {
  if (!commentEl) return null;
  const replyBtn = findReplyButtonIn(commentEl);
  if (replyBtn) {
    let current = replyBtn.parentElement;
    for (let depth = 0; depth < 4 && current && current !== commentEl; depth++) {
      // A genuine action row holds more than one interactive control
      // (Reply + Like/React/…). Once we find it, that's our bar.
      const controls = current.querySelectorAll('button, [role="button"]');
      if (controls.length >= 2) return current;
      current = current.parentElement;
    }
    // Fallback: the button's direct parent (single-action layouts)
    return replyBtn.parentElement;
  }

  // Legacy fallback for older LinkedIn DOM
  return commentEl.querySelector(
    '.comments-comment-social-bar, [class*="social-actions-bar"], [class*="social-bar"]'
  );
}

/**
 * Legacy: get comment element from a social bar element.
 * Kept for backward-compat with MutationObserver paths.
 */
export function getCommentElementFromBar(bar) {
  if (!bar) return null;
  // New strategy: walk up to find wrapper with profile link + reply button
  const wrapper = findCommentWrapperFromEl(bar);
  if (wrapper) return wrapper;

  // Legacy fallback
  const parent = bar.parentElement;
  if (!parent) return null;
  const commentEl = parent.closest('article')
    || parent.closest('.comments-comment-item')
    || parent.closest('[class*="comment-item"]')
    || parent.closest('[class*="comment-entity"]')
    || parent;
  return commentEl;
}

/**
 * Find all comment wrapper elements within a post.
 * PRIMARY strategy: anchor on data-testid / componentkey.
 * FALLBACK: legacy class-based approach.
 */
export function getCommentElements(postEl) {
  const seen = new Set();
  const commentEls = [];

  // ── Strategy 1: Bottom-up from Reply buttons ─────────────────────────────
  // Most reliable: find every <button> whose text is a localized "Reply",
  // then walk UP to find the smallest ancestor that also has a profile link.
  // This works regardless of obfuscated class names or missing data-testid.
  const allButtons = postEl ? postEl.querySelectorAll('button, [role="button"]') : [];

  for (const btn of allButtons) {
    // Check if this button is a Reply button (span text, full text, or aria-label)
    let isReply = false;
    const visibleSpans = btn.querySelectorAll('span:not([aria-hidden="true"])');
    for (const span of visibleSpans) {
      if (isReplyLabel(span.textContent)) { isReply = true; break; }
    }
    if (!isReply && isReplyLabel(btn.textContent)) isReply = true;
    if (!isReply && isReplyLabel(btn.getAttribute('aria-label'))) isReply = true;
    if (!isReply) continue;

    // Walk up to the smallest ancestor that identifies a COMMENT.
    // Priority: an ancestor containing comment-commentary_ text (uniquely a
    // comment). Fall back to an ancestor with a profile link. But NEVER return
    // the post root: if we reach an ancestor holding feed-commentary_ (the
    // post's own text) without having found a comment wrapper, bail — this
    // Reply button belongs to the post-level action bar, not a comment.
    let current = btn.parentElement;
    let wrapper = null;
    for (let i = 0; i < 15 && current && current !== postEl && current !== document.body; i++) {
      // Reached the post root without finding a comment → not a comment.
      if (current.querySelector(sel(DETECTION.POST_COMMENTARY))) break;

      if (current.querySelector(sel(DETECTION.COMMENT_COMMENTARY))) {
        wrapper = current;
        break;
      }
      // Secondary: profile link + a comment text box (not the post's).
      if (current.querySelector(sel(DETECTION.PROFILE_LINK)) &&
          current.querySelector(sel(DETECTION.EXPANDABLE_TEXT))) {
        wrapper = current;
        break;
      }
      current = current.parentElement;
    }

    if (wrapper && !seen.has(wrapper)) {
      seen.add(wrapper);
      commentEls.push(wrapper);
    }
  }

  // ── Strategy 2: Text anchor walk-up (stable attributes) ─────────────────
  if (commentEls.length === 0) {
    const textAnchors = qsAll(
      sel([...DETECTION.EXPANDABLE_TEXT, ...DETECTION.COMMENT_COMMENTARY]),
      postEl
    );
    for (const anchor of textAnchors) {
      const wrapper = findCommentWrapperFromEl(anchor);
      if (wrapper && !seen.has(wrapper)) {
        seen.add(wrapper);
        commentEls.push(wrapper);
      }
    }
  }

  // ── Strategy 3: Legacy class-based fallback ──────────────────────────────
  if (commentEls.length === 0) {
    const socialBarSelector = [
      '.comments-comment-social-bar',
      '.social-actions-bar',
      '[class*="social-actions-bar"]',
      '[class*="social-bar"]',
    ].join(', ');
    const bars = qsAll(socialBarSelector, postEl);
    for (const bar of bars) {
      const commentEl = getCommentElementFromBar(bar);
      if (commentEl && !seen.has(commentEl)) {
        seen.add(commentEl);
        commentEls.push(commentEl);
      }
    }
  }

  // ── Strategy 4: STRUCTURAL last-resort (anchor-free) ─────────────────────
  // If every text/Reply anchor above fails (LinkedIn rotated the DOM again),
  // fall back to pure structure: a comment is a small block that has a profile
  // link AND a compact row of ≥2 action controls. This has no dependency on
  // class names, data-testid, componentkey, or the word "Reply", so it keeps
  // working (degraded but alive) through a DOM rev until we ship a proper anchor.
  if (commentEls.length === 0) {
    const profileLinks = qsAll(sel(DETECTION.PROFILE_LINK), postEl);
    for (const link of profileLinks) {
      let current = link.parentElement;
      for (let i = 0; i < 10 && current && current !== postEl && current !== document.body; i++) {
        // Skip the post root (has the post's own commentary text).
        if (current.querySelector(sel(DETECTION.POST_COMMENTARY))) break;
        const controls = current.querySelectorAll('button, [role="button"]');
        const txt = current.textContent?.trim() || '';
        // A comment block: has an action row (≥2 controls) and some real text,
        // but isn't a huge container (cap text length to avoid grabbing the feed).
        if (controls.length >= 2 && txt.length > 10 && txt.length < 5000) {
          if (!seen.has(current)) { seen.add(current); commentEls.push(current); }
          break;
        }
        current = current.parentElement;
      }
    }
    if (commentEls.length > 0) {
      logger.warn('getCommentElements: primary anchors FAILED — used structural fallback (Strategy 4). LinkedIn DOM likely changed; update DETECTION anchors in constants.js.');
    }
  }

  logger.log(`getCommentElements: found ${commentEls.length} comments`);
  return commentEls;
}

// ─── Extract Comment Data ──────────────────────────────────────────────────

/**
 * Extract structured data from a comment wrapper element.
 * Uses stable anchors (data-testid, componentkey, href) instead of class names.
 */
export function extractCommentData(commentEl) {
  // ── Text: data-testid is the most stable anchor (2026) ──────────────────
  let textEl = qs('[data-testid="expandable-text-box"]', commentEl)
    || qs('[componentkey^="comment-commentary_"]', commentEl);

  // Legacy class-based fallbacks
  if (!textEl) {
    textEl = qs(
      '.comments-comment-item__main-content, ' +
      '[class*="comment-item__main-content"], ' +
      '[class*="comment-item__text-content"], ' +
      '[class*="tvm-parent-container"]',
      commentEl
    );
  }

  let resolvedText = textEl ? extractText(textEl) : '';

  // Raw innerText fallback — strip action button words (handling multiple languages)
  if (!resolvedText || resolvedText.length < 3) {
    const raw = commentEl.textContent?.trim() || '';
    const IGNORE_WORDS = new Set([
      'like', 'reply', 'react', 'see more', 'see less', '•', 'send',
      'répondre', 'antworten', 'responder', 'rispondi', 'beantwoorden', 'odpowiedz', 'yanıtla',
      'jaime', 'gefällt mir', 'me gusta', 'consiglia', 'interessante', 'reagir', 'gostei', 'उत्तर दें'
    ]);
    resolvedText = raw
      .split('\n')
      .filter(line => !IGNORE_WORDS.has(line.trim().toLowerCase()))
      .join(' ')
      .trim();
  }

  // ── Author: use profile link href text ──────────────────────────────────
  const authorLink = qs('a[href*="/in/"]', commentEl);
  // Get the visible (non-aria-hidden) name span
  const authorEl = authorLink
    ? qs('span[aria-hidden="true"]', authorLink) || authorLink
    : qs('.comments-post-meta__name-text, [class*="post-meta__name-text"]', commentEl);
  const authorName = authorEl ? extractText(authorEl) : 'Unknown';

  // ── Timestamp ────────────────────────────────────────────────────────────
  const tsEl = qs(
    '[class*="comment-item__timestamp"], [class*="reply-item__timestamp"], time',
    commentEl
  );
  const timestamp = tsEl?.getAttribute('datetime') || tsEl?.textContent?.trim() || '';

  // ── ID: prefer URN from comment link, fall back to text hash ─────────────
  let liarId = commentEl.dataset?.liarId;

  if (!liarId) {
    // Try to extract URN from a[href*="dashCommentUrn"] link
    const commentLink = qs('a[href*="dashCommentUrn"], a[href*="fsd_comment"]', commentEl);
    if (commentLink?.href) {
      const urnMatch = commentLink.href.match(/fsd_comment[^%]*(?:%3A|:)(\d+)/);
      if (urnMatch) liarId = `comment-${urnMatch[1]}`;
    }

    if (!liarId) liarId = commentEl.dataset?.id || commentEl.id || '';

    if (!liarId && resolvedText) {
      try {
        liarId = btoa(encodeURIComponent(resolvedText.slice(0, 60)))
          .replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
      } catch {
        liarId = `comment-${Math.random().toString(36).slice(2, 9)}`;
      }
    }

    if (!liarId) {
      liarId = `comment-${Math.random().toString(36).slice(2, 9)}`;
    }

    try { commentEl.dataset.liarId = liarId; } catch { /* read-only in some contexts */ }
  }

  return { element: commentEl, text: resolvedText, authorName, timestamp, id: liarId };
}

// ─── Closest Post ─────────────────────────────────────────────────────────

/**
 * Given any element inside a LinkedIn feed, walk up to find the post container.
 * 2026 DOM: post containers no longer carry data-id="urn:li:activity". The
 * activity URN now only appears inside the post (analytics hrefs, reaction
 * facepile data-testid). We walk up looking for an ancestor that contains a
 * post-commentary anchor (feed-commentary_) — that reliably marks the post root.
 */
export function findAncestorPost(el) {
  // Legacy fast paths (older DOM / detail pages that still use them)
  const legacy = el.closest(sel(DETECTION.LEGACY_POST));
  if (legacy) return legacy;

  // 2026: walk up to the smallest ancestor holding the post's own commentary
  // (feed-commentary_) — distinct from comment commentary — or an activity URN.
  const postCommentary = sel(DETECTION.POST_COMMENTARY);
  const activityUrn = sel(DETECTION.ACTIVITY_URN);
  let current = el.parentElement;
  for (let i = 0; i < 25 && current && current !== document.body; i++) {
    if (current.querySelector(postCommentary)) return current;
    if (current.querySelector(activityUrn)) return current;
    current = current.parentElement;
  }
  return null;
}


// ─── Element Visibility ────────────────────────────────────────────────────

export function isVisible(el) {
  if (!el) return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

// ─── Wait for Element ──────────────────────────────────────────────────────

/**
 * Wait for a selector to appear in the DOM (up to timeout ms).
 */
export function waitForElement(selector, root = document, timeout = 5000) {
  return new Promise((resolve) => {
    const existing = root.querySelector(selector);
    if (existing) return resolve(existing);

    const timer = setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);

    const observer = new MutationObserver(() => {
      const el = root.querySelector(selector);
      if (el) {
        clearTimeout(timer);
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(root, { childList: true, subtree: true });
  });
}

// ─── Clipboard ────────────────────────────────────────────────────────────

/**
 * Copy text to clipboard using the Clipboard API.
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    // Fallback for older browsers
    try {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      return true;
    } catch {
      return false;
    }
  }
}
