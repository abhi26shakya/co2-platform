import uuid

from pydantic import BaseModel


class NearestPlantOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    name: str
    external_id: str | None
    lat: float
    lon: float
    distance_km: float

    # Track A (OCO-3) fields - all nullable, may not have an analysis yet.
    co2_enhancement_ppm: float | None
    co2_bg_std_ppm: float | None
    co2_wind_speed_mps: float | None
    co2_emission_tonnes_per_year_estimated: float | None
    co2_estimate_low: float | None
    co2_estimate_high: float | None

    # Ground-truth-validated results from the research repo's export
    # (data/api_export/facilities.json, loaded via scripts/load_co2.py) -
    # a materially different, independently-verified figure from the
    # co2_*_estimated fields above (this platform's own placeholder
    # mass-balance formula). All nullable; not every plant has been
    # ground-truth-matched.
    co2_ground_truth_tonnes_per_year: float | None
    co2_corrected_tonnes_per_year: float | None
    co2_corrected_std: float | None
    co2_correction_significant: bool | None
    co2_ground_truth_validation_status: str | None
    co2_climate_trace_tonnes: float | None
    co2_climate_trace_ratio: float | None
    co2_climate_trace_bracketed: bool | None
    detection_exhaustive_lofo_recall: float | None
    detection_validation_status: str | None
