from fastapi import APIRouter

from app.services.inference.factory import get_inference_client

router = APIRouter(tags=["system"])


@router.get("/health")
async def health() -> dict:
    return {"status": "ok"}


@router.get("/system/status")
async def system_status() -> dict:
    """Used by the dashboard 'System status' card."""
    ml_ok = await get_inference_client().health()
    return {
        "api": "ok",
        "ml_service": "ok" if ml_ok else "unreachable",
    }
