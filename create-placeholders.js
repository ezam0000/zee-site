// Quick script to create placeholder SVGs
const fs = require('fs');
const path = require('path');

const placeholders = {
  'public/images/hero/hero-main.jpg': { w: 1920, h: 1080, text: 'Hero Main' },
  'public/images/hero/hero-main@2x.jpg': { w: 3840, h: 2160, text: 'Hero Main 2x' },
  'public/images/hero/hero-main-mobile.jpg': { w: 768, h: 1024, text: 'Hero Mobile' },
  'public/images/work/apple-redesign-hero.jpg': { w: 1920, h: 1080, text: 'Apple Redesign' },
  'public/images/work/apple-redesign-hero-mobile.jpg': { w: 768, h: 1024, text: 'Apple Mobile' },
  'public/images/work/apple-redesign-thumb.jpg': { w: 600, h: 400, text: 'Apple Thumb' },
  'public/images/work/nike-campaign-hero.jpg': { w: 1920, h: 1080, text: 'Nike Campaign' },
  'public/images/work/nike-campaign-hero-mobile.jpg': { w: 768, h: 1024, text: 'Nike Mobile' },
  'public/images/work/nike-campaign-thumb.jpg': { w: 600, h: 400, text: 'Nike Thumb' },
  'public/images/photography/pnw-01.jpg': { w: 1200, h: 800, text: 'PNW 01' },
  'public/images/photography/pnw-02.jpg': { w: 1200, h: 800, text: 'PNW 02' },
  'public/images/photography/studio-01.jpg': { w: 1200, h: 800, text: 'Studio 01' },
  'public/images/team/team-01.jpg': { w: 400, h: 400, text: 'Team 01' },
  'public/images/team/team-02.jpg': { w: 400, h: 400, text: 'Team 02' },
  'public/images/team/team-03.jpg': { w: 400, h: 400, text: 'Team 03' },
  'public/images/team/team-04.jpg': { w: 400, h: 400, text: 'Team 04' },
};

Object.entries(placeholders).forEach(([file, { w, h, text }]) => {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const svg = `<svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1a3d2e;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#4a7c59;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#grad)"/>
  <text x="${w/2}" y="${h/2}" font-family="Arial" font-size="${Math.min(w,h)/20}" fill="#faf9f6" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
  
  fs.writeFileSync(file.replace('.jpg', '.svg'), svg);
  console.log(`Created ${file.replace('.jpg', '.svg')}`);
});

