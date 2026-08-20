from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import admin, auth, ctf, health, practice, profile, rooms, curriculum
from app.core.config import settings


def create_app() -> FastAPI:
    app = FastAPI(
        title="Hackers Campus API",
        version="0.1.0",
        description="Core platform APIs for authentication, rooms, practice labs, CTF events, profiles, and orchestrator sessions.",
    )
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix=settings.api_prefix)
    app.include_router(auth.router, prefix=settings.api_prefix)
    app.include_router(rooms.router, prefix=settings.api_prefix)
    app.include_router(practice.router, prefix=settings.api_prefix)
    app.include_router(ctf.router, prefix=settings.api_prefix)
    app.include_router(profile.router, prefix=settings.api_prefix)
    app.include_router(admin.router, prefix=settings.api_prefix)
    app.include_router(curriculum.router, prefix=settings.api_prefix)

    return app
