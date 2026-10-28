import { test as base, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DemoPage } from '../pages/DemoPage';

type Fixtures = {
  loginPage: LoginPage;
  demoPage: DemoPage;
  /** Collects browser console errors; assert on it to catch silent front-end failures. */
  consoleErrors: string[];
};

export const test = base.extend<Fixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  demoPage: async ({ page }, use) => {
    await use(new DemoPage(page));
  },
  consoleErrors: async ({ page }, use) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text());
    });
    page.on('pageerror', (err) => errors.push(err.message));
    await use(errors);
  },
});

export { expect };
