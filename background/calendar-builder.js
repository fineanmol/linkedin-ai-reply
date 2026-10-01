/**
 * calendar-builder.js
 * Builds a month-long content calendar from two blended sources:
 *  - "friend" days: a friend's own post history (scraped, oldest-first),
 *    adapted 1:1 into the user's own voice — never copy-pasted.
 *  - "trending" days: original posts written from durable, well-known
 *    B2B/LinkedIn content patterns (no live feed — reasoning-only).
 * Draft-only. Nothing here ever posts to LinkedIn.
 */

import { llmRouter } from './llm-router.js';
import { getProfileWithContext } from './style-profiler.js';
import {
  buildFriendAdaptMessages, buildTrendingOriginalMessages, buildTopicLabelMessages,
  toPost, cleanReplyText,
} from './prompt-builder.js';
import {
  getMyIdentity, getCalendarPosts, getCalendarBatchConfig, saveCalendarBatchConfig, updateCalendarBatchConfig,
} from '../utils/storage.js';

const TIME_SLOTS = {
  morning: { hhmm: '08:00', label: 'CET' },
  lunch:   { hhmm: '12:30', label: 'CET' },
  evening: { hhmm: '18:00', label: 'CET' },
};

export function resolveTimeSlot(timeSlot) {
  if (timeSlot && typeof timeSlot === 'object' && timeSlot.custom) {
    return { hhmm: timeSlot.custom, label: 'CET' };
  }
  return TIME_SLOTS[timeSlot] || TIME_SLOTS.morning;
}

/**
 * Build a length-N array of 'friend'/'trending' labels, evenly spread (not
 * clumped) per a percentage ratio, using the largest-remainder method so a
 * 70/30 split over 30 days doesn't degenerate into 21-then-9.
 */
export function buildStreamPattern(totalDays, ratio) {
  const friendShare = (ratio.friend || 0) / 100;

  const idealFriend = totalDays * friendShare;
  let friendCount = Math.floor(idealFriend);
  const friendRemainder = idealFriend - friendCount;
  const idealTrend = totalDays - idealFriend;
  let trendCount = Math.floor(idealTrend);
  const trendRemainder = idealTrend - trendCount;

  const leftover = totalDays - friendCount - trendCount;
  if (leftover > 0) {
    if (friendRemainder >= trendRemainder) friendCount += leftover;
    else trendCount += leftover;
  }

  // Bresenham-style even walk: spread friendCount 'friend' slots deterministically
  // across totalDays slots, rather than clumping them at the start.
  const pattern = new Array(totalDays).fill('trending');
  let acc = 0;
  let placed = 0;
  for (let day = 0; day < totalDays && placed < friendCount; day++) {
    acc += friendCount;
    if (acc >= totalDays) {
      acc -= totalDays;
      pattern[day] = 'friend';
      placed++;
    }
  }
  // Rounding safety net: fill remaining trending slots from the end if short.
  for (let day = totalDays - 1; placed < friendCount && day >= 0; day--) {
    if (pattern[day] === 'trending') { pattern[day] = 'friend'; placed++; }
  }
  return pattern;
}

/**
 * Cap the pattern's 'friend' slots to however many friend posts were actually
 * found, converting the shortfall's worth of TRAILING friend-days (closest to
 * end of month) to 'trending' instead. Returns { pattern, shortfall }.
 */
export function capPatternToAvailability(pattern, friendPostsAvailable) {
  const friendSlotsNeeded = pattern.filter(p => p === 'friend').length;
  const shortfall = Math.max(0, friendSlotsNeeded - friendPostsAvailable);
  if (shortfall === 0) return { pattern, shortfall: 0 };

  const capped = [...pattern];
  let toConvert = shortfall;
  for (let day = capped.length - 1; day >= 0 && toConvert > 0; day--) {
    if (capped[day] === 'friend') { capped[day] = 'trending'; toConvert--; }
  }
  return { pattern: capped, shortfall };
}

/**
 * Scrape a friend's profile in a hidden background tab, build the day
 * pattern, and persist the batch config (including the ordered, oldest-first
 * friend post queue that Stream A's independent counter consumes from).
 * The actual tab scrape (open/scroll/scrape/close) is done by the caller in
 * background.js, mirroring DEEP_DRAFT_WELCOME's tab-lifecycle exactly — this
 * function takes the already-scraped posts so it stays tab-agnostic/testable.
 */
