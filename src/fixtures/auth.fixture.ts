import type { Page } from '@playwright/test';

import { requireAuthCredentials } from '../../config/environment-loader.js';
import { LoginPage } from '../pages/login.page.js';
import { logger } from '../utils/logger.js';

export async function ensureAuthenticated(page: Page): Promise<void> {
  await page.goto('/');
  if (page.url().includes('inventory.html')) return;

  const credentials = requireAuthCredentials();
  const loginPage = new LoginPage(page);
  logger.info('Creating authenticated browser session');
  await loginPage.login(credentials.username, credentials.password);
  await loginPage.expectLoginSucceeded();
}
