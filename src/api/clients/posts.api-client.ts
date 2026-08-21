import type { APIRequestContext } from '@playwright/test';

import type { NewPost, Post } from '../models/post.model.js';
import { postSchema, postsSchema } from '../schemas/post.schema.js';
import { BaseApiClient, type ApiResult } from './base.api-client.js';

export class PostsApiClient extends BaseApiClient {
  constructor(request: APIRequestContext) {
    super(request, 'posts');
  }

  async getAll(query: { userId?: number } = {}): Promise<ApiResult<Post[]>> {
    const result = await this.send<unknown>('GET', '/posts', { params: query });
    return { ...result, data: postsSchema.parse(result.data) };
  }

  async getById(id: number): Promise<ApiResult<Post>> {
    const result = await this.send<unknown>('GET', `/posts/${id}`);
    return { ...result, data: postSchema.parse(result.data) };
  }

  async create(post: NewPost): Promise<ApiResult<Post>> {
    const result = await this.send<unknown>('POST', '/posts', { data: post });
    return { ...result, data: postSchema.parse(result.data) };
  }

  async replace(id: number, post: NewPost): Promise<ApiResult<Post>> {
    const result = await this.send<unknown>('PUT', `/posts/${id}`, { data: post });
    return { ...result, data: postSchema.parse(result.data) };
  }

  async update(id: number, post: Partial<NewPost>): Promise<ApiResult<Partial<Post>>> {
    return this.send<Partial<Post>>('PATCH', `/posts/${id}`, { data: post });
  }

  async delete(id: number): Promise<ApiResult<Record<string, never>>> {
    return this.send<Record<string, never>>('DELETE', `/posts/${id}`);
  }
}
