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
    await expect(headline).toContainText('We design for');
  });

  test('should load client logos', async ({ page }) => {
    const clientGrid = page.locator('#client-grid');
    await expect(clientGrid).toBeVisible();
    
    // Check for at least some client logos
    const logos = page.locator('#client-grid img');
    const count = await logos.count();
    expect(count).toBeGreaterThan(0);
  });

  test('should display capabilities section', async ({ page }) => {
    const capabilitiesSec = page.locator('.capabilities-sec');
    await expect(capabilitiesSec).toBeVisible();
    
    const tile = page.locator('.capability-tile');
    await expect(tile).toBeVisible();
  });

  test('should display capability details', async ({ page }) => {
    const tile = page.locator('.capability-tile');
    await expect(tile).toBeVisible();
    await expect(tile).toContainText('data-driven design');
    await expect(tile).toContainText('web and print');
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