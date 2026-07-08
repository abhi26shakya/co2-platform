import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import MLModel, Prediction, SatelliteImage


class PredictionRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def add(self, prediction: Prediction) -> Prediction:
        self.session.add(prediction)
        await self.session.flush()
        return prediction

    async def get_owned(self, prediction_id: uuid.UUID, owner_id: uuid.UUID):
        row = await self.session.execute(
            select(Prediction, SatelliteImage.filename, MLModel.version)
            .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
            .outerjoin(MLModel, Prediction.model_id == MLModel.id)
            .where(Prediction.id == prediction_id, SatelliteImage.owner_id == owner_id)
        )
        return row.one_or_none()

    async def list_owned(
        self,
        owner_id: uuid.UUID,
        *,
        image_id: uuid.UUID | None = None,
        page: int = 1,
        page_size: int = 20,
    ):
        query = (
            select(Prediction, SatelliteImage.filename, MLModel.version)
            .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
            .outerjoin(MLModel, Prediction.model_id == MLModel.id)
            .where(SatelliteImage.owner_id == owner_id)
        )
        if image_id is not None:
            query = query.where(Prediction.image_id == image_id)
        total = await self.session.scalar(
            select(func.count()).select_from(query.subquery())
        )
        rows = await self.session.execute(
            query.order_by(Prediction.created_at.desc())
            .offset((page - 1) * page_size)
            .limit(page_size)
        )
        return list(rows.all()), total or 0

    async def get_model_by_version(self, version: str) -> MLModel | None:
        return await self.session.scalar(select(MLModel).where(MLModel.version == version))
