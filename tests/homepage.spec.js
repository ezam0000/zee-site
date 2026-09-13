import { test, expect } from '@playwright/test';

test.describe('Zee Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Zee/);
  });

  test('should display hero section', async ({ page }) => {
    const headline = page.locator('.headline');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Design for');
  });

  test('should display portfolio navigation links', async ({ page }) => {
    const links = page.locator('.hero-portfolio-links .hero-portfolio-link');
    await expect(links).toHaveCount(4);
    await expect(page.getByRole('link', { name: 'branding' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'packaging' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'experience' })).toBeVisible();
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
