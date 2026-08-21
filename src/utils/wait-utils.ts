import type { Locator, Page } from '@playwright/test';

export async function waitForVisible(locator: Locator): Promise<void> {
  await locator.waitFor({ state: 'visible' });
}

export async function waitForResponse(
  page: Page,
  url: string | RegExp,
  action: () => Promise<void>,
): Promise<void> {
  await Promise.all([
    page.waitForResponse((response) =>
      typeof url === 'string' ? response.url().includes(url) : url.test(response.url()),
    ),
    action(),
  ]);
}
