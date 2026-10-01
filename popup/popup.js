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
    // SAVE_SETTINGS merges this partial patch; the background then broadcasts
    // SETTINGS_CHANGED (sanitized) to every LinkedIn tab, incl. the active one.
    await sendMsg(MSG.SAVE_SETTINGS, { enabled: toggle.checked });
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

/**
 * Status line, setup hint and footer — all driven by the background's
 * CHECK_BACKEND answer for the SELECTED backend, so the label is truthful
 * (e.g. "Claude (Claude Code bridge)") and "Local AI" only ever appears when
 * the backend really is local (Ollama).
 */
async function checkBackendStatus(settings) {
  const dot = document.getElementById('ollama-dot');
  const label = document.getElementById('ollama-label');
  const modelEl = document.getElementById('current-model');
  const hint = document.getElementById('setup-hint');
  const footerMode = document.getElementById('footer-mode');

  const r = await sendMsg(MSG.CHECK_BACKEND);
  const ok = r && typeof r.alive === 'boolean';
  const backend = (ok && r.backend) || settings?.llmBackend || 'ollama';
  const name = (ok && r.label) || backend;
  const isLocal = ok ? r.isLocal === true : backend === 'ollama';

  if (footerMode) {
    footerMode.textContent = isLocal ? 'Privacy-first · Local AI' : `Cloud AI · ${name}`;
  }

  if (ok && r.alive) {
    dot.className = 'status-dot online';
    label.textContent = `${name} connected`;
    modelEl.textContent = r.model || '';
    hint.hidden = true;
    return;
  }

  dot.className = 'status-dot offline';
  label.textContent = ok ? `${name} not available` : 'Backend status unavailable';
  modelEl.textContent = '';
  label.title = r?.error || '';
  hint.hidden = false;

  const strong = hint.querySelector('strong');
  const p = hint.querySelector('p');
  if (backend === 'ollama') {
    strong.textContent = '⚡ Ollama not running';
    p.innerHTML = 'Start it: <code>ollama serve</code>';
  } else if (backend === 'claude' && settings?.claudeMode !== 'api') {
    strong.textContent = '⚡ Claude bridge not running';
    p.innerHTML = 'Start it: <code>npm run bridge</code>';
  } else if (backend === 'claude') {
    strong.textContent = '☁️ Claude API not ready';
    p.innerHTML = 'Add your key in <b>Settings → LLM Backend</b>';
  } else if (backend === 'gemini') {
    strong.textContent = '☁️ Gemini not ready';
    p.innerHTML = 'Add your key in <b>Settings → LLM Backend</b>';
  } else {
    strong.textContent = '⚡ No backend available';
    p.innerHTML = 'Start Ollama: <code>ollama serve</code><br>or add your key in <b>Settings</b>';
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
