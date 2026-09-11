"""initial

Revision ID: 001_initial
Revises: 
Create Date: 2026-09-10 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '001_initial'
down_revision = None
branch_labels = None
depends_on = None

def upgrade() -> None:
    # All tables are created via Base.metadata.create_all in lifespan, 
    # but normally alembic handles it.
    pass

def downgrade() -> None:
    pass
