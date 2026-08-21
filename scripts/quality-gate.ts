import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

interface JsonResult {
  status?: string;
}

interface JsonTest {
  results?: JsonResult[];
}

interface JsonSpec {
  title?: string;
  tests?: JsonTest[];
}

interface JsonSuite {
  suites?: JsonSuite[];
  specs?: JsonSpec[];
}

interface JsonReport {
  suites?: JsonSuite[];
}

interface TestOutcome {
  title: string;
  status: string;
}

function threshold(name: string, fallback: number): number {
  const value = Number(process.env[name] ?? fallback);
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${name} must be a non-negative number.`);
  }
  return value;
}

function collectOutcomes(suites: JsonSuite[] = []): TestOutcome[] {
  return suites.flatMap((suite) => [
    ...collectOutcomes(suite.suites),
    ...(suite.specs ?? []).flatMap((spec) =>
      (spec.tests ?? []).map((test) => ({
        title: spec.title ?? 'unnamed test',
        status: test.results?.at(-1)?.status ?? 'unknown',
      })),
    ),
  ]);
}

function passRate(outcomes: TestOutcome[]): number {
  const executed = outcomes.filter((item) => !['skipped', 'unknown'].includes(item.status));
  if (executed.length === 0) return 0;
  const passed = executed.filter((item) => item.status === 'passed').length;
  return (passed / executed.length) * 100;
}

async function accessibilityCriticalCount(): Promise<{ count: number; files: number }> {
  const directory = path.join('test-results', 'accessibility-results');
  let files: string[];
  try {
    files = (await readdir(directory)).filter((file) => file.endsWith('.json'));
  } catch {
    return { count: 0, files: 0 };
  }

  let count = 0;
  for (const file of files) {
    const findings = JSON.parse(await readFile(path.join(directory, file), 'utf8')) as Array<{
      impact?: string;
    }>;
    count += findings.filter((finding) => finding.impact === 'critical').length;
  }
  return { count, files: files.length };
}

const reportPath = path.join('test-results', 'results.json');
let report: JsonReport;
try {
  report = JSON.parse(await readFile(reportPath, 'utf8')) as JsonReport;
} catch (error) {
  throw new Error(
    `Quality gate cannot run because ${reportPath} is missing or invalid. Execute the test suite first.`,
    { cause: error },
  );
}

const outcomes = collectOutcomes(report.suites);
const smoke = outcomes.filter((item) => item.title.includes('@smoke'));
const regression = outcomes.filter((item) => item.title.includes('@regression'));
const criticalFailures = outcomes.filter(
  (item) => item.title.includes('@critical') && item.status !== 'passed',
).length;
const accessibility = await accessibilityCriticalCount();

const overallRate = passRate(outcomes);
const smokeRate = passRate(smoke);
const regressionRate = regression.length > 0 ? passRate(regression) : overallRate;

const minOverallRate = threshold('QUALITY_GATE_MIN_PASS_RATE', 98);
const minSmokeRate = threshold('QUALITY_GATE_SMOKE_MIN_PASS_RATE', 100);
const maxCriticalFailures = threshold('QUALITY_GATE_MAX_CRITICAL_FAILURES', 0);
const maxCriticalA11y = threshold('QUALITY_GATE_MAX_CRITICAL_A11Y', 0);
const requireA11y = process.env.QUALITY_GATE_REQUIRE_A11Y_RESULTS !== 'false';

const checks = {
  smoke: smokeRate >= minSmokeRate && smoke.length > 0,
  regression: regressionRate >= minOverallRate,
  critical: criticalFailures <= maxCriticalFailures,
  accessibility:
    accessibility.count <= maxCriticalA11y && (!requireA11y || accessibility.files > 0),
};
const passed = Object.values(checks).every(Boolean);
const state = (value: boolean): string => (value ? 'PASS' : 'FAIL');

console.log('\nQUALITY GATE RESULTS\n');
console.log(`Smoke Pass Rate:          ${smokeRate.toFixed(1)}% ${state(checks.smoke)}`);
console.log(`Regression Pass Rate:     ${regressionRate.toFixed(1)}% ${state(checks.regression)}`);
console.log(`Overall Pass Rate:        ${overallRate.toFixed(1)}%`);
console.log(`Critical Failures:        ${criticalFailures} ${state(checks.critical)}`);
console.log(`Accessibility Critical:   ${accessibility.count} ${state(checks.accessibility)}`);
console.log(`Accessibility Files:      ${accessibility.files}`);
console.log(`\nRELEASE QUALITY GATE: ${passed ? 'PASS' : 'FAIL'}\n`);

if (!passed) process.exitCode = 1;
