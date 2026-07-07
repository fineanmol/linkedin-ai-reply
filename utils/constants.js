/**
 * constants.js
 * Central registry for selectors, config keys, and defaults.
 *
 * ⚠️  LinkedIn DOM Strategy — 2026
 * LinkedIn now uses FULLY OBFUSCATED hashed CSS class names
 * (e.g. _635732cb, dfebbce0). These rotate with every deploy.
 * We CANNOT rely on class names for comment/social-bar detection.
 *
 * What IS stable:
 *   ✅ data-testid="expandable-text-box"  → comment text span
 *   ✅ componentkey^="comment-commentary_" → comment text paragraph
 *   ✅ data-id*="urn:li:activity"          → post containers
 *   ✅ data-urn*="urn:li:activity"         → post containers (alt attr)
 *   ✅ a[href*="/in/"]                     → profile links
 *   ✅ a[href*="urn:li:activity"]          → post/comment links
 *   ✅ aria-label containing "comment"    → overflow menus
 *   ✅ visible button text "Reply"         → action bar anchor (checked via JS)
 *   ⚠️  CSS class names                   → UNRELIABLE, use as last resort
 */

// ─── LinkedIn DOM Selectors ────────────────────────────────────────────────
export const SELECTORS = {
  // Post containers — data-id/data-urn haven't changed since 2019
  POST_CONTAINER: [
    '[data-id*="urn:li:activity"]',
    '[data-urn*="urn:li:activity"]',
    '.feed-shared-update-v2',           // legacy fallback
    '.occludable-update',
    'article.update-components-article',
  ].join(', '),

  POST_CONTENT: [
    '[data-testid="main-feed-activity-card__commentary"]',
    '[data-testid*="commentary"]',
    '.feed-shared-update-v2__description',
    '.update-components-text',
    '[class*="update-components-text"]',
  ].join(', '),

  // Post author — class-based but rarely changes since they are BEM-style
  POST_AUTHOR_NAME: [
    '.update-components-actor__name span[aria-hidden="true"]',
    '.update-components-actor__name',
    '[class*="actor__name"] span[aria-hidden]',
  ].join(', '),
  POST_AUTHOR_LINK: [
    '.update-components-actor__meta-link',
    '.update-components-actor a[href*="/in/"]',
    '[class*="actor"] a[href*="/in/"]',
  ].join(', '),

  // Comment text anchors — PRIMARY detection strategy (stable 2026)
  COMMENT_TEXT_ANCHOR: [
    '[data-testid="expandable-text-box"]',
    '[componentkey^="comment-commentary_"]',
  ].join(', '),

  // Legacy class-based comment selectors (kept for older LI versions)
  COMMENT_ITEM: '.comments-comment-item, [class*="comment-item"], [class*="comment-entity"]',
  COMMENT_TEXT: '.comments-comment-item__main-content, [class*="comment-item__main-content"]',
  COMMENT_AUTHOR_NAME: '.comments-post-meta__name-text, [class*="post-meta__name-text"]',
  COMMENT_TIMESTAMP: '.comments-comment-item__timestamp, [class*="comment-item__timestamp"]',

  // Action bar — class-based selectors BROKEN in 2026.
  // Use findActionBarInComment() in dom-helpers.js (anchors on "Reply" button text).
  COMMENT_ACTIONS: [
    '.comments-comment-social-bar',
    '[class*="social-actions-bar"]',
    '[class*="social-bar"]',
  ].join(', '),

  // Logged-in user
  NAV_IDENTITY_MODULE: [
    '.global-nav__me-photo',
    '.global-nav__me img',
    'header img[class*="profile-photo"]',
    'header nav img[alt]',
  ].join(', '),
  PROFILE_NAME_IN_NAV: [
    '.global-nav__me-title',
    '[class*="me-title"]',
  ].join(', '),

  LOAD_MORE_COMMENTS: [
    'button[aria-label*="Load more comments" i]',
    'button[class*="load-more-comments"]',
    'button.comments-comments-list__load-more-comments-button',
  ].join(', '),

  AI_REPLY_BUTTON: '.liar-ai-reply-btn',
  AI_REPLY_PANEL: '.liar-reply-panel',
};

