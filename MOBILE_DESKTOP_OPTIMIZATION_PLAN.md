# Zee portfolio: mobile, desktop, sharing, and search optimization

## 1. Handoff purpose and approved outcome

This document is the implementation handoff for another local agent. It records the user's decisions, the inspected repository state, the implementation approach, and the checks required to finish the work. Preparing this document does not implement or deploy the changes.

- **Repository:** `/Users/ez/local_projects/zee`
- **Remote:** `https://github.com/ezam0000/zee-site`
- **Inspected branch:** `main`
- **Inspected commit:** `46e2e2d43cf47b48368e659ce786576e6a7df8f3`
- **Canonical public origin:** `https://zee-studio.com`

The outcome is a faster, accessible portfolio that works well on phones and desktops, gives each project a meaningful shared-link preview, and exposes its existing content to search engines and AI search systems. Preserve the recognizable site and its interaction model.

### User decisions already made

| Topic | Approved decision |
| --- | --- |
| Share cards | Correct the previews shown when links are pasted into messages or social apps. Do not add Share buttons. |
| Project URLs | Add individual `/work/{slug}/` URLs while retaining the current gallery experience and compatibility with existing hash links. |
| Native components | Use native browser semantics and capabilities while preserving the current appearance and scrolling feel. |
| Mobile image centering | Keep the existing crops and card shapes; center the image containers and cropped content on mobile. |
| Desktop imagery | Leave desktop image placement, crop, framing, and composition unchanged. |
| Copy and assets | Preserve wording, selected artwork, project order, gallery order, and existing asset files. Optimized delivery derivatives of the same artwork are permitted. |
| Paragraphs | Improve layout and wrapping through CSS, without rewriting text. |
| WebGL | Optimize resource use and lifecycle handling without changing the visible effect or its behavior. |
| Apple UX/UI | Follow published Apple usability and accessibility guidance. Do not describe the website as Apple-certified or Apple-approved. |
| Decorative arrows | Never add decorative arrow icons or arrow glyphs in any direction. Use plain text links and controls. |

The intended audience remains visitors evaluating Zee's design work, including prospective employers, collaborators, and clients. This is an optimization of the existing portfolio, not a redesign or a content expansion.

### Boundaries

- Preserve existing fonts, color palette, project titles, descriptions, details, branding, social destinations, and contact details.
- Preserve normal gallery opening and closing, hover presentation, desktop wheel behavior, touch scrolling, existing animation timing, and reduced-motion intent.
- The accepted additions are individual project URLs, accurate metadata, static readable content, and accessibility improvements. Ordinary clicks still open a gallery.
- Do not introduce a framework migration, CMS, external service, analytics provider, native app styling system, Web Share UI, or new visual assets.
- Do not remove desktop smooth scrolling, mobile WebGL, or the ambient ripples as a performance shortcut.
- Do not enable the currently hidden theme switch or activate analytics.
- Do not publish, push, or submit sitemaps to third-party accounts as part of implementation unless separately instructed. Deliver locally verified changes and the verification report.

## 2. Verified starting state

Recheck the working tree and applicable local instructions before editing. Preserve any changes introduced after the inspected commit; this handoff does not authorize resetting another agent's work.

### Architecture and files

| Area | Current implementation |
| --- | --- |
| Application | Static multipage HTML, CSS, and browser ES modules; no framework build. |
| Main pages | `index.html`, `work/index.html`, and `about/index.html`. |
| Package scripts | `npm start` and `npm run dev` use `serve` on port 3000; `npm run build` currently prints that no build is needed. |
| Hosting | `vercel.json`: static output directory `.`, legacy page redirects, security headers, and long-lived immutable caching under `/public/`. |
| Project source | Six project objects embedded in `src/components/PortfolioStack.js`. |
| Work cards | JavaScript creates buttons inside an initially empty `#portfolio-stack`. Desktop overlays and mobile details use the same project copy. |
| Gallery | `src/components/PortfolioModal.js` creates a custom overlay with a `role="dialog"` element. It uses fragment URLs, changes the tab title, and handles Escape and history events. |
| Page startup | `src/pages/portfolio.js` initializes the gallery, transitions, analytics loader, and desktop smooth scrolling. |
| Page transitions | `src/core/transitions.js` is currently a no-op initializer; multipage crossfade is CSS-owned through `@view-transition`. |
| Images | `src/utils/images.js` constructs 720/1400 WebP candidates and adds loading/reveal behavior. |
| Image production | `scripts/optimize-images.mjs` and `scripts/import-selects.mjs` use Sharp. They resize by longest edge, not necessarily width. |
| Hero effect | `src/effects/heroLiquid.js`, booted from `src/main.js`; WebGL2, 256-square simulation, viewport-sized display canvas, continuous animation loop. |
| Hero imagery | `src/app/config.js` references existing light/dark tree WebP backgrounds. |
| Scrolling | `src/core/smooth-scroll.js` lazily imports Lenis. Mobile at widths up to 768px and reduced-motion users skip Lenis initialization. |
| SEO | Main pages already contain canonical, OG/Twitter, and JSON-LD metadata. Work structured data still uses fragment project URLs. |
| Discovery | Root `robots.txt` permits crawling and references the existing `sitemap.xml`, which lists three main pages. |
| Tests | `tests/homepage.spec.js`; Playwright currently runs Chromium only. |

