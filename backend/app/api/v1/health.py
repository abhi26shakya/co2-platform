from fastapi import APIRouter

from app.core.config import get_settings
from app.services.inference.factory import get_inference_client

router = APIRouter(tags=["system"])

API_VERSION = "0.1.0"
PLATFORM_VERSION = "1.0.0"


@router.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@router.get("/system/status")
async def system_status() -> dict:
    """Used by the dashboard 'System status' card and Settings > About."""
    ml_ok = await get_inference_client().health()
    settings = get_settings()
    return {
        "api": "ok",
        "ml_service": "ok" if ml_ok else "unreachable",
        "api_version": API_VERSION,
        "platform_version": PLATFORM_VERSION,
        "inference_backend": settings.inference_backend,
    }
