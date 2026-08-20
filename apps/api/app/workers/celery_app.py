from celery import Celery
from app.core.config import settings

celery_app = Celery(
    "hackers-campus-api",
    broker=settings.redis_url,
    backend=settings.redis_url,
    include=["app.workers.tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    beat_schedule={
        "cleanup-expired-sessions-every-5m": {
            "task": "app.workers.tasks.cleanup_expired_sessions_task",
            "schedule": 300.0,  # every 5 minutes
        },
        "healthcheck-containers-every-1m": {
            "task": "app.workers.tasks.healthcheck_containers_task",
            "schedule": 60.0,  # every 1 minute
        },
    },
)
