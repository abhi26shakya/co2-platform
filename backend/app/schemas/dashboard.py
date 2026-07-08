import uuid
from datetime import datetime

from pydantic import BaseModel


class RecentUpload(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    filename: str
    source: str
    content_type: str
    size_bytes: int
    created_at: datetime


class DashboardStats(BaseModel):
    processed_images: int
    total_predictions: int
    avg_emission_tonnes_per_year: float | None
    avg_confidence: float | None
    recent_uploads: list[RecentUpload]
    active_model_version: str | None
    ml_service_status: str