### Specific issues established by inspection

1. Project fragment URLs cannot deliver project-specific HTML metadata to ordinary preview fetchers. Current project shares inherit the generic Work-page preview.
2. The initial Work HTML contains no project cards; crawlers and JavaScript-disabled visitors cannot read the complete project collection from that response.
3. Image filenames encode longest-edge size but `srcset` labels them as widths. For example, `pixlz-detail-portrait-6-720.webp` is **576×720**, and its 1400 variant is **1120×1400**. Their correct descriptors are `576w` and `1120w`.
4. Gallery images do not receive intrinsic dimensions from the shared image helper. Accurate dimensions should reserve space before loading.
5. The small-screen About headshot has a maximum width but no explicit centering rule in the inspected breakpoint.
6. The current gallery implements some dialog semantics manually but does not use native modal focus containment/background inertness.
7. WebGL has no explicit document-visibility or context-loss/restoration handling. Teardown does not track and release every program/buffer/vertex-array resource.
8. Existing tests hard-code hash URLs and 720w/1400w assumptions. Update these to the accepted URL behavior and actual dimensions.
9. Work and About display their page titles using paragraphs; semantic heading improvements can preserve identical visible text and styling.
10. The imported-image script references an absolute directory on another machine (`/Users/zeepauli/Desktop/...`). Builds must succeed using committed repository assets alone.

### Baseline image measurements

These are inventory facts, not performance results:

| Asset | Dimensions | Bytes |
| --- | --- | ---: |
| Pixlz portrait 6, 720 variant | 576×720 | 34,772 |
| Pixlz portrait 6, 1400 variant | 1120×1400 | 97,798 |
| Light tree hero background | 1536×2752 | 135,600 |
| Dark tree hero background | 1536×2752 | 53,976 |
| Existing site OG image | 1200×630 | 16,320 |

No before/after performance benchmark or device certification was performed while preparing this handoff.

## 3. Baseline capture before implementation

1. Record current commit, branch, working-tree changes, Node/package versions, and installed browser availability.
2. Read repository instructions. Use graft to trace affected symbols before multi-file refactors; fall back to direct source inspection for details the graph does not cover. Do not upgrade global tooling just to perform this task.
3. Run the existing tests once and record pre-existing failures separately from regressions. Start console/error listeners before navigation; the current console test attaches too late to catch all startup errors.
4. Capture the Home, Work, and About pages plus all six open galleries at representative phone and desktop sizes. Include the top and lower gallery content, hover overlays, and a scrolled Work page.
5. Capture the normal-motion hero separately from static visual snapshots. For deterministic layout snapshots, use reduced motion or a test-only controlled animation clock; do not change production behavior to stabilize screenshots.
6. Record image requests and transferred bytes, initial loading behavior, layout shifts, and a repeatable WebGL interaction trace. Keep machine, browser, viewport, throttling, and cache state identical for comparisons.
7. Snapshot project text/order and hashes of existing image files. This provides evidence that artwork and copy were preserved.

Store captures and measurements in an ignored output directory, such as `test-results/optimization/`. The final report should explain the measurement conditions and point to the evidence.

## 4. Static generation and shared data

### Source-of-truth decisions

- Add a DOM-free `src/data/projects.js` module containing the current six project records in their current order. Export `PROJECTS` and lookup by exact slug. Preserve the existing title, meta, description, details, cover identity, and gallery ordering byte-for-byte where possible.
- Represent cover/gallery identities by existing public paths or stems. Keep image metadata separate from editorial/project data so image generation does not depend on a previously generated manifest.
- Keep the public `getProjectBySlug` export working for existing callers, using a re-export or wrapper after extraction.
- Define explicit shared Work-page metadata from the current Work HTML, separately from project metadata. Both generation and gallery close/reset behavior must use that Work state.
- Add a generated, browser-importable `src/data/image-manifest.js` containing actual image dimensions, byte counts, and available candidates. Include existing and newly generated delivery derivatives.
- Add a Node build entrypoint, `scripts/build-site.mjs`, with pure rendering helpers. It generates imagery/metadata first, then page HTML and the sitemap. Use the already installed Sharp dependency.
- Add a Work-page template under `templates/` containing the existing page shell and explicit insertion points for generated metadata, cards, and project content. Extract it from the current Work page without redesigning it.
- Keep root Home/About pages as existing sources. Only change their semantics, responsive image attributes, or narrowly required optimization markup.

### Generated artifacts and development workflow

