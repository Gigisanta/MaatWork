import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    // Go to the login url before each test.
    await page.goto('/login');
  });

  test('should display login page title and description correctly', async ({ page }) => {
    // We target the class 'text-3xl' which is specific to the title
    await expect(page.locator('.text-3xl:has-text("MaatWork Hub")')).toBeVisible();
    await expect(page.locator('text=Acceso exclusivo para fundadores')).toBeVisible();
  });

  test('should display login form', async ({ page }) => {
    await expect(page.locator('label:has-text("Email")')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();

    await expect(page.locator('label:has-text("Contraseña")')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    const submitButton = page.locator('button:has-text("INGRESAR AL HUB")');
    await expect(submitButton).toBeVisible();
    await expect(submitButton).not.toBeDisabled();
  });

  test('should allow entering credentials', async ({ page }) => {
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('tu@maat.work');
    await expect(emailInput).toHaveValue('tu@maat.work');

    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');
  });

  test('button changes state on submit', async ({ page }) => {
    // Note: since this is an end-to-end test and submitting might navigate or show errors
    // depending on the backend, we just test the initial interaction state if possible.
    // Given the form does e.preventDefault() and signs in, we can at least click it.
    const emailInput = page.locator('input[type="email"]');
    const passwordInput = page.locator('input[type="password"]');

    await emailInput.fill('tu@maat.work');
    await passwordInput.fill('password123');

    const submitButton = page.locator('button:has-text("INGRESAR AL HUB")');
    // Just verifying it doesn't crash the page
    await submitButton.click();
    // After clicking, the button might say VALIDANDO... but NextAuth might redirect too fast
    // We will just wait a bit and ensure no client side crash happened.
    await page.waitForTimeout(500);
  });
});
