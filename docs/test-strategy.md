# Test Strategy

## Quality layers

The framework follows a testing-trophy mindset: many fast component/contract checks, strong
integration coverage, a focused set of user journeys, and complementary exploratory validation.

| Layer            | Purpose                                     | Typical cadence     |
| ---------------- | ------------------------------------------- | ------------------- |
| Static/type/lint | Prevent structural defects                  | Every PR            |
| API/contract     | Validate services and schemas quickly       | Every PR            |
| Integration      | Validate boundaries and mappings            | Every PR/nightly    |
| UI smoke         | Protect critical business journeys          | Every PR/deployment |
| UI regression    | Protect broader behaviour                   | Nightly/release     |
| Accessibility    | Detect WCAG rule violations                 | PR + weekly         |
| Visual           | Protect intentionally stable surfaces       | PR/nightly          |
| Performance      | Establish service/browser budgets           | Dedicated pipeline  |
| Security         | Dependency, secret, SAST, and DAST controls | PR/scheduled        |

## Suite policy

- Smoke: small, deterministic, business-critical, 100% required.
- Regression: risk-based breadth with at least a 98% release threshold.
- Critical path: zero accepted failures.
- PR: static validation plus smoke, API, and accessibility.
- Nightly: cross-browser regression across independent shards.
- Release: regression, exploratory evidence, performance, security, and business sign-off.

## Out-of-scope layers

This repository documents rather than pretends to perform load or penetration testing. A production
programme should add k6 or equivalent performance checks, SAST/SCA/secret scanning, DAST against an
authorised environment, consumer/provider contracts, and manual accessibility evaluation.

## Test selection

Tags express risk and capability. Paths express ownership. CI may combine both. Teams should review
suite duration, unique defect yield, flake rate, and maintenance cost rather than maximising test
count.
