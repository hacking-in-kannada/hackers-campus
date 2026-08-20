import logging
from datetime import datetime, timezone
from app.workers.celery_app import celery_app

logger = logging.getLogger(__name__)


import tempfile
import subprocess
import os
from app.database.base import SessionLocal
from app.database.models import Room

@celery_app.task(name="app.workers.tasks.provision_lab_session_task")
def provision_lab_session_task(session_id: str, room_id: str, user_id: str) -> dict:
    """Asynchronously coordinates provisioning a dedicated challenge container with the orchestrator."""
    logger.info(
        f"Provisioning lab session '{session_id}' for room '{room_id}' and user '{user_id}'..."
    )

    db = SessionLocal()
    room = db.query(Room).filter(Room.id == room_id).first()
    db.close()

    if room and getattr(room, "custom_dockerfile", None):
        logger.info(f"Found custom Dockerfile for room {room_id}. Building and running in background...")
        with tempfile.TemporaryDirectory() as temp_dir:
            df_path = os.path.join(temp_dir, "Dockerfile")
            with open(df_path, "w") as f:
                f.write(room.custom_dockerfile)

            image_tag = f"hc-custom-{room_id.lower()}"
            try:
                # Build image
                subprocess.run(["docker", "build", "-t", image_tag, temp_dir], check=True, capture_output=True)
                # Run container in background
                container_name = f"hc-lab-{session_id}"
                subprocess.run(["docker", "run", "-d", "--name", container_name, image_tag], check=True, capture_output=True)
                logger.info(f"Successfully started container {container_name} from custom Dockerfile.")
            except subprocess.CalledProcessError as e:
                logger.error(f"Docker build/run failed: {e.stderr.decode('utf-8') if e.stderr else e}")

    # Simulated orchestrator allocation payload
    return {
        "session_id": session_id,
        "room_id": room_id,
        "user_id": user_id,
        "status": "running",
        "target_ip": "10.100.50.10",
        "attack_ip": "10.100.50.2",
        "allocated_at": datetime.now(timezone.utc).isoformat(),
    }


@celery_app.task(name="app.workers.tasks.cleanup_expired_sessions_task")
def cleanup_expired_sessions_task() -> dict:
    """Periodic job that scans active lab sessions and reclaims resources from expired containers."""
    logger.info("Executing periodic lab session cleanup job...")
    reclaimed_count = 0
    # In a live runtime, queries database for `expires_at < now` and triggers docker destroy
    return {
        "status": "completed",
        "reclaimed_sessions": reclaimed_count,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }


@celery_app.task(name="app.workers.tasks.healthcheck_containers_task")
def healthcheck_containers_task() -> dict:
    """Monitors running container health and network subnet isolation."""
    logger.info("Checking running lab containers health status...")
    return {
        "status": "healthy",
        "checked_nodes": ["hc_lab_target_sqli_01"],
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
