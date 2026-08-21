import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { products } from '../../../src/data/test-data.js';

test.describe('Product catalogue', () => {
  test.beforeEach(async ({ productsPage }) => {
    await productsPage.open();
  });

  test('catalogue displays six independently actionable products @regression', async ({
    productsPage,
  }) => {
    await expect(productsPage.inventoryItems).toHaveCount(6);
    await expect(productsPage.inventoryNames).toHaveCount(6);
  });

  test('products can be sorted by name ascending @regression', async ({ productsPage }) => {
    await productsPage.sortBy('Name (A to Z)');
    const names = await productsPage.productNames();
    expect(names).toEqual([...names].sort((left, right) => left.localeCompare(right)));
  });

  test('products can be sorted by name descending @regression', async ({ productsPage }) => {
    await productsPage.sortBy('Name (Z to A)');
    const names = await productsPage.productNames();
    expect(names).toEqual([...names].sort((left, right) => right.localeCompare(left)));
  });

  test('products can be sorted by price ascending @regression', async ({ productsPage }) => {
    await productsPage.sortBy('Price (low to high)');
    const prices = await productsPage.productPrices();
    expect(prices).toEqual([...prices].sort((left, right) => left - right));
  });

  test('customer can open product details @regression', async ({ productsPage, page }) => {
    await productsPage.openProduct(products.backpack);
    await expect(page.getByRole('button', { name: 'Back to products' })).toBeVisible();
    await expect(page.getByTestId('inventory-item-name')).toHaveText(products.backpack);
  });

  test('cart badge reflects multiple selected products @regression', async ({ productsPage }) => {
    await productsPage.addProductToCart(products.backpack);
    await productsPage.addProductToCart(products.bikeLight);
    await expect(productsPage.cartBadge).toHaveText('2');
  });
});
