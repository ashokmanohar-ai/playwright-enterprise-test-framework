import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page.js';

export class CartPage extends BasePage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartItems = page.getByTestId('inventory-item');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
  }

  async open(): Promise<void> {
    await this.navigate('/cart.html');
    await this.expectHeading('Your Cart');
  }

  item(name: string): Locator {
    return this.cartItems.filter({ hasText: name });
  }

  async expectItem(name: string): Promise<void> {
    await expect(this.item(name)).toHaveCount(1);
  }

  async removeItem(name: string): Promise<void> {
    await this.clickWhenReady(this.item(name).getByRole('button', { name: /remove/i }));
  }

  async quantityFor(name: string): Promise<number> {
    const value = await this.item(name).getByTestId('item-quantity').textContent();
    return Number(value);
  }

  async startCheckout(): Promise<void> {
    await this.clickWhenReady(this.checkoutButton);
    await expect(this.page).toHaveURL(/checkout-step-one\.html/);
  }
}
