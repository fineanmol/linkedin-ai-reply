/**
 * queue-panel.js
 * A floating, on-page engagement-queue panel injected directly into LinkedIn.
 *
 * Goal: the user never leaves LinkedIn. A launcher button (bottom-right) opens
 * a Shadow-DOM panel listing queued trending posts. From there they can:
 *   - Build the queue by scanning the current page
 *   - Draft a comment (or Draft all)
 *   - Click a post → if it's on THIS page, scroll to it; else open its permalink
 *     in a new tab — with the draft comment already copied to the clipboard.
 *
 * ToS-safe: it never posts. The user pastes + presses LinkedIn's Post button.
 */

import { MSG } from '../utils/constants.js';
import { extractFeedPosts } from './post-extractor.js';
import { extractTopContentPosts, isTopContentPage } from './topcontent-extractor.js';
import { copyToClipboard } from '../utils/dom-helpers.js';
import logger from '../utils/logger.js';

const HOST_ID = 'liar-queue-host';
let _open = false;

const CSS = `
  :host { all: initial; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  * { box-sizing: border-box; }
  .launcher {
    position: fixed; right: 20px; bottom: 20px; z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 10px 16px; border-radius: 999px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #5cc3e8, #3b9dbf); color: #fff;
    font-size: 13px; font-weight: 700; box-shadow: 0 6px 20px rgba(49,72,85,.28);
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .launcher:hover { transform: translateY(-2px); box-shadow: 0 10px 26px rgba(49,72,85,.34); }
  .launcher .badge {
    background: #fff; color: #3b9dbf; border-radius: 999px; min-width: 20px;
    height: 20px; padding: 0 6px; font-size: 12px; display: inline-flex;
    align-items: center; justify-content: center; font-weight: 800;
  }
  .panel {
    position: fixed; right: 20px; bottom: 74px; z-index: 2147483000;
    width: 380px; max-width: calc(100vw - 40px); max-height: 72vh;
    display: flex; flex-direction: column;
    background: #fff; color: #314855; border: 1px solid rgba(49,72,85,.15);
    border-radius: 14px; box-shadow: 0 18px 50px rgba(49,72,85,.28); overflow: hidden;
    animation: slide .18s ease-out;
  }
  @keyframes slide { from { opacity:0; transform: translateY(8px);} to {opacity:1; transform:none;} }
  @media (prefers-color-scheme: dark) {
    .panel { background:#1b2733; color:#e8eef3; border-color:rgba(255,255,255,.14); }
    .row { border-color: rgba(255,255,255,.08) !important; }
    .draft { background:#101922 !important; color:#e8eef3 !important; border-color:rgba(255,255,255,.14) !important; }
    .muted { color:#9fb0bd !important; }
  }
  .head { display:flex; align-items:center; gap:8px; padding:14px 16px; border-bottom:1px solid rgba(49,72,85,.12); }
  .head h3 { margin:0; font-size:14px; font-weight:700; flex:1; }
  .head button { background:none; border:none; cursor:pointer; color:inherit; font-size:16px; opacity:.6; padding:4px; }
  .head button:hover { opacity:1; }
  .toolbar { display:flex; gap:8px; padding:10px 16px; border-bottom:1px solid rgba(49,72,85,.12); flex-wrap:wrap; }
  .btn { border:none; border-radius:8px; padding:7px 12px; font-size:12.5px; font-weight:600; cursor:pointer; }
  .btn-primary { background:#5cc3e8; color:#fff; }
  .btn-primary:hover { filter:brightness(.96); }
  .btn-ghost { background:rgba(92,195,232,.12); color:#3b9dbf; }
  .btn-ghost:hover { background:rgba(92,195,232,.22); }
  .btn:disabled { opacity:.5; cursor:not-allowed; }
  .list { overflow-y:auto; padding:8px; }
  .row { border:1px solid rgba(49,72,85,.12); border-radius:10px; padding:10px 12px; margin:8px 4px; }
  .row.done { opacity:.5; }
  .meta { display:flex; gap:6px; align-items:center; font-size:12px; margin-bottom:6px; flex-wrap:wrap; }
  .who { font-weight:700; }
  .pill { background:rgba(92,195,232,.14); color:#3b9dbf; border-radius:999px; padding:1px 7px; font-size:10.5px; font-weight:700; }
  .snip { font-size:12.5px; line-height:1.4; margin:0 0 8px; }
  .muted { color: rgba(49,72,85,.6); }
  .draft { width:100%; min-height:56px; border:1px solid rgba(49,72,85,.18); border-radius:8px; padding:8px; font:inherit; font-size:12.5px; resize:vertical; background:#f8fafc; color:#314855; }
  .acts { display:flex; gap:6px; margin-top:8px; flex-wrap:wrap; }
  .empty { padding:26px 16px; text-align:center; font-size:13px; color:rgba(49,72,85,.6); }
  .status { padding:6px 16px; font-size:11.5px; color:rgba(49,72,85,.6); }
`;

function send(type, payload) {
  return chrome.runtime.sendMessage({ type, payload }).catch(() => ({}));
}

