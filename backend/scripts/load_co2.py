"""Load OCO-3 CO2 enhancement results into the plants table.

Reads data/plant_results.json (your CO2 pipeline output) and fills the CO2
columns on matching plants. Matches on external_id; creates plants that Emissia
did not already seed (e.g. Tirora). Idempotent - safe to re-run any time you
add more plants to plant_results.json.

Run (from backend/, venv active, Postgres up, after `alembic upgrade head`):
    python -m scripts.load_co2
"""
import asyncio
import json
import pathlib

from sqlalchemy import select

from app.db.session import async_session_maker
from app.models import Plant

# Path to your CO2 results (copy plant_results.json here first).
RESULTS_PATH = pathlib.Path("data/plant_results.json")

# Map your CO2 pipeline plant names -> Emissia external_id.
# Vindhyachal / Mundra / Sasan are ALREADY seeded in Emissia (see scripts/seed.py).
# Tirora is not - it is created below via NEW.
MATCH = {
    "Vindhyachal": "IND-VINDH",
    "Mundra": "IND-MUNDRA",
    "Sasan": "IND-SASAN",
    "Tirora": "IND-TIRORA",
}

# Details for plants not already in Emissia's seed (created on first run).
NEW = {
    "IND-TIRORA": dict(name="Tirora Thermal Power Station", country="India", capacity_mw=3300),
}


async def load() -> None:
    if not RESULTS_PATH.exists():
        raise SystemExit(f"Not found: {RESULTS_PATH} - copy plant_results.json into backend/data/ first.")

    data = json.loads(RESULTS_PATH.read_text())
    async with async_session_maker() as session:
        for r in data:
            ext = MATCH.get(r["plant"])
            if not ext:
                print(f"skip {r['plant']} (no external_id mapping - add it to MATCH)")
                continue

            plant = await session.scalar(select(Plant).where(Plant.external_id == ext))
            if plant is None:
                info = NEW.get(ext, {})
                plant = Plant(
                    external_id=ext,
                    name=info.get("name", r["plant"]),
                    country=info.get("country", "India"),
                    capacity_mw=info.get("capacity_mw"),
                    fuel_type="coal",
                    lat=r["lat"],
                    lon=r["lon"],
                )
                session.add(plant)
                print(f"created plant {plant.name}")

            # Fill CO2 fields (keys match your plant_results.json).
            plant.co2_enhancement_ppm = r.get("co2_enhancement_ppm")
            plant.co2_bg_std_ppm = r.get("bg_std_ppm")
            plant.co2_no2_peak_km = r.get("no2_peak_km")
            plant.co2_soundings = r.get("soundings")
            plant.co2_wind_diff_deg = r.get("wind_co2_diff_deg")
            print(f"loaded CO2 for {r['plant']}")

        await session.commit()
    print("done")


if __name__ == "__main__":
    asyncio.run(load())
