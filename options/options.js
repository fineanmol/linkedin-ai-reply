/**
 * options.js — Options page controller
 */

import { MSG, OLLAMA_MODELS, STORAGE_KEYS, DEFAULT_SETTINGS, CLAUDE_MODELS } from '../utils/constants.js';

// ─── Utilities ─────────────────────────────────────────────────────────────

async function sendMsg(type, payload) {
  try {
    return await chrome.runtime.sendMessage({ type, payload });
  } catch (e) {
    return { error: e.message };
  }
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.className = `toast ${type}`;
  toast.hidden = false;
  setTimeout(() => { toast.hidden = true; }, 3000);
}

function formatDate(ts) {
  if (!ts) return '';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

/**
 * Local-calendar YYYY-MM-DD for a Date. NOT toISOString() — that converts to
 * UTC first, so local midnight in e.g. Europe/Berlin lands on the PREVIOUS day.
 */
function localDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/** Clamp a numeric setting into [min, max], falling back to `def` if not a number. */
function clampNum(v, min, max, def) {
  const n = Number(v);
  if (!Number.isFinite(n)) return def;
  return Math.min(max, Math.max(min, n));
}

// ─── Tab Navigation ────────────────────────────────────────────────────────

function initTabs() {
  const links = document.querySelectorAll('.nav-link');
  const panes = document.querySelectorAll('.tab-pane');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const tab = link.dataset.tab;
      links.forEach(l => l.classList.remove('active'));
      panes.forEach(p => p.classList.remove('active'));
      link.classList.add('active');
      document.getElementById(`tab-${tab}`)?.classList.add('active');

      if (tab === 'history') loadHistory();
      if (tab === 'style') loadStyleProfile();
      if (tab === 'queue') loadQueue();
      if (tab === 'comments') loadCommentsLog();
      if (tab === 'calendar') renderCalendarGrid();
    });
  });
}

async function loadCommentsLog() {
  const resp = await sendMsg(MSG.GET_COMMENTS_LOG);
  const log = resp?.log || [];
  const c = resp?.counts || { today: 0, week: 0, total: 0 };
  document.getElementById('cl-today').textContent = c.today;
  document.getElementById('cl-week').textContent = c.week;
  document.getElementById('cl-total').textContent = c.total;
  document.getElementById('comments-count').textContent =
    `${log.length} ${log.length === 1 ? 'comment' : 'comments'}`;

  const listEl = document.getElementById('comments-list');
  if (!log.length) {
    listEl.innerHTML = '<div class="empty-state">No comments logged yet. After posting a queued comment on LinkedIn, click “Mark posted” here or “I posted this” in the on-page panel.</div>';
  } else {
    listEl.innerHTML = log.map(l => `
      <div class="history-item">
        <div class="history-item-meta">
          <span class="history-status approved">✓ Posted</span>
          <span>${escapeHTML(l.authorName || 'Someone')}</span>
          <span>·</span>
          <span>${formatDate(l.timestamp)}</span>
        </div>
        ${l.postText ? `<div class="history-comment">💬 "${escapeHTML(l.postText.slice(0, 120))}${l.postText.length > 120 ? '…' : ''}"</div>` : ''}
        <div class="history-reply">${escapeHTML(l.comment || '')}</div>
      </div>`).join('');
  }

  const clearBtn = document.getElementById('clear-comments');
  if (clearBtn && !clearBtn._wired) {
    clearBtn._wired = true;
    clearBtn.addEventListener('click', async () => {
      if (!confirm('Clear your comments log? Posts will no longer be auto-skipped.')) return;
      await sendMsg(MSG.CLEAR_COMMENTS_LOG);
      showToast('Comments log cleared.');
      loadCommentsLog();
    });
  }
}

// ─── Sidebar Status ────────────────────────────────────────────────────────

async function checkSidebarStatus() {
  const dot = document.getElementById('sidebar-dot');
  const label = document.getElementById('sidebar-label');
  // The background resolves the selected backend (incl. 'auto') and reports
  // the truthful label — never infer "local" here.
  const r = await sendMsg(MSG.CHECK_BACKEND);
  if (!r || typeof r.alive !== 'boolean') {
    dot.className = 'dot offline';
    label.textContent = 'Status unavailable';
    return;
  }
  const where = r.isLocal ? 'Local' : 'Cloud';
  dot.className = `dot ${r.alive ? 'online' : 'offline'}`;
  label.textContent = r.alive
    ? `${r.label || r.backend} · ${where}`
    : `${r.label || r.backend} offline`;
  label.title = r.error || (r.model ? `${r.label || r.backend} — ${r.model}` : '');
}

// ─── LLM Tab ───────────────────────────────────────────────────────────────

