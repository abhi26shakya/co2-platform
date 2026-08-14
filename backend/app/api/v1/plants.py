"""Internal endpoints for ml-service. Unauthenticated, matching the
existing /health and /system/status precedent - Plant CO2 data isn't
user-specific or sensitive, and there's no service-to-service auth
mechanism in this codebase yet to gate it behind."""
from fastapi import APIRouter, HTTPException, Query

from app.core.deps import DbSession
from app.repositories.plants import PlantRepository
from app.schemas.plant import NearestPlantOut

router = APIRouter(prefix="/internal/plants", tags=["internal"])


@router.get("/nearest", response_model=NearestPlantOut)
async def nearest_plant(
    db: DbSession,
    lat: float = Query(...),
    lon: float = Query(...),
    max_distance_km: float = Query(default=25.0, gt=0, le=500),
) -> NearestPlantOut:
    found = await PlantRepository(db).nearest_within(
        lat=lat, lon=lon, max_distance_km=max_distance_km
    )
    if found is None:
        raise HTTPException(status_code=404, detail="No plant within max_distance_km")
    plant, distance_km = found
    return NearestPlantOut(
        id=plant.id,
        name=plant.name,
        external_id=plant.external_id,
        lat=plant.lat,
        lon=plant.lon,
        distance_km=distance_km,
        co2_enhancement_ppm=plant.co2_enhancement_ppm,
        co2_bg_std_ppm=plant.co2_bg_std_ppm,
        co2_wind_speed_mps=plant.co2_wind_speed_mps,
        co2_emission_tonnes_per_year_estimated=plant.co2_emission_tonnes_per_year_estimated,
        co2_estimate_low=plant.co2_estimate_low,
        co2_estimate_high=plant.co2_estimate_high,
        co2_ground_truth_tonnes_per_year=plant.co2_ground_truth_tonnes_per_year,
        co2_corrected_tonnes_per_year=plant.co2_corrected_tonnes_per_year,
        co2_correction_significant=plant.co2_correction_significant,
        co2_ground_truth_validation_status=plant.co2_ground_truth_validation_status,
        co2_climate_trace_tonnes=plant.co2_climate_trace_tonnes,
        co2_climate_trace_ratio=plant.co2_climate_trace_ratio,
        co2_climate_trace_bracketed=plant.co2_climate_trace_bracketed,
        detection_exhaustive_lofo_recall=plant.detection_exhaustive_lofo_recall,
        detection_validation_status=plant.detection_validation_status,
    )
