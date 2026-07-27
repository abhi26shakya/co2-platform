"""add prediction v2 fields

Revision ID: d3f8a6c15e97
Revises: b7c4e91a2f08
Create Date: 2026-07-27 18:30:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'd3f8a6c15e97'
down_revision = 'b7c4e91a2f08'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('predictions', sa.Column('data_source', sa.String(length=20), nullable=True))
    op.add_column(
        'predictions', sa.Column('detection_confidence', sa.Float(), nullable=True)
    )
    op.add_column(
        'predictions', sa.Column('co2_ppm_enhancement', sa.Float(), nullable=True)
    )
    op.add_column('predictions', sa.Column('co2_estimate_low', sa.Float(), nullable=True))
    op.add_column('predictions', sa.Column('co2_estimate_high', sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column('predictions', 'co2_estimate_high')
    op.drop_column('predictions', 'co2_estimate_low')
    op.drop_column('predictions', 'co2_ppm_enhancement')
    op.drop_column('predictions', 'detection_confidence')
    op.drop_column('predictions', 'data_source')
