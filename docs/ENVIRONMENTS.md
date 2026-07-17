# Environment configuration

## Variable visibility

Next.js embeds `NEXT_PUBLIC_*` variables into browser bundles. They must contain
only public configuration. Keep secrets and internal credentials server-only.

| Variable | Local | Production |
| --- | --- | --- |
| `NEXT_PUBLIC_API_URL` | local backend | deployed internal/public API URL |
| `BACKEND_API_URL` | local backend | private server-to-server API URL |
| `NEXT_PUBLIC_DEFAULT_TENANT_ID` | seeded demo UUID | replace with product tenancy |
| `NEXT_PUBLIC_AUTH_MODE` | `direct` for learning or `bff` | `bff` recommended |
| `BFF_ALLOWED_ORIGINS` | local app origin | explicit deployed app origins |
| `BFF_ALLOWED_ROUTES` | included demo endpoints | minimum product API routes |
| `OPENAPI_SOURCE` | sibling contract file | CI artifact or released contract |

## Build-time configuration

`NEXT_PUBLIC_*` values are fixed when `next build` runs. Build separately for
environments that need different public values, or move runtime routing behind
server-only configuration.

`BACKEND_API_URL`, `BFF_ALLOWED_ORIGINS`, `BFF_ALLOWED_ROUTES` and
`OPENAPI_SOURCE` are not browser-exposed:

- `BACKEND_API_URL` is the BFF's server-only upstream and may use private networking.
- `BFF_ALLOWED_ORIGINS` is read at request time by route handlers. Include the
  public HTTPS origin when Next.js sits behind a TLS-terminating proxy.
- `BFF_ALLOWED_ROUTES` limits the catch-all proxy to explicit method/path pairs.
- `OPENAPI_SOURCE` is tooling-only and used by `npm run api:sync`.

`NEXT_PUBLIC_AUTH_MODE` is evaluated at `next build`. Production builds default
to BFF mode even if a runtime environment later sets a different value.
## Recommended environments

- **Local:** direct auth is acceptable for learning; BFF mode should also be
  exercised before release.
- **Preview:** BFF mode, isolated backend/database and preview origin allowlist.
- **Staging:** production-equivalent cookies, HTTPS, secrets and telemetry.
- **Production:** BFF mode, HTTPS, explicit origins and no demo tenant controls.
