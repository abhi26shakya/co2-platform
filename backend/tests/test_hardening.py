"""Rate limiting + hardening middleware."""
from app.core.ratelimit import limiter
from app.main import app  # noqa: F401 - ensures middleware installed


def test_login_rate_limited(client):
    limiter.reset()
    limiter.enabled = True
    try:
        statuses = [
            client.post(
                "/api/v1/auth/login",
                json={"email": "nobody@test.dev", "password": "wrong-pass-123"},
            ).status_code
            for _ in range(7)  # test limit: 5/minute
        ]
    finally:
        limiter.enabled = False
    assert statuses[0] == 401  # normal auth failure first
    assert 429 in statuses  # then the limiter kicks in
    assert statuses[-1] == 429


def test_rate_limit_response_shape(client):
    limiter.reset()
    limiter.enabled = True
    try:
        last = None
        for _ in range(7):
            last = client.post(
                "/api/v1/auth/login",
                json={"email": "nobody2@test.dev", "password": "wrong-pass-123"},
            )
    finally:
        limiter.enabled = False
    assert last is not None and last.status_code == 429
    assert "Too many requests" in last.json()["detail"]


def test_security_headers_present(client):
    r = client.get("/api/v1/health")
    assert r.headers["x-content-type-options"] == "nosniff"
    assert r.headers["x-frame-options"] == "DENY"
    assert r.headers["referrer-policy"] == "strict-origin-when-cross-origin"


def test_unknown_route_is_clean_json(client):
    r = client.get("/api/v1/does-not-exist")
    assert r.status_code == 404
    assert r.json()["detail"] == "Not Found"
