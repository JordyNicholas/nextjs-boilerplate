# Testing strategy

## Local checks

```bash
npm run api:check
npm run typecheck
npm run lint
npm test
npm run build
```

## Test layers

### Unit tests

Use these for API error mapping, storage-free helpers and other deterministic
logic.

### Component tests

Cover shared UI behavior and important state transitions without requiring a
real backend.

### Browser smoke test

The minimum product flow should exercise:

1. API readiness
2. registration or invitation acceptance
3. login
4. protected profile
5. create and list a domain entity
6. logout/session expiry
7. light/dark mode and compact mobile navigation

Run the browser flow against an isolated database and deterministic seed.

### BFF tests

When cookie mode is the product default, test login cookie attributes, refresh
rotation, logout clearing, proxy authorization, CSRF behavior and upstream
timeouts.

## CI expectations

Every change should pass type checking, linting, unit/component tests, generated
contract validation and production build. Run the browser smoke test in a
separate job with the backend and database.
