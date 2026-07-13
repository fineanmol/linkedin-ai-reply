/**
 * templates.js
 * Modular HTML templates for the Reply Panel.
 * Uses brand colors and professional SVG icons, avoiding emojis/AI star slop.
 */

import * as icons from './icons.js';
import { GEMINI_MODELS } from '../reply-panel.js'; // relative to content/ui/
import { OLLAMA_MODELS } from '../../utils/constants.js';

// Intent styling mapping using brand colors and clean SVGs
export const INTENT_BRAND_MAP = {
  question: {
    label: 'Question',
    color: '#e95f5c', // Coral
    icon: icons.INTENT_ICONS.question,
    bg: 'rgba(233, 95, 92, 0.1)',
  },
  appreciation: {
    label: 'Appreciation',
    color: '#79ceb8', // Mint
    icon: icons.INTENT_ICONS.appreciation,
    bg: 'rgba(121, 206, 184, 0.1)',
  },
  feedback: {
    label: 'Feedback',
    color: '#ffdb00', // Sunshine
    icon: icons.INTENT_ICONS.feedback,
    bg: 'rgba(255, 219, 0, 0.15)', // Darker text/contrast is handled
  },
  criticism: {
    label: 'Criticism',
    color: '#e95f5c', // Coral
    icon: icons.INTENT_ICONS.criticism,
    bg: 'rgba(233, 95, 92, 0.1)',
  },
  technical: {
    label: 'Technical',
    color: '#5cc3e8', // Sky Blue
    icon: icons.INTENT_ICONS.technical,
    bg: 'rgba(92, 195, 232, 0.1)',
  },
  networking: {
    label: 'Networking',
    color: '#5cc3e8', // Sky Blue
    icon: icons.INTENT_ICONS.networking,
    bg: 'rgba(92, 195, 232, 0.1)',
  },
  general: {
    label: 'General',
    color: '#314855', // Navy
    icon: icons.INTENT_ICONS.general,
    bg: 'rgba(49, 72, 85, 0.08)',
  },
};

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Renders the top header bar, including intent badge, model switcher pill & dropdown, and close button.
 */
export function headerHTML(intent, settings, ollamaModels) {
  const currentIntent = INTENT_BRAND_MAP[intent] || INTENT_BRAND_MAP.general;
  const s = settings || {};
  const backend = s.llmBackend || 'gemini';
  const activeModel = backend === 'ollama'
    ? (s.ollamaModel || 'gemma2:2b')
    : (s.geminiModel || 'gemini-flash-latest');

  const shortLabel = activeModel
    .replace('gemini-', 'Gemini ')
    .replace('-flash', ' Flash')
    .replace('-pro', ' Pro');

  // Badge dynamic style
  const badgeStyle = `background: ${currentIntent.bg}; color: ${currentIntent.color}; border: 1px solid ${currentIntent.color}33;`;
  // Feedback label has sunshine yellow, color text Navy for contrast
  const isFeedback = intent === 'feedback';
  const badgeTextColor = isFeedback ? '#314855' : currentIntent.color;
  const finalBadgeStyle = isFeedback
    ? `background: ${currentIntent.bg}; color: ${badgeTextColor}; border: 1px solid rgba(49, 72, 85, 0.2);`
    : badgeStyle;

  return `
    <div class="panel-header">
      <div class="panel-title">
        ${icons.LOGO_ICON}
        AI Reply
      </div>
      <span class="intent-badge" style="${finalBadgeStyle}">
        ${currentIntent.icon}
        <span style="margin-left: 4px;">${currentIntent.label}</span>
      </span>
      <div class="model-switcher" id="liar-model-switcher">
        <div class="model-pill" id="liar-model-pill" title="Switch model">
          <span style="margin-right: 4px; display: flex; align-items: center; color: var(--sky-blue);">
            ${backend === 'ollama' ? '🏠' : '☁️'}
          </span>
          <span>${shortLabel}</span>
          <span style="margin-left: 6px; display: flex; align-items: center;">${icons.CARET_ICON}</span>
        </div>
        <div class="model-dropdown" id="liar-model-dropdown">
          ${modelDropdownHTML(backend, activeModel, ollamaModels)}
        </div>
      </div>
      <button class="close-btn" id="liar-close" aria-label="Close panel">
        ${icons.CLOSE_ICON}
      </button>
    </div>
  `;
}

