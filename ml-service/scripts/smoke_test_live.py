"""Manual, credentials-required smoke test for CombinedPredictor.

NOT run in CI/pytest - deliberately kept outside tests/ so it's never
auto-collected. Run this by hand, once, before flipping CO2ML_PREDICTOR=combined
in any shared environment, after provisioning real GEE/NASA credentials
(docs/credentials-setup.md) and a trained weights file
(ml-service/weights/README.md).

Usage (from ml-service/, with CO2ML_GEE_*/CO2ML_NASA_* set for real):
    python -m scripts.smoke_test_live
    python -m scripts.smoke_test_live --lat 24.10 --lon 82.67   # near a known plant
"""
import argparse
import sys

from app.core.config import get_settings
from app.inference.model import CombinedPredictor
from app.schemas import PredictionRequest


def main(lat: float, lon: float) -> None:
    settings = get_settings()
    print(f"gee_configured: {settings.gee_configured}")
    print(f"nasa_earthdata_configured: {settings.nasa_earthdata_configured}")
    if not settings.gee_configured:
        print(
            "\n[!] GEE not configured - this will only exercise the "
            "'unavailable' fallback path, not real detection. See "
            "docs/credentials-setup.md."
        )

    predictor = CombinedPredictor(settings=settings)
    if predictor._cnn is None:  # noqa: SLF001 - intentional, this is a diagnostic script
        print("[!] No CNN weights loaded - Track B will report 0 confidence.")

    delta = 0.01
    request = PredictionRequest(
        image_id="smoke-test",
        bounds=[lon - delta, lat - delta, lon + delta, lat + delta],
    )
    print(f"\nRequesting prediction near ({lat}, {lon})...")
    result = predictor.predict(request)
    print(result.model_dump_json(indent=2))

    if result.data_source == "unavailable" and (
        settings.gee_configured or settings.nasa_earthdata_configured
    ):
        print(
            "\n[!] data_source=unavailable even with some credentials configured - "
            "check the logs above for the specific failure (GEE tile fetch, "
            "backend nearest-plant lookup, etc.)."
        )
        sys.exit(1)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--lat", type=float, default=24.10, help="default: Vindhyachal")
    parser.add_argument("--lon", type=float, default=82.67)
    args = parser.parse_args()
    main(args.lat, args.lon)
