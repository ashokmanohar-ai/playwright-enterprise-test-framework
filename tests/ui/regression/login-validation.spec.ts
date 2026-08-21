import users from '../../../src/data/users.json' with { type: 'json' };
import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { LoginPage } from '../../../src/pages/login.page.js';

test.describe('Login validation', () => {
  for (const user of users.invalidUsers) {
    test(`${user.description} displays a useful error @regression`, async ({ browser }) => {
      const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
      const page = await context.newPage();
      const loginPage = new LoginPage(page);

      await loginPage.open();
      await loginPage.login(user.username, user.password);
      await loginPage.expectError(user.expected);

      await context.close();
    });
  }

  test('login controls are visible and usable @regression', async ({ browser }) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    const loginPage = new LoginPage(page);

    await loginPage.open();
    await expect(loginPage.usernameInput).toBeEditable();
    await expect(loginPage.passwordInput).toBeEditable();
    await expect(loginPage.loginButton).toBeEnabled();

    await context.close();
  });
});
