import { mkdir, rm } from 'node:fs/promises';

const outputDirectories = ['test-results', 'playwright-report', 'allure-results'];

for (const directory of outputDirectories) {
  await rm(directory, { recursive: true, force: true });
}

await Promise.all([
  mkdir('test-results', { recursive: true }),
  mkdir('playwright-report', { recursive: true }),
]);

console.log('Generated test outputs were removed.');
