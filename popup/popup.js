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

  // Build today's engagement queue from the active LinkedIn tab.
  document.getElementById('build-queue')?.addEventListener('click', buildQueue);
}

async function buildQueue() {
  const btn = document.getElementById('build-queue');
  const label = document.getElementById('build-queue-label');
  const hint = document.getElementById('queue-hint');
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab?.id || !/linkedin\.com/.test(tab.url || '')) {
    hint.textContent = 'Open a LinkedIn tab (your feed) first, then build.';
    return;
  }

  btn.disabled = true;
  label.textContent = 'Scanning your feed…';
  hint.textContent = 'Reading posts on screen — scroll your feed for more.';

  try {
    const resp = await chrome.tabs.sendMessage(tab.id, { type: MSG.REQUEST_BUILD_QUEUE });
    if (resp?.ok) {
      label.textContent = `Added ${resp.added} to queue`;
      hint.innerHTML = resp.added > 0
        ? 'Open <b>Settings & Queue</b> to review and post.'
        : 'No new relevant posts found. Scroll the feed and try again.';
    } else if (resp?.reason === 'not-on-feed' || resp?.reason === 'no-posts-found') {
      label.textContent = 'Build today\'s engagement queue';
      hint.textContent = 'No posts detected. Open your LinkedIn feed and scroll a bit first.';
    } else {
      label.textContent = 'Build today\'s engagement queue';
      hint.textContent = `Couldn't build: ${resp?.error || 'unknown error'}.`;
    }
  } catch (e) {
    label.textContent = 'Build today\'s engagement queue';
    hint.textContent = 'Reload the LinkedIn tab and try again.';
  } finally {
    btn.disabled = false;
  }
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
