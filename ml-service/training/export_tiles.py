"""Exports 64x64 2-channel (NO2, SO2) tiles for a list of locations.

Ported from the source research repo's export_tiles.py/export_so2.py
(originally two single-band scripts) - combined into one 2-channel export
here since that's what train_2channel.py actually consumes, and pointed at
this project's credential config instead of a hardcoded GCP project.

Usage:
    python -m training.export_tiles --locations data/powerplants.csv --out data/twoch/positive
"""
import argparse
import os

import numpy as np
import pandas as pd

from app.core.config import get_settings
from app.inference.gee_client import ensure_initialized, fetch_band_tile


def export(locations_csv: str, out_dir: str, *, year: int = 2020) -> None:
    settings = get_settings()
    ensure_initialized(settings)

    os.makedirs(out_dir, exist_ok=True)
    locations = pd.read_csv(locations_csv)

    for _, row in locations.iterrows():
        name = str(row["name"]).replace(" ", "_").replace("/", "_")
        try:
            no2 = fetch_band_tile(
                "COPERNICUS/S5P/OFFL/L3_NO2",
                "tropospheric_NO2_column_number_density",
                lat=row["latitude"],
                lon=row["longitude"],
                year=year,
            )
            so2 = fetch_band_tile(
                "COPERNICUS/S5P/OFFL/L3_SO2",
                "SO2_column_number_density",
                lat=row["latitude"],
                lon=row["longitude"],
                year=year,
            )
            tile = np.stack([no2, so2], axis=0)
            np.save(f"{out_dir}/{name}.npy", tile)
            print(f"saved {name:30s} shape={tile.shape} mean={np.nanmean(tile, axis=(1, 2))}")
        except Exception as e:  # noqa: BLE001 - one bad location shouldn't abort the export
            print(f"FAILED {name}: {e}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--locations", required=True, help="CSV with name,latitude,longitude")
    parser.add_argument("--out", required=True, help="output directory for .npy tiles")
    parser.add_argument("--year", type=int, default=2020)
    args = parser.parse_args()
    export(args.locations, args.out, year=args.year)
