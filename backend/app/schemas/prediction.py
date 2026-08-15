"""Versioned prediction contract shared between backend and ML service.

This is THE integration boundary. The real model must return this exact shape.
If the model's output grows richer, add PredictionResultV2 - never mutate V1.
"""
from typing import Literal

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


class PredictionResultV2(BaseModel):
    """Real-model contract (see docs/ml-integration.md's "Real ML Model +
    Satellite Data Integration" plan): combines a live NO2/SO2 CNN
    detection (Track B) with a nearest-plant OCO-3 mass-balance estimate
    (Track A, backend/app/services/emissions_conversion.py) where available.

    `data_source` says how `co2_emission_tonnes_per_year` was derived -
    never present it without checking this field:
      - "oco3_estimated": a formula-derived estimate from a real OCO-3 XCO2
        enhancement measurement near the request's bounds. Always paired
        with co2_estimate_low/high - present as a range, not a bare point
        value; this is an estimate under stated assumptions, not a
        calibrated measurement (see emissions_conversion.py's docstring).
      - "cnn_proxy": no OCO-3 data available nearby; only the CNN's
        detection_confidence is meaningful. co2_emission_tonnes_per_year
        and the estimate range are null - do not fabricate a tonnes figure
        from detection confidence alone.
      - "unavailable": neither track produced a usable result (e.g.
        credentials not configured, or no signal at all).
    """

    schema_version: str = "v2"
    data_source: Literal["oco3_estimated", "cnn_proxy", "unavailable"]
    detection_confidence: float = Field(
        ge=0.0, le=100.0, description="CNN P(power-plant-like combustion source) x 100"
    )
    co2_emission_tonnes_per_year: float | None = None
    co2_estimate_low: float | None = None
    co2_estimate_high: float | None = None
    co2_ppm_enhancement: float | None = None
    ground_truth_validated: bool = Field(
        default=False,
        description=(
            "True only when co2_emission_tonnes_per_year comes from a facility matched "
            "against India's CEA CO2 Baseline Database (real, non-satellite, fuel-"
            "consumption-based ground truth) with the research repo's bias correction "
            "applied - NOT this platform's own placeholder mass-balance formula "
            "(emissions_conversion.py). When true, co2_estimate_low/high are built from "
            "the underlying raw estimate's own uncertainty (an approximation - the "
            "correction adjusts bias, not uncertainty - see Plant.co2_corrected_std). "
            "When false but data_source is 'oco3_estimated', the figure is this "
            "platform's own unvalidated formula output. Always check this field before "
            "presenting the tonnes figure as more than a rough estimate."
        ),
    )
    hotspots: list[Hotspot]
    heatmap_url: str | None = None
    model_version: str
    inference_time_ms: float
