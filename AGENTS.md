# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Critical: compiled output, now maintained directly

This repository contains the **generated static files** produced by `hexo generate` (no `package.json`, `_config.yml`, or Markdown source here — the Hexo source project lives in a separate repo). **However, the current workflow maintains these static files directly in git** (homepage redesign, chatbot, etc.), so direct edits are the expected way to change this site.

Caveat: if the Hexo source project ever runs `hexo deploy` again, its fresh output will overwrite these direct edits — keep them in sync deliberately.

## Local preview

```bash
python3 -m http.server 8080
# → http://localhost:8080
```

There is no build step, dev server, linting, or test suite in this repo — it's pure static HTML.

## Architecture

- **Generator**: Hexo 6.3 with Butterfly theme (by jerryc127)
- **Hosting**: GitHub Pages from the `main` branch (username-level repo `H-Whisky.github.io`)
- **Theme CSS**: `css/index.css` is the theme's compiled, minified stylesheet (~87KB, single line). Override it via `css/enhance.css` rather than editing it directly.
- **Theme JS**: `js/main.js` + `js/utils.js` are the theme's core scripts. `js/enhance.js` is the custom enhancement layer added on top.
- **Post structure**: Each post lives at `YYYY/MM/DD/<slug>/index.html`. Posts use the `.post` body class; the homepage and archive/tag pages use `.page`.
- **Sidebar & rightside**: Shared across all pages via `#aside-content` and `#rightside`. Dark mode toggle state persists in `localStorage` under key `theme`.

## Site features

- Dark/light mode toggle (rightside panel), stored in `localStorage`
- Fancybox v4 lightbox for images
- Busuanzi visitor counter (async, from `busuanzi.ibruce.info`)
- hexo-blog-encrypt (`lib/hbe.js`) for password-protected posts (included but no posts currently use it)
- Simplified/Traditional Chinese toggle (`js/tw_cn.js`)
- Code highlighting with copy button (highlight.js)
- Custom homepage: glassmorphism welcome card + editorial "featured post" banner + 2-col post-card grid (`css/enhance.css` v2 section)
- Warm "corgi" palette (v3 override at the end of `css/enhance.css`): replaces Butterfly default blue accents with orange/brown (`#f0883e`/`#d96f24`), light + dark mode
- Corgi chatbot widget (`js/chatbot.js` + `css/chatbot.css`): rule-based offline fallback; real AI via DeepSeek (`https://api.deepseek.com/chat/completions`, OpenAI-compatible). Key resolution: visitor key entered in the panel ⚙ settings (stored in `localStorage`, never uploaded) > embedded `CONFIG.apiKey` (currently empty) > local canned replies
- Corgi is rendered as a low-poly 3D character (`js/corgi3d.js`, Three.js from CDN, built from primitives, no external model) mounted on the floating button; falls back to the 2D SVG on load failure
- `tags/index.html` tag overview page; custom branded `404.html`
- Enhancement layer (`js/enhance.js`): reading progress bar, scroll-reveal animations, parallax hero, auto-refresh footer copyright year

## Content

3 blog posts (all in Chinese): city memories of Nanjing and Taizhou, plus PMP study notes. Tags: `CityMem_Nanjing`, `CityMem_Taizhou`, `Learn_PMP`. Post images are hosted on `cdn.jsdelivr.net` under the `H-Whisky/Resource-Pic` repo.
