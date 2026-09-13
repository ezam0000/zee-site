# Deployment Guide

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm start
```

3. Open browser:
```
http://localhost:3000
```

## Vercel Deployment

### Option 1: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts to link project or create new one

### Option 2: GitHub Integration

1. Push code to GitHub repository

2. Go to [vercel.com](https://vercel.com)

3. Import your GitHub repository

4. Vercel will auto-detect settings and deploy

### Smooth scroll (Lenis)

Runtime Lenis is served from the committed file `public/vendor/lenis.mjs` (copied from the `lenis` package). HTML import maps map `"lenis"` to that path — not jsDelivr. After upgrading `lenis`, refresh the vendor copy:

```bash
cp node_modules/lenis/dist/lenis.mjs public/vendor/lenis.mjs
```

### Hotjar

Hotjar is off until you set a real site ID in `src/analytics/hotjar.js`:

```javascript
const hotjarId = "YOUR_HOTJAR_ID";
```

Replace the placeholder with your Hotjar site ID. The loader only runs on non-localhost hosts and skips when the placeholder remains.

If you enable Hotjar, widen `Content-Security-Policy` in `vercel.json` so `script-src` (and any required Hotjar hosts) allow `https://static.hotjar.com` and related Hotjar endpoints. The default CSP is `'self'` only.

### Security headers

`vercel.json` sets CSP, `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options`, plus existing Cache-Control rules. Confirm them on a preview deploy response.

### Post-Deployment

1. Confirm Lenis loads from `/public/vendor/lenis.mjs` (no jsDelivr requests)
2. Verify all assets are loading correctly
3. Test all pages and interactions (including contact mailto)
4. Check Lighthouse scores (aim for 90+)

## Troubleshooting

### Module Loading Errors

- Ensure all imports use `.js` extension
- Check browser console for specific errors
- Verify `type="module"` in script tags
- Confirm `/public/vendor/lenis.mjs` is deployed

### Images Not Showing

- Verify image paths in data files or components
- Check file permissions
- Ensure images are in `public/` directory
