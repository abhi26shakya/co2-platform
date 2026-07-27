from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.config import get_settings
from app.core.errors import CredentialsNotConfiguredError
from app.inference.mock import MockPredictor
from app.schemas import ModelInfo, PredictionRequest, PredictionResultV1, PredictionResultV2


def _build_predictor():
    """THE swap point. Selected by CO2ML_PREDICTOR (default "mock", safe on
    a fresh deployment) rather than a hardcoded class - see
    app/core/config.py's `predictor` field. CombinedPredictor is imported
    lazily so mock-mode deployments never need torch/earthengine-api
    installed."""
    settings = get_settings()
    if settings.predictor == "combined":
        from app.inference.model import CombinedPredictor

        return CombinedPredictor(settings=settings)
    return MockPredictor()


PREDICTOR = _build_predictor()

app = FastAPI(title="CO2 ML Inference Service", version="0.1.0")


@app.exception_handler(CredentialsNotConfiguredError)
def _credentials_not_configured(
    request: Request, exc: CredentialsNotConfiguredError
) -> JSONResponse:
    return JSONResponse(
        status_code=503,
        content={"detail": str(exc), "provider": exc.provider},
    )


@app.get("/health")
def health() -> dict:
    return {"status": "ok", "model_version": PREDICTOR.info().version}


@app.get("/health/credentials")
def health_credentials() -> dict:
    settings = get_settings()
    return {
        "gee": settings.gee_configured,
        "nasa_earthdata": settings.nasa_earthdata_configured,
    }


@app.get("/model-info", response_model=ModelInfo)
def model_info() -> ModelInfo:
    return PREDICTOR.info()


@app.post("/predict", response_model=PredictionResultV1 | PredictionResultV2)
def predict(request: PredictionRequest) -> PredictionResultV1 | PredictionResultV2:
    return PREDICTOR.predict(request)
