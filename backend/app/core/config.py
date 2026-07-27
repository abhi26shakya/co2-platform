"""Application configuration loaded from environment variables (prefix: CO2_)."""
from functools import lru_cache

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

DEFAULT_JWT_SECRET = "change-me-in-production"


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="CO2_", env_file=".env", extra="ignore")

    app_name: str = "CO2 Emissions Platform API"
    api_v1_prefix: str = "/api/v1"
    debug: bool = False

    # Defaults to "production" so any deployment that forgets to set this
    # explicitly is treated as production and gets the jwt_secret_key
    # guard below. Local dev sets CO2_ENVIRONMENT=development in .env.example.
    environment: str = "production"

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
    jwt_secret_key: str = DEFAULT_JWT_SECRET
    jwt_algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    refresh_token_expire_days: int = 14

    cors_origins: list[str] = ["http://localhost:3000"]
    frontend_url: str = "http://localhost:3000"

    # Abuse protection (per-IP; backed by Redis when redis_url is set)
    rate_limit_enabled: bool = True
    auth_rate_limit: str = "30/minute"
    rate_limit_storage: str = "memory://"
    redis_url: str | None = None

    # Google OAuth (Settings > Connected Accounts). Unset client id/secret
    # disables the connect flow client-side - see /auth/oauth/google/status.
    google_oauth_client_id: str | None = None
    google_oauth_client_secret: str | None = None
    google_oauth_redirect_uri: str = "http://localhost:8000/api/v1/auth/oauth/google/callback"

    # Email (Settings > Notifications delivery). Disabled by default so local
    # dev without SMTP creds doesn't break - sends are logged, not thrown.
    smtp_enabled: bool = False
    smtp_host: str = "localhost"
    smtp_port: int = 587
    smtp_user: str | None = None
    smtp_password: str | None = None
    smtp_from_address: str = "no-reply@emissia.dev"

    # OCO-3/GEE satellite data pipeline (Track A - see docs/ml-integration.md
    # and backend/app/services/oco3_analysis.py). Same credential shape as
    # ml-service's CO2ML_GEE_*/CO2ML_NASA_* - this batch job runs in
    # backend, not ml-service, since it writes to backend-owned Plant rows.
    gee_service_account_email: str | None = None
    gee_service_account_key_path: str | None = None
    gee_project_id: str | None = None
    nasa_earthdata_username: str | None = None
    nasa_earthdata_password: str | None = None

    @property
    def google_oauth_configured(self) -> bool:
        return bool(self.google_oauth_client_id and self.google_oauth_client_secret)

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

    @model_validator(mode="after")
    def _guard_default_jwt_secret(self) -> "Settings":
        if self.environment != "development" and self.jwt_secret_key == DEFAULT_JWT_SECRET:
            raise ValueError(
                "CO2_JWT_SECRET_KEY is still the insecure default "
                f"({DEFAULT_JWT_SECRET!r}). Set a real secret via CO2_JWT_SECRET_KEY, "
                "or set CO2_ENVIRONMENT=development for local development."
            )
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
