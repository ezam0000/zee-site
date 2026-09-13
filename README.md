# Zee Website

A packaging and brand design studio site for Zee Pauli, built as a static multi-page app with vanilla JavaScript ES modules.

## Features

- Hero liquid WebGL background with reduced-motion fallback
- Portfolio category pages with modal galleries
- Smooth scrolling via Lenis (vendored)
- Dark/light theme toggle
- Hotjar-ready analytics hook

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
npm install
```

### Local Development

```bash
npm start
```

The site will be available at `http://localhost:3000`

### Tests

```bash
npm test
```

### Deployment

Deploy to Vercel:

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments. See `DEPLOYMENT.md`.

## Project Structure

```
/
├── public/          # Static assets (images, logos, vendor)
├── src/
│   ├── app/         # Config and environment
│   ├── components/  # UI components
│   ├── core/        # Cross-page runtime (smooth scroll, etc.)
│   ├── effects/     # Visual effects
│   ├── pages/       # Page entry modules
│   ├── styles/      # CSS stylesheets
│   ├── data/        # JSON content (optional / future)
│   ├── analytics/   # Analytics integration
│   └── utils/       # Utility functions
├── index.html       # Home page
├── branding/        # Branding portfolio
├── packaging/       # Packaging portfolio
├── experience/      # Experience portfolio
├── about/           # About page
├── contact/         # Contact page
└── work/            # Generic portfolio page
```

## Configuration

### Hotjar

Update `src/analytics/hotjar.js` with your Hotjar site ID:

```javascript
const hotjarId = "YOUR_HOTJAR_ID";
```

### Lenis vendor copy

After upgrading the `lenis` package:

```bash
cp node_modules/lenis/dist/lenis.mjs public/vendor/lenis.mjs
```

## Browser Support

- Modern browsers with ES modules and WebGL
- Respects `prefers-reduced-motion`

## License

© Zee Pauli
