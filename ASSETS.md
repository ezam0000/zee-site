# Assets Required

This document lists all assets that need to be added to the project.

## Images

### Hero Images
- `/public/images/hero/hero-main.jpg` (1920x1080 recommended)
- `/public/images/hero/hero-main@2x.jpg` (3840x2160 for retina)
- `/public/images/hero/hero-main-mobile.jpg` (768x1024 for mobile)

### Team Photos
- `/public/images/team/team-01.jpg`
- `/public/images/team/team-02.jpg`
- `/public/images/team/team-03.jpg`
- `/public/images/team/team-04.jpg`

### Work/Case Studies
For each case study in `src/data/case_studies.json`, you need:

- `/public/images/work/[slug]-hero.jpg` (1920x1080)
- `/public/images/work/[slug]-hero-mobile.jpg` (768x1024)
- `/public/images/work/[slug]-thumb.jpg` (600x400)
- `/public/images/work/[slug]-gallery/01.jpg` (and more as needed)

Example:
- `/public/images/work/apple-redesign-hero.jpg`
- `/public/images/work/apple-redesign-hero-mobile.jpg`
- `/public/images/work/apple-redesign-thumb.jpg`
- `/public/images/work/apple-redesign-gallery/01.jpg`

### Photography
- `/public/images/photography/pnw-01.jpg`
- `/public/images/photography/pnw-02.jpg`
- `/public/images/photography/studio-01.jpg`

## Logos

### Client Logos (SVG preferred)
- `/public/logos/clients/apple.svg`
- `/public/logos/clients/ycombinator.svg`
- `/public/logos/clients/nike.svg`
- `/public/logos/clients/ufc.svg`
- `/public/logos/clients/nba.svg`
- `/public/logos/clients/coca-cola.svg`
- `/public/logos/clients/nhl.svg`
- `/public/logos/clients/mlb.svg`

### Whiskey Brands (Top 5)
- `/public/logos/whiskey/whiskey-01.svg`
- `/public/logos/whiskey/whiskey-02.svg`
- `/public/logos/whiskey/whiskey-03.svg`
- `/public/logos/whiskey/whiskey-04.svg`
- `/public/logos/whiskey/whiskey-05.svg`

### Football Teams (Top 5)
- `/public/logos/football/team-01.svg`
- `/public/logos/football/team-02.svg`
- `/public/logos/football/team-03.svg`
- `/public/logos/football/team-04.svg`
- `/public/logos/football/team-05.svg`

### Stadiums (Top 5)
- `/public/logos/stadiums/stadium-01.svg`
- `/public/logos/stadiums/stadium-02.svg`
- `/public/logos/stadiums/stadium-03.svg`
- `/public/logos/stadiums/stadium-04.svg`
- `/public/logos/stadiums/stadium-05.svg`

## Image Specifications

- **Format**: JPG for photos, SVG for logos (PNG fallback acceptable)
- **Optimization**: Compress images before adding
- **Responsive**: Provide @2x versions for retina displays
- **Aspect Ratios**: Maintain consistent ratios within categories

## Quick Start

1. Replace placeholder images in `/public/images/`
2. Replace placeholder logos in `/public/logos/`
3. Update JSON data files if filenames change
4. Test locally with `npm start`

