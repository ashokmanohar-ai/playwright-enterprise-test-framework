import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { scanAccessibility } from '../../../src/accessibility/accessibility-scanner.js';
import { LoginPage } from '../../../src/pages/login.page.js';
import { products } from '../../../src/data/test-data.js';

test.describe('Critical-page accessibility', () => {
  test('login page has no critical or serious automated violations @accessibility', async ({
    browser,
  }, testInfo) => {
    const context = await browser.newContext({ storageState: { cookies: [], origins: [] } });
    const page = await context.newPage();
    await new LoginPage(page).open();
    const violations = await scanAccessibility(page, testInfo, { name: 'login-page' });
    expect(violations).toBe(0);
    await context.close();
  });

  test('product catalogue has no critical or serious automated violations @accessibility', async ({
    productsPage,
    page,
  }, testInfo) => {
    await productsPage.open();
    const violations = await scanAccessibility(page, testInfo, { name: 'product-catalogue' });
    expect(violations).toBe(0);
  });

  test('shopping cart has no critical or serious automated violations @accessibility', async ({
    productsPage,
    page,
  }, testInfo) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.backpack);
    await productsPage.openCart();
    const violations = await scanAccessibility(page, testInfo, { name: 'shopping-cart' });
    expect(violations).toBe(0);
  });
});
