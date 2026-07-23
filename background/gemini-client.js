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
      // NOTE: no empty stopSequences — some API versions reject [] with a 400.
    };

    // Flash models support a thinking budget. Newer 3.x flash models REJECT
    // thinkingBudget:0 (a 400), so we omit thinkingConfig by default and only
    // add it as a recovery step is unnecessary — keeping the request minimal is
    // the most compatible. (If you want to force-disable thinking on a model
    // that supports it, that's the retry path below, not the default.)

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

    // A 400 "invalid argument" usually means one optional field in the request
    // is rejected by this particular model (e.g. thinkingConfig, topP, or an
    // unsupported generationConfig key). Retry ONCE with a stripped-down,
    // maximally-compatible body: just contents + a bare temperature. If that
    // succeeds, the offending field was optional; if it still 400s, surface it.
    if (res.status === 400) {
      const errText = await res.clone().text().catch(() => '');
      logger.warn('GeminiClient: 400 — retrying with a minimal request. Detail:', errText.slice(0, 200));
      const minimal = {
        contents: body.contents,
        generationConfig: { temperature, maxOutputTokens: 2048 },
      };
      if (systemInstruction) minimal.systemInstruction = { parts: [{ text: systemInstruction }] };
      res = await doFetch(minimal);
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
      if (res.status === 400) {
        throw new Error(`Gemini rejected the request (400): ${msg}. Try a different Gemini model in Settings, or switch to Ollama.`);
      }
      throw new Error(`Gemini API error ${res.status}: ${msg}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty response');
    return text.trim();
  }
}
