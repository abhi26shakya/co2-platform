"""Dashboard aggregates - one query per card, scoped to the requesting user
where ownership applies (images/uploads) and global where it doesn't (model)."""
import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import MLModel, Prediction, SatelliteImage
from app.schemas.dashboard import DashboardStats, RecentUpload
from app.services.inference.factory import get_inference_client


class DashboardService:
    def __init__(self, session: AsyncSession) -> None:
        self._session = session

    async def stats(self, user_id: uuid.UUID) -> DashboardStats:
        processed_images = await self._session.scalar(
            select(func.count(SatelliteImage.id)).where(SatelliteImage.owner_id == user_id)
        )
        total_predictions = await self._session.scalar(
            select(func.count(Prediction.id))
            .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
            .where(SatelliteImage.owner_id == user_id)
        )
        avg_row = (
            await self._session.execute(
                select(
                    func.avg(Prediction.co2_emission_tonnes_per_year),
                    func.avg(Prediction.confidence),
                )
                .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
                .where(SatelliteImage.owner_id == user_id)
            )
        ).one()
        recent = (
            (
                await self._session.execute(
                    select(SatelliteImage)
                    .where(SatelliteImage.owner_id == user_id)
                    .order_by(SatelliteImage.created_at.desc())
                    .limit(5)
                )
            )
            .scalars()
            .all()
        )
        active_model = await self._session.scalar(
            select(MLModel.version).where(MLModel.is_active.is_(True)).limit(1)
        )
        ml_ok = await get_inference_client().health()

        return DashboardStats(
            processed_images=processed_images or 0,
            total_predictions=total_predictions or 0,
            avg_emission_tonnes_per_year=(
                round(avg_row[0], 1) if avg_row[0] is not None else None
            ),
            avg_confidence=round(avg_row[1], 1) if avg_row[1] is not None else None,
            recent_uploads=[RecentUpload.model_validate(img) for img in recent],
            active_model_version=active_model,
            ml_service_status="ok" if ml_ok else "unreachable",
        )
