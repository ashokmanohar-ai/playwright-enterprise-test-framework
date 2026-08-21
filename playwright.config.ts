import {
  defineConfig,
  devices,
  type PlaywrightTestConfig,
  type ReporterDescription,
} from '@playwright/test';

import { getApiBaseUrl, getEnvironmentConfig } from './config/environment-loader.js';

const env = getEnvironmentConfig();
const useLocalApi = process.env.USE_LOCAL_API === 'true';
const apiBaseUrl = getApiBaseUrl();
const reporters: ReporterDescription[] = [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['json', { outputFile: 'test-results/results.json' }],
  ['junit', { outputFile: 'test-results/junit.xml' }],
];

if (process.env.ALLURE_REPORT === 'true') {
  reporters.push(['allure-playwright', { outputFolder: 'allure-results' }]);
}

const browserProjects: NonNullable<PlaywrightTestConfig['projects']> = [
  {
    name: 'chromium',
    testIgnore: ['**/api/**', '**/setup/**'],
    use: { ...devices['Desktop Chrome'], storageState: 'auth/user.json' },
    dependencies: ['setup'],
  },
  {
    name: 'firefox',
    testMatch: ['**/ui/smoke/**/*.spec.ts', '**/ui/regression/**/*.spec.ts'],
    use: { ...devices['Desktop Firefox'], storageState: 'auth/user.json' },
    dependencies: ['setup'],
  },
  {
    name: 'webkit',
    testMatch: ['**/ui/smoke/**/*.spec.ts', '**/ui/regression/**/*.spec.ts'],
    use: { ...devices['Desktop Safari'], storageState: 'auth/user.json' },
    dependencies: ['setup'],
  },
];

if (process.env.ENABLE_EDGE === 'true') {
  browserProjects.push({
    name: 'edge',
    testMatch: ['**/ui/smoke/**/*.spec.ts'],
    use: {
      ...devices['Desktop Edge'],
      channel: 'msedge',
      storageState: 'auth/user.json',
    },
    dependencies: ['setup'],
  });
}

if (process.env.ENABLE_MOBILE === 'true') {
  browserProjects.push({
    name: 'mobile-chrome',
    testMatch: ['**/ui/smoke/**/*.spec.ts'],
    use: { ...devices['Pixel 7'], storageState: 'auth/user.json' },
    dependencies: ['setup'],
  });
}

export default defineConfig({
  testDir: './tests',
  outputDir: 'test-results/artifacts',
  fullyParallel: true,
  forbidOnly: env.isCI,
  retries: env.isCI ? 2 : 0,
  workers: env.isCI ? Math.min(env.workers, 4) : env.workers,
  timeout: 30_000,
  expect: {
    timeout: 7_500,
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      pathTemplate: '{testDir}/visual/__screenshots__/{arg}-{projectName}-{platform}{ext}',
    },
  },
  reporter: reporters,
  ...(useLocalApi
    ? {
        webServer: {
          command: 'node --import tsx scripts/mock-api-server.ts',
          url: 'http://127.0.0.1:4010/health',
          reuseExistingServer: !env.isCI,
          timeout: 10_000,
        },
      }
    : {}),
  use: {
    baseURL: env.baseUrl,
    headless: env.headless,
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    testIdAttribute: 'data-test',
  },
  projects: [
    {
      name: 'setup',
      testMatch: '**/setup/**/*.setup.ts',
      use: { ...devices['Desktop Chrome'] },
    },
    ...browserProjects,
    {
      name: 'api',
      testMatch: '**/api/**/*.spec.ts',
      use: { baseURL: apiBaseUrl },
    },
  ],
});
