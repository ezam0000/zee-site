# Cache Busting Guide

This site uses multiple cache busting strategies to prevent Safari and other browsers from serving stale content.

## How to Update Version

When you deploy a new version, update the version query parameter in all HTML files:

1. **Update version in HTML files:**
   - Change `?v=1.0.0` to `?v=1.0.1` (or use timestamp like `?v=1234567890`)
   - Update in:
     - `index.html` (stylesheets and main.js)
     - `about/index.html`
     - `contact/index.html`
     - `work/index.html`
     - `play/index.html`

2. **Quick update script:**
   ```bash
   # Find and replace version in all HTML files
   find . -name "*.html" -type f -exec sed -i '' 's/v=1.0.0/v=1.0.1/g' {} \;
   ```

## Cache Busting Methods

1. **HTML Files**: Set to `no-cache` in `vercel.json` - HTML will never be cached
2. **Meta Tags**: Added to HTML head to prevent browser caching
3. **Version Query Parameters**: Added to CSS and JS files - update version number when deploying
4. **Vercel Headers**: Configured to prevent caching of HTML and `/src/` files

## For Development

If you want automatic cache busting during development, you can use:
- `?v=Date.now()` in JavaScript (but this requires JS execution)
- Or manually increment version number on each deploy

## Recommended Workflow

1. Before deploying, increment the version number in all HTML files
2. Deploy to Vercel
3. The combination of no-cache headers + version params ensures fresh content

