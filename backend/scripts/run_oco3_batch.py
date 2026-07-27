"""Run the Track A OCO-3/GEE analysis for every seeded plant and persist
the results directly to Plant.co2_* columns.

This is the production ingestion path - it supersedes scripts/load_co2.py
for new runs (that script still works for manually reprocessing a
plant_results.json file offline, e.g. to reproduce the research repo's
output for debugging, but this script talks to NASA/GEE directly and
writes straight to the DB, no intermediate file).

Requires CO2_GEE_*/CO2_NASA_* to be configured (see
docs/credentials-setup.md) - fails fast with a clear message if not,
rather than partially processing some plants.

Run (from backend/, venv active, Postgres up, after `alembic upgrade head`):
    python -m scripts.run_oco3_batch
    python -m scripts.run_oco3_batch --plant IND-VINDH   # single plant
"""
import argparse
import asyncio

from app.core.config import get_settings
from app.core.errors import CredentialsNotConfiguredError
from app.db.session import async_session_maker
from app.repositories.plants import PlantRepository
from app.services.emissions_conversion import estimate_emission_rate
from app.services.oco3_analysis import run_oco3_analysis


async def _process_one(repo: PlantRepository, plant, settings) -> None:
    print(f"\n===== {plant.name} ({plant.lat}, {plant.lon}) =====")
    result = run_oco3_analysis(plant, settings)
    print(
        f"  soundings={result.soundings} "
        f"enhancement={result.co2_enhancement_ppm} ppm "
        f"wind={result.co2_wind_speed_mps} m/s"
    )

    fields = {
        "co2_enhancement_ppm": result.co2_enhancement_ppm,
        "co2_bg_std_ppm": result.co2_bg_std_ppm,
        "co2_no2_peak_km": result.co2_no2_peak_km,
        "co2_soundings": result.soundings,
        "co2_wind_speed_mps": result.co2_wind_speed_mps,
        "co2_wind_diff_deg": result.co2_wind_diff_deg,
    }

    if (
        result.co2_enhancement_ppm is not None
        and result.co2_bg_std_ppm is not None
        and result.co2_wind_speed_mps is not None
    ):
        estimate = estimate_emission_rate(
            enhancement_ppm=result.co2_enhancement_ppm,
            bg_std_ppm=result.co2_bg_std_ppm,
            wind_speed_mps=result.co2_wind_speed_mps,
        )
        if estimate is not None:
            fields["co2_emission_tonnes_per_year_estimated"] = estimate.tonnes_per_year
            fields["co2_estimate_low"] = estimate.low
            fields["co2_estimate_high"] = estimate.high
            print(f"  estimate: {estimate.tonnes_per_year} t/yr [{estimate.low}, {estimate.high}]")

    await repo.update_co2_analysis(plant, **fields)
    print(f"  saved -> {plant.external_id or plant.id}")


async def main(only_external_id: str | None) -> None:
    settings = get_settings()
    if not settings.gee_configured or not settings.nasa_earthdata_configured:
        raise CredentialsNotConfiguredError(
            "Google Earth Engine and/or NASA Earthdata"
            " (see docs/credentials-setup.md - both are required for this batch job)"
        )

    async with async_session_maker() as session:
        repo = PlantRepository(session)
        plants = await repo.list_all()
        if only_external_id:
            plants = [p for p in plants if p.external_id == only_external_id]
            if not plants:
                raise SystemExit(f"No plant with external_id={only_external_id!r}")

        if not plants:
            print("No plants to process.")
            return

        for plant in plants:
            try:
                await _process_one(repo, plant, settings)
            except Exception as e:  # noqa: BLE001 - one plant's failure shouldn't abort the batch
                print(f"  [!] failed: {e}")

        await session.commit()
    print("\ndone")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--plant", dest="external_id", default=None, help="external_id to limit to")
    args = parser.parse_args()
    asyncio.run(main(args.external_id))
