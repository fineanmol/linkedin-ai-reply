# LinkedIn AI Reply Assistant

> A privacy-first Chrome Extension that learns your writing style and generates contextual reply suggestions for comments on your LinkedIn posts — powered by local AI via Ollama.

![Extension Popup](assets/screenshot-popup.png)

---

## ✨ Features

- 🤖 **AI-powered replies** — generates replies that sound like *you*, not a robot
- 🏠 **100% local inference** — uses Ollama (Gemma, Llama, Mistral, Qwen, DeepSeek) — data never leaves your machine
- 🎯 **Intent detection** — classifies each comment (Question / Appreciation / Feedback / Criticism / Technical / Networking)
- 🧠 **Style learning** — learns from your approved replies to improve over time
- ✅ **Manual review always** — suggestions only; you copy and paste manually — no auto-posting
- 🔒 **Privacy-first** — no analytics, no telemetry, no hidden servers

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

### 3. Load the extension in Chrome

1. Open Chrome → `chrome://extensions`
2. Enable **Developer Mode** (top right toggle)
3. Click **Load unpacked**
4. Select the `linkedin-ai-reply` folder

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

## 📁 Project Structure

```
linkedin-ai-reply/
├── manifest.json          # MV3 Chrome Extension manifest
├── background/
│   ├── background.js      # Service worker (message router)
│   ├── llm-router.js      # Ollama → Gemini routing
│   ├── ollama-client.js   # Ollama REST client
│   ├── gemini-client.js   # Gemini API client (fallback)
│   ├── prompt-builder.js  # Prompt construction
│   ├── style-profiler.js  # Style learning & fingerprinting
│   └── reply-cache.js     # Request deduplication
├── content/
│   ├── content.js         # Main entry (MutationObserver)
│   ├── post-detector.js   # "Is this my post?"
│   ├── comment-extractor.js # DOM comment parsing
│   ├── intent-classifier.js # Heuristic intent detection
│   ├── ui-injector.js     # Injects AI Reply button
│   └── reply-panel.js     # Shadow DOM reply UI
├── popup/                 # Extension popup
├── options/               # Settings page
├── styles/                # Injected CSS
└── utils/                 # Shared utilities
```

---

## ⚙️ Settings

Open **Settings** from the popup or `chrome://extensions` → **LinkedIn AI Reply → Details → Extension options**.

| Setting | Description |
|---------|-------------|
| LLM Backend | Ollama (local) / Gemini / Auto |
| Ollama Model | Choose from installed/suggested models |
| Max Reply Length | 30–300 words |
| Temperature | Creativity (0.1 = consistent, 1.0 = creative) |
| Auto-learn | Save approved replies to style profile |
| Gemini API Key | Optional cloud fallback |

---

## 🔐 Privacy

- **No data leaves your device** when using Ollama
- **No auto-posting** — ever. You must manually copy and paste
- **No LinkedIn API calls** — extension reads the DOM only, never writes through the API
- **No analytics or telemetry** — zero external calls from this extension
- Style profile stored in `chrome.storage.local` — private to your browser

---

## 🗺️ Roadmap

### MVP (v1.0) ✅
- [x] Core extension with MutationObserver
- [x] Post authorship detection
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

- **LinkedIn ToS**: This extension reads the DOM passively and requires manual user action for every reply. It does not use LinkedIn's API, scrape at scale, or auto-post.
- **LinkedIn DOM Changes**: LinkedIn updates their UI regularly. If buttons disappear, the extension selectors may need updating.
- **Not affiliated** with LinkedIn.

---

## 📄 License

MIT License — use freely, modify as needed.
