import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { products } from '../../../src/data/test-data.js';

test.describe('Critical customer journey', () => {
  test('authenticated customer can view the product catalogue @smoke @critical', async ({
    productsPage,
  }) => {
    await productsPage.open();
    await expect(productsPage.inventoryItems).toHaveCount(6);
  });

  test('authenticated customer can add a product to the cart @smoke @critical', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.backpack);
    await expect(productsPage.cartBadge).toHaveText('1');
    await productsPage.openCart();
    await cartPage.expectItem(products.backpack);
  });

  test('authenticated customer can remove a product from the cart @smoke', async ({
    productsPage,
    cartPage,
  }) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.bikeLight);
    await productsPage.openCart();
    await cartPage.removeItem(products.bikeLight);
    await expect(cartPage.item(products.bikeLight)).toHaveCount(0);
  });

  test('authenticated customer can complete checkout successfully @smoke @critical', async ({
    productsPage,
    cartPage,
    checkoutPage,
    data,
  }) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.backpack);
    await productsPage.openCart();
    await cartPage.startCheckout();
    await checkoutPage.enterCustomer(data.checkoutCustomer());
    await checkoutPage.continue();
    await checkoutPage.finish();
    await checkoutPage.expectOrderComplete();
  });
});
