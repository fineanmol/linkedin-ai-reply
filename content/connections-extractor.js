/**
 * connections-extractor.js
 * Reads the user's connections page (linkedin.com/mynetwork/.../connections/)
 * and returns recent new connections for the welcome-message assistant.
 *
 * Read-only. Anchored on stable signals (verified against the 2026 DOM):
 *   - each card has a button/link with aria-label "Send a message to <Name>"
 *   - a profile link a[href*="/in/"]
 *   - a "Connected on <date>" line
 * No dependency on obfuscated class names.
 */

import logger from '../utils/logger.js';

/** True if we're on the connections list page. */
export function isConnectionsPage() {
  return /linkedin\.com\/mynetwork\/.*connections/i.test(location.href);
}

function parseConnectedDate(text) {
  // "Connected on July 16, 2026" → timestamp (for newest-first sorting)
  const m = (text || '').match(/Connected on (.+)/i);
  if (!m) return null;
  const d = new Date(m[1].trim());
  return isNaN(d.getTime()) ? null : d.getTime();
}

/**
 * Extract connections from the current page.
 * @returns {Array<{profilePath,name,headline,connectedOn,connectedTs}>}
 */
export function extractConnections(root = document) {
  // Anchor on the per-connection "Message" control.
  const msgControls = [...root.querySelectorAll('button, a')].filter(b => {
    const al = (b.getAttribute('aria-label') || '').toLowerCase();
    const t = (b.textContent || '').trim().toLowerCase();
    return /^send a message to /.test(al) || t === 'message';
  });

  const seen = new Set();
  const conns = [];

  for (const btn of msgControls) {
    // Walk up to the card (smallest ancestor that also has the profile link).
    let card = btn.parentElement;
    for (let i = 0; i < 8 && card; i++) {
      if (card.querySelector('a[href*="/in/"]')) break;
      card = card.parentElement;
    }
    if (!card) continue;

    const link = card.querySelector('a[href*="/in/"]');
    if (!link) continue;
    let profilePath;
    try { profilePath = new URL(link.href).pathname.replace(/\/(en|de|fr)?\/?$/, '').replace(/\/$/, ''); }
    catch { profilePath = link.getAttribute('href')?.split('?')[0] || null; }
    if (!profilePath || seen.has(profilePath)) continue;
    seen.add(profilePath);

    // Name: prefer the message-button aria-label ("Send a message to X"), which
    // is the cleanest source; fall back to the link text.
    const al = btn.getAttribute('aria-label') || '';
    let name = al.match(/^send a message to (.+)/i)?.[1]?.trim()
      || link.textContent?.trim().split('\n')[0];
    if (name) name = name.replace(/\s+/g, ' ').slice(0, 60);

    // Headline + connected date from the card's text lines.
    const lines = [...card.querySelectorAll('span, p')]
      .map(e => e.textContent.trim())
      .filter(Boolean);
    const connectedLine = lines.find(l => /^connected on /i.test(l)) || '';
    // Headline = the non-name, non-"connected", non-"message" line (usually the role).
    const headline = lines.find(l =>
      l !== name &&
      !/^connected on /i.test(l) &&
      l.toLowerCase() !== 'message' &&
      l.length > 2
    ) || '';

    conns.push({
      profilePath,
      name: name || 'there',
      headline: headline.slice(0, 200),
      connectedOn: connectedLine.replace(/^connected on /i, '').trim(),
      connectedTs: parseConnectedDate(connectedLine),
    });
  }

  // Newest connections first when we could parse the date.
  conns.sort((a, b) => (b.connectedTs || 0) - (a.connectedTs || 0));
  logger.log(`extractConnections: ${conns.length} connections from ${msgControls.length} message controls`);
  return conns;
}
