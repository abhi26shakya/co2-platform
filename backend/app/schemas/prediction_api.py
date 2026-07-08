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
    confidence: float | None
    hotspots: list[Hotspot] | None
    inference_time_ms: float | None
    created_at: datetime
    # populated by service, not ORM
    model_version: str | None = None
    image_filename: str | None = None


class PredictionListOut(BaseModel):
    items: list[PredictionOut]
    total: int
    page: int
    page_size: int
