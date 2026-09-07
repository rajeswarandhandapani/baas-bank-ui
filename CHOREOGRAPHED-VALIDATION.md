# Choreographed integration validation

Validated on 2026-09-07 against the isolated local choreographed stack, using real Keycloak, gateway, MySQL and Kafka services.

- Backend Maven reactor: all 10 modules passed; 17 tests cover transfer rules, atomic balance changes, replay/concurrent duplicate handling, publication failure and ledger recording.
- Angular production builds: default and choreographed configurations passed.
- Angular unit tests: 4 passed.
- Choreographed Playwright suite: 3 passed. No mocked API responses are used in this suite.
- A $12.50 payment reached PROCESSED, debited and credited the correct accounts once, produced matching debit/credit entries, and appeared in notifications and audit data.
- Negative amounts were rejected; an unknown destination produced FAILED without changing the source balance.
- Real admin login displayed audit events, customers and notifications.
- Desktop and 390px mobile screenshots were visually inspected. Payment history uses contained horizontal scrolling on small screens; the page itself does not overflow.

Evidence is generated under `artifacts/choreographed/`: `dashboard-desktop.png`, `dashboard-mobile.png`, `payments-desktop.png`, `payments-mobile.png`, `transactions-desktop.png`, `failed-payment.png`, and `audit-desktop.png`. Reports and screenshots are gitignored and can be regenerated with `npm run test:e2e:choreographed` while the stack and UI run.

The external chatbot was not tested. Monetary values still use the backend's inherited double representation. The backend modernization report documents event-delivery and existing-database migration limitations.
