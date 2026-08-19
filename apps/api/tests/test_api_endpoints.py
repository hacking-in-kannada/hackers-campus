from fastapi.testclient import TestClient
from app.main import create_app


def test_api_endpoints() -> None:
    client = TestClient(create_app())

    # Healthcheck
    health_resp = client.get("/api/health")
    assert health_resp.status_code == 200
    assert health_resp.json() == {"status": "ok"}

    # Rooms
    rooms_resp = client.get("/api/rooms")
    assert rooms_resp.status_code == 200
    assert len(rooms_resp.json()) >= 2

    # Practice Challenges
    practice_resp = client.get("/api/practice/challenges")
    assert practice_resp.status_code == 200
    assert len(practice_resp.json()) >= 2

    # Flag submission
    flag_resp = client.post(
        "/api/practice/submit-flag",
        json={"challenge_id": "pc-01", "task_id": "t3", "flag": "HC{jwt_none_alg_pwned_4981a}"},
    )
    assert flag_resp.status_code == 200
    assert flag_resp.json()["correct"] is True

    # CTF Event & Scoreboard
    ctf_resp = client.get("/api/ctf/events/active")
    assert ctf_resp.status_code == 200
    assert ctf_resp.json()["id"] == "cs-spring-2026"

    scoreboard_resp = client.get("/api/ctf/scoreboard")
    assert scoreboard_resp.status_code == 200
    assert len(scoreboard_resp.json()) >= 3

    # Profile
    profile_resp = client.get("/api/profile/me")
    assert profile_resp.status_code == 200
    assert profile_resp.json()["username"] == "pavanreddyx7"

    # Admin Telemetry & Labs
    admin_telemetry = client.get("/api/admin/telemetry")
    assert admin_telemetry.status_code == 200
    assert admin_telemetry.json()["active_containers"] == 42
