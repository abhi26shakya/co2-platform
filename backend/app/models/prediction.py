import uuid

from sqlalchemy import Float, ForeignKey, Index, String, Uuid
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Prediction(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "predictions"
    __table_args__ = (
        # Time-series queries: emissions per image/plant over time
        Index("ix_predictions_image_created", "image_id", "created_at"),
    )

    image_id: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("satellite_images.id", ondelete="CASCADE"), index=True, nullable=False
    )
    model_id: Mapped[uuid.UUID | None] = mapped_column(
        Uuid, ForeignKey("ml_models.id", ondelete="SET NULL"), index=True
    )
    requested_by: Mapped[uuid.UUID] = mapped_column(
        Uuid, ForeignKey("users.id", ondelete="CASCADE"), index=True, nullable=False
    )
    status: Mapped[str] = mapped_column(String(20), default="completed", nullable=False)
    schema_version: Mapped[str] = mapped_column(String(10), default="v1", nullable=False)
    co2_emission_tonnes_per_year: Mapped[float | None] = mapped_column(Float)
    confidence: Mapped[float | None] = mapped_column(Float)  # v1 only
    hotspots: Mapped[list | None] = mapped_column(JSONB)  # structure evolves with the model
    heatmap_key: Mapped[str | None] = mapped_column(String(1024))
    inference_time_ms: Mapped[float | None] = mapped_column(Float)

    # v2 fields (see schemas/prediction.py's PredictionResultV2) - all null
    # on v1 rows. data_source distinguishes a real OCO-3-derived estimate
    # from a CNN-only detection proxy; never null co2_emission_tonnes_per_year
    # is populated only for "oco3_estimated" - the frontend must branch on
    # data_source, not assume the tonnes figure is always present.
    data_source: Mapped[str | None] = mapped_column(String(20))
    detection_confidence: Mapped[float | None] = mapped_column(Float)
    co2_ppm_enhancement: Mapped[float | None] = mapped_column(Float)
    co2_estimate_low: Mapped[float | None] = mapped_column(Float)
    co2_estimate_high: Mapped[float | None] = mapped_column(Float)
