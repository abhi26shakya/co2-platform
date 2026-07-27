"""CombinedPredictor: Track B (NO2/SO2 CNN detection) + Track A (OCO-3
mass-balance estimate, looked up from backend). See PredictionResultV2's
docstring (backend/app/schemas/prediction.py) for what data_source means.

Not wired in as the default PREDICTOR yet (see app/main.py) - it degrades
gracefully (never throws out of predict()) but with no GEE credentials and
no trained weights, its real-world output today is always
data_source="unavailable". Flip CO2ML_PREDICTOR=combined once both are
provisioned (docs/credentials-setup.md, ml-service/weights/README.md).
"""
import logging
from pathlib import Path
from typing import Protocol

from app.clients.backend_client import BackendClient, NearestPlant
from app.core.config import Settings, get_settings
from app.core.errors import CredentialsNotConfiguredError
from app.inference.gee_client import GeeTileClient
from app.schemas import Hotspot, ModelInfo, PredictionRequest, PredictionResultV2

logger = logging.getLogger("ml-service.combined_predictor")

MODEL_VERSION = "combined-v1"
DEFAULT_WEIGHTS_PATH = Path(__file__).resolve().parent.parent.parent / "weights" / "detector2.pt"
DEFAULT_TILE_YEAR = 2024
MAX_PLANT_DISTANCE_KM = 25.0


class TileFetcher(Protocol):
    def fetch_no2_so2_tile(self, *, lat: float, lon: float, year: int): ...


class PlantLookup(Protocol):
    def nearest_plant(
        self, *, lat: float, lon: float, max_distance_km: float
    ) -> NearestPlant | None: ...


class TileScorer(Protocol):
    """Anything that can turn a (2, 64, 64) tile into a 0-1 "is this a
    power-plant-like source" probability - real torch model in production,
    a trivial fake in tests (see tests/fakes.py)."""

    def score(self, tile) -> float: ...


class _TorchCnnScorer:
    """Wraps the trained Detector2 model. Architecture must match
    ml-service/training/train_2channel.py exactly - loading a state_dict
    into a mismatched architecture fails loudly (shape mismatch), not
    silently."""

    def __init__(self, weights_path: Path) -> None:
        import torch
        import torch.nn as nn

        class Detector2(nn.Module):
            def __init__(self) -> None:
                super().__init__()
                self.net = nn.Sequential(
                    nn.Conv2d(2, 16, 3, padding=1),
                    nn.BatchNorm2d(16),
                    nn.SiLU(),
                    nn.MaxPool2d(2),
                    nn.Conv2d(16, 32, 3, padding=1),
                    nn.BatchNorm2d(32),
                    nn.SiLU(),
                    nn.MaxPool2d(2),
                    nn.Conv2d(32, 64, 3, padding=1),
                    nn.BatchNorm2d(64),
                    nn.SiLU(),
                    nn.AdaptiveAvgPool2d(1),
                    nn.Flatten(),
                    nn.Dropout(0.3),
                    nn.Linear(64, 2),
                )

            def forward(self, x):
                return self.net(x)

        self._torch = torch
        self._model = Detector2()
        self._model.load_state_dict(
            torch.load(weights_path, map_location="cpu", weights_only=True)
        )
        self._model.eval()

    def score(self, tile) -> float:
        import numpy as np

        x = tile.astype("float32").copy()
        for c in range(x.shape[0]):
            mean, std = float(np.mean(x[c])), float(np.std(x[c])) + 1e-12
            x[c] = (x[c] - mean) / std
        with self._torch.no_grad():
            logits = self._model(self._torch.tensor(x[None]))
            return self._torch.softmax(logits, dim=1)[0, 1].item()


def _load_cnn(weights_path: Path) -> TileScorer | None:
    """Returns a scorer, or None if weights aren't present - training
    hasn't happened yet in most deployments, and that's not a startup
    error, just "Track B unavailable"."""
    if not weights_path.exists():
        logger.warning("CNN weights not found at %s - Track B (detection) disabled.", weights_path)
        return None
    try:
        return _TorchCnnScorer(weights_path)
    except Exception:
        logger.exception("Failed to load CNN weights from %s - Track B disabled.", weights_path)
        return None


