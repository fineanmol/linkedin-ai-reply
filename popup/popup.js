/**
 * popup.js — Popup controller
 */

import { MSG, STORAGE_KEYS } from '../utils/constants.js';

async function sendMsg(type, payload) {
  try {
    return await chrome.runtime.sendMessage({ type, payload });
  } catch (e) {
    return { error: e.message };
  }
}

async function init() {
  // Load settings
  const settings = await sendMsg(MSG.GET_SETTINGS);
  const toggle = document.getElementById('enabled-toggle');
  if (toggle) toggle.checked = settings?.enabled !== false;

  toggle?.addEventListener('change', async () => {
    await sendMsg(MSG.SAVE_SETTINGS, { enabled: toggle.checked });
    // Notify active LinkedIn tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (tab?.id) {
      chrome.tabs.sendMessage(tab.id, {
        type: 'SETTINGS_CHANGED',
        payload: { enabled: toggle.checked },
      }).catch(() => {});
    }
  });

  // Check backend status (backend-aware)
  await checkBackendStatus(settings);

  // Load stats
  await loadStats();

  // Dynamic version from manifest
  const versionEl = document.getElementById('ext-version');
  if (versionEl) {
    versionEl.textContent = `v${chrome.runtime.getManifest().version}`;
  }

  // Open settings
  document.getElementById('open-options')?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
}

async function checkBackendStatus(settings) {
  const dot = document.getElementById('ollama-dot');
  const label = document.getElementById('ollama-label');
  const modelEl = document.getElementById('current-model');
  const hint = document.getElementById('setup-hint');
  const backend = settings?.llmBackend || 'ollama';

  // ── Gemini selected ────────────────────────────────────────────────────
  if (backend === 'gemini') {
    const hasKey = !!settings?.geminiApiKey;
    dot.className = `status-dot ${hasKey ? 'online' : 'offline'}`;
    label.textContent = hasKey ? 'Gemini API ready' : 'Gemini API key missing';
    modelEl.textContent = settings?.geminiModel || 'gemini-2.5-flash';
    // Show hint only if key is missing
    hint.hidden = hasKey;
    if (!hasKey) {
      hint.querySelector('strong').textContent = '☁️ Gemini key missing';
      hint.querySelector('p').innerHTML = 'Add your API key in <b>Settings → LLM Backend</b>';
    }
    return;
  }

  // ── Auto mode ──────────────────────────────────────────────────────────
  if (backend === 'auto') {
    const ollamaResult = await sendMsg(MSG.CHECK_OLLAMA);
    if (ollamaResult?.alive) {
      dot.className = 'status-dot online';
      label.textContent = 'Auto → Ollama active';
      modelEl.textContent = settings?.ollamaModel || 'gemma2:2b';
      hint.hidden = true;
    } else if (settings?.geminiApiKey) {
      dot.className = 'status-dot online';
      label.textContent = 'Auto → Gemini fallback';
      modelEl.textContent = settings?.geminiModel || 'gemini-2.5-flash';
      hint.hidden = true;
    } else {
      dot.className = 'status-dot offline';
      label.textContent = 'No backend available';
      modelEl.textContent = '';
      hint.hidden = false;
      hint.querySelector('strong').textContent = '⚡ No backend available';
      hint.querySelector('p').innerHTML = 'Start Ollama: <code>ollama serve</code><br>or add a Gemini API key in Settings';
    }
    return;
  }

  // ── Ollama selected (default) ──────────────────────────────────────────
  const result = await sendMsg(MSG.CHECK_OLLAMA);
  if (result?.alive) {
    dot.className = 'status-dot online';
    label.textContent = 'Ollama connected';
    modelEl.textContent = settings?.ollamaModel || 'gemma2:2b';
    hint.hidden = true;
  } else {
    dot.className = 'status-dot offline';
    label.textContent = 'Ollama not running';
    modelEl.textContent = '';
    hint.hidden = false;
    hint.querySelector('strong').textContent = '⚡ Ollama not running';
    hint.querySelector('p').innerHTML = 'Start it: <code>ollama serve</code>';
  }
}

async function loadStats() {
  const [history, profile] = await Promise.all([
    chrome.storage.local.get('liar_reply_history').then(r => r.liar_reply_history || []),
    chrome.storage.local.get('liar_style_profile').then(r => r.liar_style_profile || { samples: [] }),
  ]);

  const generated = history.length;
  const approved = history.filter(h => h.status === 'approved').length;
  const samples = profile.samples?.length || 0;

  document.getElementById('stat-generated').textContent = generated || '0';
  document.getElementById('stat-approved').textContent = approved || '0';
  document.getElementById('stat-samples').textContent = samples || '0';
}

init();
