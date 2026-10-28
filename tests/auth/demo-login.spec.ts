import { test, expect } from '../../src/fixtures/test';
import { demoRoles, verticals } from '../../src/data/demoRoles';

/**
 * Known defect: demo login returns HTTP 401 ("Login failed. Please try again.")
 * on staging as of 2026-10-28. Tracked as QA-101.
 *
 * Tests below are marked test.fail() so CI stays green while the bug is open.
 * When the fix ships, Playwright reports them as "unexpectedly passed",
 * which tells us to remove the marker. Set KNOWN_BUGS=off to run them as normal tests.
 */
const QA_101_OPEN = process.env.KNOWN_BUGS !== 'off';

test.describe('Demo accounts page', { tag: ['@smoke', '@demo'] }, () => {
  test.beforeEach(async ({ demoPage }) => {
    await demoPage.goto();
  });

  test('is reachable from the login page', async ({ page, loginPage }) => {
    await loginPage.goto();
    await loginPage.tryDemoButton.click();
    await expect(page).toHaveURL(/\/auth\/demo/);
  });

  test('lists every vertical', async ({ demoPage }) => {
    for (const vertical of verticals) {
      await expect(demoPage.verticalHeading(vertical)).toBeVisible();
    }
  });

  test(`offers a login button for all ${demoRoles.length} roles`, async ({ demoPage }) => {
    for (const { name } of demoRoles) {
      await expect(demoPage.loginAsButton(name)).toHaveCount(1);
    }
  });
});

test.describe('Demo login per role', { tag: ['@smoke', '@demo', '@known-bug'] }, () => {
  for (const role of demoRoles) {
    test(`${role.vertical} › ${role.name} lands in the app`, async ({ page, demoPage }) => {
      test.info().annotations.push({ type: 'issue', description: 'QA-101: demo login returns 401' });
      test.fail(QA_101_OPEN, 'QA-101 open: demo login returns 401');

      await demoPage.goto();
      const loginResponse = page.waitForResponse(
        (res) => res.url().includes('/api/') && res.request().method() === 'POST',
      );
      await demoPage.loginAs(role.name);

      expect((await loginResponse).status(), 'demo login API status').toBe(200);
      await expect(page).not.toHaveURL(/\/auth\//);
      await expect(page.getByText(/login failed/i)).toHaveCount(0);
    });
  }
});
