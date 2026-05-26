/**
 * reply-cache.js
 * Deduplicates in-flight requests and caches recent replies
 * to avoid hammering the LLM for the same comment.
 */

import logger from '../utils/logger.js';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export class ReplyCache {
  constructor() {
    // Map<cacheKey, { text, backend, model, timestamp }>
    this._cache = new Map();
    // Map<cacheKey, Promise> — in-flight requests
    this._pending = new Map();
  }

  _key(commentId, intent) {
    return `${commentId}__${intent}`;
  }

  get(commentId, intent) {
    const key = this._key(commentId, intent);
    const entry = this._cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
      this._cache.delete(key);
      return null;
    }
    logger.log('ReplyCache: hit for', key);
    return entry;
  }

  set(commentId, intent, value) {
    const key = this._key(commentId, intent);
    this._cache.set(key, { ...value, timestamp: Date.now() });
  }

  invalidate(commentId, intent) {
    const key = this._key(commentId, intent);
    this._cache.delete(key);
  }

  invalidateAll() {
    this._cache.clear();
  }

  /**
   * If a request for this comment+intent is already in-flight,
   * return the same promise to avoid duplicate LLM calls.
   */
  getPending(commentId, intent) {
    return this._pending.get(this._key(commentId, intent)) || null;
  }

  setPending(commentId, intent, promise) {
    const key = this._key(commentId, intent);
    this._pending.set(key, promise);
    promise.finally(() => this._pending.delete(key));
  }
}

export const replyCache = new ReplyCache();
