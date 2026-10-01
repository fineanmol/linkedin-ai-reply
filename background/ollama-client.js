/**
 * ollama-client.js
 * REST client for the local Ollama server.
 * Docs: https://github.com/ollama/ollama/blob/main/docs/api.md
 */

import logger from '../utils/logger.js';

const CHAT_TIMEOUT_MS = 180_000;

/** Combine the caller's signal (may be undefined) with a hard timeout. */
function withTimeout(signal, ms) {
  const timeout = AbortSignal.timeout(ms);
  if (!signal) return timeout;
  if (typeof AbortSignal.any === 'function') return AbortSignal.any([signal, timeout]);
  // Chrome < 116 has no AbortSignal.any — combine by hand.
  const ctrl = new AbortController();
  const relay = (s) => () => ctrl.abort(s.reason);
  for (const s of [signal, timeout]) {
    if (s.aborted) { ctrl.abort(s.reason); break; }
    s.addEventListener('abort', relay(s), { once: true });
  }
  return ctrl.signal;
}

export class OllamaClient {
  constructor(baseUrl = 'http://localhost:11434') {
    this.baseUrl = baseUrl.replace(/\/$/, '');
  }

  // ─── Health Check ──────────────────────────────────────────────────────

  async ping() {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(3000),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  // ─── List Available Models ─────────────────────────────────────────────

  async listModels() {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || []).map(m => m.name);
    } catch (e) {
      logger.warn('OllamaClient.listModels failed:', e.message);
      return [];
    }
  }

  // ─── Chat Completion ───────────────────────────────────────────────────

  /**
   * @param {object} params
   * @param {string} params.model - Ollama model name
   * @param {Array<{role: string, content: string}>} params.messages
   * @param {number} [params.temperature=0.7]
   * @param {AbortSignal} [params.signal]
   * @returns {Promise<string>} The assistant's reply text
   */
  async chat({ model, messages, temperature = 0.7, signal }) {
    const url = `${this.baseUrl}/api/chat`;
    const body = {
      model,
      messages,
      stream: false,
      options: {
        temperature,
        top_p: 0.9,
        repeat_penalty: 1.1,
        num_predict: 2048, // max reply tokens
        num_ctx: 8192,    // context window — must fit full post + comment + prompt
      },
    };

    logger.log('OllamaClient.chat →', model, messages.at(-1)?.content?.slice(0, 80));
    logger.time('ollama-chat');

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: withTimeout(signal, CHAT_TIMEOUT_MS), // caller abort OR 180s timeout
    });

    logger.timeEnd('ollama-chat');

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.message?.content?.trim() || '';
  }
}
