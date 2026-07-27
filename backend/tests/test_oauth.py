"""Google OAuth account linking. The real Google token exchange is mocked -
this verifies our state-token / callback / linking logic, not Google's API.
"""
from app.core.config import get_settings
from app.services import oauth as oauth_module


def test_connect_disabled_when_not_configured(client, auth_headers):
    get_settings.cache_clear()
    r = client.get("/api/v1/auth/oauth/google/connect", headers=auth_headers)
    assert r.status_code == 400


def test_status_reports_configured_and_connected(client, auth_headers, monkeypatch):
    monkeypatch.setenv("CO2_GOOGLE_OAUTH_CLIENT_ID", "test-client-id")
    monkeypatch.setenv("CO2_GOOGLE_OAUTH_CLIENT_SECRET", "test-client-secret")
    get_settings.cache_clear()
    try:
        r = client.get("/api/v1/auth/oauth/google/status", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["configured"] is True
        assert r.json()["connected"] is False
    finally:
        get_settings.cache_clear()


def test_connect_returns_google_authorize_url(client, auth_headers, monkeypatch):
    monkeypatch.setenv("CO2_GOOGLE_OAUTH_CLIENT_ID", "test-client-id")
    monkeypatch.setenv("CO2_GOOGLE_OAUTH_CLIENT_SECRET", "test-client-secret")
    get_settings.cache_clear()
    try:
        r = client.get("/api/v1/auth/oauth/google/connect", headers=auth_headers)
        assert r.status_code == 200, r.text
        url = r.json()["authorize_url"]
        assert url.startswith("https://accounts.google.com/o/oauth2/v2/auth?")
        assert "state=" in url
    finally:
        get_settings.cache_clear()


def test_callback_links_account_then_disconnect(client, user_factory, monkeypatch):
    email, password, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    monkeypatch.setenv("CO2_GOOGLE_OAUTH_CLIENT_ID", "test-client-id")
    monkeypatch.setenv("CO2_GOOGLE_OAUTH_CLIENT_SECRET", "test-client-secret")
    get_settings.cache_clear()

    async def fake_exchange(self, code: str) -> tuple[str, str]:
        return "google-sub-123", "googleuser@gmail.com"

    monkeypatch.setattr(oauth_module.GoogleOAuthService, "_exchange_code", fake_exchange)

    try:
        connect = client.get("/api/v1/auth/oauth/google/connect", headers=headers)
        authorize_url = connect.json()["authorize_url"]
        state = authorize_url.split("state=")[1].split("&")[0]

        callback = client.get(
            "/api/v1/auth/oauth/google/callback",
            params={"code": "fake-code", "state": state},
            follow_redirects=False,
        )
        assert callback.status_code in (302, 307)
        assert "google=connected" in callback.headers["location"]

        me = client.get("/api/v1/auth/me", headers=headers)
        assert me.json()["google_connected"] is True

        status = client.get("/api/v1/auth/oauth/google/status", headers=headers)
        assert status.json()["connected"] is True
        assert status.json()["google_email"] == "googleuser@gmail.com"

        disconnect = client.delete("/api/v1/auth/oauth/google", headers=headers)
        assert disconnect.status_code == 200
        assert disconnect.json()["google_connected"] is False
    finally:
        get_settings.cache_clear()


def test_callback_rejects_bad_state(client):
    r = client.get(
        "/api/v1/auth/oauth/google/callback",
        params={"code": "fake-code", "state": "garbage"},
        follow_redirects=False,
    )
    assert r.status_code in (302, 307)
    assert "google=error" in r.headers["location"]
