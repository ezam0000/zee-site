## ChatGPT‑5 Plan: Zee

### 1) Positioning and Objectives
- **Identity**: Pacific Northwest studio between Portland, OR and Vancouver, WA; team of 4 senior designers.
- **Tone**: Snappy, interactive, minimal, premium. “Alive” without gimmicks.
- **Goals**:
  - Instant legibility for recruiters: bold success metrics above the fold.
  - Showcase marquee clients credibly (Apple, YC, Nike, UFC, NBA, Coca‑Cola, NHL, MLB).
  - Playful yet optional 3D (Lego “stash”) that never harms performance.
  - Data‑driven case studies; Hotjar for behavioral insight.

### 2) Architecture (Vanilla JS, Modular, MPA)
Prefer a **Multi‑Page App** for SEO, simplicity, and resilience. Use native ES modules and progressive enhancement; no bundler required, optional minification step for prod.

- Pages (MPA):
  - `/index.html` (Home, hero metrics, client marquee, 3D teaser)
  - `/work/index.html` (Grid of case studies with impact cards)
  - `/work/[slug]/index.html` (Narrative case detail, sticky success metrics)
  - `/about/index.html` (Studio story, team of 4, photography)
  - `/contact/index.html` (Direct email/CTA, minimal form)
  - `/play/index.html` (Full Lego “stash” playground; opt‑in heavy 3D)

- Source layout:
  - `public/` assets (images, video, 3D models, env maps, icons)
  - `src/`
    - `app/` boot and environment
      - `boot.js` (defer‑loaded; mounts page‑specific modules via data‑attributes)
      - `env.js` (env flags; enables Hotjar only in allowed envs)
    - `components/` (small, focused modules)
      - `header.js`, `footer.js`, `marquee.js`, `impact-metrics.js`, `logo-cloud.js`, `case-grid.js`, `case-hero.js`, `photo-reel.js`, `before-after.js`
    - `three/`
      - `core.js` (renderer/camera/loop; guards for GPU and `prefers-reduced-motion`)
      - `lego-scene.js` (Lego blocks + simple physics; isolated to `/play` and tiny teaser on home)
      - `interactions.js` (raycast, drag/throw, stash/save/reset using `sessionStorage`)
    - `styles/`
      - `tokens.css` (colors, spacing, radii, shadows, z-index, motion)
      - `base.css`, `layout.css`, `components/*.css`, `themes/pnw.css`
    - `data/` (all curated, explicit JSON; no inferred entries)
      - `clients.json`, `whiskey_brands_top5.json`, `football_teams_top5.json`, `us_stadiums_largest_top5.json`, `case_studies.json`
    - `analytics/`
      - `hotjar.js` (injection + consent handling)
      - `events.js` (event map and dispatch)
    - `utils/` (DOM, IO, perf, preloading)
      - `dom.js`, `io.js`, `perf.js`, `preload.js`, `storage.js`, `math.js`
  - `vercel.json` (clean URLs, caching headers)
  - `package.json` (scripts for local dev and optional minify)

### 3) Design System (PNW Cyber‑Nature)
- **Palette**: Deep forest green, basalt gray, fog white, electric accent (limited use).
- **Typography**: One high‑quality variable font or system UI fallback. Fast swap.
- **Motion**: Subtle defaults; escalated on hover/press. Honor `prefers-reduced-motion`.
- **Components**: Cards, metric chips, marquee, sticky metric bar, photo reel, lego panel.

### 4) Homepage (2‑Second Hook)
- Bold headline + immediate **Impact Metrics** (e.g., “+38% conversion”, “‑22% checkout time”). Large, high‑contrast, readable at a glance.
- **Client marquee** (Apple, YC, Nike, UFC, NBA, Coca‑Cola, NHL, MLB) in kinetic but legible motion.
- **3D Teaser**: A single animated Lego block (tiny GPU footprint) with a CTA to “Open Playground” → `/play`.
- **Photography strip** with parallax on scroll (IntersectionObserver; no blocking scroll).
- **CTA**: “See the work” and “Start a project” kept always visible via sticky sub‑nav.

