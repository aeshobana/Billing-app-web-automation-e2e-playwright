import { test, expect } from '../../src/fixtures/test';

const protectedRoutes = ['/dashboard'];

test.describe('Route guards (unauthenticated)', { tag: ['@smoke', '@security'] }, () => {
  for (const route of protectedRoutes) {
    test(`${route} redirects to login with returnUrl`, async ({ page }) => {
      await page.goto(route);

      await expect(page).toHaveURL(/\/auth\/login/);
      const returnUrl = new URL(page.url()).searchParams.get('returnUrl');
      expect(returnUrl).toBe(route);
    });
  }
});
