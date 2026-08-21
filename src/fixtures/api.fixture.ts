import type { APIRequestContext } from '@playwright/test';

import { PostsApiClient } from '../api/clients/posts.api-client.js';
import { TodosApiClient } from '../api/clients/todos.api-client.js';
import { UsersApiClient } from '../api/clients/users.api-client.js';

export interface ApiClients {
  posts: PostsApiClient;
  users: UsersApiClient;
  todos: TodosApiClient;
}

export function createApiClients(request: APIRequestContext): ApiClients {
  return {
    posts: new PostsApiClient(request),
    users: new UsersApiClient(request),
    todos: new TodosApiClient(request),
  };
}
