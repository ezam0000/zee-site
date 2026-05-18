# Full Implementation Plan: Zee

## Design System: Japanese Contemporary + PNW

### Color Palette

**Primary (Forest/PNW):**

- `--color-evergreen-900`: #1a3d2e (Deep forest)
- `--color-evergreen-700`: #2d5a3f (Rich green)
- `--color-evergreen-500`: #4a7c59 (Mid green)
- `--color-evergreen-300`: #7fb069 (Light green)

**Neutral (Japanese Minimalism):**

- `--color-washi-100`: #faf9f6 (Paper white)
- `--color-washi-200`: #f5f3ef (Cream)
- `--color-sumi-900`: #1a1a1a (Ink black)
- `--color-sumi-700`: #2d2d2d (Charcoal)
- `--color-sumi-500`: #4a4a4a (Gray)
- `--color-sumi-300`: #7a7a7a (Light gray)

**Accent (Kintsugi Gold + PNW):**

- `--color-kin-500`: #d4af37 (Kintsugi gold)
- `--color-kin-300`: #e8d5a3 (Light gold)
- `--color-fog-300`: #c8d5d9 (PNW fog)

**Lego Colors (Interactive Elements):**

- `--lego-red`: #e74c3c
- `--lego-blue`: #3498db
- `--lego-yellow`: #f1c40f
- `--lego-green`: #2ecc71
- `--lego-orange`: #e67e22

### Typography

- **Primary**: Variable font (Inter or system-ui fallback)
- **Display**: Elegant serif for headlines (optional, Japanese-inspired)
- **Hierarchy**: Large, readable, generous spacing (Japanese minimalism)

### Design Principles

- **Ma (間)**: Generous negative space, breathing room
- **Wabi-Sabi**: Imperfect beauty, subtle textures
- **Kanso**: Simplicity, elimination of clutter
- **Shizen**: Natural, organic flow

## Complete File Structure

```
/
├── public/
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-main.jpg          # Replaceable hero image
│   │   │   ├── hero-main@2x.jpg       # Retina version
│   │   │   └── hero-main-mobile.jpg   # Mobile optimized
│   │   ├── team/
│   │   │   ├── team-01.jpg            # Team member 1 (replaceable)
│   │   │   ├── team-02.jpg
│   │   │   ├── team-03.jpg
│   │   │   └── team-04.jpg
│   │   ├── work/
│   │   │   ├── [slug]-hero.jpg        # Case study hero images
│   │   │   ├── [slug]-thumb.jpg       # Thumbnails
│   │   │   └── [slug]-gallery/        # Gallery images per case
│   │   └── photography/
│   │       ├── pnw-01.jpg             # PNW photography
│   │       ├── pnw-02.jpg
│   │       └── studio-01.jpg          # Studio photography
│   ├── logos/
│   │   ├── clients/
│   │   │   ├── apple.svg              # Client logos (SVG preferred)
│   │   │   ├── nike.svg
│   │   │   ├── ycombinator.svg
│   │   │   ├── ufc.svg
│   │   │   ├── nba.svg
│   │   │   ├── coca-cola.svg
│   │   │   ├── nhl.svg
│   │   │   └── mlb.svg
│   │   ├── whiskey/
│   │   │   ├── whiskey-01.svg         # Top 5 whiskey brands
│   │   │   ├── whiskey-02.svg
│   │   │   ├── whiskey-03.svg
│   │   │   ├── whiskey-04.svg
│   │   │   └── whiskey-05.svg
│   │   ├── football/
│   │   │   ├── team-01.svg            # Top 5 football teams
│   │   │   └── ... (5 total)
│   │   └── stadiums/
│   │       ├── stadium-01.svg         # Top 5 stadiums
│   │       └── ... (5 total)
│   ├── models/                        # 3D models (GLTF/GLB)
│   │   ├── lego-block.glb             # Lego block model
│   │   └── environment.hdr            # HDR environment map
│   └── icons/
│       ├── arrow-right.svg
│       ├── play.svg
│       └── ... (icon set)
├── src/
│   ├── app/
│   │   ├── boot.js                    # Page-specific module loader
│   │   └── env.js                     # Environment flags (dev/prod)
│   ├── core/
│   │   ├── transitions.js             # SPA-like page transitions
│   │   └── prefetch.js                # Intelligent prefetching
│   ├── components/
│   │   ├── Header.js                  # Navigation header
│   │   ├── Footer.js                  # Footer component
│   │   ├── ImpactMetrics.js           # Bold metric cards
│   │   ├── MetricBar.js               # Sticky metric bar
│   │   ├── ClientMarquee.js           # Infinite client scroll
│   │   ├── CaseGrid.js                # Portfolio grid
│   │   ├── CaseHero.js                # Case study hero
│   │   ├── PhotoReel.js               # Photography strip
│   │   ├── BeforeAfter.js             # Before/after slider
│   │   └── LogoCloud.js               # Client logo grid
│   ├── three/
│   │   ├── core.js                    # Three.js renderer setup
│   │   ├── lego-scene.js              # Full Lego playground scene
│   │   ├── teaser.js                  # Lightweight home teaser
│   │   ├── interactions.js            # Raycasting, drag, throw
│   │   └── physics.js                 # Cannon-es physics wrapper
│   ├── styles/
│   │   ├── tokens.css                 # Design tokens (colors, spacing)
│   │   ├── base.css                   # Reset, typography
│   │   ├── layout.css                 # Grid, flex utilities
│   │   ├── components/
│   │   │   ├── header.css
│   │   │   ├── metrics.css
│   │   │   ├── marquee.css
│   │   │   └── case-grid.css
│   │   └── themes/
│   │       └── pnw.css                # PNW-specific overrides
│   ├── data/
│   │   ├── clients.json               # Client list
│   │   ├── whiskey_brands_top5.json   # Top 5 whiskey brands
│   │   ├── football_teams_top5.json   # Top 5 football teams
│   │   ├── us_stadiums_largest_top5.json  # Top 5 stadiums
│   │   └── case_studies.json          # Case studies with metrics
│   ├── analytics/
│   │   ├── hotjar.js                  # Hotjar injection
│   │   └── events.js                  # Event tracking map
│   └── utils/
│       ├── dom.js                     # DOM helpers
│       ├── io.js                      # Fetch/IO utilities
│       ├── perf.js                    # Performance monitoring
│       ├── preload.js                 # Asset preloading
│       ├── storage.js                 # localStorage/sessionStorage
│       └── math.js                    # Math utilities
├── index.html                         # Home page
├── work/
│   ├── index.html                     # Case study grid
│   └── [slug]/
│       └── index.html                 # Case detail (dynamic)
├── play/
│   └── index.html                     # Full Lego playground
├── about/
│   └── index.html                     # About page
├── contact/
│   └── index.html                     # Contact page
├── vercel.json                        # Vercel configuration
└── package.json                       # Dependencies
```

