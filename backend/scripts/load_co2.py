"""Load CO2 results into the plants table, from two research-repo files.

Reads TWO files from the research repo (data/plant_results.json for the raw
OCO-3/NO2 fields, data/api_export/facilities.json for the ground-truth-
validated / Climate-TRACE-compared / explainability fields - see that
repo's data/schema/emission_record_schema.json for the full shape),
joined by plant name, and fills the CO2 columns on matching plants.
Matches on external_id; creates plants Emissia did not already seed.
Idempotent - safe to re-run any time either source file grows.

Originally only handled 4 hardcoded plants (Vindhyachal/Mundra/Sasan/
Tirora) via a hand-maintained MATCH dict. Generalized here to load the
research repo's full facility set (21 as of this session): the original 4
keep their existing external_ids (not derivable from name alone, since
they predate this script and Emissia's own seed data); every other
facility gets an auto-derived external_id and is created on first run if
not already present.

Run (from backend/, venv active, Postgres up, after `alembic upgrade head`):
    python -m scripts.load_co2
"""
import asyncio
import json
import pathlib
import re

from sqlalchemy import select

from app.db.session import async_session_maker
from app.models import Plant

# Copy both files here first (see research repo's data/plant_results.json
# and data/api_export/facilities.json).
RESULTS_PATH = pathlib.Path("data/plant_results.json")
FACILITIES_PATH = pathlib.Path("data/facilities.json")

# Plants already seeded in Emissia under a hand-chosen external_id (see
# scripts/seed.py) - not derivable from the research repo's plant name.
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

_NON_ALNUM = re.compile(r"[^A-Z0-9]+")


def _external_id_for(plant_name: str) -> str:
    """Auto-derived external_id for any facility not in MATCH above -
    IND-<UPPERCASE_SLUG>, e.g. "ShriSingajiMalwa" -> "IND-SHRISINGAJIMALWA"."""
    if plant_name in MATCH:
        return MATCH[plant_name]
    slug = _NON_ALNUM.sub("", plant_name.upper())
    return f"IND-{slug}"


async def load() -> None:
    if not RESULTS_PATH.exists():
        raise SystemExit(f"Not found: {RESULTS_PATH} - copy plant_results.json into backend/data/")
    if not FACILITIES_PATH.exists():
        raise SystemExit(
            f"Not found: {FACILITIES_PATH} - copy data/api_export/facilities.json into backend/data/"
        )

    raw_by_name = {r["plant"]: r for r in json.loads(RESULTS_PATH.read_text())}
    export = json.loads(FACILITIES_PATH.read_text())
    facility_records = export["facilities"]

    # Coordinate-proximity match radius (degrees) for the fallback below -
    # roughly 5km at these latitudes. Deliberately loose: real duplicate
    # discovered live (2026-08-15) had the SAME plant 0.24 degrees apart
    # (~24km) between two independent data sources (this project's own
    # coordinates vs. a bulk Global Power Plant Database import) for the
    # same named facility.
    COORD_MATCH_DEG = 0.3

    async with async_session_maker() as session:
        all_plants = list(await session.scalars(select(Plant)))
        for rec in facility_records:
            name = rec["name"]
            ext = _external_id_for(name)
            raw = raw_by_name.get(name, {})

            plant = await session.scalar(select(Plant).where(Plant.external_id == ext))
            if plant is None:
                # Fallback: this exact external_id doesn't exist, but the
                # SAME physical plant might already exist under a
                # completely different external_id scheme this script has
                # no static way to know about in advance (e.g. a bulk GPPD
                # import using real numeric IDs). Match by name substring
                # + coordinate proximity rather than blindly creating a
                # second row for a plant that's already there - discovered
                # the hard way (6 duplicate pairs, one this script's own
                # earlier version created) when this repo's own dev DB
                # turned out to have both a demo-seeded short-ID row and a
                # separately-imported real-GPPD-ID row for several plants.
                candidate = next(
                    (
                        p for p in all_plants
                        if (name.lower() in p.name.lower() or p.name.lower() in name.lower())
                        and abs(p.lat - rec["lat"]) < COORD_MATCH_DEG
                        and abs(p.lon - rec["lon"]) < COORD_MATCH_DEG
                    ),
                    None,
                )
                if candidate is not None:
                    plant = candidate
                    print(
                        f"matched {name} to existing plant {plant.name} "
                        f"({plant.external_id}) by name+coordinates, not external_id"
                    )
            if plant is None:
                info = NEW.get(ext, {})
                plant = Plant(
                    external_id=ext,
                    name=info.get("name", name),
                    country=info.get("country", "India"),
                    capacity_mw=info.get("capacity_mw", rec.get("capacity_mw")),
                    fuel_type="coal",
                    lat=rec["lat"],
                    lon=rec["lon"],
                )
                session.add(plant)
                all_plants.append(plant)
                print(f"created plant {plant.name} ({ext})")

            # Raw OCO-3/NO2 fields (from plant_results.json, keys unchanged
            # from the original 4-plant version of this script).
            plant.co2_enhancement_ppm = raw.get("co2_enhancement_ppm")
            plant.co2_bg_std_ppm = raw.get("bg_std_ppm")
            plant.co2_no2_peak_km = raw.get("no2_peak_km")
            plant.co2_soundings = raw.get("soundings")
            plant.co2_wind_diff_deg = raw.get("wind_co2_diff_deg")

            # Ground-truth-validated / Climate-TRACE / detection fields
            # (from facilities.json's per-facility export record).
            track_b = rec.get("track_b") or {}
            gtc = track_b.get("ground_truth_correction") or {}
            ct = track_b.get("climate_trace_comparison") or {}
            track_a = rec.get("track_a") or {}

            plant.co2_corrected_tonnes_per_year = gtc.get("corrected_q_t_per_year")
            plant.co2_correction_significant = gtc.get("correction_significant")
            plant.co2_ground_truth_validation_status = gtc.get("validation_status")
            # co2_ground_truth_tonnes_per_year (the raw CEA-reported figure)
            # is NOT currently in facilities.json's export shape - only the
            # corrected estimate and validation status are. Left unset
            # (stays None) rather than guessed; a genuine gap in what the
            # research repo's export currently carries, not a bug here.
            plant.co2_climate_trace_tonnes = ct.get("climate_trace_co2_t")
            plant.co2_climate_trace_ratio = ct.get("ratio_ours_over_ct")
            plant.co2_climate_trace_bracketed = ct.get("bracketed_by_our_interval")
            plant.detection_exhaustive_lofo_recall = track_a.get("exhaustive_lofo_recall")
            plant.detection_validation_status = track_a.get("validation_status")

            plant.co2_extended = {
                "plume": rec.get("plume"),
                "temporal": rec.get("temporal"),
                "explainability": rec.get("explainability"),
                "provenance": rec.get("provenance"),
            }

            print(f"loaded CO2 for {name} ({plant.external_id})")

        await session.commit()
    print("done")


if __name__ == "__main__":
    asyncio.run(load())
