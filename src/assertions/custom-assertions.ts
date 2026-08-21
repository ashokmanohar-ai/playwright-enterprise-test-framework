import { expect, type APIResponse, type Locator } from '@playwright/test';
import type { ZodType } from 'zod';

export function expectApiSuccess(response: APIResponse, expectedStatus = 200): void {
  expect(response.status(), `Unexpected status for ${response.url()}`).toBe(expectedStatus);
  expect(response.ok(), `API request failed: ${response.status()} ${response.statusText()}`).toBe(
    true,
  );
}

export async function expectVisibleAndEnabled(locator: Locator): Promise<void> {
  await expect(locator).toBeVisible();
  await expect(locator).toBeEnabled();
}

export function expectResponseSchema<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body);
  expect(result.success, result.error?.message ?? 'Response schema validation failed').toBe(true);
  if (!result.success) throw result.error;
  return result.data;
}
