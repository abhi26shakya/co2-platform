"""Report generation (PDF via reportlab + CSV) and the model registry API."""
import io

import pytest
from PIL import Image


@pytest.fixture(scope="module")
def png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (16, 16), (9, 9, 9)).save(buf, format="PNG")
    return buf.getvalue()


@pytest.fixture
def researcher(client, user_factory, png_bytes):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    for name in ("r1.png", "r2.png"):
        img = client.post(
            "/api/v1/uploads", headers=headers, files={"file": (name, png_bytes, "image/png")}
        ).json()["id"]
        client.post("/api/v1/predictions", json={"image_id": img}, headers=headers)
    return headers


def test_reports_require_auth(client):
    assert client.post("/api/v1/reports", json={"format": "pdf"}).status_code == 401


def test_generate_pdf_report(client, researcher):
    r = client.post("/api/v1/reports", json={"format": "pdf"}, headers=researcher)
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["format"] == "pdf"
    assert body["title"].startswith("Emission report")
    # the stored file is a real PDF
    f = client.get(body["url"])
    assert f.status_code == 200
    assert f.content[:5] == b"%PDF-"
    assert len(f.content) > 10_000  # contains embedded charts, not an empty shell


def test_generate_csv_report(client, researcher):
    r = client.post("/api/v1/reports", json={"format": "csv"}, headers=researcher)
    assert r.status_code == 201
    f = client.get(r.json()["url"])
    assert f.text.splitlines()[0].startswith("prediction_id,image_filename")
    assert len(f.text.splitlines()) == 3  # header + 2 predictions


def test_pdf_report_with_no_data(client, user_factory):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    r = client.post("/api/v1/reports", json={"format": "pdf"}, headers=headers)
    assert r.status_code == 201
    assert client.get(r.json()["url"]).content[:5] == b"%PDF-"


def test_list_and_delete_report(client, researcher):
    created = client.post("/api/v1/reports", json={"format": "pdf"}, headers=researcher).json()
    listed = client.get("/api/v1/reports", headers=researcher).json()
    assert any(r["id"] == created["id"] for r in listed)

    assert (
        client.delete(f"/api/v1/reports/{created['id']}", headers=researcher).status_code == 204
    )
    listed = client.get("/api/v1/reports", headers=researcher).json()
    assert all(r["id"] != created["id"] for r in listed)
    assert client.get(created["url"]).status_code == 404  # file removed from storage


def test_cannot_delete_other_users_report(client, researcher, user_factory):
    created = client.post("/api/v1/reports", json={"format": "pdf"}, headers=researcher).json()
    _, _, other = user_factory()
    r = client.delete(
        f"/api/v1/reports/{created['id']}",
        headers={"Authorization": f"Bearer {other['access_token']}"},
    )
    assert r.status_code == 404


def test_models_registry(client, auth_headers):
    r = client.get("/api/v1/models", headers=auth_headers)
    assert r.status_code == 200
    models = r.json()
    assert len(models) >= 1
    active = models[0]
    assert active["is_active"] is True
    assert active["version"] == "mock-0.1.0"
    assert active["accuracy"] is None  # metrics arrive with the real model
