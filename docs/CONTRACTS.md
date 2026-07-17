# API contract workflow

The committed OpenAPI snapshot is the source for generated frontend types.

## Sync from a sibling backend clone

The default source is `../ts-monolith/openapi/openapi.json` when both
repositories share a parent directory:

```bash
# First, in ts-monolith
npm run openapi:export

# Then, in this repository
npm run api:sync
npm run api:generate
```

## Choose another source

`OPENAPI_SOURCE` accepts either a file path or an HTTP(S) URL:

```bash
OPENAPI_SOURCE=../api/openapi/openapi.json npm run api:sync
OPENAPI_SOURCE=https://example.com/openapi.json npm run api:sync
```

PowerShell:

```powershell
$env:OPENAPI_SOURCE = "..\ts-monolith\openapi\openapi.json"
npm run api:sync
```

## Review and validation

Commit both:

- `openapi/ts-monolith.json`
- `lib/api/generated.ts`

Then run:

```bash
npm run api:check
npm run typecheck
npm test
npm run build
```

Backend CI publishes its validated OpenAPI file as an artifact. A product can
promote that artifact through a release pipeline instead of tracking the latest
branch implicitly.
