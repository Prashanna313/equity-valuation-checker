# Security Policy

## Scope

Valuation Checker is a read-only tool — it fetches public market data and performs client-side calculations. It stores no user data and has no authentication system.

Relevant attack surface:
- The `/api/valuation`, `/api/search`, and `/api/indices` route handlers (ticker/query input handling)
- Third-party dependency vulnerabilities (yahoo-finance2, Next.js, React)

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Email: **buskey14@gmail.com**

Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact

You can expect an acknowledgement within 48 hours and a resolution or status update within 7 days.

## Supported versions

Only the latest version on the `main` branch is supported.
