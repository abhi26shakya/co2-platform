"""InferenceClient protocol - the adapter seam for the future ML model."""
from typing import Protocol

from app.schemas.prediction import PredictionRequest, PredictionResultV1


class InferenceClient(Protocol):
    async def predict(self, request: PredictionRequest) -> PredictionResultV1: ...

    async def health(self) -> bool: ...
