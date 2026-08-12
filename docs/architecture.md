# Architecture

## Core Stack

- Web: `Next.js`, `React`, `TypeScript`, `Tailwind CSS`, `shadcn/ui`, `Radix UI`
- API: `FastAPI`, `Pydantic`, `SQLAlchemy`, `Alembic`
- Data: `PostgreSQL`, `Redis`
- Workers: `Celery`
- Runtime: Python orchestrator + `Docker` first, `VirtualBox` for full-machine labs
- Infra: `Nginx`, `Docker Compose`, `Prometheus`, `Grafana`, `Loki`

## Monorepo Shape

```text
apps/
  web/            Next.js application shell
  api/            FastAPI service
  orchestrator/   Runtime lifecycle and provider abstraction
packages/
  config/         Shared TS config
  shared-types/   Frontend domain types
rooms/
  web/            Docker-first challenge packages
infrastructure/
  docker/         Local services
  nginx/          Reverse proxy config
  monitoring/     Metrics bootstrap
```

## Design System

The frontend starter follows the extracted Cyber-Sentinel design system:

- background canvas: `#090E12`
- elevated panels: `#10171D`
- secondary surfaces: `#0C1217`
- primary accent: `#9DFF00`
- body font: `IBM Plex Sans`
- mono font: `Courier Prime`

## First Build Priorities

1. Stand up the web shell and API locally.
2. Replace demo room data with database-backed models.
3. Add auth, session orchestration, and submission flows.
4. Implement Docker room build, healthcheck, and cleanup jobs.
5. Add Playwright, Pytest, and room lifecycle integration tests.

