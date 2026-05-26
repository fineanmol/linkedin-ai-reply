/**
 * background.js — MV3 Service Worker
 * Central message handler for the LinkedIn AI Reply Assistant.
 * Routes messages from content scripts to LLM, storage, and settings.
 */

import { llmRouter } from './llm-router.js';
import { replyCache } from './reply-cache.js';
import { buildMessages } from './prompt-builder.js';
import { getProfileWithContext, learnFromApprovedReply, saveManualExamples } from './style-profiler.js';
import {
  getSettings, saveSettings,
  getStyleProfile, saveStyleProfile,
  getReplyHistory, addToReplyHistory,
  getMyIdentity, saveMyIdentity,
} from '../utils/storage.js';
import { MSG } from '../utils/constants.js';
import logger from '../utils/logger.js';

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

      // Fire request (deduplicated via cache)
      const requestPromise = llmRouter.chat(messages)
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
        });

      replyCache.setPending(cacheId, intent, requestPromise);
      return requestPromise;
    }

    // ─── Save Style Sample (Approved Reply) ─────────────────────────────
    case MSG.SAVE_STYLE_SAMPLE: {
      const { text, intent, commentId } = payload;
      await learnFromApprovedReply({ text, intent });

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
      // Broadcast settings change to all LinkedIn tabs to keep them in sync
      chrome.tabs.query({ url: 'https://www.linkedin.com/*' }).then(tabs => {
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
