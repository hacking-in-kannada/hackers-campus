"""Add LearningPath and Module and custom dockerfile

Revision ID: d757f51b7690
Revises: 0001_initial_schema
Create Date: 2026-08-20 10:03:14.231470

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd757f51b7690'
down_revision: Union[str, None] = '0001_initial_schema'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table('learning_paths',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('slug', sa.String(length=128), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('tagline', sa.Text(), nullable=True),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=64), nullable=True),
        sa.Column('difficulty', sa.String(length=32), nullable=True),
        sa.Column('estimated_hours', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_learning_paths_slug'), 'learning_paths', ['slug'], unique=True)

    op.create_table('modules',
        sa.Column('id', sa.String(length=64), nullable=False),
        sa.Column('path_id', sa.String(length=64), nullable=True),
        sa.Column('slug', sa.String(length=128), nullable=False),
        sa.Column('title', sa.String(length=255), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('category', sa.String(length=64), nullable=True),
        sa.Column('stage', sa.String(length=64), nullable=True),
        sa.Column('estimated_minutes', sa.Integer(), nullable=True),
        sa.Column('order_number', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(timezone=True), nullable=True),
        sa.ForeignKeyConstraint(['path_id'], ['learning_paths.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_modules_slug'), 'modules', ['slug'], unique=True)

    op.add_column('rooms', sa.Column('custom_dockerfile', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('rooms', 'custom_dockerfile')
    op.drop_index(op.f('ix_modules_slug'), table_name='modules')
    op.drop_table('modules')
    op.drop_index(op.f('ix_learning_paths_slug'), table_name='learning_paths')
    op.drop_table('learning_paths')
