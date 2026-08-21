import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { expectApiSuccess } from '../../../src/assertions/custom-assertions.js';

test.describe('Posts CRUD contract', () => {
  test('posts can be filtered by user @api @regression', async ({ api }) => {
    const result = await api.posts.getAll({ userId: 1 });
    expectApiSuccess(result.response);
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.every((post) => post.userId === 1)).toBe(true);
  });

  test('a post can be created @api @regression @critical', async ({ api, data }) => {
    const draft = data.post();
    const result = await api.posts.create(draft);
    expectApiSuccess(result.response, 201);
    expect(result.data).toMatchObject(draft);
    expect(result.data.id).toBeGreaterThan(0);
  });

  test('a post can be replaced @api @regression', async ({ api, data }) => {
    const replacement = data.post({ userId: 2 });
    const result = await api.posts.replace(1, replacement);
    expectApiSuccess(result.response);
    expect(result.data).toMatchObject({ ...replacement, id: 1 });
  });

  test('a post can be partially updated @api @regression', async ({ api }) => {
    const result = await api.posts.update(1, { title: 'Updated by contract test' });
    expectApiSuccess(result.response);
    expect(result.data.title).toBe('Updated by contract test');
    expect(result.data.id).toBe(1);
  });

  test('a post can be deleted @api @regression', async ({ api }) => {
    const result = await api.posts.delete(1);
    expectApiSuccess(result.response);
    expect(result.data).toEqual({});
  });
});
