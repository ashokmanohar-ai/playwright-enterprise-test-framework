# Security Policy

## Secret and credential handling

- Never commit credentials, API keys, tokens, cookies, or authenticated storage state.
- Store local values in ignored `.env` files and CI values in protected secret stores.
- Treat screenshots, videos, traces, reports, and logs as potentially sensitive.
- Pino redacts common password, token, authorisation, and cookie paths.
- Rotate any secret immediately if it appears in source, history, output, or an artifact.

## Repository controls

- GitHub Actions uses read-only `contents` permission.
- Pin the Playwright container/browser version to the project version.
- Review dependency updates and lockfile changes.
- Enable GitHub secret scanning, dependency review, and CodeQL where available.
- Run authorised SAST, SCA, and DAST in the owning organisation's security pipeline.

## Auth-state files

`auth/user.json` is generated at runtime and ignored. It can contain session cookies and must not
be uploaded as a general artifact. Refresh state by rerunning the setup project; do not share it.

## Responsible disclosure

Do not open a public issue containing a credential, exploit, or sensitive target detail. Report a
suspected vulnerability privately to the repository owner through GitHub's private vulnerability
reporting when enabled. Include impact, reproduction, affected version/commit, and a safe proof.

Supported security fixes apply to the current default branch.
