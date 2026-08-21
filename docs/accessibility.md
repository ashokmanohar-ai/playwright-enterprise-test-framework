# Accessibility

The scanner applies Axe WCAG 2 A/AA tags to selected critical pages and records critical/serious
findings as JSON attachments. Each finding contains rule, impact, help text, reference URL, and
affected targets.

```bash
npm run test:accessibility
```

## Interpretation

Automated rules reliably find only a subset of accessibility barriers. A complete release decision
also needs:

- keyboard-only navigation and visible focus
- screen-reader journeys and announcements
- 200%/400% zoom and reflow
- colour/contrast review in meaningful states
- error prevention and recovery
- cognitive clarity and usable language
- disabled, loading, modal, and dynamic states

Do not suppress a violation solely to make a pipeline green. Any accepted exception needs evidence,
an owner, affected users, compensating control, and review date.
