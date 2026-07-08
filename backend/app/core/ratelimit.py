"""Rate limiting (slowapi), configured via Settings:
- CO2_RATE_LIMIT_ENABLED  (default true; tests disable it)
- CO2_AUTH_RATE_LIMIT     (default "30/minute", applied to signup/login/refresh)
- CO2_RATE_LIMIT_STORAGE  (default in-memory; use redis://... in production
                           so limits hold across workers)
"""
from slowapi import Limiter
from slowapi.util import get_remote_address

from app.core.config import get_settings

_settings = get_settings()

limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=_settings.rate_limit_storage,
    enabled=_settings.rate_limit_enabled,
)
