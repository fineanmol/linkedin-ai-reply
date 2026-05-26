/**
 * reply-panel.js
 * The floating reply suggestion panel rendered in Shadow DOM.
 * Completely isolated from LinkedIn's CSS — will not break with LinkedIn updates.
 */

import { INTENT_CONFIG, MSG, OLLAMA_MODELS } from '../utils/constants.js';
import { copyToClipboard } from '../utils/dom-helpers.js';
import logger from '../utils/logger.js';

const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash', icon: '⚡' },
  { id: 'gemini-2.5-pro',   label: 'Gemini 2.5 Pro',   icon: '🧠' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', icon: '☁️' },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', icon: '☁️' },
];

const PANEL_CSS = `
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  }

  .panel {
    position: relative;
    background: #0f172a;
    border: 1px solid rgba(99, 102, 241, 0.3);
    border-radius: 16px;
    padding: 20px;
    margin: 12px 0 8px 0;
    box-shadow: 0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.1);
    color: #e2e8f0;
    animation: slideIn 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    max-width: 680px;
    width: 100%;
    box-sizing: border-box;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.98); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 14px;
    gap: 8px;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #94a3b8;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    flex-shrink: 0;
  }

  .panel-title svg {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
  }

  /* ── Model Switcher ── */
  .model-switcher {
    position: relative;
    margin-left: auto;
    flex-shrink: 0;
  }

  .model-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    background: rgba(99,102,241,0.12);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
    transition: all 0.15s;
    white-space: nowrap;
    user-select: none;
  }

  .model-pill:hover {
    background: rgba(99,102,241,0.22);
    border-color: rgba(99,102,241,0.55);
    color: #c7d2fe;
  }

  .model-pill .caret {
    font-size: 9px;
    opacity: 0.7;
    transition: transform 0.2s;
  }

  .model-pill.open .caret {
    transform: rotate(180deg);
  }

  .model-dropdown {
    display: none;
    position: absolute;
    top: calc(100% + 6px);
    right: 0;
    min-width: 220px;
    background: #1e293b;
    border: 1px solid rgba(99,102,241,0.35);
    border-radius: 10px;
    box-shadow: 0 12px 40px rgba(0,0,0,0.6);
    z-index: 9999;
    overflow: hidden;
    animation: dropIn 0.15s cubic-bezier(0.34,1.56,0.64,1);
  }

  @keyframes dropIn {
    from { opacity:0; transform: translateY(-6px) scale(0.97); }
    to   { opacity:1; transform: translateY(0)   scale(1); }
  }

  .model-dropdown.open {
    display: block;
  }

  .model-section-label {
    padding: 8px 12px 4px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #475569;
  }

  .model-option {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    font-size: 12px;
    color: #cbd5e1;
    cursor: pointer;
    transition: background 0.12s;
  }

  .model-option:hover {
    background: rgba(99,102,241,0.15);
    color: #e2e8f0;
  }

  .model-option.active {
    background: rgba(99,102,241,0.2);
    color: #a5b4fc;
    font-weight: 600;
  }

  .model-option .model-icon {
    font-size: 13px;
    width: 18px;
    text-align: center;
    flex-shrink: 0;
  }

  .model-option .model-check {
    margin-left: auto;
    color: #6366f1;
    font-size: 13px;
  }

  .model-divider {
    height: 1px;
    background: rgba(255,255,255,0.06);
    margin: 4px 0;
  }

  .intent-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.03em;
  }

  .close-btn {
    background: none;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    transition: color 0.15s, background 0.15s;
    margin-left: auto;
  }

  .close-btn:hover {
    color: #e2e8f0;
    background: rgba(255,255,255,0.08);
  }

  .reply-textarea {
    width: 100%;
    min-height: 90px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    padding: 12px 14px;
    color: #f1f5f9;
    font-size: 14px;
    line-height: 1.6;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.2s;
    font-family: inherit;
  }

  .reply-textarea:focus {
    border-color: rgba(99, 102, 241, 0.6);
    background: rgba(255,255,255,0.06);
  }

  .reply-textarea::placeholder {
    color: #475569;
  }

  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    margin-bottom: 14px;
  }

  .backend-badge {
    font-size: 11px;
    color: #475569;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .backend-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #22c55e;
    display: inline-block;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .word-count {
    font-size: 11px;
    color: #475569;
  }

  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border-radius: 8px;
    border: none;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    letter-spacing: 0.01em;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-approve {
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .btn-approve:hover:not(:disabled) {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    box-shadow: 0 4px 20px rgba(99, 102, 241, 0.5);
    transform: translateY(-1px);
  }

  .btn-approve.copied {
    background: linear-gradient(135deg, #10b981, #059669);
    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
  }

  .btn-regenerate {
    background: rgba(255,255,255,0.06);
    color: #94a3b8;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .btn-regenerate:hover:not(:disabled) {
    background: rgba(255,255,255,0.1);
    color: #e2e8f0;
  }

  .btn-reject {
    background: rgba(239, 68, 68, 0.08);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.2);
  }

  .btn-reject:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.15);
  }

  .learn-row {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  .learn-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 4px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    background: transparent;
    transition: all 0.15s;
  }

  .learn-checkbox:checked {
    background: #6366f1;
    border-color: #6366f1;
  }

  .learn-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 5px;
    height: 9px;
    border: 2px solid white;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  .learn-label {
    font-size: 12px;
    color: #64748b;
    cursor: pointer;
    user-select: none;
  }

  /* Loading State */
  .loading-state {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 20px 0;
  }

  .spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba(99,102,241,0.2);
    border-top-color: #6366f1;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 14px;
    color: #64748b;
  }

  /* Error State */
  .error-state {
    background: rgba(239, 68, 68, 0.08);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 8px;
    padding: 12px 14px;
    color: #fca5a5;
    font-size: 13px;
    line-height: 1.5;
    margin: 8px 0;
  }

  .error-hint {
    font-size: 12px;
    color: #94a3b8;
    margin-top: 8px;
  }

  code {
    background: rgba(255,255,255,0.08);
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'SF Mono', 'Fira Code', monospace;
    font-size: 11px;
  }
`;

