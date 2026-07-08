"""Analytics aggregates - SQL does the math, Python only shapes the response."""
import csv
import io
import uuid

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import MLModel, Plant, Prediction, SatelliteImage
from app.schemas.geo import (
    AnalyticsOut,
    DistributionBucket,
    MapHotspot,
    PlantOut,
    SourceCount,
    TimeseriesPoint,
)

_BUCKETS = 8


def _completed_for(owner_id: uuid.UUID):
    return (
        select(Prediction)
        .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
        .where(
            SatelliteImage.owner_id == owner_id,
            Prediction.status == "completed",
            Prediction.co2_emission_tonnes_per_year.is_not(None),
        )
    )


class AnalyticsService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def overview(self, owner_id: uuid.UUID) -> AnalyticsOut:
        return AnalyticsOut(
            timeseries=await self._timeseries(owner_id),
            distribution=await self._distribution(owner_id),
            sources=await self._sources(owner_id),
            **await self._summary(owner_id),
        )

    async def _timeseries(self, owner_id: uuid.UUID) -> list[TimeseriesPoint]:
        month = func.date_trunc("month", Prediction.created_at).label("month")
        rows = await self.session.execute(
            select(
                month,
                func.avg(Prediction.co2_emission_tonnes_per_year),
                func.sum(Prediction.co2_emission_tonnes_per_year),
                func.count(Prediction.id),
            )
            .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
            .where(
                SatelliteImage.owner_id == owner_id,
                Prediction.status == "completed",
                Prediction.co2_emission_tonnes_per_year.is_not(None),
            )
            .group_by(month)
            .order_by(month)
        )
        return [
            TimeseriesPoint(
                month=m.strftime("%Y-%m"),
                avg_emission=round(avg, 1),
                total_emission=round(total, 1),
                prediction_count=n,
            )
            for m, avg, total, n in rows.all()
        ]

    async def _distribution(self, owner_id: uuid.UUID) -> list[DistributionBucket]:
        base = _completed_for(owner_id).subquery()
        col = base.c.co2_emission_tonnes_per_year
        lo, hi = (
            await self.session.execute(select(func.min(col), func.max(col)))
        ).one()
        if lo is None:
            return []
        if hi <= lo:
            hi = lo + 1
        bucket = func.width_bucket(col, lo, hi, _BUCKETS).label("bucket")
        rows = await self.session.execute(
            select(bucket, func.count()).group_by(bucket).order_by(bucket)
        )
        counts = dict(rows.all())
        step = (hi - lo) / _BUCKETS
        return [
            DistributionBucket(
                lo=round(lo + i * step, 1),
                hi=round(lo + (i + 1) * step, 1),
                # width_bucket puts the max value in bucket N+1; fold into last
                count=counts.get(i + 1, 0)
                + (counts.get(_BUCKETS + 1, 0) if i == _BUCKETS - 1 else 0),
            )
            for i in range(_BUCKETS)
        ]

    async def _sources(self, owner_id: uuid.UUID) -> list[SourceCount]:
        rows = await self.session.execute(
            select(SatelliteImage.source, func.count(SatelliteImage.id))
            .where(SatelliteImage.owner_id == owner_id)
            .group_by(SatelliteImage.source)
            .order_by(func.count(SatelliteImage.id).desc())
        )
        return [SourceCount(source=s, count=n) for s, n in rows.all()]

    async def _summary(self, owner_id: uuid.UUID) -> dict:
        row = (
            await self.session.execute(
                select(
                    func.count(Prediction.id),
                    func.max(Prediction.co2_emission_tonnes_per_year),
                    func.avg(Prediction.confidence),
                )
                .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
                .where(
                    SatelliteImage.owner_id == owner_id,
                    Prediction.status == "completed",
                )
            )
        ).one()
        return {
            "total_predictions": row[0],
            "max_emission": round(row[1], 1) if row[1] is not None else None,
            "avg_confidence": round(row[2], 1) if row[2] is not None else None,
        }

    async def export_csv(self, owner_id: uuid.UUID) -> str:
        rows = await self.session.execute(
            select(
                Prediction.id,
                SatelliteImage.filename,
                Prediction.co2_emission_tonnes_per_year,
                Prediction.confidence,
                MLModel.version,
                Prediction.inference_time_ms,
                Prediction.created_at,
            )
            .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
            .outerjoin(MLModel, Prediction.model_id == MLModel.id)
            .where(SatelliteImage.owner_id == owner_id, Prediction.status == "completed")
            .order_by(Prediction.created_at)
        )
        buf = io.StringIO()
        writer = csv.writer(buf)
        writer.writerow(
            [
                "prediction_id",
                "image_filename",
                "co2_emission_tonnes_per_year",
                "confidence_pct",
                "model_version",
                "inference_time_ms",
                "created_at",
            ]
        )
        for r in rows.all():
            writer.writerow([r[0], r[1], r[2], r[3], r[4] or "", r[5], r[6].isoformat()])
        return buf.getvalue()

    async def plants(self) -> list[PlantOut]:
        rows = await self.session.execute(select(Plant).order_by(Plant.capacity_mw.desc()))
        return [PlantOut.model_validate(p) for p in rows.scalars().all()]

    async def hotspots(self, owner_id: uuid.UUID) -> list[MapHotspot]:
        rows = await self.session.execute(
            select(
                Prediction.hotspots,
                Prediction.co2_emission_tonnes_per_year,
                Prediction.created_at,
                SatelliteImage.filename,
            )
            .join(SatelliteImage, Prediction.image_id == SatelliteImage.id)
            .where(
                SatelliteImage.owner_id == owner_id,
                Prediction.status == "completed",
                Prediction.hotspots.is_not(None),
            )
            .order_by(Prediction.created_at.desc())
            .limit(500)
        )
        out: list[MapHotspot] = []
        for hotspots, emission, created_at, filename in rows.all():
            for h in hotspots:
                out.append(
                    MapHotspot(
                        lat=h["lat"],
                        lon=h["lon"],
                        intensity=h["intensity"],
                        radius_m=h.get("radius_m", 500.0),
                        emission_tonnes_per_year=emission,
                        image_filename=filename,
                        predicted_at=created_at,
                    )
                )
        return out
