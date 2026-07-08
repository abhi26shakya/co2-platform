"""Known industrial plants (e.g. from the Global Power Plant Database).
Linking predictions to plants powers the map, comparisons, and time series."""
from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base
from app.models.mixins import TimestampMixin, UUIDPrimaryKeyMixin


class Plant(Base, UUIDPrimaryKeyMixin, TimestampMixin):
    __tablename__ = "plants"

    name: Mapped[str] = mapped_column(String(255), index=True, nullable=False)
    country: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    fuel_type: Mapped[str] = mapped_column(String(50), default="coal", nullable=False)
    capacity_mw: Mapped[float | None] = mapped_column(Float)
    lat: Mapped[float] = mapped_column(Float, nullable=False)
    lon: Mapped[float] = mapped_column(Float, nullable=False)
    external_id: Mapped[str | None] = mapped_column(String(100), unique=True)  # e.g. GPPD id
