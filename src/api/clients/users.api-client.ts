import type { APIRequestContext } from '@playwright/test';

import type { ApiUser } from '../models/user.model.js';
import { userSchema, usersSchema } from '../schemas/user.schema.js';
import { BaseApiClient, type ApiResult } from './base.api-client.js';

export class UsersApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'users');
  }

  async getAll(): Promise<ApiResult<ApiUser[]>> {
    const result = await this.send<unknown>('GET', '/users');
    return { ...result, data: usersSchema.parse(result.data) };
  }

  async getById(id: number): Promise<ApiResult<ApiUser>> {
    const result = await this.send<unknown>('GET', `/users/${id}`);
    return { ...result, data: userSchema.parse(result.data) };
  }
}
