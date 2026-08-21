import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { expectResponseWithin } from '../../../src/api/helpers/response.helpers.js';

test.describe('API queries and boundaries', () => {
  test('completed todo filter returns only completed work @api @regression', async ({ api }) => {
    const result = await api.todos.getAll({ completed: true });
    expect(result.data.length).toBeGreaterThan(0);
    expect(result.data.every((todo) => todo.completed)).toBe(true);
  });

  test('unknown user filter returns an empty collection @api @regression', async ({ api }) => {
    const result = await api.posts.getAll({ userId: 9999 });
    expect(result.response.status()).toBe(200);
    expect(result.data).toEqual([]);
  });

  test('unknown resource returns 404 without hiding failure details @api @regression', async ({
    request,
  }) => {
    const response = await request.get('/posts/9999');
    expect(response.status()).toBe(404);
    expect(await response.json()).toEqual({});
  });

  test('user email is a valid contract value @api @regression', async ({ api }) => {
    const result = await api.users.getById(1);
    expect(result.data.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
  });

  test('known post responds within the service-level target @api @regression', async ({ api }) => {
    const result = await api.posts.getById(1);
    expectResponseWithin(result.durationMs, 3_000);
  });
});
