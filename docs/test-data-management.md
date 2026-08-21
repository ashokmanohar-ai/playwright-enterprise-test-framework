# Test Data Management

## Categories

- Generated data: factories create unique, valid defaults with targeted overrides.
- Shared reference data: stable public product names and read-only API identifiers.
- Environment data: endpoints and worker settings come from typed environment configuration.
- Sensitive data: credentials and tokens exist only at runtime.
- Negative data: non-sensitive invalid inputs live in versioned JSON.

## Rules

1. A parallel test owns its mutable data.
2. Setup through APIs is preferred when it is faster and semantically equivalent.
3. Cleanup is explicit and safe to repeat.
4. Secrets never appear in factories, fixtures, logs, screenshots, or reports.
5. Boundary values explain the risk they cover.
6. Static shared data must be read-only.

## Factory example

```typescript
const customer = data.checkoutCustomer({ postalCode: 'EC1A 1BB' });
const post = data.post({ userId: 2 });
```

For a real service, attach a run ID and worker ID to created records, make cleanup idempotent, and
schedule a controlled orphan-data janitor outside the test verdict.
