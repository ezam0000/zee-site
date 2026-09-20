import { test, expect } from '@playwright/test';

test.describe('Zee Homepage', () => {
  test.beforeEach(async ({ page }) => {
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
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('NumberOfInputEventTimestampsToTrack') &&
            !text.includes('Extension') &&
            !text.includes('content_script') &&
            !text.includes('favicon.ico')) {
          errors.push(text);
        }
      }
    });

    await page.waitForTimeout(2000);
    expect(errors.length).toBe(0);
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
    await expect(page).toHaveTitle('Work');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Work');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://zee-studio.com/work/'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://zee-studio.com/work/'
    );
  });
});

test.describe('Mobile targets and work deep links', () => {
  test('mobile social links meet 44px targets', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    const link = page.locator('.nav-social__link').first();
    const box = await link.boundingBox();
    expect(box).not.toBeNull();
    expect(box.width).toBeGreaterThanOrEqual(44);
    expect(box.height).toBeGreaterThanOrEqual(44);
  });

  test('work hash opens the project and updates the tab title', async ({ page }) => {
    await page.goto('/work/#pixlz');
    await expect(page.locator('.portfolio-modal')).toHaveClass(/is-open/);
    await expect(page).toHaveTitle('Pixlz');
    await expect(page).toHaveURL(/#pixlz$/);

    await page.keyboard.press('Escape');
    await expect(page.locator('.portfolio-modal')).not.toHaveClass(/is-open/);
    await expect(page).toHaveTitle('Work');
    await expect(page).toHaveURL(/\/work\/?$/);
  });

  test('work and about links navigate from the homepage', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'work' }).click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page).toHaveTitle('Work');

    await page.goto('/');
    await page.getByRole('link', { name: 'about' }).click();
    await expect(page).toHaveURL(/\/about\/?$/);
    await expect(page).toHaveTitle('About');
  });

  test('work tiles and modal gallery use sized webp sources', async ({ page }) => {
    await page.goto('/work/');
    const tileImg = page.locator('.portfolio-tile img').first();
    await expect(tileImg).toHaveAttribute('src', /\.webp$/);
    await expect(tileImg).toHaveAttribute('srcset', /720w/);
    await expect(tileImg).toHaveAttribute('srcset', /1400w/);

    await page.locator('.portfolio-tile').first().click();
    await expect(page.locator('.portfolio-modal')).toHaveClass(/is-open/);
    const modalImg = page.locator('.portfolio-modal__image').first();
    await expect(modalImg).toHaveAttribute('src', /\.webp$/);
    await expect(modalImg).toHaveAttribute('srcset', /1400w/);
  });

  test('about headshot uses sized webp', async ({ page }) => {
    await page.goto('/about/');
    const img = page.locator('.about-headshot img');
    await expect(img).toHaveAttribute('src', /zee-headshot-720\.webp$/);
    await expect(img).toHaveAttribute('srcset', /1400w/);
  });
});
