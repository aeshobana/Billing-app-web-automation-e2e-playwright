import { test, expect } from '../../src/fixtures/test';

test.describe('Login page', { tag: ['@smoke', '@auth'] }, () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('renders all login controls', { tag: '@mobile' }, async ({ loginPage }) => {
    await loginPage.expectLoaded();
    await expect(loginPage.forgotPasswordLink).toBeVisible();
    await expect(loginPage.registerLink).toBeVisible();
    await expect(loginPage.tryDemoButton).toBeVisible();
  });

  test('email and password fields have correct input types', async ({ loginPage }) => {
    await expect(loginPage.emailInput).toHaveAttribute('type', 'email');
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows validation error for malformed email and blocks submit', async ({ loginPage }) => {
    await loginPage.emailInput.fill('not-an-email');
    await loginPage.passwordInput.click(); // blur the email field

    await expect(loginPage.emailError).toHaveText('Please enter a valid email');
    await expect(loginPage.loginButton).toBeDisabled();
  });

  test('password visibility toggle reveals the password', async ({ loginPage }) => {
    await loginPage.passwordInput.fill('Secret123!');
    await loginPage.passwordVisibilityToggle.click();
    await expect(loginPage.passwordInput).toHaveAttribute('type', 'text');
  });

  test('rejects unknown credentials and stays on login', async ({ page, loginPage }) => {
    const unknownUser = `qa.nonexistent.${Date.now()}@example.com`;
    await loginPage.login(unknownUser, 'WrongPassword!123');

    await expect(page).toHaveURL(/\/auth\/login/);
    await expect(page.getByText(/failed|invalid|incorrect/i).first()).toBeVisible();
  });

  test('forgot password link opens reset page', async ({ page, loginPage }) => {
    await loginPage.forgotPasswordLink.click();
    await expect(page).toHaveURL(/\/auth\/reset-password/);
  });

  test('register link opens registration page', async ({ page, loginPage }) => {
    await loginPage.registerLink.click();
    await expect(page).toHaveURL(/\/auth\/register/);
  });

  test('loads without browser console errors', async ({ loginPage, consoleErrors }) => {
    await loginPage.expectLoaded();
    expect(consoleErrors, consoleErrors.join('\n')).toEqual([]);
  });
});
