from fastapi import APIRouter

from app.core.deps import CurrentUser, DbSession
from app.schemas.dashboard import DashboardStats
from app.services.dashboard import DashboardService

router = APIRouter(prefix="/dashboard", tags=["dashboard"])


@router.get("", response_model=DashboardStats)
async def dashboard(user: CurrentUser, db: DbSession) -> DashboardStats:
    return await DashboardService(db).stats(user.id)