/** Find a post element on the CURRENT page matching a urn/permalink. */
function findPostOnPage(item) {
  const urnNum = (item.urn || '').match(/activity:(\d+)/)?.[1];
  if (urnNum) {
    const link = document.querySelector(`a[href*="${urnNum}"]`);
    if (link) return link;
  }
  // Fallback: match by a distinctive slice of the post text.
  if (item.postText) {
    const needle = item.postText.slice(0, 40);
    const bodies = document.querySelectorAll('[componentkey^="feed-commentary_"], [data-testid="expandable-text-box"]');
    for (const b of bodies) {
      if ((b.textContent || '').includes(needle)) return b;
    }
  }
  return null;
}

export class QueuePanel {
  constructor() { this.host = null; this.shadow = null; }

  ensureLauncher() {
    if (document.getElementById(HOST_ID)) return;
    this.host = document.createElement('div');
    this.host.id = HOST_ID;
    this.shadow = this.host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = CSS;
    this.shadow.appendChild(style);
    this.root = document.createElement('div');
    this.shadow.appendChild(this.root);
    document.body.appendChild(this.host);
    this.renderLauncher();
  }

  async renderLauncher() {
    const { queue = [] } = await send(MSG.GET_QUEUE);
    const pending = queue.filter(q => q.status !== 'skipped' && q.status !== 'done').length;
    if (_open) { this.renderPanel(queue); return; }
    this.root.innerHTML = `
      <button class="launcher" id="q-launch">
        🚀 <span>Engagement</span> <span class="badge">${pending}</span>
      </button>`;
    this.root.querySelector('#q-launch').onclick = () => { _open = true; this.renderLauncher(); };
  }

