# Next.js Boilerplate — TS Monolith Console

A clean, mobile-friendly frontend for the [ts-monolith](https://github.com/JordyNicholas/ts-monolith) API.

## Features

- **Status** — `GET /health`, `GET /ready`, `GET /metrics`
- **Auth** — login, refresh, logout (`/auth/*`)
- **Users** — register, profile (`/users/*`)
- **Reports** — create + paginated list (`/reports/*`)
- Responsive layout with horizontal nav on mobile
- System-aware dark mode, toast feedback, shared loading/error/empty states
- Tenant switcher for exercising multi-tenancy
- OpenAPI-generated contract types (no duplicated response shapes)
- Automatic access-token refresh and reusable `RequireAuth`
- Optional httpOnly-cookie BFF route handlers for production hardening

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

```bash
cp .env.example .env.local
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
| `NEXT_PUBLIC_DEFAULT_TENANT_ID` | seeded UUID | Sent as `x-tenant-id` on register/login |

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Run production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript without emitting |
| `npm run api:sync` | Fetch `/docs/json` from a running monolith |
| `npm run api:generate` | Generate `lib/api/generated.ts` |
| `npm run api:check` | Fail when generated types are stale |

## OpenAPI workflow (separate repositories)

The repositories stay independent. The frontend commits a snapshot at
`openapi/ts-monolith.json` and generated types at `lib/api/generated.ts`.

When the backend contract changes:

```bash
# ts-monolith
npm run openapi:export

# nextjs-boilerplate (with the API running)
npm run api:sync
npm run api:generate
```

CI runs `api:check`, so a modified contract snapshot cannot be committed with stale
TypeScript types.

## Authentication modes

The demo UI uses `localStorage` so the flow is transparent and easy to learn. The
API client automatically rotates the refresh token and retries one failed protected
request after a `401`.

For a production BFF approach, use:

- `POST /api/bff/auth/login`
- `POST /api/bff/auth/refresh`
- `POST /api/bff/auth/logout`
- `/api/bff/[...path]` for cookie-authenticated backend proxying

These route handlers keep access and refresh tokens in httpOnly cookies. They are
provided as an explicit alternative rather than hiding the demo's token flow.

## UX behaviors

- Status dashboard refreshes every 30 seconds and displays latency/last-check time.
- Reports poll every two seconds while any item is `PENDING` or `PROCESSING`.
- Theme follows the OS by default and can be overridden from the header.
- The tenant switcher controls `x-tenant-id` for register/login.

## Pairing with ts-monolith

Ensure the monolith `.env` has `CORS_ORIGIN=*` (default) or includes `http://localhost:3000`.

For production, point `NEXT_PUBLIC_API_URL` at your deployed API and tighten CORS on the backend.
