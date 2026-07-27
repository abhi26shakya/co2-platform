"""Prediction persistence: run -> stored -> listed -> logged -> aggregated."""
import io

import pytest
from PIL import Image
from sqlalchemy import func, select


@pytest.fixture(scope="module")
def png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (16, 16), (30, 30, 30)).save(buf, format="PNG")
    return buf.getvalue()


def _make_image(client, headers, png_bytes, name="scene.png"):
    r = client.post(
        "/api/v1/uploads", headers=headers, files={"file": (name, png_bytes, "image/png")}
    )
    assert r.status_code == 201
    return r.json()["id"]


def test_run_prediction_persists(client, auth_headers, png_bytes):
    image_id = _make_image(client, auth_headers, png_bytes)

    r = client.post("/api/v1/predictions", json={"image_id": image_id}, headers=auth_headers)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["status"] == "completed"
    assert body["schema_version"] == "v1"
    assert body["co2_emission_tonnes_per_year"] > 0
    assert 0 <= body["confidence"] <= 100
    assert len(body["hotspots"]) >= 1
    assert body["model_version"] == "mock-0.1.0"
    assert body["image_filename"] == "scene.png"

    # retrievable individually and in the list
    got = client.get(f"/api/v1/predictions/{body['id']}", headers=auth_headers)
    assert got.status_code == 200
    listed = client.get(
        f"/api/v1/predictions?image_id={image_id}", headers=auth_headers
    ).json()
    assert listed["total"] == 1
    assert listed["items"][0]["id"] == body["id"]


def test_heatmap_url_persisted_and_returned(client, auth_headers, png_bytes, monkeypatch):
    """Prediction.heatmap_key stores whatever heatmap_url the inference
    client returns, and the API echoes it back as heatmap_url."""
    from app.schemas.prediction import Hotspot, PredictionResultV1
    from app.services import predictions as predictions_module

    class _FakeClientWithHeatmap:
        async def predict(self, request):
            return PredictionResultV1(
                co2_emission_tonnes_per_year=1234.5,
                confidence=90.0,
                hotspots=[Hotspot(lat=25.0, lon=77.0, intensity=0.5)],
                heatmap_url="https://ml.example.test/heatmaps/abc123.png",
                model_version="mock-0.1.0",
                inference_time_ms=12.3,
            )

        async def health(self):
            return True

    monkeypatch.setattr(
        predictions_module, "get_inference_client", lambda: _FakeClientWithHeatmap()
    )

    image_id = _make_image(client, auth_headers, png_bytes, name="heatmap-scene.png")
    r = client.post("/api/v1/predictions", json={"image_id": image_id}, headers=auth_headers)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["heatmap_url"] == "https://ml.example.test/heatmaps/abc123.png"

    got = client.get(f"/api/v1/predictions/{body['id']}", headers=auth_headers)
    assert got.json()["heatmap_url"] == "https://ml.example.test/heatmaps/abc123.png"

    listed = client.get(
        f"/api/v1/predictions?image_id={image_id}", headers=auth_headers
    ).json()
    assert listed["items"][0]["heatmap_url"] == "https://ml.example.test/heatmaps/abc123.png"


def test_v2_oco3_estimated_result_persisted(client, auth_headers, png_bytes, monkeypatch):
    from app.schemas.prediction import Hotspot, PredictionResultV2
    from app.services import predictions as predictions_module

    class _FakeV2Client:
        async def predict(self, request):
            return PredictionResultV2(
                data_source="oco3_estimated",
                detection_confidence=91.0,
                co2_emission_tonnes_per_year=5200.0,
                co2_estimate_low=3400.0,
                co2_estimate_high=7100.0,
                co2_ppm_enhancement=2.1,
                hotspots=[Hotspot(lat=24.1, lon=82.67, intensity=0.8)],
                model_version="combined-v1",
                inference_time_ms=42.0,
            )

        async def health(self):
            return True

    monkeypatch.setattr(predictions_module, "get_inference_client", lambda: _FakeV2Client())

    image_id = _make_image(client, auth_headers, png_bytes, name="v2-scene.png")
    r = client.post("/api/v1/predictions", json={"image_id": image_id}, headers=auth_headers)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["schema_version"] == "v2"
    assert body["data_source"] == "oco3_estimated"
    assert body["detection_confidence"] == 91.0
    assert body["co2_emission_tonnes_per_year"] == 5200.0
    assert body["co2_estimate_low"] == 3400.0
    assert body["co2_estimate_high"] == 7100.0
    assert body["co2_ppm_enhancement"] == 2.1
    assert body["confidence"] is None  # v1-only field, not conflated with detection_confidence

    got = client.get(f"/api/v1/predictions/{body['id']}", headers=auth_headers).json()
    assert got["data_source"] == "oco3_estimated"
    assert got["co2_estimate_high"] == 7100.0