  async renderPanel(queueArg) {
    const { queue = [] } = queueArg ? { queue: queueArg } : await send(MSG.GET_QUEUE);
    const { counts = { today: 0, week: 0, total: 0 } } = await send(MSG.GET_COMMENTS_LOG);
    // Keep done items visible in-session so the user can see progress, but
    // sort them to the bottom.
    const items = queue.filter(q => q.status !== 'skipped')
      .sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0));
    const rows = items.map(q => {
      const rel = q.relevance != null ? `${Math.round(q.relevance * 100)}%` : '';
      const done = q.status === 'done';
      const copied = q.status === 'copied';
      return `
      <div class="row ${done ? 'done' : ''}" data-id="${q.id}">
        <div class="meta">
          <span class="who">${esc(q.authorName || 'Someone')}</span>
          ${rel ? `<span class="pill">${rel} match</span>` : ''}
          ${done ? '<span class="pill">✓ posted</span>' : copied ? '<span class="pill">copied</span>' : ''}
        </div>
        <p class="snip">${esc((q.postText || '').slice(0, 140))}${(q.postText || '').length > 140 ? '…' : ''}</p>
        ${q.whyEngage ? `<div class="muted" style="font-size:11px;margin-bottom:6px;">Why: ${esc(q.whyEngage)}</div>` : ''}
        <textarea class="draft" data-id="${q.id}" placeholder="Click “Draft” to write a comment…">${esc(q.draftReply || '')}</textarea>
        <div class="acts">
          <button class="btn btn-ghost q-draft" data-id="${q.id}">${q.draftReply ? '↻ Redraft' : '✨ Draft'}</button>
          <button class="btn btn-primary q-go" data-id="${q.id}">📋 Copy & go to post</button>
          <button class="btn ${done ? 'btn-ghost' : 'btn-ghost'} q-posted" data-id="${q.id}" ${done ? 'disabled' : ''}>✓ I posted this</button>
          <button class="btn btn-ghost q-skip" data-id="${q.id}">Skip</button>
        </div>
      </div>`;
    }).join('');

    this.root.innerHTML = `
      <div class="panel">
        <div class="head">
          <h3>🚀 Engagement Queue</h3>
          <span class="pill" title="Comments you've posted">${counts.today} today · ${counts.week} this week</span>
          <button id="q-min" title="Minimize">—</button>
        </div>
        <div class="toolbar">
          <button class="btn btn-primary" id="q-build">＋ Build from this page</button>
          <button class="btn btn-ghost" id="q-draftall">✨ Draft all</button>
        </div>
        <div class="status" id="q-status">Copy a draft → comment on LinkedIn → tap “I posted this” to track it.</div>
        <div class="list">${rows || '<div class="empty">Queue is empty.<br>Open your feed or a trending page, then click <b>Build from this page</b>.</div>'}</div>
      </div>`;

    this.root.querySelector('#q-min').onclick = () => { _open = false; this.renderLauncher(); };
    this.root.querySelector('#q-build').onclick = () => this.buildFromPage();
    this.root.querySelector('#q-draftall').onclick = () => this.draftAll();
    this.root.querySelectorAll('.q-draft').forEach(b => b.onclick = () => this.draftOne(b.dataset.id));
    this.root.querySelectorAll('.q-go').forEach(b => b.onclick = () => this.goToPost(b.dataset.id));
    this.root.querySelectorAll('.q-posted').forEach(b => b.onclick = () => this.markPosted(b.dataset.id));
    this.root.querySelectorAll('.q-skip').forEach(b => b.onclick = () => this.skip(b.dataset.id));
    this.root.querySelectorAll('.draft').forEach(t =>
      t.onchange = () => send(MSG.UPDATE_QUEUE_ITEM, { id: t.dataset.id, patch: { draftReply: t.value } }));
  }

  status(msg) { const s = this.root.querySelector('#q-status'); if (s) s.textContent = msg || ''; }

  async buildFromPage() {
    this.status('Scanning this page…');
    const posts = isTopContentPage() ? extractTopContentPosts(document) : extractFeedPosts(document);
    if (!posts.length) { this.status('No posts found here. Scroll a bit and retry.'); return; }
    const resp = await send(MSG.BUILD_QUEUE, { posts });
    this.status(`Scanned ${resp?.scanned ?? posts.length}, added ${resp?.added ?? 0} to queue.`);
    this.renderPanel();
  }

  async draftOne(id) {
    const { queue = [] } = await send(MSG.GET_QUEUE);
    const item = queue.find(q => q.id === id);
    if (!item) return;
    const ta = this.root.querySelector(`.draft[data-id="${id}"]`);
    if (ta) ta.value = 'Generating…';
    const gen = await send(MSG.GENERATE_REPLY, {
      commentId: `queue-${id}`, commentText: item.postText, authorName: item.authorName,
      postContent: item.postText, intent: 'post_comment', forceRegenerate: !!item.draftReply,
    });
    const text = gen?.reply || `(couldn't generate: ${gen?.error || 'unknown'})`;
    if (ta) ta.value = text;
    await send(MSG.UPDATE_QUEUE_ITEM, { id, patch: { draftReply: text } });
  }

  async draftAll() {
    const { queue = [] } = await send(MSG.GET_QUEUE);
    const pending = queue.filter(q => q.status !== 'skipped' && !q.draftReply);
    if (!pending.length) { this.status('All items already drafted.'); return; }
    let n = 0;
    for (const item of pending) {
      this.status(`Drafting ${n + 1} of ${pending.length}…`);
      const gen = await send(MSG.GENERATE_REPLY, {
        commentId: `queue-${item.id}`, commentText: item.postText, authorName: item.authorName,
        postContent: item.postText, intent: 'post_comment',
      });
      if (gen?.reply) await send(MSG.UPDATE_QUEUE_ITEM, { id: item.id, patch: { draftReply: gen.reply } });
      n++;
    }
    this.status(`Drafted ${n}. Review, then Copy & go to each post.`);
    this.renderPanel();
  }

  async goToPost(id) {
    const { queue = [] } = await send(MSG.GET_QUEUE);
    const item = queue.find(q => q.id === id);
    if (!item) return;
    const ta = this.root.querySelector(`.draft[data-id="${id}"]`);
    const text = (ta?.value || item.draftReply || '').trim();
    if (text) {
      const ok = await copyToClipboard(text);
      this.status(ok ? 'Copied ✓ — paste in the comment box, then tap “I posted this”.' : 'Copy failed — select the text and copy manually.');
    }
    // Mark as 'copied' (in-progress), NOT done. Done requires explicit confirm.
    await send(MSG.UPDATE_QUEUE_ITEM, { id, patch: { status: 'copied' } });

    // If the post is on THIS page, scroll to it and highlight; else open it.
    const el = findPostOnPage(item);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const card = el.closest('div') || el;
      const prev = card.style.outline;
      card.style.outline = '3px solid #5cc3e8';
      card.style.outlineOffset = '3px';
      setTimeout(() => { card.style.outline = prev; }, 2600);
    } else if (item.permalink) {
      window.open(item.permalink, '_blank', 'noopener');
    } else {
      this.status('Comment copied — but couldn\'t locate the post. Search the author on LinkedIn.');
    }
    this.renderPanel();
  }

  /** User confirms they actually posted the comment → log it + mark done. */
  async markPosted(id) {
    const { queue = [] } = await send(MSG.GET_QUEUE);
    const item = queue.find(q => q.id === id);
    if (!item) return;
    const ta = this.root.querySelector(`.draft[data-id="${id}"]`);
    const comment = (ta?.value || item.draftReply || '').trim();
    const resp = await send(MSG.LOG_COMMENT, {
      urn: item.urn, authorName: item.authorName, postText: item.postText, comment,
    });
    await send(MSG.UPDATE_QUEUE_ITEM, { id, patch: { status: 'done' } });
    const c = resp?.counts;
    this.status(c ? `Logged ✓ — ${c.today} today, ${c.week} this week. Nice work!` : 'Logged ✓');
    this.renderPanel();
  }

  async skip(id) {
    await send(MSG.UPDATE_QUEUE_ITEM, { id, patch: { status: 'skipped' } });
    this.renderPanel();
  }
}

function esc(s) {
  return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

let _panel = null;
export function mountQueuePanel() {
  if (_panel) return _panel;
  try {
    _panel = new QueuePanel();
    _panel.ensureLauncher();
    logger.log('QueuePanel: launcher mounted');
  } catch (e) {
    console.warn('[LIAR] QueuePanel mount failed:', e);
  }
  return _panel;
}