- Keep static output at the current root; no Next.js migration or new application server.
- Generate `work/index.html`, one `work/{slug}/index.html` per project, the root sitemap, the image manifest, and share-image derivatives.
- Keep generated deployable files versioned alongside the generator and template so a checkout is directly inspectable. Mark generated text files as generated and identify the owning source/template.
- Change `npm run build` to run the generator. Add `prestart` and `predev` hooks to generate before serving. The existing server command can remain otherwise unchanged.
- Provide a read-only generation check, such as `npm run build:check`, that compares expected generated text/output existence against the checkout and exits nonzero on drift.
- Generation must be deterministic: stable ordering/serialization, no current timestamps in artifacts, no network dependency, and no dependency on files outside this repository.
- Validate unique slugs, required existing fields, referenced asset existence, and valid dimensions before writing outputs. Fail clearly on missing assets; do not substitute unrelated artwork.
- Never erase arbitrary directories. Only update artifacts explicitly owned by the generator. Do not scan and rewrite unrelated legacy components or archive images.

### Static content and progressive enhancement

For `/work/`, render all six native card links and their existing visible details directly into the initial response. Enhance these nodes in place; avoid replacing the entire grid during startup, which would discard focus and trigger unnecessary image work.

Hydrate/register the cards before reconciling the initial route. The current initialization order opens a deep-linked gallery before its corresponding card exists; reversing that dependency is necessary for reliable direct-entry focus restoration.

For a project route, return its title, description, details, project metadata, and the entire ordered image gallery as ordinary readable HTML. Reuse the existing typography and gallery classes. Provide a plain-text `Work` link to `/work/` for JavaScript-disabled visitors, using the existing label.

The project route must also have the Work shell/card data available so closing the enhanced gallery can reveal the same Work view without a full-page reload. On a no-JavaScript project visit, show the project article as the main content rather than an empty or permanently hidden dialog. During successful enhancement, move/adopt that article into the shared modal and activate the Work shell behind it. Avoid duplicate accessible copies, duplicate IDs, or a flash of a different layout.

Do not render one version for bots and another version for people. The same existing project content must be available to both. Keep fallback content visible if JavaScript fails before enhancement succeeds. Image reveal CSS must not make unenhanced images permanently transparent.

## 5. Public URL and history contract

### Canonical routes

| Project title | Canonical path |
| --- | --- |
| Grön — Core Brand & Marketing | `/work/gron-core/` |
| Pixlz | `/work/pixlz/` |
| Grön Halloween | `/work/gron-halloween/` |
| PR Kits & Corporate Gifts | `/work/pr-kits/` |
| Structural Packaging & Fabrication | `/work/structural-packaging/` |
| Design Toolbox | `/work/design-toolbox/` |

Use existing slugs exactly. Preserve trailing-slash canonical URLs and root-relative asset/module links so nested pages do not resolve resources under their own directory.

### Navigation behavior

| Action | Required result |
| --- | --- |
| Load `/work/` | Show the Work grid with its current ordering and appearance. |
| Ordinary primary click or Enter on a project card | Prevent full-page navigation, open the current gallery UI, and push the canonical project path. |
| Modified click, middle click, context menu, copy link | Allow ordinary anchor behavior. Do not intercept browser-native new-tab or link-copy actions. |
| Direct load/reload/new tab at a project path | Receive project-specific HTML/metadata; enhance into the same open gallery. No grid-only or blank intermediate result. |
| Open `/work/#known-slug` | Open that project and replace the current URL with its canonical project path. Do not add an extra history entry for normalization. |
| Unknown/malformed hash on `/work/` | Leave the grid usable without throwing; do not manufacture a project or write unsafe text into markup. |
| Close control, Escape, or backdrop dismissal | Close once, restore the Work title/metadata and scrolling, and push `/work/` consistently with the existing close behavior. Do not use `history.back()` because direct arrivals may have an external previous page. |
| Browser Back/Forward | Synchronize the gallery and metadata from the current route without pushing another entry. |
| Unknown `/work/{slug}/` path | Return HTTP 404; do not silently return the Work page or an empty successful project page. |

Keep the underlying Work scroll position stable during gallery opening/closing. Restore focus to the triggering card; for a direct/legacy arrival, use the matching card after closing. Avoid unnecessary scroll jumps when restoring focus.

Use `focus({ preventScroll: true })` where appropriate. If the saved trigger is disconnected, resolve the corresponding current card instead. Preserve existing query strings during same-document navigation, while canonical/OG URLs and sitemap entries omit tracking query strings. Reset the gallery panel, image scroller, and details scroller when opening a different project; the mobile panel is the actual scroll container, so resetting only the desktop image column is insufficient.

If navigation changes again during an opening/closing animation, cancel or supersede stale callbacks. The most recent location must determine the visible gallery and metadata. Do not allow double event binding on repeated initialization.

Existing fragment links remain functional, but they cannot gain project-specific server previews because fragments are not sent in HTTP requests. All newly rendered/copied card links must therefore use canonical project paths.

## 6. Shared-link previews, metadata, and search

### Project metadata contract

Generate this metadata into the initial HTML, not only through browser JavaScript:

