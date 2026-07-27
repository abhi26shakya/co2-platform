"""Prediction contract. MUST stay in sync with backend/app/schemas/prediction.py.
(When the repo grows, extract to a shared package or generate from OpenAPI.)"""
from typing import Literal

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


class PredictionResultV2(BaseModel):
    """See backend/app/schemas/prediction.py's PredictionResultV2 docstring -
    kept identical here, this file must stay in sync with that one."""

    schema_version: str = "v2"
    data_source: Literal["oco3_estimated", "cnn_proxy", "unavailable"]
    detection_confidence: float = Field(ge=0.0, le=100.0)
    co2_emission_tonnes_per_year: float | None = None
    co2_estimate_low: float | None = None
    co2_estimate_high: float | None = None
    co2_ppm_enhancement: float | None = None
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
