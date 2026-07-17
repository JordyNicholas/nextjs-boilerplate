# Next.js Boilerplate — TS Monolith Console

A clean, mobile-friendly frontend for the [ts-monolith](https://github.com/JordyNicholas/ts-monolith) API.

## Features

- **Status** — `GET /health`, `GET /ready`, `GET /metrics`
- **Auth** — login, refresh, logout (`/auth/*`)
- **Users** — register, profile (`/users/*`)
- **Reports** — create + paginated list (`/reports/*`)
- Adaptive layout with safe-area support and native-style mobile navigation
- System-aware dark mode, toast feedback, shared loading/error/empty states
- Tenant switcher for exercising multi-tenancy
- OpenAPI-generated contract types (no duplicated response shapes)
- Automatic access-token refresh and reusable `RequireAuth`
- Optional httpOnly-cookie BFF route handlers for production hardening

## Boilerplate guides

- [First-day setup](docs/GETTING_STARTED.md)
- [Fork and rename checklist](docs/FORKING.md)
- [Security and authentication](docs/SECURITY.md)
- [Environment matrix](docs/ENVIRONMENTS.md)
- [API contract workflow](docs/CONTRACTS.md)
- [Testing strategy](docs/TESTING.md)

## Quickstart

### 1. Start the monolith API

```bash
# In ts-monolith repo
docker compose up -d
npm run db:migrate && npm run db:seed
npm run dev
```

API runs at `http://localhost:3333`.

### 2. Configure the frontend

Automated:

```bash
npm install
npm run setup
```

Or manually:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

### 3. Run Next.js

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Pages

| Route | API consumed |
|-------|----------------|
| `/` | Health, readiness, metrics |
| `/register` | `POST /users/` |
| `/login` | `POST /auth/login`, `POST /auth/refresh` |
| `/profile` | `GET /users/me` |
| `/reports` | `GET /reports/`, `POST /reports/` |

Logout is available from the header when authenticated (`POST /auth/logout`).

## Project structure

```
app/              # Routes (App Router)
  api/bff/         # Optional httpOnly-cookie auth/proxy pattern
components/       # UI + layout
lib/
  api/            # API client + generated OpenAPI contract
  auth/           # Token storage + React context
  tenant/         # Development tenant switcher state
openapi/          # Committed backend contract snapshot
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3333` | Monolith base URL |
| `BACKEND_API_URL` | public API URL | Server-only BFF upstream URL |
| `NEXT_PUBLIC_DEFAULT_TENANT_ID` | seeded UUID | Sent as `x-tenant-id` on register/login |
| `NEXT_PUBLIC_AUTH_MODE` | direct in dev, BFF in production | Browser session model: `direct` or `bff` |
| `BFF_ALLOWED_ORIGINS` | current application origin | Server-only CSRF origin allowlist |
| `OPENAPI_SOURCE` | sibling backend contract | File path or HTTP(S) contract source |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run setup` | Create local env, sync contract and generate types |
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm test` | Run unit/component tests |
| `npm run test:watch` | Watch unit/component tests |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript without emitting |
| `npm run api:sync` | Sync OpenAPI from a local file or HTTP(S) URL |
| `npm run api:generate` | Generate `lib/api/generated.ts` |
| `npm run api:check` | Fail when generated types are stale |

## OpenAPI workflow (separate repositories)

The repositories stay independent. The frontend commits a snapshot at
`openapi/ts-monolith.json` and generated types at `lib/api/generated.ts`.

When the backend contract changes:

```bash
# ts-monolith
npm run openapi:export

# nextjs-boilerplate (repos are sibling directories by default)
npm run api:sync
npm run api:generate
```

CI runs `api:check`, so a modified contract snapshot cannot be committed with stale
TypeScript types.

## Authentication modes

Development defaults to `NEXT_PUBLIC_AUTH_MODE=direct`, which uses `localStorage`
so the token flow is transparent and easy to learn. The API client rotates the
refresh token and retries one failed protected request after a `401`.

Production defaults to `NEXT_PUBLIC_AUTH_MODE=bff`. This uses:

- `POST /api/bff/auth/login`
- `POST /api/bff/auth/refresh`
- `POST /api/bff/auth/logout`
- `/api/bff/[...path]` for cookie-authenticated backend proxying

These route handlers keep access and refresh tokens in httpOnly cookies, enforce
same-origin mutations, forward request IDs and tenant context, rotate sessions,
and apply upstream timeouts. Configure `BFF_ALLOWED_ORIGINS` and read
[`docs/SECURITY.md`](docs/SECURITY.md) before deployment.

## UX behaviors

- Status dashboard refreshes every 30 seconds and displays latency/last-check time.
- Reports poll every two seconds while any item is `PENDING` or `PROCESSING`.
- Theme follows the OS by default and can be overridden from the header.
- The tenant switcher controls `x-tenant-id` for register/login.

## Pairing with ts-monolith

Ensure the monolith `.env` includes `CORS_ORIGIN=http://localhost:3000` for direct
development mode. BFF mode makes same-origin browser requests and calls the API
server-to-server.

For production, point `NEXT_PUBLIC_API_URL` at the deployed API, use BFF mode and
keep backend CORS restricted to explicit trusted origins.
