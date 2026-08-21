import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page.js';

export class ProductsPage extends BasePage {
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly inventoryNames: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;
  readonly sortSelect: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    super(page);
    this.inventoryList = page.getByTestId('inventory-list');
    this.inventoryItems = page.getByTestId('inventory-item');
    this.inventoryNames = page.getByTestId('inventory-item-name');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.sortSelect = page.getByTestId('product-sort-container');
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
  }

  async open(): Promise<void> {
    await this.navigate('/inventory.html');
    await expect(this.inventoryList).toBeVisible();
  }

  productCard(name: string): Locator {
    return this.inventoryItems.filter({ hasText: name });
  }

  async addProductToCart(name: string): Promise<void> {
    const product = this.productCard(name);
    await expect(product).toHaveCount(1);
    await this.clickWhenReady(product.getByRole('button', { name: /add to cart/i }));
  }

  async removeProduct(name: string): Promise<void> {
    await this.clickWhenReady(this.productCard(name).getByRole('button', { name: /remove/i }));
  }

  async openProduct(name: string): Promise<void> {
    await this.productCard(name).getByTestId('inventory-item-name').click();
    await expect(this.page).toHaveURL(/inventory-item\.html/);
  }

  async sortBy(
    label: 'Name (A to Z)' | 'Name (Z to A)' | 'Price (low to high)' | 'Price (high to low)',
  ): Promise<void> {
    await this.sortSelect.selectOption({ label });
  }

  async productNames(): Promise<string[]> {
    return this.inventoryNames.allTextContents();
  }

  async productPrices(): Promise<number[]> {
    const values = await this.page.getByTestId('inventory-item-price').allTextContents();
    return values.map((value) => Number(value.replace('$', '')));
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
    await expect(this.page).toHaveURL(/cart\.html/);
  }

  async logout(): Promise<void> {
    await this.menuButton.click();
    await this.page.getByRole('link', { name: 'Logout' }).click();
    await expect(this.page).toHaveURL(/saucedemo\.com\/?$/);
  }
}
