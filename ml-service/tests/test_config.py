from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.main import app

client = TestClient(app)


def test_health_credentials_reports_unconfigured_by_default():
    get_settings.cache_clear()
    resp = client.get("/health/credentials")
    assert resp.status_code == 200
    assert resp.json() == {"gee": False, "nasa_earthdata": False}


def test_gee_configured_requires_all_three_fields():
    assert Settings(gee_service_account_email="a@b.com").gee_configured is False
    assert (
        Settings(
            gee_service_account_email="a@b.com",
            gee_service_account_key_path="/run/secrets/gee.json",
            gee_project_id="proj",
        ).gee_configured
        is True
    )


def test_nasa_earthdata_configured_requires_both_fields():
    assert Settings(nasa_earthdata_username="u").nasa_earthdata_configured is False
    assert (
        Settings(nasa_earthdata_username="u", nasa_earthdata_password="p").nasa_earthdata_configured
        is True
    )


def test_credentials_not_configured_error_maps_to_503():
    from app.core.errors import CredentialsNotConfiguredError

    @app.get("/__test_raise_credentials_error")
    def _raise():
        raise CredentialsNotConfiguredError("Google Earth Engine")

    resp = client.get("/__test_raise_credentials_error")
    assert resp.status_code == 503
    body = resp.json()
    assert body["provider"] == "Google Earth Engine"
    assert "not configured" in body["detail"]
