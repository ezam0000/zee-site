# Zee Website

A professional design studio website built with vanilla JavaScript, Three.js, and modern web technologies.

## Features

- **Interactive 3D Elements**: Three.js powered Lego block playground
- **Performance-First**: Optimized for speed and accessibility
- **Japanese Contemporary Design**: Minimalist aesthetic with PNW influences
- **Modular Architecture**: Fully modular ES6+ codebase
- **Analytics Ready**: Hotjar integration for user insights

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

### Deployment

Deploy to Vercel:

```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Project Structure

```
/
├── public/          # Static assets (images, logos)
├── src/
│   ├── app/         # App initialization
│   ├── components/  # UI components
│   ├── three/       # Three.js scenes
│   ├── styles/      # CSS stylesheets
│   ├── data/        # JSON data files
│   ├── analytics/   # Analytics integration
│   └── utils/       # Utility functions
├── index.html       # Home page
├── work/            # Work/portfolio pages
├── about/           # About page
├── contact/         # Contact page
└── play/            # 3D playground
```

## Replacing Assets

### Images

1. Replace files in `public/images/` maintaining the same filenames
2. Or update paths in JSON data files (`src/data/case_studies.json`)

### Logos

1. Replace SVG/PNG files in `public/logos/` maintaining filenames
2. Or update paths in JSON data files

## Configuration

### Hotjar

Update `src/analytics/hotjar.js` with your Hotjar site ID:

```javascript
const hotjarId = "YOUR_HOTJAR_ID";
```

## Browser Support

- Modern browsers with WebGL support
- Graceful degradation for older browsers
- Respects `prefers-reduced-motion`

## License

© 2024 Zee

