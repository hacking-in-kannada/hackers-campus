from fastapi.testclient import TestClient
from app.main import create_app
from app.workers.tasks import (
    cleanup_expired_sessions_task,
    healthcheck_containers_task,
    provision_lab_session_task,
)


def test_full_lab_session_and_submission_lifecycle():
    """End-to-end user journey: Register -> Browse Rooms -> Provision Lab -> Submit Flag -> Session Cleanup."""
    client = TestClient(create_app())

    # 1. User registers and obtains access token
    reg_resp = client.post(
        "/api/auth/register",
        json={
            "username": "student_elite",
            "email": "elite@hackerscampus.internal",
            "password": "HackersCampus2026!",
        },
    )
    assert reg_resp.status_code == 201
    auth_data = reg_resp.json()
    assert "access_token" in auth_data
    token = auth_data["access_token"]
    assert token.startswith("hc_tok_")

    # 2. Student queries available rooms and challenges
    rooms_resp = client.get("/api/rooms")
    assert rooms_resp.status_code == 200
    rooms = rooms_resp.json()
    assert any(r["id"] == "sql-injection-01" for r in rooms)

    # 3. Student requests lab provisioning (asynchronously coordinated by Celery worker task)
    provision_result = provision_lab_session_task(
        session_id="sess-integ-9901",
        room_id="sql-injection-01",
        user_id=auth_data["user_id"],
    )
    assert provision_result["status"] == "running"
    assert provision_result["target_ip"] == "10.100.50.10"

    # 4. Student validates target connectivity and submits challenge flag
    flag_resp = client.post(
        "/api/practice/submit-flag",
        json={
            "challenge_id": "sql-injection-01",
            "task_id": "t1",
            "flag": "HC{sql_injection_union_select_admin_pwned}",
        },
    )
    assert flag_resp.status_code == 200
    flag_result = flag_resp.json()
    assert flag_result["correct"] is True
    assert flag_result["awarded_xp"] > 0

    # 5. Background monitoring & cleanup checks
    health_result = healthcheck_containers_task()
    assert health_result["status"] == "healthy"

    cleanup_result = cleanup_expired_sessions_task()
    assert cleanup_result["status"] == "completed"