### 5) Work Listing and Case Detail
- Work grid with **Impact Cards** over thumbnails (always visible, short, bold).
- Case detail template:
  - Sticky impact bar (metrics remain in view).
  - Problem → Approach → Outcome narrative.
  - Optional before/after slider (CSS/WAAPI; no heavy libs).
  - “As seen with” logo row scoped to that case.
  - Closing CTA.

### 6) Clients and Lists (Data‑Driven, No Guessing)
- All lists are curated JSON in `src/data/`. We will not infer names or rankings.
  - `clients.json`: known collaborations (Apple, YC, Nike, UFC, NBA, Coca‑Cola, NHL, MLB, etc.).
  - `whiskey_brands_top5.json`, `football_teams_top5.json`, `us_stadiums_largest_top5.json`: you provide exact entries and criteria (e.g., market share, revenue, capacity).
- Logo cloud uses vector/optimized bitmaps with `srcset` and lazy loading.

### 7) 3D & Lego “Stash”
- `/play`: Full scene (Three.js) with a constrained part count and simple physics. Save/restore “stash” via `sessionStorage`. Reset button clears state.
- Home: single object, baked lighting, no physics. Only mounts if GPU/visibility allows.
- Guardrails:
  - Cap draw calls and texture sizes; budget under ~60–80ms main thread in worst case.
  - Pause loop when tab hidden or idle; degrade gracefully for low‑power devices.

### 8) Performance & Experience Targets
- **Budgets**: <75KB JS initial (gz), <150KB total on home; LCP <1.5s (4G); 60fps scroll.
- **Techniques**:
  - PRPL: Preload critical CSS, Render, Pre-cache (via immutable caching), Lazy‑load the rest.
  - `loading="lazy"`, `decoding="async"`, `fetchpriority="high"` for hero media.
  - `IntersectionObserver` for reveals; defer noncritical modules.
  - Dynamic `import()` for `/play` scene and case‑detail extras.
  - Respect `prefers-reduced-motion`; disable heavy animations when set.

### 9) Analytics (Hotjar + Event Map)
- Hotjar injected via `analytics/hotjar.js` only in allowed envs (configurable).
- Event map (no PII):
  - Hero metric card visibility and clicks.
  - Case card hovers, detail reads to 50%/90%.
  - `/play` open, interactions (drag, throw, save, reset).
  - CTA clicks (email/contact).

### 10) Accessibility & SEO
- Keyboard‑accessible components; focus states; alt text; motion preferences respected.
- Semantic HTML; Open Graph + Twitter cards; per‑case structured data (Project schema).
- Crisp copy with visible metrics for skim readers (recruiter‑friendly).

### 11) Deployment (Vercel) & Environments
- MPA, static export. No server code needed.
- `vercel.json`:
  - Clean URLs, immutable caching for hashed assets, `Cache-Control` headers.
  - Optional redirects from legacy paths.
- Environments: preview vs production with Hotjar toggle via `env.js`.

### 12) QA & Acceptance
- Zero console errors, Lighthouse 90+ (Perf/Best/A11y/SEO) on home and a case page.
- Hero metrics visible without scroll on common laptop and mobile viewports.
- `/play` consistently over 50–60fps on modern hardware; degrades gracefully otherwise.
- Hotjar sessions confirm attention on metrics and CTA interaction.

### 13) Risks & Mitigations
- 3D performance regressions → Strict budgets, teaser vs full scene separation, lazy load.
- Asset bloat → Strict imaging pipeline (WebP/AVIF), responsive `srcset`, pre‑optimization.
- Recruiter skim → Bold metric cards, short copy, strong CTAs.

### 14) Phased Delivery
1. Foundations: pages, header/footer, styles, tokens, basic grid + marquee.
2. Impact Layer: metric cards, sticky metric bar, before/after slider.
3. 3D Teaser + Playground: teaser on home; `/play` with stash/save/reset.
4. Data & Content: JSON lists, case studies, photography integration.
5. Analytics & Polish: Hotjar + event map, performance passes, a11y pass, SEO.

### 15) Inputs Needed
- Curated JSON for clients, top 5 whiskey brands, top 5 football teams, top 5 largest US stadiums, and case study metrics. No placeholders will be inferred.


