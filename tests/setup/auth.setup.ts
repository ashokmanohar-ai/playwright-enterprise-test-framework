import { mkdir, writeFile } from 'node:fs/promises';

import { test as setup } from '@playwright/test';

import { getEnvironmentConfig } from '../../config/environment-loader.js';
import { LoginPage } from '../../src/pages/login.page.js';

const authFile = 'auth/user.json';

setup('create reusable authenticated session', async ({ page }) => {
  const env = getEnvironmentConfig();
  await mkdir('auth', { recursive: true });

  // Conditional setup is intentional: API-only consumers receive a valid anonymous state.
  // eslint-disable-next-line playwright/no-conditional-in-test
  if (!env.username || !env.password) {
    await writeFile(authFile, JSON.stringify({ cookies: [], origins: [] }), 'utf8');
    setup.skip(
      true,
      'TEST_USERNAME and TEST_PASSWORD are not set; anonymous state was created for non-authenticated scenarios.',
    );
  }

  const loginPage = new LoginPage(page);
  await loginPage.open();
  await loginPage.login(env.username as string, env.password as string);
  await loginPage.expectLoginSucceeded();
  await page.context().storageState({ path: authFile });
});
