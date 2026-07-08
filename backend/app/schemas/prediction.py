"""Versioned prediction contract shared between backend and ML service.

This is THE integration boundary. The real model must return this exact shape.
If the model's output grows richer, add PredictionResultV2 - never mutate V1.
"""
from pydantic import BaseModel, Field


class Hotspot(BaseModel):
    lat: float
    lon: float
    intensity: float = Field(ge=0.0, le=1.0, description="Normalized emission intensity")
    radius_m: float = Field(default=500.0, description="Approximate hotspot radius in meters")


class PredictionRequest(BaseModel):
    image_id: str
    image_url: str | None = None
    bounds: list[float] | None = Field(
        default=None, description="[min_lon, min_lat, max_lon, max_lat] of the scene"
    )
    metadata: dict = Field(default_factory=dict)


class PredictionResultV1(BaseModel):
    schema_version: str = "v1"
    co2_emission_tonnes_per_year: float
    confidence: float = Field(ge=0.0, le=100.0)
    hotspots: list[Hotspot]
    heatmap_url: str | None = None
    model_version: str
    inference_time_ms: float
