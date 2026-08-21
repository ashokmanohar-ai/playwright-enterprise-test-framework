import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { products } from '../../../src/data/test-data.js';

test.describe('Checkout validation and totals', () => {
  test.beforeEach(async ({ productsPage, cartPage }) => {
    await productsPage.open();
    await productsPage.addProductToCart(products.backpack);
    await productsPage.openCart();
    await cartPage.startCheckout();
  });

  const validationCases = [
    {
      name: 'missing first name',
      customer: { firstName: '', lastName: 'Engineer', postalCode: 'SW1A 1AA' },
      expected: 'First Name is required',
    },
    {
      name: 'missing last name',
      customer: { firstName: 'Quality', lastName: '', postalCode: 'SW1A 1AA' },
      expected: 'Last Name is required',
    },
    {
      name: 'missing postal code',
      customer: { firstName: 'Quality', lastName: 'Engineer', postalCode: '' },
      expected: 'Postal Code is required',
    },
  ];

  for (const validationCase of validationCases) {
    test(`${validationCase.name} blocks checkout @regression`, async ({ checkoutPage }) => {
      await checkoutPage.enterCustomer(validationCase.customer);
      await checkoutPage.continue();
      await checkoutPage.expectValidation(validationCase.expected);
    });
  }

  test('checkout total equals item total plus tax @regression @critical', async ({
    checkoutPage,
    data,
  }) => {
    await checkoutPage.enterCustomer(data.checkoutCustomer());
    await checkoutPage.continue();
    expect(await checkoutPage.total()).toBeCloseTo(
      (await checkoutPage.itemTotal()) + (await checkoutPage.tax()),
      2,
    );
  });
});