class CombinedPredictor:
    def __init__(
        self,
        *,
        settings: Settings | None = None,
        tile_fetcher: TileFetcher | None = None,
        plant_lookup: PlantLookup | None = None,
        weights_path: Path = DEFAULT_WEIGHTS_PATH,
        cnn: object | None = "_unset",  # sentinel: distinguishes "not passed" from "pass None"
    ) -> None:
        self._settings = settings or get_settings()
        self._tile_fetcher = tile_fetcher or GeeTileClient(self._settings)
        self._plant_lookup = plant_lookup or BackendClient(self._settings)
        self._cnn = _load_cnn(weights_path) if cnn == "_unset" else cnn

    def info(self) -> ModelInfo:
        return ModelInfo(
            name="co2-combined-oco3-cnn",
            version=MODEL_VERSION,
            architecture="NO2/SO2 2-channel CNN detector + OCO-3 mass-balance estimate",
            # Metrics from the research repo's own Week 4 evaluation logs, not
            # re-verified in this deployment - treat as indicative, not certified.
            accuracy=0.0,
            precision=0.0,
            recall=0.0,
            f1_score=0.0,
            last_trained="unknown",
        )

    def predict(self, request: PredictionRequest) -> PredictionResultV2:
        import time

        started = time.perf_counter()
        lat, lon = self._centroid(request)

        detection_confidence = 0.0
        hotspots: list[Hotspot] = []
        if lat is not None and lon is not None:
            detection_confidence = self._run_detection(lat, lon)

        data_source = "unavailable"
        tonnes = low = high = ppm = None

        if lat is not None and lon is not None:
            plant = self._lookup_plant(lat, lon)
            if plant is not None and plant.co2_emission_tonnes_per_year_estimated is not None:
                data_source = "oco3_estimated"
                tonnes = plant.co2_emission_tonnes_per_year_estimated
                low, high = plant.co2_estimate_low, plant.co2_estimate_high
                ppm = plant.co2_enhancement_ppm
                hotspots = [
                    Hotspot(
                        lat=lat,
                        lon=lon,
                        intensity=min(1.0, detection_confidence / 100),
                        radius_m=1000.0,
                    )
                ]
            elif self._cnn is not None:
                data_source = "cnn_proxy"
                hotspots = [
                    Hotspot(lat=lat, lon=lon, intensity=min(1.0, detection_confidence / 100))
                ]

        return PredictionResultV2(
            data_source=data_source,
            detection_confidence=round(detection_confidence, 1),
            co2_emission_tonnes_per_year=tonnes,
            co2_estimate_low=low,
            co2_estimate_high=high,
            co2_ppm_enhancement=ppm,
            hotspots=hotspots,
            model_version=MODEL_VERSION,
            inference_time_ms=round((time.perf_counter() - started) * 1000, 2),
        )

    @staticmethod
    def _centroid(request: PredictionRequest) -> tuple[float | None, float | None]:
        if not request.bounds or len(request.bounds) != 4:
            return None, None
        min_lon, min_lat, max_lon, max_lat = request.bounds
        return (min_lat + max_lat) / 2, (min_lon + max_lon) / 2

    def _run_detection(self, lat: float, lon: float) -> float:
        if self._cnn is None:
            return 0.0
        try:
            tile = self._tile_fetcher.fetch_no2_so2_tile(lat=lat, lon=lon, year=DEFAULT_TILE_YEAR)
            return self._cnn.score(tile) * 100
        except CredentialsNotConfiguredError:
            logger.info("GEE not configured - Track B skipped for this request.")
            return 0.0
        except Exception:  # noqa: BLE001 - a bad GEE response shouldn't fail the whole prediction
            logger.exception("Track B tile fetch/inference failed - treating as no detection.")
            return 0.0

    def _lookup_plant(self, lat: float, lon: float) -> NearestPlant | None:
        try:
            return self._plant_lookup.nearest_plant(
                lat=lat, lon=lon, max_distance_km=MAX_PLANT_DISTANCE_KM
            )
        except Exception:  # noqa: BLE001 - backend being unreachable shouldn't fail the request
            logger.exception("Nearest-plant lookup failed - treating as no OCO-3 data available.")
            return None
