from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter(prefix="/profile", tags=["profile"])

class SkillModel(BaseModel):
    label: str
    level: int
    description: str

class ProfileModel(BaseModel):
    display_name: str
    username: str
    level: int
    level_title: str
    current_xp: int
    next_level_xp: int
    global_rank: int
    streak_days: int
    skills: List[SkillModel]

@router.get("/me", response_model=ProfileModel)
async def get_my_profile():
    return {
        "display_name": "Pavan Reddy",
        "username": "pavanreddyx7",
        "level": 12,
        "level_title": "Cyber Sentinel",
        "current_xp": 2450,
        "next_level_xp": 3000,
        "global_rank": 142,
        "streak_days": 7,
        "skills": [
            {"label": "Web Security", "level": 88, "description": "OWASP Top 10, JWT, GraphQL"},
            {"label": "Active Directory", "level": 82, "description": "Kerberoasting, BloodHound"},
            {"label": "Linux Hardening", "level": 91, "description": "SUID, capabilities, kernel"},
            {"label": "Network Security", "level": 74, "description": "Wireshark, Nmap, VLAN"},
            {"label": "Digital Forensics", "level": 65, "description": "Volatility, memory triage"},
            {"label": "Cloud Security", "level": 70, "description": "AWS IAM, Kubernetes RBAC"},
        ],
    }
