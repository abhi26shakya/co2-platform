"""Upload pipeline tests using a real in-memory GeoTIFF and PNG."""
import io

import numpy as np
import pytest
import rasterio
from PIL import Image
from rasterio.transform import from_bounds

# Vindhyachal-area bounds for the synthetic scene
BOUNDS = (82.57, 24.00, 82.77, 24.20)  # min_lon, min_lat, max_lon, max_lat


@pytest.fixture(scope="module")
def geotiff_bytes() -> bytes:
    w, h, bands = 64, 64, 3
    transform = from_bounds(*BOUNDS, w, h)
    data = (np.random.default_rng(42).random((bands, h, w)) * 4000).astype("uint16")
    mem = rasterio.io.MemoryFile()
    with mem.open(
        driver="GTiff",
        width=w,
        height=h,
        count=bands,
        dtype="uint16",
        crs="EPSG:4326",
        transform=transform,
    ) as dst:
        dst.write(data)
    return mem.read()


@pytest.fixture(scope="module")
def png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (32, 24), (10, 200, 120)).save(buf, format="PNG")
    return buf.getvalue()


def _upload(client, headers, name, payload, mime):
    return client.post(
        "/api/v1/uploads",
        headers=headers,
        files={"file": (name, payload, mime)},
    )


def test_upload_requires_auth(client, png_bytes):
    assert _upload(client, {}, "a.png", png_bytes, "image/png").status_code == 401


def test_upload_geotiff_extracts_geo_metadata(client, auth_headers, geotiff_bytes):
    r = _upload(client, auth_headers, "vindhyachal scene.tif", geotiff_bytes, "image/tiff")
    assert r.status_code == 201, r.text
    body = r.json()
    assert body["content_type"] == "image/tiff"
    assert body["width"] == 64 and body["height"] == 64
    assert body["crs"] == "EPSG:4326"
    assert body["bounds"] == pytest.approx(list(BOUNDS), abs=1e-4)
    assert body["meta"]["band_count"] == 3
    assert body["filename"] == "vindhyachal_scene.tif"  # spaces sanitized
    assert body["preview_url"]  # TIFFs get a browser-renderable preview
    # preview is actually fetchable and is a PNG
    p = client.get(body["preview_url"])
    assert p.status_code == 200
    assert p.content[:8] == b"\x89PNG\r\n\x1a\n"


def test_upload_png_no_preview_needed(client, auth_headers, png_bytes):
    r = _upload(client, auth_headers, "plain.png", png_bytes, "image/png")
    assert r.status_code == 201
    body = r.json()
    assert body["width"] == 32 and body["height"] == 24
    assert body["bounds"] is None
    assert body["preview_url"] is None
    assert client.get(body["url"]).status_code == 200


def test_upload_rejects_spoofed_extension(client, auth_headers):
    """A .png that is actually a text file must fail magic-byte sniffing."""
    r = _upload(client, auth_headers, "evil.png", b"#!/bin/sh echo pwned", "image/png")
    assert r.status_code == 422


def test_upload_rejects_disallowed_extension(client, auth_headers, png_bytes):
    r = _upload(client, auth_headers, "notes.pdf", png_bytes, "application/pdf")
    assert r.status_code == 422


def test_list_search_and_delete(client, auth_headers, png_bytes):
    _upload(client, auth_headers, "findme-alpha.png", png_bytes, "image/png")
    _upload(client, auth_headers, "other-beta.png", png_bytes, "image/png")

    r = client.get("/api/v1/images?search=findme", headers=auth_headers)
    assert r.status_code == 200
    body = r.json()
    assert body["total"] == 1
    image = body["items"][0]

    assert (
        client.delete(f"/api/v1/images/{image['id']}", headers=auth_headers).status_code == 204
    )
    assert client.get(f"/api/v1/images/{image['id']}", headers=auth_headers).status_code == 404
    # file gone from storage too
    assert client.get(image["url"]).status_code == 404


def test_cannot_access_other_users_image(client, auth_headers, user_factory, png_bytes):
    r = _upload(client, auth_headers, "mine.png", png_bytes, "image/png")
    image_id = r.json()["id"]
    _, _, other = user_factory()
    other_headers = {"Authorization": f"Bearer {other['access_token']}"}
    assert client.get(f"/api/v1/images/{image_id}", headers=other_headers).status_code == 404
    assert (
        client.delete(f"/api/v1/images/{image_id}", headers=other_headers).status_code == 404
    )


def test_dashboard_counts_after_upload(client, user_factory, png_bytes):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    _upload(client, headers, "counted.png", png_bytes, "image/png")
    stats = client.get("/api/v1/dashboard", headers=headers).json()
    assert stats["processed_images"] == 1
    assert stats["recent_uploads"][0]["filename"] == "counted.png"
