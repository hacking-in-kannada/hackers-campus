from fastapi import APIRouter

from app.schemas.room import RoomSummary

router = APIRouter(prefix="/rooms", tags=["rooms"])

DEMO_ROOMS = [
    RoomSummary(
        id="sql-injection-01",
        title="SQL Injection Basics",
        category="Web Security",
        difficulty="Beginner",
        runtime="docker",
        estimated_minutes=90,
    ),
    RoomSummary(
        id="kerberos-enum-01",
        title="Kerberos Enumeration",
        category="Active Directory",
        difficulty="Intermediate",
        runtime="virtualbox",
        estimated_minutes=120,
    ),
]


@router.get("", response_model=list[RoomSummary])
async def list_rooms() -> list[RoomSummary]:
    return DEMO_ROOMS

