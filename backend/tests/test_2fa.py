"""TOTP 2FA: setup, enable, login-with-code, backup codes, disable."""
import pyotp


def _enable_2fa(client, headers) -> tuple[str, list[str]]:
    setup = client.post("/api/v1/auth/2fa/setup", headers=headers)
    assert setup.status_code == 200, setup.text
    secret = pyotp.parse_uri(setup.json()["otpauth_uri"]).secret

    code = pyotp.TOTP(secret).now()
    enable = client.post("/api/v1/auth/2fa/enable", json={"code": code}, headers=headers)
    assert enable.status_code == 200, enable.text
    backup_codes = enable.json()["backup_codes"]
    assert len(backup_codes) == 10
    return secret, backup_codes


def test_enable_2fa_requires_valid_code(client, auth_headers):
    setup = client.post("/api/v1/auth/2fa/setup", headers=auth_headers)
    assert setup.status_code == 200

    r = client.post("/api/v1/auth/2fa/enable", json={"code": "000000"}, headers=auth_headers)
    assert r.status_code == 400


def test_login_requires_2fa_code_after_enabled(client, user_factory):
    email, password, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    secret, _ = _enable_2fa(client, headers)

    login = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200
    body = login.json()
    assert body["mfa_required"] is True
    assert body["access_token"] is None
    mfa_token = body["mfa_token"]

    bad = client.post(
        "/api/v1/auth/2fa/verify", json={"mfa_token": mfa_token, "code": "000000"}
    )
    assert bad.status_code == 401

    good_code = pyotp.TOTP(secret).now()
    ok = client.post(
        "/api/v1/auth/2fa/verify", json={"mfa_token": mfa_token, "code": good_code}
    )
    assert ok.status_code == 200, ok.text
    assert ok.json()["access_token"]


def test_backup_code_completes_login_and_is_single_use(client, user_factory):
    email, password, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    _, backup_codes = _enable_2fa(client, headers)

    login = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    mfa_token = login.json()["mfa_token"]

    r = client.post(
        "/api/v1/auth/2fa/verify",
        json={"mfa_token": mfa_token, "code": backup_codes[0]},
    )
    assert r.status_code == 200, r.text

    # Same backup code cannot be reused.
    login2 = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    mfa_token2 = login2.json()["mfa_token"]
    r = client.post(
        "/api/v1/auth/2fa/verify",
        json={"mfa_token": mfa_token2, "code": backup_codes[0]},
    )
    assert r.status_code == 401


def test_disable_2fa(client, user_factory):
    email, password, tokens = user_factory()
    headers = {"Authorization": f"Bearer {tokens['access_token']}"}
    secret, _ = _enable_2fa(client, headers)

    code = pyotp.TOTP(secret).now()
    r = client.post(
        "/api/v1/auth/2fa/disable",
        json={"current_password": password, "code": code},
        headers=headers,
    )
    assert r.status_code == 204, r.text

    # Login no longer requires a second step.
    login = client.post("/api/v1/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200
    assert login.json()["mfa_required"] is False
    assert login.json()["access_token"]
