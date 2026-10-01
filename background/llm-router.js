/**
 * llm-router.js
 * Routes LLM requests to the backend the user picked in Settings:
 *   ollama (local) | gemini (cloud) | claude (cloud: local bridge or API) | auto
 * 'auto' = Ollama first, Gemini fallback. Never auto-selects cloud unless the
 * user chose 'auto' or a cloud backend.
 *
 * Returns RAW model text — post-processing (toComment / toPost / JSON parse)
 * happens at the call sites, because comments, posts and scoring need
 * different cleanup.
 */

import { OllamaClient } from './ollama-client.js';
import { GeminiClient } from './gemini-client.js';
import { ClaudeBridgeClient, ClaudeApiClient } from './claude-client.js';
import { getSettings } from '../utils/storage.js';
import { BACKENDS } from '../utils/constants.js';
import logger from '../utils/logger.js';

// ─── Provider Registry ─────────────────────────────────────────────────────
// Each provider: { id, describe(settings) → {model,label,isLocal},
//                  chat(clients, settings, messages, signal) → raw text,
//                  ping(clients, settings) → {alive, error?} }

const PROVIDERS = {
  ollama: {
    id: 'ollama',
    describe: (s) => ({ model: s.ollamaModel, label: BACKENDS.ollama.label, isLocal: true }),
    async chat({ ollama }, s, messages, signal) {
      try {
        return await ollama.chat({ model: s.ollamaModel, messages, temperature: s.temperature, signal });
      } catch (e) {
        // A user cancel / regenerate is not an Ollama problem — pass it through.
        if (signal?.aborted) throw e;
        throw new Error(`Ollama failed: ${e.message}. Is Ollama running? Try: ollama serve`);
      }
    },
    async ping({ ollama }) {
      const alive = await ollama.ping();
      return alive ? { alive } : { alive, error: 'Ollama not reachable. Is Ollama running? Try: ollama serve' };
    },
  },

  gemini: {
    id: 'gemini',
    describe: (s) => ({ model: s.geminiModel, label: BACKENDS.gemini.label, isLocal: false }),
    async chat({ gemini }, s, messages, signal) {
      if (!gemini) throw new Error('Gemini API key not configured. Go to extension Settings to add one.');
      try {
        return await gemini.chat({ messages, temperature: s.temperature, signal });
      } catch (e) {
        if (signal?.aborted) throw e; // user cancel — keep the AbortError as-is
        throw new Error(`Gemini failed: ${e.message}`);
      }
    },
    // Configured-key check only — no tokens spent on a status probe.
    async ping({ gemini }) {
      return gemini ? { alive: true } : { alive: false, error: 'Gemini API key not configured.' };
    },
  },

  claude: {
    id: 'claude',
    describe: (s) => ({
      model: s.claudeModel,
      label: s.claudeMode === 'api' ? 'Claude (API)' : 'Claude (Claude Code bridge)',
      isLocal: false,
    }),
    async chat({ claudeBridge, claudeApi }, s, messages, signal) {
      if (s.claudeMode === 'api') {
        if (!claudeApi) throw new Error('Anthropic API key not configured. Add one in extension Settings → Claude.');
        return claudeApi.chat({ messages, signal });
      }
      return claudeBridge.chat({ model: s.claudeModel, messages, signal });
    },
    async ping({ claudeBridge, claudeApi }) {
      if (claudeBridge === null) {
        // API mode: 'alive' = key configured. Don't spend tokens on a status check.
        return claudeApi ? { alive: true } : { alive: false, error: 'Anthropic API key not configured.' };
      }
      const alive = await claudeBridge.ping();
      return alive
        ? { alive }
        : { alive, error: `Claude bridge not reachable at ${claudeBridge.baseUrl}. Start it with: npm run bridge` };
    },
    async listModels({ claudeBridge }) {
      return claudeBridge ? claudeBridge.listModels() : [];
    },
  },
};

export class LLMRouter {
  constructor() {
    this._ollamaClient = null;
    this._geminiClient = null;
    this._claudeBridge = null;
    this._claudeApi = null;
  }

