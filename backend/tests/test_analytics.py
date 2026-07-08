"""Analytics + map data endpoints."""
import csv
import io

import pytest
from PIL import Image


@pytest.fixture(scope="module")
def png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (16, 16), (5, 5, 5)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def user_with_predictions(client, user_factory, png_bytes):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    emissions = []
    for name in ("s1.png", "s2.png", "s3.png"):
        img = client.post(
            "/api/v1/uploads", headers=headers, files={"file": (name, png_bytes, "image/png")}
        ).json()["id"]
        p = client.post("/api/v1/predictions", json={"image_id": img}, headers=headers).json()
        emissions.append(p["co2_emission_tonnes_per_year"])
    return headers, emissions


def test_analytics_requires_auth(client):
    assert client.get("/api/v1/analytics").status_code == 401


def test_analytics_overview(client, user_with_predictions):
    headers, emissions = user_with_predictions
    body = client.get("/api/v1/analytics", headers=headers).json()

    assert body["total_predictions"] == 3
    assert body["max_emission"] == pytest.approx(max(emissions), abs=0.1)

    # all predictions were just created -> single month bucket holding all 3
    assert len(body["timeseries"]) == 1
    ts = body["timeseries"][0]
    assert ts["prediction_count"] == 3
    assert ts["total_emission"] == pytest.approx(sum(emissions), abs=0.5)

    # distribution buckets cover the value range and account for every prediction
    dist = body["distribution"]
    assert len(dist) == 8
    assert sum(b["count"] for b in dist) == 3
    assert dist[0]["lo"] == pytest.approx(min(emissions), abs=0.1)
    assert dist[-1]["hi"] == pytest.approx(max(emissions), abs=0.1)

    assert body["sources"] == [{"source": "upload", "count": 3}]


def test_analytics_empty_user(client, user_factory):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    body = client.get("/api/v1/analytics", headers=headers).json()
    assert body["total_predictions"] == 0
    assert body["timeseries"] == [] and body["distribution"] == []
    assert body["max_emission"] is None


def test_csv_export(client, user_with_predictions):
    headers, emissions = user_with_predictions
    r = client.get("/api/v1/analytics/export", headers=headers)
    assert r.status_code == 200
    assert r.headers["content-type"].startswith("text/csv")
    assert "emissia-predictions.csv" in r.headers["content-disposition"]
    rows = list(csv.DictReader(io.StringIO(r.text)))
    assert len(rows) == 3
    got = sorted(float(row["co2_emission_tonnes_per_year"]) for row in rows)
    assert got == pytest.approx(sorted(emissions), abs=0.1)
    assert rows[0]["model_version"] == "mock-0.1.0"


def test_map_plants_seeded(client, auth_headers):
    # test DB seeds only the model; plants come from the dev seed - here we just
    # assert the endpoint shape works with whatever is present
    r = client.get("/api/v1/map/plants", headers=auth_headers)
    assert r.status_code == 200
    assert isinstance(r.json(), list)


def test_map_hotspots_flattened(client, user_with_predictions):
    headers, _ = user_with_predictions
    r = client.get("/api/v1/map/hotspots", headers=headers)
    assert r.status_code == 200
    spots = r.json()
    assert len(spots) >= 3  # mock emits 2-6 per prediction, 3 predictions
    for h in spots[:3]:
        assert 0 <= h["intensity"] <= 1
        assert h["image_filename"].endswith(".png")
        assert h["emission_tonnes_per_year"] > 0
