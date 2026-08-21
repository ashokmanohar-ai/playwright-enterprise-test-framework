import type { APIRequestContext } from '@playwright/test';

import type { Todo } from '../models/todo.model.js';
import { todoSchema, todosSchema } from '../schemas/todo.schema.js';
import { BaseApiClient, type ApiResult } from './base.api-client.js';

export class TodosApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'todos');
  }

  async getAll(query: { userId?: number; completed?: boolean } = {}): Promise<ApiResult<Todo[]>> {
    const params = Object.fromEntries(
      Object.entries(query).map(([key, value]) => [key, String(value)]),
    );
    const result = await this.send<unknown>('GET', '/todos', { params });
    return { ...result, data: todosSchema.parse(result.data) };
  }

  async getById(id: number): Promise<ApiResult<Todo>> {
    const result = await this.send<unknown>('GET', `/todos/${id}`);
    return { ...result, data: todoSchema.parse(result.data) };
  }
}
