from fastapi import APIRouter
from fastapi.responses import Response

from app.core.deps import CurrentUser, DbSession
from app.schemas.geo import AnalyticsOut, MapHotspot, PlantOut
from app.services.analytics import AnalyticsService

router = APIRouter(tags=["analytics"])


@router.get("/analytics", response_model=AnalyticsOut)
async def analytics(user: CurrentUser, db: DbSession) -> AnalyticsOut:
    return await AnalyticsService(db).overview(user.id)


@router.get("/analytics/export")
async def export_csv(user: CurrentUser, db: DbSession) -> Response:
    csv_text = await AnalyticsService(db).export_csv(user.id)
    return Response(
        content=csv_text,
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="emissia-predictions.csv"'},
    )


@router.get("/map/plants", response_model=list[PlantOut])
async def map_plants(user: CurrentUser, db: DbSession) -> list[PlantOut]:
    return await AnalyticsService(db).plants()


@router.get("/map/hotspots", response_model=list[MapHotspot])
async def map_hotspots(user: CurrentUser, db: DbSession) -> list[MapHotspot]:
    return await AnalyticsService(db).hotspots(user.id)
