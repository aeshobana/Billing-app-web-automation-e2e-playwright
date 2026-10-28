import { test, expect } from '../../src/fixtures/test';
import { env, STORAGE_STATE } from '../../src/config/env';

/** Authenticated checks. Run only when a test account is configured. */
test.describe('Dashboard (authenticated)', { tag: ['@smoke', '@dashboard'] }, () => {
  test.skip(!env.hasCredentials, 'LKG_EMAIL / LKG_PASSWORD not set');
  test.use({ storageState: STORAGE_STATE });

  test('opens directly with a saved session', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/dashboard/);
  });

  test('loads without browser console errors', async ({ page, consoleErrors }) => {
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
  });
});
