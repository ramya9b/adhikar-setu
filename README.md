# 🌉 Adhikar Setu

**Your Right. Your Bridge.**

AI-powered Indian Government Schemes Finder — helping every citizen discover Central & State schemes they qualify for.

---

## 🇮🇳 What It Does

- Finds 4000+ government schemes based on your profile
- Covers loans, housing, health, education, pensions, subsidies
- Chat interface + Form interface
- Live AI search — always up to date
- WhatsApp share, scheme detail pages
- Dark & Light theme
- Multilingual: English, Hindi, Telugu, Kannada

---

## 🚀 Quick Start

```bash
npm install
npm run dev
```

## 🏗️ Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.

---

## ☁️ Deploy on Cloudflare Pages

1. Push this repo to GitHub
2. Go to [Cloudflare Pages](https://pages.cloudflare.com/)
3. Connect GitHub repo
4. Set build command: `npm run build`
5. Set output directory: `dist`
6. **Add environment variable** `GEMINI_API_KEY` (Settings → Environment variables → Production & Preview). Required for chat & AI fallback search — the key is read by [`functions/api/chat.js`](functions/api/chat.js) and never exposed to the browser. Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).
7. Deploy ✅

### Local development with the API proxy

`npm run dev` serves the React app only — `/api/chat` will 404. To exercise the proxy locally, run Pages + Functions together:

```bash
GEMINI_API_KEY=... npx wrangler pages dev -- npm run dev
```

---

## 📁 Project Structure

```
adhikar-setu/
├── index.html          ← Entry HTML
├── src/
│   ├── main.jsx        ← React entry point
│   └── App.jsx         ← Full application
├── _headers            ← Cloudflare security headers
├── _redirects          ← SPA routing fix
├── vite.config.js
└── package.json
```

---

## 🎨 Tech Stack

- React 18
- Vite 6
- Gemini 2.5 Flash (with Google Search grounding)
- Cloudflare Pages + Pages Functions

---

## ⚠️ Disclaimer

Data sourced via AI-powered web search. Always verify on [myscheme.gov.in](https://myscheme.gov.in) before applying.

---

© 2025 Sri Vara Lakshmi Balaji Enterprises, Bengaluru
