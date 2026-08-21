import { randomUUID } from 'node:crypto';

import type { NewPost } from '../../api/models/post.model.js';

export function createPost(overrides: Partial<NewPost> = {}): NewPost {
  const id = randomUUID().slice(0, 8);
  return {
    userId: 1,
    title: `Automated quality post ${id}`,
    body: 'Generated independently for an isolated API test.',
    ...overrides,
  };
}
