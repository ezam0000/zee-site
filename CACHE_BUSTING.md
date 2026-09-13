# Cache Busting Guide

This site uses multiple cache busting strategies to prevent Safari and other browsers from serving stale content.

## How to Update Version

When you deploy a new version, update the version query parameter in all HTML files:

1. **Update version in HTML files:**
   - Change `?v=1.0.0` to `?v=1.0.1` (or use a timestamp like `?v=1234567890`)
   - Pages that use versioned assets include:
     - `index.html`
     - `about/index.html`
     - `contact/index.html`
     - `branding/index.html`
     - `packaging/index.html`
     - `experience/index.html`
     - `work/index.html`

2. **Quick update scripts:**
   ```bash
   npm run version:update
   # or
   npm run version:timestamp
   ```

## Cache Busting Methods

1. **HTML Files**: Set to `no-cache` in `vercel.json` - HTML will never be cached
2. **Meta Tags**: Added to HTML head to prevent browser caching
3. **Version Query Parameters**: Added to CSS and JS files - update version number when deploying
4. **Vercel Headers**: Configured to prevent caching of HTML and `/src/` files

## Recommended Workflow

1. Before deploying, run `npm run version:update` (or `version:timestamp`)
2. Deploy to Vercel
3. The combination of no-cache headers + version params ensures fresh content