/**
 * Renders the options inside the model selection dropdown list.
 */
function modelDropdownHTML(backend, activeModel, ollamaModels) {
  const geminiItems = GEMINI_MODELS.map(m => `
    <div class="model-option ${backend === 'gemini' && activeModel === m.id ? 'active' : ''}"
         data-backend="gemini" data-model="${m.id}">
      <span class="model-icon">☁️</span>
      <span>${m.label}</span>
      ${backend === 'gemini' && activeModel === m.id ? '<span class="model-check">✓</span>' : ''}
    </div>
  `).join('');

  const ollamaItems = ollamaModels && ollamaModels.length > 0
    ? ollamaModels.map(id => {
        const known = OLLAMA_MODELS.find(m => m.id === id);
        const label = known ? known.label.split('—')[0].trim() : id;
        return `
          <div class="model-option ${backend === 'ollama' && activeModel === id ? 'active' : ''}"
               data-backend="ollama" data-model="${id}">
            <span class="model-icon">🏠</span>
            <span>${label}</span>
            ${backend === 'ollama' && activeModel === id ? '<span class="model-check">✓</span>' : ''}
          </div>
        `;
      }).join('')
    : `<div class="model-option" style="opacity:0.4;cursor:default"><span class="model-icon">🏠</span>No local models found</div>`;

  return `
    <div class="model-section-label">Cloud Models</div>
    ${geminiItems}
    <div class="model-divider"></div>
    <div class="model-section-label">Local Models (Ollama)</div>
    ${ollamaItems}
  `;
}

/**
 * Loading state template.
 */
export function loadingHTML(intent, settings, ollamaModels) {
  return `
    ${headerHTML(intent, settings, ollamaModels)}
    <div class="loading-state">
      <div class="spinner"></div>
      <span class="loading-text">Analyzing style and drafting suggestion…</span>
    </div>
  `;
}

/**
 * Generated reply view template.
 */
export function replyHTML(intent, settings, ollamaModels, text, backend, model, wordCount) {
  return `
    ${headerHTML(intent, settings, ollamaModels)}
    <textarea class="reply-textarea" id="liar-textarea" spellcheck="true" placeholder="AI suggestion draft...">${escapeHTML(text)}</textarea>
    <div class="meta-row">
      <span class="backend-badge">
        <span class="dot"></span>
        ${backend === 'ollama' ? `Local Model &middot; ${model}` : `Cloud API &middot; ${model}`}
      </span>
      <span class="word-count" id="liar-word-count">${wordCount} words</span>
    </div>
    <div class="actions">
      <button class="btn btn-approve" id="liar-approve">
        ${icons.COPY_ICON}
        <span>Copy suggestion</span>
      </button>
      <button class="btn btn-regenerate" id="liar-regen">
        ${icons.REGENERATE_ICON}
        <span>Regenerate</span>
      </button>
      <button class="btn btn-reject" id="liar-reject">
        ${icons.DISMISS_ICON}
        <span>Dismiss</span>
      </button>
    </div>
    <div class="learn-row">
      <input type="checkbox" class="learn-checkbox" id="liar-learn" checked>
      <label class="learn-label" for="liar-learn">Learn from this style to refine suggestions</label>
    </div>
  `;
}

/**
 * Error view template.
 */
export function errorHTML(intent, settings, ollamaModels, errorMsg, hintHTML = '') {
  return `
    ${headerHTML(intent, settings, ollamaModels)}
    <div class="error-state">
      <strong style="display: block; margin-bottom: 4px;">Generation Error</strong>
      <span>${escapeHTML(errorMsg)}</span>
      ${hintHTML}
    </div>
    <div class="actions">
      <button class="btn btn-regenerate" id="liar-regen">Try again</button>
      <button class="btn btn-reject" id="liar-reject">Dismiss</button>
    </div>
  `;
}
