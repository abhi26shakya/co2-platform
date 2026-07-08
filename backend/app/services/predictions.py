"""Prediction orchestration: image lookup -> ML inference -> persist result +
append-only inference log. Failures are persisted too, so the monitoring page
shows real error rates."""
import time
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import InferenceLog, Prediction, SatelliteImage
from app.repositories.images import ImageRepository
from app.repositories.predictions import PredictionRepository
from app.schemas.prediction import PredictionRequest
from app.schemas.prediction_api import PredictionOut
from app.services.inference.factory import get_inference_client
from app.storage.local import get_storage


class PredictionError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


class PredictionService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.images = ImageRepository(session)
        self.predictions = PredictionRepository(session)

    async def run(self, *, owner_id: uuid.UUID, image_id: uuid.UUID) -> PredictionOut:
        image = await self.images.get_owned(image_id, owner_id)
        if image is None:
            raise PredictionError(404, "Image not found")

        request = await self._build_ml_request(image)
        client = get_inference_client()
        started = time.perf_counter()
        try:
            result = await client.predict(request)
        except Exception as e:  # noqa: BLE001 - any transport/model failure
            latency = (time.perf_counter() - started) * 1000
            prediction = await self.predictions.add(
                Prediction(
                    image_id=image.id,
                    requested_by=owner_id,
                    status="failed",
                )
            )
            self.session.add(
                InferenceLog(
                    prediction_id=prediction.id,
                    status_code=502,
                    latency_ms=round(latency, 2),
                    error=str(e)[:2000],
                )
            )
            await self.session.commit()
            raise PredictionError(502, "Inference service failed") from e

        model = await self.predictions.get_model_by_version(result.model_version)
        prediction = await self.predictions.add(
            Prediction(
                image_id=image.id,
                model_id=model.id if model else None,
                requested_by=owner_id,
                status="completed",
                schema_version=result.schema_version,
                co2_emission_tonnes_per_year=result.co2_emission_tonnes_per_year,
                confidence=result.confidence,
                hotspots=[h.model_dump() for h in result.hotspots],
                inference_time_ms=result.inference_time_ms,
            )
        )
        self.session.add(
            InferenceLog(
                prediction_id=prediction.id,
                model_version=result.model_version,
                status_code=200,
                latency_ms=round((time.perf_counter() - started) * 1000, 2),
            )
        )
        await self.session.commit()
        await self.session.refresh(prediction)

        out = PredictionOut.model_validate(prediction)
        out.model_version = result.model_version
        out.image_filename = image.filename
        return out

    async def _build_ml_request(self, image: SatelliteImage) -> PredictionRequest:
        url = await get_storage().get_url(image.storage_key)
        return PredictionRequest(
            image_id=str(image.id),
            image_url=url,
            bounds=image.bounds,
            metadata={
                "filename": image.filename,
                "crs": image.crs,
                "source": image.source,
                **image.meta,
            },
        )
