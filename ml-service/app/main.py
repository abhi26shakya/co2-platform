from fastapi import FastAPI

from app.inference.mock import MockPredictor
from app.schemas import ModelInfo, PredictionRequest, PredictionResultV1

# THE swap point: replace MockPredictor with your real model class.
PREDICTOR = MockPredictor()

app = FastAPI(title="CO2 ML Inference Service", version="0.1.0")


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_version": PREDICTOR.info().version}


@app.get("/model-info", response_model=ModelInfo)
def model_info() -> ModelInfo:
    return PREDICTOR.info()


@app.post("/predict", response_model=PredictionResultV1)
def predict(request: PredictionRequest) -> PredictionResultV1:
    return PREDICTOR.predict(request)
