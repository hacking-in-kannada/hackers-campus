from typing import Literal

from pydantic import BaseModel


class RoomSummary(BaseModel):
    id: str
    title: str
    category: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    runtime: Literal["docker", "virtualbox"]
    estimated_minutes: int