def test_v2_cnn_proxy_result_has_null_emissions(client, auth_headers, png_bytes, monkeypatch):
    from app.schemas.prediction import Hotspot, PredictionResultV2
    from app.services import predictions as predictions_module

    class _FakeV2ProxyClient:
        async def predict(self, request):
            return PredictionResultV2(
                data_source="cnn_proxy",
                detection_confidence=68.0,
                hotspots=[Hotspot(lat=19.0, lon=72.8, intensity=0.5)],
                model_version="combined-v1",
                inference_time_ms=30.0,
            )

        async def health(self):
            return True

    monkeypatch.setattr(
        predictions_module, "get_inference_client", lambda: _FakeV2ProxyClient()
    )

    image_id = _make_image(client, auth_headers, png_bytes, name="v2-proxy-scene.png")
    r = client.post("/api/v1/predictions", json={"image_id": image_id}, headers=auth_headers)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["data_source"] == "cnn_proxy"
    assert body["detection_confidence"] == 68.0
    assert body["co2_emission_tonnes_per_year"] is None
    assert body["co2_estimate_low"] is None
    assert body["co2_estimate_high"] is None


def test_prediction_unknown_image_404(client, auth_headers):
    r = client.post(
        "/api/v1/predictions",
        json={"image_id": "00000000-0000-0000-0000-000000000000"},
        headers=auth_headers,
    )
    assert r.status_code == 404


def test_cannot_predict_on_other_users_image(client, auth_headers, user_factory, png_bytes):
    image_id = _make_image(client, auth_headers, png_bytes)
    _, _, other = user_factory()
    r = client.post(
        "/api/v1/predictions",
        json={"image_id": image_id},
        headers={"Authorization": f"Bearer {other['access_token']}"},
    )
    assert r.status_code == 404


def test_inference_log_written(client, user_factory, png_bytes):
    import asyncio

    from app.models import InferenceLog
    from tests.conftest import test_session_maker

    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    image_id = _make_image(client, headers, png_bytes)
    pred = client.post(
        "/api/v1/predictions", json={"image_id": image_id}, headers=headers
    ).json()

    async def fetch():
        async with test_session_maker() as s:
            return await s.scalar(
                select(func.count(InferenceLog.id)).where(
                    InferenceLog.prediction_id == pred["id"]
                )
            )

    assert asyncio.run(fetch()) == 1


def test_dashboard_aggregates_after_predictions(client, user_factory, png_bytes):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    a = _make_image(client, headers, png_bytes, "a.png")
    b = _make_image(client, headers, png_bytes, "b.png")
    va = client.post("/api/v1/predictions", json={"image_id": a}, headers=headers).json()
    vb = client.post("/api/v1/predictions", json={"image_id": b}, headers=headers).json()

    stats = client.get("/api/v1/dashboard", headers=headers).json()
    assert stats["total_predictions"] == 2
    expected = round(
        (va["co2_emission_tonnes_per_year"] + vb["co2_emission_tonnes_per_year"]) / 2, 1
    )
    assert stats["avg_emission_tonnes_per_year"] == pytest.approx(expected, abs=0.1)
    assert stats["active_model_version"] == "mock-0.1.0"


def test_deleting_image_cascades_predictions(client, user_factory, png_bytes):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    image_id = _make_image(client, headers, png_bytes)
    client.post("/api/v1/predictions", json={"image_id": image_id}, headers=headers)

    assert client.delete(f"/api/v1/images/{image_id}", headers=headers).status_code == 204
    listed = client.get("/api/v1/predictions", headers=headers).json()
    assert listed["total"] == 0
