import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Float, ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class UserPreferences(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """1:1 with User. Row is created lazily (get-or-create) on first read/write."""

    __tablename__ = "user_preferences"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), unique=True, index=True, nullable=False
    )

    # Appearance
    theme: Mapped[str] = mapped_column(String(20), default="dark", nullable=False)
    accent_color: Mapped[str] = mapped_column(String(20), default="blue", nullable=False)
    reduced_motion: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    compact_mode: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # AI preferences
    ai_default_model: Mapped[str] = mapped_column(String(50), default="unet-v1", nullable=False)
    heatmap_palette: Mapped[str] = mapped_column(String(20), default="viridis", nullable=False)
    confidence_threshold: Mapped[float] = mapped_column(Float, default=0.85, nullable=False)
    prediction_units: Mapped[str] = mapped_column(String(20), default="t_per_year", nullable=False)
    auto_run_after_upload: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    xai_enabled: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)

    # Notifications
    notify_prediction_completed: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    notify_upload_finished: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notify_report_generated: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notify_weekly_summary: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notify_announcements: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notify_research_updates: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)
    notify_email_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    notify_browser_enabled: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)


class BackupCode(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """One row per issued 2FA backup code. Only the Argon2id hash is stored."""

    __tablename__ = "backup_codes"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    code_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    used_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
