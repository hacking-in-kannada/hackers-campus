from typing import List, Optional
from pydantic import BaseModel

class ModuleBase(BaseModel):
    title: str
    slug: str
    description: Optional[str] = ""
    category: str = "foundation"
    stage: str = "foundation"
    estimated_minutes: int = 60
    order_number: int = 1

class ModuleCreate(ModuleBase):
    path_id: Optional[str] = None

class ModuleResponse(ModuleBase):
    id: str
    path_id: Optional[str] = None

    class Config:
        from_attributes = True

class LearningPathBase(BaseModel):
    title: str
    slug: str
    tagline: Optional[str] = ""
    description: Optional[str] = ""
    category: str = "Red Team"
    difficulty: str = "Beginner"
    estimated_hours: int = 40

class LearningPathCreate(LearningPathBase):
    pass

class LearningPathResponse(LearningPathBase):
    id: str
    modules: List[ModuleResponse] = []

    class Config:
        from_attributes = True
