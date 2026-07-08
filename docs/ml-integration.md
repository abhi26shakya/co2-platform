# ML Model Integration Guide

When the CNN/U-Net is ready:

1. `ml-service/app/inference/model.py` — implement the `Predictor` protocol:

   ```python
   class UNetPredictor:
       def __init__(self):
           self.model = load_weights("weights/co2_unet_v1.pt")  # once, at import

       def predict(self, request: PredictionRequest) -> PredictionResultV1:
           img = fetch_and_preprocess(request.image_url)   # rasterio
           out = self.model(img)
           return to_contract(out)                          # map to V1 schema

       def info(self) -> ModelInfo: ...
   ```

2. `ml-service/app/main.py` — change one line: `PREDICTOR = UNetPredictor()`
3. Move deps from `requirements-model.txt` into `requirements.txt`
   (torch, rasterio, numpy). Consider a CUDA base image in the Dockerfile.
4. Contract tests in `ml-service/tests/test_predict.py` must still pass.
5. Backend: set `CO2_INFERENCE_BACKEND=http`. Nothing else changes.

If the real model outputs richer data (per-pixel heatmaps, uncertainty bands),
add `PredictionResultV2` in BOTH schema files and version the endpoint —
never mutate V1, existing stored predictions depend on it.
