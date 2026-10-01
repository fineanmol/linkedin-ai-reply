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
  return (document.title || '')
    .replace(/^\s*\(\d+\+?\)\s*/, '')          // leading notification count "(3) "
    .replace(/\s*\|\s*LinkedIn.*$/i, '')
    .trim();
}

// Post text anchors on activity / profile pages (ordered: stable first).
const POST_TEXT_SELECTOR =
  '[data-testid="expandable-text-box"], [componentkey^="feed-commentary_"], .feed-shared-update-v2';
// Anything inside one of these is a COMMENT, not the person's own post.
const COMMENT_SCOPE_SELECTOR =
  '[componentkey^="comment-commentary_"], .comments-comment-item, .comments-comment-entity, ' +
  '[class*="comments-comment-item"], [class*="comments-comment-entity"], article[class*="comments-comment"]';

/**
 * Collect post text boxes, innermost only: an element that CONTAINS another
 * matched element (e.g. a whole .feed-shared-update-v2 card wrapping its own
 * expandable-text-box) is dropped so the post isn't read twice, and its
 * comments aren't glued onto the post text. Comment text boxes are skipped.
 * @returns {Element[]}
 */
export function collectPostTextBoxes(root = document) {
  const all = Array.from(root.querySelectorAll(POST_TEXT_SELECTOR));
  return all.filter(el => {
    // Skip comment text boxes (inside a comment, or wrapping a comment body).
    if (el.closest(COMMENT_SCOPE_SELECTOR)) return false;
    if (el.matches('[data-testid="expandable-text-box"]') &&
        el.querySelector('[componentkey^="comment-commentary_"]')) return false;
    // Keep innermost: drop any element that contains another matched element.
    return !all.some(other => other !== el && el.contains(other));
  });
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
  const candidates = collectPostTextBoxes(root);
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
 * Convert LinkedIn's relative-age string ("3d", "2w", "1mo") to an approximate
 * day count. Absolute dates ("Aug 2") and anything unparseable return null —
 * this is a DISPLAY LABEL only, never used to order posts (see caller).
 */
function parseRelativeAge(s) {
  if (!s) return null;
  const m = /^(\d+)\s*(h|d|w|mo)\b/i.exec(s.trim());
  if (!m) return null;
  const n = Number(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 'h') return 0;
  if (unit === 'd') return n;
  if (unit === 'w') return n * 7;
  if (unit === 'mo') return n * 30;
  return null;
}

/**
 * Scroll the current page to trigger LinkedIn's lazy-loaded activity feed,
 * so extractProfilePostsRich() has more than the initial ~10-15 cards to read.
 * Bounded (not infinite) — this runs in a hidden background tab, once, per
 * calendar-batch generation, never on a loop or timer.
 */
export async function autoScrollForMorePosts({ rounds = 6, waitMs = 900 } = {}) {
  for (let i = 0; i < rounds; i++) {
    window.scrollTo(0, document.body.scrollHeight);
    await new Promise(r => setTimeout(r, waitMs));
  }
  window.scrollTo(0, 0);
}

/**
 * Best-effort reaction/comment/repost counts from a post card's own text.
 * LinkedIn renders these as lines like "1,223 Jane Doe and 1,222 others",
 * "49 comments", "139 reposts" near the action bar — parsed from whichever
 * of these substrings are present; anything not found stays null (never
 * blocks extraction or generation, purely a display aid for post selection).
 */
function parseEngagement(cardLines) {
  const joined = cardLines.join(' ');
  const reactionsMatch = joined.match(/([\d,]+)\s+\S+.*?\bothers?\b/i) || joined.match(/^([\d,]+)\s*(reactions?|likes?)\b/i);
  const commentsMatch = joined.match(/([\d,]+)\s*comments?\b/i);
  const repostsMatch = joined.match(/([\d,]+)\s*reposts?\b/i);
  const toNum = (m) => (m ? Number(m[1].replace(/,/g, '')) : null);
  return {
    reactions: toNum(reactionsMatch),
    comments: toNum(commentsMatch),
    reposts: toNum(repostsMatch),
  };
}

/**
 * Best-effort image/GIF URL from a post card, for display when picking which
 * posts to reuse (the user still posts manually — this is never uploaded
 * anywhere, just shown so they remember to grab the same visual). Filters
 * out tiny/inline icons and data-URI avatars; keeps the first real content
 * image found. Video/GIF posts on LinkedIn typically render a poster-frame
 * <img> here too, so this covers both without separate video handling.
 */
function findCardImage(card) {
  if (!card) return null;
  const imgs = card.querySelectorAll('img');
  for (const img of imgs) {
    const src = img.currentSrc || img.src;
    if (!src || src.startsWith('data:')) continue;
    if ((img.naturalWidth || img.width || 0) < 100) continue;
    return src;
  }
  return null;
}

/**
 * Extract MANY recent posts (not just 3) with best-effort timestamps,
 * engagement counts, and an image/GIF URL if the post has one, for
 * content-calendar friend-sync use. Unlike extractProfilePosts (3 posts, no
 * date, 300-char cap, used for welcome-message drafting), this pulls up to
 * ~60 cards, keeps the FULL post text (no truncation — the checklist UI
 * truncates for display only and lets the user expand), and tries to read
 * the relative timestamp and reaction/comment/repost counts LinkedIn renders
 * near each post.
 *
 * Ordering: DOM order on /recent-activity/all/ is newest-first. Callers
 * should .reverse() the returned array to get oldest-first; rawTimestamp is
 * a display label only, never the sequencing signal (see module doc).
 * @returns {{text:string, rawTimestamp:string|null, approxDaysAgo:number|null, reactions:number|null, comments:number|null, reposts:number|null, imageUrl:string|null}[]}
 */
export function extractProfilePostsRich(root = document, limit = 60) {
  const posts = [];
  const seen = new Set();
  const candidates = collectPostTextBoxes(root);
  const tsPattern = /^\d+\s*(d|w|mo|h|m)\b|^\d{1,2}\/\d{1,2}\/\d{2,4}|^[A-Z][a-z]{2}\s+\d{1,2}(,\s*\d{4})?$/;

  for (const el of candidates) {
    let t = (el.innerText || el.textContent || '').trim().replace(/\s*\n\s*/g, ' ').replace(/\s{2,}/g, ' ');
    if (t.length < 40) continue;
    if (/^(like|comment|repost|send|follow|\d+ (reactions?|comments?))\b/i.test(t)) continue;
    const key = t.slice(0, 60).toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);

    const card = el.closest('[data-id*="urn:li:activity"], [data-urn*="urn:li:activity"], .feed-shared-update-v2, article');
    const cardLines = (card?.innerText || '').split('\n').map(s => s.trim()).filter(Boolean);
    const tsLine = cardLines.find(l => tsPattern.test(l)) || null;
    const engagement = parseEngagement(cardLines);
    const imageUrl = findCardImage(card);

    posts.push({
      text: t,
      rawTimestamp: tsLine,
      approxDaysAgo: parseRelativeAge(tsLine),
      imageUrl,
      ...engagement,
    });
    if (posts.length >= limit) break;
  }
  logger.log(`extractProfilePostsRich: ${posts.length} posts`);
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