- `title`: the existing project title, preserving current project tab-title behavior.
- `meta[name=description]`: the existing project description without rewriting or keyword expansion.
- `link[rel=canonical]`: absolute canonical project URL.
- `og:type`: `website`.
- `og:url`: absolute canonical project URL.
- `og:title` and `twitter:title`: existing project title.
- `og:description` and `twitter:description`: existing project description.
- `og:site_name`: `Zee Pauli`; retain the existing locale.
- `og:image` and `twitter:image`: the project's own JPEG share derivative using an absolute HTTPS URL.
- `og:image:type`, width, and height: actual generated format/dimensions.
- Image alt metadata: existing project title; do not invent claims or captions.
- `twitter:card`: `summary_large_image`.

Retain the current Home, Work, and About metadata identities and site-wide OG image. Do not replace every page with a project preview.

Create each project preview from its existing largest cover derivative, respecting orientation and aspect ratio. Use JPEG, quality 90, maximum width 1200px, no enlargement, no crop, no added text, no compositing, and no new design. Use a source-content hash in the filename under `public/images/share/`; declare the resulting actual dimensions. Preview services may choose their own visual crop, which cannot be guaranteed by metadata. Check representative previews and report any platform-specific limitation instead of altering site artwork.

When opening/closing projects without navigation, update the corresponding document metadata and structured-data block from the same source. Use the explicit shared Work-page metadata as the reset state; a direct project's initial document title must not become the default Work title on close. Raw project responses remain the source of truth for preview crawlers.

### Semantic HTML and structured data

- Use a real main landmark and a logical heading hierarchy. Convert the existing Work/About title text to headings without changing typography. Keep the hero's existing wording/animation intact.
- Render Work project links and visible descriptions in source HTML. The project detail page must expose the complete existing description/details and gallery without requiring a click.
- Generate Work `CollectionPage`/`ItemList` entries in exactly the same order as the rendered six cards.
- Give each project a `WebPage` and `CreativeWork` entity with stable IDs based on its canonical URL. Use existing title, description, creator reference, image URL(s), and the current site/person identity.
- Reuse the existing `Person` and `WebSite` identity facts. Do not invent awards, dates, client endorsements, reviews, services, employment history, or credentials.
- Avoid duplicate/conflicting canonical links or structured-data identities after in-page navigation.
- Preserve existing nonempty image alternative text. Decorative leaf/texture assets stay decorative; do not inject SEO keywords into alt attributes.

### XML sitemap, robots, and AI search

- Generate `sitemap.xml` with the three main URLs and six canonical project URLs: exactly nine canonical page entries at the inspected content count.
- Use absolute HTTPS URLs, valid XML escaping and sitemap namespace, and no fragment URLs.
- Omit `lastmod` unless a trustworthy content modification source is explicitly implemented; never set every page to the build time. Omit speculative priority/change-frequency values.
- Keep `robots.txt` permitting public crawling and referencing the sitemap. Verify no hosting-level authentication, `noindex`, or crawler-specific block prevents access to the intended public pages.
- Preserve robots policies outside the requested indexing changes. Do not conflate visibility in AI search with permission for model training, or change training-crawler policy as a side effect.
- Use readable HTML, valid links, accurate metadata, existing factual structured data, and accessible images for LLM discoverability. Do not add keyword stuffing, fabricated FAQs, hidden bot-only content, or an `llms.txt` file as a supposed ranking requirement.
- No ranking, AI citation, or indexing guarantee is part of acceptance. Verify technical eligibility and availability; actual search visibility is a post-release observation.

## 7. Image delivery and mobile-only centering

### Accurate image metadata and loading

Inventory images actually referenced by the three live pages, all projects, CSS backgrounds, runtime hero configuration, and share metadata. This includes the headshot, floating leaf, textures, and tree backgrounds. Record dormant/unreferenced assets separately and leave them intact.

For each raster candidate, measure actual oriented width/height and file bytes with Sharp. Build width descriptors from these measurements, not filename suffixes. If two variants have the same actual width, deduplicate that width in `srcset` and prefer the smaller file at equal visual quality. Exclude any candidate whose aspect ratio differs unexpectedly from its source family and report the issue.

Update the shared image helper to consume manifest data, set intrinsic dimensions, and set `sizes`/`srcset` before `src` to reduce unnecessary early downloads. Maintain public-asset path validation. Preserve existing exports such as `sizedImage` and `applyResponsiveImage` while updating their internal data contract and all callers.

Measure rendered widths to derive `sizes` accurately across the one-, two-, and three-column Work grid. For gallery images account for actual modal max-width, column ratio, and inner padding; do not keep the current broad `55vw` estimate at large desktop widths. Correct the static headshot descriptors and size hint as well.

Keep existing 720/1400 WebP files as source candidates. Add smaller delivery variants at 360px and 540px actual width where the input is larger and a candidate saves at least 20% in bytes over the next existing useful candidate. Generate them from the largest committed corresponding image, with no upscale/crop, WebP quality 80, and source-hash filenames. Reject visibly degraded outputs in side-by-side review; retain existing candidates when a smaller variant is not useful. Do not transcode already-small artwork indiscriminately.

Use intrinsic width/height or matching aspect-ratio reservation to prevent layout shifts. Card `object-fit: cover` and fixed aspect ratios remain unchanged. Full gallery images remain proportional at their existing full-width/automatic-height presentation.

