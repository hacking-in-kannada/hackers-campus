from dataclasses import dataclass


@dataclass(slots=True)
class SessionRequest:
    room_id: str
    user_id: str


class SessionService:
    """Coordinates lab session lifecycle with Redis and the orchestrator."""

    async def create_session(self, request: SessionRequest) -> dict[str, str]:
        return {
            "room_id": request.room_id,
            "user_id": request.user_id,
            "status": "queued",
        }

