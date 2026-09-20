---
name: favicon-tab-url
description: >-
  Sets favicon, browser tab title, and shareable URLs so each view is identifiable.
  Use when scaffolding a site, adding routes or rooms, shipping a first page,
  or when the user mentions favicon, tab title, document.title, hash URLs,
  deep links, LINE/X share previews, or Open Graph.
---

# Favicon, tab, URL

Every public page needs three identity pieces before it is “done”: a real favicon, a tab title that fits and names the current view, and a URL that matches that view.

## Favicon

- Ask for a **1:1** source image. Do not draw or generate SVG icons. Never author SVG.
- Convert that image to raster favicons in `public/`:
  - `favicon.ico` (16 + 32)
  - `favicon-32.png`
  - `apple-touch-icon.png` (180)
- Link them in HTML. Keep the original 1:1 file as the share image if nothing else exists.
- Busy art will mush at 16px. Prefer a source with one large center mark.

## Tab title

- `document.title` is **only the current view name**, short enough for a browser tab.
- Wrong: `ShowName｜Kitchen` (truncates to nonsense). Right: `キッチン` / `Living` / whatever the view is called.
- Default `<title>` in HTML must match the home view.
- Update `document.title` whenever the view changes.

## URL consistency

- The address bar must name the same view as the tab.
- Changing rooms/pages writes the URL (`#kitchen`, `/living`, `?room=bedroom`). Refresh and shared links reopen that view.
- Read the URL on load; write it on change; listen for back/forward (`hashchange` or `popstate`).
- Do not leave a SPA that always boots to home regardless of the URL.

## Share (LINE / X)

- Static `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card` in HTML.
- `og:image` must be an **absolute** production URL. Crawlers do not run your client `document.title` updates.

## Checklist

- [ ] 1:1 source → ico / 32 png / apple-touch, no handmade SVG
- [ ] Tab text = current view name only
- [ ] URL ↔ view stay in sync (load, change, back)
- [ ] OG tags with absolute image URL
