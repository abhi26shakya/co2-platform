import enum
import uuid
from datetime import datetime

from sqlalchemy import BigInteger, DateTime, Enum, ForeignKey, Integer, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin
from app.models.types import JSONVariant


class SatelliteImage(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "satellite_images"

    owner_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    plant_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("plants.id", ondelete="SET NULL"), index=True
    )
    filename: Mapped[str] = mapped_column(String(500), nullable=False)
    storage_key: Mapped[str] = mapped_column(String(600), unique=True, nullable=False)
    preview_key: Mapped[str | None] = mapped_column(String(600))  # browser-renderable PNG
    content_type: Mapped[str] = mapped_column(String(100), nullable=False)
    size_bytes: Mapped[int] = mapped_column(BigInteger, nullable=False)
    width: Mapped[int | None] = mapped_column(Integer)
    height: Mapped[int | None] = mapped_column(Integer)
    source_satellite: Mapped[str | None] = mapped_column(String(100))  # e.g. Sentinel-2
    acquisition_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    bounds: Mapped[dict | None] = mapped_column(JSONVariant)  # [minLon,minLat,maxLon,maxLat]
    crs: Mapped[str | None] = mapped_column(String(50))  # e.g. EPSG:4326
    extra: Mapped[dict | None] = mapped_column(JSONVariant)  # free-form GeoTIFF tags

    predictions: Mapped[list["Prediction"]] = relationship(  # noqa: F821
        back_populates="image", cascade="all, delete-orphan"
    )


class UploadStatus(str, enum.Enum):
    pending = "pending"
    processing = "processing"
    complete = "complete"
    failed = "failed"


class Upload(Base, UUIDPrimaryKeyMixin):
    """Tracks the upload *event* separately from the image asset."""

    __tablename__ = "uploads"

    user_id: Mapped[uuid.UUID] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    image_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid(as_uuid=True), ForeignKey("satellite_images.id", ondelete="SET NULL")
    )
    status: Mapped[UploadStatus] = mapped_column(
        Enum(UploadStatus, name="upload_status"), default=UploadStatus.pending, nullable=False
    )
    error: Mapped[str | None] = mapped_column(String(1000))
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
