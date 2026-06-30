/**
 * styles.js
 * Brand-aligned stylesheets for the injected reply suggestion panel (Shadow DOM).
 */

export const PANEL_CSS = `
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    display: block;
    width: 100%;
    box-sizing: border-box;
    --navy: #314855;
    --sky-blue: #5cc3e8;
    --sunshine: #ffdb00;
    --mint: #79ceb8;
    --coral: #e95f5c;
    
    /* Default Light Mode */
    --bg-panel: #ffffff;
    --bg-hover: #f8fafc;
    --text-main: var(--navy);
    --text-muted: rgba(49, 72, 85, 0.7);
    --border-color: rgba(49, 72, 85, 0.15);
    --shadow-color: rgba(49, 72, 85, 0.1);
  }

  /* Support Dark Mode via host-context */
  :host-context(html.theme--dark),
  :host-context([data-theme="dark"]) {
    --bg-panel: var(--navy);
    --bg-hover: rgba(255, 255, 255, 0.05);
    --text-main: #ffffff;
    --text-muted: rgba(255, 255, 255, 0.70);
    --border-color: rgba(255, 255, 255, 0.15);
    --shadow-color: rgba(0, 0, 0, 0.3);
  }

  .panel {
    position: relative;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 16px;
    margin: 8px 0;
    box-shadow: 0 10px 25px -5px var(--shadow-color), 0 8px 10px -6px var(--shadow-color);
    color: var(--text-main);
    box-sizing: border-box;
    width: 100%;
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Header ── */
  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
    gap: 12px;
  }

  .panel-title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 600;
    color: var(--text-main);
    letter-spacing: 0.02em;
    text-transform: uppercase;
  }

  .panel-title svg {
    color: var(--sky-blue);
    flex-shrink: 0;
  }

  /* ── Intent Badge ── */
  .intent-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: capitalize;
  }

  /* ── Model Switcher ── */
  .model-switcher {
    position: relative;
    margin-left: auto;
    user-select: none;
  }

  .model-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 8px;
    border-radius: 16px;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
    background: var(--bg-hover);
    border: 1px solid var(--border-color);
    color: var(--text-main);
    transition: all 0.15s ease;
  }

  .model-pill:hover {
    background: var(--border-color);
  }

  .model-pill svg.caret {
    transition: transform 0.2s;
    opacity: 0.7;
  }

  .model-pill.open svg.caret {
    transform: rotate(180deg);
  }

  .model-dropdown {
    display: none;
    position: absolute;
    top: calc(100% + 4px);
    right: 0;
    min-width: 200px;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    box-shadow: 0 10px 15px -3px var(--shadow-color);
    z-index: 100;
    overflow: hidden;
    animation: fadeIn 0.12s ease-out;
  }

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-4px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .model-dropdown.open {
    display: block;
  }

  .model-section-label {
    padding: 6px 10px 2px;
    font-size: 9px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-muted);
  }

  .model-option {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    font-size: 11.5px;
    color: var(--text-main);
    cursor: pointer;
    transition: background 0.1s ease;
  }

  .model-option:hover {
    background: var(--bg-hover);
  }

  .model-option.active {
    background: rgba(92, 195, 232, 0.1);
    color: var(--sky-blue);
    font-weight: 600;
  }

  .model-option .model-icon {
    display: flex;
    align-items: center;
    color: var(--sky-blue);
  }

  .model-option .model-check {
    margin-left: auto;
    font-weight: bold;
    color: var(--sky-blue);
  }

  .model-divider {
    height: 1px;
    background: var(--border-color);
    margin: 3px 0;
  }

  /* ── Close Button ── */
  .close-btn {
    background: none;
    border: none;
    color: var(--text-muted);
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    transition: all 0.1s ease;
  }

  .close-btn:hover {
    color: var(--text-main);
    background: var(--bg-hover);
  }

  /* ── Textarea ── */
  .reply-textarea {
    width: 100%;
    min-height: 80px;
    background: var(--bg-panel);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 10px 12px;
    color: var(--text-main);
    font-size: 13.5px;
    line-height: 1.5;
    resize: vertical;
    outline: none;
    box-sizing: border-box;
    transition: border-color 0.15s ease;
    font-family: inherit;
  }

  .reply-textarea:focus {
    border-color: var(--sky-blue);
    box-shadow: 0 0 0 1px var(--sky-blue);
  }

  .reply-textarea::placeholder {
    color: var(--text-muted);
  }

  /* ── Metadata Row ── */
  .meta-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 8px;
    margin-bottom: 12px;
  }

  .backend-badge {
    font-size: 11px;
    color: var(--text-muted);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .backend-badge .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--mint);
    display: inline-block;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
  }

  .word-count {
    font-size: 11px;
    color: var(--text-muted);
  }

  /* ── Actions Row ── */
  .actions {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 6px;
    border: 1px solid transparent;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.15s ease;
    white-space: nowrap;
    font-family: inherit;
  }

  .btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* Brand button styling */
  .btn-approve {
    background: var(--sky-blue);
    color: #ffffff;
  }

  .btn-approve:hover:not(:disabled) {
    filter: brightness(0.95);
    box-shadow: 0 2px 4px rgba(92, 195, 232, 0.2);
  }

  .btn-approve.copied {
    background: var(--mint);
    color: #ffffff;
  }

  .btn-regenerate {
    background: var(--bg-panel);
    color: var(--text-main);
    border-color: var(--border-color);
  }

  .btn-regenerate:hover:not(:disabled) {
    background: var(--bg-hover);
  }

  .btn-reject {
    background: var(--bg-panel);
    color: var(--coral);
    border-color: var(--border-color);
  }

  .btn-reject:hover:not(:disabled) {
    background: rgba(233, 95, 92, 0.08);
    border-color: var(--coral);
  }

  /* ── Learn Row ── */
  .learn-row {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid var(--border-color);
  }

  .learn-checkbox {
    appearance: none;
    -webkit-appearance: none;
    width: 14px;
    height: 14px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
    cursor: pointer;
    position: relative;
    flex-shrink: 0;
    background: transparent;
    transition: all 0.12s ease;
  }

  .learn-checkbox:checked {
    background: var(--sky-blue);
    border-color: var(--sky-blue);
  }

  .learn-checkbox:checked::after {
    content: '';
    position: absolute;
    left: 4px;
    top: 1px;
    width: 3.5px;
    height: 7px;
    border: 1.8px solid white;
    border-top: none;
    border-left: none;
    transform: rotate(45deg);
  }

  .learn-label {
    font-size: 11.5px;
    color: var(--text-muted);
    cursor: pointer;
    user-select: none;
  }

  /* ── Loading State ── */
  .loading-state {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 0;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(92, 195, 232, 0.2);
    border-top-color: var(--sky-blue);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .loading-text {
    font-size: 13px;
    color: var(--text-muted);
  }

  /* ── Error State ── */
  .error-state {
    background: rgba(233, 95, 92, 0.08);
    border: 1px solid var(--coral);
    border-radius: 6px;
    padding: 10px 12px;
    color: var(--coral);
    font-size: 12.5px;
    line-height: 1.5;
    margin: 6px 0;
  }

  .error-hint {
    font-size: 11.5px;
    color: var(--text-muted);
    margin-top: 6px;
    line-height: 1.4;
  }

  code {
    background: rgba(49, 72, 85, 0.08);
    padding: 1px 4px;
    border-radius: 3px;
    font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
    font-size: 11px;
  }
`;