// ─── Detection Anchors (2026) ──────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH for the fragile, LinkedIn-specific anchors that the
// comment/post detection relies on. When LinkedIn rotates its DOM again, this
// is the ONE place to update — nothing else should hardcode these strings.
//
// Each is an ORDERED fallback list: detection tries them in order and uses the
// first that matches, so adding a new-DOM anchor to the front keeps the old
// ones working as a safety net during the transition.
export const DETECTION = {
  // The post's own body text (distinguishes a post from a comment).
  POST_COMMENTARY: ['[componentkey^="feed-commentary_"]'],
  // A comment's body text.
  COMMENT_COMMENTARY: ['[componentkey^="comment-commentary_"]'],
  // Generic expandable text box (used by BOTH posts and comments — weaker signal).
  EXPANDABLE_TEXT: ['[data-testid="expandable-text-box"]'],
  // A person's profile link (marks a comment/post author).
  PROFILE_LINK: ['a[href*="/in/"]'],
  // The activity URN, wherever it survives in the DOM (post resolution).
  ACTIVITY_URN: ['a[href*="urn:li:activity"]', '[data-testid*="urn:li:activity"]'],
  // Legacy post containers (older DOM / some pages still use these).
  LEGACY_POST: [
    '[data-id*="urn:li:activity"]',
    '[data-urn*="urn:li:activity"]',
    '.feed-shared-update-v2',
    'article.update-components-article',
    '.occludable-update',
  ],
  // The post's AUTHOR actor block (name/headline). NOT just any /in/ link —
  // reactor avatars are also /in/ links. Ordered fallbacks.
  POST_ACTOR: [
    '.update-components-actor__meta',
    '.update-components-actor',
    '[class*="update-components-actor"]',
  ],
  // Best-effort social counts region (reactions/comments). Extraction is
  // approximate — see getPostEngagementApprox(). Ordered fallbacks.
  SOCIAL_COUNTS: [
    '.social-details-social-counts',
    '[class*="social-details-social-counts"]',
    '[class*="social-counts"]',
  ],
};

// Localized "Promoted"/ad markers — posts carrying these are skipped as targets.
export const PROMOTED_WORDS = ['promoted', 'anzeige', 'gesponsert', 'sponsored', 'promoted by'];

// Localized "Reply" action words — the text-based anchor for the comment
// action bar. Kept here so all detection paths share ONE list.
export const REPLY_WORDS = [
  'reply', 'répondre', 'antworten', 'responder', 'rispondi', 'beantwoorden',
  'odpowiedz', 'yanıtla', 'उत्तर दें', 'رد', '回复', '回覆', '返信', '답글',
  'svar', 'svara', 'vastaa', 'balas', 'trả lời', 'ตอบกลับ', 'відповісти', 'ответить',
];

// ─── Storage Keys ──────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  SETTINGS: 'liar_settings',
  STYLE_PROFILE: 'liar_style_profile',
  REPLY_HISTORY: 'liar_reply_history',
  MY_NAME: 'liar_my_name',
  MY_PROFILE_URL: 'liar_my_profile_url',
  ENGAGEMENT_QUEUE: 'liar_engagement_queue',
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
  autoLearnFromApproved: true,
  debugMode: false,
  // Comma-separated niche topics used to score which feed posts are worth
  // engaging on. Seeded from the user's recent posts, user-editable in Options.
  topics: '',
  // Max items in a freshly built engagement queue.
  queueSize: 12,
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
  // A top-level comment ON a post (not a reply to someone's comment) —
  // used by the engagement queue.
  POST_COMMENT: 'post_comment',
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
  [INTENTS.POST_COMMENT]: { label: 'Post comment', emoji: '📝', color: '#5cc3e8' },
};

// ─── Style Profile Defaults ────────────────────────────────────────────────
export const DEFAULT_STYLE_PROFILE = {
  samples: [],
  fingerprint: {
    avgWordsPerSentence: 15,
    usesEmoji: false,
    formality: 'professional-casual',
    commonPhrases: [],
    signature: null,
  },
  manualExamples: '',
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
  CANCEL_REPLY:      'CANCEL_REPLY',
  SAVE_STYLE_SAMPLE: 'SAVE_STYLE_SAMPLE',
  GET_SETTINGS:      'GET_SETTINGS',
  SAVE_SETTINGS:     'SAVE_SETTINGS',
  GET_STYLE_PROFILE: 'GET_STYLE_PROFILE',
  SAVE_STYLE_PROFILE:'SAVE_STYLE_PROFILE',
  CHECK_OLLAMA:      'CHECK_OLLAMA',
  GET_OLLAMA_MODELS: 'GET_OLLAMA_MODELS',
  PING:              'PING',
  // ── Engagement queue ──
  SCORE_TARGETS:     'SCORE_TARGETS',      // payload: { posts:[{urn,authorName,text,...}], topics } → { scored:[{urn,relevance,whyEngage}] }
  BUILD_QUEUE:       'BUILD_QUEUE',        // content→bg: full pipeline for a scanned post set → { added }
  GET_QUEUE:         'GET_QUEUE',          // → queue array
  UPDATE_QUEUE_ITEM: 'UPDATE_QUEUE_ITEM',  // payload: { id, patch } → { success }
  CLEAR_QUEUE:       'CLEAR_QUEUE',        // → { success }
  REQUEST_BUILD_QUEUE:'REQUEST_BUILD_QUEUE',// popup/options→content: trigger a feed scan in the active tab
};

// ─── UI Constants ──────────────────────────────────────────────────────────
export const UI = {
  BUTTON_ID_PREFIX: 'liar-btn-',
  PANEL_ID_PREFIX:  'liar-panel-',
  SHADOW_HOST_CLASS: 'liar-shadow-host',
  Z_INDEX: 99999,
};