// ─── Panel Component ───────────────────────────────────────────────────────

export class ReplyPanel {
  /**
   * @param {object} opts
   * @param {string} opts.commentId
   * @param {string} opts.commentText
   * @param {string} opts.authorName
   * @param {string} opts.postContent
   * @param {string} opts.intent
   * @param {Function} opts.onClose
   * @param {Function} opts.onApprove - Called with { text, intent, commentId }
   */
  constructor(opts) {
    this.opts = opts;
    this.shadowHost = null;
    this.shadow = null;
    this.currentReply = '';
    this.backend = '';
    this.model = '';
    this._abortController = null;
    // Current settings snapshot used by the model switcher
    this._settings = null;
    this._ollamaModels = [];
  }

  /**
   * Mount the panel into the DOM after `anchorEl`.
   * @param {Element} anchorEl
   */
  mount(anchorEl) {
    // Remove any existing panel for this comment
    const existingId = `liar-panel-${this.opts.commentId}`;
    document.getElementById(existingId)?.remove();

    this.shadowHost = document.createElement('div');
    this.shadowHost.id = existingId;
    this.shadowHost.className = 'liar-shadow-host';
    this.shadowHost.style.cssText = 'display:block;width:100%;';

    this.shadow = this.shadowHost.attachShadow({ mode: 'closed' });

    const style = document.createElement('style');
    style.textContent = PANEL_CSS;
    this.shadow.appendChild(style);

    this._container = document.createElement('div');
    this._container.className = 'panel';
    this.shadow.appendChild(this._container);

    // Insert after the anchor element (the AI Reply button)
    anchorEl.parentNode?.insertBefore(this.shadowHost, anchorEl.nextSibling);
    // Or if that fails, append inside the comment element
    if (!this.shadowHost.isConnected) {
      anchorEl.after(this.shadowHost);
    }

    // Load settings + Ollama models for the switcher, then generate
    this._loadSettingsAndGenerate();
  }

