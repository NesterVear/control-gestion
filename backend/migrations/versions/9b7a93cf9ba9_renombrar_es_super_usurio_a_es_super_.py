"""Renombrar es_super_usurio a es_super_usuario

Revision ID: 9b7a93cf9ba9
Revises: 2da32cb47c74
Create Date: 2025-06-25 23:24:24.056972

"""
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = '9b7a93cf9ba9'
down_revision = '2da32cb47c74'
branch_labels = None
depends_on = None

def upgrade():
    op.alter_column('usuarios', 'es_super_usurio', new_column_name='es_super_usuario', existing_type=sa.Boolean())

def downgrade():
    op.alter_column('usuarios', 'es_super_usuario', new_column_name='es_super_usurio', existing_type=sa.Boolean())