from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from app.database.base import get_db
from app.database.models import Room
from app.schemas.room import RoomSummary, RoomCreate

router = APIRouter(prefix="/rooms", tags=["rooms"])

@router.get("", response_model=list[RoomSummary])
def list_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()

@router.post("", response_model=RoomSummary, status_code=status.HTTP_201_CREATED)
def create_room(room_in: RoomCreate, db: Session = Depends(get_db)):
    import uuid
    new_id = f"room-{uuid.uuid4().hex[:8]}"
    db_room = Room(
        id=new_id,
        title=room_in.title,
        category=room_in.category,
        difficulty=room_in.difficulty,
        runtime=room_in.runtime,
        estimated_minutes=room_in.estimated_minutes,
        description=room_in.description,
        custom_dockerfile=room_in.custom_dockerfile
    )
    db.add(db_room)
    db.commit()
    db.refresh(db_room)
    return db_room
