/**
 * llm-router.js
 * Routes LLM requests to Ollama (primary) or Gemini API (fallback).
 * Never auto-selects cloud without user config.
 */

import { OllamaClient } from './ollama-client.js';
import { GeminiClient } from './gemini-client.js';
import { getSettings } from '../utils/storage.js';
import { cleanReplyText } from './prompt-builder.js';
import logger from '../utils/logger.js';

export class LLMRouter {
  constructor() {
    this._ollamaClient = null;
    this._geminiClient = null;
  }

  async _getClients() {
    const settings = await getSettings();

    // Always rebuild Ollama client if URL changed
    if (!this._ollamaClient || this._ollamaClient.baseUrl !== settings.ollamaUrl) {
      this._ollamaClient = new OllamaClient(settings.ollamaUrl);
    }

    // Always rebuild Gemini client from latest settings so a newly saved
    // API key is picked up immediately without reloading the extension
    if (settings.geminiApiKey) {
      if (
        !this._geminiClient ||
        this._geminiClient.apiKey !== settings.geminiApiKey ||
        this._geminiClient.model !== settings.geminiModel
      ) {
        this._geminiClient = new GeminiClient(settings.geminiApiKey, settings.geminiModel);
      }
    } else {
      this._geminiClient = null; // clear stale client if key was removed
    }

    return { settings, ollama: this._ollamaClient, gemini: this._geminiClient };
  }

  /**
   * Route a chat request to the appropriate LLM backend.
   * @param {Array<{role: string, content: string}>} messages
   * @param {AbortSignal} [signal]
   * @returns {Promise<{ text: string, backend: string, model: string }>}
   */
  async chat(messages, signal) {
    const { settings, ollama, gemini } = await this._getClients();

    // Try Ollama first (always preferred for privacy)
    if (settings.llmBackend === 'ollama' || settings.llmBackend === 'auto') {
      try {
        logger.log('LLMRouter: trying Ollama...', settings.ollamaModel);
        const text = await ollama.chat({
          model: settings.ollamaModel,
          messages,
          temperature: settings.temperature,
          signal,
        });
        if (text) {
          return { text: cleanReplyText(text), backend: 'ollama', model: settings.ollamaModel };
        }
      } catch (e) {
        logger.warn('LLMRouter: Ollama failed:', e.message);
        if (settings.llmBackend === 'ollama') {
          throw new Error(`Ollama failed: ${e.message}. Is Ollama running? Try: ollama serve`);
        }
        // Fall through to Gemini if backend is 'auto'
      }
    }

    // Try Gemini fallback
    if (settings.llmBackend === 'gemini' || settings.llmBackend === 'auto') {
      if (!gemini) {
        throw new Error('Gemini API key not configured. Go to extension Settings to add one.');
      }
      try {
        logger.log('LLMRouter: trying Gemini...', settings.geminiModel);
        const text = await gemini.chat({ messages, temperature: settings.temperature, signal });
        if (text) {
          return { text: cleanReplyText(text), backend: 'gemini', model: settings.geminiModel };
        }
      } catch (e) {
        logger.error('LLMRouter: Gemini failed:', e.message);
        throw new Error(`Gemini failed: ${e.message}`);
      }
    }

    throw new Error('No LLM backend available. Configure Ollama or Gemini API in Settings.');
  }

  /**
   * Check if Ollama is reachable.
   */
  async pingOllama() {
    const { settings, ollama } = await this._getClients();
    return ollama.ping();
  }

  /**
   * List available models from Ollama.
   */
  async getOllamaModels() {
    const { ollama } = await this._getClients();
    return ollama.listModels();
  }
}

// Singleton instance for the service worker lifetime
export const llmRouter = new LLMRouter();
