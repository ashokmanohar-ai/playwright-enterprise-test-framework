# Interview Walkthrough

## Two-minute explanation

This repository solves the governance gap between writing Playwright scripts and operating a
scalable Quality Engineering service. Playwright provides browser and API execution; TypeScript and
Zod protect compile-time and runtime boundaries. Tests express business intent, fixtures compose
dependencies, Page Objects isolate UI behaviour, and typed clients isolate APIs. GitHub Actions runs
risk-based PR and nightly suites, captures evidence, and applies a measurable release gate. Docker
pins the browser/system dependency stack.

## Five-minute walkthrough

1. `config/`: show DEV/QA/UAT defaults, precedence, validation, and secret handling.
2. `src/fixtures/test.fixture.ts`: show lazy dependency composition and authenticated page.
3. `src/pages/`: show locator hierarchy and business actions.
4. `src/api/`: show base transport, resource clients, models, and Zod schemas.
5. `tests/`: compare smoke, regression, API, integration, accessibility, and visual intent.
6. `playwright.config.ts`: show projects, evidence, retries, workers, and optional browsers.
7. `.github/workflows/`: show PR feedback, browser/shard matrix, and artifacts.
8. `scripts/quality-gate.ts`: show evidence-based release policy.

## Architecture questions

### Why Page Objects?

They localise volatile UI adapters and provide domain language. Tests retain assertions and scenario
intent so the model does not become a hidden test framework.

### Why fixtures?

Fixtures provide lifecycle, isolation, and typed dependency injection. They remove construction
duplication while instantiating only what a test asks for.

### Why API setup instead of UI setup?

API setup is faster and less fragile when it represents the same precondition. The UI remains under
test for the behaviour being asserted.

### How does parallelisation work?

Each test gets isolated contexts and generated data. Workers execute files concurrently; CI shards
distribute them across machines. Shared mutable state and ordering dependencies are prohibited.

### How are secrets managed?

Local ignored environment files or CI secret stores supply credentials. Auth state and reports are
ignored, logs redact sensitive keys, and workflows have read-only repository permissions.

### How are flaky tests handled?

CI retries are diagnostic, never silent. Evidence is retained, trends are reviewed, and quarantine
requires governance. Root cause must be fixed rather than normalising instability.

### How would this scale to 5,000 tests?

Keep risk-based PR selection, distribute blob-report shards, namespace test data, prebuild the
container, reuse read-only setup artifacts, cap external concurrency, track duration/flake history,
and move expensive suites to scheduled/release pipelines.

### How would it run in Kubernetes?

Create an indexed Job per shard using the pinned image, inject secrets through the platform, write
blob reports to object storage, merge in an aggregator job, then run the release gate.

### How would Jira or Azure DevOps integration work?

Publish JUnit plus a small adapter that maps stable test IDs to work items. Keep ALM publishing out
of test logic, make updates idempotent, and preserve evidence URLs and release-gate status.

### How would AI-assisted failure analysis work?

After verdict generation, a separate read-only agent can consume traces, screenshots, logs, source
metadata, and recent changes to suggest a probable category and supporting evidence. It must not
rewrite test results or auto-heal without review.
