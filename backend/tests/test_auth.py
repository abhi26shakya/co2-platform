"""Full authentication flow: signup, login, protected routes, rotation, logout."""


def test_signup_returns_user_without_password(client):
    r = client.post(
        "/api/v1/auth/signup",
        json={"email": "abhishek@test.dev", "password": "long-enough-pw", "full_name": "Abhishek"},
    )
    assert r.status_code == 201
    body = r.json()
    assert body["email"] == "abhishek@test.dev"
    assert "password" not in body and "hashed_password" not in body


def test_duplicate_signup_409(client):
    payload = {"email": "dup@test.dev", "password": "long-enough-pw", "full_name": "Dup"}
    assert client.post("/api/v1/auth/signup", json=payload).status_code == 201
    assert client.post("/api/v1/auth/signup", json=payload).status_code == 409


def test_signup_rejects_weak_password(client):
    r = client.post(
        "/api/v1/auth/signup",
        json={"email": "weak@test.dev", "password": "short", "full_name": "W"},
    )
    assert r.status_code == 422


def test_login_wrong_password_401(client, user_factory):
    email, _, _ = user_factory()
    r = client.post("/api/v1/auth/login", json={"email": email, "password": "wrong-password"})
    assert r.status_code == 401


def test_login_unknown_email_same_error_as_wrong_password(client, user_factory):
    """No account enumeration: identical status + detail for both failure modes."""
    email, _, _ = user_factory()
    wrong_pw = client.post("/api/v1/auth/login", json={"email": email, "password": "wrong-pw-123"})
    unknown = client.post(
        "/api/v1/auth/login", json={"email": "ghost@test.dev", "password": "wrong-pw-123"}
    )
    assert wrong_pw.status_code == unknown.status_code == 401
    assert wrong_pw.json()["detail"] == unknown.json()["detail"]


def test_me_requires_token(client):
    assert client.get("/api/v1/auth/me").status_code == 401
    bad = {"Authorization": "Bearer not-a-real-token"}
    assert client.get("/api/v1/auth/me", headers=bad).status_code == 401


def test_me_returns_current_user(client, user_factory):
    email, _, tokens = user_factory()
    r = client.get(
        "/api/v1/auth/me", headers={"Authorization": f"Bearer {tokens['access_token']}"}
    )
    assert r.status_code == 200
    assert r.json()["email"] == email


def test_update_profile(client, auth_headers):
    r = client.patch("/api/v1/auth/me", json={"full_name": "Renamed"}, headers=auth_headers)
    assert r.status_code == 200
    assert r.json()["full_name"] == "Renamed"


def test_refresh_rotation(client, user_factory):
    _, _, tokens = user_factory()
    old_refresh = tokens["refresh_token"]

    r = client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh})
    assert r.status_code == 200
    new_tokens = r.json()
    assert new_tokens["refresh_token"] != old_refresh

    # Old refresh token is revoked after use (rotation)
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": old_refresh})
    assert r.status_code == 401

    # New one still works
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": new_tokens["refresh_token"]})
    assert r.status_code == 200


def test_logout_revokes_refresh_token(client, user_factory):
    _, _, tokens = user_factory()
    assert (
        client.post(
            "/api/v1/auth/logout", json={"refresh_token": tokens["refresh_token"]}
        ).status_code
        == 204
    )
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": tokens["refresh_token"]})
    assert r.status_code == 401


def test_garbage_refresh_token_401(client):
    r = client.post("/api/v1/auth/refresh", json={"refresh_token": "garbage"})
    assert r.status_code == 401
