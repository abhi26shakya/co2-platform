"""Application configuration loaded from environment variables (prefix: CO2_)."""
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="CO2_", env_file=".env", extra="ignore")

    app_name: str = "CO2 Emissions Platform API"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False

    database_url: str = "postgresql+asyncpg://co2:co2password@localhost:5432/co2_platform"

    # ML integration boundary - swap "mock" -> "http" when the real service is up.
    inference_backend: str = "mock"
    ml_service_url: str = "http://localhost:8001"
    ml_request_timeout_seconds: float = 60.0

    # Uploads
    max_upload_mb: int = 200

    # Storage
    storage_backend: str = "local"
    storage_local_path: str = "./storage"

    # Auth (wired fully in the auth stage)
    jwt_secret_key: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 14

    cors_origins: list[str] = ["http://localhost:3000"]

    # Abuse protection (per-IP; backed by Redis when redis_url is set)
    rate_limit_enabled: bool = True
    auth_rate_limit: str = "30/minute"
    rate_limit_storage: str = "memory://"
    redis_url: str | None = None


@lru_cache
def get_settings() -> Settings:
    return Settings()
