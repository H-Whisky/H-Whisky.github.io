# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: This is compiled output, not source

This repository contains only the **generated static files** produced by `hexo generate`. There is no `package.json`, `_config.yml`, or Markdown source here. The Hexo source project (theme config, `source/_posts/*.md`, etc.) lives in a separate repository.

**Any direct edits to HTML/CSS/JS here will be overwritten** the next time `hexo deploy` pushes fresh output. For permanent changes, modify the Hexo source theme and regenerate.

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

## Content

3 blog posts (all in Chinese): city memories of Nanjing and Taizhou, plus PMP study notes. Tags: `CityMem_Nanjing`, `CityMem_Taizhou`, `Learn_PMP`. Post images are hosted on `cdn.jsdelivr.net` under the `H-Whisky/Resource-Pic` repo.
