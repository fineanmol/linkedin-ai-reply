/**
 * claude-client.js
 * Two ways to reach Claude:
 *   - ClaudeBridgeClient: talks to the local bridge (bridge/claude-bridge.js),
 *     which speaks the Ollama API and shells out to `claude -p`. Uses the
 *     user's Claude Code login; the prompt still goes to Anthropic.
 *   - ClaudeApiClient: calls the Anthropic Messages API directly with the
 *     user's own API key via the official SDK.
 * Both are CLOUD backends — post/comment text leaves the browser.
 */

import Anthropic from '@anthropic-ai/sdk';
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

// ─── Bridge mode (local Ollama-compatible bridge → Claude Code) ────────────

export class ClaudeBridgeClient {
  constructor(baseUrl = 'http://localhost:11435', token = '') {
    this.baseUrl = (baseUrl || 'http://localhost:11435').replace(/\/$/, '');
    this.token = token || '';
  }

  _headers(extra = {}) {
    const h = { ...extra };
    if (this.token) h['X-Bridge-Token'] = this.token;
    return h;
  }

  /** True only if the server answers AND identifies itself as our bridge. */
  async ping() {
    try {
      const res = await fetch(`${this.baseUrl}/api/version`, {
        headers: this._headers(),
        signal: AbortSignal.timeout(3000),
      });
      if (!res.ok) return false;
      const data = await res.json().catch(() => ({}));
      return data?.name === 'claude-bridge';
    } catch {
      return false;
    }
  }

  async listModels() {
    try {
      const res = await fetch(`${this.baseUrl}/api/tags`, {
        headers: this._headers(),
        signal: AbortSignal.timeout(5000),
      });
      if (!res.ok) return [];
      const data = await res.json();
      return (data.models || []).map(m => m.name);
    } catch (e) {
      logger.warn('ClaudeBridgeClient.listModels failed:', e.message);
      return [];
    }
  }

  /**
   * @param {object} params
   * @param {string} params.model - e.g. 'claude-opus-5-5'
   * @param {Array<{role: string, content: string}>} params.messages
   * @param {AbortSignal} [params.signal]
   * @returns {Promise<string>} raw assistant text
   */
  async chat({ model, messages, signal }) {
    const url = `${this.baseUrl}/api/chat`;
    logger.log('ClaudeBridgeClient.chat →', model, messages.at(-1)?.content?.slice(0, 80));

    let res;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: this._headers({ 'Content-Type': 'application/json' }),
        body: JSON.stringify({ model, messages, stream: false }),
        signal: withTimeout(signal, CHAT_TIMEOUT_MS),
      });
    } catch (e) {
      // Aborts/timeouts should surface as-is; network failures get the hint.
      if (e?.name === 'AbortError' || e?.name === 'TimeoutError') throw e;
      throw new Error(`Claude bridge not reachable at ${this.baseUrl}. Start it with: npm run bridge`);
    }

    if (!res.ok) {
      const err = await res.text().catch(() => '');
      if (res.status === 401) {
        throw new Error('Claude bridge rejected the token (401). Check the bridge token in Settings matches BRIDGE_TOKEN.');
      }
      throw new Error(`Claude bridge error ${res.status}: ${err.slice(0, 300)}`);
    }

    const data = await res.json();
    if (data?.error) throw new Error(`Claude bridge error: ${data.error}`);
    return data.message?.content?.trim() || '';
  }
}

// ─── API mode (official Anthropic SDK, user's own key) ─────────────────────

// Models that support the server-side fallback beta.
const FALLBACK_MODELS = new Set(['claude-opus-5-5', 'claude-sonnet-5-5']);

/**
 * Convert our {role, content}[] into the Messages API shape:
 * system turns → one top-level system string; consecutive same-role turns
 * merged; first message must be 'user'. No assistant prefill (a trailing
 * assistant turn is dropped).
 * Exported for testing.
 */
export function toAnthropicMessages(messages) {
  const systemParts = [];
  const out = [];
  for (const msg of messages || []) {
    const content = String(msg?.content ?? '');
    if (msg?.role === 'system') {
      if (content.trim()) systemParts.push(content);
      continue;
    }
    const role = msg?.role === 'assistant' ? 'assistant' : 'user';
    const last = out.at(-1);
    if (last && last.role === role) {
      last.content += `\n\n${content}`;
    } else {
      out.push({ role, content });
    }
  }
  // First message must be user.
  while (out.length && out[0].role !== 'user') out.shift();
  // No assistant prefill.
  while (out.length && out.at(-1).role === 'assistant') out.pop();
  return { system: systemParts.join('\n\n'), messages: out };
}

/** Build the request body for client.beta.messages.create. Exported for testing. */
export function buildApiRequest(model, messages) {
  const { system, messages: msgs } = toAnthropicMessages(messages);
  const supportsFallback = FALLBACK_MODELS.has(model);
  const isHaiku = /haiku/i.test(model || '');
  return {
    model,
    max_tokens: 4096,
    ...(system ? { system } : {}),
    messages: msgs,
    ...(supportsFallback ? { betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' } : {}),
    ...(!isHaiku ? { output_config: { effort: 'low' } } : {}),
  };
}

export class ClaudeApiClient {
  constructor(apiKey, model = 'claude-opus-5-5') {
    this.apiKey = apiKey;
    this.model = model;
    this._client = apiKey ? new Anthropic({ apiKey, dangerouslyAllowBrowser: true }) : null;
  }

  /**
   * @param {object} params
   * @param {Array<{role: string, content: string}>} params.messages
   * @param {AbortSignal} [params.signal]
   * @returns {Promise<string>} raw assistant text
   */
  async chat({ messages, signal }) {
    if (!this._client) {
      throw new Error('Anthropic API key not configured. Add one in extension Settings → Claude.');
    }
    const request = buildApiRequest(this.model, messages);
    if (!request.messages.length) throw new Error('Nothing to send to Claude (no user message).');

    logger.log('ClaudeApiClient.chat →', this.model, request.messages.at(-1)?.content?.slice(0, 80));

    let response;
    try {
      response = await this._client.beta.messages.create(request, {
        signal: withTimeout(signal, CHAT_TIMEOUT_MS),
      });
    } catch (e) {
      throw mapAnthropicError(e);
    }

    if (response?.stop_reason === 'refusal') {
      throw new Error('Claude declined to answer this one (refusal). Try rephrasing, or use a different backend.');
    }

    // Text blocks only — ignore thinking / fallback / other block types.
    const text = (response?.content || [])
      .filter(b => b?.type === 'text' && typeof b.text === 'string')
      .map(b => b.text)
      .join('')
      .trim();
    if (!text) throw new Error('Claude returned an empty response');
    return text;
  }
}

function mapAnthropicError(e) {
  if (e instanceof Anthropic.APIUserAbortError || e?.name === 'AbortError' || e?.name === 'TimeoutError') {
    return e;
  }
  if (e instanceof Anthropic.AuthenticationError) return new Error('Invalid Anthropic API key');
  if (e instanceof Anthropic.RateLimitError) return new Error('Anthropic rate limit — try again shortly');
  if (e instanceof Anthropic.APIError) {
    const msg = e.error?.error?.message || e.message || 'Unknown error';
    return new Error(`Anthropic API error ${e.status ?? ''}: ${msg}`.replace(/\s+:/, ':'));
  }
  return e instanceof Error ? e : new Error(String(e));
}
