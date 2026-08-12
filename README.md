# Hackers Campus

Hackers Campus is a monorepo starter for a cybersecurity learning platform built around:

- `Next.js` + `TypeScript` + `Tailwind CSS` for the main web experience
- `FastAPI` + `SQLAlchemy` + `PostgreSQL` for platform APIs
- `Redis` + `Celery` for async workflows and session coordination
- A separate Python orchestrator for disposable lab runtime management

## Workspace Layout

```text
hackers-campus/
├── apps/
│   ├── api/
│   ├── orchestrator/
│   └── web/
├── docs/
├── infrastructure/
├── packages/
├── rooms/
└── tests/
```

## Quick Start

1. Install `pnpm`, `Node.js LTS`, `Python 3.12+`, `uv`, `Docker`, `PostgreSQL`, and `Redis`.
2. Copy `.env.example` to `.env` and update values.
3. Install frontend dependencies:

   ```bash
   pnpm install
   ```

4. Install Python dependencies for each service:

   ```bash
   cd apps/api && uv sync
   cd ../orchestrator && uv sync
   ```

5. Start local infrastructure:

   ```bash
   docker compose up -d postgres redis minio
   ```

6. Run the web app and API in separate shells:

   ```bash
   pnpm --filter @hackers-campus/web dev
   cd apps/api && uv run fastapi dev main.py
   ```

## Design Direction

The default UI adopts the attached mission-control design system:

- charcoal surfaces
- neon-lime action color
- IBM Plex Sans + Courier Prime
- dense dashboard layout for labs, skills, and progress

More detail lives in [docs/architecture.md](/C:/Users/shree/Desktop/hackers-campus/docs/architecture.md) and the extracted reference assets under `reference/design-system/`.

