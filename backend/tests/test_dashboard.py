def test_dashboard_requires_auth(client):
    assert client.get("/api/v1/dashboard").status_code == 401


def test_dashboard_empty_state(client, auth_headers):
    resp = client.get("/api/v1/dashboard", headers=auth_headers)
    assert resp.status_code == 200
    body = resp.json()
    assert body["processed_images"] == 0
    assert body["total_predictions"] == 0
    assert body["avg_emission_tonnes_per_year"] is None
    assert body["recent_uploads"] == []
    assert body["ml_service_status"] in ("ok", "unreachable")
