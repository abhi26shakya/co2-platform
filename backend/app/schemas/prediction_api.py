"""Public API schemas for predictions (distinct from the internal ML contract
in schemas/prediction.py, which is the backend <-> ML service boundary)."""
import uuid
from datetime import datetime

from pydantic import BaseModel

from app.schemas.prediction import Hotspot


class RunPredictionRequest(BaseModel):
    image_id: uuid.UUID


class PredictionOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    image_id: uuid.UUID
    status: str
    schema_version: str
    co2_emission_tonnes_per_year: float | None
    confidence: float | None  # v1 only - see data_source for v2 predictions
    hotspots: list[Hotspot] | None
    inference_time_ms: float | None
    created_at: datetime
    # v2 fields - null on v1 rows. When data_source is present, the
    # frontend should branch on it rather than assuming
    # co2_emission_tonnes_per_year is always populated (it's null for
    # "cnn_proxy"/"unavailable" - see PredictionResultV2's docstring).
    data_source: str | None = None
    detection_confidence: float | None = None
    co2_ppm_enhancement: float | None = None
    co2_estimate_low: float | None = None
    co2_estimate_high: float | None = None
    # populated by service, not ORM - heatmap_url comes from the heatmap_key
    # column, which despite its name stores whatever URL the ML service
    # returned (not a backend-owned storage key).
    model_version: str | None = None
    image_filename: str | None = None
    heatmap_url: str | None = None


class PredictionListOut(BaseModel):
    items: list[PredictionOut]
    total: int
    page: int
    page_size: int
