"""ml-service configuration, loaded from environment variables (prefix: CO2ML_).

Distinct prefix from backend's CO2_ so the two services' env vars never
collide in docker-compose.yml or a shared .env file.
"""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="CO2ML_", env_file=".env", extra="ignore")

    # Google Earth Engine - service account auth (headless, no browser OAuth).
    # The key file is mounted, never passed as a raw env var - see
    # docs/credentials-setup.md.
    gee_service_account_email: str | None = None
    gee_service_account_key_path: str | None = None
    gee_project_id: str | None = None

    # NASA Earthdata (OCO-3 granule downloads via `earthaccess`). Read via
    # `earthaccess.login(strategy="environment")`, not the interactive
    # `persist=True` flow the source research repo used - that writes a
    # `~/.netrc`-style cache and assumes a human is present, which doesn't
    # work in a headless container.
    nasa_earthdata_username: str | None = None
    nasa_earthdata_password: str | None = None

    # Backend's internal API, for the nearest-plant OCO-3 lookup (M6).
    backend_internal_url: str = "http://backend:8000"
    backend_request_timeout_seconds: float = 10.0

    # Which Predictor app/main.py serves. Defaults to "mock" so a fresh
    # deployment keeps working exactly as before - flip to "combined" only
    # once GEE/NASA credentials (docs/credentials-setup.md) and trained
    # weights (ml-service/weights/README.md) are actually in place.
    predictor: str = "mock"

    @property
    def gee_configured(self) -> bool:
        return bool(
            self.gee_service_account_email
            and self.gee_service_account_key_path
            and self.gee_project_id
        )

    @property
    def nasa_earthdata_configured(self) -> bool:
        return bool(self.nasa_earthdata_username and self.nasa_earthdata_password)


@lru_cache
def get_settings() -> Settings:
    return Settings()
