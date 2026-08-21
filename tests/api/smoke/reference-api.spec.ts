import { test, expect } from '../../../src/fixtures/test.fixture.js';
import { expectApiSuccess } from '../../../src/assertions/custom-assertions.js';

test.describe('Reference API smoke', () => {
  test('users collection satisfies its contract @api @smoke', async ({ api }) => {
    const result = await api.users.getAll();
    expectApiSuccess(result.response);
    expect(result.data).toHaveLength(10);
  });

  test('a known todo can be retrieved @api @smoke', async ({ api }) => {
    const result = await api.todos.getById(1);
    expectApiSuccess(result.response);
    expect(result.data).toMatchObject({ id: 1, completed: false });
  });
});
