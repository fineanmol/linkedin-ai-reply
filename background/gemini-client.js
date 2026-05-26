/**
 * gemini-client.js
 * Client for the Google Gemini API (cloud fallback).
 * Uses the user's own API key — never ours.
 */

import logger from '../utils/logger.js';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta';

export class GeminiClient {
  constructor(apiKey, model = 'gemini-2.5-flash') {
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

    // gemini-2.5-flash is a "thinking" model — it uses hidden reasoning tokens
    // that count against maxOutputTokens. Setting thinkingBudget:0 disables
    // the thinking phase entirely, leaving all 8192 tokens for the actual reply.
    // Do NOT pass thinkingConfig to older models (1.5, 2.0) — they reject it.
    if (this.model.includes('gemini-2.5-flash')) {
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

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: signal || AbortSignal.timeout(60_000),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: { message: res.statusText } }));
      throw new Error(`Gemini API error ${res.status}: ${err.error?.message || 'Unknown'}`);
    }

    const data = await res.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Gemini returned empty response');
    return text.trim();
  }
}
