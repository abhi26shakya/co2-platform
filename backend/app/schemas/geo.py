"""Map + analytics response schemas."""
import uuid
from datetime import datetime

from pydantic import BaseModel


class PlantOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    name: str
    country: str
    fuel_type: str
    capacity_mw: float | None
    lat: float
    lon: float


class MapHotspot(BaseModel):
    lat: float
    lon: float
    intensity: float
    radius_m: float
    emission_tonnes_per_year: float | None
    image_filename: str
    predicted_at: datetime


class TimeseriesPoint(BaseModel):
    month: str  # YYYY-MM
    avg_emission: float
    total_emission: float
    prediction_count: int


class DistributionBucket(BaseModel):
    lo: float
    hi: float
    count: int


class SourceCount(BaseModel):
    source: str
    count: int


class AnalyticsOut(BaseModel):
    timeseries: list[TimeseriesPoint]
    distribution: list[DistributionBucket]
    sources: list[SourceCount]
    total_predictions: int
    max_emission: float | None
    avg_confidence: float | None
