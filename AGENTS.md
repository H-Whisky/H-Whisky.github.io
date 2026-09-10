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
- Greenery palette (override at the end of `css/enhance.css`): replaces Butterfly default blue accents with light forest green (`#5cb377`/`#3f8f5c`), light + dark mode; card gradients and tag chips follow suit
- Corgi chatbot widget (`js/chatbot.js` + `css/chatbot.css`): rule-based offline fallback; real AI via DeepSeek (`https://api.deepseek.com/chat/completions`, OpenAI-compatible). Key resolution: visitor key entered in the panel ⚙ settings (stored in `localStorage`, never uploaded) > embedded `CONFIG.apiKey` (currently empty) > local canned replies
- Corgi is rendered as a low-poly 3D character (`js/corgi3d.js`, Three.js from CDN, built from primitives, no external model) mounted on the floating button; falls back to the 2D SVG on load failure
- `tags/index.html` tag overview page; custom branded `404.html`
- Enhancement layer (`js/enhance.js`): reading progress bar, scroll-reveal animations, parallax hero, auto-refresh footer copyright year

## Content

5 blog posts (all in Chinese): city memories of Nanjing and Taizhou, PMP study notes, an "About me" page embedding the library page, and "师门历年合照" (mentor-group photos). Tags: `CityMem_Nanjing`, `CityMem_Taizhou`, `Learn_PMP`, `About`, `Life`. Post images are hosted on `cdn.jsdelivr.net` under the `H-Whisky/Resource-Pic` repo.

## Images & performance (source-only WebP swap)

Every `<img>` that points at a CDN photo or at the sidebar avatar uses a **`.webp` URL**; the original `.jpg`/`.png` files are kept in the repo but are no longer referenced by `<img>`.

**Hard rules — do not reintroduce these; they caused a layout regression once and were reverted:**

- **NEVER add `width`/`height` attributes to `<img>`.** All image sizing on this site is CSS-driven (`.post-card-image`, `#article-container img`, `.avatar-img img`, …). Hard-coded dimensions fight the CSS and stretch images.
- **NEVER wrap images in `<picture>`**, and do not add `preload` / `image-set()` for images. Plain `<img src="….webp">` only.
- Any WebP variant MUST keep the **exact aspect ratio** of the original file (scale only, never crop). The avatar is 655×687 originally — do not square-crop it.
- `og:image` / `twitter:image` / `data-image` (social sharing + lightbox) intentionally keep `.jpg`/`.png` — WebP is poorly supported by social crawlers. Do not "fix" these to WebP.

**Regenerating WebP** (Pillow, venv at `~/.workbuddy/binaries/python/envs/default`): scale the longest edge to ≤1600px (background 1920px), keep the ratio, save `WEBP` q78–88 `method=6`. Push to `H-Whisky/Resource-Pic` under `images/`; local avatars go in this repo's `img/`.

**Swap script pattern:** regex only inside `<img …>` tags and replace the `src` value; assert afterwards that the diff contains nothing but `.jpg`/`.png` → `.webp` on the same line.

**CDN cache:** jsDelivr caches `@main` paths for ~7 days. When a file is replaced at the same path, purge it via `https://purge.jsdelivr.net/gh/H-Whisky/Resource-Pic@main/images/<file>` (returns `status: finished`). New files need no purge.

**Sizes after optimization:** 11 CDN photos 4.37 MB → 2.24 MB; avatar 657 KB → 8 KB.
