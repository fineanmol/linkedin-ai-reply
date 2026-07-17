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
  /* ── Design tokens ─────────────────────────────────────────────────────
     Deep blue-biased ink ground (chosen, not a default grey), single sky-blue
     accent, semantic mint/amber for state. Self-contained dark theme so it
     reads consistently regardless of LinkedIn's or the OS theme. */
  :host {
    all: initial;
    --ink:      #0f1620;   /* deepest ground */
    --surface:  #18232f;   /* panel */
    --raised:   #202e3d;   /* rows, inputs */
    --line:     rgba(255,255,255,.08);
    --line-2:   rgba(255,255,255,.14);
    --text:     #eef4f8;
    --text-dim: #9fb1c0;
    --text-mut: #6f8395;
    --accent:   #5cc3e8;   /* sky blue — the one accent */
    --accent-ink:#08161d;
    --accent-soft: rgba(92,195,232,.14);
    --good:     #5fcf9e;   /* mint — done/sent */
    --warn:     #e6b143;   /* amber — pending/copied */
    --danger:   #e9736f;
    --shadow:   0 24px 70px rgba(0,0,0,.55);
    --r:        14px;
  }
  :host, :host * {
    box-sizing: border-box;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    font-variant-ligatures: none;
  }

  /* ── Launcher (collapsed) ─────────────────────────────────────────────── */
  .launcher {
    position: fixed; right: 24px; bottom: 92px; z-index: 2147483000;
    display: inline-flex; align-items: center; gap: 9px;
    padding: 11px 16px 11px 13px; border-radius: 999px; border: none; cursor: pointer;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--line-2);
    font-size: 13.5px; font-weight: 650; letter-spacing: .01em;
    box-shadow: 0 8px 24px rgba(0,0,0,.4);
    transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
  }
  .launcher:hover { transform: translateY(-2px); box-shadow: 0 14px 32px rgba(0,0,0,.5); border-color: var(--accent); }
  .launcher .badge {
    background: var(--accent); color: var(--accent-ink); border-radius: 999px;
    min-width: 20px; height: 20px; padding: 0 6px; font-size: 12px;
    display: inline-flex; align-items: center; justify-content: center; font-weight: 800;
    font-variant-numeric: tabular-nums;
  }
  .launcher .badge.zero { background: var(--raised); color: var(--text-mut); }

  /* ── Modal ─────────────────────────────────────────────────────────────── */
  .backdrop {
    position: fixed; inset: 0; z-index: 2147483000;
    background: rgba(6,11,16,.62); backdrop-filter: blur(2px);
    display: flex; align-items: center; justify-content: center;
    animation: fade .14s ease-out;
  }
  @keyframes fade { from { opacity:0 } to { opacity:1 } }
  .panel {
    width: 468px; max-width: calc(100vw - 40px); max-height: 84vh;
    display: flex; flex-direction: column;
    background: var(--surface); color: var(--text);
    border: 1px solid var(--line-2); border-radius: var(--r);
    box-shadow: var(--shadow); overflow: hidden;
    animation: pop .18s cubic-bezier(.2,.8,.2,1);
  }
  @keyframes pop { from { opacity:0; transform: translateY(8px) scale(.98);} to { opacity:1; transform:none;} }
  @media (prefers-reduced-motion: reduce) { .backdrop, .panel { animation: none; } }

  /* ── Header ────────────────────────────────────────────────────────────── */
  .head { display:flex; align-items:center; gap:10px; padding:15px 16px; }
  .head .brand { display:flex; align-items:center; gap:9px; flex:1; }
  .head h3 { margin:0; font-size:14.5px; font-weight:700; color:var(--text); letter-spacing:.01em; }
  .head .x { background:none; border:none; cursor:pointer; color:var(--text-dim); width:30px; height:30px; border-radius:8px; font-size:17px; line-height:1; display:flex; align-items:center; justify-content:center; transition:.12s; }
  .head .x:hover { color:var(--text); background:var(--raised); }

  /* ── Segmented tab control ─────────────────────────────────────────────── */
  .tabs { display:flex; gap:4px; margin:0 14px 12px; padding:4px; background:var(--ink); border-radius:10px; }
  .tab { flex:1; background:none; border:none; cursor:pointer; color:var(--text-dim); font-size:12.5px; font-weight:650; padding:8px 6px; border-radius:7px; transition:.14s; display:flex; align-items:center; justify-content:center; gap:6px; }
  .tab:hover { color:var(--text); }
  .tab.active { color:var(--accent-ink); background:var(--accent); }

  /* ── Toolbar + status ──────────────────────────────────────────────────── */
  .toolbar { display:flex; gap:8px; padding:0 16px 10px; flex-wrap:wrap; align-items:center; }
  .toolbar .spacer { flex:1; }
  .status { padding:0 16px 10px; font-size:11.5px; line-height:1.4; color:var(--text-mut); }

  /* ── Buttons ───────────────────────────────────────────────────────────── */
  .btn { border:none; border-radius:9px; padding:8px 13px; font-size:12.5px; font-weight:650; cursor:pointer; transition:.13s; display:inline-flex; align-items:center; gap:5px; white-space:nowrap; }
  .btn:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
  .btn-primary { background:var(--accent); color:var(--accent-ink); }
  .btn-primary:hover { filter:brightness(1.07); }
  .btn-ghost { background:var(--raised); color:var(--text); }
  .btn-ghost:hover { background:var(--line-2); }
  .btn-quiet { background:none; color:var(--text-dim); padding:8px 10px; }
  .btn-quiet:hover { color:var(--text); background:var(--raised); }
  .btn:disabled { opacity:.4; cursor:not-allowed; }
  .btn.sm { padding:6px 10px; font-size:12px; }

  /* ── List + rows (left status stripe encodes state at a glance) ────────── */
  .list { overflow-y:auto; padding:4px 12px 12px; display:flex; flex-direction:column; gap:9px; }
  .list::-webkit-scrollbar { width:8px; } .list::-webkit-scrollbar-thumb { background:var(--line-2); border-radius:8px; }
  .row {
    position:relative; border:1px solid var(--line); border-radius:11px;
    padding:12px 13px 12px 15px; background:var(--raised);
    transition:border-color .14s;
  }
  .row::before { content:''; position:absolute; left:0; top:10px; bottom:10px; width:3px; border-radius:3px; background:var(--text-mut); }
  .row.st-new::before    { background:var(--accent); }
  .row.st-copied::before { background:var(--warn); }
  .row.st-done::before   { background:var(--good); }
  .row.st-done { opacity:.6; }
  .row:hover { border-color:var(--line-2); }

  .meta { display:flex; gap:7px; align-items:center; margin-bottom:7px; flex-wrap:wrap; }
  .who { font-weight:700; color:var(--text); font-size:13.5px; }
  .pill { border-radius:999px; padding:2px 8px; font-size:10.5px; font-weight:700; letter-spacing:.02em; text-transform:uppercase; }
  .pill.match { background:var(--accent-soft); color:var(--accent); }
  .pill.date  { background:rgba(255,255,255,.06); color:var(--text-dim); text-transform:none; letter-spacing:0; font-weight:600; }
  .pill.done  { background:rgba(95,207,158,.16); color:var(--good); }
  .pill.copied{ background:rgba(230,177,67,.16); color:var(--warn); }
  .snip { font-size:12.5px; line-height:1.5; margin:0 0 8px; color:var(--text-dim); }
  .snip.head { color:var(--text-mut); font-style:italic; }
  .muted { color:var(--text-mut); }
  .why { font-size:11px; color:var(--text-mut); margin:0 0 8px; }

  .draft {
    width:100%; min-height:62px; border:1px solid var(--line-2); border-radius:9px;
    padding:9px 10px; font-size:12.5px; line-height:1.5; resize:vertical;
    background:var(--ink); color:var(--text);
  }
  .draft::placeholder { color:var(--text-mut); }
  .draft:focus { outline:none; border-color:var(--accent); box-shadow:0 0 0 2px var(--accent-soft); }
  .acts { display:flex; gap:6px; margin-top:9px; flex-wrap:wrap; }

  .empty { padding:34px 22px; text-align:center; font-size:13px; line-height:1.6; color:var(--text-dim); }
  .empty .big { font-size:26px; margin-bottom:8px; opacity:.8; }
  .empty b { color:var(--text); font-weight:700; }
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
      <button class="launcher" id="q-launch" title="LinkedIn Assistant">
        ${LOGO(20, '#5cc3e8', '#08161d')} <span>Assistant</span>
        <span class="badge ${pending ? '' : 'zero'}">${pending}</span>
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
            <div class="brand">${LOGO(20, '#5cc3e8', '#08161d')}<h3>LinkedIn Assistant</h3></div>
            <button class="x" id="q-min" title="Close" aria-label="Close">✕</button>
          </div>
          <div class="tabs" role="tablist">
            <button class="tab ${tab === 'comments' ? 'active' : ''}" data-tab="comments" role="tab">Comments</button>
            <button class="tab ${tab === 'connections' ? 'active' : ''}" data-tab="connections" role="tab">Connections</button>
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
      const st = q.status === 'done' ? 'done' : q.status === 'copied' ? 'copied' : 'new';
      return `
      <div class="row st-${st}" data-id="${q.id}">
        <div class="meta">
          <span class="who">${esc(q.authorName || 'Someone')}</span>
          ${rel ? `<span class="pill match">${rel} match</span>` : ''}
          ${st === 'done' ? '<span class="pill done">✓ posted</span>' : st === 'copied' ? '<span class="pill copied">copied</span>' : ''}
        </div>
        <p class="snip">${esc((q.postText || '').slice(0, 150))}${(q.postText || '').length > 150 ? '…' : ''}</p>
        ${q.whyEngage ? `<p class="why">Why engage: ${esc(q.whyEngage)}</p>` : ''}
        <textarea class="draft" data-id="${q.id}" placeholder="Click Draft to write a comment in your voice…">${esc(q.draftReply || '')}</textarea>
        <div class="acts">
          <button class="btn btn-ghost sm q-draft" data-id="${q.id}">${q.draftReply ? 'Redraft' : 'Draft'}</button>
          <button class="btn btn-primary sm q-go" data-id="${q.id}">Copy &amp; go to post</button>
          <button class="btn btn-ghost sm q-posted" data-id="${q.id}" ${st === 'done' ? 'disabled' : ''}>Mark posted</button>
          <button class="btn btn-quiet sm q-skip" data-id="${q.id}">Skip</button>
        </div>
      </div>`;
    }).join('');
    return `
      <div class="toolbar">
        <button class="btn btn-primary" id="q-build">Build from this page</button>
        <button class="btn btn-ghost" id="q-draftall">Draft all</button>
        <span class="spacer"></span>
        <span class="pill date" title="Comments you've posted">${counts.today} today · ${counts.week} wk</span>
      </div>
      <div class="status" id="q-status">Draft → Copy &amp; go to post → paste, post, then Mark posted.</div>
      <div class="list">${rows || '<div class="empty"><div class="big">💬</div>No comments queued yet.<br>Open your feed or a trending page, then hit <b>Build from this page</b>.</div>'}</div>`;
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
      const st = c.status === 'done' ? 'done' : c.status === 'copied' ? 'copied' : 'new';
      return `
      <div class="row st-${st}" data-id="${c.id}">
        <div class="meta">
          <span class="who">${esc(c.name || 'there')}</span>
          ${c.connectedOn ? `<span class="pill date">${esc(c.connectedOn)}</span>` : ''}
          ${st === 'done' ? '<span class="pill done">✓ sent</span>' : st === 'copied' ? '<span class="pill copied">copied</span>' : ''}
        </div>
        ${c.headline ? `<p class="snip head">${esc(c.headline.slice(0, 120))}</p>` : ''}
        <textarea class="cdraft" data-id="${c.id}" placeholder="Click Draft — reads their profile + recent posts…">${esc(c.draftMessage || '')}</textarea>
        <div class="acts">
          <button class="btn btn-ghost sm c-draft" data-id="${c.id}">${c.draftMessage ? 'Redraft' : 'Draft'}</button>
          <button class="btn btn-primary sm c-go" data-id="${c.id}" data-path="${esc(c.profilePath || '')}">Copy &amp; open chat</button>
          <button class="btn btn-ghost sm c-sent" data-id="${c.id}" ${st === 'done' ? 'disabled' : ''}>Mark sent</button>
          <button class="btn btn-quiet sm c-skip" data-id="${c.id}">Skip</button>
        </div>
      </div>`;
    }).join('');
    return `
      <div class="toolbar">
        <button class="btn btn-primary" id="c-scan">Scan my connections</button>
      </div>
      <div class="status" id="q-status">On your Connections page: Scan → Draft (reads their profile) → Copy &amp; open chat → paste &amp; Send.</div>
      <div class="list">${rows || '<div class="empty"><div class="big">🤝</div>No connections queued yet.<br>Open your <b>Connections</b> page, then hit <b>Scan my connections</b>.</div>'}</div>`;
  }

  _wireConnections() {
    this.root.querySelector('#c-scan').onclick = () => this.scanConnections();
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
    if (ta) ta.value = 'Reading their profile & recent posts…';
    this.status('Opening their profile to personalize (a few seconds)…');
    // DEEP draft: background opens their profile, reads About + recent posts,
    // drafts from that, closes the tab. Per-click only.
    const gen = await send(MSG.DEEP_DRAFT_WELCOME, {
      profilePath: c.profilePath, name: c.name, headline: c.headline,
    });
    const msg = gen?.message || `(couldn't generate: ${gen?.error || 'unknown'})`;
    if (ta) ta.value = msg;
    await send(MSG.UPDATE_CONNECTION, { id, patch: { draftMessage: msg } });
    this.status(gen?.deep ? 'Drafted from their profile + posts ✓' : 'Drafted (limited profile info) ✓');
  }

  async openChat(id, profilePath) {
    const { connections = [] } = await send(MSG.GET_CONNECTIONS);
    const c = connections.find(x => x.id === id);
    const ta = this.root.querySelector(`.cdraft[data-id="${id}"]`);
    const msg = (ta?.value || c?.draftMessage || '').trim();
    if (msg) {
      const ok = await copyToClipboard(msg);
      this.status(ok ? 'Copied ✓ — paste in the message box and Send, then tap “I sent it”.' : 'Copy failed — select and copy manually.');
    }
    await send(MSG.UPDATE_CONNECTION, { id, patch: { status: 'copied' } });
    // Open their MESSAGING thread directly (not just the profile). LinkedIn's
    // messaging deep-link by profile path opens the compose thread with them.
    const path = profilePath || c?.profilePath;
    if (path) {
      const handle = path.replace(/^\/in\//, '').replace(/\/$/, '');
      window.open(`https://www.linkedin.com/messaging/thread/new/?recipient=${encodeURIComponent(handle)}`, '_blank', 'noopener');
    }
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
