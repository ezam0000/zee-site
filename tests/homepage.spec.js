import { test, expect } from '@playwright/test';

test.describe('Zee Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForLoadState('networkidle');
  });

  test('should load the homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Zee/);
  });

  test('should display hero section', async ({ page }) => {
    const headline = page.locator('.headline');
    await expect(headline).toBeVisible();
    await expect(headline).toContainText('Design for things');
  });

  test('should list selected clients', async ({ page }) => {
    const clientGrid = page.locator('#client-grid');
    await expect(clientGrid).toBeVisible();

    const items = page.locator('#client-grid li');
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display featured work section', async ({ page }) => {
    const featuredSec = page.locator('.featured-sec');
    await expect(featuredSec).toBeVisible();

    const tiles = page.locator('.featured-tile');
    const count = await tiles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display information section', async ({ page }) => {
    const infoSec = page.locator('.info-sec');
    await expect(infoSec).toBeVisible();
    await expect(infoSec).toContainText('Senior designer');
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
        // Ignore browser extension errors and favicon
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
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('.headline')).toBeVisible();
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    await expect(page.locator('.headline')).toBeVisible();
  });
});