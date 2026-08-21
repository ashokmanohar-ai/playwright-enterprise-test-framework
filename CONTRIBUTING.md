# Contributing

## Workflow

1. Create a branch such as `feature/<scope>`, `fix/<scope>`, or `docs/<scope>`.
2. Make one cohesive change with relevant tests.
3. Run `npm run validate` and the affected suites.
4. Inspect screenshots, traces, video, logs, and reports for sensitive data.
5. Open a focused pull request with risk, evidence, and rollback notes.

## Conventions

- Files use kebab case: `login.page.ts`, `posts.api-client.ts`.
- Classes use PascalCase; functions and variables use camelCase.
- Test titles state actor, behaviour, and expected outcome.
- Tags express suite/risk without replacing readable names.
- Prefer roles, labels, placeholders, text, and test IDs over CSS/XPath.
- Do not use hard-coded sleeps, hidden catches, shared mutable data, or order dependencies.

## Pull request expectations

- Explain the business/quality problem and architectural impact.
- Add or update tests at the lowest valuable layer.
- Provide command output or report links as evidence.
- Confirm secrets and personal data are absent.
- Call out flaky behaviour, public-service dependencies, and known limitations.
- Obtain review for page/client abstractions and quality-gate policy changes.

Reviewers verify correctness, readability, isolation, security, evidence, documentation, and
maintainability rather than approving solely because the pipeline is green.
