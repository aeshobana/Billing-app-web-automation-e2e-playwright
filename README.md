# LKG for Billing – E2E Smoke Suite

![E2E smoke](https://github.com/OWNER/REPO/actions/workflows/e2e.yml/badge.svg)
![Playwright](https://img.shields.io/badge/Playwright-TypeScript-2EAD33)

End-to-end smoke tests for [LKG for Billing](https://lkgforbilling.com), a multi-vertical SaaS billing platform (billing & back-office, hotel & restaurant, medical/pharmacy), built with **Playwright + TypeScript**.

The suite runs on every push and pull request, and nightly at 02:00 UAE time. The HTML report is published to GitHub Pages.

## What it covers

| Area          | Tests  | Notes                                                                                              |
| ------------- | ------ | -------------------------------------------------------------------------------------------------- |
| Login page    | 8      | Controls, input types, email validation, password toggle, wrong credentials, links, console errors |
| Route guards  | 1      | Unauthenticated `/dashboard` redirects to login with `returnUrl`                                   |
| Demo accounts | 3 + 12 | Page content, all 4 verticals, data-driven login for all 12 roles                                  |
| Dashboard     | 2      | Saved-session access and console errors (needs a test account)                                     |

### Bug found by this suite: QA-101

Demo login fails for every role on staging with **HTTP 401** and a "Login failed" toast (found 2026-10-28). The 12 role tests are marked with `test.fail()` and the `@known-bug` tag, so CI stays green while the bug is open. When it is fixed, Playwright reports them as _unexpectedly passed_, which is the signal to remove the marker.

## Design

```
src/
  config/env.ts        # all URLs and credentials from env vars
  data/demoRoles.ts    # role → vertical table that drives data-driven tests
  fixtures/test.ts     # custom fixtures: page objects + console-error collector
  pages/               # Page Object Model (LoginPage, DemoPage)
tests/
  auth.setup.ts        # logs in once, saves storageState for authenticated specs
  auth/                # login, route guard, demo login
  dashboard/           # authenticated checks
.github/workflows/     # CI: typecheck → smoke → report to Pages
```

- **Stable selectors:** uses the app's own `data-testid` attributes, with role-based locators as fallback.
- **Login once:** a `setup` project saves the session; authenticated tests reuse it instead of logging in through the UI each time.
- **No secrets in code:** credentials come from `.env` locally and GitHub Secrets in CI. Authenticated tests skip cleanly when none are set.
- **Debuggable failures:** traces, screenshots and video are kept only for failing tests.
- **Tags:** `@smoke`, `@auth`, `@demo`, `@security`, `@known-bug`, `@mobile` for targeted runs.

## Run it

```bash
npm ci
npx playwright install chromium
cp .env.example .env        # add a test account to enable authenticated tests
npm run test:smoke
npm run report              # open the HTML report
```

Useful variants:

```bash
npx playwright test --grep @demo          # one area
npx playwright test --grep-invert @known-bug
npm run test:ui                           # interactive mode
KNOWN_BUGS=off npm test                   # run QA-101 tests as normal
```

## CI setup

1. In **Settings → Secrets and variables → Actions**, add `LKG_EMAIL` and `LKG_PASSWORD` for a dedicated QA account (optional).
2. In **Settings → Pages**, set the source to **GitHub Actions** to publish the report.

## Roadmap

- [ ] Invoice flow: customer → product → invoice with 5% UAE VAT → payment
- [ ] API layer: contract and negative tests against `stg-api`
- [ ] Role × route RBAC matrix
- [ ] Arabic / RTL visual regression
- [ ] k6 performance baseline
