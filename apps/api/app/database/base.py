from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.core.config import settings
from app.database.models import (
    Base,
    LabSession,
    PracticeChallenge,
    PracticeTask,
    Room,
    RoomTask,
    Submission,
    User,
)

# SQLite fallback or PostgreSQL engine
engine_url = settings.database_url
if "postgresql" in engine_url:
    # Ensure psycopg engine format
    pass

engine = create_engine(
    engine_url,
    echo=settings.environment == "development",
    pool_pre_ping=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


__all__ = [
    "Base",
    "User",
    "Room",
    "RoomTask",
    "PracticeChallenge",
    "PracticeTask",
    "LabSession",
    "Submission",
    "engine",
    "SessionLocal",
    "get_db",
]