  async _loadSettingsAndGenerate() {
    try {
      const [settingsResp, ollamaResp] = await Promise.all([
        chrome.runtime.sendMessage({ type: MSG.GET_SETTINGS }),
        chrome.runtime.sendMessage({ type: MSG.GET_OLLAMA_MODELS }).catch(() => ({ models: [] })),
      ]);
      this._settings = settingsResp || {};
      this._ollamaModels = ollamaResp?.models || [];
    } catch (e) {
      this._settings = {};
      this._ollamaModels = [];
    }
    this._renderLoading();
    this._generate();
  }

  unmount() {
    this._abortController?.abort();
    if (this._closeDropdownListener) {
      document.removeEventListener('click', this._closeDropdownListener, { capture: true });
    }
    this.shadowHost?.remove();
  }

  // ─── Rendering ─────────────────────────────────────────────────────────

  _renderLoading() {
    const intentCfg = INTENT_CONFIG[this.opts.intent] || INTENT_CONFIG['general'];
    this._container.innerHTML = `
      ${this._headerHTML(intentCfg)}
      <div class="loading-state">
        <div class="spinner"></div>
        <span class="loading-text">Generating reply in your style…</span>
      </div>
    `;
    this._bindClose();
  }

  _renderReply(text, backend, model) {
    this.currentReply = text;
    this.backend = backend;
    this.model = model;
    const intentCfg = INTENT_CONFIG[this.opts.intent] || INTENT_CONFIG['general'];
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    this._container.innerHTML = `
      ${this._headerHTML(intentCfg)}
      <textarea class="reply-textarea" id="liar-textarea" spellcheck="true">${this._escapeHTML(text)}</textarea>
      <div class="meta-row">
        <span class="backend-badge">
          <span class="dot"></span>
          ${backend === 'ollama' ? `🏠 Local — ${model}` : `☁️ Gemini — ${model}`}
        </span>
        <span class="word-count" id="liar-word-count">${wordCount} words</span>
      </div>
      <div class="actions">
        <button class="btn btn-approve" id="liar-approve">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          Copy to clipboard
        </button>
        <button class="btn btn-regenerate" id="liar-regen">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          Regenerate
        </button>
        <button class="btn btn-reject" id="liar-reject">
          Dismiss
        </button>
      </div>
      <div class="learn-row">
        <input type="checkbox" class="learn-checkbox" id="liar-learn" checked>
        <label class="learn-label" for="liar-learn">Learn from this reply to improve my style profile</label>
      </div>
    `;

    this._bindClose();
    this._bindActions();
  }

  _renderError(errorMsg) {
    const intentCfg = INTENT_CONFIG[this.opts.intent] || INTENT_CONFIG['general'];
    const isOllamaError = errorMsg.toLowerCase().includes('ollama') || errorMsg.includes('localhost');
    const is403Error = isOllamaError && (errorMsg.includes('403') || errorMsg.toLowerCase().includes('forbidden') || errorMsg.toLowerCase().includes('cors'));

    let hintHTML = '';
    if (is403Error) {
      hintHTML = `
        <div class="error-hint" style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed rgba(239, 68, 68, 0.2); font-size: 12px; line-height: 1.6;">
          <strong>🔒 CORS Permission Blocked (403 Forbidden)</strong><br>
          Ollama blocks requests from browser extensions by default. You must start Ollama with allowed origins.<br><br>
          <strong>On macOS:</strong><br>
          1. Quit the Ollama app from the menu bar.<br>
          2. Run this command in Terminal:<br>
          <code>launchctl setenv OLLAMA_ORIGINS "*"</code><br>
          3. Re-open the Ollama app.<br>
          <em>Alternative (run directly):</em> <code>OLLAMA_ORIGINS="*" ollama serve</code><br><br>
          <strong>On Windows:</strong><br>
          1. Quit Ollama from the system tray.<br>
          2. Open Environment Variables and add a new user/system variable named <code>OLLAMA_ORIGINS</code> with value <code>*</code>.<br>
          3. Restart Ollama.
        </div>
      `;
    } else if (isOllamaError) {
      hintHTML = `
        <div class="error-hint">
          Make sure Ollama is running:<br>
          <code>ollama serve</code> &nbsp;·&nbsp; <code>ollama pull gemma2:2b</code>
        </div>
      `;
    }

    this._container.innerHTML = `
      ${this._headerHTML(intentCfg)}
      <div class="error-state">
        <strong>⚠️ Could not generate reply</strong><br>
        ${this._escapeHTML(errorMsg)}
        ${hintHTML}
      </div>
      <div class="actions">
        <button class="btn btn-regenerate" id="liar-regen">Try again</button>
        <button class="btn btn-reject" id="liar-reject">Dismiss</button>
      </div>
    `;
    this._bindClose();
    this._bindActions();
  }

