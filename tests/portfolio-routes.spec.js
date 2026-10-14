import { test, expect } from '@playwright/test';

test.describe('Project routes', () => {
  test('direct project load opens the gallery with its own metadata', async ({ page }) => {
    const response = await page.goto('/work/pixlz/');
    expect(response.status()).toBe(200);
    await expect(page).toHaveTitle('Pixlz');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://zee-studio.com/work/pixlz/');
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/public\/images\/share\/pixlz-.*\.jpg$/);
    await expect(page.locator('#portfolio-modal')).toHaveJSProperty('open', true);
    await expect(page.locator('#portfolio-modal-title')).toHaveText('Pixlz');
    await expect(page.locator('.portfolio-modal__image').first()).toBeVisible();
  });

  test('closing a direct visit returns to Work and focuses the card', async ({ page }) => {
    await page.goto('/work/design-toolbox/');
    await page.keyboard.press('Escape');
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page).toHaveTitle('Work — Zee Pauli');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', 'Work — Zee Pauli');
    await expect(page.locator('a[data-project-slug="design-toolbox"]')).toBeFocused();
  });

  test('card click pushes a canonical URL and ignores modified clicks', async ({ page }) => {
    await page.goto('/work/');
    const prevented = await page.locator('a[data-project-slug="pr-kits"]').evaluate((anchor) => {
      const event = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        metaKey: true,
        button: 0,
      });
      anchor.dispatchEvent(event);
      return event.defaultPrevented;
    });
    expect(prevented).toBe(false);
    await page.waitForTimeout(300);
    await page.goto('/work/');
    await page.locator('a[data-project-slug="pr-kits"]').click();
    await expect(page).toHaveURL(/\/work\/pr-kits\/?$/);
    await expect(page.locator('dialog[open]')).toHaveCount(1);
  });

  test('back and forward keep a single dialog in sync', async ({ page }) => {
    await page.goto('/work/');
    await page.locator('a[data-project-slug="pixlz"]').click();
    await page.locator('.portfolio-modal__close').click();
    await expect(page).toHaveURL(/\/work\/?$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/work\/pixlz\/?$/);
    await expect(page.locator('dialog[open]')).toHaveCount(1);
    await expect(page).toHaveTitle('Pixlz');
    await page.goForward();
    await expect(page).toHaveURL(/\/work\/?$/);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    await expect(page).toHaveTitle('Work — Zee Pauli');
  });

  test('unknown project paths 404 and unknown hashes stay on the grid', async ({ page }) => {
    const missing = await page.goto('/work/not-a-project/');
    expect(missing.status()).toBe(404);

    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto('/work/#not-a-project');
    await expect(page.locator('#portfolio-stack a.portfolio-tile')).toHaveCount(6);
    await expect(page.locator('dialog[open]')).toHaveCount(0);
    expect(errors).toEqual([]);
  });

  test('project copy is readable without JavaScript', async ({ browser }) => {
    const context = await browser.newContext({ javaScriptEnabled: false });
    const page = await context.newPage();
    await page.goto('/work/pixlz/');
    await expect(page.locator('#project-fallback')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pixlz' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/work/');
    const image = page.locator('.portfolio-modal__image').first();
    await expect(image).toBeVisible();
    await expect(image).not.toHaveClass(/img-reveal/);
    await context.close();
  });

  test('phone and desktop widths do not overflow the work page', async ({ page }) => {
    for (const viewport of [
      { width: 375, height: 667 },
      { width: 390, height: 844 },
      { width: 430, height: 932 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
    ]) {
      await page.setViewportSize(viewport);
      await page.goto('/work/');
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
      expect(overflow).toBe(false);
    }
  });
});
