import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { expectApiSuccess } from '../../../src/assertions/custom-assertions.js';
import { expectJsonResponse } from '../../../src/api/helpers/response.helpers.js';

test.describe('Posts API smoke', () => {
  test('posts collection is available @api @smoke @critical', async ({ api }) => {
    const result = await api.posts.getAll();
    expectApiSuccess(result.response);
    expectJsonResponse(result.response);
    expect(result.data.length).toBeGreaterThan(0);
  });

  test('a known post can be retrieved @api @smoke', async ({ api }) => {
    const result = await api.posts.getById(1);
    expectApiSuccess(result.response);
    expect(result.data.id).toBe(1);
  });
});
