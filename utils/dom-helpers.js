/**
 * dom-helpers.js
 * LinkedIn-specific DOM utilities.
 * Centralizing these makes it easy to update when LinkedIn changes their markup.
 */

import { SELECTORS } from './constants.js';
import logger from './logger.js';

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

  return clone.innerText?.trim() || clone.textContent?.trim() || '';
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
export function getLoggedInUserName() {
  // 1. Try profile photo alt text from global nav bar
  const photo = qs(SELECTORS.NAV_IDENTITY_MODULE);
  if (photo?.alt) {
    const name = extractNameFromPhotoAlt(photo.alt);
    if (name && name.toLowerCase() !== 'me') return name;
  }

  // 2. Try quick comment box avatar image alt text (present on post detail pages, highly reliable)
  const commentAvatar = qs('.comments-quick-comment-box__avatar-image, img.comments-quick-comment-box__avatar, .comments-comment-box__avatar-image, img[class*="comment-box__avatar"], [class*="comment-box"] img, [class*="comments-quick-comment-box"] img');
  if (commentAvatar?.alt) {
    const name = extractNameFromPhotoAlt(commentAvatar.alt);
    if (name && name.toLowerCase() !== 'me') return name;
  }

  // 3. Try left sidebar identity module on home feed page
  const sidebarName = qs('.feed-identity-module__name, .feed-identity-module__actor-meta a');
  if (sidebarName?.textContent?.trim()) {
    const name = sidebarName.textContent.trim();
    if (name && name.toLowerCase() !== 'me') return name;
  }

  return null;
}

/**
 * Try to get the logged-in user's profile URL.
 */
export function getLoggedInProfileUrl() {
  // 1. Check the "me" link in global nav
  const meLink = qs('a[href*="/in/"][data-control-name="identity_welcome_message"]')
    || qs('.global-nav__me > a')
    || qs('a.global-nav__primary-link[href*="/in/"]');

  if (meLink?.href) {
    try {
      const url = new URL(meLink.href);
      return url.pathname.replace(/\/$/, ''); // e.g. "/in/username"
    } catch {}
  }

  // 2. Check sidebar profile link on home feed page
  const sidebarLink = qs('.feed-identity-module a[href*="/in/"]');
  if (sidebarLink?.href) {
    try {
      const url = new URL(sidebarLink.href);
      return url.pathname.replace(/\/$/, '');
    } catch {}
  }

  // 3. Check comment box avatar profile link
  const commentLink = qs('.comments-quick-comment-box__avatar-link, .comments-comment-box__avatar-link, a[class*="comment-box__avatar"][href*="/in/"], [class*="comment-box"] a[href*="/in/"], [class*="comments-quick-comment-box"] a[href*="/in/"]');
  if (commentLink?.href) {
    try {
      const url = new URL(commentLink.href);
      return url.pathname.replace(/\/$/, '');
    } catch {}
  }

  return null;
}

// ─── Post Utilities ────────────────────────────────────────────────────────

/**
 * Given a post container element, return the author's name.
 */
export function getPostAuthorName(postEl) {
  const nameEl = qs(SELECTORS.POST_AUTHOR_NAME, postEl)
    || qs('.update-components-actor__name span[aria-hidden="true"], .update-components-actor__name, [class*="actor__name"] span, [class*="actor__title"] span, .feed-shared-actor__title span', postEl)
    || qs('.update-components-actor__name, [class*="actor__name"], [class*="actor__title"]', postEl);
  return nameEl ? extractText(nameEl) : null;
}

/**
 * Given a post container element, return the author's profile URL path.
 */
