import { expect, type Locator, type Page } from '@playwright/test';

import { BasePage } from './base.page.js';

export interface CheckoutCustomer {
  firstName: string;
  lastName: string;
  postalCode: string;
}

export class CheckoutPage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.errorMessage = page.getByTestId('error');
  }

  async enterCustomer(customer: CheckoutCustomer): Promise<void> {
    await this.firstNameInput.fill(customer.firstName);
    await this.lastNameInput.fill(customer.lastName);
    await this.postalCodeInput.fill(customer.postalCode);
  }

  async continue(): Promise<void> {
    await this.clickWhenReady(this.continueButton);
  }

  async expectValidation(message: string | RegExp): Promise<void> {
    await expect(this.errorMessage).toContainText(message);
  }

  async itemTotal(): Promise<number> {
    const text = await this.page.getByTestId('subtotal-label').textContent();
    return Number(text?.match(/[\d.]+/)?.[0] ?? Number.NaN);
  }

  async tax(): Promise<number> {
    const text = await this.page.getByTestId('tax-label').textContent();
    return Number(text?.match(/[\d.]+/)?.[0] ?? Number.NaN);
  }

  async total(): Promise<number> {
    const text = await this.page.getByTestId('total-label').textContent();
    return Number(text?.match(/[\d.]+/)?.[0] ?? Number.NaN);
  }

  async finish(): Promise<void> {
    await this.clickWhenReady(this.finishButton);
    await expect(this.page).toHaveURL(/checkout-complete\.html/);
  }

  async expectOrderComplete(): Promise<void> {
    await expect(
      this.page.getByRole('heading', { name: 'Thank you for your order!' }),
    ).toBeVisible();
  }
}
