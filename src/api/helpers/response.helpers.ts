import { expect, type APIResponse } from '@playwright/test';

export function expectJsonResponse(response: APIResponse): void {
  expect(response.headers()['content-type']).toContain('application/json');
}

export function expectResponseWithin(durationMs: number, thresholdMs: number): void {
  expect(
    durationMs,
    `Expected API response within ${thresholdMs}ms but received it in ${durationMs}ms`,
  ).toBeLessThanOrEqual(thresholdMs);
}
