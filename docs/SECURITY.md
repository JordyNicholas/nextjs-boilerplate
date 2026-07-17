# Security and authentication

## Choose one browser session model

### Direct API mode

The demo UI stores access and refresh tokens in browser storage and calls the
API directly. This makes token rotation easy to inspect, but JavaScript can read
the refresh token. Treat this as a learning/native-client pattern, not the
recommended browser-production default.

### BFF cookie mode

The `/api/bff` route handlers store tokens in `httpOnly` cookies and proxy API
requests. This reduces token exposure to browser JavaScript.

Before using the BFF in production:

- make it the only browser API path;
- add and document CSRF protection for state-changing requests;
- keep `BFF_ALLOWED_ROUTES` limited to the required proxy paths and methods;
- forward request IDs and required tenant context;
- set upstream timeouts;
- define cookie domain, lifetime and `SameSite` policy;
- add route-handler and browser tests.

CSRF/origin checks allow the request's `nextUrl.origin` plus any origins listed
in `BFF_ALLOWED_ORIGINS`. Behind a TLS-terminating reverse proxy, always set
`BFF_ALLOWED_ORIGINS` to the public HTTPS origin(s). Production mutations without
an `Origin` header are rejected, so non-browser clients must send one.

`NEXT_PUBLIC_AUTH_MODE` is baked at build time. A production image defaults to
`bff` and cannot be flipped to `direct` by runtime environment alone.

The catch-all proxy denies routes not listed in `BFF_ALLOWED_ROUTES`. Entries
use `METHOD:/path`; for example, `GET:/users/me`. A trailing `/*` explicitly
allows descendants. Prefer exact entries and update the allowlist when adding
product endpoints.

Do not mix direct bearer-token and cookie-authenticated calls in one production
session.

## Tenant identity

The tenant text field is a development control. A product should obtain
organizations from authenticated memberships and send only a server-validated
selection. A UUID supplied by a browser is context, not authorization.

## Public environment variables

Every `NEXT_PUBLIC_*` value is visible to users. API URLs and public tenant
defaults are acceptable; secrets are not.

## Browser protections

- Serve production over HTTPS.
- Keep cookies `Secure`, `httpOnly` and appropriately `SameSite`.
- Add a product-specific Content Security Policy.
- Escape/render user content through React rather than raw HTML.
- Avoid logging tokens, credentials or sensitive API responses.
- Review third-party scripts and analytics before adding them.

## Production checklist

- [ ] Cookie BFF or an explicitly approved alternative
- [ ] CSRF strategy
- [ ] No refresh token in browser-readable storage
- [ ] Explicit backend CORS allowlist
- [ ] Membership-based tenant selection
- [ ] Error monitoring without sensitive payloads
- [ ] Dependency scanning
- [ ] Authentication and BFF integration tests
