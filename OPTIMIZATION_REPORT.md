# Optimization report

Implemented locally on `main` at `df576955700241b7da4e3b6d085ef982837fb484` and the working tree after that commit. Production was not deployed, and nothing was pushed.

## What changed

Each project now has a real page, with the existing gallery still opening in place on an ordinary click. Legacy `/work/#slug` links replace themselves with the canonical path and do not add an extra history entry. Closing the gallery goes to `/work/` rather than `history.back()`.

| Project | Canonical path |
| --- | --- |
| Grön — Core Brand & Marketing | `/work/gron-core/` |
| Pixlz | `/work/pixlz/` |
| Grön Halloween | `/work/gron-halloween/` |
| PR Kits & Corporate Gifts | `/work/pr-kits/` |
| Structural Packaging & Fabrication | `/work/structural-packaging/` |
| Design Toolbox | `/work/design-toolbox/` |

The initial HTML for `/work/` includes all six cards. Each project page includes that project's title, description, details, and gallery, plus the Work grid (hidden until the gallery is enhanced). With JavaScript disabled, the project article stays readable and links back to Work. Share previews use a JPEG made from the existing cover, uncapped below 1200px wide, with no crop or added text. Home, Work, and About keep the existing site preview image.

The gallery is a native `<dialog>` opened with `showModal()`, so the browser supplies focus containment and background inertness. The 0.2s fade, backdrop, and inner layout classes are unchanged. `srcset` widths are the measured image widths. Smaller WebP derivatives were added only when they were at least 20% smaller than the next useful candidate. Desktop image geometry was not restyled. Paragraphs use `text-wrap: pretty`. The hero keeps the same shaders, 256×256 buffers, refraction, and frame-based timing, and now pauses when the document is hidden, releases GPU resources on teardown, and recovers from context loss onto the existing CSS fallback.

## Commands

- `npm run build` regenerates pages, the sitemap, the image manifest, and new derivatives.
- `npm run build:check` compares that output to the checkout and does not write.
- `npm start` and `npm run dev` run the generator first, then the existing static server.
- `npx playwright test` runs Chromium, Firefox, and WebKit.

Do not hand-edit these generated files:

- `work/index.html`
- `work/{slug}/index.html`
- `sitemap.xml`
- `src/data/image-manifest.js`
- the marked headshot block in `about/index.html`
- files under `public/images/share/`
- hashed `*-w{width}-{hash}.webp` delivery files

Edit project copy in `src/data/projects.js`, the page shell in `templates/work.html`, and regenerate.

## Preservation

Project titles, descriptions, details, order, cover stems, and gallery order match the records that were previously embedded in `PortfolioStack.js`. Existing `-720` and `-1400` WebP files were not overwritten. New files use content hashes because `/public/` is cached as immutable. 179 unreferenced rasters were left in place; the list is in `test-results/optimization/dormant-images.json`. `scripts/import-selects.mjs` is not part of the site build, so generation does not need the desktop artwork folder.

`npm run build` followed by `npm run build:check` produced no drift.

## Tests

Playwright 1.56, Node 24.11.1, local `serve` on port 3000 with the repository `serve.json` CSP. Browsers: Chromium 141, Firefox 142, WebKit 26.

A full run of 69 tests passed 67. Two Firefox navigations timed out while four workers were loading the site at once (`about/` headshot test and direct `/work/pixlz/`). Those two passed on an immediate rerun (2.4s). No product assertion failed. Chromium and WebKit passed the full set, including:

- canonical metadata in the raw HTML
- hash normalization, Back/Forward, and focus return to the card
- modified clicks left with their default action
- unknown `/work/not-a-project/` returns 404
- unknown hashes leave the grid usable
- project text and images remain visible with JavaScript disabled
- `srcset` descriptors match measured widths, including the headshot (540w and 1050w, not the old 720w/1400w labels)
- sitemap has nine URLs, no fragments, and no `lastmod`
- no startup `pageerror` or console error on the homepage, which also confirms Lenis loads from `/public/vendor/lenis.mjs` under `script-src 'self'`

There was no captured baseline from before this change, so this run is not a before/after performance comparison. Screenshot diffs were not taken. No Lighthouse or field Core Web Vitals run was recorded. Targets of LCP ≤ 2.5s, CLS ≤ 0.1, and interaction latency ≤ 200ms were not measured in a controlled cold-cache lab.

## Images and layout

Portrait files were mislabeled before. `pixlz-detail-portrait-6-720.webp` is 576×720 and is now described as `576w`; the 1400 file is 1120×1400 and is `1120w`. The headshot “720” file is 540×720; the “1400” file is 1050×1400. A 360px-wide derivative was added where it saved at least 20% versus the next larger file. A 540px derivative was skipped when an existing file was already that wide or was not smaller enough.

Share JPEGs are uncapped at the cover’s own size when that cover is narrower than 1200px. Pixlz’s preview is 800×1000, 166,777 bytes. Preview services may still crop that portrait frame; the site does not crop it.

Mobile rules center the About headshot when it is narrower than the column, and set centered crop positions for card and stacked-gallery images at the existing 768px and 900px breakpoints. Desktop column geometry, `object-fit`, and transforms were not changed. `text-wrap: pretty` can change line breaks without changing the copy. The floating leaf keeps its offset; its width and height attributes now match the file (339×350) so the reserved ratio matches the artwork. The leaf remains `display: none` until its existing script moves it.

Body text `#666666` on `#F3F2EF` measures about 5.13:1, which clears WCAG AA for normal text. No palette change was made.

## WebGL

The hero still uses the same shaders, simulation size, refraction (`0.1`), damping (`0.985`), and frame-counted intro/ambient drops. That timing still depends on the display refresh rate; it was not converted to a clock. The loop now has one scheduled frame, pauses on `visibilitychange` and `pagehide` without resetting the frame counter, coalesces resize to a changed canvas size, drops stale image loads, deletes programs, buffers, textures, and framebuffers on teardown, and on context loss hides the canvas so the CSS background shows. Restoration rebuilds the GPU state without replaying the intro from frame 0. A reduced-motion change stops the loop and leaves the fallback image. No frame-time trace was captured. Software WebGL in Playwright does not represent a phone GPU.

## Accessibility and devices

Automated checks covered keyboard open/close, focus return, one open dialog, 44px social targets (Firefox reports the box as 43.999px; rounded it is 44), and no horizontal overflow at 375, 390, 430, 768, and 1280. The homepage scroll container can scroll when content exceeds the viewport instead of clipping it.

Not performed, because those devices and accounts were not available here:

- a physical iPhone or iPad, including Safari chrome, safe areas, and pinch zoom
- VoiceOver
- a public share-card preview
- Search Console or field Core Web Vitals

This is not an Apple certification.

## Left as-is

Legacy redirects in `vercel.json` are unchanged. The theme switch stays hidden. Hotjar is not enabled. `robots.txt` still allows crawling and points at the sitemap. No `llms.txt` file was added. No decorative arrows or share buttons were added.
