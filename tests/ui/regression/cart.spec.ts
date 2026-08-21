import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { products } from '../../../src/data/test-data.js';

test.describe('Shopping cart', () => {
  test('selected product persists when cart is opened @regression', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.boltShirt);
    await productsPage.openCart();
    await cartPage.expectItem(products.boltShirt);
  });

  test('newly selected product has quantity one @regression', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.backpack);
    await productsPage.openCart();
    expect(await cartPage.quantityFor(products.backpack)).toBe(1);
  });

  test('customer can remove one item while retaining another @regression', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.backpack);
    await productsPage.addProductToCart(products.bikeLight);
    await productsPage.openCart();
    await cartPage.removeItem(products.backpack);
    await expect(cartPage.item(products.backpack)).toHaveCount(0);
    await cartPage.expectItem(products.bikeLight);
  });

  test('customer can return to shopping from the cart @regression', async ({ cartPage, page }) => {
    await cartPage.open();
    await cartPage.continueShoppingButton.click();
    await expect(page).toHaveURL(/inventory\.html/);
  });
});
