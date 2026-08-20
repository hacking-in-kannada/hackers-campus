from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    username: Mapped[str] = mapped_column(String(64), unique=True, index=True, nullable=False)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    display_name: Mapped[str] = mapped_column(String(128), default="")
    role: Mapped[str] = mapped_column(String(32), default="student")  # student, instructor, admin
    xp: Mapped[int] = mapped_column(Integer, default=0)
    level: Mapped[int] = mapped_column(Integer, default=1)
    streak_days: Mapped[int] = mapped_column(Integer, default=0)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    sessions: Mapped[List["LabSession"]] = relationship("LabSession", back_populates="user")
    submissions: Mapped[List["Submission"]] = relationship("Submission", back_populates="user")


class LearningPath(Base):
    __tablename__ = "learning_paths"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    tagline: Mapped[str] = mapped_column(Text, default="")
    description: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(64), default="Red Team")
    difficulty: Mapped[str] = mapped_column(String(32), default="Beginner")
    estimated_hours: Mapped[int] = mapped_column(Integer, default=40)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    modules: Mapped[List["Module"]] = relationship(
        "Module", back_populates="learning_path", cascade="all, delete-orphan"
    )


class Module(Base):
    __tablename__ = "modules"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    path_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("learning_paths.id"), nullable=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    category: Mapped[str] = mapped_column(String(64), default="foundation")
    stage: Mapped[str] = mapped_column(String(64), default="foundation")
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=60)
    order_number: Mapped[int] = mapped_column(Integer, default=1)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    learning_path: Mapped[Optional["LearningPath"]] = relationship("LearningPath", back_populates="modules")


class Room(Base):
    __tablename__ = "rooms"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Web Security")
    difficulty: Mapped[str] = mapped_column(String(32), default="Beginner")
    runtime: Mapped[str] = mapped_column(String(32), default="docker")  # docker, virtualbox
    custom_dockerfile: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=60)
    description: Mapped[str] = mapped_column(Text, default="")
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    tasks: Mapped[List["RoomTask"]] = relationship(
        "RoomTask", back_populates="room", cascade="all, delete-orphan"
    )
    sessions: Mapped[List["LabSession"]] = relationship("LabSession", back_populates="room")


class RoomTask(Base):
    __tablename__ = "room_tasks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    room_id: Mapped[str] = mapped_column(String(64), ForeignKey("rooms.id"), nullable=False)
    task_number: Mapped[int] = mapped_column(Integer, default=1)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    hint: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    flag: Mapped[str] = mapped_column(String(255), default="")
    xp: Mapped[int] = mapped_column(Integer, default=25)

    room: Mapped["Room"] = relationship("Room", back_populates="tasks")


class PracticeChallenge(Base):
    __tablename__ = "practice_challenges"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    slug: Mapped[str] = mapped_column(String(128), unique=True, index=True, nullable=False)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str] = mapped_column(String(64), default="Web Security")
    difficulty: Mapped[str] = mapped_column(String(32), default="Easy")
    xp: Mapped[int] = mapped_column(Integer, default=100)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=30)
    description: Mapped[str] = mapped_column(Text, default="")
    scenario: Mapped[str] = mapped_column(Text, default="")
    target_ip: Mapped[str] = mapped_column(String(64), default="10.10.110.45")
    target_hostname: Mapped[str] = mapped_column(String(128), default="target.local")
    target_ports: Mapped[str] = mapped_column(String(128), default="")
    container_image: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    roadmap_stage: Mapped[Optional[str]] = mapped_column(String(64), nullable=True)
    module_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("modules.id"), nullable=True)
    is_published: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    tasks: Mapped[List["PracticeTask"]] = relationship(
        "PracticeTask", back_populates="challenge", cascade="all, delete-orphan"
    )
    module: Mapped[Optional["Module"]] = relationship("Module")


class PracticeTask(Base):
    __tablename__ = "practice_tasks"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    challenge_id: Mapped[str] = mapped_column(
        String(64), ForeignKey("practice_challenges.id"), nullable=False
    )
    task_number: Mapped[str] = mapped_column(String(16), default="01")
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, default="")
    hint: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    flag: Mapped[str] = mapped_column(String(255), default="")
    xp: Mapped[int] = mapped_column(Integer, default=25)

    challenge: Mapped["PracticeChallenge"] = relationship("PracticeChallenge", back_populates="tasks")


class LabSession(Base):
    __tablename__ = "lab_sessions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), nullable=False)
    room_id: Mapped[Optional[str]] = mapped_column(String(64), ForeignKey("rooms.id"), nullable=True)
    runtime: Mapped[str] = mapped_column(String(32), default="docker")
    target_ip: Mapped[str] = mapped_column(String(64), default="10.100.50.10")
    attack_ip: Mapped[str] = mapped_column(String(64), default="10.100.50.2")
    container_id: Mapped[Optional[str]] = mapped_column(String(128), nullable=True)
    status: Mapped[str] = mapped_column(String(32), default="running")  # starting, running, stopped, errored
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User", back_populates="sessions")
    room: Mapped[Optional["Room"]] = relationship("Room", back_populates="sessions")


class Submission(Base):
    __tablename__ = "submissions"

    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    user_id: Mapped[str] = mapped_column(String(64), ForeignKey("users.id"), nullable=False)
    target_id: Mapped[str] = mapped_column(String(64), index=True, nullable=False)
    target_type: Mapped[str] = mapped_column(String(32), default="practice_task")  # room_task, practice_task
    flag: Mapped[str] = mapped_column(String(255), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, default=False)
    awarded_xp: Mapped[int] = mapped_column(Integer, default=0)
    submitted_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(timezone.utc)
    )

    user: Mapped["User"] = relationship("User", back_populates="submissions")
