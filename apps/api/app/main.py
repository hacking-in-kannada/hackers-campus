from fastapi import FastAPI

from app.api.routes import health, rooms
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title="Hackers Campus API",
        version="0.1.0",
        description="Core platform APIs for authentication, rooms, sessions, and progress.",
    )

    app.include_router(health.router, prefix=settings.api_prefix)
    app.include_router(rooms.router, prefix=settings.api_prefix)

    return app

