from orchestrator.models.runtime import RuntimeStatus


class DockerProvider:
    def create(self, session_id: str, room_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state=f"created:{room_id}", target_ip="10.100.50.10")

    def start(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="running", target_ip="10.100.50.10")

    def stop(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="stopped")

    def reset(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="resetting")

    def destroy(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="destroyed")

    def status(self, session_id: str) -> RuntimeStatus:
        return RuntimeStatus(session_id=session_id, state="running", target_ip="10.100.50.10")

    def health(self) -> dict[str, str]:
        return {"provider": "docker", "status": "ok"}

    def get_ip(self, session_id: str) -> str | None:
        return "10.100.50.10"

