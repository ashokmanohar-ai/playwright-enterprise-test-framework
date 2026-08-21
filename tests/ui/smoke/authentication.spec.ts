import { requireAuthCredentials } from '../../../config/environment-loader.js';
import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { LoginPage } from '../../../src/pages/login.page.js';

test.describe('Authentication smoke', () => {
  test('valid user can sign in @smoke @critical', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const credentials = requireAuthCredentials();

    await loginPage.open();
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.expectLoginSucceeded();

    await context.close();
  });

  test('authenticated user can sign out @smoke @critical', async ({ productsPage, page }) => {
    await productsPage.open();
    await productsPage.logout();
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });
});
