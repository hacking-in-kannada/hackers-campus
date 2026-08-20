"""Add practice challenge curriculum links.

Revision ID: e831f9a1b20a
Revises: d757f51b7690
"""
from alembic import op
import sqlalchemy as sa

revision = "e831f9a1b20a"
down_revision = "d757f51b7690"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("practice_challenges", sa.Column("target_ports", sa.String(length=128), nullable=True))
    op.add_column("practice_challenges", sa.Column("container_image", sa.String(length=255), nullable=True))
    op.add_column("practice_challenges", sa.Column("roadmap_stage", sa.String(length=64), nullable=True))
    op.add_column("practice_challenges", sa.Column("module_id", sa.String(length=64), nullable=True))
    # Remove the old UI/demo fixtures. Administrators publish real challenges through the studio.
    op.execute("DELETE FROM practice_challenges WHERE id IN ('pc-jwt-01', 'pc-suid-01')")


def downgrade() -> None:
    op.drop_column("practice_challenges", "module_id")
    op.drop_column("practice_challenges", "roadmap_stage")
    op.drop_column("practice_challenges", "container_image")
    op.drop_column("practice_challenges", "target_ports")