## Technical Stack

### Core

- **Vanilla JavaScript (ES6+)** with native ES Modules
- **CSS Custom Properties** for theming
- **No build step** (optional minification for prod)

### 3D & Physics

- **Three.js** (r150+) for WebGL rendering
- **Cannon-es** for physics (only in `/play`)
- **GLTFLoader** for 3D models
- **RGBELoader** for HDR environment maps

### Animation & Motion

- **GSAP 3** for DOM animations (with reduced-motion guards)
- **Lenis** for smooth scroll (lazy-loaded)
- **CSS Transitions** for lightweight animations

### Analytics

- **Hotjar** (injected via module)
- **Custom event tracking** for interactions

## Three.js Implementation Details

### Home Teaser (`three/teaser.js`)

**Purpose:** Single interactive Lego block on homepage

**Implementation:**

```javascript
// Setup
- WebGLRenderer with antialiasing
- PerspectiveCamera (FOV: 50, near: 0.1, far: 1000)
- Scene with HDR environment lighting
- Single Lego block mesh (GLTF model)
- OrbitControls for mouse interaction (limited rotation)

// Interactions (Raycaster)
- Mouse hover: Scale up block (1.0 → 1.1)
- Mouse click: Rotate block 360° with GSAP animation
- Click "Open Playground" → Navigate to /play

// Performance
- Baked lighting (no real-time shadows)
- Single draw call
- Pause animation when tab hidden
- Respect prefers-reduced-motion (static block)
```

### Full Playground (`three/lego-scene.js`)

**Purpose:** Interactive Lego block playground with physics

**Implementation:**

```javascript
// Setup
- WebGLRenderer with shadows enabled
- PerspectiveCamera with controls
- Scene with HDR environment + directional light
- Cannon-es physics world
- Multiple Lego blocks (5-10 max for performance)

// Interactions (Raycaster + Physics)
- Mouse/Touch drag: Pick up blocks with raycasting
- Release: Apply velocity to throw block
- Physics: Blocks fall, collide, stack
- Keyboard: R = Reset, S = Save stash, L = Load stash

// Stash System
- Save block positions/rotations to sessionStorage
- Load on page return
- Reset button clears all

// Performance Guards
- Max 10 blocks in scene
- Cap at 60fps (requestAnimationFrame)
- Pause when tab hidden
- Degrade to static if FPS < 30
```