async function initLLMTab(settings) {
  // Backend radio
  const radios = document.querySelectorAll('input[name="llmBackend"]');
  const initialBackend = settings.llmBackend || DEFAULT_SETTINGS.llmBackend;
  radios.forEach(r => {
    if (r.value === initialBackend) r.checked = true;
    r.addEventListener('change', () => updateBackendVisibility(r.value));
  });
  updateBackendVisibility(initialBackend);

  // Ollama URL
  const urlInput = document.getElementById('ollama-url');
  urlInput.value = settings.ollamaUrl || DEFAULT_SETTINGS.ollamaUrl;

  // Load Ollama models
  await loadOllamaModels(settings.ollamaModel);

  document.getElementById('refresh-models').addEventListener('click', () => {
    loadOllamaModels(document.getElementById('ollama-model').value);
  });

  // Gemini
  document.getElementById('gemini-key').value = settings.geminiApiKey || '';
  const geminiModelSel = document.getElementById('gemini-model');
  geminiModelSel.value = settings.geminiModel || DEFAULT_SETTINGS.geminiModel;

  // Claude — bridge (Claude Code login) or Anthropic API key; both are cloud.
  const claudeModelSel = document.getElementById('claude-model');
  claudeModelSel.innerHTML = '';
  CLAUDE_MODELS.forEach(m => {
    const opt = document.createElement('option');
    opt.value = m.id; opt.textContent = m.label;
    claudeModelSel.appendChild(opt);
  });
  claudeModelSel.value = settings.claudeModel || DEFAULT_SETTINGS.claudeModel;
  if (!claudeModelSel.value) claudeModelSel.value = DEFAULT_SETTINGS.claudeModel;

  const claudeMode = settings.claudeMode === 'api' ? 'api' : 'bridge';
  document.querySelectorAll('input[name="claudeMode"]').forEach(r => {
    r.checked = r.value === claudeMode;
    r.addEventListener('change', () => updateClaudeModeVisibility(r.value));
  });
  updateClaudeModeVisibility(claudeMode);
  document.getElementById('claude-bridge-url').value = settings.claudeBridgeUrl || DEFAULT_SETTINGS.claudeBridgeUrl;
  document.getElementById('claude-bridge-token').value = settings.claudeBridgeToken || '';
  document.getElementById('claude-api-key').value = settings.claudeApiKey || '';

  // Sliders. Defaults come from DEFAULT_SETTINGS so the UI never disagrees
  // with what the background actually uses. Old installs may have stored a
  // 150-word max — clamp into the 15–45 range the prompt hard-caps at.
  const maxSlider = document.getElementById('max-length');
  const maxVal = document.getElementById('max-length-val');
  maxSlider.value = clampNum(settings.maxReplyLength ?? DEFAULT_SETTINGS.maxReplyLength, 15, 45, DEFAULT_SETTINGS.maxReplyLength);
  maxVal.textContent = maxSlider.value;
  maxSlider.addEventListener('input', () => maxVal.textContent = maxSlider.value);

  const tempSlider = document.getElementById('temperature');
  const tempVal = document.getElementById('temp-val');
  tempSlider.value = clampNum(settings.temperature ?? DEFAULT_SETTINGS.temperature, 0.1, 1.0, DEFAULT_SETTINGS.temperature);
  tempVal.textContent = parseFloat(tempSlider.value).toFixed(2);
  tempSlider.addEventListener('input', () => tempVal.textContent = parseFloat(tempSlider.value).toFixed(2));

  // Save — every field this tab owns (SAVE_SETTINGS merges into stored settings).
  document.getElementById('save-llm').addEventListener('click', async () => {
    const backend = document.querySelector('input[name="llmBackend"]:checked')?.value || DEFAULT_SETTINGS.llmBackend;
    const patch = {
      llmBackend: backend,
      ollamaUrl: urlInput.value.trim() || DEFAULT_SETTINGS.ollamaUrl,
      geminiApiKey: document.getElementById('gemini-key').value.trim(),
      geminiModel: geminiModelSel.value,
      claudeMode: document.querySelector('input[name="claudeMode"]:checked')?.value || 'bridge',
      claudeBridgeUrl: document.getElementById('claude-bridge-url').value.trim() || DEFAULT_SETTINGS.claudeBridgeUrl,
      claudeBridgeToken: document.getElementById('claude-bridge-token').value.trim(),
      claudeApiKey: document.getElementById('claude-api-key').value.trim(),
      claudeModel: claudeModelSel.value || DEFAULT_SETTINGS.claudeModel,
      maxReplyLength: parseInt(maxSlider.value, 10),
      temperature: parseFloat(tempSlider.value),
    };
    // Don't overwrite the stored Ollama model with the "Loading…" placeholder.
    const ollamaModel = document.getElementById('ollama-model').value;
    if (ollamaModel) patch.ollamaModel = ollamaModel;
    const resp = await sendMsg(MSG.SAVE_SETTINGS, patch);
    if (resp?.error) { showToast(`Couldn't save: ${resp.error}`, 'error'); return; }
    showToast('✓ LLM settings saved!');
    checkSidebarStatus();
  });

  // Test connection — asks the background about the SAVED selected backend.
  const testBtn = document.getElementById('test-backend');
  const testOut = document.getElementById('test-backend-result');
  testBtn.addEventListener('click', async () => {
    testBtn.disabled = true;
    testOut.className = 'form-hint';
    testOut.textContent = 'Testing…';
    try {
      const r = await sendMsg(MSG.CHECK_BACKEND);
      if (!r || typeof r.alive !== 'boolean') {
        testOut.className = 'form-hint test-fail';
        testOut.textContent = `✗ ${r?.error || 'No response from the background service worker.'}`;
        return;
      }
      const where = r.isLocal ? 'Local' : 'Cloud';
      const name = `${r.label || r.backend}${r.model ? ` · ${r.model}` : ''} (${where})`;
      testOut.className = `form-hint ${r.alive ? 'test-ok' : 'test-fail'}`;
      testOut.textContent = r.alive
        ? `✓ Connected — ${name}`
        : `✗ Not reachable — ${name}${r.error ? `: ${r.error}` : ''}`;
    } finally {
      testBtn.disabled = false;
    }
  });
}

function updateBackendVisibility(backend) {
  // 'auto' uses Ollama first, then Gemini — show both configs for it.
  document.getElementById('ollama-config').hidden = !(backend === 'ollama' || backend === 'auto');
  document.getElementById('gemini-config').hidden = !(backend === 'gemini' || backend === 'auto');
  document.getElementById('claude-config').hidden = backend !== 'claude';
}

function updateClaudeModeVisibility(mode) {
  document.getElementById('claude-bridge-fields').hidden = mode === 'api';
  document.getElementById('claude-api-fields').hidden = mode !== 'api';
}

