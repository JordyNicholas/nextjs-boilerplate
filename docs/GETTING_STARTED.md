# Getting started

## Prerequisites

- Node.js 22
- npm
- A running `ts-monolith` API

## Local development

Start the backend first, including migrations and the default tenant seed.

Automated setup (creates `.env.local` when absent, syncs the sibling backend
contract and regenerates types):

```bash
npm install
npm run setup
npm run dev
```

Equivalent manual setup:

```bash
npm install
cp .env.example .env.local
npm run dev
```

PowerShell:

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The Status page should report that the API is
healthy and ready.

## Verify the installation

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Before building a product

Read:

1. [Forking](FORKING.md)
2. [Security and authentication](SECURITY.md)
3. [Environments](ENVIRONMENTS.md)
4. [API contracts](CONTRACTS.md)
5. [Testing](TESTING.md)

The editable tenant UUID and direct browser token flow are learning/demo
features. Choose product tenancy and authentication boundaries before launch.
