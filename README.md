# BaaS Bank UI

Angular 22.1.5 banking workspace for `saga-orchestrated-banking-as-service` and `choreographed-banking-as-service`.

## Run locally

Use Node 24 (`nvm use`; minimum supported Node 22 is 22.22.3) and a current npm.

```sh
npm ci
npm start
```

Open http://localhost:4200. The dev proxy routes `/api/**` to the gateway at port 8080. Keycloak runs on port 8089. Start the sibling backend using its `start-springboot-services.sh` script first.

The imported local realm includes `johndoe` / `user123`, `james` / `user123`, and `baas-admin` / `admin123`. These are development fixtures. “Set up your account” signs in an existing Keycloak user and requests the onboarding saga; it does not register a new identity. The realm currently disables public registration.

## Architecture

- `core/auth`: signal-based session state, functional guards, authorization-code flow with PKCE and state validation.
- `core/http`: bearer-token interceptor scoped to banking API requests; handles expired sessions without clearing unrelated browser storage.
- `core/config`: API and identity-provider configuration.
- `features/<feature>`: standalone, lazy-loaded pages with feature-owned `data-access` models and services.
- `shared/components`: navigation and reusable loading/error/retry presentation.
- `shared/pipes`: reusable display transforms.

Pages use OnPush change detection, zoneless Angular, signals/computed state, `httpResource`, built-in `@if`/`@for`/`@switch`, typed reactive forms, and subscriptions bound to component lifetimes. The optional assistant is deferred until interaction. It still requires the separately deployed chatbot API; the banking backend does not implement it. Configure that upstream in the dev proxy before using chat.

Payments consume the backend's **plain-text HTTP 202** response and distinguish submission from completion. Pending histories refresh automatically, and the form validates active source accounts, available funds, positive amounts and different account numbers. Server-side validation remains authoritative.

The responsive layout includes live balance summaries, account details, payment status/history, searchable transaction activity, six admin data views, accessible labels, keyboard focus states, a mobile menu and retry states. Optional Google Fonts fall back to system sans-serif fonts.

## Verify

```sh
npm run build
npm test
npx playwright install chromium
npm run test:e2e
```

Start both the backend and `npm start` before E2E tests. The browser suite uses **real local Keycloak, gateway, database and Kafka services**, onboards the two demo users if needed, and transfers $12.50 of demo balance. Repeated runs change those local demo balances. It checks payment completion, matching debit/credit balance changes, transaction history, admin views, route protection, mobile overflow and recoverable API errors. Only the error-state test intercepts an API request.

Screenshots are written to `artifacts/`; failure traces and screenshots go to `test-results/`; the HTML report goes to `playwright-report/`. These generated outputs are gitignored. The stale Cypress registration example was superseded by this suite.

## Versions

Framework packages: Angular 22.1.5; CLI/build: 22.1.7; TypeScript: 6.0.x. The committed npm lockfile records exact transitive versions. Angular compatibility reference: https://angular.dev/reference/versions.

## Choreographed backend

Start the sibling `choreographed-banking-as-service` with `bash scripts/run-local.sh`, then run:

```sh
npm run start:choreographed
npm run build:choreographed
npm run test:e2e:choreographed
```

Open http://localhost:4201. This configuration uses gateway port 18080 and Keycloak port 18089. Sign in with `user1` / `user123`, `user2` / `user123`, or `baas-admin` / `admin123` from its local development realm. Account setup calls `/api/users`; payments call `/api/payments` and complete as `PROCESSED`. Admin pages show the choreography audit trail. The default `npm start` configuration continues to target the orchestrated stack.

The three choreography browser tests use real services and change isolated demo balances. They cover completed and failed payments, both ledger entries, notifications, audit events, desktop/mobile layouts and admin data. Screenshots are in `artifacts/choreographed/`. See [choreography validation](CHOREOGRAPHED-VALIDATION.md).
