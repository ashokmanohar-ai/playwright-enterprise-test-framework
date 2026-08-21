# Troubleshooting

## Fast triage

1. Run `npm run validate:env`.
2. Confirm the public target is reachable outside Playwright.
3. Re-run the single test with `--headed`.
4. Inspect HTML report, error, screenshot, video, and trace.
5. Compare method, endpoint, status, request ID, and duration for API failures.

## Common errors

| Symptom                                    | Likely cause                          | Action                                                       |
| ------------------------------------------ | ------------------------------------- | ------------------------------------------------------------ |
| Authentication configuration is incomplete | Runtime secrets absent                | Set local/CI secret values                                   |
| Browser executable missing                 | Playwright browser not installed      | Run `npx playwright install`                                 |
| Public target timeout/5xx                  | External service outage or rate limit | Verify service; retain evidence; retry later                 |
| Public API DNS/network blocked             | Restricted runner egress              | Run `npm run test:api:local` to validate framework contracts |
| Zod validation failure                     | Contract or configuration drift       | Compare actual payload/value with schema                     |
| Missing screenshot baseline                | First visual run or new platform      | Generate in pinned container and review                      |
| Quality gate missing results               | Gate ran before/without tests         | Execute combined suite before gate                           |

## Framework defect versus external outage

A framework defect is reproducible against a healthy target and usually affects locator logic,
configuration, parsing, or orchestration. An external outage is independently observable as DNS,
network, rate-limit, 5xx, or unavailable application behaviour. Record both accurately; never mark a
failed check as passed to hide an outage.

## Flaky tests

Retries remain visible. Use traces and repeated isolated runs to classify product timing,
environment instability, data collision, selector fragility, or framework error. Quarantine only
with an issue, owner, reason, expiry, and release-risk decision.
