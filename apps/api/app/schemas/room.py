from typing import Literal

from pydantic import BaseModel


class RoomSummary(BaseModel):
    id: str
    title: str
    category: str
    difficulty: Literal["Beginner", "Intermediate", "Advanced"]
    runtime: Literal["docker", "virtualbox"]
    estimated_minutes: int
    custom_dockerfile: str | None = None

    class Config:
        from_attributes = True

class RoomCreate(BaseModel):
    title: str
    category: str = "Web Security"
    difficulty: Literal["Beginner", "Intermediate", "Advanced"] = "Beginner"
    runtime: Literal["docker", "virtualbox"] = "docker"
    estimated_minutes: int = 60
    description: str = ""
    custom_dockerfile: str | None = None

