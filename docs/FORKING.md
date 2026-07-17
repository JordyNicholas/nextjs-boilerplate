# Forking this boilerplate

## 1. Rename product identity

| Concern | Current value | Main locations |
| --- | --- | --- |
| package | `nextjs-boilerplate` | `package.json`, lockfile |
| UI title | `TS Monolith Console` | root layout and shell |
| API brand | `TS Monolith` | shell and README |
| browser storage | `ts-monolith:*` | auth/tenant constants |
| cookies | `ts-monolith-*` | `lib/auth/cookies.ts` |
| backend repository | JordyNicholas URL | README, contract docs, `.github/workflows/upstream-contract.yml` |
| default tenant | demo UUID | constants and env examples |

Search before finishing:

```bash
git grep -n -i "ts.monolith\|nextjs-boilerplate\|00000000-0000-4000-8000-000000000001"
```

## 2. Choose the product shell

- Replace the API-console navigation with product routes.
- Keep the Status page as an internal diagnostics route or remove it.
- Replace the free-form tenant input with organization membership selection.
- Keep shared cards, inputs, alerts, theme and adaptive navigation as starter UI.

## 3. Choose authentication mode

The direct API/local-storage path is transparent for learning. The BFF route
handlers demonstrate `httpOnly` cookie storage and should be the starting point
for a browser product. See [Security](SECURITY.md).

Document the choice and remove the unused path so future contributors do not
accidentally mix session models.

## 4. Replace demo domains

The report pages demonstrate authenticated CRUD, pagination and background
status polling. Keep, rename or remove them together with the backend report
module and OpenAPI types.

## 5. Configure environments

- Use `.env.local` only for local development.
- `NEXT_PUBLIC_*` variables are embedded in browser bundles.
- Keep secrets server-only; never prefix secrets with `NEXT_PUBLIC_`.
- Use environment-specific backend URLs and cookie settings.

## 6. Validate the fork

```bash
npm run api:check
npm run typecheck
npm run lint
npm test
npm run build
```

Update `.github/workflows/upstream-contract.yml` so the weekly OpenAPI sync
points at your backend repository instead of the original boilerplate owner.