# Framework Design

## Separation of concerns

Configuration validates execution inputs. Fixtures compose runtime dependencies. Page Objects and
API clients encapsulate application adapters. Tests retain business intent and verdicts. Reporters
and the quality gate operate only on evidence.

## Page Object Model

`BasePage` contains navigation and small universal behaviours. Domain pages own cohesive locators
and actions; none becomes a generic application god-object. Assertions stay in tests except page
state helpers such as successful login or completed order.

## Fixture design

`test.fixture.ts` is the public composition root. Dependencies are lazy: a test that requests only
`api` does not construct UI pages. `authenticatedPage` reuses setup state and can establish a
session when state is anonymous. The approach reduces duplication without hiding the scenario.

## API architecture

`BaseApiClient` standardises method, safe request logging, duration, response metadata, and JSON
parsing. Resource clients expose domain operations and validate responses with Zod. HTTP status
assertions remain explicit in tests.

## Environment handling

External variables take precedence. `.env` and `.env.<environment>` support local execution.
DEV, QA, and UAT supply only safe defaults. Zod rejects invalid values before expensive setup.

## Data and isolation

Factories provide valid defaults and targeted overrides. Random UUID suffixes prevent collision.
No test mutates shared in-memory state or depends on order. Runtime credentials and auth state never
enter version control.

## Parallelisation and retries

Fully parallel execution is safe because browser contexts, request contexts, and generated data are
isolated. CI retries twice; local runs do not retry. First-retry traces and failure media make every
retry visible. Quarantine requires an owner, issue, expiry, and root-cause plan.

## Reporting and release decisions

HTML supports investigation, JUnit supports CI, and JSON drives a configurable gate. Missing
evidence is a failure condition. Optional Allure provides a richer historical presentation without
being required for normal execution.

## Extensibility

Add a page for a new UI capability, a resource client/schema for an API, and a focused fixture only
when composition adds value. Future adapters can publish results to Jira, Azure DevOps, or an
observability platform without changing test semantics.