async function loadOllamaModels(currentModel) {
  const select = document.getElementById('ollama-model');
  const statusEl = document.getElementById('model-status');

  select.innerHTML = '<option value="">Loading…</option>';
  statusEl.textContent = '';

  try {
    const result = await sendMsg(MSG.GET_OLLAMA_MODELS);
    const fetchedModels = result?.models || [];
    const allModels = [...new Set([...fetchedModels, ...OLLAMA_MODELS.map(m => m.id)])];

    select.innerHTML = '';

    if (fetchedModels.length > 0) {
      const grpInstalled = document.createElement('optgroup');
      grpInstalled.label = 'Installed';
      fetchedModels.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m; opt.textContent = m;
        grpInstalled.appendChild(opt);
      });
      select.appendChild(grpInstalled);
    }

    const grpSuggested = document.createElement('optgroup');
    grpSuggested.label = OLLAMA_MODELS.map(m => m.id).some(id => fetchedModels.includes(id))
      ? 'Other Suggested Models' : 'Suggested Models (not installed)';
    OLLAMA_MODELS.filter(m => !fetchedModels.includes(m.id)).forEach(m => {
      const opt = document.createElement('option');
      opt.value = m.id;
      opt.textContent = `${m.id} — ${m.size}`;
      grpSuggested.appendChild(opt);
    });
    select.appendChild(grpSuggested);

    // Set current value
    if (currentModel) select.value = currentModel;
    if (!select.value && allModels.length > 0) select.value = allModels[0];

    statusEl.textContent = fetchedModels.length > 0
      ? `${fetchedModels.length} model(s) installed`
      : 'No models found. Pull one with: ollama pull gemma2:2b';
  } catch {
    select.innerHTML = OLLAMA_MODELS.map(m =>
      `<option value="${m.id}">${m.id} (${m.size})</option>`
    ).join('');
    statusEl.textContent = 'Could not connect to Ollama. Showing suggested models.';
  }
}

// ─── Style Profile Tab ─────────────────────────────────────────────────────

async function loadStyleProfile() {
  const profile = await sendMsg(MSG.GET_STYLE_PROFILE);
  const identity = await sendMsg(MSG.GET_IDENTITY);

  document.getElementById('user-name').value = identity?.name || '';
  document.getElementById('manual-examples').value = profile?.manualExamples || '';

  const samples = profile?.samples || [];
  const countEl = document.getElementById('samples-count');
  const listEl = document.getElementById('samples-list');

  countEl.textContent = samples.length;

  if (samples.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No learned samples yet. Approve replies and they\'ll appear here.</div>';
  } else {
    listEl.innerHTML = samples.slice(0, 30).map(s => `
      <div class="sample-item">
        <div class="sample-meta">
          <span>${s.source === 'manual' ? '✍️ Manual' : '✓ Approved'}</span>
          <span>·</span>
          <span>${escapeHTML(s.intent || 'general')}</span>
          <span>·</span>
          <span>${formatDate(s.timestamp)}</span>
        </div>
        <div>${escapeHTML(s.text)}</div>
      </div>
    `).join('');
  }
}

async function initStyleTab() {
  document.getElementById('save-style').addEventListener('click', async () => {
    const name = document.getElementById('user-name').value.trim();
    const examples = document.getElementById('manual-examples').value;

    if (name) {
      await sendMsg(MSG.SAVE_IDENTITY, { name, profileUrl: null });
    }
    await sendMsg(MSG.SAVE_STYLE_PROFILE, { manualExamples: examples });
    showToast('✓ Style profile saved!');
    loadStyleProfile();
  });

  document.getElementById('clear-samples').addEventListener('click', async () => {
    if (!confirm('Clear all learned samples? Manual examples will be kept.')) return;
    const profile = await sendMsg(MSG.GET_STYLE_PROFILE);
    profile.samples = profile.samples.filter(s => s.source === 'manual');
    await sendMsg(MSG.SAVE_STYLE_PROFILE, profile);
    showToast('Samples cleared.', 'success');
    loadStyleProfile();
  });
}

// ─── History Tab ───────────────────────────────────────────────────────────

async function loadHistory() {
  const data = await chrome.storage.local.get(STORAGE_KEYS.REPLY_HISTORY);
  const history = data[STORAGE_KEYS.REPLY_HISTORY] || [];
  const countEl = document.getElementById('history-count');
  const listEl = document.getElementById('history-list');

  countEl.textContent = `${history.length} ${history.length === 1 ? 'entry' : 'entries'}`;

  if (history.length === 0) {
    listEl.innerHTML = '<div class="empty-state">No history yet.</div>';
    return;
  }

  listEl.innerHTML = history.slice(0, 50).map(h => `
    <div class="history-item">
      <div class="history-item-meta">
        <span class="history-status ${h.status === 'approved' ? 'approved' : 'generated'}">${h.status === 'approved' ? '✓ Approved' : 'Generated'}</span>
        <span>${escapeHTML(h.intent || 'general')}</span>
        <span>·</span>
        <span>${escapeHTML(h.label || h.backend || 'unknown backend')} — ${escapeHTML(h.model || '')}</span>
        <span>·</span>
        <span>${formatDate(h.timestamp)}</span>
      </div>
      ${h.commentText ? `<div class="history-comment">💬 "${escapeHTML(h.commentText.slice(0, 120))}${h.commentText.length > 120 ? '…' : ''}"</div>` : ''}
      <div class="history-reply">${escapeHTML(h.reply || '')}</div>
    </div>
  `).join('');
}

/** Wired ONCE at boot — loadHistory() runs on every tab open. */
function initHistoryTab() {
  document.getElementById('clear-history').addEventListener('click', async () => {
    if (!confirm('Clear all reply history?')) return;
    await chrome.storage.local.remove(STORAGE_KEYS.REPLY_HISTORY);
    showToast('History cleared.');
    loadHistory();
  });
}

// ─── Advanced Tab ──────────────────────────────────────────────────────────

async function initAdvancedTab(settings) {
  document.getElementById('auto-learn').checked = settings.autoLearnFromApproved !== false;
  document.getElementById('debug-mode').checked = settings.debugMode === true;
  const bgScrape = document.getElementById('allow-bg-scraping');
  bgScrape.checked = settings.allowBackgroundScraping === true;

  document.getElementById('save-advanced').addEventListener('click', async () => {
    // Turning background reading ON is a deliberate, informed choice.
    if (bgScrape.checked && settings.allowBackgroundScraping !== true &&
        !confirm('Allow background profile reading?\n\nThis opens hidden LinkedIn tabs to read other people\'s profiles and recent activity. LinkedIn\'s User Agreement prohibits automated scraping, and each visit shows up as a profile view.')) {
      bgScrape.checked = false;
    }
    const resp = await sendMsg(MSG.SAVE_SETTINGS, {
      autoLearnFromApproved: document.getElementById('auto-learn').checked,
      debugMode: document.getElementById('debug-mode').checked,
      allowBackgroundScraping: bgScrape.checked,
    });
    if (resp?.error) { showToast(`Couldn't save: ${resp.error}`, 'error'); return; }
    settings.allowBackgroundScraping = bgScrape.checked;
    showToast('✓ Advanced settings saved!');
  });

  document.getElementById('reset-all').addEventListener('click', async () => {
    if (!confirm('Reset ALL data? This cannot be undone.')) return;
    await chrome.storage.local.clear();
    showToast('All data cleared. Reloading…', 'success');
    setTimeout(() => location.reload(), 1500);
  });
}