  async _getClients() {
    const settings = await getSettings();

    // Always rebuild Ollama client if URL changed
    if (!this._ollamaClient || this._ollamaClient.baseUrl !== String(settings.ollamaUrl || '').replace(/\/$/, '')) {
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

    // Claude: only the client for the selected mode is kept; the other is null
    // (ping() uses that to tell the modes apart).
    if (settings.claudeMode === 'api') {
      this._claudeBridge = null;
      if (settings.claudeApiKey) {
        if (
          !this._claudeApi ||
          this._claudeApi.apiKey !== settings.claudeApiKey ||
          this._claudeApi.model !== settings.claudeModel
        ) {
          this._claudeApi = new ClaudeApiClient(settings.claudeApiKey, settings.claudeModel);
        }
      } else {
        this._claudeApi = null;
      }
    } else {
      this._claudeApi = null;
      const url = String(settings.claudeBridgeUrl || 'http://localhost:11435').replace(/\/$/, '');
      const token = settings.claudeBridgeToken || '';
      if (!this._claudeBridge || this._claudeBridge.baseUrl !== url || this._claudeBridge.token !== token) {
        this._claudeBridge = new ClaudeBridgeClient(url, token);
      }
    }

    return {
      settings,
      clients: {
        ollama: this._ollamaClient,
        gemini: this._geminiClient,
        claudeBridge: this._claudeBridge,
        claudeApi: this._claudeApi,
      },
    };
  }

  /** Ordered provider ids to try for the selected backend. */
  _chain(backend) {
    if (backend === 'auto') return ['ollama', 'gemini'];
    if (PROVIDERS[backend]) return [backend];
    return ['ollama']; // unknown value → safest (local) default
  }

  /**
   * Route a chat request to the appropriate LLM backend.
   * @param {Array<{role: string, content: string}>} messages
   * @param {AbortSignal} [signal]
   * @returns {Promise<{ text: string, backend: string, model: string, label: string, isLocal: boolean }>}
   *   text is the RAW model output — callers post-process it.
   */
  async chat(messages, signal) {
    const { settings, clients } = await this._getClients();
    const chain = this._chain(settings.llmBackend);
    let lastError = null;

    for (let i = 0; i < chain.length; i++) {
      const provider = PROVIDERS[chain[i]];
      const meta = provider.describe(settings);
      const isLast = i === chain.length - 1;
      try {
        logger.log(`LLMRouter: trying ${meta.label}...`, meta.model);
        const text = await provider.chat(clients, settings, messages, signal);
        if (text) {
          return { text, backend: provider.id, ...meta };
        }
        lastError = new Error(`${meta.label} returned an empty response`);
      } catch (e) {
        // A user cancel must not fall through to the next (cloud) backend.
        if (signal?.aborted) throw e;
        logger.warn(`LLMRouter: ${meta.label} failed:`, e.message);
        if (isLast) {
          // In 'auto', show why the earlier backend(s) failed too.
          if (lastError) throw new Error(`${lastError.message} — then ${e.message}`);
          throw e;
        }
        lastError = e;
        // 'auto': fall through to the next provider
      }
    }

    throw lastError || new Error('No LLM backend available. Configure Ollama, Gemini or Claude in Settings.');
  }

  /**
   * Status of the currently selected backend (for 'auto': Ollama if alive,
   * else Gemini). Never spends tokens.
   * @returns {Promise<{ alive: boolean, backend: string, label: string, model: string, isLocal: boolean, error?: string }>}
   */
  async checkBackend() {
    const { settings, clients } = await this._getClients();
    const chain = this._chain(settings.llmBackend);
    let result = null;
    for (const id of chain) {
      const provider = PROVIDERS[id];
      let status;
      try {
        status = await provider.ping(clients, settings);
      } catch (e) {
        status = { alive: false, error: e.message };
      }
      result = { ...status, backend: id, ...provider.describe(settings) };
      if (status.alive) return result;
    }
    return result;
  }

  /**
   * Check if Ollama is reachable.
   */
  async pingOllama() {
    const { clients } = await this._getClients();
    return clients.ollama.ping();
  }

  /**
   * List available models from Ollama.
   */
  async getOllamaModels() {
    const { clients } = await this._getClients();
    return clients.ollama.listModels();
  }
}

// Singleton instance for the service worker lifetime
export const llmRouter = new LLMRouter();
