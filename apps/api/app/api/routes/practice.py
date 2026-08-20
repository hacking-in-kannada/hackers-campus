import json
import os
import re
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path
from typing import List, Optional
from uuid import uuid4

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import PlainTextResponse
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session, joinedload

from app.database.base import get_db
from app.core.config import settings
from app.api.routes.auth import require_user
from app.database.models import LabSession, PracticeChallenge, PracticeTask, User

router = APIRouter(prefix="/practice", tags=["practice"])


class ChallengeTask(BaseModel):
    id: str
    task_number: str
    title: str
    description: str
    hint: Optional[str] = None
    xp: int

    class Config:
        from_attributes = True


class PracticeChallengeModel(BaseModel):
    id: str
    slug: str
    title: str
    category: str
    difficulty: str
    xp: int
    estimated_minutes: int
    description: str
    scenario: str
    target_ip: str
    target_hostname: str
    target_ports: str = ""
    container_image: Optional[str] = None
    roadmap_stage: Optional[str] = None
    module_id: Optional[str] = None
    is_published: bool
    tasks: List[ChallengeTask] = []

    class Config:
        from_attributes = True


class ChallengeTaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str = ""
    hint: Optional[str] = None
    flag: str = Field(min_length=1, max_length=255)
    xp: int = Field(default=25, ge=0)


class PracticeChallengeCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    slug: str = Field(min_length=1, max_length=128, pattern=r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
    category: str
    difficulty: str
    xp: int = Field(ge=0)
    estimated_minutes: int = Field(ge=1)
    description: str = ""
    scenario: str = ""
    target_ip: str = ""
    target_hostname: str = ""
    target_ports: str = ""
    container_image: Optional[str] = None
    roadmap_stage: Optional[str] = None
    module_id: Optional[str] = None
    is_published: bool = True
    tasks: List[ChallengeTaskCreate] = Field(default_factory=list, min_length=1)


class FlagSubmission(BaseModel):
    challenge_id: str
    task_id: str
    flag: str


class FlagResult(BaseModel):
    correct: bool
    awarded_xp: int
    message: str


class MachineEndpoint(BaseModel):
    container_port: int
    host_port: int


class MachineSessionResponse(BaseModel):
    status: str
    container_id: str
    machine_name: str
    target_ip: str
    endpoints: List[MachineEndpoint]
    expires_at: datetime


def challenge_query(db: Session):
    return db.query(PracticeChallenge).options(joinedload(PracticeChallenge.tasks))


@router.get("/challenges", response_model=List[PracticeChallengeModel])
def list_challenges(db: Session = Depends(get_db)):
    return challenge_query(db).filter(PracticeChallenge.is_published.is_(True)).order_by(PracticeChallenge.created_at.desc()).all()


@router.get("/vpn-profile")
def download_vpn_profile(user: User = Depends(require_user)):
    common_name, profile = _vpn_profile_for(user)
    return PlainTextResponse(
        profile,
        media_type="application/x-openvpn-profile",
        headers={"Content-Disposition": f'attachment; filename="hackers-campus-{common_name}.ovpn"'},
    )


@router.get("/challenges/{slug}", response_model=PracticeChallengeModel)
def get_challenge(slug: str, db: Session = Depends(get_db)):
    challenge = challenge_query(db).filter(
        (PracticeChallenge.slug == slug) | (PracticeChallenge.id == slug),
        PracticeChallenge.is_published.is_(True),
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge


@router.post("/challenges", response_model=PracticeChallengeModel, status_code=status.HTTP_201_CREATED)
def create_challenge(payload: PracticeChallengeCreate, db: Session = Depends(get_db)):
    if db.query(PracticeChallenge.id).filter_by(slug=payload.slug).first():
        raise HTTPException(status_code=409, detail="A challenge with this slug already exists")
    challenge = PracticeChallenge(id=f"pc-{uuid4().hex[:12]}", **payload.model_dump(exclude={"tasks"}))
    for index, task in enumerate(payload.tasks, start=1):
        challenge.tasks.append(PracticeTask(id=f"pt-{uuid4().hex[:12]}", challenge_id=challenge.id, task_number=f"{index:02d}", **task.model_dump()))
    db.add(challenge)
    db.commit()
    db.refresh(challenge)
    return challenge


@router.delete("/challenges/{challenge_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_challenge(challenge_id: str, db: Session = Depends(get_db)):
    challenge = db.get(PracticeChallenge, challenge_id)
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    db.delete(challenge)
    db.commit()


def _machine_name(challenge: PracticeChallenge, user: User) -> str:
    safe_challenge = re.sub(r"[^a-z0-9-]", "-", challenge.slug.lower())
    safe_user = re.sub(r"[^a-z0-9-]", "-", user.id.lower())
    return f"hc-practice-{safe_challenge}-{safe_user}"[:120]


def _docker_inspect(container_name: str) -> dict:
    result = subprocess.run(
        ["docker", "inspect", container_name], capture_output=True, text=True, timeout=30
    )
    if result.returncode != 0:
        raise RuntimeError(result.stderr.strip() or "Docker could not inspect the machine")
    return json.loads(result.stdout)[0]


def _machine_response(container: dict, machine_name: str, challenge: PracticeChallenge, expires_at: datetime) -> MachineSessionResponse:
    network = container.get("NetworkSettings", {}).get("Networks", {}).get(settings.lab_network_name, {})
    target_ip = network.get("IPAddress", "")
    if not target_ip:
        raise RuntimeError("Docker did not assign a target IP address")
    port_values = [value.strip() for value in challenge.target_ports.split(",") if value.strip()]
    ports = {int(value) for value in port_values if value.isdigit()}
    ports.update(
        int(port.split("/", 1)[0])
        for port in (container.get("Config", {}).get("ExposedPorts", {}) or {})
        if port.split("/", 1)[0].isdigit()
    )
    endpoints = [MachineEndpoint(container_port=port, host_port=port) for port in sorted(ports)]
    return MachineSessionResponse(
        status="running",
        container_id=container["Id"][:12],
        machine_name=machine_name,
        target_ip=target_ip,
        endpoints=endpoints,
        expires_at=expires_at,
    )


def _stop_machine(machine_name: str) -> None:
    removed = subprocess.run(["docker", "rm", "-f", machine_name], capture_output=True, text=True, timeout=60)
    if removed.returncode != 0 and "No such container" not in removed.stderr:
        raise RuntimeError(removed.stderr.strip() or "Docker could not terminate the machine")


def _safe_vpn_common_name(user: User) -> str:
    return re.sub(r"[^a-zA-Z0-9_-]", "-", user.username)[:48] or user.id[-12:]


def _vpn_profile_for(user: User) -> tuple[str, str]:
    vpn_dir = Path(settings.vpn_pki_dir)
    pki_dir = vpn_dir / "pki"
    common_name = _safe_vpn_common_name(user)
    certificate = pki_dir / "issued" / f"{common_name}.crt"
    private_key = pki_dir / "private" / f"{common_name}.key"
    ca_certificate = pki_dir / "ca.crt"
    tls_key = vpn_dir / "ta.key"
    if not all(path.is_file() for path in (ca_certificate, tls_key)):
        raise HTTPException(status_code=503, detail="VPN certificate authority is not configured")
    if not certificate.is_file() or not private_key.is_file():
        easyrsa = vpn_dir / "easyrsa"
        if not easyrsa.is_file():
            raise HTTPException(status_code=503, detail="VPN profile generator is not configured")
        result = subprocess.run(
            [str(easyrsa), "--batch", "build-client-full", common_name, "nopass"],
            cwd=vpn_dir,
            env={**os.environ, "EASYRSA_BATCH": "1"},
            capture_output=True,
            text=True,
            timeout=60,
        )
        if result.returncode != 0 or not certificate.is_file() or not private_key.is_file():
            raise HTTPException(status_code=503, detail="Unable to create the personal VPN profile")

    def inline(tag: str, file_path: Path) -> str:
        return f"<{tag}>\n{file_path.read_text().strip()}\n</{tag}>"

    profile = "\n".join([
        "client", "dev tun", "proto udp4", f"remote {settings.vpn_remote_host} {settings.vpn_remote_port}",
        "nobind", "persist-key", "persist-tun", "remote-cert-tls server",
        "data-ciphers AES-256-GCM:AES-128-GCM", "data-ciphers-fallback AES-256-GCM", "cipher AES-256-GCM", "auth SHA256",
        inline("ca", ca_certificate), inline("cert", certificate), inline("key", private_key), inline("tls-crypt", tls_key), "verb 3", "",
    ])
    return common_name, profile


@router.post("/challenges/{slug}/machine/start", response_model=MachineSessionResponse)
def start_machine(
    slug: str,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    challenge = challenge_query(db).filter(
        PracticeChallenge.slug == slug, PracticeChallenge.is_published.is_(True)
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    if not challenge.container_image:
        raise HTTPException(status_code=400, detail="This challenge has no Docker image configured")

    machine_name = _machine_name(challenge, user)
    expires_at = datetime.now(timezone.utc) + timedelta(hours=2)
    try:
        network_check = subprocess.run(["docker", "network", "inspect", settings.lab_network_name], capture_output=True, text=True, timeout=30)
        if network_check.returncode != 0:
            create_network = [
                "docker", "network", "create", "--driver", settings.lab_network_driver,
                "--subnet", settings.lab_network_subnet, "--gateway", settings.lab_network_gateway,
            ]
            if settings.lab_network_ip_range:
                create_network.extend(["--ip-range", settings.lab_network_ip_range])
            if settings.lab_network_driver in {"macvlan", "ipvlan"}:
                if not settings.lab_network_parent:
                    raise RuntimeError("LAB_NETWORK_PARENT is required when using a LAN lab network driver")
                create_network.extend(["-o", f"parent={settings.lab_network_parent}"])
            if settings.lab_network_driver == "ipvlan":
                create_network.extend(["-o", "ipvlan_mode=l2"])
            create_network.append(settings.lab_network_name)
            created_network = subprocess.run(
                create_network,
                capture_output=True, text=True, timeout=30,
            )
            if created_network.returncode != 0:
                raise RuntimeError(created_network.stderr.strip() or "Docker could not create the lab network")
        image_check = subprocess.run(
            ["docker", "image", "inspect", challenge.container_image], capture_output=True, text=True, timeout=30
        )
        if image_check.returncode != 0:
            raise HTTPException(status_code=404, detail="The Docker image is not loaded on the lab server")

        existing = subprocess.run(["docker", "inspect", machine_name], capture_output=True, text=True, timeout=30)
        if existing.returncode == 0:
            current = json.loads(existing.stdout)[0]
            if settings.lab_network_name not in current.get("NetworkSettings", {}).get("Networks", {}):
                removed = subprocess.run(["docker", "rm", "-f", machine_name], capture_output=True, text=True, timeout=60)
                if removed.returncode != 0:
                    raise RuntimeError(removed.stderr.strip() or "Docker could not replace the old machine")
                existing = subprocess.CompletedProcess([], 1)
            elif not current.get("State", {}).get("Running"):
                restarted = subprocess.run(["docker", "start", machine_name], capture_output=True, text=True, timeout=60)
                if restarted.returncode != 0:
                    raise RuntimeError(restarted.stderr.strip() or "Docker could not start the existing machine")
                current = _docker_inspect(machine_name)
        if existing.returncode != 0:
            launched = subprocess.run(
                ["docker", "run", "-d", "--name", machine_name, "--network", settings.lab_network_name, "--label", f"hackers-campus.challenge={challenge.id}", "--label", f"hackers-campus.user={user.id}", challenge.container_image],
                capture_output=True, text=True, timeout=90,
            )
            if launched.returncode != 0:
                raise RuntimeError(launched.stderr.strip() or "Docker could not launch the machine")
            current = _docker_inspect(machine_name)
    except HTTPException:
        raise
    except (OSError, subprocess.TimeoutExpired, RuntimeError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=503, detail=f"Unable to start the Docker machine: {exc}") from exc

    session = db.query(LabSession).filter(LabSession.container_id == current["Id"]).first()
    if not session:
        session = LabSession(
            id=f"lab-{uuid4().hex[:12]}", user_id=user.id, runtime="docker", container_id=current["Id"],
            status="running", expires_at=expires_at,
        )
        db.add(session)
    else:
        session.status = "running"
        session.expires_at = expires_at
    session.target_ip = current.get("NetworkSettings", {}).get("Networks", {}).get(settings.lab_network_name, {}).get("IPAddress", "")
    db.commit()
    return _machine_response(current, machine_name, challenge, expires_at)


@router.get("/challenges/{slug}/machine", response_model=MachineSessionResponse)
def get_machine(
    slug: str,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    challenge = challenge_query(db).filter(
        PracticeChallenge.slug == slug, PracticeChallenge.is_published.is_(True)
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    machine_name = _machine_name(challenge, user)
    existing = subprocess.run(["docker", "inspect", machine_name], capture_output=True, text=True, timeout=30)
    if existing.returncode != 0:
        raise HTTPException(status_code=404, detail="No active machine")
    current = json.loads(existing.stdout)[0]
    session = db.query(LabSession).filter(LabSession.container_id == current["Id"]).first()
    expires_at = session.expires_at if session and session.expires_at else datetime.now(timezone.utc) + timedelta(hours=2)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at <= datetime.now(timezone.utc):
        _stop_machine(machine_name)
        if session:
            session.status = "expired"
            db.commit()
        raise HTTPException(status_code=410, detail="Machine session has expired")
    if not current.get("State", {}).get("Running"):
        raise HTTPException(status_code=404, detail="No active machine")
    return _machine_response(current, machine_name, challenge, expires_at)


@router.delete("/challenges/{slug}/machine", status_code=status.HTTP_204_NO_CONTENT)
def terminate_machine(
    slug: str,
    user: User = Depends(require_user),
    db: Session = Depends(get_db),
):
    challenge = challenge_query(db).filter(
        PracticeChallenge.slug == slug, PracticeChallenge.is_published.is_(True)
    ).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    machine_name = _machine_name(challenge, user)
    try:
        existing = subprocess.run(["docker", "inspect", machine_name], capture_output=True, text=True, timeout=30)
        container_id = json.loads(existing.stdout)[0]["Id"] if existing.returncode == 0 else None
        _stop_machine(machine_name)
    except (OSError, subprocess.TimeoutExpired, RuntimeError) as exc:
        raise HTTPException(status_code=503, detail=f"Unable to terminate the machine: {exc}") from exc
    if container_id:
        session = db.query(LabSession).filter(LabSession.container_id == container_id).first()
        if session:
            session.status = "terminated"
            session.target_ip = ""
    db.commit()


@router.post("/submit-flag", response_model=FlagResult)
def submit_flag(submission: FlagSubmission, db: Session = Depends(get_db)):
    task = db.get(PracticeTask, submission.task_id)
    if not task or task.challenge_id != submission.challenge_id:
        raise HTTPException(status_code=404, detail="Challenge task not found")
    if submission.flag == task.flag:
        return FlagResult(correct=True, awarded_xp=task.xp, message="Flag accepted! Challenge completed.")
    return FlagResult(correct=False, awarded_xp=0, message="Incorrect flag. Inspect tool output and try again.")