Use eager loading for above-the-fold imagery, but reserve high fetch priority for the actual primary visible/LCP image. Lazy-load later gallery images. On a direct project page, the project's first visible image takes precedence over background grid images. Do not preload the whole portfolio or both light and dark hero backgrounds.

The existing light hero background is about 136KB, so measure before introducing alternatives. Retain the existing background by default, keeping its exact framing in both CSS fallback and the WebGL texture. Correct duplicate requests/loading priority if found; do not switch hero assets based on a guess.

### Centering rules

- Use existing responsive boundaries: general mobile layout at `max-width: 768px`, card single-column at `max-width: 480px`, and stacked gallery at `max-width: 900px`.
- Scope all new centering selectors to the applicable small-screen layout. The 769–900px gallery already uses the stacked/mobile gallery design; do not use that range to alter the desktop Work grid or About layout.
- Center the About headshot within its available column where it is narrower than that column, using logical auto margins while retaining its size and crop.
- Center Work image frames inside cards and explicitly use centered crop positions where needed. Keep the 4:5 card aspect ratio and existing `cover` behavior.
- Center gallery media within the stacked layout and preserve equal safe-area-aware side gutters. Do not switch to uncropped/letterboxed card presentation.
- Keep the already-centered hero background centered on mobile. Do not recenter the floating leaf: its offset is part of the existing intentional animation/composition.
- Preserve desktop image positions, transforms, object-fit, object-position, dimensions, and column geometry. Compare desktop screenshots and measured boxes to the baseline.

### Cache compatibility

Because `/public/` currently has one-year immutable caching, new share/delivery derivatives must use new hashed filenames. Do not overwrite an existing image URL with different bytes. Preserve existing originals and current derivative files.

Check HTML and module cache behavior on actual route responses, including extensionless directory URLs. Avoid an unrelated caching overhaul. Ensure newly generated pages reference the correct current asset versions and that public assets do not accidentally return HTML fallbacks.

## 8. Paragraph formatting and native accessibility

### Typography

- Apply progressive `text-wrap: pretty` to descriptive paragraphs and body copy. Unsupported browsers retain normal wrapping.
- Preserve fonts, text alignment, letter spacing, and established visual hierarchy. Retain existing readable line heights unless a measured overflow/reflow problem requires a narrowly scoped adjustment.
- Preserve existing paragraph boundaries and the deliberate Work intro line break. Do not insert nonbreaking spaces, manual breaks, or split/rewrite sentences to force a desired rag.
- Use existing column widths as the baseline. Cap unusually long body lines around 65 characters only where this does not change desktop image/column geometry; normal modal paragraphs already have constrained widths.
- Use `overflow-wrap` for exceptional long tokens where needed. Do not use fully justified text or globally hyphenate project/brand names.
- Check short final lines, awkward wrapping, long project headings, metadata lists, and paragraph spacing across the viewport matrix.

### Native dialog implementation

Use one native `<dialog>` as the full overlay root, preserving `.portfolio-modal` and the existing inner layout classes. Reset browser default margins, border, padding, max sizes, and background so its rendered appearance matches the current overlay. Use the top layer through `showModal()` rather than only setting an `open` attribute.

Keep an inner visual gallery panel and the existing dismissible backdrop element within the full-overlay dialog. This lets the original backdrop opacity and fade timing be retained. Make the browser's `::backdrop` transparent to avoid doubling the backdrop. Ensure closed dialogs remain `display: none`; do not let the existing `.portfolio-modal { display: flex }` override native closed-state hiding.

Preserve the current 0.2-second fade. On closing, let the visual fade complete before calling the native `close()` method and restoring outside focus/inertness, with an immediate path for reduced motion and a bounded fallback if no transition event fires. On reopening/history changes, cancel pending close work. Route `cancel`, close-button, and backdrop events through one close controller; avoid duplicate history updates.

Native `showModal()` provides background inertness and focus containment. Preserve the current initial focus on the close button, associate the title with `aria-labelledby`, and ensure all IDs remain unique. Remove redundant ARIA state that contradicts the native dialog state. Keep the close control's existing accessible name and visible symbol; add no arrow controls.

Desktop wheel events over the text area must continue scrolling the image column as currently implemented; the handler should not prevent browser zoom gestures (`ctrlKey` wheel). Where text enlargement or a short viewport makes the details column itself overflow, let that column consume scrolling while it has content left in that direction so text remains reachable. Retain the existing single native touch scroller on the stacked/mobile modal. Test touch drag, trackpad wheel, and focus movement inside the gallery.

Handle the async Lenis-startup race: if the gallery is already open when Lenis finishes initializing, it must remain stopped. Keep its current desktop feel and options; resume only after the gallery closes. Do not add a second RAF loop during repeated initialization.

### Other usability checks

