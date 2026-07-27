"""Predictor interface. Your real model implements this - nothing else changes."""
from typing import Protocol

from app.schemas import ModelInfo, PredictionRequest, PredictionResultV1, PredictionResultV2


class Predictor(Protocol):
    def predict(self, request: PredictionRequest) -> PredictionResultV1 | PredictionResultV2: ...

    def info(self) -> ModelInfo: ...
