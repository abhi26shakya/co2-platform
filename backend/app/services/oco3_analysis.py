"""Track A: OCO-3 XCO2 + Sentinel-5P NO2 + ERA5 wind analysis for a plant.

Ported and generalized from the research repo's `process_plant.py`, which
hardcoded 4 named plants - this operates on any `Plant` row. Runs as an
offline batch job (backend/scripts/run_oco3_batch.py), never inline in a
request: OCO-3 granule search/download and Earth Engine queries take
seconds-to-minutes, far past what's reasonable for a synchronous HTTP call.

Heavy, optional deps (`earthaccess`, `earthengine-api`, `xarray`) are
imported lazily inside the functions that need them, not at module level -
this keeps `oco3_analysis` importable (and the credentials-not-configured
path testable) in environments that haven't installed them, and avoids
paying their import cost for code paths that never call this module.
"""
import math
import os
from dataclasses import dataclass
from datetime import UTC, datetime, timedelta

from app.core.config import Settings
from app.core.errors import CredentialsNotConfiguredError
from app.models import Plant

# "Near plant" vs "background" radii, matching the source repo's zones.
NEAR_RADIUS_DEG = 0.25  # ~25-28 km depending on latitude
BG_INNER_DEG = 0.4
BG_OUTER_DEG = 0.9
MIN_SOUNDINGS_FOR_ENHANCEMENT = 20
NO2_SCAN_BOX_DEG = 0.5


@dataclass
class Oco3Result:
    plant_id: object
    soundings: int
    co2_enhancement_ppm: float | None
    co2_bg_std_ppm: float | None
    co2_no2_peak_km: float | None
    co2_wind_speed_mps: float | None
    co2_wind_diff_deg: float | None


def _require_credentials(settings: Settings) -> None:
    if not settings.nasa_earthdata_configured:
        raise CredentialsNotConfiguredError("NASA Earthdata")
    if not settings.gee_configured:
        raise CredentialsNotConfiguredError("Google Earth Engine")


def _login_earthdata(settings: Settings) -> None:
    import earthaccess

    # `strategy="environment"` reads EARTHDATA_USERNAME/EARTHDATA_PASSWORD -
    # set them from our own CO2_-prefixed settings rather than requiring the
    # user to duplicate credentials under earthaccess's own env var names.
    os.environ["EARTHDATA_USERNAME"] = settings.nasa_earthdata_username or ""
    os.environ["EARTHDATA_PASSWORD"] = settings.nasa_earthdata_password or ""
    earthaccess.login(strategy="environment")


def _init_earth_engine(settings: Settings) -> None:
    import ee

    credentials = ee.ServiceAccountCredentials(
        settings.gee_service_account_email, settings.gee_service_account_key_path
    )
    ee.Initialize(credentials, project=settings.gee_project_id)


def _fetch_oco3_soundings(
    plant: Plant, *, start: str, end: str
) -> tuple[list[float], list[float], list[float]]:
    """Returns (lats, lons, xco2_ppm) for quality-passing soundings within
    the wide search box around the plant."""
    import earthaccess
    import numpy as np
    import xarray as xr

    search_box = (plant.lon - 1.0, plant.lat - 1.0, plant.lon + 1.0, plant.lat + 1.0)
    results = earthaccess.search_data(
        short_name="OCO3_L2_Lite_FP", version="11r", temporal=(start, end), bounding_box=search_box
    )

    klat: list[float] = []
    klon: list[float] = []
    kco2: list[float] = []
    for granule in results:
        try:
            files = earthaccess.download([granule], local_path="/tmp/oco3_scan")
            ds = xr.open_dataset(files[0])
            lat, lon = ds["latitude"].values, ds["longitude"].values
            xco2, qf = ds["xco2"].values, ds["xco2_quality_flag"].values
            ds.close()
            os.remove(files[0])
            mask = (
                (qf == 0)
                & np.isfinite(xco2)
                & (lat > plant.lat - 1.0)
                & (lat < plant.lat + 1.0)
                & (lon > plant.lon - 1.0)
                & (lon < plant.lon + 1.0)
            )
            if mask.sum() > 0:
                klat.extend(lat[mask].tolist())
                klon.extend(lon[mask].tolist())
                kco2.extend(xco2[mask].tolist())
        except Exception:  # noqa: BLE001 - one bad granule shouldn't abort the scan
            continue
    return klat, klon, kco2


def _co2_enhancement(
    plant: Plant, lats: list[float], lons: list[float], xco2: list[float]
) -> tuple[float | None, float | None]:
    if len(xco2) < MIN_SOUNDINGS_FOR_ENHANCEMENT:
        return None, None
    dist = [math.hypot(la - plant.lat, lo - plant.lon) for la, lo in zip(lats, lons, strict=True)]
    near = [v for v, d in zip(xco2, dist, strict=True) if d < NEAR_RADIUS_DEG]
    bg = [v for v, d in zip(xco2, dist, strict=True) if BG_INNER_DEG < d < BG_OUTER_DEG]
    if len(near) < 5 or len(bg) < 5:
        return None, None
    near_mean = sum(near) / len(near)
    bg_mean = sum(bg) / len(bg)
    bg_std = (sum((v - bg_mean) ** 2 for v in bg) / len(bg)) ** 0.5
    return near_mean - bg_mean, bg_std


