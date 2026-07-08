from fastapi import APIRouter
from sqlalchemy import select

from app.core.deps import CurrentUser, DbSession
from app.models import MLModel
from app.schemas.model import MLModelOut

router = APIRouter(prefix="/models", tags=["models"])


@router.get("", response_model=list[MLModelOut])
async def list_models(user: CurrentUser, db: DbSession) -> list[MLModelOut]:
    """Model registry, active model first, then newest."""
    rows = await db.execute(
        select(MLModel).order_by(MLModel.is_active.desc(), MLModel.created_at.desc())
    )
    return [MLModelOut.model_validate(m) for m in rows.scalars().all()]
