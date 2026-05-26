/**
 * options.js — Options page controller
 */

import { MSG, OLLAMA_MODELS, STORAGE_KEYS } from '../utils/constants.js';

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
    });
  });
}

// ─── Sidebar Status ────────────────────────────────────────────────────────

async function checkSidebarStatus() {
  const settings = await sendMsg(MSG.GET_SETTINGS);
  const backend = settings?.llmBackend || 'ollama';
  const dot = document.getElementById('sidebar-dot');
  const label = document.getElementById('sidebar-label');

  if (backend === 'gemini') {
    const hasKey = !!settings?.geminiApiKey;
    dot.className = `dot ${hasKey ? 'online' : 'offline'}`;
    label.textContent = hasKey ? 'Gemini API ready' : 'Gemini key missing';
    return;
  }

  if (backend === 'auto') {
    const r = await sendMsg(MSG.CHECK_OLLAMA);
    if (r?.alive) {
      dot.className = 'dot online';
      label.textContent = 'Ollama active';
    } else if (settings?.geminiApiKey) {
      dot.className = 'dot online';
      label.textContent = 'Gemini fallback';
    } else {
      dot.className = 'dot offline';
      label.textContent = 'No backend';
    }
    return;
  }

  // Ollama
  const result = await sendMsg(MSG.CHECK_OLLAMA);
  dot.className = `dot ${result?.alive ? 'online' : 'offline'}`;
  label.textContent = result?.alive ? 'Ollama connected' : 'Ollama offline';
}

// ─── LLM Tab ───────────────────────────────────────────────────────────────

async function initLLMTab(settings) {
  // Backend radio
  const radios = document.querySelectorAll('input[name="llmBackend"]');
  radios.forEach(r => {
    if (r.value === settings.llmBackend) r.checked = true;
    r.addEventListener('change', () => updateBackendVisibility(r.value));
  });
  updateBackendVisibility(settings.llmBackend);

  // Ollama URL
  const urlInput = document.getElementById('ollama-url');
  urlInput.value = settings.ollamaUrl || 'http://localhost:11434';

  // Load Ollama models
  await loadOllamaModels(settings.ollamaModel);

  document.getElementById('refresh-models').addEventListener('click', () => {
    loadOllamaModels(document.getElementById('ollama-model').value);
  });

  // Gemini
  document.getElementById('gemini-key').value = settings.geminiApiKey || '';
  const geminiModelSel = document.getElementById('gemini-model');
  geminiModelSel.value = settings.geminiModel || 'gemini-2.5-flash';

  // Sliders
  const maxSlider = document.getElementById('max-length');
  const maxVal = document.getElementById('max-length-val');
  maxSlider.value = settings.maxReplyLength || 150;
  maxVal.textContent = maxSlider.value;
  maxSlider.addEventListener('input', () => maxVal.textContent = maxSlider.value);

  const tempSlider = document.getElementById('temperature');
  const tempVal = document.getElementById('temp-val');
  tempSlider.value = settings.temperature || 0.7;
  tempVal.textContent = parseFloat(tempSlider.value).toFixed(1);
  tempSlider.addEventListener('input', () => tempVal.textContent = parseFloat(tempSlider.value).toFixed(1));

  // Save
  document.getElementById('save-llm').addEventListener('click', async () => {
    const backend = document.querySelector('input[name="llmBackend"]:checked')?.value || 'ollama';
    await sendMsg(MSG.SAVE_SETTINGS, {
      llmBackend: backend,
      ollamaUrl: urlInput.value.trim(),
      ollamaModel: document.getElementById('ollama-model').value,
      geminiApiKey: document.getElementById('gemini-key').value.trim(),
      geminiModel: document.getElementById('gemini-model').value,
      maxReplyLength: parseInt(maxSlider.value),
      temperature: parseFloat(tempSlider.value),
    });
    showToast('✓ LLM settings saved!');
  });
}

function updateBackendVisibility(backend) {
  document.getElementById('ollama-config').hidden = backend === 'gemini';
  document.getElementById('gemini-config').hidden = backend === 'ollama';
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
  const identity = await sendMsg('GET_IDENTITY');

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
          <span>${s.intent || 'general'}</span>
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
      await sendMsg('SAVE_IDENTITY', { name, profileUrl: null });
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
  const data = await chrome.storage.local.get('liar_reply_history');
  const history = data.liar_reply_history || [];
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
        <span class="history-status ${h.status || 'generated'}">${h.status === 'approved' ? '✓ Approved' : 'Generated'}</span>
        <span>${h.intent || 'general'}</span>
        <span>·</span>
        <span>${h.backend || 'local'} — ${h.model || ''}</span>
        <span>·</span>
        <span>${formatDate(h.timestamp)}</span>
      </div>
      ${h.commentText ? `<div class="history-comment">💬 "${escapeHTML(h.commentText.slice(0, 120))}${h.commentText.length > 120 ? '…' : ''}"</div>` : ''}
      <div class="history-reply">${escapeHTML(h.reply || '')}</div>
    </div>
  `).join('');

  document.getElementById('clear-history').addEventListener('click', async () => {
    if (!confirm('Clear all reply history?')) return;
    await chrome.storage.local.remove('liar_reply_history');
    showToast('History cleared.');
    loadHistory();
  }, { once: true });
}

// ─── Advanced Tab ──────────────────────────────────────────────────────────

async function initAdvancedTab(settings) {
  document.getElementById('auto-learn').checked = settings.autoLearnFromApproved !== false;
  document.getElementById('debug-mode').checked = settings.debugMode === true;

  document.getElementById('save-advanced').addEventListener('click', async () => {
    await sendMsg(MSG.SAVE_SETTINGS, {
      autoLearnFromApproved: document.getElementById('auto-learn').checked,
      debugMode: document.getElementById('debug-mode').checked,
    });
    showToast('✓ Advanced settings saved!');
  });

  document.getElementById('reset-all').addEventListener('click', async () => {
    if (!confirm('Reset ALL data? This cannot be undone.')) return;
    await chrome.storage.local.clear();
    showToast('All data cleared. Reloading…', 'success');
    setTimeout(() => location.reload(), 1500);
  });
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

  const settings = await sendMsg(MSG.GET_SETTINGS);
  await Promise.all([
    initLLMTab(settings),
    initStyleTab(),
    initAdvancedTab(settings),
    checkSidebarStatus(),
    loadStyleProfile(),
  ]);
}

main();
