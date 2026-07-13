/**
 * gemini-client.js
 * Client for the Google Gemini API (cloud fallback).
 * Uses the user's own API key — never ours.
 */

import logger from '../utils/logger.js';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export class GeminiClient {
  constructor(apiKey, model = 'gemini-flash-latest') {
    this.apiKey = apiKey;
    this.model = model;
  }

  /**
   * Generate content using Gemini API.
   * @param {Array<{role: 'user'|'model', content: string}>} messages
   * @param {number} temperature
   * @returns {Promise<string>}
   */
  async chat({ messages, temperature = 0.7, signal }) {
    if (!this.apiKey) throw new Error('Gemini API key not configured.');

    const url = `${GEMINI_BASE}/models/${this.model}:generateContent?key=${this.apiKey}`;

    // Convert our message format to Gemini's format
    // System message goes as first user turn if present
    const contents = [];
    let systemInstruction = null;

    for (const msg of messages) {
      if (msg.role === 'system') {
        systemInstruction = msg.content;
      } else {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.content }],
        });
      }
    }

    const generationConfig = {
      temperature,
      topP: 0.9,
      maxOutputTokens: 8192,
      stopSequences: [],
    };

    // Flash models are "thinking" models — hidden reasoning tokens count
    // against maxOutputTokens. thinkingBudget:0 disables thinking so the whole
    // budget goes to the actual (short) reply. Only apply to FLASH tiers, which
    // allow disabling; Pro models may reject it (handled by the retry below).
    const isFlash = /flash/i.test(this.model) && !/pro/i.test(this.model);
    if (isFlash) {
      generationConfig.thinkingConfig = { thinkingBudget: 0 };
    }

    const body = {
      contents,
      generationConfig,
    };

    if (systemInstruction) {
      body.systemInstruction = {
        parts: [{ text: systemInstruction }],
      };
    }

    logger.log('GeminiClient.chat →', this.model, contents.at(-1)?.parts[0]?.text?.slice(0, 80));

    const doFetch = (payload) => fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: signal || AbortSignal.timeout(60_000),
    });

    // Transient server errors (overload / rate-limit) are common and usually
    // clear in a second or two. Retry a few times with exponential backoff
    // before surfacing the error, so blips self-heal instead of failing.
    const TRANSIENT = new Set([429, 500, 503]);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    let res;
    for (let attempt = 0; attempt < 4; attempt++) {
      res = await doFetch(body);
      if (!TRANSIENT.has(res.status)) break;
      if (attempt < 3) {
        const wait = 800 * Math.pow(2, attempt); // 0.8s, 1.6s, 3.2s
        logger.warn(`GeminiClient: ${res.status} transient — retrying in ${wait}ms (attempt ${attempt + 1}/3)`);
        await sleep(wait);
      }
    }

    // If the model rejects thinkingConfig (some tiers do), retry once without it
    // rather than failing the whole request.
    if (res.status === 400 && body.generationConfig.thinkingConfig) {
      const errText = await res.clone().text().catch(() => '');
      if (/thinking/i.test(errText)) {
        logger.warn('GeminiClient: model rejected thinkingConfig, retrying without it');
        const retry = { ...body, generationConfig: { ...body.generationConfig } };
        delete retry.generationConfig.thinkingConfig;
        res = await doFetch(retry);
      }
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
      const msg = err.error?.message || 'Unknown';
      // Make the common cases actionable.
      if (res.status === 404) {
        throw new Error(`Model "${this.model}" unavailable (404). Pick another Gemini model in Settings. (${msg})`);
      }
      if (res.status === 503 || res.status === 429) {
        throw new Error(`Gemini is busy right now (${res.status}) — tried a few times. Wait a moment and click again, or switch to a local Ollama model in Settings.`);
      }
      throw new Error(`Gemini API error ${res.status}: ${msg}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty response');
    return text.trim();
  }
}
