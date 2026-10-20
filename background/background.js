/**
 * background.js — MV3 Service Worker
 * Central message handler for the LinkedIn AI Reply Assistant.
 * Routes messages from content scripts to LLM, storage, and settings.
 */

import { llmRouter } from './llm-router.js';
import { replyCache } from './reply-cache.js';
import { buildMessages, buildScoringMessages, parseScoringResponse, buildWelcomeMessages, toComment } from './prompt-builder.js';
import { getProfileWithContext, learnFromApprovedReply, saveManualExamples } from './style-profiler.js';
import { buildCalendarBatch, generateCalendarPostForDay } from './calendar-builder.js';
import { registerCalendarAlarm } from './alarms.js';
import {
  getSettings, saveSettings,
  getStyleProfile, saveStyleProfile,
  addToReplyHistory, updateReplyHistory, getReplyHistory,
  getMyIdentity, saveMyIdentity,
  getEngagementQueue, addToEngagementQueue, updateEngagementQueueItem, clearEngagementQueue,
  getCommentsLog, addToCommentsLog, getEngagedUrns, commentCounts, clearCommentsLog,
  getConnectionsQueue, addConnections, updateConnection, clearConnectionsQueue,
  getCalendarPosts, addCalendarPosts, updateCalendarPost, deleteCalendarPost, clearCalendar,
  getCalendarBatchConfig,
} from '../utils/storage.js';
import { MSG, BACKENDS } from '../utils/constants.js';
import logger from '../utils/logger.js';

// In-flight LLM generations, keyed by `${cacheId}__${intent}`.
// Value: { controller, cacheId, commentId, textKey, intent }.
// Lets CANCEL_REPLY abort a generation that's still running, and lets a
// force-regenerate abort the request it supersedes.
const inFlightControllers = new Map();

// ─── Helpers: cache key ─────────────────────────────────────────────────────

/**
 * 32-bit FNV-1a over the FULL string (UTF-16 code units), as 8 hex chars.
 * Not cryptographic — just a real hash so "Great post…" and "Great point…"
 * get different cache keys (the old btoa(first 30 chars) collided on those).
 */
function fnv1a(str) {
  let h = 0x811c9dc5;
  const s = String(str ?? '');
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

// Cache id: commentId + hash of the full comment text and author, so two
// comments that share a stale commentId still get separate entries.
function replyCacheId(commentId, commentText, authorName) {
  return `${commentId}_${fnv1a(`${commentText || ''}\u0000${authorName || ''}`)}`;
}

// ─── Helpers: sender trust + settings sanitizing ────────────────────────────

// Settings that must never reach a content script (LinkedIn page context).
const SECRET_SETTING_KEYS = ['geminiApiKey', 'claudeApiKey', 'claudeBridgeToken'];
// The ONLY settings a content script may change (on-page model switcher + toggle).
const CONTENT_WRITABLE_SETTINGS = ['enabled', 'llmBackend', 'ollamaModel', 'geminiModel', 'claudeModel'];
const VALID_BACKENDS = new Set(['ollama', 'gemini', 'claude', 'auto']);

const SCRAPING_DISABLED = {
  error: 'Background profile reading is off. Turn it on in Settings → Advanced (read the LinkedIn terms note first).',
  code: 'SCRAPING_DISABLED',
};

/** True for our own extension pages (options/popup), false for content scripts. */
function isExtensionPage(sender) {
  const base = chrome.runtime.getURL('');
  return !!sender && sender.id === chrome.runtime.id &&
    typeof sender.url === 'string' && sender.url.startsWith(base);
}

/** Settings safe to hand to a content script / broadcast to tabs. */
function sanitizeSettings(settings) {
  const out = {
    ...settings,
    hasGeminiKey: !!settings.geminiApiKey,
    hasClaudeKey: !!settings.claudeApiKey,
  };
  for (const k of SECRET_SETTING_KEYS) out[k] = '';
  return out;
}

/** Whitelist + type-check a SAVE_SETTINGS payload coming from a content script. */
function pickContentWritableSettings(payload) {
  const out = {};
  for (const k of CONTENT_WRITABLE_SETTINGS) {
    if (!(k in payload)) continue;
    const v = payload[k];
    if (k === 'enabled') {
      if (typeof v === 'boolean') out[k] = v;
    } else if (k === 'llmBackend') {
      if (VALID_BACKENDS.has(v)) out[k] = v;
    } else if (typeof v === 'string' && v.trim() && v.length <= 100) {
      out[k] = v.trim();
    }
  }
  return out;
}

/** Normalize a router result's label/isLocal (falls back to BACKENDS). */
function backendMeta(result) {
  const meta = BACKENDS[result?.backend] || {};
  return {
    label: result?.label || meta.label || result?.backend || 'Unknown',
    isLocal: typeof result?.isLocal === 'boolean' ? result.isLocal : !!meta.isLocal,
  };
}

/** Flatten welcome-message source fields into one string (for URL checks). */
function welcomeSourceText({ name, headline, about, recentPosts }) {
  const posts = (recentPosts || []).map(p => (typeof p === 'string' ? p : p?.text || ''));
  return [name, headline, about, ...posts].filter(Boolean).join('\n');
}

/**
 * Poll a tab with a scrape message until its content script responds with data
 * that passes `isGood`, or we give up. Handles the SPA render delay.
 */
function scrapeTabWhenReady(tabId, msgType, isGood, { tries = 8, delay = 1200, initial = 2500 } = {}) {
  return new Promise((resolve) => {
    let n = 0;
    const attempt = () => {
      n++;
      chrome.tabs.sendMessage(tabId, { type: msgType })
        .then(res => {
          if (isGood(res)) resolve(res);
          else if (n < tries) setTimeout(attempt, delay);
          else resolve(res || null);
        })
        .catch(() => { if (n < tries) setTimeout(attempt, delay); else resolve(null); });
    };
    setTimeout(attempt, initial);
  });
}

// ─── Message Router ────────────────────────────────────────────────────────

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then(sendResponse)
    .catch(err => {
      logger.error('Background message error:', message.type, err);
      sendResponse({ error: err.message || 'Unknown error' });
    });
  return true; // Keep channel open for async response
});

