"""Settings: profile fields, avatar upload."""
import io

from PIL import Image


def _png_bytes() -> bytes:
    buf = io.BytesIO()
    Image.new("RGB", (8, 8), color="red").save(buf, format="PNG")
    return buf.getvalue()


def test_update_profile_extended_fields(client, auth_headers):
    r = client.patch(
        "/api/v1/auth/me",
        json={
            "organization": "Acme Labs",
            "job_title": "Researcher",
            "country": "India",
            "bio": "Studying emissions.",
        },
        headers=auth_headers,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["organization"] == "Acme Labs"
    assert body["job_title"] == "Researcher"
    assert body["country"] == "India"
    assert body["bio"] == "Studying emissions."


def test_avatar_upload_and_delete(client, auth_headers):
    r = client.post(
        "/api/v1/settings/avatar",
        files={"file": ("avatar.png", _png_bytes(), "image/png")},
        headers=auth_headers,
    )
    assert r.status_code == 200, r.text
    avatar_url = r.json()["avatar_url"]
    assert avatar_url

    me = client.get("/api/v1/auth/me", headers=auth_headers)
    assert me.json()["avatar_url"] == avatar_url

    r = client.delete("/api/v1/settings/avatar", headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["avatar_url"] is None


def test_avatar_rejects_oversized_and_bad_type(client, auth_headers):
    r = client.post(
        "/api/v1/settings/avatar",
        files={"file": ("avatar.txt", b"not an image", "text/plain")},
        headers=auth_headers,
    )
    assert r.status_code == 422


def test_change_password_success_then_old_refresh_revoked(client, user_factory):
    email, password, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = client.post(
        "/api/v1/auth/change-password",
        json={"current_password": password, "new_password": "new-s3cure-pass-456"},
        headers=headers,
    )
    assert r.status_code == 204, r.text

    # Old refresh token was revoked by the password change.
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 401

    # New password logs in fine.
    r = client.post(
        "/api/v1/auth/login", json={"email": email, "password": "new-s3cure-pass-456"}
    )
    assert r.status_code == 200

    # Old password no longer works.
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 401


def test_change_password_wrong_current_401(client, auth_headers):
    r = client.post(
        "/api/v1/auth/change-password",
        json={"current_password": "totally-wrong", "new_password": "new-s3cure-pass-456"},
        headers=auth_headers,
    )
    assert r.status_code == 401


def test_delete_account_soft_deletes_and_blocks_login(client, user_factory):
    email, password, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}

    r = client.post(
        "/api/v1/settings/account/delete",
        json={"current_password": password},
        headers=headers,
    )
    assert r.status_code == 204, r.text

    # Deleted (disabled) account can no longer log in with the old email.
    r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert r.status_code == 401

    # Old refresh token is revoked.
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 401


def test_delete_account_wrong_password_401(client, auth_headers):
    r = client.post(
        "/api/v1/settings/account/delete",
        json={"current_password": "totally-wrong"},
        headers=auth_headers,
    )
    assert r.status_code == 401


def test_sessions_lists_current_device(client, user_factory):
    _, _, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    r = client.get("/api/v1/settings/sessions", headers=headers)
    assert r.status_code == 200, r.text
    sessions = r.json()
    assert len(sessions) == 1
    assert sessions[0]["is_current"] is True


def test_sessions_revoke_one(client, user_factory):
    email, password, tokens = user_factory()
    headers_a = {"Authorization": f"Bearer {tokens['access_token']}"}

    # A second login = a second session/device.
    login2 = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    tokens_b = login2.json()
    headers_b = {"Authorization": f"Bearer {tokens_b['access_token']}"}

    sessions = client.get("/api/v1/settings/sessions", headers=headers_a).json()
    assert len(sessions) == 2
    other = next(s for s in sessions if not s["is_current"])

    r = client.delete(f"/api/v1/settings/sessions/{other['id']}", headers=headers_a)
    assert r.status_code == 204

    # The revoked session's refresh token no longer works.
    r = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens_b["refresh_token"]}
    )
    assert r.status_code == 401

    remaining = client.get("/api/v1/settings/sessions", headers=headers_a).json()
    assert len(remaining) == 1
    assert remaining[0]["is_current"] is True


def test_sessions_revoke_all_others(client, user_factory):
    email, password, tokens = user_factory()
    headers_a = {"Authorization": f"Bearer {tokens['access_token']}"}
    login2 = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    tokens_b = login2.json()

    r = client.delete("/api/v1/settings/sessions", headers=headers_a)
    assert r.status_code == 204

    r = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens_b["refresh_token"]}
    )
    assert r.status_code == 401

    # Current session (a) is untouched.
    r = client.post(
        "/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]}
    )
    assert r.status_code == 200


def test_preferences_defaults_then_replace(client, auth_headers):
    r = client.get("/api/v1/settings/preferences", headers=auth_headers)
    assert r.status_code == 200, r.text
    defaults = r.json()
    assert defaults["theme"] == "dark"
    assert defaults["notify_email_enabled"] is True

    r = client.put(
        "/api/v1/settings/preferences",
        json={
            "theme": "light",
            "accent_color": "purple",
            "reduced_motion": True,
            "compact_mode": True,
            "ai_default_model": "unet-v1",
            "heatmap_palette": "inferno",
            "confidence_threshold": 0.9,
            "prediction_units": "kg_per_day",
            "auto_run_after_upload": False,
            "xai_enabled": True,
            "notify_prediction_completed": False,
            "notify_upload_finished": False,
            "notify_report_generated": False,
            "notify_weekly_summary": True,
            "notify_announcements": True,
            "notify_research_updates": True,
            "notify_email_enabled": False,
            "notify_browser_enabled": False,
        },
        headers=auth_headers,
    )
    assert r.status_code == 200, r.text
    body = r.json()
    assert body["theme"] == "light"
    assert body["heatmap_palette"] == "inferno"
    assert body["notify_weekly_summary"] is True

    # Persisted - a fresh GET reflects it.
    r = client.get("/api/v1/settings/preferences", headers=auth_headers)
    assert r.json()["theme"] == "light"


def test_data_export_contains_profile_and_preferences(client, auth_headers):
    r = client.get("/api/v1/settings/export", headers=auth_headers)
    assert r.status_code == 200, r.text
    body = r.json()
    assert "profile" in body and "preferences" in body
    assert body["profile"]["email"]
