# Next.js Boilerplate — TS Monolith Console

A clean, mobile-friendly frontend for the [ts-monolith](https://github.com/JordyNicholas/ts-monolith) API.

## Features

- **Status** — `GET /health`, `GET /ready`, `GET /metrics`
- **Auth** — login, refresh, logout (`/auth/*`)
- **Users** — register, profile (`/users/*`)
- **Reports** — create + paginated list (`/reports/*`)
- Responsive layout with horizontal nav on mobile
- Typed API client layer
- JWT storage in `localStorage` (swap for httpOnly cookies in production)

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
components/       # UI + layout
lib/
  api/            # API client per domain
  auth/           # Token storage + React context
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

## Pairing with ts-monolith

Ensure the monolith `.env` has `CORS_ORIGIN=*` (default) or includes `http://localhost:3000`.

For production, point `NEXT_PUBLIC_API_URL` at your deployed API and tighten CORS on the backend.