// ─── Engagement Queue Tab ────────────────────────────────────────────────────

async function initQueueTab(settings) {
  const topicsInput = document.getElementById('topics');
  if (topicsInput) topicsInput.value = settings.topics || '';

  document.getElementById('save-topics')?.addEventListener('click', async () => {
    await sendMsg(MSG.SAVE_SETTINGS, { topics: document.getElementById('topics').value.trim() });
    showToast('✓ Topics saved!');
  });

  document.getElementById('refresh-queue')?.addEventListener('click', loadQueue);
  document.getElementById('draft-all')?.addEventListener('click', draftAll);

  document.getElementById('clear-queue')?.addEventListener('click', async () => {
    if (!confirm('Clear the engagement queue?')) return;
    await sendMsg(MSG.CLEAR_QUEUE);
    showToast('Queue cleared.');
    loadQueue();
  });
}

/**
 * Generate a draft comment for EVERY queued item that doesn't have one yet.
 * Sequential (not parallel) to be gentle on a local Ollama backend.
 */
async function draftAll() {
  const btn = document.getElementById('draft-all');
  const status = document.getElementById('draft-all-status');
  const resp = await sendMsg(MSG.GET_QUEUE);
  const pending = (resp?.queue || []).filter(q => q.status !== 'skipped' && !q.draftReply);
  if (!pending.length) { showToast('All items already drafted.'); return; }

  btn.disabled = true;
  let done = 0;
  for (const item of pending) {
    status.textContent = `Drafting ${done + 1} of ${pending.length}…`;
    const gen = await sendMsg(MSG.GENERATE_REPLY, {
      commentId: `queue-${item.id}`,
      commentText: item.postText,
      authorName: item.authorName,
      postContent: item.postText,
      intent: 'post_comment',
    });
    if (gen?.reply) {
      await sendMsg(MSG.UPDATE_QUEUE_ITEM, { id: item.id, patch: { draftReply: gen.reply } });
    }
    done++;
  }
  status.textContent = `Drafted ${done} comments. Review, then Copy & open each post.`;
  btn.disabled = false;
  loadQueue();
}

async function loadQueue() {
  const resp = await sendMsg(MSG.GET_QUEUE);
  const queue = (resp?.queue || []).filter(q => q.status !== 'skipped');
  const listEl = document.getElementById('queue-list');
  const countEl = document.getElementById('queue-count');
  countEl.textContent = `${queue.length} ${queue.length === 1 ? 'item' : 'items'}`;

  if (queue.length === 0) {
    listEl.innerHTML = '<div class="empty-state">Queue is empty. Open your LinkedIn feed, click the extension, and hit <b>Build today\'s engagement queue</b>.</div>';
    return;
  }

  listEl.innerHTML = queue.map(q => {
    const rel = q.relevance != null ? `${Math.round(q.relevance * 100)}% match` : '';
    const done = q.status === 'done';
    const copied = q.status === 'copied';
    const id = escapeHTML(q.id);
    return `
    <div class="history-item" data-id="${id}" style="${done ? 'opacity:.55;' : ''}">
      <div class="history-item-meta">
        <span class="history-status ${done ? 'approved' : copied ? 'copied' : 'generated'}">${done ? '✓ Posted' : copied ? 'Copied' : 'Queued'}</span>
        <span>${escapeHTML(q.authorName || 'Someone')}</span>
        ${q.authorHeadline ? `<span>·</span><span>${escapeHTML(q.authorHeadline.slice(0, 50))}</span>` : ''}
        ${rel ? `<span>·</span><span>${escapeHTML(rel)}</span>` : ''}
      </div>
      <div class="history-comment">💬 "${escapeHTML((q.postText || '').slice(0, 160))}${(q.postText || '').length > 160 ? '…' : ''}"</div>
      ${q.whyEngage ? `<div class="form-hint" style="margin:4px 0;">Why: ${escapeHTML(q.whyEngage)}</div>` : ''}
      <textarea class="form-input form-textarea q-draft" rows="3" data-id="${id}" placeholder="Click “Draft reply” to generate…">${escapeHTML(q.draftReply || '')}</textarea>
      <div style="display:flex; gap:8px; flex-wrap:wrap; margin-top:8px;">
        <button class="btn-save q-draft-btn" data-id="${id}" style="padding:6px 12px;">${q.draftReply ? '↻ Regenerate' : '✨ Draft reply'}</button>
        <button class="btn-save q-open-btn" data-id="${id}" data-url="${escapeHTML(safeLinkedInUrl(q.permalink))}" style="padding:6px 12px;">📋 Copy & open post</button>
        <button class="btn-save q-posted-btn" data-id="${id}" style="padding:6px 12px;" ${done ? 'disabled' : ''}>✓ Mark posted</button>
        <button class="btn-danger-sm q-skip-btn" data-id="${id}">Skip</button>
      </div>
    </div>`;
  }).join('');

  // Wire per-row actions
  listEl.querySelectorAll('.q-draft-btn').forEach(b =>
    b.addEventListener('click', () => draftForItem(b.dataset.id)));
  listEl.querySelectorAll('.q-open-btn').forEach(b =>
    b.addEventListener('click', () => copyAndOpen(b.dataset.id, b.dataset.url)));
  listEl.querySelectorAll('.q-posted-btn').forEach(b =>
    b.addEventListener('click', () => markPosted(b.dataset.id)));
  listEl.querySelectorAll('.q-skip-btn').forEach(b =>
    b.addEventListener('click', () => skipItem(b.dataset.id)));
  // Persist manual edits to drafts
  listEl.querySelectorAll('.q-draft').forEach(t =>
    t.addEventListener('change', () => sendMsg(MSG.UPDATE_QUEUE_ITEM, { id: t.dataset.id, patch: { draftReply: t.value } })));
}

