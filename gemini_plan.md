# Gemini 3 Plan: Zee

## 1. Project Vision & Core Objectives
**Zee** is a high-end design studio located in the PNW (Portland/Vancouver). The digital presence must be:
- **Snappy & Interactive:** High performance, instant feedback, smooth transitions.
- **Professional & Credible:** Showcasing high-tier clients (Apple, Nike, YC) and strong metrics.
- **Stylized & Alive:** Utilizing 3D elements (Three.js) and physics (Lego blocks) without compromising usability.
- **Metric-Driven:** Incorporating Reddit feedback to highlight success metrics immediately for recruiters (the "2-second rule").

## 2. Technical Architecture (Modern Vanilla Stack)
To maintain "professional grade" quality without frameworks, we will use **Native ES Modules (ESM)**. This ensures modularity, maintainability, and browser compatibility without a heavy build step.

### Directory Structure
```
/
├── public/              # Static assets (models, textures, images)
├── src/
│   ├── core/            # Core logic (Router, EventBus, App entry)
│   ├── components/      # Functional UI components (Nav, Grid, Metrics)
│   ├── three/           # 3D Logic (Scenes, Lego interactions, Camera)
│   ├── styles/          # CSS modules (Imports via CSS @import or JS injection)
│   ├── utils/           # Helpers (Math, DOM manipulation, Analytics)
│   └── data/            # JSON data for Clients, Projects, and Stats
├── index.html           # Single Entry Point
├── vercel.json          # Vercel Configuration
└── package.json         # Dependency tracking (Three.js, GSAP, Lenis)
```

### The Stack
- **Core:** Vanilla JavaScript (ES6+).
- **Styling:** CSS Variables + CSS Grid/Flexbox (Scoped methodology).
- **3D/WebGL:** `Three.js` for rendering.
- **Physics:** `Cannon-es` (for the interactive Lego blocks).
- **Animation:** `GSAP` (GreenSock) for "snappy" DOM animations and scroll triggers.
- **Smooth Scroll:** `Lenis` (essential for that premium design studio feel).
- **Analytics:** Hotjar (Script injection module).

## 3. UX/UI Strategy & "Reddit-Driven" Features

### A. The "2-Second" Recruiter Hook
*Based on r/UXDesign feedback.*
- **Metric Cards:** Every case study preview will feature a bold, high-contrast "Impact Card" overlay (e.g., "Increased Conversion by 40%").
- **Navigation:** Minimalist but persistent. No hiding key links behind complex menus.
- **The "Stash":** The interactive Lego block element will serve as a playful "save" mechanism or simply a fidget interaction to keep retention high.

### B. Client Social Proof
We will structure the client list into high-impact categories using a masonry or kinetic typography grid:
- **Tech Giants:** Apple, Y Combinator.
- **Sports & Arenas:** UFC, NBA, NHL, MLB, Top 5 Largest Stadiums.
- **Consumer Goods:** Nike, Coca-Cola, Top 5 Whiskey Brands.

### C. The "Zee" Aesthetic
- **Palette:** Deep greens, rain-slicked concrete grays, vibrant accents (Lego colors).
- **Vibe:** "Pacific Northwest Cyber-Nature."

## 4. Component Modules (Plan)

1.  **`App.js`**: Main entry point. Initializes the Router and the 3D Canvas.
2.  **`LegoScene.js`**: Handles the Three.js context.
    *   *Interaction:* Raycasting for mouse/touch events.
    *   *Physics:* Blocks fall and collide. Users can "throw" them.
3.  **`ImpactGrid.js`**: The portfolio grid.
    *   *Logic:* Fetches case studies.
    *   *Render:* Generates HTML strings with embedded Metrics.
4.  **`Marquee.js`**: Infinite scroll for the massive client list.
5.  **`Analytics.js`**: Encapsulated Hotjar and generic event tracking logic.

## 5. Deployment Strategy (Vercel)
- **Configuration:** `vercel.json` to handle SPA routing (rewrites to `index.html`).
- **Environments:**
    - `Preview`: Auto-deployed on branch push (Testing).
    - `Production`: Deployed on main merge.
- **Performance:** Assets served via Vercel Edge Network.

## 6. Implementation Phases

1.  **Skeleton:** Setup folder structure, ES module linking, and Vercel deployment.
2.  **The Canvas:** Implement Three.js boilerplate and lighting.
3.  **The Content:** Build the HTML structure for Portfolio and Client lists.
4.  **The Magic:** Implement Lego physics and GSAP transitions.
5.  **The Metrics:** Refine the "Impact Cards" based on Reddit advice.
6.  **Optimization:** Lighthouse scoring and Hotjar verification.