- Maintain at least 44×44 CSS-pixel hit areas for actionable touch controls without changing artwork sizes. Apple specifies platform points; 44 CSS pixels is the chosen web implementation target.
- Keep focus outlines visible. Ensure changing a card from button to anchor preserves its appearance (`text-decoration`, color, display, and focus styles) and that keyboard users can access the same information as pointer users.
- Fix the desktop card focus selector to respond to focus on the tile itself. The current `.portfolio-tile__frame:focus-within` does not match when its parent tile is the focused element; keyboard focus must reveal the same details as hover without requiring hover.
- Preserve standard browser pinch zoom; do not introduce restrictive viewport settings.
- Verify safe-area insets, dynamic viewport units, address-bar changes, and orientation changes on mobile Safari.
- Ensure text remains reachable at 200% text enlargement and 400% browser zoom/reflow where applicable. The homepage currently locks overflow on mobile; allow necessary overflow when content genuinely exceeds available height instead of clipping navigation or text. Preserve normal-size layout/behavior.
- Audit contrast against WCAG AA (4.5:1 normal text, 3:1 large text and relevant non-text UI). Correct small scoped contrast defects within the existing palette. Escalate any change that would require a substantial redesign rather than silently recoloring the site.
- Preserve decorative image semantics. Maintain meaningful labels on the social links, gallery close control, and navigation.
- Support reduced-motion preference changes at runtime. Stopping/resuming the hero must not affect the availability of the fallback artwork or basic navigation.
- Do not add an Apple-style component library or replace the site's visual language with default operating-system chrome.

## 9. WebGL optimization without perceptual changes

### Invariants

Keep the existing shader code/output, 256×256 simulation buffers, refraction strength, damping, introduction/drop cadence, pointer response, and ambient ripples. Preserve the current viewport-resolution canvas policy; do not introduce a device-pixel-ratio multiplier that sharply increases GPU work. Do not add adaptive-quality tiers or frame-rate caps.

Current introduction and ambient timing are frame-based. Do not convert to a new time-based animation model in this task, since that could alter behavior on high-refresh displays. Record refresh-rate-dependent observations in the report rather than disguising them as an optimization.

### Lifecycle and resource work

1. Track one scheduled animation frame and an explicit running/paused lifecycle. Repeated init/resume must not create duplicate loops.
2. On `visibilitychange`, cancel scheduled rendering when hidden. Preserve simulation buffers, frame counter, active image, and effect configuration. On visibility return, resume from the existing state without replaying the intro or trying to catch up missed frames.
3. Use `pagehide`/`pageshow` appropriately for back-forward cache: suspend when leaving and resume on restoration. Avoid unnecessarily destroying a cacheable page's live context.
4. Coalesce resize/orientation updates to one calculation per animation frame. Resize only when dimensions change; preserve the current cover calculation and mobile/desktop image framing.
5. Keep passive input listeners where they already are appropriate. Do not remove pointer/touch event behavior without demonstrating identical input results across supported browsers.
6. Track the fullscreen-quad buffer, vertex array, both shader programs, textures, and framebuffers. Release them on full teardown and on partial initialization failure. Clean up a successfully compiled shader if its paired shader fails.
7. On `webglcontextlost`, prevent default restoration cancellation, stop the loop, and reveal the existing CSS fallback image. Do not leave a cleared or opaque blank canvas covering it.
8. On `webglcontextrestored`, recreate all context resources once and reload the current image. Preserve logical progress/configuration where possible; the GPU wave state may need resetting after actual context loss, but do not intentionally replay the load introduction.
9. Guard asynchronous image loads with a generation/token so old callbacks cannot write into a destroyed or replaced context or overwrite a newer source.
10. Reset stale pointer state on teardown/resume where necessary to avoid a synthetic high-velocity ripple. Preserve live pointer response during ordinary use.
11. Move genuinely invariant uniform/state setup out of the hot loop only when output remains equivalent. Avoid per-frame allocations that can be removed without altering random/drop sequencing.
12. Preserve reduced-motion and unavailable-WebGL fallbacks. A mid-session reduced-motion change must stop the GPU loop and show the same underlying image.

The hero is a full-viewport background and may remain visible under other content. Do not assume a section intersection means it is invisible and pause it while it is still visible. Document visibility is the primary safe pause signal.

## 10. Hosting, security, and integration requirements

- Preserve current legacy redirects (`/branding`, `/packaging`, `/portfolio`, `/experience`, `/contact` and their existing slash variants).
- Preserve CSS-owned multipage transitions and back-forward cache behavior. Do not replace document navigation with a new client router or fetch-and-replace framework to support the gallery routes.
- Keep filesystem-backed project pages with correct HTTP status codes. No catch-all rewrite of arbitrary project paths to `work/index.html`.
- Use the existing static Vercel configuration; do not migrate to a different config format or platform as part of this task.
- Test with production-equivalent response headers. The local `serve` command does not automatically apply `vercel.json` CSP/security headers.
- The HTML contains inline import maps while the configured CSP has `script-src 'self'`. Verify Lenis actually initializes under the real policy; its existing catch handler can conceal failure. If import maps are blocked, replace the single bare Lenis import with the existing same-origin `/public/vendor/lenis.mjs` URL and remove the now-unused import maps from affected pages/templates. This preserves the intended component and behavior without broadly weakening CSP.
- Keep JSON-LD as data, validate it in raw HTML, and test browser console/CSP behavior. Do not add inline executable handlers or blanket `unsafe-inline` to scripts.
- Preserve asset URL validation and correctly HTML/XML-escape data during generation, including ampersands and Unicode project titles.
- Verify extensionless routes get appropriate HTML content types, images get image content types, and missing resources are not masked by successful HTML responses.
- Do not enable Hotjar or broaden network permissions as part of SEO work.
- If a later deployment task uses the Vercel CLI, upgrading the currently reported outdated CLI with `npm i -g vercel@latest` is recommended for compatibility. This handoff itself does not require or authorize a global installation.