async function draftForItem(id) {
  const resp = await sendMsg(MSG.GET_QUEUE);
  const item = (resp?.queue || []).find(q => q.id === id);
  if (!item) return;
  const ta = document.querySelector(`.q-draft[data-id="${CSS.escape(id)}"]`);
  const btn = document.querySelector(`.q-draft-btn[data-id="${CSS.escape(id)}"]`);
  if (ta) ta.value = 'Generating…';
  if (btn) btn.disabled = true;
  // Reuse the existing GENERATE_REPLY pipeline: treat the POST as the thing
  // being commented on, with the POST_COMMENT intent.
  const gen = await sendMsg(MSG.GENERATE_REPLY, {
    commentId: `queue-${id}`,
    commentText: item.postText,
    authorName: item.authorName,
    postContent: item.postText,
    intent: 'post_comment',
    forceRegenerate: !!item.draftReply,
  });
  if (!gen?.reply) {
    // Show the error, but never save error text as the draft.
    if (ta) ta.value = item.draftReply || '';
    if (btn) { btn.disabled = false; btn.textContent = item.draftReply ? '↻ Regenerate' : '✨ Draft reply'; }
    showToast(`Couldn't generate: ${gen?.error || 'unknown error'}`, 'error');
    return;
  }
  if (ta) ta.value = gen.reply;
  if (btn) { btn.disabled = false; btn.textContent = '↻ Regenerate'; }
  await sendMsg(MSG.UPDATE_QUEUE_ITEM, { id, patch: { draftReply: gen.reply } });
}

/**
 * Copy the draft and open the post. Marks the item 'copied' (in progress) —
 * NOT done: it only becomes done (and logged) when the user explicitly
 * clicks "Mark posted". Mirrors the on-page panel (content/queue-panel.js).
 */
async function copyAndOpen(id, url) {
  const ta = document.querySelector(`.q-draft[data-id="${CSS.escape(id)}"]`);
  const text = ta?.value?.trim();
  if (text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast('Draft copied — paste it on LinkedIn, post it, then click “Mark posted”.');
    } catch {
      showToast('Copy failed — select the draft and copy it manually.', 'error');
    }
  }
  await sendMsg(MSG.UPDATE_QUEUE_ITEM, { id, patch: { status: 'copied' } });
  const safeUrl = safeLinkedInUrl(url);
  if (safeUrl) window.open(safeUrl, '_blank', 'noopener');
  loadQueue();
}

/** Explicit confirmation that the user posted it: log it, then mark done. */
async function markPosted(id) {
  const resp = await sendMsg(MSG.GET_QUEUE);
  const item = (resp?.queue || []).find(q => q.id === id);
  if (!item) return;
  const ta = document.querySelector(`.q-draft[data-id="${CSS.escape(id)}"]`);
  const comment = (ta?.value || item.draftReply || '').trim();
  const logged = await sendMsg(MSG.LOG_COMMENT, {
    urn: item.urn, authorName: item.authorName, postText: item.postText, comment,
  });
  if (logged?.error) { showToast(`Couldn't log it: ${logged.error}`, 'error'); return; }
  await sendMsg(MSG.UPDATE_QUEUE_ITEM, { id, patch: { status: 'done' } });
  const c = logged?.counts;
  showToast(c ? `Logged ✓ — ${c.today} today, ${c.week} this week.` : 'Logged ✓');
  loadQueue();
}

/** Only ever open https LinkedIn URLs from stored queue data. */
function safeLinkedInUrl(url) {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && /(^|\.)linkedin\.com$/i.test(u.hostname) ? u.href : '';
  } catch {
    return '';
  }
}

async function skipItem(id) {
  await sendMsg(MSG.UPDATE_QUEUE_ITEM, { id, patch: { status: 'skipped' } });
  loadQueue();
}

// ─── Content Calendar Tab ────────────────────────────────────────────────────
// Draft-only: nothing generated here is ever posted to LinkedIn automatically.
// The user reviews, edits, and manually posts, then clicks "Mark as Posted".

let _calCancelled = false;
let _calMonthCursor = new Date();
let _calModalPost = null;
// Transient, in-memory only: scraped-but-not-yet-finalized posts under review
// in the checklist. Discarded on a fresh scrape or once the batch is built —
// no need to survive an options-page reload (re-scraping is cheap).
let _calScrapedPosts = []; // [{text, rawTimestamp, selected}]

function initCalendarTab() {
  _calMonthCursor = new Date(_calMonthCursor.getFullYear(), _calMonthCursor.getMonth(), 1);

  const startDateInput = document.getElementById('cal-start-date');
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  startDateInput.value = localDateStr(tomorrow);

  const ratioSlider = document.getElementById('cal-ratio-friend');
  const ratioLabel = document.getElementById('cal-ratio-label');
  ratioSlider.addEventListener('input', () => {
    const f = ratioSlider.value;
    ratioLabel.textContent = `${f}% friend / ${100 - f}% trending`;
  });

  const timeSlotSel = document.getElementById('cal-timeslot');
  const customTime = document.getElementById('cal-timeslot-custom');
  timeSlotSel.addEventListener('change', () => {
    customTime.hidden = timeSlotSel.value !== 'custom';
  });

  document.getElementById('cal-scrape').addEventListener('click', scrapeFriendProfile);
  document.getElementById('cal-generate-step2').addEventListener('click', generateCalendarBatch);
  document.getElementById('cal-cancel').addEventListener('click', () => { _calCancelled = true; });

  document.getElementById('cal-clear').addEventListener('click', async () => {
    if (!confirm('Clear the entire content calendar? This cannot be undone.')) return;
    await sendMsg(MSG.CLEAR_CALENDAR);
    showToast('Calendar cleared.');
    renderCalendarGrid();
  });

  document.getElementById('cal-prev-month').addEventListener('click', () => {
    _calMonthCursor.setMonth(_calMonthCursor.getMonth() - 1);
    renderCalendarGrid();
  });
  document.getElementById('cal-next-month').addEventListener('click', () => {
    _calMonthCursor.setMonth(_calMonthCursor.getMonth() + 1);
    renderCalendarGrid();
  });

  initCalendarModal();
}

