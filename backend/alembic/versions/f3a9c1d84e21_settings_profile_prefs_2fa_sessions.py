"""settings: profile fields, preferences, 2fa, sessions

Revision ID: f3a9c1d84e21
Revises: 9eee376205d4
Create Date: 2026-07-27 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = 'f3a9c1d84e21'
down_revision = '9eee376205d4'
branch_labels = None
depends_on = None


def upgrade() -> None:
    # --- users: profile, 2FA, OAuth, soft-delete ---
    op.add_column('users', sa.Column('organization', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('job_title', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('country', sa.String(length=100), nullable=True))
    op.add_column('users', sa.Column('bio', sa.Text(), nullable=True))
    op.add_column('users', sa.Column('avatar_key', sa.String(length=1024), nullable=True))
    op.add_column('users', sa.Column('totp_secret', sa.String(length=64), nullable=True))
    op.add_column(
        'users',
        sa.Column('totp_enabled', sa.Boolean(), nullable=False, server_default=sa.false()),
    )
    op.add_column('users', sa.Column('google_id', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('google_email', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('deleted_at', sa.DateTime(timezone=True), nullable=True))
    op.create_unique_constraint(op.f('uq_users_google_id'), 'users', ['google_id'])
    op.alter_column('users', 'totp_enabled', server_default=None)

    # --- refresh_tokens: device/session metadata ---
    op.add_column('refresh_tokens', sa.Column('device_name', sa.String(length=255), nullable=True))
    op.add_column('refresh_tokens', sa.Column('ip_address', sa.String(length=64), nullable=True))
    op.add_column('refresh_tokens', sa.Column('user_agent', sa.String(length=512), nullable=True))
    op.add_column(
        'refresh_tokens', sa.Column('last_used_at', sa.DateTime(timezone=True), nullable=True)
    )

    # --- user_preferences ---
    op.create_table(
        'user_preferences',
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('theme', sa.String(length=20), nullable=False),
        sa.Column('accent_color', sa.String(length=20), nullable=False),
        sa.Column('reduced_motion', sa.Boolean(), nullable=False),
        sa.Column('compact_mode', sa.Boolean(), nullable=False),
        sa.Column('ai_default_model', sa.String(length=50), nullable=False),
        sa.Column('heatmap_palette', sa.String(length=20), nullable=False),
        sa.Column('confidence_threshold', sa.Float(), nullable=False),
        sa.Column('prediction_units', sa.String(length=20), nullable=False),
        sa.Column('auto_run_after_upload', sa.Boolean(), nullable=False),
        sa.Column('xai_enabled', sa.Boolean(), nullable=False),
        sa.Column('notify_prediction_completed', sa.Boolean(), nullable=False),
        sa.Column('notify_upload_finished', sa.Boolean(), nullable=False),
        sa.Column('notify_report_generated', sa.Boolean(), nullable=False),
        sa.Column('notify_weekly_summary', sa.Boolean(), nullable=False),
        sa.Column('notify_announcements', sa.Boolean(), nullable=False),
        sa.Column('notify_research_updates', sa.Boolean(), nullable=False),
        sa.Column('notify_email_enabled', sa.Boolean(), nullable=False),
        sa.Column('notify_browser_enabled', sa.Boolean(), nullable=False),
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ['user_id'],
            ['users.id'],
            name=op.f('fk_user_preferences_user_id_users'),
            ondelete='CASCADE',
        ),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_user_preferences')),
        sa.UniqueConstraint('user_id', name=op.f('uq_user_preferences_user_id')),
    )
    op.create_index(
        op.f('ix_user_preferences_user_id'), 'user_preferences', ['user_id'], unique=True
    )

    # --- backup_codes ---
    op.create_table(
        'backup_codes',
        sa.Column('user_id', sa.Uuid(), nullable=False),
        sa.Column('code_hash', sa.String(length=255), nullable=False),
        sa.Column('used_at', sa.DateTime(timezone=True), nullable=True),
        sa.Column('id', sa.Uuid(), nullable=False),
        sa.Column(
            'created_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.Column(
            'updated_at',
            sa.DateTime(timezone=True),
            server_default=sa.text('now()'),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(
            ['user_id'],
            ['users.id'],
            name=op.f('fk_backup_codes_user_id_users'),
            ondelete='CASCADE',
        ),
        sa.PrimaryKeyConstraint('id', name=op.f('pk_backup_codes')),
    )
    op.create_index(op.f('ix_backup_codes_user_id'), 'backup_codes', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_backup_codes_user_id'), table_name='backup_codes')
    op.drop_table('backup_codes')

    op.drop_index(op.f('ix_user_preferences_user_id'), table_name='user_preferences')
    op.drop_table('user_preferences')

    op.drop_column('refresh_tokens', 'last_used_at')
    op.drop_column('refresh_tokens', 'user_agent')
    op.drop_column('refresh_tokens', 'ip_address')
    op.drop_column('refresh_tokens', 'device_name')

    op.drop_constraint(op.f('uq_users_google_id'), 'users', type_='unique')
    op.drop_column('users', 'deleted_at')
    op.drop_column('users', 'google_email')
    op.drop_column('users', 'google_id')
    op.drop_column('users', 'totp_enabled')
    op.drop_column('users', 'totp_secret')
    op.drop_column('users', 'avatar_key')
    op.drop_column('users', 'bio')
    op.drop_column('users', 'country')
    op.drop_column('users', 'job_title')
    op.drop_column('users', 'organization')
