# Validation report

Completed against the local stack on 2026-09-07.

| Check | Result |
| --- | --- |
| Spring Boot 4.1.1 / Spring Cloud 2025.1.3 reactor | All 10 Maven modules built successfully |
| Backend regression tests | 12 passed: transfer validation, rollback, successful pessimistic/optimistic transfers, concurrent updates, stale user update |
| Angular 22.1.5 production build | Passed; initial bundle approximately 327 kB raw / 92 kB estimated transfer |
| Angular unit tests | 4 passed across 3 files |
| Chromium integration suite | 3 passed against live Keycloak, gateway, MySQL and Kafka |
| Backend runtime health | All 8 applications UP |
| Visual inspection | Desktop landing, dashboard and payments; mobile dashboard and payments inspected |

The main browser journey signs in through Keycloak's authorization-code/PKCE flow, opens account details, checks invalid payment input, submits a $12.50 demo transfer, waits for COMPLETED, verifies both account balances, finds the transaction, and navigates the mobile layout. No browser page errors occurred. The admin journey verifies live customer and completed saga data. The error-recovery test injects one HTTP 503, checks the retry state, restores the live endpoint and verifies recovery. Guest protection is also checked.

Screenshots (generated locally, excluded from Git):

- `artifacts/welcome-desktop.png`
- `artifacts/dashboard-desktop.png`
- `artifacts/dashboard-mobile.png`
- `artifacts/payments-desktop.png`
- `artifacts/payments-mobile.png`
- `artifacts/transactions-desktop.png`
- `artifacts/admin-desktop.png`
- `artifacts/accounts-error.png`

Run `npm run test:e2e` with both stacks running to reproduce. Tests mutate only bundled local demo accounts; each successful run transfers $12.50 from johndoe to james. The optional external chatbot was not exercised because its service is not provided by either repository. This is a Chromium desktop/mobile check, not a cross-browser or load-test certification.
