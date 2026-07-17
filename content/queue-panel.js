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
import { extractConnections } from './connections-extractor.js';
import { copyToClipboard } from '../utils/dom-helpers.js';
import logger from '../utils/logger.js';

const HOST_ID = 'liar-queue-host';
let _open = false;
let _tab = 'comments'; // 'comments' | 'connections'

// Inline SVG of the extension logo (lightning bolt in a speech bubble) — the
// same motif as the toolbar icon. Inline so it needs no web_accessible_resource
// or getURL, and stays crisp at any size. `size` and `bolt` colors are params.
const LOGO = (size = 20, bubble = '#5cc3e8', bolt = '#ffffff') => `
  <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" aria-hidden="true" style="flex:0 0 auto;">
    <path d="M12 2.2c-5.4 0-9.8 3.8-9.8 8.5 0 2.6 1.4 5 3.6 6.5l-.8 3.5c-.1.5.4.9.9.6l3.9-2.2c.7.1 1.5.2 2.2.2 5.4 0 9.8-3.8 9.8-8.6S17.4 2.2 12 2.2z" fill="${bubble}"/>
    <path d="M12.7 6.5l-3.4 5h2.2l-.6 4 3.6-5.2h-2.3z" fill="${bolt}"/>
  </svg>`;

const CSS = `
  /* Reset so LinkedIn's page cascade can't leak in (font, color, line-height). */
  :host { all: initial; }
  :host, :host * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }
  /* Fixed dark theme — high contrast, self-contained, doesn't depend on the
     viewer's OS theme or LinkedIn's. Every text color is set explicitly. */
  .launcher {
    /* Sit ABOVE LinkedIn's own messaging bar (bottom-right) so they don't overlap. */
    position: fixed; right: 24px; bottom: 84px; z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 18px; border-radius: 999px; border: none; cursor: pointer;
    background: linear-gradient(135deg, #5cc3e8, #3b9dbf); color: #ffffff;
    font-size: 14px; font-weight: 700; box-shadow: 0 6px 22px rgba(0,0,0,.35);
    transition: transform .15s ease, box-shadow .15s ease;
  }
  .launcher:hover { transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.42); }
  .launcher .badge {
    background: #ffffff; color: #1e6f8c; border-radius: 999px; min-width: 22px;
    height: 22px; padding: 0 7px; font-size: 12px; display: inline-flex;
    align-items: center; justify-content: center; font-weight: 800;
  }

  /* Centered modal + dimmed backdrop so you clearly see what's queued. */
  .backdrop {
    position: fixed; inset: 0; z-index: 2147483000;
    background: rgba(16, 24, 33, .55);
    display: flex; align-items: center; justify-content: center;
    animation: fade .15s ease-out;
  }
  @keyframes fade { from { opacity:0 } to { opacity:1 } }
  .panel {
    width: 460px; max-width: calc(100vw - 40px); max-height: 82vh;
    display: flex; flex-direction: column;
    background: #17212b; color: #eaf1f6;
    border: 1px solid rgba(255,255,255,.12);
    border-radius: 16px; box-shadow: 0 24px 70px rgba(0,0,0,.5); overflow: hidden;
    animation: pop .18s ease-out;
  }
  @keyframes pop { from { opacity:0; transform: scale(.96);} to { opacity:1; transform:none;} }

  .head { display:flex; align-items:center; gap:10px; padding:16px 18px; border-bottom:1px solid rgba(255,255,255,.1); }
  .head h3 { margin:0; font-size:15px; font-weight:700; flex:1; color:#ffffff; display:flex; align-items:center; gap:8px; }
  .head button { background:none; border:none; cursor:pointer; color:#c6d3dd; font-size:20px; line-height:1; padding:2px 6px; border-radius:6px; }
  .head button:hover { color:#fff; background:rgba(255,255,255,.1); }

  .tabs { display:flex; gap:4px; padding:8px 14px 0; border-bottom:1px solid rgba(255,255,255,.1); }
  .tab { flex:1; background:none; border:none; cursor:pointer; color:#9fb0bd; font-size:13px; font-weight:700; padding:9px 8px; border-radius:8px 8px 0 0; border-bottom:2px solid transparent; }
  .tab:hover { color:#dbe6ee; }
  .tab.active { color:#fff; border-bottom-color:#5cc3e8; }
  .toolbar { display:flex; gap:8px; padding:12px 18px; border-bottom:1px solid rgba(255,255,255,.1); flex-wrap:wrap; align-items:center; }
  .btn { border:none; border-radius:8px; padding:8px 13px; font-size:13px; font-weight:700; cursor:pointer; }
  .btn-primary { background:#5cc3e8; color:#0c1a22; }
  .btn-primary:hover { filter:brightness(1.06); }
  .btn-ghost { background:rgba(92,195,232,.16); color:#8fdcf5; }
  .btn-ghost:hover { background:rgba(92,195,232,.28); }
  .btn:disabled { opacity:.45; cursor:not-allowed; }

  .list { overflow-y:auto; padding:10px; }
  .row { border:1px solid rgba(255,255,255,.1); border-radius:12px; padding:12px 14px; margin:8px 4px; background:rgba(255,255,255,.02); }
  .row.done { opacity:.5; }
  .meta { display:flex; gap:6px; align-items:center; font-size:12.5px; margin-bottom:6px; flex-wrap:wrap; color:#c6d3dd; }
  .who { font-weight:700; color:#ffffff; }
  .pill { background:rgba(92,195,232,.2); color:#8fdcf5; border-radius:999px; padding:2px 8px; font-size:11px; font-weight:700; }
  .snip { font-size:13px; line-height:1.45; margin:0 0 8px; color:#dbe6ee; }
  .muted { color:#9fb0bd; }
  .draft {
    width:100%; min-height:60px; border:1px solid rgba(255,255,255,.16);
    border-radius:8px; padding:9px; font-size:13px; line-height:1.45; resize:vertical;
    background:#0e1720; color:#eaf1f6;
  }
  .draft::placeholder { color:#7d8b96; }
  .draft:focus { outline:none; border-color:#5cc3e8; box-shadow:0 0 0 1px #5cc3e8; }
  .acts { display:flex; gap:6px; margin-top:9px; flex-wrap:wrap; }
  .empty { padding:30px 18px; text-align:center; font-size:13.5px; line-height:1.5; color:#c6d3dd; }
  .empty b { color:#fff; }
  .status { padding:8px 18px; font-size:12px; color:#9fb0bd; border-bottom:1px solid rgba(255,255,255,.06); }
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
        ${LOGO(20, '#ffffff', '#3b9dbf')} <span>Engagement</span> <span class="badge">${pending}</span>
      </button>`;
    this.root.querySelector('#q-launch').onclick = () => { _open = true; this.renderLauncher(); };
  }

  async renderPanel() {
    const tab = _tab;
    const body = tab === 'connections'
      ? await this._connectionsBody()
      : await this._commentsBody();

    this.root.innerHTML = `
      <div class="backdrop" id="q-backdrop">
        <div class="panel" role="dialog" aria-label="LinkedIn Assistant">
          <div class="head">
            <h3>${LOGO(18, '#5cc3e8', '#0c1a22')} LinkedIn Assistant</h3>
            <button id="q-min" title="Close">✕</button>
          </div>
          <div class="tabs">
            <button class="tab ${tab === 'comments' ? 'active' : ''}" data-tab="comments">💬 Comments</button>
            <button class="tab ${tab === 'connections' ? 'active' : ''}" data-tab="connections">🤝 Connections</button>
          </div>
          ${body}
        </div>
      </div>`;

    const close = () => { _open = false; this.renderLauncher(); };
    this.root.querySelector('#q-min').onclick = close;
    this.root.querySelector('#q-backdrop').onclick = (e) => { if (e.target.id === 'q-backdrop') close(); };
    this.root.querySelectorAll('.tab').forEach(t =>
      t.onclick = () => { _tab = t.dataset.tab; this.renderPanel(); });

    if (tab === 'connections') this._wireConnections();
    else this._wireComments();
  }

  // ── Comments tab ────────────────────────────────────────────────────────
  async _commentsBody() {
    const { queue = [] } = await send(MSG.GET_QUEUE);
    const { counts = { today: 0, week: 0, total: 0 } } = await send(MSG.GET_COMMENTS_LOG);
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
          <button class="btn btn-ghost q-posted" data-id="${q.id}" ${done ? 'disabled' : ''}>✓ I posted this</button>
          <button class="btn btn-ghost q-skip" data-id="${q.id}">Skip</button>
        </div>
      </div>`;
    }).join('');
    return `
      <div class="toolbar">
        <button class="btn btn-primary" id="q-build">＋ Build from this page</button>
        <button class="btn btn-ghost" id="q-draftall">✨ Draft all</button>
        <span class="pill" style="margin-left:auto;" title="Comments you've posted">${counts.today} today · ${counts.week} wk</span>
      </div>
      <div class="status" id="q-status">Copy a draft → comment on LinkedIn → tap “I posted this”.</div>
      <div class="list">${rows || '<div class="empty">No comments queued.<br>Open your feed or a trending page, then <b>Build from this page</b>.</div>'}</div>`;
  }

  _wireComments() {
    this.root.querySelector('#q-build').onclick = () => this.buildFromPage();
    this.root.querySelector('#q-draftall').onclick = () => this.draftAll();
    this.root.querySelectorAll('.q-draft').forEach(b => b.onclick = () => this.draftOne(b.dataset.id));
    this.root.querySelectorAll('.q-go').forEach(b => b.onclick = () => this.goToPost(b.dataset.id));
    this.root.querySelectorAll('.q-posted').forEach(b => b.onclick = () => this.markPosted(b.dataset.id));
    this.root.querySelectorAll('.q-skip').forEach(b => b.onclick = () => this.skip(b.dataset.id));
    this.root.querySelectorAll('.draft').forEach(t =>
      t.onchange = () => send(MSG.UPDATE_QUEUE_ITEM, { id: t.dataset.id, patch: { draftReply: t.value } }));
  }

  // ── Connections tab ───────────────────────────────────────────────────────
  async _connectionsBody() {
    const { connections = [] } = await send(MSG.GET_CONNECTIONS);
    const items = connections.sort((a, b) => (a.status === 'done' ? 1 : 0) - (b.status === 'done' ? 1 : 0));
    const rows = items.map(c => {
      const done = c.status === 'done';
      const copied = c.status === 'copied';
      return `
      <div class="row ${done ? 'done' : ''}" data-id="${c.id}">
        <div class="meta">
          <span class="who">${esc(c.name || 'there')}</span>
          ${c.connectedOn ? `<span class="pill">${esc(c.connectedOn)}</span>` : ''}
          ${done ? '<span class="pill">✓ sent</span>' : copied ? '<span class="pill">copied</span>' : ''}
        </div>
        ${c.headline ? `<p class="snip muted">${esc(c.headline.slice(0, 110))}</p>` : ''}
        <textarea class="cdraft" data-id="${c.id}" placeholder="Click “Draft” for a personalized note…">${esc(c.draftMessage || '')}</textarea>
        <div class="acts">
          <button class="btn btn-ghost c-draft" data-id="${c.id}">${c.draftMessage ? '↻ Redraft' : '✨ Draft'}</button>
          <button class="btn btn-primary c-go" data-id="${c.id}" data-path="${esc(c.profilePath || '')}">📋 Copy & open chat</button>
          <button class="btn btn-ghost c-sent" data-id="${c.id}" ${done ? 'disabled' : ''}>✓ I sent it</button>
          <button class="btn btn-ghost c-skip" data-id="${c.id}">Skip</button>
        </div>
      </div>`;
    }).join('');
    return `
      <div class="toolbar">
        <button class="btn btn-primary" id="c-scan">＋ Scan my connections</button>
        <button class="btn btn-ghost" id="c-draftall">✨ Draft all</button>
      </div>
      <div class="status" id="q-status">Open your Connections page, Scan, Draft → Copy & open chat → paste & Send yourself.</div>
      <div class="list">${rows || '<div class="empty">No connections queued.<br>Open your <b>Connections</b> page, then <b>Scan my connections</b>.</div>'}</div>`;
  }

  _wireConnections() {
    this.root.querySelector('#c-scan').onclick = () => this.scanConnections();
    this.root.querySelector('#c-draftall').onclick = () => this.draftAllConnections();
    this.root.querySelectorAll('.c-draft').forEach(b => b.onclick = () => this.draftConnection(b.dataset.id));
    this.root.querySelectorAll('.c-go').forEach(b => b.onclick = () => this.openChat(b.dataset.id, b.dataset.path));
    this.root.querySelectorAll('.c-sent').forEach(b => b.onclick = () => this.markSent(b.dataset.id));
    this.root.querySelectorAll('.c-skip').forEach(b => b.onclick = () => this.skipConnection(b.dataset.id));
    this.root.querySelectorAll('.cdraft').forEach(t =>
      t.onchange = () => send(MSG.UPDATE_CONNECTION, { id: t.dataset.id, patch: { draftMessage: t.value } }));
  }

  async scanConnections() {
    this.status('Scanning your connections page…');
    if (!/linkedin\.com\/mynetwork\/.*connections/i.test(location.href)) {
      this.status('Open your Connections page first (My Network → Connections), then Scan.');
      return;
    }
    const conns = extractConnections(document);
    if (!conns.length) { this.status('No connections found here. Scroll the list and retry.'); return; }
    const resp = await send(MSG.ADD_CONNECTIONS, { connections: conns });
    this.status(`Found ${conns.length}, added ${resp?.added ?? 0} new.`);
    this.renderPanel();
  }

  async draftConnection(id) {
    const { connections = [] } = await send(MSG.GET_CONNECTIONS);
    const c = connections.find(x => x.id === id);
    if (!c) return;
    const ta = this.root.querySelector(`.cdraft[data-id="${id}"]`);
    if (ta) ta.value = 'Writing…';
    const gen = await send(MSG.DRAFT_WELCOME, { name: c.name, headline: c.headline });
    const msg = gen?.message || `(couldn't generate: ${gen?.error || 'unknown'})`;
    if (ta) ta.value = msg;
    await send(MSG.UPDATE_CONNECTION, { id, patch: { draftMessage: msg } });
  }

  async draftAllConnections() {
    const { connections = [] } = await send(MSG.GET_CONNECTIONS);
    const pending = connections.filter(c => c.status !== 'skipped' && !c.draftMessage);
    if (!pending.length) { this.status('All connections already drafted.'); return; }
    let n = 0;
    for (const c of pending) {
      this.status(`Drafting ${n + 1} of ${pending.length}…`);
      const gen = await send(MSG.DRAFT_WELCOME, { name: c.name, headline: c.headline });
      if (gen?.message) await send(MSG.UPDATE_CONNECTION, { id: c.id, patch: { draftMessage: gen.message } });
      n++;
    }
    this.status(`Drafted ${n}. Review, then Copy & open chat.`);
    this.renderPanel();
  }

  async openChat(id, profilePath) {
    const { connections = [] } = await send(MSG.GET_CONNECTIONS);
    const c = connections.find(x => x.id === id);
    const ta = this.root.querySelector(`.cdraft[data-id="${id}"]`);
    const msg = (ta?.value || c?.draftMessage || '').trim();
    if (msg) {
      const ok = await copyToClipboard(msg);
      this.status(ok ? 'Copied ✓ — paste in the chat and Send, then tap “I sent it”.' : 'Copy failed — select and copy manually.');
    }
    await send(MSG.UPDATE_CONNECTION, { id, patch: { status: 'copied' } });
    // Open their profile with the message overlay (user sends manually).
    const path = profilePath || c?.profilePath;
    if (path) window.open(`https://www.linkedin.com${path}/`, '_blank', 'noopener');
    this.renderPanel();
  }

  async markSent(id) {
    await send(MSG.UPDATE_CONNECTION, { id, patch: { status: 'done' } });
    this.status('Marked sent ✓');
    this.renderPanel();
  }

  async skipConnection(id) {
    await send(MSG.UPDATE_CONNECTION, { id, patch: { status: 'skipped' } });
    this.renderPanel();
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
