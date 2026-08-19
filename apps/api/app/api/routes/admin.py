from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

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
