"""initial platform schema

Revision ID: 0001_initial_schema
Revises:
Create Date: 2026-08-20 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = "0001_initial_schema"
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("username", sa.String(length=64), nullable=False, unique=True, index=True),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True, index=True),
        sa.Column("hashed_password", sa.String(length=255), nullable=False),
        sa.Column("display_name", sa.String(length=128), default=""),
        sa.Column("role", sa.String(length=32), default="student"),
        sa.Column("xp", sa.Integer(), default=0),
        sa.Column("level", sa.Integer(), default=1),
        sa.Column("streak_days", sa.Integer(), default=0),
        sa.Column("is_active", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "rooms",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=64), default="Web Security"),
        sa.Column("difficulty", sa.String(length=32), default="Beginner"),
        sa.Column("runtime", sa.String(length=32), default="docker"),
        sa.Column("estimated_minutes", sa.Integer(), default=60),
        sa.Column("description", sa.Text(), default=""),
        sa.Column("is_published", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "room_tasks",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("room_id", sa.String(length=64), sa.ForeignKey("rooms.id"), nullable=False),
        sa.Column("task_number", sa.Integer(), default=1),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), default=""),
        sa.Column("hint", sa.Text(), nullable=True),
        sa.Column("flag", sa.String(length=255), default=""),
        sa.Column("xp", sa.Integer(), default=25),
    )

    op.create_table(
        "practice_challenges",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("slug", sa.String(length=128), nullable=False, unique=True, index=True),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("category", sa.String(length=64), default="Web Security"),
        sa.Column("difficulty", sa.String(length=32), default="Easy"),
        sa.Column("xp", sa.Integer(), default=100),
        sa.Column("estimated_minutes", sa.Integer(), default=30),
        sa.Column("description", sa.Text(), default=""),
        sa.Column("scenario", sa.Text(), default=""),
        sa.Column("target_ip", sa.String(length=64), default="10.100.50.10"),
        sa.Column("target_hostname", sa.String(length=128), default="target.local"),
        sa.Column("is_published", sa.Boolean(), default=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "practice_tasks",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column(
            "challenge_id",
            sa.String(length=64),
            sa.ForeignKey("practice_challenges.id"),
            nullable=False,
        ),
        sa.Column("task_number", sa.String(length=16), default="01"),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), default=""),
        sa.Column("hint", sa.Text(), nullable=True),
        sa.Column("flag", sa.String(length=255), default=""),
        sa.Column("xp", sa.Integer(), default=25),
    )

    op.create_table(
        "lab_sessions",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("user_id", sa.String(length=64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("room_id", sa.String(length=64), sa.ForeignKey("rooms.id"), nullable=True),
        sa.Column("runtime", sa.String(length=32), default="docker"),
        sa.Column("target_ip", sa.String(length=64), default="10.100.50.10"),
        sa.Column("attack_ip", sa.String(length=64), default="10.100.50.2"),
        sa.Column("container_id", sa.String(length=128), nullable=True),
        sa.Column("status", sa.String(length=32), default="running"),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
    )

    op.create_table(
        "submissions",
        sa.Column("id", sa.String(length=64), primary_key=True),
        sa.Column("user_id", sa.String(length=64), sa.ForeignKey("users.id"), nullable=False),
        sa.Column("target_id", sa.String(length=64), nullable=False, index=True),
        sa.Column("target_type", sa.String(length=32), default="practice_task"),
        sa.Column("flag", sa.String(length=255), nullable=False),
        sa.Column("is_correct", sa.Boolean(), default=False),
        sa.Column("awarded_xp", sa.Integer(), default=0),
        sa.Column("submitted_at", sa.DateTime(timezone=True), nullable=False),
    )


def downgrade() -> None:
    op.drop_table("submissions")
    op.drop_table("lab_sessions")
    op.drop_table("practice_tasks")
    op.drop_table("practice_challenges")
    op.drop_table("room_tasks")
    op.drop_table("rooms")
    op.drop_table("users")
