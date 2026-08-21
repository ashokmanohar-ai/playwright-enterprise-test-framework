import { test as base, type Page } from '@playwright/test';

import { getApiBaseUrl } from '../../config/environment-loader.js';
import type { ApiClients } from './api.fixture.js';
import { createApiClients } from './api.fixture.js';
import { ensureAuthenticated } from './auth.fixture.js';
import { dataFactory, type DataFactory } from './data.fixture.js';
import { CartPage } from '../pages/cart.page.js';
import { CheckoutPage } from '../pages/checkout.page.js';
import { LoginPage } from '../pages/login.page.js';
import { ProductsPage } from '../pages/products.page.js';

interface FrameworkFixtures {
  authenticatedPage: Page;
  loginPage: LoginPage;
  productsPage: ProductsPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  api: ApiClients;
  data: DataFactory;
}

export const test = base.extend<FrameworkFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await ensureAuthenticated(page);
    await use(page);
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productsPage: async ({ authenticatedPage }, use) => {
    await use(new ProductsPage(authenticatedPage));
  },
  cartPage: async ({ authenticatedPage }, use) => {
    await use(new CartPage(authenticatedPage));
  },
  checkoutPage: async ({ authenticatedPage }, use) => {
    await use(new CheckoutPage(authenticatedPage));
  },
  api: async ({ playwright }, use) => {
    const apiContext = await playwright.request.newContext({ baseURL: getApiBaseUrl() });
    await use(createApiClients(apiContext));
    await apiContext.dispose();
  },
  // Playwright requires an object destructuring pattern for fixture dependencies.
  // eslint-disable-next-line no-empty-pattern
  data: async ({}, use) => {
    await use(dataFactory);
  },
});

export { expect } from '@playwright/test';
