"""Internal nearest-plant lookup (used by ml-service's live /predict path)."""
import pytest

from app.models import Plant
from tests.conftest import test_session_maker as _session_maker


@pytest.fixture
async def vindhyachal():
    async with _session_maker() as session:
        plant = Plant(
            name="Vindhyachal Test Plant",
            country="India",
            fuel_type="coal",
            lat=24.10,
            lon=82.67,
            external_id="TEST-VINDH",
            co2_enhancement_ppm=1.8,
            co2_bg_std_ppm=0.4,
            co2_wind_speed_mps=3.5,
            co2_emission_tonnes_per_year_estimated=5000.0,
            co2_estimate_low=3200.0,
            co2_estimate_high=6800.0,
        )
        session.add(plant)
        await session.commit()
        await session.refresh(plant)
        yield plant
        await session.delete(plant)
        await session.commit()


def test_nearest_plant_found_within_radius(client, vindhyachal):
    r = client.get(
        "/api/v1/internal/plants/nearest",
        params={"lat": 24.11, "lon": 82.68, "max_distance_km": 25},
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["name"] == "Vindhyachal Test Plant"
    assert body["co2_enhancement_ppm"] == 1.8
    assert body["co2_emission_tonnes_per_year_estimated"] == 5000.0
    assert body["distance_km"] < 5


def test_nearest_plant_404_when_too_far(client, vindhyachal):
    r = client.get(
        "/api/v1/internal/plants/nearest",
        params={"lat": 10.0, "lon": 10.0, "max_distance_km": 25},
    )
    assert r.status_code == 404


def test_nearest_plant_404_when_no_plants(client):
    r = client.get(
        "/api/v1/internal/plants/nearest",
        params={"lat": 0.0, "lon": 0.0, "max_distance_km": 25},
    )
    assert r.status_code == 404


def test_oco3_analysis_requires_credentials(vindhyachal):
    """Without GEE/NASA creds configured, the batch job fails cleanly with a
    typed error rather than crashing inside earthaccess/ee internals."""
    from app.core.config import get_settings
    from app.core.errors import CredentialsNotConfiguredError
    from app.services.oco3_analysis import run_oco3_analysis

    with pytest.raises(CredentialsNotConfiguredError):
        run_oco3_analysis(vindhyachal, get_settings())
