import { test as setup, expect } from '@playwright/test';
import { LoginPage } from '../src/pages/LoginPage';
import { env, STORAGE_STATE } from '../src/config/env';

/**
 * Logs in once and stores the session so authenticated specs skip the login UI.
 * Skipped (not failed) when no test account is configured in .env / CI secrets.
 */
setup('authenticate test user', async ({ page }) => {
  setup.skip(!env.hasCredentials, 'LKG_EMAIL / LKG_PASSWORD not set');

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(env.user.email, env.user.password);

  await expect(page).not.toHaveURL(/\/auth\/login/);
  await page.context().storageState({ path: STORAGE_STATE });
});
