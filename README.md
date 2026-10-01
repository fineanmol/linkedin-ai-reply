# LinkedIn AI Reply Assistant

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
[![Chrome Web Store](https://img.shields.io/badge/Chrome_Web_Store-Publishing_Ready-blue.svg)](https://chromewebstore.google.com/detail/fagknlmdpceocanmlampnkhjfgeaipdj?utm_source=item-share-cb)


> A Chrome Extension that learns your writing style and drafts contextual reply suggestions for LinkedIn comments. Run it fully local with Ollama, or use a cloud backend (Gemini or Claude) and accept that the text you reply to is sent to that provider.

![Extension Popup](assets/screenshot-popup.png)

---

## ✨ Features

- 🤖 **AI-powered replies** — generates replies that sound like *you*, not a robot
- 🏠 **Local option** — with Ollama (Gemma, Llama, Mistral, Qwen, DeepSeek) generation runs on your machine and no prompt goes to a cloud AI
- ☁️ **Cloud options** — Gemini (Google) or Claude (Anthropic, via the local Claude Code bridge or your own API key). These send post/comment text to the provider
- 🎯 **Intent detection** — classifies each comment (Question / Appreciation / Feedback / Criticism / Technical / Networking)
- 🧠 **Style learning** — learns from your approved replies to improve over time
- ✅ **Manual review always** — suggestions only; you copy and paste manually — no auto-posting
- 🗓️ **Content Calendar** — plan up to 120 days of draft posts, blended from a friend's post history (adapted, never copied) and original content ideas — still draft-only, still manual posting
- 🔒 **No tracking** — no analytics, no telemetry, no servers of ours. Data is stored in `chrome.storage.local`

---

## 🚀 Quick Start

### 1. Install Ollama

```bash
# macOS
brew install ollama

# Or download from https://ollama.com
```

### 2. Start Ollama & pull a model

```bash
ollama serve
ollama pull gemma2:2b    # Fast, ~1.5 GB RAM
# or
ollama pull llama3.2:3b  # Balanced, ~2 GB RAM
```

**No Ollama? Use Claude instead** (cloud: prompts go to Anthropic). Pick **Claude** in Settings → LLM Backend, then choose one of two connection modes:

- **Claude Code bridge** — if the `claude` CLI is installed and logged in, start the bridge and the extension uses your Claude Code login (no API key):

  ```bash
  npm run bridge                         # Ollama-compatible server on http://localhost:11435
  BRIDGE_TOKEN=some-long-random-string npm run bridge   # optional: require a shared token
  ```

  If you set `BRIDGE_TOKEN`, enter the same value as **Bridge token** in Settings. The bridge listens on `127.0.0.1` only, sends no CORS headers, and rejects requests from web pages (only `chrome-extension://` origins and `localhost` Host headers are accepted). Other env vars: `BRIDGE_PORT` (default `11435`), `BRIDGE_MODEL` (default `opus`), `BRIDGE_CONCURRENCY` (default `2`), `BRIDGE_TIMEOUT_MS`, `CLAUDE_BIN`.
- **Anthropic API key** — paste a key from the [Anthropic Console](https://console.anthropic.com/settings/keys). Requests go straight to `api.anthropic.com` through the official `@anthropic-ai/sdk`.

Models: `claude-opus-5-5` (default), `claude-sonnet-5-5`, `claude-haiku-4-5`. The temperature slider is ignored for Claude. Use **Test connection** in Settings to check the selected backend.

### 3. Load the extension in Chrome

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Run `npm install && npm run build`, then select the generated `dist/` folder

Run the test suite with `npm test`.

### 4. Use it on LinkedIn

1. Go to [linkedin.com/feed](https://www.linkedin.com/feed/)
2. Find a post **you authored** — it will detect your posts automatically
3. Hover over a comment → click the **✨ AI Reply** button
4. Review, edit if needed → click **Copy to clipboard**
5. Paste into LinkedIn's reply box and post manually

---

## 🤖 Supported Models

| Model | Size | Best For |
|-------|------|---------|
| `gemma2:2b` | ~1.5 GB | Fast, low RAM ✅ **Recommended** |
| `gemma2:9b` | ~5.5 GB | Better style mimicry |
| `llama3.2:3b` | ~2 GB | Balanced performance |
| `mistral:7b` | ~4 GB | Strong instruction following |
| `qwen2.5:3b` | ~2 GB | Multilingual support |
| `deepseek-r1:7b` | ~4.7 GB | Strong reasoning |

---

## 🧠 Style Learning

The AI learns your writing style through:

1. **Manual examples** — paste 5–10 of your typical LinkedIn replies in **Settings → Style Profile**
2. **Approved replies** — every reply you copy-and-approve is saved as a style sample (up to 100)
3. **Fingerprinting** — automatically detects your sentence length, emoji usage, tone, and common phrases

---

## 🗓️ Content Calendar

A separate feature (Settings → **Content Calendar**) for planning a stretch of future LinkedIn posts in one sitting, instead of facing a blank page every day.

### What it does

- **Scrapes a friend's public post history** (with their agreement — you point it at their profile URL) and lets you review every post found — full text, engagement counts, and image/GIF thumbnail — before picking which ones to use via checkboxes.
- **Adapts your selected posts into your own voice** — the LLM rewrites the *idea*, never copies wording, and is explicitly instructed not to reference the source post.
- **Fills the rest with original "trending-pattern" posts** — no live trending-topics feed exists or is used; the LLM reasons about durable, well-known B2B content patterns (a contrarian take, a framework, a story-with-a-lesson) rather than claiming real-time awareness it doesn't have.
- **Blends both at a ratio you set** (e.g. 70% friend-derived / 30% original), spread evenly across the month, with a suggested posting time (Germany/CET presets) shown per day.
- **Generates up to 120 days in one run**, sequentially, with automatic retries per day and a resumable "failed" state — a single bad network call or backend hiccup no longer kills the whole batch; failed days are flagged in the grid and can be retried individually with one click.
- Every generated post is a **draft you review, edit, and manually post yourself** — click a day to open it, edit the text, and mark it "Posted" once you've actually posted it on LinkedIn.

### What it does NOT do

- **It does not post anything to LinkedIn, ever, on any schedule.** There is no auto-posting anywhere in this feature — that would require either browser automation of LinkedIn's UI (which LinkedIn's User Agreement prohibits for browser extensions, regardless of whether a human clicks the final button) or LinkedIn's official API (which has no scheduling capability for personal profiles at all — only immediate publish, gated behind restricted API access). This is a firm limit, not a missing feature.
- **It is not connected to LinkedIn's own native "Schedule post" button.** That's LinkedIn's own separate feature; nothing here reads from or writes to it.
- **The "suggested time" label is informational only** — it doesn't trigger anything, remind via a fixed clock, or post at that time. A daily browser notification nudges you to review that day's draft, nothing more.
- **It doesn't upload or attach the friend's image/GIF anywhere** — the original image is shown alongside the generated caption purely so you remember to grab the same visual yourself when you post manually.
- **Requires a real LLM backend to generate anything** — Ollama (local) works but can be unreliable for long batches (crashes, memory limits, `ollama serve` not running); Gemini or Claude (both cloud) are more reliable for generating many days in one sitting. Switch via Settings → LLM Backend.
- **Reading the friend's posts requires background profile reading** (Settings → Advanced, off by default). It opens a hidden LinkedIn tab, which LinkedIn's User Agreement treats as automated scraping and which shows up as a profile view — see [Background profile reading](#-background-profile-reading-off-by-default).
- **Scraping a friend's post history depends on LinkedIn's current DOM** and can miss posts, truncate engagement counts, or fail outright if LinkedIn changes its layout — treat the scraped list as best-effort, not exhaustive.

---

## 🕵️ Background profile reading (off by default)

Two features can open **hidden LinkedIn tabs** to read another person's profile and recent activity:

- **Deep welcome drafts** (Connections tab of the on-page panel) — reads the new connection's About, headline, and recent posts.
- **Content Calendar → Scrape friend's posts** — reads the friend's recent activity.

Both are disabled until you turn on **Settings → Advanced → Allow background profile reading**. While it is off, those actions return *"Background profile reading is off…"* and no tabs are opened.

> ⚠️ **LinkedIn ToS risk.** LinkedIn's User Agreement prohibits automated scraping, so enabling this may put your LinkedIn account at risk. Every visit also shows up to that person as a profile view. The text read this way is sent to your selected AI backend (cloud for Gemini/Claude). Turn it on only if you accept that.

---

## 📁 Project Structure

```
linkedin-ai-reply/
├── manifest.json            # MV3 Chrome Extension manifest
├── build.js                 # esbuild bundler → *.bundle.js + dist/
├── background/
│   ├── background.js        # Service worker (message router)
│   ├── llm-router.js        # Picks Ollama / Gemini / Claude (and Auto fallback)
│   ├── ollama-client.js     # Ollama REST client (local)
│   ├── gemini-client.js     # Gemini API client (cloud)
│   ├── claude-client.js     # Claude client: bridge mode or Anthropic SDK (cloud)
│   ├── prompt-builder.js    # Prompt construction + toComment/toPost cleanup
│   ├── style-profiler.js    # Style learning & fingerprinting
│   ├── reply-cache.js       # Request deduplication
│   ├── calendar-builder.js  # Content Calendar batch planning + generation
│   └── alarms.js            # Daily calendar reminder (notification only)
├── bridge/
│   └── claude-bridge.js     # Local Ollama-compatible server → `claude -p` (npm run bridge)
├── content/
│   ├── content.js           # Main entry (MutationObserver)
│   ├── post-detector.js     # Finds posts/comments in LinkedIn's DOM
│   ├── comment-extractor.js # Comment parsing
│   ├── post-extractor.js    # Post parsing
│   ├── profile-extractor.js # Your identity / profile pages
│   ├── connections-extractor.js # New connections list
│   ├── topcontent-extractor.js  # LinkedIn "top content" pages
│   ├── intent-classifier.js # Heuristic intent detection
│   ├── ui-injector.js       # Injects the AI Reply button
│   ├── reply-panel.js       # Shadow DOM reply UI
│   ├── queue-panel.js       # On-page engagement queue + connections panel
│   └── ui/                  # Shared panel icons, styles, templates
├── popup/                   # Extension popup
├── options/                 # Settings page (queue, LLM, style, calendar, advanced)
├── styles/                  # Injected CSS
├── test/                    # Test suite (npm test)
└── utils/                   # Constants, storage, DOM helpers, logger
```

---

## ⚙️ Settings

Open **Settings** from the popup or `chrome://extensions` → **LinkedIn AI Reply → Details → Extension options**.

| Setting | Description |
|---------|-------------|
| LLM Backend | Ollama (local) / Gemini (cloud) / Claude (cloud) / Auto (Ollama → Gemini) |
| Ollama Model | Choose from installed/suggested models |
| Gemini API Key / Model | Your Google AI Studio key |
| Claude | Mode (Claude Code bridge or Anthropic API key), bridge URL + optional token, API key, model |
| Max Reply Length | 15–45 words (the prompt hard-caps replies at 45) |
| Temperature | Creativity (0.1 = consistent, 1.0 = creative); default 0.85; ignored for Claude |
| Auto-learn | Save approved replies to style profile |
| Allow background profile reading | Off by default — see the ToS warning above |

---

## 🔐 Privacy

- **Ollama (local)** — prompts stay on your machine
- **Gemini (cloud)** — post/comment text, author names, your name, and style samples are sent to Google
- **Claude (cloud)** — the same data is sent to Anthropic, whether through the local Claude Code bridge or directly with your API key
- **Auto** — uses Ollama when it is running, otherwise Gemini (cloud)
- **Background profile reading** (off by default) — when on, other people's profile About/headline/recent posts are also read and sent to the selected backend
- **No auto-posting** — ever, for replies, connection messages, and the Content Calendar. You copy, paste, and post everything yourself
- **No LinkedIn API calls** — the extension reads the DOM of pages you open
- **No analytics or telemetry** — the only network calls go to LinkedIn pages and the AI backend you selected
- Settings, keys, style profile, history, queues, and calendar are stored in `chrome.storage.local`

See [privacy-policy.html](privacy-policy.html) for the full data-flow description.

---

## 🗺️ Roadmap

### MVP (v1.0) ✅
- [x] Core extension with MutationObserver
- [x] Comment intent classification
- [x] Reply panel (Shadow DOM)
- [x] Ollama + Gemini integration
- [x] Style profile (manual + learned)

### v1.1 — Style Enhancement
- [ ] LinkedIn Activity tab scraper for style seeding
- [ ] Streaming token output in reply panel
- [ ] Per-intent tone fine-tuning

### v1.2 — Intelligence
- [ ] IndexedDB for scalable storage
- [ ] Vector embeddings (transformers.js in-browser)
- [ ] RAG: semantic retrieval of relevant past replies

### v2.0 — Power Features
- [ ] Chrome Side Panel integration
- [ ] Multiple tone profiles
- [ ] Batch comment review mode
- [ ] Export/import style profiles

---

## ⚠️ Important Notes

- **LinkedIn ToS**: By default the extension only reads pages you open and requires manual action for every reply. It does not use LinkedIn's API or auto-post. The optional background profile reading opens hidden LinkedIn tabs, which LinkedIn's User Agreement prohibits as automated scraping — it is off by default and you enable it at your own risk.
- **LinkedIn MCP server** (`.env.linkedin-mcp.example`): a separate, optional developer tool, not part of the extension. Its `li_at` cookie is a full LinkedIn login credential, and its automated messaging/connecting is against LinkedIn's terms.
- **LinkedIn DOM Changes**: LinkedIn updates their UI regularly. If buttons disappear, the extension selectors may need updating.
- **Not affiliated** with LinkedIn.

---

## 📄 License

GNU GPL-3.0 — see [LICENSE](LICENSE). You may use, modify, and redistribute under the terms of the GPL-3.0.
