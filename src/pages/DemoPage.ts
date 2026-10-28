import { expect, type Locator, type Page } from '@playwright/test';

/** Page object for /auth/demo (one-click demo accounts per role). */
export class DemoPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly goToLoginButton: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Try Demo Account' });
    this.goToLoginButton = page.getByRole('button', { name: /go to login/i });
    this.createAccountButton = page.getByRole('button', { name: /create your own account/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/demo');
    await expect(this.heading).toBeVisible();
  }

  loginAsButton(role: string): Locator {
    return this.page.getByRole('button', { name: new RegExp(`Login as ${role}$`) });
  }

  verticalHeading(vertical: string): Locator {
    return this.page.getByRole('heading', { name: vertical, exact: true });
  }

  async loginAs(role: string): Promise<void> {
    const button = this.loginAsButton(role);
    await button.scrollIntoViewIfNeeded();
    await button.click();
  }
}
