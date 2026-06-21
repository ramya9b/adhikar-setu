# 🌉 Adhikar Setu — Your Rights Bridge

**Find Indian Government Schemes You Qualify For**

AI-powered eligibility finder covering 58+ verified Central and State schemes across 15 Indian states.

---

## 🇮🇳 Features

- **58+ Verified Schemes** — Central + 15 State governments
- **Smart Eligibility Filter** — Age, state, income, category, occupation, special status
- **Search within results** — Filter by keyword, category or scope
- **Apply Tracking** — Mark which schemes you've applied for
- **Share Results** — Individual scheme or all results via WhatsApp
- **PDF Download** — Download matched schemes as PDF
- **AI Chat** — Ask in English, Hindi, Telugu or Kannada (Gemini 2.0 Flash)
- **PWA / Offline** — Install as app, works without internet
- **Dark/Light Theme**
- **CSC Locator** — Find nearest Common Service Centre

---

## 🏗️ Tech Stack

- React 18 + Vite 6
- Google Gemini 2.0 Flash API (chat)
- jsPDF (PDF generation)
- Cloudflare Pages / Vercel
- PWA (Service Worker + Web App Manifest)

---

## 🚀 Deploy on Vercel

1. Push repo to GitHub
2. Import in [Vercel](https://vercel.com)
3. Add environment variable: `VITE_GEMINI_API_KEY` = your Gemini API key
4. Build command: `npm run build` | Output: `dist`
5. Deploy ✅

Get Gemini API key free at: https://aistudio.google.com/apikey

---

## 🚀 Deploy on Cloudflare Pages

1. Connect GitHub repo in Cloudflare Pages
2. Build command: `npm run build` | Output directory: `dist`
3. Add env var: `VITE_GEMINI_API_KEY`
4. Deploy ✅

---

## 📁 Project Structure

```
adhikar-setu/
├── index.html              ← Entry HTML + SEO + JSON-LD
├── src/
│   ├── main.jsx            ← React entry
│   ├── App.jsx             ← Full application
│   ├── i18n.js             ← English, Hindi, Telugu, Kannada
│   ├── data/
│   │   └── schemes.js      ← 58+ verified schemes + filter engine
│   └── utils/
│       └── pdf.js          ← PDF generator
├── public/
│   ├── sw.js               ← Service worker (offline)
│   ├── manifest.json       ← PWA manifest
│   └── icons/              ← App icons
├── vercel.json             ← Vercel SPA routing + headers
└── vite.config.js
```

---

## ⚠️ Disclaimer

Data sourced from myscheme.gov.in and official state government portals.
Always verify scheme details at [myscheme.gov.in](https://myscheme.gov.in) before applying.
Not affiliated with the Government of India.

---

© 2025–2026 Sri Vara Lakshmi Balaji Enterprises, Bengaluru
