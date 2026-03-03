import { test, expect } from '@playwright/test';

test.describe('MaatWork Studio Master Audit', () => {
  test('Complete Founder Flow', async ({ page }) => {
    test.setTimeout(180000);
    console.log('--- MASTER AUDIT START ---');
    
    // 1. LOGIN
    await page.goto('http://localhost:3001/login', { waitUntil: 'networkidle' });
    if (page.url().includes('/login')) {
      console.log('Logging in...');
      await page.fill('#email', 'gio@maat.work');
      await page.fill('#password', 'any-password');
      await page.click('button:has-text("INGRESAR AL HUB")');
      await page.waitForURL('http://localhost:3001/', { timeout: 30000 });
      console.log('Login successful.');
    }

    // 2. DASHBOARD
    console.log('Auditing Dashboard...');
    await expect(page.locator('h1')).toContainText('Studio Dashboard');
    await expect(page.getByText('Ingresos Est. (MRR)')).toBeVisible();
    
    // 3. APPS LIST
    console.log('Navigating to Apps...');
    await page.goto('http://localhost:3001/apps');
    await expect(page.locator('h1')).toContainText('Centro de Control');
    await expect(page.getByRole('table')).toBeVisible();
    
    // 4. APP DETAIL & APP HUB
    console.log('Opening App Detail...');
    const gestionLink = page.getByRole('link', { name: 'Gestionar' }).first();
    await gestionLink.click();
    await page.waitForURL(/\/apps\//);
    
    console.log('Checking App Hub & Integrations...');
    await expect(page.getByText('App Hub')).toBeVisible({ timeout: 20000 });
    await expect(page.getByText('Repositorio GitHub')).toBeVisible();
    await expect(page.getByText('Despliegue Vercel')).toBeVisible();
    await expect(page.getByText('Neon Database')).toBeVisible();
    
    // 5. VERIFY NEON LINK
    console.log('Verifying Link Form Fields...');
    await expect(page.getByLabel('GitHub Repo')).toBeAttached();
    await expect(page.getByLabel('Neon Database URL')).toBeAttached();
    
    console.log('--- MASTER AUDIT COMPLETE ---');
  });
});
