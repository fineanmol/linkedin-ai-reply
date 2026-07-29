/**
 * profile-extractor.js
 * Scrapes a LinkedIn profile for deep personalization of a welcome message:
 * name, headline, About text, and recent post snippets.
 *
 * Technique (borrowed from a maintained LinkedIn scraper): prefer STABLE TEXT
 * structure over obfuscated CSS classes, and read purpose-built sub-pages
 * (e.g. /recent-activity/all/ for posts) rather than the messy main profile.
 * Class names rotate every LinkedIn deploy; visible text and URL patterns don't.
 *
 * Read-only. Runs only on a profile the user chose to draft for (per-click),
 * never batched — it's a page the user could have opened themselves.
 */

import logger from '../utils/logger.js';

export function isProfilePage() {
  return /linkedin\.com\/in\//.test(location.href);
}

export function isActivityPage() {
  return /linkedin\.com\/in\/[^/]+\/recent-activity/i.test(location.href);
}

/**
 * Build the dedicated "recent activity / posts" URL for a profile path.
 * A clean, purpose-built page — far more reliable than hoping the main
 * profile renders the activity preview.
 */
export function activityUrlFor(profilePath) {
  const clean = String(profilePath || '').replace(/\/$/, '');
  return `https://www.linkedin.com${clean}/recent-activity/all/`;
}

/** The person's display name (page title is the most stable source). */
function profileName() {
  return (document.title || '').replace(/\s*\|\s*LinkedIn.*$/i, '').trim();
}

/**
 * Extract recent original posts from a /recent-activity/all/ page.
 * innerText-first: pull the readable text of each activity card and keep the
 * ones that look like the person's own posts (skip empty/short/UI chrome).
 * @returns {string[]}
 */
export function extractProfilePosts(root = document) {
  const posts = [];
  const seen = new Set();

  // Prefer the stable text anchors we already know; fall back to feed cards.
  const candidates = root.querySelectorAll(
    '[data-testid="expandable-text-box"], [componentkey^="feed-commentary_"], .feed-shared-update-v2'
  );
  for (const el of candidates) {
    // innerText (not textContent) — respects line breaks and skips hidden nodes.
    let t = (el.innerText || el.textContent || '').trim().replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ');
    if (t.length < 40) continue;
    // Drop obvious UI/among-reactions noise.
    if (/^(like|comment|repost|send|follow|\d+ (reactions?|comments?))\b/i.test(t)) continue;
    const key = t.slice(0, 60).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    posts.push(t.slice(0, 300));
    if (posts.length >= 3) break;
  }
  logger.log(`extractProfilePosts: ${posts.length} posts from activity page`);
  return posts;
}

/**
 * Extract profile context from the CURRENT main profile page.
 * innerText-first for durability against class churn.
 * @returns {{name, headline, about, recentPosts:string[]}}
 */
export function extractProfile(root = document) {
  const name = profileName() || root.querySelector('h1')?.textContent?.trim() || '';

  // The top-of-profile block's innerText reads as lines:
  //   Name \n Headline \n Location \n ... — the headline is the first line
  // after the name that isn't a location/degree/count. Parse from text, not
  // from a class that changes every deploy.
  let headline = '';
  const main = root.querySelector('main') || root.body || root;
  const topLines = (main.innerText || '')
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean);
  const nameIdx = topLines.findIndex(l => l === name);
  const after = nameIdx >= 0 ? topLines.slice(nameIdx + 1) : topLines;
  // A pronoun line ("She/Her", "he/him", "They/Them") commonly sits right after
  // the name — skip it, along with counts, the meta line, and degree badges.
  const isPronoun = l => /^(she|he|they|ze|xe)\s*\/\s*(her|him|them|hir|zir|xem)\b/i.test(l);
  // Exclude follower/connection COUNT lines specifically — but NOT every line
  // that starts with a digit (real headlines like "2x Founder | CEO" do).
  const isCount = l => /^\d[\d,.]*\+?\s*(followers|connections|mutual)/i.test(l);
  headline = after.find(l =>
    l.length > 5 && l.length < 160 &&
    l !== name &&
    !isPronoun(l) &&
    !isCount(l) &&
    !/(followers|connections)/i.test(l) &&      // meta line
    !/^(1st|2nd|3rd)\b/i.test(l) &&
    !/^(contact info|message|more|connect|follow)$/i.test(l)
  ) || '';

  // About: find the "About" heading in the text, take the block after it.
  let about = '';
  for (const sec of root.querySelectorAll('section')) {
    const txt = (sec.innerText || '').trim();
    if (/^about\b/i.test(txt)) {
      about = txt.replace(/^about\s*/i, '')
                 .replace(/\.{3}\s*see more\s*$/i, '')
                 .replace(/see more\s*$/i, '')
                 .trim()
                 .slice(0, 500);
      if (about.length > 30) break;
    }
  }

  // Recent posts on the MAIN profile (Activity preview) — a fallback when we
  // couldn't visit the dedicated activity page.
  const recentPosts = extractProfilePosts(root).slice(0, 2);

  logger.log(`extractProfile: name="${name}" headline=${headline.length}ch about=${about.length}ch posts=${recentPosts.length}`);
  return { name, headline, about, recentPosts };
}
