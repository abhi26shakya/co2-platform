import uuid

from sqlalchemy import ForeignKey, String, Text, Uuid
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Upload(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    """One upload event. Kept separate from the image asset so failed/partial
    uploads are auditable and retryable."""

    __tablename__ = "uploads"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    image_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("satellite_images.id", ondelete="SET NULL")
    )
    status: Mapped[str] = mapped_column(String(20), default="pending", nullable=False)
    error: Mapped[str | None] = mapped_column(Text)
