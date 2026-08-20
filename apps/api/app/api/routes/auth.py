import secrets
from typing import Optional
from uuid import uuid4

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError
from fastapi import APIRouter, Depends, Header, HTTPException, status
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session

from app.database.base import get_db
from app.database.models import User

router = APIRouter(prefix="/auth", tags=["auth"])
password_hasher = PasswordHasher()
issued_tokens: dict[str, str] = {}

class UserRegisterRequest(BaseModel):
    username: str = Field(min_length=3, max_length=64)
    email: str
    password: str = Field(min_length=4)
    display_name: Optional[str] = None

class UserLoginRequest(BaseModel):
    username: str
    password: str

class AuthTokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    username: str
    role: str

class UserSessionResponse(BaseModel):
    id: str
    username: str
    email: str
    display_name: str
    role: str
    level: int
    xp: int

def response_for(user: User) -> AuthTokenResponse:
    token = secrets.token_urlsafe(32)
    issued_tokens[token] = user.id
    return AuthTokenResponse(access_token=token, user_id=user.id, username=user.username, role=user.role)

def require_admin(authorization: Optional[str] = Header(default=None), db: Session = Depends(get_db)) -> User:
    token = authorization.removeprefix("Bearer ").strip() if authorization else ""
    user_id = issued_tokens.get(token)
    user = db.get(User, user_id) if user_id else None
    if not user or not user.is_active or user.role != "admin":
        raise HTTPException(status_code=403, detail="Administrator authentication is required")
    return user


def require_user(authorization: Optional[str] = Header(default=None), db: Session = Depends(get_db)) -> User:
    """Require any active signed-in user for learner-owned lab sessions."""
    token = authorization.removeprefix("Bearer ").strip() if authorization else ""
    user_id = issued_tokens.get(token)
    user = db.get(User, user_id) if user_id else None
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Please sign in before starting a machine")
    return user

@router.post("/register", response_model=AuthTokenResponse, status_code=status.HTTP_201_CREATED)
def register(req: UserRegisterRequest, db: Session = Depends(get_db)):
    if db.query(User.id).filter((User.username == req.username) | (User.email == req.email)).first():
        raise HTTPException(status_code=409, detail="Username or email is already registered")
    user = User(id=f"usr-{uuid4().hex[:12]}", username=req.username, email=req.email, display_name=req.display_name or req.username, hashed_password=password_hasher.hash(req.password), role="student")
    db.add(user)
    db.commit()
    db.refresh(user)
    return response_for(user)

@router.post("/login", response_model=AuthTokenResponse)
def login(req: UserLoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == req.username).first()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    try:
        password_hasher.verify(user.hashed_password, req.password)
    except VerifyMismatchError:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return response_for(user)

@router.get("/me", response_model=UserSessionResponse)
def get_current_user(username: str, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username, User.is_active.is_(True)).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