def _fetch_no2_peak_distance(plant: Plant, *, start: str, end: str) -> float | None:
    import io

    import ee
    import numpy as np
    import requests

    region = ee.Geometry.Rectangle(
        [
            plant.lon - NO2_SCAN_BOX_DEG,
            plant.lat - NO2_SCAN_BOX_DEG,
            plant.lon + NO2_SCAN_BOX_DEG,
            plant.lat + NO2_SCAN_BOX_DEG,
        ]
    )
    no2_img = (
        ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2")
        .select("tropospheric_NO2_column_number_density")
        .filterDate(start, end)
        .filterBounds(region)
        .mean()
        .clip(region)
    )
    url = no2_img.getDownloadURL({"region": region, "scale": 2000, "format": "NPY"})
    resp = requests.get(url, timeout=60)
    arr = np.load(io.BytesIO(resp.content))
    band = arr.dtype.names[0]
    no2 = np.array(arr[band].tolist(), dtype=float)
    if no2.size == 0 or np.all(np.isnan(no2)):
        return None
    ny, nx = no2.shape
    r, c = np.unravel_index(np.nanargmax(no2), no2.shape)
    peak_lat = (plant.lat + NO2_SCAN_BOX_DEG) - (r / max(ny - 1, 1)) * (2 * NO2_SCAN_BOX_DEG)
    peak_lon = (plant.lon - NO2_SCAN_BOX_DEG) + (c / max(nx - 1, 1)) * (2 * NO2_SCAN_BOX_DEG)
    return math.hypot(peak_lat - plant.lat, peak_lon - plant.lon) * 111.0


def _fetch_wind(plant: Plant, *, start: str, end: str) -> tuple[float | None, float | None]:
    """Returns (speed_mps, direction_deg) from ERA5 10m wind components."""
    import ee

    point = ee.Geometry.Point([plant.lon, plant.lat])
    wind = (
        ee.ImageCollection("ECMWF/ERA5/DAILY")
        .select(["u_component_of_wind_10m", "v_component_of_wind_10m"])
        .filterDate(start, end)
        .mean()
    )
    values = wind.reduceRegion(ee.Reducer.mean(), point, scale=27830).getInfo()
    u = values.get("u_component_of_wind_10m")
    v = values.get("v_component_of_wind_10m")
    if u is None or v is None:
        return None, None
    speed = math.hypot(u, v)
    direction = math.degrees(math.atan2(u, v)) % 360
    return speed, direction


def _wind_co2_diff(
    plant: Plant,
    wind_deg: float | None,
    lats: list[float],
    lons: list[float],
    xco2: list[float],
) -> float | None:
    if wind_deg is None or len(xco2) < MIN_SOUNDINGS_FOR_ENHANCEMENT:
        return None
    threshold = sorted(xco2)[int(0.8 * len(xco2))]
    hi_lat = [la for la, v in zip(lats, xco2, strict=True) if v >= threshold]
    hi_lon = [lo for lo, v in zip(lons, xco2, strict=True) if v >= threshold]
    if not hi_lat:
        return None
    mean_lat = sum(hi_lat) / len(hi_lat)
    mean_lon = sum(hi_lon) / len(hi_lon)
    offset_deg = math.degrees(math.atan2(mean_lon - plant.lon, mean_lat - plant.lat)) % 360
    return abs((wind_deg - offset_deg + 180) % 360 - 180)


def run_oco3_analysis(
    plant: Plant, settings: Settings, *, lookback_days: int = 365
) -> Oco3Result:
    """Run the full Track A analysis for one plant. Raises
    CredentialsNotConfiguredError if GEE/NASA Earthdata aren't configured -
    callers (the batch runner) should catch this once, log, and skip the
    remaining plants rather than retry per-plant."""
    _require_credentials(settings)

    end = datetime.now(UTC)
    start = end - timedelta(days=lookback_days)
    start_s, end_s = start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")

    _login_earthdata(settings)
    _init_earth_engine(settings)

    lats, lons, xco2 = _fetch_oco3_soundings(plant, start=start_s, end=end_s)
    enhancement, bg_std = _co2_enhancement(plant, lats, lons, xco2)
    no2_peak_km = _fetch_no2_peak_distance(plant, start=start_s, end=end_s)
    wind_speed, wind_deg = _fetch_wind(plant, start=start_s, end=end_s)
    wind_diff = _wind_co2_diff(plant, wind_deg, lats, lons, xco2)

    return Oco3Result(
        plant_id=plant.id,
        soundings=len(xco2),
        co2_enhancement_ppm=round(enhancement, 3) if enhancement is not None else None,
        co2_bg_std_ppm=round(bg_std, 3) if bg_std is not None else None,
        co2_no2_peak_km=round(no2_peak_km, 1) if no2_peak_km is not None else None,
        co2_wind_speed_mps=round(wind_speed, 2) if wind_speed is not None else None,
        co2_wind_diff_deg=round(wind_diff, 1) if wind_diff is not None else None,
    )
