from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional

router = APIRouter(prefix="/ctf", tags=["ctf"])

class CTFChallengeModel(BaseModel):
    id: str
    title: str
    category: str
    points: int
    solved_count: int
    is_solved_by_team: bool
    first_blood_by: Optional[str] = None
    difficulty: str
    description: str

class ScoreboardEntryModel(BaseModel):
    rank: int
    team_name: str
    avatar: str
    points: int
    solved_count: int
    last_solve_time: str
    country: str
    is_current_user_team: bool = False

@router.get("/events/active")
async def get_active_event():
    return {
        "id": "cs-spring-2026",
        "title": "CyberSentinel 2026 Spring CTF",
        "tagline": "Global collegiate & industry jeopardy cybersecurity challenge",
        "status": "live",
        "team_count": 342,
        "registered_team": {
            "name": "0xNullPointers",
            "rank": 4,
            "points": 3850,
            "solved_count": 14,
        },
    }

@router.get("/scoreboard", response_model=List[ScoreboardEntryModel])
async def get_scoreboard():
    return [
        {
            "rank": 1,
            "team_name": "KernelPanic_Elite",
            "avatar": "KP",
            "points": 4650,
            "solved_count": 16,
            "last_solve_time": "12 mins ago",
            "country": "US",
            "is_current_user_team": False,
        },
        {
            "rank": 2,
            "team_name": "TeamБинар",
            "avatar": "TB",
            "points": 4200,
            "solved_count": 15,
            "last_solve_time": "24 mins ago",
            "country": "SE",
            "is_current_user_team": False,
        },
        {
            "rank": 4,
            "team_name": "0xNullPointers",
            "avatar": "NP",
            "points": 3850,
            "solved_count": 14,
            "last_solve_time": "1 hr ago",
            "country": "IN",
            "is_current_user_team": True,
        },
    ]
