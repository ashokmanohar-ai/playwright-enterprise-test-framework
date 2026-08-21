import { expect, type Locator, type Page } from '@playwright/test';

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async navigate(path = '/'): Promise<void> {
    await this.page.goto(path, { waitUntil: 'domcontentloaded' });
    await this.waitForPageReady();
  }

  async waitForPageReady(): Promise<void> {
    await this.page.locator('body').waitFor({ state: 'visible' });
  }

  async expectHeading(name: string | RegExp): Promise<void> {
    await expect(this.page.getByRole('heading', { name })).toBeVisible();
  }

  protected async clickWhenReady(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
    await expect(locator).toBeEnabled();
    await locator.click();
  }
}
