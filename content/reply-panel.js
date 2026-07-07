/**
 * reply-panel.js
 * The floating reply suggestion panel rendered in Shadow DOM.
 * Decoupled controller that imports styles, icons, and templates from content/ui/
 */

import { MSG } from '../utils/constants.js';
import { copyToClipboard } from '../utils/dom-helpers.js';
import logger from '../utils/logger.js';

import { PANEL_CSS } from './ui/styles.js';
import * as templates from './ui/templates.js';
import * as icons from './ui/icons.js';

export const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash', label: 'Gemini 2.5 Flash' },
  { id: 'gemini-2.5-pro',   label: 'Gemini 2.5 Pro' },
  { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
  { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash' },
];


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
    this._generationActive = false;
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
    this._cancelInflight();
    if (this._closeDropdownListener) {
      document.removeEventListener('click', this._closeDropdownListener, { capture: true });
    }
    this.shadowHost?.remove();
  }

  // ─── Rendering ─────────────────────────────────────────────────────────

  _renderLoading() {
    this._container.innerHTML = templates.loadingHTML(
      this.opts.intent,
      this._settings,
      this._ollamaModels
    );
    this._bindClose();
  }

  _renderReply(text, backend, model) {
    this.currentReply = text;
    this.backend = backend;
    this.model = model;
    const wordCount = text.split(/\s+/).filter(Boolean).length;

    this._container.innerHTML = templates.replyHTML(
      this.opts.intent,
      this._settings,
      this._ollamaModels,
      text,
      backend,
      model,
      wordCount
    );

    this._bindClose();
    this._bindActions();
  }

  _renderError(errorMsg) {
    const isOllamaError = errorMsg.toLowerCase().includes('ollama') || errorMsg.includes('localhost');
    const is403Error = isOllamaError && (errorMsg.includes('403') || errorMsg.toLowerCase().includes('forbidden') || errorMsg.toLowerCase().includes('cors'));

    let hintHTML = '';
    if (is403Error) {
      hintHTML = `
        <div class="error-hint" style="margin-top: 8px; padding-top: 8px; border-top: 1px dashed var(--border-color); font-size: 11.5px; line-height: 1.5;">
          <strong>🔒 CORS Permission Blocked (403 Forbidden)</strong><br>
          Ollama blocks requests from browser extensions by default. Start Ollama with allowed origins.<br><br>
          <strong>On macOS:</strong><br>
          1. Quit the Ollama app.<br>
          2. Run in Terminal:<br>
          <code>launchctl setenv OLLAMA_ORIGINS "*"</code><br>
          3. Re-open Ollama.<br>
          <em>Alternative (run directly):</em> <code>OLLAMA_ORIGINS="*" ollama serve</code>
        </div>
      `;
    } else if (isOllamaError) {
      hintHTML = `
        <div class="error-hint">
          Make sure Ollama is running:<br>
          <code>ollama serve</code> &nbsp;&middot;&nbsp; <code>ollama pull gemma2:2b</code>
        </div>
      `;
    }

    this._container.innerHTML = templates.errorHTML(
      this.opts.intent,
      this._settings,
      this._ollamaModels,
      errorMsg,
      hintHTML
    );
    this._bindClose();
    this._bindActions();
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
        btn.innerHTML = `${icons.CHECK_ICON} <span>Copied suggestion!</span>`;
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
        btn.innerHTML = `<span>Copy failed</span>`;
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
    // Cancel any prior in-flight generation for this comment (e.g. on regenerate)
    // before starting a new one, so the old LLM call is actually aborted.
    this._cancelInflight();
    this._generationActive = true;

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

      // If the panel was closed / regenerated while we awaited, drop the result.
      if (!this._generationActive) return;

      if (response?.error) {
        this._renderError(response.error);
      } else {
        this._renderReply(response.reply, response.backend, response.model);
      }
    } catch (e) {
      if (!this._generationActive) return;
      logger.error('ReplyPanel._generate error:', e);
      this._renderError(e.message || 'Unexpected error. Please try again.');
    } finally {
      this._generationActive = false;
    }
  }

  /**
   * Tell the background worker to abort the in-flight LLM request for this
   * comment, and mark the local generation inactive so a late response is
   * ignored. Fire-and-forget — the worker no-ops if nothing is in flight.
   */
  _cancelInflight() {
    if (!this._generationActive) return;
    this._generationActive = false;
    chrome.runtime.sendMessage({
      type: MSG.CANCEL_REPLY,
      payload: {
        commentId: this.opts.commentId,
        commentText: this.opts.commentText,
        intent: this.opts.intent,
      },
    }).catch(() => {});
  }

  _escapeHTML(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
}
