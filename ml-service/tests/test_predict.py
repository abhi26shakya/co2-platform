from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_predict_contract():
    resp = client.post("/predict", json={"image_id": "abc", "bounds": [83.3, 26.7, 83.5, 26.9]})
    assert resp.status_code == 200
    body = resp.json()
    assert body["schema_version"] == "v1"
    assert body["co2_emission_tonnes_per_year"] > 0
    for h in body["hotspots"]:
        assert 26.7 <= h["lat"] <= 26.9
        assert 83.3 <= h["lon"] <= 83.5


def test_determinism():
    a = client.post("/predict", json={"image_id": "same"}).json()
    b = client.post("/predict", json={"image_id": "same"}).json()
    assert a["co2_emission_tonnes_per_year"] == b["co2_emission_tonnes_per_year"]
