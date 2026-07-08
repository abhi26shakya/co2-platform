"""Prediction contract. MUST stay in sync with backend/app/schemas/prediction.py.
(When the repo grows, extract to a shared package or generate from OpenAPI.)"""
from pydantic import BaseModel, Field


class Hotspot(BaseModel):
    lat: float
    lon: float
    intensity: float = Field(ge=0.0, le=1.0)
    radius_m: float = 500.0


class PredictionRequest(BaseModel):
    image_id: str
    image_url: str | None = None
    bounds: list[float] | None = None
    metadata: dict = Field(default_factory=dict)


class PredictionResultV1(BaseModel):
    schema_version: str = "v1"
    co2_emission_tonnes_per_year: float
    confidence: float = Field(ge=0.0, le=100.0)
    hotspots: list[Hotspot]
    heatmap_url: str | None = None
    model_version: str
    inference_time_ms: float


class ModelInfo(BaseModel):
    name: str
    version: str
    architecture: str
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    last_trained: str