function selectedTimeSlot() {
  const sel = document.getElementById('cal-timeslot').value;
  if (sel === 'custom') {
    const t = document.getElementById('cal-timeslot-custom').value || '08:00';
    return { custom: t };
  }
  return sel;
}

/**
 * Step 1: scrape the friend's profile only. Shows every post found in a
 * checklist so the user can pick which ones are worth adapting — many
 * image/GIF posts have thin captions that won't adapt into anything useful,
 * so review beats silently consuming everything scraped.
 */
async function scrapeFriendProfile() {
  const friendProfileUrl = document.getElementById('cal-friend-url').value.trim();
  if (!friendProfileUrl) { showToast('Paste your friend\'s profile URL to draw from.', 'error'); return; }

  const scrapeBtn = document.getElementById('cal-scrape');
  const progressEl = document.getElementById('cal-progress');

  scrapeBtn.disabled = true;
  progressEl.textContent = `Reading ${friendProfileUrl}'s recent posts… this can take up to a minute.`;

  try {
    const resp = await sendMsg(MSG.SCRAPE_FRIEND_PROFILE, { friendProfileUrl });

    if (resp?.error) {
      if (resp.code === 'SCRAPING_DISABLED') {
        // Background reading is off — show the exact reason where the user is looking.
        showToast(resp.error, 'error');
        progressEl.textContent = resp.error;
      } else {
        showToast(`Couldn't read that profile: ${resp.error}`, 'error');
        progressEl.textContent = '';
      }
      return;
    }

    // Preserve scrape order (newest-first) — only filter by selection,
    // never re-sort by click order, so oldest-first-among-selected holds.
    _calScrapedPosts = (resp.posts || []).map(p => ({
      text: p.text, rawTimestamp: p.rawTimestamp || null,
      reactions: p.reactions ?? null, comments: p.comments ?? null, reposts: p.reposts ?? null,
      imageUrl: p.imageUrl || null,
      selected: true,
    }));
    progressEl.textContent = `Found ${_calScrapedPosts.length} posts. Review and pick which to use below.`;
    renderFriendPostChecklist();
    document.getElementById('cal-post-checklist-card').hidden = false;
  } catch (e) {
    showToast(`Something went wrong: ${e.message}`, 'error');
    progressEl.textContent = '';
  } finally {
    scrapeBtn.disabled = false;
  }
}

function formatEngagement(p) {
  const parts = [];
  if (p.reactions != null) parts.push(`👍 ${p.reactions.toLocaleString()}`);
  if (p.comments != null) parts.push(`💬 ${p.comments.toLocaleString()}`);
  if (p.reposts != null) parts.push(`🔁 ${p.reposts.toLocaleString()}`);
  return parts.length ? parts.join('  ') : 'Engagement unknown';
}

function renderFriendPostChecklist() {
  const el = document.getElementById('cal-post-checklist');
  const PREVIEW_LEN = 220;
  el.innerHTML = _calScrapedPosts.map((p, i) => {
    const truncated = p.text.length > PREVIEW_LEN;
    return `
    <div class="cal-post-check-item">
      <input type="checkbox" class="cal-post-checkbox" data-idx="${i}" ${p.selected ? 'checked' : ''}>
      ${p.imageUrl ? `<img class="cal-post-check-thumb" src="${escapeHTML(p.imageUrl)}" alt="Post image" loading="lazy">` : ''}
      <div class="cal-post-check-body">
        <div class="cal-post-check-meta">${escapeHTML(p.rawTimestamp || 'Unknown date')} · ${escapeHTML(formatEngagement(p))}</div>
        <div class="cal-post-check-text" data-idx="${i}" data-expanded="false">${escapeHTML(p.text.slice(0, PREVIEW_LEN))}${truncated ? '…' : ''}</div>
        ${truncated ? `<button type="button" class="cal-post-expand-btn" data-idx="${i}">Show full post</button>` : ''}
      </div>
    </div>`;
  }).join('');

  el.querySelectorAll('.cal-post-checkbox').forEach(cb => {
    cb.addEventListener('change', () => {
      _calScrapedPosts[Number(cb.dataset.idx)].selected = cb.checked;
      updateChecklistCount();
    });
  });

  el.querySelectorAll('.cal-post-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = Number(btn.dataset.idx);
      const textEl = el.querySelector(`.cal-post-check-text[data-idx="${idx}"]`);
      const expanded = textEl.dataset.expanded === 'true';
      const fullText = _calScrapedPosts[idx].text;
      textEl.textContent = expanded ? fullText.slice(0, PREVIEW_LEN) + '…' : fullText;
      textEl.dataset.expanded = expanded ? 'false' : 'true';
      btn.textContent = expanded ? 'Show full post' : 'Show less';
    });
  });

  updateChecklistCount();
}

function updateChecklistCount() {
  const n = _calScrapedPosts.filter(p => p.selected).length;
  document.getElementById('cal-post-checklist-count').textContent = `${n} selected`;
  const genBtn = document.getElementById('cal-generate-step2');
  genBtn.textContent = `2. Generate calendar (${n} selected)`;
  genBtn.disabled = n === 0;
}

/**
 * Generate one day with a few retries (covers transient backend hiccups over
 * a long batch) before giving up and marking it 'failed'. Never throws —
 * always returns either a real post or a failed-placeholder, so the batch
 * loop never has to stop early on one bad day.
 */
async function generateDayWithRetry(day, stream, { retries = 3, retryDelayMs = 2000 } = {}) {
  let lastError = null;
  for (let attempt = 1; attempt <= retries; attempt++) {
    const resp = await sendMsg(MSG.GENERATE_CALENDAR_POST, { day, stream });
    if (resp?.post) return { post: resp.post };
    lastError = resp?.error || 'unknown error';
    if (attempt < retries) await new Promise(r => setTimeout(r, retryDelayMs));
  }
  return {
    post: {
      day: typeof day === 'object' && day ? day.day : day, stream, status: 'failed',
      postText: '', suggestedTime: '', timezoneLabel: '',
      failReason: lastError,
    },
  };
}

