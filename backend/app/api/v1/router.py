from fastapi import APIRouter

from app.api.v1 import (
    analytics,
    auth,
    dashboard,
    health,
    images,
    models,
    plants,
    predictions,
    reports,
    settings,
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(images.router)
api_router.include_router(predictions.router)
api_router.include_router(analytics.router)
api_router.include_router(reports.router)
api_router.include_router(models.router)
api_router.include_router(settings.router)
api_router.include_router(plants.router)
