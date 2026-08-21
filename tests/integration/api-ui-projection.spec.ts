import { getApiBaseUrl } from '../../config/environment-loader.js';
import { test, expect } from '../../src/fixtures/test.fixture.js';

test.describe('API-to-UI projection integration', () => {
  test('API-created draft is rendered by the review UI @integration @regression', async ({
    api,
    data,
    page,
  }) => {
    const created = await api.posts.create(data.post());
    await page.setContent(
      '<main><h1>Draft review</h1><article data-testid="draft"><h2></h2><p></p></article></main>',
    );
    await page.getByRole('heading', { level: 2 }).evaluate((element, title) => {
      element.textContent = title;
    }, created.data.title);
    await page.locator('article p').evaluate((element, body) => {
      element.textContent = body;
    }, created.data.body);

    await expect(page.getByTestId('draft')).toContainText(created.data.title);
    await expect(page.getByTestId('draft')).toContainText(created.data.body);
  });

  test('live API resource is displayed through a browser projection @integration @critical', async ({
    api,
    page,
  }) => {
    const expected = await api.posts.getById(1);
    const apiBaseUrl = getApiBaseUrl();

    await page.route('**/quality-projection', async (route) => {
      await route.fulfill({
        contentType: 'text/html',
        body:
          '<main><h1>Quality projection</h1><article data-testid="post">Loading</article>' +
          '<script>fetch("/posts/1").then(r=>r.json()).then(p=>' +
          '{document.querySelector("[data-testid=post]").textContent=p.title})</script></main>',
      });
    });
    await page.goto(`${apiBaseUrl}/quality-projection`);

    await expect(page.getByTestId('post')).toHaveText(expected.data.title);
  });

  test('API cleanup operation is explicit after UI verification @integration @regression', async ({
    api,
    data,
    page,
  }) => {
    const created = await api.posts.create(data.post({ title: 'Disposable test record' }));
    await page.setContent(
      `<main><p data-testid="record-id">${created.data.id}</p><p>Disposable test record</p></main>`,
    );
    await expect(page.getByTestId('record-id')).toHaveText(String(created.data.id));

    const cleanup = await api.posts.delete(1);
    expect(cleanup.response.ok()).toBe(true);
  });
});
