import { test, expect } from '@playwright/test';
import { IMAGE_MANIFEST } from '../src/data/image-manifest.js';

test.describe('Zee Homepage', () => {
  test.beforeEach(async ({ page }) => {
    page.startupErrors = [];
    page.on('pageerror', (error) => {
      page.startupErrors.push(error.message);
    });
    page.on('console', (msg) => {
      if (msg.type() !== 'error') return;
      const text = msg.text();
      if (text.includes('NumberOfInputEventTimestampsToTrack')
        || text.includes('Extension')
        || text.includes('content_script')
        || text.includes('favicon.ico')) return;
      page.startupErrors.push(text);
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle('Zee Pauli');
  });

  test('should display hero section', async ({ page }) => {
    const headline = page.locator('.headline');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Design for');
  });

  test('should display site navigation links', async ({ page }) => {
    const links = page.locator('.hero-portfolio-links .hero-portfolio-link');
    await expect(links).toHaveCount(2);
    await expect(page.getByRole('link', { name: 'work' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'about' })).toBeVisible();
  });

  test('should include hero liquid background canvas', async ({ page }) => {
    const canvas = page.locator('#hero-liquid .hero-liquid-canvas');
    await expect(canvas).toBeVisible();
  });

  test('should not have console errors', async ({ page }) => {
    await page.waitForTimeout(1000);
    expect(page.startupErrors).toEqual([]);
  });

  test('should be responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.headline')).toBeVisible();

    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.headline')).toBeVisible();
  });
});

test.describe('Share and identity metadata', () => {
  test('homepage has OG image, favicons, and share tags', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Zee Pauli');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://zee-studio.com/public/og-image.jpg'
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
    await expect(page.locator('link[rel="icon"][href="/public/favicon.ico"]')).toHaveCount(1);
    await expect(page.locator('link[rel="icon"][href="/public/favicon-32.png"]')).toHaveCount(1);
    await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute(
      'href',
      '/public/apple-touch-icon.png'
    );

    const ogImage = await page.request.get('/public/og-image.jpg');
    expect(ogImage.ok()).toBeTruthy();
    const favicon = await page.request.get('/public/favicon-32.png');
    expect(favicon.ok()).toBeTruthy();
  });

  test('work page has its own share card', async ({ page }) => {
    await page.goto('/work/');
    await expect(page).toHaveTitle('Work — Zee Pauli');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Work — Zee Pauli'
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://zee-studio.com/work/'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://zee-studio.com/work/'
    );
  });

  test('robots.txt and sitemap list the public pages', async ({ request }) => {
    const robots = await request.get('/robots.txt');
    expect(robots.ok()).toBeTruthy();
    const robotsBody = await robots.text();
    expect(robotsBody).toContain('Sitemap: https://zee-studio.com/sitemap.xml');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sitemapBody = await sitemap.text();
    expect(sitemapBody).toContain('https://zee-studio.com/');
    expect(sitemapBody).toContain('https://zee-studio.com/work/');
    expect(sitemapBody).toContain('https://zee-studio.com/about/');
    expect(sitemapBody).toContain('https://zee-studio.com/work/pixlz/');
    expect(sitemapBody).not.toContain('#');
    expect(sitemapBody).not.toContain('<lastmod>');
    expect(sitemapBody.match(/<loc>/g)).toHaveLength(9);
  });

  test('homepage JSON-LD describes Person and WebSite', async ({ page }) => {
    await page.goto('/');
    const graph = await jsonLdGraph(page);
    const types = graph.map((node) => node['@type']);
    expect(types).toEqual(expect.arrayContaining(['Person', 'WebSite', 'WebPage']));
    const person = graph.find((node) => node['@type'] === 'Person');
    expect(person['@id']).toBe('https://zee-studio.com/#person');
    expect(person.sameAs).toEqual(expect.arrayContaining([
      'https://www.behance.net/zee-design',
      'https://www.linkedin.com/in/zee-studio',
      'https://www.instagram.com/zee.24',
    ]));
  });

  test('work JSON-LD lists selected projects', async ({ page }) => {
    await page.goto('/work/');
    const graph = await jsonLdGraph(page);
    const list = graph.find((node) => node['@type'] === 'ItemList');
    expect(list.numberOfItems).toBe(6);
    const names = list.itemListElement.map((entry) => entry.item.name);
    expect(names).toContain('Pixlz');
  });
});

async function jsonLdGraph(page) {
  const raw = await page.locator('script[type="application/ld+json"]').first().textContent();
  const data = JSON.parse(raw);
  return data['@graph'] ?? [data];
}

test.describe('Mobile targets and work deep links', () => {
  test('mobile social links meet 44px targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const link = page.locator('.nav-social__link').first();
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box.width)).toBeGreaterThanOrEqual(44);
    expect(Math.round(box.height)).toBeGreaterThanOrEqual(44);
  });

  test('work hash opens the project and updates the tab title', async ({ page }) => {
    await page.goto('/work/#pixlz');
    await expect(page.locator('#portfolio-modal')).toHaveJSProperty('open', true);
    await expect(page.locator('#portfolio-modal')).toHaveClass(/is-open/);
    await expect(page).toHaveTitle('Pixlz');
    await expect(page).toHaveURL(/\/work\/pixlz\/?$/);

    await page.keyboard.press('Escape');
    await expect(page.locator('#portfolio-modal')).toHaveJSProperty('open', false);
    await expect(page).toHaveTitle('Work — Zee Pauli');
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.locator('a[data-project-slug="pixlz"]')).toBeFocused();
  });

  test('work and about links navigate from the homepage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'work' }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page).toHaveTitle('Work — Zee Pauli');

    await page.goto('/');
    await page.getByRole('link', { name: 'about' }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page).toHaveTitle('About — Zee Pauli');
  });

  test('work tiles and modal gallery use actual image widths', async ({ page }) => {
    await page.goto('/work/');
    const tileImg = page.locator('.portfolio-tile img').first();
    const srcset = await tileImg.getAttribute('srcset');
    expect(srcset).toMatch(/\.webp \d+w/);
    for (const part of srcset.split(',')) {
      const [url, descriptor] = part.trim().split(/\s+/);
      const width = Number(descriptor.replace('w', ''));
      const entry = Object.values(IMAGE_MANIFEST).find((image) => image.candidates.some((candidate) => candidate.src === url));
      const candidate = entry.candidates.find((item) => item.src === url);
      expect(candidate.width).toBe(width);
    }

    await page.locator('.portfolio-tile').first().click();
    await expect(page.locator('#portfolio-modal')).toHaveClass(/is-open/);
    const modalImg = page.locator('.portfolio-modal__image').first();
    await expect(modalImg).toHaveAttribute('src', /\.webp$/);
    await expect(modalImg).toHaveAttribute('width', /.+/);
    await expect(modalImg).toHaveAttribute('height', /.+/);
  });

  test('about headshot uses measured widths', async ({ page }) => {
    await page.goto('/about/');
    const img = page.locator('.about-headshot img');
    const srcset = await img.getAttribute('srcset');
    const headshot = IMAGE_MANIFEST['/public/images/zee-headshot'];
    expect(srcset).toBe(headshot.srcset);
    await expect(img).toHaveAttribute('src', headshot.src);
    await expect(img).toHaveAttribute('width', String(headshot.width));
    await expect(img).toHaveAttribute('height', String(headshot.height));
  });
});
