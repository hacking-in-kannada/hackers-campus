import os
import re
import subprocess
import tempfile

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from pydantic import BaseModel
from typing import List
from sqlalchemy.orm import Session, joinedload

from app.database.base import get_db
from app.database.models import PracticeChallenge
from app.api.routes.practice import PracticeChallengeModel
from app.api.routes.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

class AdminTelemetry(BaseModel):
    active_containers: int
    cpu_percent: float
    memory_gb: float
    online_users: int

class LabSessionModel(BaseModel):
    id: str
    username: str
    target_ip: str
    runtime: str
    status: str

@router.get("/telemetry", response_model=AdminTelemetry)
async def get_cluster_telemetry():
    return AdminTelemetry(
        active_containers=42,
        cpu_percent=38.4,
        memory_gb=24.8,
        online_users=128,
    )

@router.get("/labs", response_model=List[LabSessionModel])
async def list_active_labs():
    return [
        {
            "id": "sess-8941",
            "username": "pavanreddyx7",
            "target_ip": "10.10.110.45",
            "runtime": "docker",
            "status": "running",
        },
        {
            "id": "sess-8942",
            "username": "alex_pwn_master",
            "target_ip": "10.10.110.220",
            "runtime": "docker",
            "status": "running",
        },
    ]


@router.get("/challenges", response_model=List[PracticeChallengeModel])
def list_admin_challenges(db: Session = Depends(get_db)):
    """Return every challenge, including drafts, for the management console."""
    return db.query(PracticeChallenge).options(joinedload(PracticeChallenge.tasks)).order_by(PracticeChallenge.created_at.desc()).all()


@router.post("/docker-images/upload")
async def upload_docker_image(
    archive: UploadFile = File(...),
    expected_image: str = Form(default=""),
    _admin=Depends(require_admin),
):
    """Load an administrator-uploaded Docker archive and always remove the temporary file."""
    if not archive.filename or not archive.filename.lower().endswith(".tar"):
        raise HTTPException(status_code=400, detail="Upload a Docker image archive ending in .tar")
    temp_path = ""
    try:
        with tempfile.NamedTemporaryFile(prefix="hc-image-", suffix=".tar", delete=False) as temp_file:
            temp_path = temp_file.name
            total_size = 0
            while chunk := await archive.read(1024 * 1024):
                total_size += len(chunk)
                if total_size > 5 * 1024 * 1024 * 1024:
                    raise HTTPException(status_code=413, detail="Docker archive exceeds the 5 GB limit")
                temp_file.write(chunk)
        result = subprocess.run(["docker", "load", "--input", temp_path], capture_output=True, text=True, timeout=900)
        if result.returncode != 0:
            raise HTTPException(status_code=422, detail=result.stderr.strip() or "Docker could not load this archive")
        loaded_images = re.findall(r"(?:Loaded image|Loaded image ID):\s*(.+)", result.stdout)
        if expected_image:
            inspect = subprocess.run(["docker", "image", "inspect", expected_image], capture_output=True, text=True, timeout=30)
            if inspect.returncode != 0:
                raise HTTPException(status_code=422, detail=f"Archive loaded, but image '{expected_image}' was not found")
        return {"message": "Docker image loaded", "loaded_images": loaded_images, "image": expected_image or (loaded_images[0] if loaded_images else "")}
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Docker image loading timed out")
    except FileNotFoundError:
        raise HTTPException(status_code=503, detail="Docker is not available on this server")
    except HTTPException:
        raise
    except Exception as error:
        raise HTTPException(status_code=500, detail=f"Docker archive processing failed: {error}")
    finally:
        await archive.close()
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)
