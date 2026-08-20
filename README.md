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

## Production lab networking

Each college must configure its own lab network in its deployment `.env`; the application does not hard-code a campus IP range. For direct TryHackMe-style target IPs and standard ports, reserve an unused DHCP-excluded range and use Docker `macvlan`. Example only (replace with that college's network values):

```dotenv
LAB_NETWORK_DRIVER=macvlan
LAB_NETWORK_PARENT=ens33
LAB_NETWORK_SUBNET=10.68.118.0/24
LAB_NETWORK_GATEWAY=10.68.118.200
LAB_NETWORK_IP_RANGE=10.68.118.160/27
```

Every lab then receives one IP from the reserved range and learners connect to its normal ports (`22`, `80`, etc.). Network administrators must reserve the chosen range before deployment.

If the lab server is a VMware virtual machine and the network blocks additional container MAC addresses, use `LAB_NETWORK_DRIVER=ipvlan` instead of `macvlan`. The remaining settings stay the same.

## Design Direction

The default UI adopts the attached mission-control design system:

- charcoal surfaces
- neon-lime action color
- IBM Plex Sans + Courier Prime
- dense dashboard layout for labs, skills, and progress

More detail lives in [docs/architecture.md](/C:/Users/shree/Desktop/hackers-campus/docs/architecture.md) and the extracted reference assets under `reference/design-system/`.
