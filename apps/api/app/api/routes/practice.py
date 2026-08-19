from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/practice", tags=["practice"])

class ChallengeTask(BaseModel):
    id: str
    task_number: str
    title: str
    description: str
    xp: int
    completed: bool
    question_type: str
    flag_format: Optional[str] = None

class PracticeChallengeModel(BaseModel):
    id: str
    slug: str
    title: str
    category: str
    difficulty: str
    xp: int
    estimated_minutes: int
    solvers_count: int
    rating: float
    solved: bool
    type: str
    description: str
    tasks: List[ChallengeTask]

DEMO_CHALLENGES = [
    {
        "id": "pc-01",
        "slug": "jwt-auth-bypass",
        "title": "JWT None Algorithm Bypass",
        "category": "Web Security",
        "difficulty": "Easy",
        "xp": 100,
        "estimated_minutes": 15,
        "solvers_count": 1420,
        "rating": 4.9,
        "solved": True,
        "type": "quick",
        "description": "Exploit flawed JSON Web Token signature verification by forging an unsigned admin token with algorithm set to none.",
        "tasks": [
            {
                "id": "t1",
                "task_number": "01",
                "title": "Inspect Token Structure",
                "description": "Capture the authentication cookie from /api/auth/session and decode header/payload.",
                "xp": 25,
                "completed": True,
                "question_type": "flag",
                "flag_format": "HC{...}",
            },
            {
                "id": "t2",
                "task_number": "02",
                "title": "Forge Administrator Payload",
                "description": "Modify payload to admin role with alg set to none.",
                "xp": 35,
                "completed": True,
                "question_type": "text",
            },
            {
                "id": "t3",
                "task_number": "03",
                "title": "Extract the Root Flag",
                "description": "Submit forged token to GET /api/admin/vault.",
                "xp": 40,
                "completed": False,
                "question_type": "flag",
                "flag_format": "HC{...}",
            },
        ],
    },
    {
        "id": "pc-02",
        "slug": "suid-privilege-escalation",
        "title": "Linux SUID Binary Escalation",
        "category": "Linux",
        "difficulty": "Easy",
        "xp": 120,
        "estimated_minutes": 20,
        "solvers_count": 980,
        "rating": 4.8,
        "solved": False,
        "type": "quick",
        "description": "Locate misconfigured SUID binaries with GTFOBins techniques and elevate privileges to root.",
        "tasks": [],
    },
]

class FlagSubmission(BaseModel):
    challenge_id: str
    task_id: str
    flag: str

class FlagResult(BaseModel):
    correct: bool
    awarded_xp: int
    message: str

@router.get("/challenges", response_model=List[PracticeChallengeModel])
async def list_challenges():
    return DEMO_CHALLENGES

@router.get("/challenges/{slug}", response_model=PracticeChallengeModel)
async def get_challenge(slug: str):
    for c in DEMO_CHALLENGES:
        if c["slug"] == slug or c["id"] == slug:
            return c
    raise HTTPException(status_code=404, detail="Challenge not found")

@router.post("/submit-flag", response_model=FlagResult)
async def submit_flag(submission: FlagSubmission):
    if submission.flag.startswith("HC{") and len(submission.flag) > 8:
        return FlagResult(correct=True, awarded_xp=40, message="Flag accepted! Challenge completed.")
    return FlagResult(correct=False, awarded_xp=0, message="Incorrect flag. Inspect tool output and try again.")
