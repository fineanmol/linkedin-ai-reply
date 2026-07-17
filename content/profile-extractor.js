/**
 * profile-extractor.js
 * Scrapes a LinkedIn profile page for deep personalization of a welcome message:
 * name, headline, About text, and a couple of recent post snippets.
 *
 * Read-only. Runs only on a profile the user chose to draft for (per-click),
 * never in a batch loop — that keeps it out of LinkedIn's automation-detection
 * territory (it's a page the user could have opened themselves).
 */

import logger from '../utils/logger.js';

export function isProfilePage() {
  return /linkedin\.com\/in\//.test(location.href);
}

function longestTextIn(el, min = 40, cap = 500) {
  if (!el) return '';
  const blocks = [...el.querySelectorAll('span[aria-hidden="true"], p')]
    .map(e => e.textContent.trim())
    .filter(t => t.length >= min);
  return (blocks.sort((a, b) => b.length - a.length)[0] || '').slice(0, cap);
}

/**
 * Extract deep profile context from the CURRENT profile page.
 * @returns {{name, headline, about, recentPosts:string[]}}
 */
export function extractProfile(root = document) {
  // Name: LinkedIn no longer uses <h1> for the profile name. Prefer the page
  // title ("Name | LinkedIn"), fall back to an <h1> if present.
  let name = (document.title || '').replace(/\s*\|\s*LinkedIn.*$/i, '').trim();
  if (!name) name = root.querySelector('h1')?.textContent?.trim() || '';

  // Headline: first short descriptive line near the top of the profile that
  // isn't the name (best-effort).
  let headline = '';
  const topLines = [...root.querySelectorAll('main span, main div')]
    .slice(0, 60)
    .map(e => e.textContent.trim())
    .filter(t => t && t !== name && t.length > 5 && t.length < 160);
  headline = topLines[0] || '';

  // About: the section whose header/text starts with "About".
  let about = '';
  for (const sec of root.querySelectorAll('section')) {
    if (/(^|\s)about(\s|$)/i.test(sec.textContent.slice(0, 40))) {
      about = longestTextIn(sec, 40, 500);
      if (about) break;
    }
  }

  // Recent posts: text blocks in the Activity area (or anywhere on the profile).
  const postEls = root.querySelectorAll(
    '[componentkey^="feed-commentary_"], [data-testid="expandable-text-box"]'
  );
  const seen = new Set();
  const recentPosts = [];
  for (const el of postEls) {
    const t = (el.textContent || '').trim().replace(/\s+/g, ' ');
    if (t.length < 40) continue;
    const key = t.slice(0, 60);
    if (seen.has(key)) continue;
    seen.add(key);
    recentPosts.push(t.slice(0, 300));
    if (recentPosts.length >= 2) break; // 1-2 posts is plenty of signal
  }

  logger.log(`extractProfile: name="${name}" about=${about.length}ch posts=${recentPosts.length}`);
  return { name, headline, about, recentPosts };
}
