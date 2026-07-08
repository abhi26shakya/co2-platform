"""Mock predictor. REPLACE THIS FILE with model.py wrapping your trained CNN/U-Net.

Integration checklist for the real model:
  1. Create app/inference/model.py with a class implementing the Predictor protocol.
  2. Load weights once in __init__ (module import time), not per request.
  3. Fetch the image via request.image_url, preprocess with rasterio, run inference.
  4. Map model output -> PredictionResultV1 (emissions, confidence, hotspots, heatmap).
  5. Point PREDICTOR in app/main.py at the new class. Done.
"""
import random
import time

from app.schemas import Hotspot, ModelInfo, PredictionRequest, PredictionResultV1


class MockPredictor:
    def predict(self, request: PredictionRequest) -> PredictionResultV1:
        start = time.perf_counter()
        rng = random.Random(request.image_id)
        bounds = request.bounds or [77.0, 25.0, 77.2, 25.2]
        min_lon, min_lat, max_lon, max_lat = bounds
        hotspots = [
            Hotspot(
                lat=rng.uniform(min_lat, max_lat),
                lon=rng.uniform(min_lon, max_lon),
                intensity=round(rng.uniform(0.4, 1.0), 3),
                radius_m=rng.choice([300, 500, 800]),
            )
            for _ in range(rng.randint(2, 6))
        ]
        time.sleep(rng.uniform(0.05, 0.2))  # simulate inference latency
        return PredictionResultV1(
            co2_emission_tonnes_per_year=round(rng.uniform(800, 9500), 1),
            confidence=round(rng.uniform(82, 98), 1),
            hotspots=hotspots,
            model_version=self.info().version,
            inference_time_ms=round((time.perf_counter() - start) * 1000, 2),
        )

    def info(self) -> ModelInfo:
        return ModelInfo(
            name="co2-unet-mock",
            version="mock-0.1.0",
            architecture="U-Net (placeholder)",
            accuracy=0.0,
            precision=0.0,
            recall=0.0,
            f1_score=0.0,
            last_trained="never",
        )
