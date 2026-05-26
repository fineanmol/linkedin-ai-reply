/**
 * constants.js
 * Central registry for selectors, config keys, and defaults.
 * Update LinkedIn selectors here when LinkedIn changes their DOM.
 */

// ─── LinkedIn DOM Selectors ────────────────────────────────────────────────
export const SELECTORS = {
  // Feed posts
  FEED_POST: 'div[data-id]',
  POST_CONTAINER: '.feed-shared-update-v2',
  POST_CONTENT: '.feed-shared-update-v2__description, .update-components-text',

  // Post author
  POST_AUTHOR_NAME: '.update-components-actor__name span[aria-hidden="true"]',
  POST_AUTHOR_LINK: '.update-components-actor__meta-link',
  POST_AUTHOR_URN: '[data-id]', // data-id contains urn

  // Comments section
  COMMENTS_SECTION: '.comments-comments-list',
  COMMENT_ITEM: '.comments-comment-item',
  COMMENT_TEXT: '.comments-comment-item__main-content',
  COMMENT_AUTHOR_NAME: '.comments-post-meta__name-text',
  COMMENT_TIMESTAMP: '.comments-comment-item__timestamp',
  COMMENT_ACTIONS: '.comments-comment-social-bar',
  REPLY_BUTTON: '.comments-comment-social-bar__reply-action-button',

  // Profile / logged-in user
  NAV_IDENTITY_MODULE: '.global-nav__me-photo, .nav-item__profile-member-photo',
  PROFILE_NAME_IN_NAV: '.global-nav__me-title',

  // "See more" / "View all comments" expansion
  LOAD_MORE_COMMENTS: 'button.comments-comments-list__load-more-comments-button',

  // The injected button we add
  AI_REPLY_BUTTON: '.liar-ai-reply-btn',
  AI_REPLY_PANEL: '.liar-reply-panel',
};

// ─── Storage Keys ──────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  SETTINGS: 'liar_settings',
  STYLE_PROFILE: 'liar_style_profile',
  REPLY_HISTORY: 'liar_reply_history',
  MY_NAME: 'liar_my_name',
  MY_PROFILE_URL: 'liar_my_profile_url',
  ONBOARDING_DONE: 'liar_onboarding_done',
};

// ─── Default Settings ──────────────────────────────────────────────────────
export const DEFAULT_SETTINGS = {
  enabled: true,
  llmBackend: 'ollama',       // 'ollama' | 'gemini'
  ollamaUrl: 'http://localhost:11434',
  ollamaModel: 'gemma2:2b',
  geminiApiKey: '',
  geminiModel: 'gemini-2.5-flash',
  maxReplyLength: 150,        // words
  temperature: 0.7,
  streamingEnabled: false,    // Phase 2
  autoLearnFromApproved: true,
  debugMode: false,
};

// ─── Intent Labels ─────────────────────────────────────────────────────────
export const INTENTS = {
  QUESTION: 'question',
  APPRECIATION: 'appreciation',
  FEEDBACK: 'feedback',
  CRITICISM: 'criticism',
  TECHNICAL: 'technical',
  NETWORKING: 'networking',
  GENERAL: 'general',
};

// ─── Intent Display Config ─────────────────────────────────────────────────
export const INTENT_CONFIG = {
  [INTENTS.QUESTION]:     { label: 'Question',     emoji: '❓', color: '#4f9cf9' },
  [INTENTS.APPRECIATION]: { label: 'Appreciation', emoji: '🙏', color: '#22c55e' },
  [INTENTS.FEEDBACK]:     { label: 'Feedback',     emoji: '💡', color: '#f59e0b' },
  [INTENTS.CRITICISM]:    { label: 'Criticism',    emoji: '🔍', color: '#ef4444' },
  [INTENTS.TECHNICAL]:    { label: 'Technical',    emoji: '⚙️', color: '#8b5cf6' },
  [INTENTS.NETWORKING]:   { label: 'Networking',   emoji: '🤝', color: '#06b6d4' },
  [INTENTS.GENERAL]:      { label: 'General',      emoji: '💬', color: '#64748b' },
};

// ─── Style Profile Defaults ────────────────────────────────────────────────
export const DEFAULT_STYLE_PROFILE = {
  samples: [],                // Array of { id, text, intent, timestamp, source }
  fingerprint: {
    avgWordsPerSentence: 15,
    usesEmoji: false,
    formality: 'professional-casual',
    commonPhrases: [],
    signature: null,
  },
  manualExamples: '',         // User-pasted examples from options page
  maxSamples: 100,
};

// ─── LLM Config ────────────────────────────────────────────────────────────
export const OLLAMA_MODELS = [
  { id: 'gemma2:2b',       label: 'Gemma 2 (2B) — Fast, low RAM',         size: '1.5 GB' },
  { id: 'gemma2:9b',       label: 'Gemma 2 (9B) — Better quality',        size: '5.5 GB' },
  { id: 'llama3.2:3b',     label: 'Llama 3.2 (3B) — Balanced',           size: '2 GB'   },
  { id: 'mistral:7b',      label: 'Mistral (7B) — Strong instruction',    size: '4 GB'   },
  { id: 'qwen2.5:3b',      label: 'Qwen 2.5 (3B) — Multilingual',        size: '2 GB'   },
  { id: 'deepseek-r1:7b',  label: 'DeepSeek R1 (7B) — Strong reasoning', size: '4.7 GB' },
];

// ─── Extension Messages ────────────────────────────────────────────────────
export const MSG = {
  GENERATE_REPLY:    'GENERATE_REPLY',
  SAVE_STYLE_SAMPLE: 'SAVE_STYLE_SAMPLE',
  GET_SETTINGS:      'GET_SETTINGS',
  SAVE_SETTINGS:     'SAVE_SETTINGS',
  GET_STYLE_PROFILE: 'GET_STYLE_PROFILE',
  SAVE_STYLE_PROFILE:'SAVE_STYLE_PROFILE',
  CHECK_OLLAMA:      'CHECK_OLLAMA',
  GET_OLLAMA_MODELS: 'GET_OLLAMA_MODELS',
  PING:              'PING',
};

// ─── UI Constants ──────────────────────────────────────────────────────────
export const UI = {
  BUTTON_ID_PREFIX: 'liar-btn-',
  PANEL_ID_PREFIX:  'liar-panel-',
  SHADOW_HOST_CLASS: 'liar-shadow-host',
  Z_INDEX: 99999,
};