/**
 * Step 2: sequential generation, one day at a time — gentle on a local
 * Ollama backend, and lets Cancel take effect between days (mirrors
 * draftAll()). Completed days are persisted incrementally so a cancel/crash
 * mid-run doesn't lose earlier days. Only runs against the user's SELECTED
 * subset from the checklist above (still oldest-first among selections).
 * Each day gets a few retries before being marked 'failed' rather than
 * stopping the whole batch — a long (e.g. 90-day) run should never die
 * partway through over one transient failure.
 */
async function generateCalendarBatch() {
  const friendProfileUrl = document.getElementById('cal-friend-url').value.trim();
  const ratioFriend = Number(document.getElementById('cal-ratio-friend').value);
  const totalDays = Math.max(1, Math.min(120, parseInt(document.getElementById('cal-days').value) || 30));
  const timeSlot = selectedTimeSlot();
  const selectedPosts = _calScrapedPosts.filter(p => p.selected).map(p => ({ text: p.text, rawTimestamp: p.rawTimestamp, imageUrl: p.imageUrl || null }));
  const startDateStr = document.getElementById('cal-start-date').value;
  // Parse as LOCAL midnight (y, m-1, d) — `new Date('YYYY-MM-DD')` would be UTC.
  const [sy, sm, sd] = (startDateStr || '').split('-').map(Number);
  const startDate = sy && sm && sd ? new Date(sy, sm - 1, sd) : new Date();

  if (!selectedPosts.length) { showToast('Select at least one friend post, or scrape again.', 'error'); return; }

  const genBtn = document.getElementById('cal-generate-step2');
  const cancelBtn = document.getElementById('cal-cancel');
  const progressEl = document.getElementById('cal-progress');

  genBtn.disabled = true;
  cancelBtn.hidden = false;
  _calCancelled = false;

  try {
    progressEl.textContent = `Building calendar from ${selectedPosts.length} selected posts…`;
    const build = await sendMsg(MSG.BUILD_CALENDAR_BATCH, {
      friendProfileUrl, ratio: { friend: ratioFriend, trending: 100 - ratioFriend }, timeSlot, totalDays, selectedPosts,
    });

    if (build?.error) {
      showToast(`Couldn't build the calendar: ${build.error}`, 'error');
      progressEl.textContent = '';
      return;
    }

    if (build.shortfall > 0) {
      const from = build.pattern.length - build.shortfall + 1;
      showToast(`You selected ${build.friendPostsFound} posts — days ${from}-${build.pattern.length} will use trending instead.`);
    }

    let done = 0;
    let failed = 0;
    for (let i = 0; i < build.pattern.length; i++) {
      if (_calCancelled) break;
      const day = i + 1;
      const stream = build.pattern[i];
      progressEl.textContent = `Generating day ${day} of ${build.pattern.length} (${stream})…`;

      const { post } = await generateDayWithRetry(day, stream);
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(scheduledDate.getDate() + i);
      post.scheduledDate = localDateStr(scheduledDate);
      await sendMsg(MSG.ADD_CALENDAR_POSTS, { posts: [post] });
      if (post.status === 'failed') {
        failed++;
        showToast(`Day ${day} failed after retries: ${post.failReason}`, 'error');
      }
      done++;
    }

    const failedNote = failed > 0 ? ` (${failed} failed — click a failed day to retry it)` : '';
    progressEl.textContent = _calCancelled
      ? `Cancelled after ${done} of ${build.pattern.length} days.${failedNote}`
      : `Generated ${done - failed} of ${build.pattern.length} posts.${failedNote}`;
  } catch (e) {
    showToast(`Something went wrong: ${e.message}`, 'error');
    progressEl.textContent = '';
  } finally {
    genBtn.disabled = false;
    cancelBtn.hidden = true;
    renderCalendarGrid().catch(() => {});
  }
}

