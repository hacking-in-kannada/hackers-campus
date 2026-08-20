from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.database.models import LearningPath, Module
from app.schemas.curriculum import (
    LearningPathCreate,
    LearningPathResponse,
    ModuleCreate,
    ModuleResponse,
)

router = APIRouter(prefix="/curriculum", tags=["Curriculum"])


@router.get("/paths", response_model=List[LearningPathResponse])
def get_learning_paths(db: Session = Depends(get_db)):
    paths = db.query(LearningPath).all()
    return paths


@router.post("/paths", response_model=LearningPathResponse, status_code=status.HTTP_201_CREATED)
def create_learning_path(path_in: LearningPathCreate, db: Session = Depends(get_db)):
    import uuid
    new_id = f"path-{uuid.uuid4().hex[:8]}"
    db_path = LearningPath(
        id=new_id,
        slug=path_in.slug,
        title=path_in.title,
        tagline=path_in.tagline,
        description=path_in.description,
        category=path_in.category,
        difficulty=path_in.difficulty,
        estimated_hours=path_in.estimated_hours,
    )
    db.add(db_path)
    db.commit()
    db.refresh(db_path)
    return db_path


@router.get("/modules", response_model=List[ModuleResponse])
def get_modules(db: Session = Depends(get_db)):
    modules = db.query(Module).all()
    return modules


@router.post("/modules", response_model=ModuleResponse, status_code=status.HTTP_201_CREATED)
def create_module(module_in: ModuleCreate, db: Session = Depends(get_db)):
    import uuid
    new_id = f"mod-{uuid.uuid4().hex[:8]}"
    db_module = Module(
        id=new_id,
        slug=module_in.slug,
        title=module_in.title,
        description=module_in.description,
        category=module_in.category,
        path_id=module_in.path_id,
        stage=module_in.stage,
        estimated_minutes=module_in.estimated_minutes,
        order_number=module_in.order_number,
    )
    db.add(db_module)
    db.commit()
    db.refresh(db_module)
    return db_module


@router.delete("/paths/{path_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_learning_path(path_id: str, db: Session = Depends(get_db)):
    path = db.get(LearningPath, path_id)
    if not path:
        raise HTTPException(status_code=404, detail="Learning path not found")
    db.delete(path)
    db.commit()


@router.delete("/modules/{module_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_module(module_id: str, db: Session = Depends(get_db)):
    module = db.get(Module, module_id)
    if not module:
        raise HTTPException(status_code=404, detail="Module not found")
    db.delete(module)
    db.commit()
