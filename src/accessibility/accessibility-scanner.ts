import path from 'node:path';

import AxeBuilder from '@axe-core/playwright';
import type { Page, TestInfo } from '@playwright/test';

import { writeJson } from '../utils/file-utils.js';

export interface AccessibilityScanOptions {
  name: string;
  includedImpacts?: Array<'critical' | 'serious'>;
}

export async function scanAccessibility(
  page: Page,
  testInfo: TestInfo,
  options: AccessibilityScanOptions,
): Promise<number> {
  const impacts = options.includedImpacts ?? ['critical', 'serious'];
  const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
  const violations = results.violations.filter(
    (violation) => violation.impact && impacts.includes(violation.impact as 'critical' | 'serious'),
  );

  const summary = violations.map((violation) => ({
    rule: violation.id,
    impact: violation.impact,
    help: violation.help,
    helpUrl: violation.helpUrl,
    targets: violation.nodes.flatMap((node) => node.target),
  }));

  await testInfo.attach('accessibility-findings', {
    body: Buffer.from(JSON.stringify(summary, null, 2)),
    contentType: 'application/json',
  });

  const fileName = `${options.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.json`;
  await writeJson(path.join('test-results', 'accessibility-results', fileName), summary);
  return violations.length;
}
