"""HTTP adapter calling the isolated ML service. Same contract as the mock."""
import httpx

from app.core.config import get_settings
from app.schemas.prediction import PredictionRequest, PredictionResultV1, PredictionResultV2


class HTTPInferenceClient:
    def __init__(self) -> None:
        settings = get_settings()
        self._base_url = settings.ml_service_url.rstrip("/")
        self._timeout = settings.ml_request_timeout_seconds

    async def predict(
        self, request: PredictionRequest
    ) -> PredictionResultV1 | PredictionResultV2:
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            resp = await client.post(f"{self._base_url}/predict", json=request.model_dump())
            resp.raise_for_status()
            body = resp.json()
        # Version-aware: whichever predictor ml-service is currently
        # running decides the shape - MockPredictor still returns v1,
        # CombinedPredictor (M6) returns v2. Never assume v1.
        if body.get("schema_version") == "v2":
            return PredictionResultV2.model_validate(body)
        return PredictionResultV1.model_validate(body)

    async def health(self) -> bool:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                resp = await client.get(f"{self._base_url}/health")
                return resp.status_code == 200
        except httpx.HTTPError:
            return False
