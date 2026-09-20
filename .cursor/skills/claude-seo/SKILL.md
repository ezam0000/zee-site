---
name: claude-seo
description: >-
  Technical SEO, Schema.org JSON-LD, sitemaps, on-page identity, image SEO, and
  AI-search (GEO) checks for Zee Pauli’s static portfolio. Use when the user
  mentions SEO, audit, schema, JSON-LD, sitemap, robots.txt, Open Graph,
  Core Web Vitals, E-E-A-T, GEO, AI Overviews, or crawlability.
---

# Claude SEO (Zee)

Cursor port of the [AgriciDaniel/claude-seo](https://github.com/AgriciDaniel/claude-seo) methodology. Do not install the Claude Code plugin, Python runtime, or Playwright Chromium SEO stack into this repo.

Zee is a 3-page vanilla JS site at `https://zee-studio.com`. Industry type: designer portfolio / agency. JSON-LD belongs in the initial HTML, never injected after hydration.

## Page inventory

| URL | File | Notes |
|-----|------|--------|
| `/` | `index.html` | Title stays `Zee Pauli` |
| `/work/` | `work/index.html` | Title `Work — Zee Pauli`. Cases open as `#slug` modals |
| `/about/` | `about/index.html` | Title `About — Zee Pauli`. `ProfilePage` |

Do not list hash URLs in `sitemap.xml`. Hash modals are shareable in-browser only; crawlers still see one Work page.

## Audit scope

Run these checks. Skip everything else.

1. **Technical** — HTTPS, canonicals, robots.txt, sitemap.xml, indexability, redirects in `vercel.json`, no blocking CSP for HTML JSON-LD.
2. **Schema** — JSON-LD `@graph` in HTML. Person `@id` `https://zee-studio.com/#person`. WebSite, WebPage, ProfilePage (About), BreadcrumbList (Work/About), ItemList of CreativeWork on Work.
3. **On-page** — unique title + description + OG/Twitter per page; `og:image` is an absolute production URL.
4. **Images** — alt text, sized webp via `src/utils/images.js`, OG image 1200×630.
5. **GEO / E-E-A-T** — Person `sameAs`, `jobTitle`, `worksFor`, About credentials. Do not rewrite About copy unless asked.
6. **Sitemaps** — `/`, `/work/`, `/about/` only.

## Skip

- Ecommerce, maps, GBP, hreflang, programmatic SEO, DataForSEO, Firecrawl, Banana
- HowTo schema; new FAQPage for Google rich results
- `llms.txt` as a ranking or citation lever (Google ignores it)
- LocalBusiness (no street address or phone)
- Python `/seo` plugin commands and the Skool community footer
- Changing cache or security headers in `vercel.json` / `serve.json`
- Unique HTML pages per case study unless the user explicitly wants crawlable case URLs

## Hard rules

- JSON-LD in the first HTML response, not `document.createElement('script')`
- Absolute URLs in canonical, OG, schema `url` / `image` / `sameAs`
- Core Web Vitals: INP, never FID
- After an audit, implement Critical and High only unless asked
- Look-and-feel stays with the user; do not restyle pages for SEO

## Output

```
# SEO audit: zee-studio.com

## Critical
- Finding
- Observation
- Fix
- How we would know this failed

## High
...

## Medium / Low
...
```

Priority: **Critical** blocks indexing. **High** hurts rankings or entity clarity. **Medium** is a 30-day opportunity. **Low** is backlog.

Known High if asked later: hash-only case studies (`/work/#pixlz`) have no unique OG/schema URL for Google or AI citation of a single project.

## Existing identity

- Production: `https://zee-studio.com`
- Person image: `/public/images/zee-headshot-1400.webp`
- Email: `mailto:zee.pauli@outlook.com`
- sameAs: Behance `zee-design`, LinkedIn `zee-studio`, Instagram `zee.24`
- OG image: `https://zee-studio.com/public/og-image.jpg`
- Tests: `tests/homepage.spec.js` (update titles/JSON-LD/robots/sitemap together)
