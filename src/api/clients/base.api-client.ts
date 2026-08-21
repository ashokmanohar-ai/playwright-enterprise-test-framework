import type { APIRequestContext, APIResponse } from '@playwright/test';

import { logger } from '../../utils/logger.js';

export interface ApiResult<T> {
  response: APIResponse;
  data: T;
  durationMs: number;
}

type ApiRequestOptions = NonNullable<Parameters<APIRequestContext['fetch']>[1]>;

export abstract class BaseApiClient {
  protected constructor(
    protected readonly request: APIRequestContext,
    protected readonly resourceName: string,
  ) {}

  protected async send<T>(
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
    path: string,
    options: ApiRequestOptions = {},
  ): Promise<ApiResult<T>> {
    const startedAt = performance.now();
    logger.debug({ method, path, resource: this.resourceName }, 'API request started');

    const response = await this.request.fetch(path, { ...options, method });
    const durationMs = Math.round(performance.now() - startedAt);
    const requestId = response.headers()['x-request-id'] ?? response.headers()['cf-ray'];

    logger.info(
      {
        method,
        path,
        status: response.status(),
        durationMs,
        ...(requestId ? { requestId } : {}),
      },
      'API response received',
    );

    let data: T;
    try {
      data = (await response.json()) as T;
    } catch (error) {
      if (method === 'DELETE' && response.ok()) {
        data = {} as T;
      } else {
        throw new Error(
          `Unable to parse ${method} ${path} response as JSON (status ${response.status()}).`,
          { cause: error },
        );
      }
    }

    return { response, data, durationMs };
  }
}
