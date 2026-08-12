from orchestrator.models.runtime import RuntimeStatus


class VirtualBoxProvider:
    def create(self, session_id: str, room_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state=f"created:{room_id}")

    def start(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="running")

    def stop(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="stopped")

    def reset(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="resetting")

    def destroy(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="destroyed")

    def status(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="running")

    def health(self) -> dict[str, str]:
        return {"provider": "virtualbox", "status": "planned"}

    def get_ip(self, session_id: str) -> str | None:
        return None

