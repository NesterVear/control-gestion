"""Anadir es_super_usuario a usuarios

Revision ID: 2da32cb47c74
Revises: d3939e956b0c
Create Date: 2025-06-25 00:09:43.334515

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = '2da32cb47c74'
down_revision = 'd3939e956b0c'
branch_labels = None
depends_on = None


def upgrade():
    op.add_column('usuarios', sa.Column('es_super_usuario', sa.Boolean(), nullable=False, server_default='0'))
    # Crear super usuario inicial
    op.execute("INSERT INTO usuarios (usuario, contrasena, es_super_usuario) VALUES ('admin', 'secreta', TRUE)")

def downgrade():
    op.drop_column('usuarios', 'es_super_usuario')
