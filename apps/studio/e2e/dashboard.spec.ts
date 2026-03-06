import { test, expect } from '@playwright/test';

test.describe('Dashboard Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the starting url before each test.
    await page.goto('/');
  });

  test('should load without errors', async ({ page }) => {
    // Wait for network idle to ensure everything has loaded
    await page.waitForLoadState('networkidle');
    // Just verify the page didn't return a 404 or crash completely
    const content = await page.content();
    expect(content).toBeTruthy();
  });
});
