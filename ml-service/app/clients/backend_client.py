"""Calls backend's internal nearest-plant lookup (Track A data) -
GET /api/v1/internal/plants/nearest, unauthenticated (see
backend/app/api/v1/plants.py's docstring for why).

Synchronous (httpx.Client, not AsyncClient) - ml-service's FastAPI routes
are plain `def`, not `async def` (matches the existing /predict route,
which just calls PREDICTOR.predict() directly), so there's no event loop
to await into here.
"""
from dataclasses import dataclass

import httpx

from app.core.config import Settings


@dataclass
class NearestPlant:
    name: str
    distance_km: float
    co2_enhancement_ppm: float | None
    co2_emission_tonnes_per_year_estimated: float | None
    co2_estimate_low: float | None
    co2_estimate_high: float | None


class BackendClient:
    def __init__(self, settings: Settings) -> None:
        self._base_url = settings.backend_internal_url.rstrip("/")
        self._timeout = settings.backend_request_timeout_seconds

    def nearest_plant(
        self, *, lat: float, lon: float, max_distance_km: float = 25.0
    ) -> NearestPlant | None:
        resp = httpx.get(
            f"{self._base_url}/api/v1/internal/plants/nearest",
            params={"lat": lat, "lon": lon, "max_distance_km": max_distance_km},
            timeout=self._timeout,
        )
        if resp.status_code == 404:
            return None
        resp.raise_for_status()
        body = resp.json()
        return NearestPlant(
            name=body["name"],
            distance_km=body["distance_km"],
            co2_enhancement_ppm=body["co2_enhancement_ppm"],
            co2_emission_tonnes_per_year_estimated=body["co2_emission_tonnes_per_year_estimated"],
            co2_estimate_low=body["co2_estimate_low"],
            co2_estimate_high=body["co2_estimate_high"],
        )