async function handleMessage(message, sender) {
  const { type, payload } = message;

  switch (type) {

    // ─── Generate Reply ─────────────────────────────────────────────────
    case MSG.GENERATE_REPLY: {
      const { commentId, commentText, authorName, postContent, postAuthorName, intent, forceRegenerate } = payload;

      // Debug: log what the content script sent so we can diagnose ID/text issues
      logger.info(
        `[GENERATE_REPLY] commentId=${commentId} | intent=${intent} | textLen=${commentText?.length} | text="${commentText?.slice(0, 80)}"` 
      );

      const cacheId = replyCacheId(commentId, commentText, authorName);
      const abortKey = `${cacheId}__${intent}`;

      let previousReply = '';

      // Check cache first (unless force regenerating)
      if (!forceRegenerate) {
        const cached = replyCache.get(cacheId, intent);
        if (cached) {
          logger.info(`[GENERATE_REPLY] cache HIT for cacheId=${cacheId}`);
          return {
            reply: cached.text, backend: cached.backend, model: cached.model,
            ...backendMeta(cached), cached: true,
          };
        }

        // Check for in-flight request
        const pending = replyCache.getPending(cacheId, intent);
        if (pending) return pending;
      } else {
        // The draft being replaced, so the new one can be told not to repeat it.
        // The panel sends what it's showing; the cache is the fallback.
        previousReply = String(payload.previousReply || replyCache.get(cacheId, intent)?.text || '');
        // Force-regenerate: abort the request it supersedes FIRST, then drop
        // its cache/pending slots so nothing stale is served or written back.
        const prev = inFlightControllers.get(abortKey);
        if (prev) {
          prev.controller.abort();
          inFlightControllers.delete(abortKey);
        }
        replyCache.invalidate(cacheId, intent);
        replyCache.clearPending(cacheId, intent);
      }

      // Register an AbortController so a later CANCEL_REPLY (or a newer
      // force-regenerate) can abort this in-flight LLM call. Registered
      // synchronously — before any await — so concurrent identical requests
      // dedupe onto this one instead of racing.
      const controller = new AbortController();
      const entry = { controller, cacheId, commentId, textKey: fnv1a(commentText || ''), intent };
      inFlightControllers.set(abortKey, entry);
      const isCurrent = () => inFlightControllers.get(abortKey) === entry && !controller.signal.aborted;

      // Scraped text the reply is grounded in — URLs not in here get stripped.
      const sourceText = `${postContent || ''}\n${commentText || ''}`;

      // Fire request (deduplicated via cache)
      const requestPromise = (async () => {
        // Build context
        const [{ styleContext }, settings, identity, history] = await Promise.all([
          getProfileWithContext(),
          getSettings(),
          getMyIdentity(),
          getReplyHistory().catch(() => []),
        ]);
        // Last few drafts from the past day (other comments), so a thread of
        // replies doesn't all open and flow the same way.
        const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
        const recentReplies = (history || [])
          .filter((h) => h?.reply && h.commentId !== commentId && (h.timestamp || 0) > dayAgo)
          .slice(0, 4)
          .map((h) => h.reply);

        const messages = buildMessages({
          userName: identity.name || 'the user',
          styleContext,
          postContent,
          comment: { text: commentText, authorName },
          intent,
          maxWords: settings.maxReplyLength,
          // Lets the prompt tell "a comment on MY post" from "someone else's".
          postAuthorName,
          // On regenerate, ask for a genuinely different angle so the user gets
          // variety instead of the same sentence reworded.
          vary: !!forceRegenerate,
          previousReply,
          // Stable per comment: each comment keeps its reply shape, and
          // different comments in a thread get different shapes.
          shapeSeed: parseInt(fnv1a(`${commentId || ''}\u0000${commentText || ''}`), 16),
          recentReplies,
        });

        const result = await llmRouter.chat(messages, controller.signal);
        // Router output is RAW — comment cleanup happens here.
        const reply = toComment(result.text, sourceText);
        if (!reply) throw new Error('The model returned an empty reply — try regenerating.');
        const meta = backendMeta(result);

        // A superseded (force-regenerated / cancelled) request must not
        // overwrite the newer cached reply or log a stale history entry.
        if (isCurrent()) {
          replyCache.set(cacheId, intent, { text: reply, backend: result.backend, model: result.model, ...meta });
          // Save to history
          addToReplyHistory({
            commentId,
            commentText: commentText?.slice(0, 200),
            authorName,
            reply,
            intent,
            backend: result.backend,
            model: result.model,
            label: meta.label,   // truthful backend name for the History tab
            status: 'generated',
            // Lets activity counts exclude regenerations of the same comment.
            ...(forceRegenerate ? { regenerated: true } : {}),
          }).catch(() => {});
        }
        return { reply, backend: result.backend, model: result.model, ...meta, cached: false };
      })().finally(() => {
        // Only remove the entry if it's still OURS (a newer request may own it).
        if (inFlightControllers.get(abortKey) === entry) inFlightControllers.delete(abortKey);
      });

      replyCache.setPending(cacheId, intent, requestPromise);
      return requestPromise;
    }

    // ─── Cancel an in-flight Reply generation ───────────────────────────────
    case MSG.CANCEL_REPLY: {
      const { commentId, commentText, intent } = payload || {};
      // Match on commentId + full-text hash + intent (CANCEL_REPLY doesn't have
      // to send authorName, which is also part of the cache id).
      const textKey = fnv1a(commentText || '');
      let cancelled = false;
      for (const [key, e] of [...inFlightControllers]) {
        if (e.commentId !== commentId || e.intent !== intent || e.textKey !== textKey) continue;
        e.controller.abort();
        inFlightControllers.delete(key);
        replyCache.invalidate(e.cacheId, intent);
        replyCache.clearPending(e.cacheId, intent);
        logger.info('[CANCEL_REPLY] aborted in-flight request:', key);
        cancelled = true;
      }
      return { cancelled };
    }

    // ─── Save Style Sample (Approved Reply) ─────────────────────────────
    case MSG.SAVE_STYLE_SAMPLE: {
      const { text, intent, commentId } = payload;

      // Respect the user's "auto-learn from approved replies" setting. When it's
      // off, we must NOT harvest the reply into the style profile (privacy).
      const learnSettings = await getSettings();
      if (learnSettings.autoLearnFromApproved !== false) {
        await learnFromApprovedReply({ text, intent });
      }

      // Update history entry status (serialized with concurrent history writes)
      await updateReplyHistory(h =>
        h.commentId === commentId ? { ...h, status: 'approved' } : h
      );

      return { success: true };
    }

    // ─── Settings ────────────────────────────────────────────────────────
    // Content scripts run inside linkedin.com and must never see API keys or
    // the bridge token — they get a sanitized copy with has*Key booleans.
    case MSG.GET_SETTINGS: {
      const settings = await getSettings();
      return isExtensionPage(sender) ? settings : sanitizeSettings(settings);
    }

    case MSG.SAVE_SETTINGS: {
      const incoming = (payload && typeof payload === 'object') ? payload : {};
      let patch;
      if (isExtensionPage(sender)) {
        patch = { ...incoming };
        // Derived flags from a sanitized read — never persist them.
        delete patch.hasGeminiKey;
        delete patch.hasClaudeKey;
      } else {
        // Content scripts may only flip the toggle / switch backend+model.
        patch = pickContentWritableSettings(incoming);
      }
      // saveSettings MERGES the partial patch into stored settings.
      await saveSettings(patch);
      const sanitized = sanitizeSettings(await getSettings());
      // Broadcast settings change to all LinkedIn tabs to keep them in sync.
      // Match the same patterns the manifest declares (all linkedin.com subdomains),
      // not just www — otherwise tabs on other subdomains never get the update.
      // Payload is the SANITIZED settings — never keys/tokens.
      chrome.tabs.query({ url: ['https://*.linkedin.com/*', 'https://linkedin.com/*'] }).then(tabs => {
        for (const tab of tabs) {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              type: MSG.SETTINGS_CHANGED,
              payload: sanitized,
            }).catch(() => {});
          }
        }
      }).catch(() => {});
      return { success: true };
    }

    // ─── Style Profile ────────────────────────────────────────────────────
    case MSG.GET_STYLE_PROFILE:
      return getStyleProfile();

    case MSG.SAVE_STYLE_PROFILE:
      if (payload.manualExamples !== undefined) {
        await saveManualExamples(payload.manualExamples);
      } else {
        await saveStyleProfile(payload);
      }
      return { success: true };

    // ─── Ollama Health Check ──────────────────────────────────────────────
    case MSG.CHECK_OLLAMA: {
      const alive = await llmRouter.pingOllama();
      return { alive };
    }

    case MSG.GET_OLLAMA_MODELS: {
      const models = await llmRouter.getOllamaModels();
      return { models };
    }

    // ─── Selected-backend Health Check ────────────────────────────────────
    // → { alive, backend, label, model, isLocal, error? }
    case MSG.CHECK_BACKEND: {
      try {
        return await llmRouter.checkBackend();
      } catch (e) {
        return { alive: false, error: e.message };
      }
    }

    // ─── Identity ─────────────────────────────────────────────────────────
    case MSG.SAVE_IDENTITY:
      await saveMyIdentity(payload?.name, payload?.profileUrl);
      return { success: true };

    case MSG.GET_IDENTITY:
      return getMyIdentity();

    // ─── Engagement Queue ───────────────────────────────────────────────────
    // Score a batch of extracted feed posts for relevance to the user's topics.
    case MSG.SCORE_TARGETS: {
      const { posts = [], topics = '' } = payload;
      if (!posts.length) return { scored: [] };
      try {
        const messages = buildScoringMessages({ topics, posts });
        const { text } = await llmRouter.chat(messages);
        const scored = parseScoringResponse(text, posts.length);
        return { scored };
      } catch (e) {
        logger.error('[SCORE_TARGETS] failed:', e.message);
        return { scored: [], error: e.message };
      }
    }

    // Full build: score the posts, rank, cap, and add the best to the queue.
    // Drafts are generated lazily later (on open), not here.
    case MSG.BUILD_QUEUE: {
      const { posts = [] } = payload;
      const settings = await getSettings();
      // Skip posts the user has already engaged on (logged as posted).
      const engagedUrns = await getEngagedUrns();
      // Pre-filter: drop ads, own posts (already excluded by extractor), posts
      // already commented on, and posts already in the engagement log.
      const candidates = posts.filter(p =>
        !p.isPromoted &&
        !p.alreadyCommentedByMe &&
        (p.text || '').length >= 20 &&
        !(p.urn && engagedUrns.has(p.urn))
      );
      if (!candidates.length) return { added: 0, scanned: posts.length };

      let scored = [];
      try {
        const messages = buildScoringMessages({ topics: settings.topics, posts: candidates });
        const { text } = await llmRouter.chat(messages);
        scored = parseScoringResponse(text, candidates.length);
      } catch (e) {
        logger.warn('[BUILD_QUEUE] scoring failed, falling back to reactions order:', e.message);
      }

      // STRICT quality bar: only queue posts genuinely worth engaging on.
      // Commenting on a dead or off-topic post does nothing for the profile.
      const MIN_RELEVANCE = settings.minRelevance ?? 0.6;
      const MIN_REACTIONS = settings.minReactions ?? 5; // some traction; null counts allowed through
      const CAP = settings.queueSize || 6;

      const relById = new Map(scored.map(s => [s.i, s]));
      const ranked = candidates
        .map((p, i) => ({
          ...p,
          relevance: relById.get(i)?.relevance ?? 0,
          whyEngage: relById.get(i)?.why || '',
        }))
        .filter(p => {
          // If scoring ran, require high relevance. If scoring failed entirely,
          // fall back to engagement-only so the feature still works.
          if (scored.length && p.relevance < MIN_RELEVANCE) return false;
          // Require meaningful traction WHEN we could read a count. A null count
          // (couldn't extract) is allowed through rather than wrongly dropped.
          if (p.reactionsApprox != null && p.reactionsApprox < MIN_REACTIONS) return false;
          return true;
        })
        // Rank: relevance desc, then reactions (soft) desc.
        .sort((a, b) => (b.relevance - a.relevance) || ((b.reactionsApprox || 0) - (a.reactionsApprox || 0)))
        .slice(0, CAP)
        .map(p => ({
          urn: p.urn,
          authorName: p.authorName,
          authorHeadline: p.authorHeadline,
          postText: (p.text || '').slice(0, 1000),
          permalink: p.permalink,
          relevance: p.relevance,
          reactionsApprox: p.reactionsApprox,
          whyEngage: p.whyEngage,
          draftReply: '',        // generated lazily / via Draft all
        }));

      const added = await addToEngagementQueue(ranked);
      logger.info(`[BUILD_QUEUE] scanned=${posts.length} candidates=${candidates.length} qualified=${ranked.length} added=${added}`);
      return { added, scanned: posts.length, candidates: candidates.length, qualified: ranked.length };
    }

    case MSG.GET_QUEUE:
      return { queue: await getEngagementQueue() };

    case MSG.UPDATE_QUEUE_ITEM:
      await updateEngagementQueueItem(payload.id, payload.patch || {});
      return { success: true };

    case MSG.CLEAR_QUEUE:
      await clearEngagementQueue();
      return { success: true };

    // Record a comment the user confirmed they POSTED.
    case MSG.LOG_COMMENT: {
      const it = payload || {};
      await addToCommentsLog({
        urn: it.urn || null,
        authorName: it.authorName || 'Someone',
        postText: (it.postText || '').slice(0, 300),
        comment: (it.comment || it.draftReply || '').slice(0, 1000),
      });
      const counts = commentCounts(await getCommentsLog());
      return { success: true, counts };
    }

    case MSG.GET_COMMENTS_LOG: {
      const log = await getCommentsLog();
      return { log, counts: commentCounts(log) };
    }

    case MSG.CLEAR_COMMENTS_LOG:
      await clearCommentsLog();
      return { success: true };

    // ─── Connection welcome messages (draft-assist only, never auto-send) ───
    case MSG.DRAFT_WELCOME: {
      const { name, headline, about, recentPosts } = payload || {};
      try {
        const [{ styleContext }, identity] = await Promise.all([getProfileWithContext(), getMyIdentity()]);
        const messages = buildWelcomeMessages({ userName: identity.name || 'the user', styleContext, name, headline, about, recentPosts });
        const { text } = await llmRouter.chat(messages);
        return { message: toComment(text, welcomeSourceText({ name, headline, about, recentPosts })) };
      } catch (e) {
        return { error: e.message };
      }
    }

    // Deep draft: open the connection's profile in a background tab, scrape
    // About + headline, then navigate the SAME tab to their dedicated
    // /recent-activity/all/ page for reliable recent posts, draft, close.
    // Per-click only (never batched) to stay out of automation-detection turf.
    case MSG.DEEP_DRAFT_WELCOME: {
      const { profilePath, name, headline } = payload || {};
      // Opening hidden tabs on someone else's profile is opt-in (LinkedIn ToS).
      if (!(await getSettings()).allowBackgroundScraping) return { ...SCRAPING_DISABLED };
      // Only ever open a linkedin.com/in/<slug> page — never an arbitrary path.
      if (!/^\/in\/[^/?#]+\/?$/.test(String(profilePath || ''))) {
        return { error: 'Invalid LinkedIn profile link for this connection.' };
      }
      let tabId = null;
      try {
        const clean = String(profilePath).replace(/\/$/, '');
        const tab = await chrome.tabs.create({ url: `https://www.linkedin.com${clean}/`, active: false });
        tabId = tab.id;

        // 1) Scrape the main profile (name, headline, About).
        const profile = await scrapeTabWhenReady(tabId, MSG.SCRAPE_PROFILE,
          r => r && (r.about || r.name)) || {};

        // 2) Navigate the SAME tab to the dedicated posts page and scrape posts.
        //    Purpose-built page → far more reliable than the profile's preview.
        let recentPosts = profile.recentPosts || [];
        try {
          await chrome.tabs.update(tabId, { url: `https://www.linkedin.com${clean}/recent-activity/all/` });
          const postsRes = await scrapeTabWhenReady(tabId, MSG.SCRAPE_POSTS,
            r => Array.isArray(r?.posts) && r.posts.length > 0);
          if (postsRes?.posts?.length) recentPosts = postsRes.posts;
        } catch { /* keep whatever posts the profile page gave us */ }

        const [{ styleContext }, identity] = await Promise.all([getProfileWithContext(), getMyIdentity()]);
        const welcomeInput = {
          name: profile.name || name,
          headline: profile.headline || headline,
          about: profile.about || '',
          recentPosts,
        };
        const messages = buildWelcomeMessages({
          userName: identity.name || 'the user',
          styleContext,
          ...welcomeInput,
        });
        const { text } = await llmRouter.chat(messages);
        return { message: toComment(text, welcomeSourceText(welcomeInput)), deep: !!(profile.about || recentPosts.length) };
      } catch (e) {
        return { error: e.message };
      } finally {
        if (tabId) chrome.tabs.remove(tabId).catch(() => {});
      }
    }

    case MSG.ADD_CONNECTIONS: {
      const added = await addConnections(payload?.connections || []);
      return { added };
    }

    case MSG.GET_CONNECTIONS:
      return { connections: await getConnectionsQueue() };

    case MSG.UPDATE_CONNECTION:
      await updateConnection(payload.id, payload.patch || {});
      return { success: true };

    case MSG.CLEAR_CONNECTIONS:
      await clearConnectionsQueue();
      return { success: true };

    // ─── Content Calendar (friend-sync + trending, draft-only) ────────────
    // Scrapes a FRIEND's public profile (who has agreed to share content
    // ideas), builds the friend/trending day pattern, and persists the batch
    // config. Same background-tab open/scroll/scrape/close lifecycle as
    // DEEP_DRAFT_WELCOME above — read-only, per-run only, never batched on a
    // timer.
    // Scrape ONLY — returns the raw post list so the user can review and pick
    // which ones to use before anything is generated. Separate from
    // BUILD_CALENDAR_BATCH below so a slow/failed scrape never wastes a
    // finalize step, and so the user sees exactly what was found.
    case MSG.SCRAPE_FRIEND_PROFILE: {
      const { friendProfileUrl } = payload || {};
      // Opening hidden tabs on someone else's profile is opt-in (LinkedIn ToS).
      if (!(await getSettings()).allowBackgroundScraping) return { ...SCRAPING_DISABLED };
      let tabId = null;
      try {
        // Accept either a bare path ("/in/alexxubyte") or a full URL
        // ("https://www.linkedin.com/in/alexxubyte/") — normalize to just
        // the "/in/<slug>" path so we never double-prefix the domain.
        let clean = String(friendProfileUrl || '').trim().replace(/\/$/, '');
        const inMatch = clean.match(/\/in\/[^/?#]+/);
        if (inMatch) {
          clean = inMatch[0];
        } else if (!clean.startsWith('/')) {
          clean = `/in/${clean.replace(/^\/+/, '')}`;
        }
        if (!/^\/in\/[^/?#]+$/.test(clean)) {
          return { error: 'Enter a valid LinkedIn profile URL, e.g. https://www.linkedin.com/in/alexxubyte/' };
        }

        // Warm-up navigation, matching DEEP_DRAFT_WELCOME's pattern: visit the
        // plain profile page first, THEN navigate to /recent-activity/all/ —
        // a fresh tab jumping straight to the activity sub-page (no referrer,
        // no organic profile visit first) is more likely to hit a slow/partial
        // SPA render or an interstitial the scraper's selectors won't match.
        const tab = await chrome.tabs.create({ url: `https://www.linkedin.com${clean}/`, active: false });
        tabId = tab.id;
        await scrapeTabWhenReady(tabId, MSG.SCRAPE_PROFILE, r => r && (r.about || r.name), { tries: 3, delay: 1200, initial: 2500 });

        await chrome.tabs.update(tabId, { url: `https://www.linkedin.com${clean}/recent-activity/all/` });
        // Each retry re-runs the ~5-6s auto-scroll+scrape cycle in content.js,
        // so keep tries low — a few expensive retries beat many (tries:10
        // could stretch this to ~60s+ before ever surfacing a result).
        const postsRes = await scrapeTabWhenReady(tabId, MSG.SCRAPE_FRIEND_POSTS,
          r => Array.isArray(r?.posts) && r.posts.length > 0, { tries: 3, delay: 1500, initial: 3000 });
        const posts = postsRes?.posts || [];

        if (!posts.length) {
          return { error: `Couldn't find any posts on that profile's activity page. Make sure the URL is correct and the profile has public posts, then try again.` };
        }

        return { posts, friendProfileUrl: clean };
      } catch (e) {
        return { error: e.message };
      } finally {
        if (tabId) chrome.tabs.remove(tabId).catch(() => {});
      }
    }

    // Finalize the batch from ALREADY-SCRAPED, user-selected posts — pure
    // computation, no tab lifecycle. selectedPosts preserves original
    // (newest-first) scrape order; buildCalendarBatch() reverses it to
    // oldest-first internally.
    case MSG.BUILD_CALENDAR_BATCH: {
      const { friendProfileUrl, ratio, timeSlot, totalDays, selectedPosts } = payload || {};
      try {
        if (!selectedPosts?.length) {
          return { error: 'Select at least one friend post to use, or scrape again.' };
        }
        const result = await buildCalendarBatch({ friendProfileUrl, ratio, timeSlot, totalDays, scrapedPosts: selectedPosts });
        return result;
      } catch (e) {
        return { error: e.message };
      }
    }

    case MSG.GENERATE_CALENDAR_POST: {
      try {
        // Regenerate passes the existing day OBJECT (with sourceFriendPostText)
        // so a friend day re-adapts the SAME source instead of consuming the
        // next unused one. Also accept a top-level sourceFriendPostText.
        let { day, stream, sourceFriendPostText } = payload || {};
        if (sourceFriendPostText && (day == null || typeof day !== 'object')) {
          day = { day, sourceFriendPostText };
        }
        const post = await generateCalendarPostForDay(day, stream);
        return { post };
      } catch (e) {
        return { error: e.message };
      }
    }

    case MSG.GET_CALENDAR:
      return { posts: await getCalendarPosts() };

    case MSG.ADD_CALENDAR_POSTS: {
      const added = await addCalendarPosts(payload?.posts || []);
      return { added };
    }

    case MSG.UPDATE_CALENDAR_POST:
      await updateCalendarPost(payload.id, payload.patch || {});
      return { success: true };

    case MSG.DELETE_CALENDAR_POST:
      await deleteCalendarPost(payload.id);
      return { success: true };

    case MSG.CLEAR_CALENDAR:
      await clearCalendar();
      return { success: true };

    case MSG.GET_CALENDAR_BATCH_CONFIG:
      return { config: await getCalendarBatchConfig() };

    // ─── Ping ─────────────────────────────────────────────────────────────
    case MSG.PING:
      return { pong: true };

    default:
      logger.warn('Background: unknown message type:', type);
      return { error: `Unknown message type: ${type}` };
  }
}

// ─── Extension Lifecycle ───────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(({ reason }) => {
  if (reason === 'install') {
    logger.info('LinkedIn AI Reply Assistant installed!');
    // Open options page on first install
    chrome.tabs.create({ url: chrome.runtime.getURL('options/options.html') });
  }
});

registerCalendarAlarm();

logger.info('Background service worker started.');
