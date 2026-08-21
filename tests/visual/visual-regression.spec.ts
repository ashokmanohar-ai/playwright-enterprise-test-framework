import { test, expect } from '../../src/fixtures/test.fixture.js';

test.describe('Stable component visual regression', () => {
  test('release status badge remains visually stable @visual', async ({ page }) => {
    await page.setContent(
      '<style>body{margin:0}.badge{width:200px;height:80px;background:#146c43}</style>' +
        '<div class="badge" role="img" aria-label="Quality gate passed"></div>',
    );
    await expect(page.locator('.badge')).toHaveScreenshot('quality-gate-pass.png');
  });

  test('critical alert component remains visually stable @visual', async ({ page }) => {
    await page.setContent(
      '<style>body{margin:0}.alert{box-sizing:border-box;width:240px;height:100px;background:#fff4e5;' +
        'border:4px solid #b54708}</style>' +
        '<div class="alert" role="img" aria-label="Critical check required"></div>',
    );
    await expect(page.locator('.alert')).toHaveScreenshot('critical-alert.png');
  });
});
