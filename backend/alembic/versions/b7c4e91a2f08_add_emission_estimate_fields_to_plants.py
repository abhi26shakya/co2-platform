"""add emission estimate fields to plants

Revision ID: b7c4e91a2f08
Revises: f3a9c1d84e21
Create Date: 2026-07-27 18:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'b7c4e91a2f08'
down_revision = 'f3a9c1d84e21'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column('plants', sa.Column('co2_wind_speed_mps', sa.Float(), nullable=True))
    op.add_column(
        'plants', sa.Column('co2_emission_tonnes_per_year_estimated', sa.Float(), nullable=True)
    )
    op.add_column('plants', sa.Column('co2_estimate_low', sa.Float(), nullable=True))
    op.add_column('plants', sa.Column('co2_estimate_high', sa.Float(), nullable=True))


def downgrade() -> None:
    op.drop_column('plants', 'co2_estimate_high')
    op.drop_column('plants', 'co2_estimate_low')
    op.drop_column('plants', 'co2_emission_tonnes_per_year_estimated')
    op.drop_column('plants', 'co2_wind_speed_mps')
