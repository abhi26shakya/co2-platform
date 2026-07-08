"""Seed reference data: known plants + model registry entry.
Run: python -m app.db.seed   (idempotent - safe to re-run)
"""
import asyncio

from sqlalchemy import select

from app.db.session import async_session_maker
from app.models import MLModel, Plant

# Sample of large Indian coal plants (name, capacity_mw, lat, lon, GPPD id).
# Extend from the full Global Power Plant Database export for the research dataset.
_PLANT_ROWS = [
    ("Vindhyachal Super Thermal Power Station", 4760, 24.0983, 82.6714, "IND0000398"),
    ("Mundra Thermal Power Station", 4620, 22.8244, 69.5261, "IND0000275"),
    ("Sasan Ultra Mega Power Project", 3960, 23.9829, 82.6265, "IND0000334"),
    ("Talcher Super Thermal Power Station", 3000, 21.0964, 85.0747, "IND0000369"),
    ("Rihand Thermal Power Station", 3000, 24.0286, 83.0342, "IND0000323"),
    ("Korba Super Thermal Power Station", 2600, 22.3878, 82.6789, "IND0000230"),
]

PLANTS = [
    {
        "name": name,
        "country": "India",
        "capacity_mw": cap,
        "lat": lat,
        "lon": lon,
        "external_id": ext,
    }
    for name, cap, lat, lon, ext in _PLANT_ROWS
]

MOCK_MODEL = {
    "name": "co2-unet-mock",
    "version": "mock-0.1.0",
    "architecture": "U-Net (placeholder)",
    "is_active": True,
}


async def seed() -> None:
    async with async_session_maker() as session:
        added_plants = 0
        for data in PLANTS:
            exists = await session.scalar(
                select(Plant).where(Plant.external_id == data["external_id"])
            )
            if not exists:
                session.add(Plant(**data, fuel_type="coal"))
                added_plants += 1

        model_exists = await session.scalar(
            select(MLModel).where(MLModel.version == MOCK_MODEL["version"])
        )
        if not model_exists:
            session.add(MLModel(**MOCK_MODEL))

        await session.commit()
        print(f"Seed complete: +{added_plants} plants, model registered: {not model_exists}")


if __name__ == "__main__":
    asyncio.run(seed())