export async function buildCalendarBatch({ friendProfileUrl, ratio, timeSlot, totalDays, scrapedPosts }) {
  // DOM order on /recent-activity/all/ is newest-first — reverse for oldest-first.
  // rawTimestamp is a display label only, never the sequencing signal.
  const friendPostQueue = [...(scrapedPosts || [])].reverse().map(p => ({
    text: p.text,
    rawTimestamp: p.rawTimestamp || null,
    imageUrl: p.imageUrl || null,
    consumed: false,
  }));

  const rawPattern = buildStreamPattern(totalDays, ratio);
  const { pattern, shortfall } = capPatternToAvailability(rawPattern, friendPostQueue.length);

  const config = {
    friendProfileUrl,
    ratio,
    timeSlot,
    friendPostQueue,
    totalDays,
    createdAt: Date.now(),
  };
  await saveCalendarBatchConfig(config);

  return { pattern, shortfall, friendPostsFound: friendPostQueue.length };
}

/**
 * Generate ONE day's post. Claims the next unconsumed friend post for 'friend'
 * days (independent counter — persists across pause/resume/regenerate), or
 * builds a trending-original prompt avoiding topics already used this batch.
 *
 * `day` is either the day number or, when REGENERATING an existing day, the
 * existing day object. A regenerated friend day that carries
 * sourceFriendPostText reuses that same source instead of consuming the next
 * unused friend post.
 */
export async function generateCalendarPostForDay(day, stream) {
  const dayObj = (day && typeof day === 'object') ? day : null;
  const dayNum = dayObj ? dayObj.day : day;

  const config = await getCalendarBatchConfig();
  if (!config) throw new Error('No calendar batch found — generate a batch first.');

  const [{ styleContext }, identity] = await Promise.all([getProfileWithContext(), getMyIdentity()]);
  const { hhmm, label } = resolveTimeSlot(config.timeSlot);
  const userName = identity.name || 'the user';

  if (stream === 'friend') {
    let source = null;   // { text, rawTimestamp, imageUrl }
    let claimed = null;  // { index, text } when we consumed a NEW queue entry

    if (dayObj?.sourceFriendPostText) {
      // Regenerate: same source post, fresh adaptation. Nothing is consumed.
      const match = (config.friendPostQueue || []).find(p => p.text === dayObj.sourceFriendPostText);
      source = {
        text: dayObj.sourceFriendPostText,
        rawTimestamp: match?.rawTimestamp || dayObj.sourceFriendPostDate || null,
        imageUrl: match?.imageUrl || dayObj.sourceImageUrl || null,
      };
    } else {
      // Claim BEFORE the LLM call, inside one serialized read-modify-write, so
      // two concurrent generations can never pick the same friend post.
      claimed = await updateCalendarBatchConfig((cfg) => {
        const queue = cfg?.friendPostQueue || [];
        const index = queue.findIndex(p => !p.consumed);
        if (index === -1) return false; // nothing to claim → skip the write
        queue[index].consumed = true;
        return { index, ...queue[index] };
      });
      if (!claimed) throw new Error('No unconsumed friend posts left for this batch.');
      source = { text: claimed.text, rawTimestamp: claimed.rawTimestamp || null, imageUrl: claimed.imageUrl || null };
    }

    let postText;
    try {
      const messages = buildFriendAdaptMessages({ userName, styleContext, sourcePostText: source.text });
      const { text } = await llmRouter.chat(messages);
      postText = toPost(text);
      if (!postText) throw new Error('The model returned an empty post — try again.');
    } catch (e) {
      // Generation failed: give the claimed source back so a retry (or the
      // next day) can still use it — matches the old "consume on success" rule.
      if (claimed) {
        await updateCalendarBatchConfig((cfg) => {
          const entry = cfg?.friendPostQueue?.[claimed.index];
          if (!entry || entry.text !== claimed.text) return false;
          entry.consumed = false;
          return true;
        }).catch(() => {});
      }
      throw e;
    }

    return {
      day: dayNum,
      stream,
      postText,
      suggestedTime: hhmm,
      timezoneLabel: label,
      sourceFriendPostText: source.text,
      sourceFriendPostDate: source.rawTimestamp || 'an earlier post',
      sourceImageUrl: source.imageUrl || null,
    };
  }

  const existing = await getCalendarPosts();
  const avoidTopics = existing.filter(p => p.stream === 'trending').map(p => p.trendTopic).filter(Boolean);

  const messages = buildTrendingOriginalMessages({ userName, styleContext, avoidTopics });
  const { text: rawPost } = await llmRouter.chat(messages);
  const postText = toPost(rawPost);
  if (!postText) throw new Error('The model returned an empty post — try again.');

  let trendTopic = '';
  try {
    const labelResp = await llmRouter.chat(buildTopicLabelMessages(postText));
    trendTopic = cleanReplyText(labelResp.text || '').split('\n')[0].trim().slice(0, 60);
  } catch { /* label is a nice-to-have, never block generation on it */ }

  return {
    day: dayNum,
    stream,
    postText,
    suggestedTime: hhmm,
    timezoneLabel: label,
    trendTopic,
  };
}