async function renderCalendarGrid() {
  const resp = await sendMsg(MSG.GET_CALENDAR);
  const posts = resp?.posts || [];
  document.getElementById('cal-count').textContent = `${posts.length} ${posts.length === 1 ? 'post' : 'posts'}`;

  // Calendar posts are keyed by REAL scheduled date (YYYY-MM-DD), computed
  // from the batch's start date + day offset — not the bare 1-N batch index,
  // which would collide across month boundaries for anything past ~31 days.
  // Older posts generated before scheduledDate existed fall back to a rough
  // day-of-month key so they still render somewhere rather than vanishing.
  const byDate = new Map(posts.filter(p => p.scheduledDate).map(p => [p.scheduledDate, p]));
  const legacyByDay = new Map(posts.filter(p => !p.scheduledDate).map(p => [p.day, p]));

  const y = _calMonthCursor.getFullYear();
  const m = _calMonthCursor.getMonth();
  document.getElementById('cal-month-label').textContent =
    _calMonthCursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const firstOfMonth = new Date(y, m, 1);
  const startOffset = firstOfMonth.getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  const grid = document.getElementById('cal-grid');
  grid.innerHTML = cells.map(day => {
    if (!day) return `<div class="cal-day cal-day-empty"></div>`;
    const iso = `${y}-${String(m + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const post = byDate.get(iso) || legacyByDay.get(day);
    const statusClass = post ? `cal-day-${escapeHTML(post.status || 'draft')}` : '';
    const badge = post ? (post.stream === 'friend' ? '🧑‍🤝‍🧑' : '📈') : '';
    const failedNote = post?.status === 'failed' ? `<div class="cal-day-failed-note">⚠ Failed — click to retry</div>` : '';
    return `
      <div class="cal-day ${statusClass}" data-iso="${iso}" data-legacy-day="${day}">
        <div class="cal-day-top">
          <span class="cal-day-num">${day}</span>
          <span class="cal-day-badge">${badge}</span>
        </div>
        ${post && post.status !== 'failed' ? `<div class="cal-day-time">${escapeHTML(post.suggestedTime || '')} ${escapeHTML(post.timezoneLabel || '')}</div>` : ''}
        ${post?.sourceImageUrl ? `<img class="cal-day-thumb" src="${escapeHTML(post.sourceImageUrl)}" alt="" loading="lazy">` : ''}
        ${failedNote}
        ${post && post.status !== 'failed' ? `<div class="cal-day-preview">${escapeHTML((post.postText || '').slice(0, 100))}</div>` : ''}
      </div>`;
  }).join('');

  grid.querySelectorAll('.cal-day:not(.cal-day-empty)').forEach(cell =>
    cell.addEventListener('click', () => {
      const iso = cell.dataset.iso;
      const post = byDate.get(iso) || legacyByDay.get(Number(cell.dataset.legacyDay));
      if (post?.status === 'failed') { retryFailedDay(post); return; }
      if (post) openCalendarModal(post);
    }));
}

/** Retry a single failed day in place, without touching the rest of the batch. */
async function retryFailedDay(failedPost) {
  showToast(`Retrying day ${failedPost.day}…`);
  // A failed friend day may already carry its source post — reuse it (contract:
  // pass the existing day object) rather than consuming the next unused one.
  const dayArg = failedPost.stream === 'friend' && failedPost.sourceFriendPostText ? failedPost : failedPost.day;
  const { post } = await generateDayWithRetry(dayArg, failedPost.stream);
  post.day = failedPost.day;
  post.scheduledDate = failedPost.scheduledDate;
  await sendMsg(MSG.UPDATE_CALENDAR_POST, { id: failedPost.id, patch: post });
  if (post.status === 'failed') {
    showToast(`Day ${failedPost.day} failed again: ${post.failReason}`, 'error');
  } else {
    showToast(`Day ${failedPost.day} generated.`);
  }
  renderCalendarGrid();
}

function initCalendarModal() {
  document.getElementById('cal-modal-close').addEventListener('click', closeCalendarModal);
  document.getElementById('cal-modal-overlay').addEventListener('click', (e) => {
    if (e.target.id === 'cal-modal-overlay') closeCalendarModal();
  });
  document.getElementById('cal-modal-save').addEventListener('click', saveCalendarModal);
  document.getElementById('cal-modal-regenerate').addEventListener('click', regenerateCalendarDay);
  document.getElementById('cal-modal-posted').addEventListener('click', () =>
    setCalendarStatus('posted', { postedAt: Date.now() }));
  document.getElementById('cal-modal-delete').addEventListener('click', deleteCalendarModalPost);
}

function openCalendarModal(post) {
  _calModalPost = post;
  const streamLabel = post.stream === 'friend' ? 'Friend-derived' : 'Trending';
  const timeLabel = post.suggestedTime ? ` — ${post.suggestedTime} ${post.timezoneLabel || ''}`.trimEnd() : '';
  document.getElementById('cal-modal-title').textContent = `Day ${post.day} — ${streamLabel}${timeLabel}`;
  document.getElementById('cal-modal-content').value = post.postText || '';

  const imageEl = document.getElementById('cal-modal-image');
  if (post.sourceImageUrl) {
    imageEl.src = post.sourceImageUrl;
    imageEl.hidden = false;
  } else {
    imageEl.hidden = true;
    imageEl.src = '';
  }

  const sourceEl = document.getElementById('cal-modal-source');
  if (post.stream === 'friend' && post.sourceFriendPostText) {
    document.getElementById('cal-modal-source-summary').textContent = 'Source post (reference only)';
    document.getElementById('cal-modal-source-text').textContent = post.sourceFriendPostText;
    sourceEl.hidden = false;
  } else {
    sourceEl.hidden = true;
  }

  document.getElementById('cal-modal-overlay').hidden = false;
}

function closeCalendarModal() {
  document.getElementById('cal-modal-overlay').hidden = true;
  _calModalPost = null;
}

async function saveCalendarModal() {
  if (!_calModalPost) return;
  const postText = document.getElementById('cal-modal-content').value;
  const status = postText !== _calModalPost.postText ? 'edited' : _calModalPost.status;
  await sendMsg(MSG.UPDATE_CALENDAR_POST, { id: _calModalPost.id, patch: { postText, status } });
  showToast('Saved.');
  closeCalendarModal();
  renderCalendarGrid();
}

async function regenerateCalendarDay() {
  if (!_calModalPost) return;
  const btn = document.getElementById('cal-modal-regenerate');
  btn.disabled = true;
  // Pass the EXISTING day object (incl. sourceFriendPostText) so the
  // background re-adapts the same friend post instead of consuming the next one.
  const isFriend = _calModalPost.stream === 'friend';
  const resp = await sendMsg(MSG.GENERATE_CALENDAR_POST, {
    day: isFriend ? _calModalPost : _calModalPost.day,
    stream: _calModalPost.stream,
  });
  btn.disabled = false;
  if (resp?.post) {
    document.getElementById('cal-modal-content').value = resp.post.postText;
  } else {
    showToast(`Regenerate failed: ${resp?.error || 'unknown error'}`, 'error');
  }
}

async function setCalendarStatus(status, extraPatch = {}) {
  if (!_calModalPost) return;
  await sendMsg(MSG.UPDATE_CALENDAR_POST, { id: _calModalPost.id, patch: { status, ...extraPatch } });
  showToast(status === 'posted' ? '✓ Marked as posted!' : `Status: ${status}`);
  closeCalendarModal();
  renderCalendarGrid();
}

async function deleteCalendarModalPost() {
  if (!_calModalPost) return;
  if (!confirm('Delete this day\'s post?')) return;
  await sendMsg(MSG.DELETE_CALENDAR_POST, { id: _calModalPost.id });
  closeCalendarModal();
  renderCalendarGrid();
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function escapeHTML(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─── Boot ──────────────────────────────────────────────────────────────────

async function main() {
  initTabs();
  initHistoryTab();
  initCalendarTab();

  if (location.hash === '#calendar') {
    document.querySelector('[data-tab="calendar"]')?.click();
  }

  const settings = await sendMsg(MSG.GET_SETTINGS);
  await Promise.all([
    initLLMTab(settings),
    initStyleTab(),
    initAdvancedTab(settings),
    initQueueTab(settings),
    checkSidebarStatus(),
    loadStyleProfile(),
    loadQueue(),
  ]);
}

main();
