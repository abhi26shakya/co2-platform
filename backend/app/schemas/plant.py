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
