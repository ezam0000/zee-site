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

### Environment Variables

If needed, add environment variables in Vercel dashboard:
- `HOTJAR_ID` (optional, for analytics)

### Post-Deployment

1. Update Hotjar ID in `src/analytics/hotjar.js`:
```javascript
const hotjarId = process.env.HOTJAR_ID || "YOUR_HOTJAR_ID";
```

2. Verify all assets are loading correctly

3. Test all pages and interactions

4. Check Lighthouse scores (aim for 90+)

## Troubleshooting

### Module Loading Errors

- Ensure all imports use `.js` extension
- Check browser console for specific errors
- Verify `type="module"` in script tags

### 3D Not Loading

- Check WebGL support: `chrome://gpu` (Chrome)
- Verify Three.js is installed: `npm list three`
- Check browser console for errors

### Images Not Showing

- Verify image paths in JSON data files
- Check file permissions
- Ensure images are in `public/` directory

