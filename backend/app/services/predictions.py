"""Prediction orchestration: image lookup -> ML inference -> persist result +
append-only inference log. Failures are persisted too, so the monitoring page
shows real error rates."""
import time
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.models import InferenceLog, Prediction, SatelliteImage
from app.repositories.images import ImageRepository
from app.repositories.predictions import PredictionRepository
from app.schemas.prediction import PredictionRequest, PredictionResultV2
from app.schemas.prediction_api import PredictionOut
from app.services.inference.factory import get_inference_client
from app.services.notifications import notify_user
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
        is_v2 = isinstance(result, PredictionResultV2)
        prediction = await self.predictions.add(
            Prediction(
                image_id=image.id,
                model_id=model.id if model else None,
                requested_by=owner_id,
                status="completed",
                schema_version=result.schema_version,
                co2_emission_tonnes_per_year=result.co2_emission_tonnes_per_year,
                confidence=None if is_v2 else result.confidence,
                hotspots=[h.model_dump() for h in result.hotspots],
                heatmap_key=result.heatmap_url,
                inference_time_ms=result.inference_time_ms,
                data_source=result.data_source if is_v2 else None,
                detection_confidence=result.detection_confidence if is_v2 else None,
                co2_ppm_enhancement=result.co2_ppm_enhancement if is_v2 else None,
                co2_estimate_low=result.co2_estimate_low if is_v2 else None,
                co2_estimate_high=result.co2_estimate_high if is_v2 else None,
                ground_truth_validated=result.ground_truth_validated if is_v2 else None,
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
        out.heatmap_url = prediction.heatmap_key

        await notify_user(
            self.session,
            user_id=owner_id,
            kind="prediction_completed",
            subject="Emissia: prediction complete",
            body=self._notification_body(image.filename, result, is_v2),
        )
        return out

    @staticmethod
    def _notification_body(filename: str, result, is_v2: bool) -> str:
        if not is_v2:
            return (
                f"Your prediction for {filename} is ready: "
                f"{result.co2_emission_tonnes_per_year:.1f} t CO2/year "
                f"(confidence {result.confidence:.1f}%)."
            )
        if result.data_source == "oco3_estimated" and result.co2_emission_tonnes_per_year:
            return (
                f"Your prediction for {filename} is ready: an estimated "
                f"{result.co2_emission_tonnes_per_year:.1f} t CO2/year "
                f"[{result.co2_estimate_low:.0f}-{result.co2_estimate_high:.0f}] "
                "based on nearby OCO-3 satellite measurements."
            )
        return (
            f"Your prediction for {filename} is ready: a combustion source was "
            f"detected with {result.detection_confidence:.1f}% confidence "
            "(no direct CO2 measurement available for this location)."
        )

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
