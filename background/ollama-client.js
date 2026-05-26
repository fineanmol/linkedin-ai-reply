/**
 * ollama-client.js
 * REST client for the local Ollama server.
 * Docs: https://github.com/ollama/ollama/blob/main/docs/api.md
 */

import logger from '../utils/logger.js';

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
      signal: signal || AbortSignal.timeout(180_000), // 180s timeout
    });

    logger.timeEnd('ollama-chat');

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama API error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.message?.content?.trim() || '';
  }

  // ─── Generate (non-chat) ───────────────────────────────────────────────

  /**
   * Raw generation endpoint (for models that don't support chat).
   */
  async generate({ model, prompt, temperature = 0.7, signal }) {
    const url = `${this.baseUrl}/api/generate`;
    const body = {
      model,
      prompt,
      stream: false,
      options: { temperature, top_p: 0.9, num_predict: 2048, num_ctx: 8192 },
    };

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: signal || AbortSignal.timeout(180_000),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Ollama generate error ${res.status}: ${err}`);
    }

    const data = await res.json();
    return data.response?.trim() || '';
  }
}
