from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health():
    resp = client.get("/api/v1/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_prediction_requires_auth():
    resp = client.post("/api/v1/predictions", json={"image_id": "x"})
    assert resp.status_code == 401