export function getPostAuthorProfilePath(postEl) {
  const link = qs(SELECTORS.POST_AUTHOR_LINK, postEl)
    || qs('.update-components-actor__meta-link, .update-components-actor__title-link, .update-components-actor a[href*="/in/"], [class*="actor"] a[href*="/in/"]', postEl);
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

export function getCommentElementFromBar(bar) {
  const parent = bar.parentElement;
  if (!parent) return null;

  // Walk up to find the closest comment/reply element.
  // LinkedIn uses several different wrapper class conventions:
  //   - comments-comment-item  (classic)
  //   - comments-comment-entity (current as of 2024-2025)
  //   - article (generic semantic element)
  const commentEl = parent.closest('article')
    || parent.closest('.comments-comment-item')
    || parent.closest('.comments-reply-item')
    || parent.closest('[class*="comment-item"]')
    || parent.closest('[class*="reply-item"]')
    || parent.closest('[class*="comment-entity"]')   // current LinkedIn wrapper
    || parent.closest('[class*="comment-item-layout"]')
    || parent.closest('[class*="reply-item-layout"]')
    || parent;

  if (commentEl) {
    const className = commentEl.className || '';
    const isInvalid = commentEl.classList.contains('comments-comments-list')
      || commentEl.classList.contains('comments-comment-list__container')
      || (typeof className === 'string' && className.includes('loader'));
    if (!isInvalid) {
      return commentEl;
    }
  }
  return null;
}

export function getCommentElements(postEl) {
  const socialBars = qsAll('.comments-comment-social-bar, .comments-comment-item__social-bar, [class*="social-bar"]', postEl);
  const commentEls = [];
  for (const bar of socialBars) {
    const commentEl = getCommentElementFromBar(bar);
    if (commentEl && !commentEls.includes(commentEl)) {
      commentEls.push(commentEl);
    }
  }
  return commentEls;
}

/**
 * Extract structured data from a comment element.
 */
export function extractCommentData(commentEl) {
  // ── Text extraction: try many selector patterns LinkedIn has used ──────
  const textEl = qs(
    '.comments-comment-item__main-content, ' +
    '.comments-comment-item__text-content, ' +
    '.comments-reply-item__main-content, ' +
    '.comments-reply-item__text-content, ' +
    '[class*="comment-item__main-content"], ' +
    '[class*="comment-item__text-content"], ' +
    '[class*="reply-item__main-content"], ' +
    '[class*="reply-item__text-content"], ' +
    '[class*="comment-item__inline-show-more-text"], ' +
    '[class*="reply-item__inline-show-more-text"], ' +
    // Newer LinkedIn markup (2024-2025)
    '[class*="tvm-parent-container"], ' +
    'article .comments-comment-item--v2 span[dir], ' +
    '[class*="comments-comment-entity"] span[dir], ' +
    '[class*="comment-item"] span[dir="ltr"], ' +
    '[class*="comment-item"] span[dir="rtl"]',
    commentEl
  );

  const authorEl = qs(
    '.comments-post-meta__name-text, ' +
    '[class*="post-meta__name-text"], ' +
    '.comments-post-meta__name, ' +
    '[class*="post-meta__name"], ' +
    '[class*="comment-item"] a[href*="/in/"] span[aria-hidden]',
    commentEl
  );

  const tsEl = qs(
    '.comments-comment-item__timestamp, ' +
    '[class*="comment-item__timestamp"], ' +
    '.comments-comment-item__time, ' +
    '[class*="comment-item__time"], ' +
    '[class*="reply-item__timestamp"], ' +
    '[class*="reply-item__time"]',
    commentEl
  );

  const commentText = textEl ? extractText(textEl) : '';
  const authorName  = authorEl ? extractText(authorEl) : 'Unknown';
  const timestamp   = tsEl?.getAttribute('datetime') || tsEl?.textContent?.trim() || '';

  // If the text el was not found inside commentEl, the element might be
  // a social-bar sibling rather than the full comment wrapper. Try the parent.
  let resolvedText = commentText;
  if (!resolvedText && commentEl.parentElement) {
    const parentTextEl = commentEl.parentElement.querySelector(
      '.comments-comment-item__main-content, ' +
      '[class*="comment-item__main-content"], ' +
      'section[class*="comment-entity"] span[dir]'
    );
    if (parentTextEl) resolvedText = extractText(parentTextEl);
  }

  // Also try: any span[dir] inside a section sibling (handles comment-entity layout)
  if (!resolvedText) {
    const siblingSection = commentEl.parentElement?.querySelector(
      'section[class*="comment-entity__content"], [class*="comment-entity__content"]'
    );
    if (siblingSection) {
      const spanDir = siblingSection.querySelector('span[dir], .comments-comment-item__main-content');
      if (spanDir) resolvedText = extractText(spanDir);
    }
  }

  // ── ID generation: stable, per-comment unique key ─────────────────────
  let liarId = commentEl.dataset?.liarId;

  if (!liarId) {
    liarId = commentEl.dataset?.id || commentEl.id || '';

    if (!liarId) {
      const textSnippet   = resolvedText.slice(0, 80);
      const authorSnippet = authorName.slice(0, 30);
      const hashSource    = textSnippet || authorSnippet;
      if (hashSource) {
        try {
          liarId = btoa(encodeURIComponent(hashSource)).replace(/[^a-zA-Z0-9]/g, '').slice(0, 20);
        } catch {
          liarId = '';
        }
      }
    }

    if (!liarId) {
      const siblings = commentEl.closest(
        '.comments-comments-list, [class*="comments-list"]'
      )?.querySelectorAll(
        '.comments-comment-item, .comments-reply-item, [class*="comment-item"], [class*="comment-entity"], article'
      );
      const idx = siblings ? [...siblings].indexOf(commentEl) : -1;
      liarId = `comment-${idx >= 0 ? idx : Math.random().toString(36).slice(2, 9)}`;
    }

    try { commentEl.dataset.liarId = liarId; } catch { /* read-only in some contexts */ }
  }

  return {
    element: commentEl,
    text: resolvedText,
    authorName,
    timestamp,
    id: liarId,
  };
}

// ─── Closest Post ─────────────────────────────────────────────────────────

/**
 * Given any element inside a LinkedIn feed, walk up to find the post container.
 */
export function findAncestorPost(el) {
  return el.closest(SELECTORS.POST_CONTAINER)
    || el.closest('.feed-shared-update-v2')
    || el.closest('[data-id]');
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
