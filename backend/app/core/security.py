"""Password hashing (Argon2id) and token primitives (JWT access + opaque refresh)."""
import hashlib
import secrets
import uuid
from datetime import UTC, datetime, timedelta

import jwt
from argon2 import PasswordHasher
from argon2.exceptions import VerificationError, VerifyMismatchError

from app.core.config import get_settings

_hasher = PasswordHasher()


def hash_password(password: str) -> str:
    return _hasher.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    try:
        return _hasher.verify(hashed, password)
    except (VerifyMismatchError, VerificationError):
        return False


def create_access_token(user_id: uuid.UUID, *, session_id: uuid.UUID | None = None) -> str:
    settings = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "type": "access",
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
    }
    if session_id is not None:
        payload["sid"] = str(session_id)
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def _decode(token: str) -> dict | None:
    settings = get_settings()
    try:
        return jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError:
        return None


def decode_access_token(token: str) -> uuid.UUID | None:
    """Return the user id, or None for any invalid/expired/wrong-type token."""
    payload = _decode(token)
    if payload is None or payload.get("type") != "access":
        return None
    try:
        return uuid.UUID(payload["sub"])
    except (KeyError, ValueError):
        return None


def decode_access_token_session_id(token: str) -> uuid.UUID | None:
    """Return the refresh-token (session) id this access token was issued alongside."""
    payload = _decode(token)
    if payload is None or payload.get("type") != "access" or "sid" not in payload:
        return None
    try:
        return uuid.UUID(payload["sid"])
    except ValueError:
        return None


def create_mfa_token(user_id: uuid.UUID) -> str:
    """Short-lived, narrowly-scoped token proving password verification succeeded.

    Distinct `type` claim from access tokens so it can never be used to call
    protected routes - only /auth/2fa/verify accepts it.
    """
    settings = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "type": "mfa",
        "iat": now,
        "exp": now + timedelta(minutes=5),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_mfa_token(token: str) -> uuid.UUID | None:
    settings = get_settings()
    try:
        payload = jwt.decode(token, settings.jwt_secret_key, algorithms=[settings.jwt_algorithm])
    except jwt.PyJWTError:
        return None
    if payload.get("type") != "mfa":
        return None
    try:
        return uuid.UUID(payload["sub"])
    except (KeyError, ValueError):
        return None


def create_oauth_state_token(user_id: uuid.UUID) -> str:
    """Signed `state` param for the Google OAuth redirect - proves which
    already-logged-in user initiated the connect flow (the callback is a bare
    GET with no Authorization header)."""
    settings = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "type": "oauth_state",
        "iat": now,
        "exp": now + timedelta(minutes=10),
    }
    return jwt.encode(payload, settings.jwt_secret_key, algorithm=settings.jwt_algorithm)


def decode_oauth_state_token(token: str) -> uuid.UUID | None:
    payload = _decode(token)
    if payload is None or payload.get("type") != "oauth_state":
        return None
    try:
        return uuid.UUID(payload["sub"])
    except (KeyError, ValueError):
        return None


def generate_refresh_token() -> tuple[str, str]:
    """Return (raw_token_for_client, sha256_hash_for_db). Raw is never stored."""
    raw = secrets.token_urlsafe(48)
    return raw, hash_refresh_token(raw)


def hash_refresh_token(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()