## 11. Test matrix and acceptance criteria

### Automated browser coverage

Extend Playwright to Chromium, Firefox, and WebKit, with desktop and mobile viewport coverage. Mobile emulation is not a substitute for real iOS Safari. Keep routine tests fast; run the fuller screenshot/performance matrix as an explicit verification suite.

| Coverage group | Required cases |
| --- | --- |
| Phone | 375×667, 390×844, 430×932; portrait and at least one landscape layout. |
| Layout boundaries | 480/481px, 768/769px, and 900/901px widths. |
| Tablet | Approximately 820×1180, including stacked gallery and native touch behavior. |
| Desktop | 1280×800, 1440×900, 1920×1080. |
| Preferences | Normal motion and reduced motion; runtime preference change. |
| Accessibility | Keyboard-only use, touch targets, enlarged text, browser zoom/reflow, and accessible names. |
| Runtime | JavaScript enabled/disabled, unavailable WebGL, context loss/restore, hidden/resumed document, page restoration. |

### Required assertions

**Build/content**

- Two successive builds produce identical generated text/artifact names, and `build:check` passes without writing.
- A clean checkout can generate using only committed assets. No dependency on the original designer's desktop folders.
- All six project text records, order, selected cover identities, gallery identities/order, and hashes of original image files match baseline.
- Generated HTML has unique IDs, one canonical link, appropriate headings, valid internal links, and no unintended duplicate accessible project content.
- Work and every project are readable with JavaScript disabled; images remain visible without the reveal script.

**Routing/sharing**

- Every canonical page returns 200 with the expected metadata in the raw response; all unknown project routes return 404.
- Every card `href` points at its canonical project route. Modified clicks are not swallowed.
- Every project direct load/reload opens the correct gallery with matching title and source metadata.
- Existing known hashes normalize with replacement, open the right project, and preserve usable Back/Forward behavior.
- Open, close, reopen, Back, Forward, and rapid navigation never leave duplicate dialogs, wrong metadata, a locked body, or stale gallery images.
- Closing direct arrivals returns to Work and focuses the corresponding card without unexpectedly leaving the site.
- OG image URLs resolve to the correct project's JPEG with actual declared dimensions. Home/Work/About retain their current identities.
- Sitemap contains exactly the nine current canonical pages, valid XML, no hash paths, no nonexistent pages, and no generated false modification dates.
- Structured data names/order/URLs match visible cards and project pages.

**Images/layout**

- Each `srcset` descriptor equals that resource's actual width, including portrait images and the headshot. Do not preserve the old test's fixed 720w/1400w expectation.
- Image `currentSrc` and transferred bytes are appropriate for the measured display size/device scale. Later gallery images remain deferred.
- There is no image-induced layout shift or blank image reveal failure.
- Mobile About portrait, card frames, and gallery media are centered within their available content area while retaining crops.
- Desktop image boxes, crop positions, transforms, and gallery column geometry match baseline. Typography-only wrapping differences are allowed where explicitly intended.
- No unintended horizontal overflow, clipped navigation, inaccessible close control, or obstructed content at tested sizes/zoom levels.

**Native dialog/input**

- Exactly one native modal dialog is open; background focus/click targets are inert while open.
- Tab/Shift-Tab remain inside it; Escape and backdrop dismiss once. Focus returns to the right card.
- Desktop wheel-over-copy behavior, gallery touch scrolling, browser zoom gestures, safe-area placement, and fade timing remain correct.
- An overflowing details column remains readable at enlarged text sizes/short viewport heights, and keyboard focus reveals card details without hover.
- An already-open direct gallery stays scroll-locked if Lenis resolves after modal initialization.

**WebGL**

- Normal supported sessions retain the visible effect, pointer/touch response, ambient motion, and the original assets.
- No rendering frames are submitted while document visibility is hidden; one loop resumes without replaying the introduction.
- Resize storms do not allocate repeatedly when canvas dimensions are unchanged.
- Context loss exposes the fallback and restoration reconstructs a working effect. Reduced-motion/WebGL-unavailable cases still show the hero artwork.
- Repeated init/destroy and interrupted image loads produce no duplicate listeners/loops, stale updates, or resource growth attributable to missing cleanup.
- No new startup, navigation, CSP, image-loading, or WebGL errors. Attach console/pageerror listeners before the first navigation.

### Performance evaluation

Use three repeatable cold-cache runs per representative Home, Work, About, and project route; compare medians to baseline under the same conditions. Record LCP, CLS, bytes transferred, resource count, main-thread work/long tasks, and observed interaction latency. Capture warm navigation separately.

