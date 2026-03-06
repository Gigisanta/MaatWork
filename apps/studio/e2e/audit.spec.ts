import { test, expect } from '@playwright/test';

test.describe('MaatWork Studio Master Audit', () => {
  test('Complete Founder Flow', async ({ page }) => {
    // 1. Initial Login
    await page.goto('/login');
    await expect(page.locator('.text-3xl:has-text("MaatWork Hub")')).toBeVisible();

    // Fill form partly to verify form fields exist
    await page.locator('input[type="email"]').fill('tu@maat.work');
    await page.locator('input[type="password"]').fill('test-clinic');
  });
});
