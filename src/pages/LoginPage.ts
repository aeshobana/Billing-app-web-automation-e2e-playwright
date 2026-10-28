import { expect, type Locator, type Page } from '@playwright/test';

/** Page object for /auth/login. Uses the app's own data-testid hooks. */
export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly emailError: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;
  readonly tryDemoButton: Locator;
  readonly passwordVisibilityToggle: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByTestId('email-input');
    this.passwordInput = page.getByTestId('password-input');
    this.loginButton = page.getByTestId('login-button');
    this.emailError = page.getByTestId('email-error');
    this.forgotPasswordLink = page.getByTestId('forgot-password-link');
    this.registerLink = page.getByTestId('register-link');
    this.tryDemoButton = page.getByRole('button', { name: /try demo account/i });
    this.passwordVisibilityToggle = page.getByRole('button', { name: /visibility/i });
  }

  async goto(): Promise<void> {
    await this.page.goto('/auth/login');
    await expect(this.emailInput).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/auth\/login/);
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }
}