Targets are LCP at or below 2.5 seconds, CLS at or below 0.1, and interaction latency at or below 200ms. These are measurement targets, not a guarantee that field Core Web Vitals are already passing. Lighthouse does not directly establish real-user INP; clearly distinguish lab diagnostics from field metrics. For new project routes, compare the first visible project experience against the old equivalent hash deep link.

Profile a fixed-duration hero session with a repeatable input path at desktop and phone-sized viewports, plus a hidden/resume cycle. Report frame intervals, long frames, and lifecycle savings. Software-rendered WebGL in automation does not establish physical mobile GPU performance. Require no material visible-frame regression; do not sacrifice the preserved effect to obtain a better score.

### Manual checks and honest limitations

- Check real iPhone/iPad Safari and macOS Safari when those devices are available, including browser chrome resizing, safe areas, touch scroll, and pinch zoom.
- Check VoiceOver reading order, project link announcements, dialog title/close control, background inertness, and focus restoration.
- Inspect representative social/message preview rendering on a publicly reachable preview only when such a preview is separately available/authorized. Verify raw metadata locally regardless.
- If real devices, VoiceOver, a public preview, Search Console, or field data are unavailable, mark those checks **not performed** and state why. Do not substitute an automated pass for an Apple approval claim.

## 12. Implementation sequence and suggested ownership

1. **Baseline and source extraction:** record evidence, extract immutable project data, build the image inventory, and establish deterministic generation/check commands.
2. **Static HTML, metadata, and routes:** generate Work/projects/sitemap and accurate share previews; validate raw responses and JavaScript-disabled content.
3. **Gallery enhancement:** adopt native card links and native dialog, implement canonical history behavior, preserve focus/scroll/animations, and update route tests.
4. **Image delivery and responsive CSS:** fix dimensions/srcset/sizes/loading, add only useful delivery variants, apply mobile-only centering and paragraph wrapping, and compare desktop baselines.
5. **WebGL lifecycle:** implement measured lifecycle/resource fixes without changing rendering parameters and test fallback/context recovery.
6. **Integrated verification:** run the browser matrix and content/image invariants, inspect production-equivalent headers, perform available manual checks, and prepare the comparison report.

If the implementing agent delegates work, establish file ownership to avoid concurrent edits: static-generation/data work, gallery/history work, and WebGL lifecycle work can be separate streams after shared data contracts are agreed. Coordinate changes to shared image helpers, `src/main.js`, CSS, package scripts, and tests explicitly.

Use small reviewable commits if the eventual implementation request includes committing. No changes should be committed or deployed merely because this handoff exists.

## 13. Deliverables and completion checklist

The implementing agent should provide the finished local implementation plus `OPTIMIZATION_REPORT.md` containing:

- Summary of implemented behavior and the canonical project routes.
- Build/development commands and which generated files must not be edited manually.
- Content/asset-preservation evidence and desktop/mobile screenshot comparisons.
- Test commands/results by browser, with pre-existing failures separated from regressions.
- Before/after loading, byte-transfer, layout-shift, and WebGL measurements, with conditions and limitations.
- Accessibility checks actually completed, including whether real Apple devices/VoiceOver were available.
- Remaining issues or checks that require a public deployment or account/device access.
- Confirmation that production was not deployed unless separately authorized.

Completion checklist:

- [ ] All approved behavior and preservation constraints are satisfied.
- [ ] Six project URLs have correct initial HTML, metadata, and existing artwork.
- [ ] Legacy hash links, dialog interactions, history, focus, and scrolling work.
- [ ] Sitemap and structured data match the nine current canonical pages.
- [ ] Images have accurate responsive descriptors and reserved dimensions.
- [ ] Mobile centering is correct; desktop image placement is preserved.
- [ ] Paragraph layout is improved without copy changes.
- [ ] Native components retain appearance and improve accessibility.
- [ ] WebGL lifecycle/resource work is verified without perceptual regressions.
- [ ] Build is deterministic and works from committed local assets.
- [ ] Cross-browser checks and honest manual-test limitations are documented.
- [ ] No decorative arrows, new content claims, or unrequested UI controls were introduced.

## 14. Reference guidance

Use the repository's installed code and actual responses as the implementation source of truth. Check current official documentation when resolving browser/API behavior.

- [Apple UI Design Dos and Don'ts](https://developer.apple.com/design/tips/) — touch targets, legibility, and interaction guidance.
- [Apple Human Interface Guidelines: Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility) — accessible interaction and platform expectations.
- [Google: JavaScript SEO basics](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) — crawlable links and the limitations of fragments for distinct page content.
- [Google: Optimizing for generative AI search](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) — technical discoverability and ordinary SEO foundations; no special AI text file requirement for Google Search.

The user has already selected the product decisions in section 1. Resolve routine implementation details from this specification and the code rather than repeatedly requesting the same choices. If a necessary change conflicts with preserved copy, artwork, desktop imagery, or interaction behavior, describe the concrete conflict before expanding scope.
