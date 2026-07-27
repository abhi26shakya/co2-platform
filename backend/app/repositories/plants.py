import math
import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Plant


class PlantRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_id(self, plant_id: uuid.UUID) -> Plant | None:
        return await self.session.get(Plant, plant_id)

    async def get_by_external_id(self, external_id: str) -> Plant | None:
        return await self.session.scalar(select(Plant).where(Plant.external_id == external_id))

    async def list_all(self) -> list[Plant]:
        result = await self.session.scalars(select(Plant).order_by(Plant.name))
        return list(result)

    async def create(self, **fields: Any) -> Plant:
        plant = Plant(**fields)
        self.session.add(plant)
        await self.session.flush()
        return plant

    async def update_co2_analysis(self, plant: Plant, **fields: Any) -> Plant:
        """Upsert the OCO-3/GEE-derived CO2 fields (Track A) onto a plant row."""
        for key, value in fields.items():
            setattr(plant, key, value)
        await self.session.flush()
        return plant

    async def nearest_within(
        self, *, lat: float, lon: float, max_distance_km: float
    ) -> tuple[Plant, float] | None:
        """Nearest plant to (lat, lon) within max_distance_km, or None.
        Returns (plant, distance_km).

        Simple planar (equirectangular) approximation - fine at the ~25km
        scale this is used at (see emissions_conversion.py's NEAR_RADIUS_DEG);
        not accurate for antimeridian-spanning or polar queries, neither of
        which apply to this platform's current plant set.
        """
        plants = await self.list_all()
        if not plants:
            return None

        lat_rad = math.radians(lat)
        km_per_deg_lat = 111.32
        km_per_deg_lon = 111.32 * math.cos(lat_rad)

        best: Plant | None = None
        best_dist = float("inf")
        for plant in plants:
            dlat_km = (plant.lat - lat) * km_per_deg_lat
            dlon_km = (plant.lon - lon) * km_per_deg_lon
            dist = math.hypot(dlat_km, dlon_km)
            if dist < best_dist:
                best_dist = dist
                best = plant

        if best is not None and best_dist <= max_distance_km:
            return best, round(best_dist, 2)
        return None
