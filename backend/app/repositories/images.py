import uuid

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import SatelliteImage


class ImageRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_owned(self, image_id: uuid.UUID, owner_id: uuid.UUID) -> SatelliteImage | None:
        return await self.session.scalar(
            select(SatelliteImage).where(
                SatelliteImage.id == image_id, SatelliteImage.owner_id == owner_id
            )
        )

    async def list_owned(
        self,
        owner_id: uuid.UUID,
        *,
        search: str | None = None,
        source: str | None = None,
        page: int = 1,
        page_size: int = 20,
    ) -> tuple[list[SatelliteImage], int]:
        query = select(SatelliteImage).where(SatelliteImage.owner_id == owner_id)
        if search:
            query = query.where(
                or_(
                    SatelliteImage.filename.ilike(f"%{search}%"),
                    SatelliteImage.crs.ilike(f"%{search}%"),
                )
            )
        if source:
            query = query.where(SatelliteImage.source == source)
        total = await self.session.scalar(
            select(func.count()).select_from(query.subquery())
        )
        rows = (
            (
                await self.session.execute(
                    query.order_by(SatelliteImage.created_at.desc())
                    .offset((page - 1) * page_size)
                    .limit(page_size)
                )
            )
            .scalars()
            .all()
        )
        return list(rows), total or 0

    async def delete(self, image: SatelliteImage) -> None:
        await self.session.delete(image)
        await self.session.flush()