  _headerHTML(intentCfg) {
    const s = this._settings || {};
    const backend = s.llmBackend || 'gemini';
    const activeModel = backend === 'ollama'
      ? (s.ollamaModel || 'local')
      : (s.geminiModel || 'gemini-2.5-flash');
    const shortLabel = activeModel.replace('gemini-', 'Gemini ').replace('-flash', ' Flash').replace('-pro', ' Pro');

    return `
      <div class="panel-header">
        <div class="panel-title">
          <svg viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 2a10 10 0 1 0 10 10"/><path d="M12 12l8-8"/><path d="M18 2h4v4"/>
          </svg>
          AI Reply
        </div>
        <span class="intent-badge" style="background:${intentCfg.color}22;color:${intentCfg.color};border:1px solid ${intentCfg.color}44;">
          ${intentCfg.emoji} ${intentCfg.label}
        </span>
        <div class="model-switcher" id="liar-model-switcher">
          <div class="model-pill" id="liar-model-pill" title="Switch model">
            ${backend === 'ollama' ? '🏠' : '✨'} ${shortLabel} <span class="caret">▾</span>
          </div>
          <div class="model-dropdown" id="liar-model-dropdown">
            ${this._modelDropdownHTML(backend, activeModel)}
          </div>
        </div>
        <button class="close-btn" id="liar-close" aria-label="Close panel">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;
  }

  _modelDropdownHTML(backend, activeModel) {
    const geminiItems = GEMINI_MODELS.map(m => `
      <div class="model-option ${backend === 'gemini' && activeModel === m.id ? 'active' : ''}"
           data-backend="gemini" data-model="${m.id}">
        <span class="model-icon">${m.icon}</span>
        ${m.label}
        ${backend === 'gemini' && activeModel === m.id ? '<span class="model-check">✓</span>' : ''}
      </div>
    `).join('');

    const ollamaItems = this._ollamaModels.length > 0
      ? this._ollamaModels.map(id => {
          const known = OLLAMA_MODELS.find(m => m.id === id);
          const label = known ? known.label.split('—')[0].trim() : id;
          return `
            <div class="model-option ${backend === 'ollama' && activeModel === id ? 'active' : ''}"
                 data-backend="ollama" data-model="${id}">
              <span class="model-icon">🏠</span>
              ${label}
              ${backend === 'ollama' && activeModel === id ? '<span class="model-check">✓</span>' : ''}
            </div>
          `;
        }).join('')
      : '<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">🏠</span>No local models found</div>';

    return `
      <div class="model-section-label">☁️ Gemini (Cloud)</div>
      ${geminiItems}
      <div class="model-divider"></div>
      <div class="model-section-label">🏠 Ollama (Local)</div>
      ${ollamaItems}
    `;
  }

  // ─── Actions ────────────────────────────────────────────────────────────

  _bindClose() {
    this.shadow.getElementById('liar-close')?.addEventListener('click', () => {
      this.unmount();
      this.opts.onClose?.();
    });
    this._bindModelSwitcher();
  }

  _bindModelSwitcher() {
    const pill = this.shadow.getElementById('liar-model-pill');
    const dropdown = this.shadow.getElementById('liar-model-dropdown');
    if (!pill || !dropdown) return;

    // Toggle dropdown on pill click
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      pill.classList.toggle('open', isOpen);
    });

    // Close when clicking outside
    const closeDropdown = (e) => {
      if (!this.shadow.getElementById('liar-model-switcher')?.contains(e.target)) {
        dropdown.classList.remove('open');
        pill.classList.remove('open');
      }
    };
    // Use document on the shadow root's host document
    document.addEventListener('click', closeDropdown, { once: false, capture: true });
    // Cleanup when panel unmounts
    this._closeDropdownListener = closeDropdown;

    // Handle model selection
    dropdown.addEventListener('click', async (e) => {
      const option = e.target.closest('.model-option[data-model]');
      if (!option) return;

      const newBackend = option.dataset.backend;
      const newModel   = option.dataset.model;

      // Update local settings snapshot
      if (!this._settings) this._settings = {};
      this._settings.llmBackend = newBackend;
      if (newBackend === 'gemini') {
        this._settings.geminiModel = newModel;
      } else {
        this._settings.ollamaModel = newModel;
      }

      // Persist to storage via background
      try {
        await chrome.runtime.sendMessage({
          type: MSG.SAVE_SETTINGS,
          payload: this._settings,
        });
        logger.log('Model switched to', newBackend, newModel);
      } catch (err) {
        logger.warn('Could not save model setting:', err);
      }

      // Close dropdown
      dropdown.classList.remove('open');
      pill.classList.remove('open');

      // Regenerate reply with new model
      this._renderLoading();
      this._generate(true);
    });
  }

  _bindActions() {
    // Live word count update
    const textarea = this.shadow.getElementById('liar-textarea');
    const wordCountEl = this.shadow.getElementById('liar-word-count');
    if (textarea && wordCountEl) {
      textarea.addEventListener('input', () => {
        const count = textarea.value.split(/\s+/).filter(Boolean).length;
        wordCountEl.textContent = `${count} words`;
        this.currentReply = textarea.value;
      });
    }

    // Approve (copy to clipboard)
    this.shadow.getElementById('liar-approve')?.addEventListener('click', async (e) => {
      const btn = e.currentTarget;
      const text = textarea?.value || this.currentReply;
      const shouldLearn = this.shadow.getElementById('liar-learn')?.checked;

      const ok = await copyToClipboard(text);
      if (ok) {
        btn.textContent = '✓ Copied! Paste into LinkedIn';
        btn.classList.add('copied');
        btn.disabled = true;

        // Learn from this reply if checkbox is checked
        if (shouldLearn && text.trim().length > 10) {
          try {
            await chrome.runtime.sendMessage({
              type: MSG.SAVE_STYLE_SAMPLE,
              payload: { text, intent: this.opts.intent, commentId: this.opts.commentId },
            });
          } catch (e) {
            logger.warn('Could not save style sample:', e);
          }
        }

        this.opts.onApprove?.({ text, intent: this.opts.intent, commentId: this.opts.commentId });
      } else {
        btn.textContent = '⚠️ Copy failed — try manual copy';
      }
    });

    // Regenerate
    this.shadow.getElementById('liar-regen')?.addEventListener('click', () => {
      this._renderLoading();
      this._generate(true);
    });

    // Reject / Dismiss
    this.shadow.getElementById('liar-reject')?.addEventListener('click', () => {
      this.unmount();
      this.opts.onClose?.();
    });
  }

  // ─── LLM Request ────────────────────────────────────────────────────────

  async _generate(forceRegenerate = false) {
    this._abortController?.abort();
    this._abortController = new AbortController();

    try {
      const response = await chrome.runtime.sendMessage({
        type: MSG.GENERATE_REPLY,
        payload: {
          commentId: this.opts.commentId,
          commentText: this.opts.commentText,
          authorName: this.opts.authorName,
          postContent: this.opts.postContent,
          intent: this.opts.intent,
          forceRegenerate,
        },
      });

      if (response?.error) {
        this._renderError(response.error);
      } else {
        this._renderReply(response.reply, response.backend, response.model);
      }
    } catch (e) {
      if (e.name === 'AbortError') return;
      logger.error('ReplyPanel._generate error:', e);
      this._renderError(e.message || 'Unexpected error. Please try again.');
    }
  }

  _escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