### Raycasting Implementation

```javascript
// three/interactions.js
- Create Raycaster from mouse/touch coordinates
- Intersect with Lego block meshes
- Calculate drag offset (block position - intersection point)
- Update block position on mouse move
- Release: Calculate velocity from drag distance/time
- Apply impulse to physics body
```

## Asset Management System

### Image Replacement Strategy

All images use consistent naming and are loaded via JSON data:

**Structure:**

```json
// case_studies.json
{
  "slug": "apple-redesign",
  "hero": {
    "desktop": "/images/work/apple-redesign-hero.jpg",
    "mobile": "/images/work/apple-redesign-hero-mobile.jpg",
    "alt": "Apple redesign case study"
  },
  "thumbnail": "/images/work/apple-redesign-thumb.jpg"
}
```

**Component Pattern:**

```javascript
// components/CaseHero.js
export function renderCaseHero(caseData) {
  const img = document.createElement("img");
  img.src = caseData.hero.desktop;
  img.srcset = `${caseData.hero.desktop} 1x, ${caseData.hero.desktop.replace(
    ".jpg",
    "@2x.jpg"
  )} 2x`;
  img.alt = caseData.hero.alt;
  img.loading = "lazy";
  return img;
}
```

**To Replace Images:**

1. Replace file in `public/images/` with same filename
2. Or update JSON with new path
3. No code changes needed

### Logo Management

- All logos in `public/logos/` as SVG (preferred) or PNG
- Loaded via `data/clients.json`:

```json
{
  "name": "Apple",
  "logo": "/logos/clients/apple.svg",
  "category": "tech"
}
```

## Component Specifications

### ImpactMetrics Component

**Purpose:** Bold, above-fold metrics for "2-second hook"

**Props:**

- `metrics`: Array of `{label, value, unit, color}`
- `layout`: "hero" | "grid" | "sticky"

**Implementation:**

- Large typography (min 48px on desktop)
- High contrast (WCAG AAA)
- GSAP reveal animation (respects reduced-motion)
- Always visible (no hover required)

### ClientMarquee Component

**Purpose:** Infinite scroll of client logos

**Implementation:**

- CSS animation for smooth scroll
- Duplicate logos for seamless loop
- Pause on hover
- Lazy load logos (IntersectionObserver)

### CaseGrid Component

**Purpose:** Portfolio grid with impact cards

**Implementation:**

- CSS Grid (responsive)
- Impact card overlay (always visible)
- Hover: Slight scale + parallax effect
- Click: Navigate to case detail

### LegoScene Component

**Purpose:** Three.js canvas wrapper

**Implementation:**

- Creates canvas element
- Handles resize events
- Guards for GPU availability
- Respects `prefers-reduced-motion`

## Data Structure (Explicit JSON Only)

### `data/clients.json`

```json
[
  {
    "name": "Apple",
    "logo": "/logos/clients/apple.svg",
    "category": "tech"
  }
]
```

### `data/case_studies.json`

```json
[
  {
    "slug": "apple-redesign",
    "title": "Apple Store Redesign",
    "client": "Apple",
    "metrics": [
      { "label": "Conversion Increase", "value": "38", "unit": "%" },
      { "label": "Checkout Time", "value": "-22", "unit": "%" }
    ],
    "hero": {
      "desktop": "/images/work/apple-redesign-hero.jpg",
      "mobile": "/images/work/apple-redesign-hero-mobile.jpg",
      "alt": "Apple redesign case study"
    },
    "thumbnail": "/images/work/apple-redesign-thumb.jpg",
    "gallery": ["/images/work/apple-redesign-gallery/01.jpg"],
    "description": "Case study description..."
  }
]
```

### `data/whiskey_brands_top5.json`

```json
[{ "name": "Brand Name", "logo": "/logos/whiskey/whiskey-01.svg", "rank": 1 }]
```

**Note:** You must provide exact data. No placeholders or inference.

## Performance Targets

- **JS Initial:** <75KB gzipped
- **LCP:** <1.5s on 4G
- **FPS:** 60fps scroll, 50-60fps 3D
- **Lighthouse:** 90+ (Performance, Best Practices, Accessibility, SEO)

## Implementation Phases

### Phase 1: Foundation

- [ ] MPA structure (all HTML pages)
- [ ] Header/Footer components
- [ ] Style tokens (colors, spacing, typography)
- [ ] Base CSS (reset, typography)
- [ ] Layout utilities (grid, flex)
- [ ] Vercel deployment setup

### Phase 2: Metrics Layer

