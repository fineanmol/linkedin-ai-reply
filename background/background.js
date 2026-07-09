/**
 * background.js — MV3 Service Worker
 * Central message handler for the LinkedIn AI Reply Assistant.
 * Routes messages from content scripts to LLM, storage, and settings.
 */

import { llmRouter } from './llm-router.js';
import { replyCache } from './reply-cache.js';
import { buildMessages, buildScoringMessages, parseScoringResponse } from './prompt-builder.js';
import { getProfileWithContext, learnFromApprovedReply, saveManualExamples } from './style-profiler.js';
import {
  getSettings, saveSettings,
  getStyleProfile, saveStyleProfile,
  getReplyHistory, addToReplyHistory,
  getMyIdentity, saveMyIdentity,
  getEngagementQueue, addToEngagementQueue, updateEngagementQueueItem, clearEngagementQueue,
  getCommentsLog, addToCommentsLog, getEngagedUrns, commentCounts, clearCommentsLog,
} from '../utils/storage.js';
import { MSG } from '../utils/constants.js';
import logger from '../utils/logger.js';

// In-flight LLM AbortControllers, keyed by `${cacheId}__${intent}`.
// Lets CANCEL_REPLY abort a generation that's still running.
const inFlightControllers = new Map();

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
      const { commentId, commentText, authorName, postContent, intent, forceRegenerate } = payload;

      // Debug: log what the content script sent so we can diagnose ID/text issues
      logger.info(
        `[GENERATE_REPLY] commentId=${commentId} | intent=${intent} | textLen=${commentText?.length} | text="${commentText?.slice(0, 80)}"` 
      );

      // Harden cache key: append a short hash of the comment text so that
      // even if two comments share the same commentId (stale dataset stamp),
      // they still get unique cache entries and unique replies.
      const textHash = commentText
        ? btoa(encodeURIComponent(commentText.slice(0, 30))).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
        : 'empty';
      const cacheId = `${commentId}_${textHash}`;

      // Check cache first (unless force regenerating)
      if (!forceRegenerate) {
        const cached = replyCache.get(cacheId, intent);
        if (cached) {
          logger.info(`[GENERATE_REPLY] cache HIT for cacheId=${cacheId}`);
          return { reply: cached.text, backend: cached.backend, model: cached.model, cached: true };
        }

        // Check for in-flight request
        const pending = replyCache.getPending(cacheId, intent);
        if (pending) return pending;
      } else {
        replyCache.invalidate(cacheId, intent);
      }

      // Build context
      const [{ styleContext }, settings, identity] = await Promise.all([
        getProfileWithContext(),
        getSettings(),
        getMyIdentity(),
      ]);

      const messages = buildMessages({
        userName: identity.name || 'the user',
        styleContext,
        postContent,
        comment: { text: commentText, authorName },
        intent,
        maxWords: settings.maxReplyLength,
      });

      // Register an AbortController so a later CANCEL_REPLY can abort this
      // in-flight LLM call. Keyed the same way as the cache.
      const controller = new AbortController();
      const abortKey = `${cacheId}__${intent}`;
      inFlightControllers.set(abortKey, controller);

      // Fire request (deduplicated via cache)
      const requestPromise = llmRouter.chat(messages, controller.signal)
        .then(result => {
          replyCache.set(cacheId, intent, result);
          // Save to history
          addToReplyHistory({
            commentId,
            commentText: commentText?.slice(0, 200),
            authorName,
            reply: result.text,
            intent,
            backend: result.backend,
            model: result.model,
            status: 'generated',
          }).catch(() => {});
          return { reply: result.text, backend: result.backend, model: result.model };
        })
        .finally(() => {
          inFlightControllers.delete(abortKey);
        });

      replyCache.setPending(cacheId, intent, requestPromise);
      return requestPromise;
    }

    // ─── Cancel an in-flight Reply generation ───────────────────────────────
    case MSG.CANCEL_REPLY: {
      const { commentId, commentText, intent } = payload;
      const textHash = commentText
        ? btoa(encodeURIComponent(commentText.slice(0, 30))).replace(/[^a-zA-Z0-9]/g, '').slice(0, 8)
        : 'empty';
      const abortKey = `${commentId}_${textHash}__${intent}`;
      const controller = inFlightControllers.get(abortKey);
      if (controller) {
        controller.abort();
        inFlightControllers.delete(abortKey);
        replyCache.invalidate(`${commentId}_${textHash}`, intent);
        logger.info('[CANCEL_REPLY] aborted in-flight request:', abortKey);
        return { cancelled: true };
      }
      return { cancelled: false };
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

      // Update history entry status
      const history = await getReplyHistory();
      const updated = history.map(h =>
        h.commentId === commentId ? { ...h, status: 'approved' } : h
      );
      await chrome.storage.local.set({ liar_reply_history: updated });

      return { success: true };
    }

    // ─── Settings ────────────────────────────────────────────────────────
    case MSG.GET_SETTINGS:
      return getSettings();

    case MSG.SAVE_SETTINGS:
      await saveSettings(payload);
      // Broadcast settings change to all LinkedIn tabs to keep them in sync.
      // Match the same patterns the manifest declares (all linkedin.com subdomains),
      // not just www — otherwise tabs on other subdomains never get the update.
      chrome.tabs.query({ url: ['https://*.linkedin.com/*', 'https://linkedin.com/*'] }).then(tabs => {
        for (const tab of tabs) {
          if (tab.id) {
            chrome.tabs.sendMessage(tab.id, {
              type: 'SETTINGS_CHANGED',
              payload
            }).catch(() => {});
          }
        }
      }).catch(() => {});
      return { success: true };

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

    // ─── Identity ─────────────────────────────────────────────────────────
    case 'SAVE_IDENTITY':
      await saveMyIdentity(payload.name, payload.profileUrl);
      return { success: true };

    case 'GET_IDENTITY':
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

logger.info('Background service worker started.');
