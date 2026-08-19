from fastapi import FastAPI

from app.api.routes import admin, ctf, health, practice, profile, rooms
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title="Hackers Campus API",
        version="0.1.0",
        description="Core platform APIs for authentication, rooms, practice labs, CTF events, profiles, and orchestrator sessions.",
    )

    app.include_router(health.router, prefix=settings.api_prefix)
    app.include_router(rooms.router, prefix=settings.api_prefix)
    app.include_router(practice.router, prefix=settings.api_prefix)
    app.include_router(ctf.router, prefix=settings.api_prefix)
    app.include_router(profile.router, prefix=settings.api_prefix)
    app.include_router(admin.router, prefix=settings.api_prefix)

    return app
