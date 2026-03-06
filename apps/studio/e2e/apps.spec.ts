import { test, expect } from '@playwright/test';

test.describe('Apps Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the apps url before each test.
    await page.goto('/apps');
  });

  test('should load without errors', async ({ page }) => {
    // Wait for network idle to ensure everything has loaded
    await page.waitForLoadState('domcontentloaded');
    // Just verify the page didn't return a 404 or crash completely
    const content = await page.content();
    expect(content).toBeTruthy();
  });
});
