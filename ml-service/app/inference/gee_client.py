"""Fetches the 2-channel (NO2, SO2) Earth Engine tile the CNN (Track B)
expects, centered on a point - not the uploaded image at all.

Deliberately mirrors the training pipeline's tile geometry exactly
(`ml-service/training/export_tiles.py`'s `size_km=60, px=64`) - using a
different window here than what the model was trained on would silently
degrade predictions with no error, so these constants must stay in sync
with the training script's. `ensure_initialized`/`fetch_band_tile` are
public (not underscore-prefixed) specifically so training scripts can
reuse them rather than duplicating the GEE query logic.
"""
import io

from app.core.config import Settings
from app.core.errors import CredentialsNotConfiguredError

SIZE_KM = 60
TILE_PX = 64

_initialized = False


def ensure_initialized(settings: Settings) -> None:
    global _initialized
    if _initialized:
        return
    if not settings.gee_configured:
        raise CredentialsNotConfiguredError("Google Earth Engine")

    import ee

    credentials = ee.ServiceAccountCredentials(
        settings.gee_service_account_email, settings.gee_service_account_key_path
    )
    ee.Initialize(credentials, project=settings.gee_project_id)
    _initialized = True


def fetch_band_tile(collection: str, band: str, *, lat: float, lon: float, year: int):
    import ee
    import numpy as np
    import requests

    point = ee.Geometry.Point(lon, lat)
    region = point.buffer(SIZE_KM * 1000 / 2).bounds()
    img = (
        ee.ImageCollection(collection)
        .select(band)
        .filterDate(f"{year}-01-01", f"{year}-12-31")
        .filterBounds(region)
        .mean()
    )
    url = img.clip(region).getDownloadURL(
        {"region": region, "dimensions": f"{TILE_PX}x{TILE_PX}", "format": "NPY"}
    )
    resp = requests.get(url, timeout=60)
    resp.raise_for_status()
    arr = np.load(io.BytesIO(resp.content))
    field = arr.dtype.names[0]
    return np.array(arr[field], dtype=np.float32)


class GeeTileClient:
    def __init__(self, settings: Settings) -> None:
        self._settings = settings

    def fetch_no2_so2_tile(self, *, lat: float, lon: float, year: int):
        """Returns a (2, 64, 64) float32 array: [NO2, SO2] - same shape and
        band order train_2channel.py's Detector2 expects (Conv2d(2, ...))."""
        import numpy as np

        ensure_initialized(self._settings)
        no2 = fetch_band_tile(
            "COPERNICUS/S5P/OFFL/L3_NO2",
            "tropospheric_NO2_column_number_density",
            lat=lat,
            lon=lon,
            year=year,
        )
        so2 = fetch_band_tile(
            "COPERNICUS/S5P/OFFL/L3_SO2",
            "SO2_column_number_density",
            lat=lat,
            lon=lon,
            year=year,
        )
        return np.stack([no2, so2], axis=0)
