from orchestrator.providers.base import RuntimeProvider


class LifecycleService:
    def __init__(self, provider: RuntimeProvider) -> None:
        self.provider = provider

    def provision(self, session_id: str, room_id: str) -> dict[str, str | None]:
        status = self.provider.create(session_id=session_id, room_id=room_id)
        return {
            "session_id": status.session_id,
            "state": status.state,
            "target_ip": status.target_ip,
        }

