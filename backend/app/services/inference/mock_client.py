"""In-process mock inference - lets the backend run with no ML service at all."""
import random
import time

from app.schemas.prediction import Hotspot, PredictionRequest, PredictionResultV1


class MockInferenceClient:
    async def predict(self, request: PredictionRequest) -> PredictionResultV1:
        start = time.perf_counter()
        rng = random.Random(request.image_id)  # deterministic per image
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
        return PredictionResultV1(
            co2_emission_tonnes_per_year=round(rng.uniform(800, 9500), 1),
            confidence=round(rng.uniform(82, 98), 1),
            hotspots=hotspots,
            heatmap_url=None,
            model_version="mock-0.1.0",
            inference_time_ms=round((time.perf_counter() - start) * 1000, 2),
        )

    async def health(self) -> bool:
        return True