- [ ] ImpactMetrics component
- [ ] MetricBar component (sticky)
- [ ] Hero section with above-fold metrics
- [ ] GSAP animations (with reduced-motion guards)

### Phase 3: Content Components

- [ ] CaseGrid component
- [ ] CaseHero component
- [ ] ClientMarquee component
- [ ] LogoCloud component
- [ ] PhotoReel component
- [ ] BeforeAfter slider

### Phase 4: 3D Integration

- [ ] Three.js core setup (renderer, camera, scene)
- [ ] Home teaser (single Lego block)
- [ ] Full playground (`/play` page)
- [ ] Raycasting interactions
- [ ] Physics integration (Cannon-es)
- [ ] Stash system (save/load)

### Phase 5: Transitions & Polish

- [ ] Page transitions (CSS + IntersectionObserver)
- [ ] Prefetch system
- [ ] Smooth scroll (Lenis)
- [ ] Loading states
- [ ] Error handling

### Phase 6: Content & Data

- [ ] All JSON data files (you provide exact data)
- [ ] Image assets (placeholder structure)
- [ ] Logo assets (SVG structure)

### Phase 7: Analytics

- [ ] Hotjar integration
- [ ] Event tracking map
- [ ] Performance monitoring

### Phase 8: Optimization

- [ ] Image optimization (WebP/AVIF)
- [ ] Code minification (optional)
- [ ] Lazy loading
- [ ] Accessibility audit
- [ ] SEO optimization (meta tags, structured data)
- [ ] Lighthouse pass

## Japanese Contemporary Design Implementation

### Visual Elements

**Spacing (Ma - 間):**

- Generous padding: `--spacing-xl: 4rem`, `--spacing-xxl: 8rem`
- Section gaps: `--section-gap: 12rem`
- Component spacing: `--component-gap: 2rem`

**Typography:**

- Large, readable sizes: `--font-size-hero: clamp(3rem, 8vw, 6rem)`
- Generous line-height: `--line-height-relaxed: 1.8`
- Letter spacing: `--letter-spacing-wide: 0.05em`

**Textures (Wabi-Sabi):**

- Subtle paper texture overlay (CSS background-image)
- Soft shadows: `--shadow-soft: 0 2px 20px rgba(0,0,0,0.08)`
- Organic shapes (CSS clip-path for subtle curves)

**Layout Principles:**

- Asymmetric balance (not perfectly centered)
- Grid with intentional gaps
- Content breathing room (max-width: 1200px with large margins)

**Color Usage:**

- Primary: Forest green (PNW connection)
- Neutral: Washi/Sumi (Japanese minimalism)
- Accent: Kintsugi gold (sparingly, for highlights)
- Lego colors: Playful, but contained to interactive elements

**Motion (Shizen - Natural):**

- Ease-out curves: `cubic-bezier(0.25, 0.46, 0.45, 0.94)`
- Organic transitions (not mechanical)
- Respect `prefers-reduced-motion` (static fallbacks)

### CSS Token Examples

```css
/* styles/tokens.css */
:root {
  /* Colors (Japanese Contemporary + PNW) */
  --color-evergreen-900: #1a3d2e;
  --color-evergreen-700: #2d5a3f;
  --color-washi-100: #faf9f6;
  --color-sumi-900: #1a1a1a;
  --color-kin-500: #d4af37;

  /* Spacing (Ma - generous) */
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 3rem;
  --spacing-xl: 4rem;
  --spacing-xxl: 8rem;
  --section-gap: 12rem;

  /* Typography */
  --font-family-base: "Inter", system-ui, sans-serif;
  --font-size-hero: clamp(3rem, 8vw, 6rem);
  --line-height-relaxed: 1.8;
  --letter-spacing-wide: 0.05em;

  /* Shadows (Soft, organic) */
  --shadow-soft: 0 2px 20px rgba(0, 0, 0, 0.08);
  --shadow-medium: 0 4px 30px rgba(0, 0, 0, 0.12);

  /* Transitions (Natural) */
  --transition-smooth: 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --transition-snappy: 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

## Key Implementation Notes

1. **Modularity:** Every component is a separate ES module
2. **No Assumptions:** All data comes from explicit JSON
3. **Easy Image Replacement:** Consistent naming, JSON-driven paths
4. **Performance First:** Lazy load, guard 3D, respect preferences
5. **Japanese Design:** Generous spacing, minimal palette, natural textures
6. **Professional Grade:** MPA for SEO, accessibility, resilience
7. **Three.js:** Raycasting for interactions, physics only in `/play`
8. **Asset Management:** All images/logos replaceable via file replacement or JSON update
