"""InferenceClient protocol - the adapter seam for the future ML model."""
from typing import Protocol

from app.schemas.prediction import PredictionRequest, PredictionResultV1, PredictionResultV2


class InferenceClient(Protocol):
    async def predict(
        self, request: PredictionRequest
    ) -> PredictionResultV1 | PredictionResultV2: ...

    async def health(self) -> bool: ...
