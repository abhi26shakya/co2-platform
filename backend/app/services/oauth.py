"""Google OAuth account linking (Settings > Connected Accounts).

This links Google to an *already-authenticated* user - it is not "Sign in
with Google" (this platform's only sign-up path remains email/password, see
CLAUDE.md's post-v1 backlog). The state param is a signed JWT identifying
the user who started the connect flow, since Google's callback is a bare
GET with no Authorization header.
"""
import asyncio
import urllib.parse
import uuid

import httpx
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token as google_id_token
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import create_oauth_state_token, decode_oauth_state_token
from app.models import User
from app.repositories.users import UserRepository

AUTHORIZE_URL = "https://accounts.google.com/o/oauth2/v2/auth"
TOKEN_URL = "https://oauth2.googleapis.com/token"
SCOPES = "openid email"


class OAuthError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail


class GoogleOAuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)

    def build_authorize_url(self, user_id: uuid.UUID) -> str:
        settings = get_settings()
        if not settings.google_oauth_configured:
            raise OAuthError("Google OAuth is not configured on this deployment.")
        params = {
            "client_id": settings.google_oauth_client_id,
            "redirect_uri": settings.google_oauth_redirect_uri,
            "response_type": "code",
            "scope": SCOPES,
            "access_type": "online",
            "prompt": "consent",
            "state": create_oauth_state_token(user_id),
        }
        return f"{AUTHORIZE_URL}?{urllib.parse.urlencode(params)}"

    async def handle_callback(self, *, code: str, state: str) -> User:
        user_id = decode_oauth_state_token(state)
        if user_id is None:
            raise OAuthError("Invalid or expired OAuth state.")
        user = await self.users.get_by_id(user_id)
        if user is None:
            raise OAuthError("User not found.")

        google_id, google_email = await self._exchange_code(code)

        existing = await self.users.get_by_google_id(google_id)
        if existing is not None and existing.id != user.id:
            raise OAuthError("This Google account is already linked to another user.")

        await self.users.update(user, google_id=google_id, google_email=google_email)
        await self.session.commit()
        return user

    async def disconnect(self, user: User) -> None:
        await self.users.update(user, google_id=None, google_email=None)
        await self.session.commit()

    async def _exchange_code(self, code: str) -> tuple[str, str]:
        settings = get_settings()
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.post(
                TOKEN_URL,
                data={
                    "code": code,
                    "client_id": settings.google_oauth_client_id,
                    "client_secret": settings.google_oauth_client_secret,
                    "redirect_uri": settings.google_oauth_redirect_uri,
                    "grant_type": "authorization_code",
                },
            )
        if resp.status_code != 200:
            raise OAuthError("Could not exchange authorization code with Google.")
        id_token = resp.json().get("id_token")
        if not id_token:
            raise OAuthError("Google did not return an ID token.")

        # google-auth's verifier does a blocking HTTP call to fetch Google's
        # signing certs - offload it so it doesn't block the event loop.
        claims = await asyncio.to_thread(
            google_id_token.verify_oauth2_token,
            id_token,
            google_requests.Request(),
            settings.google_oauth_client_id,
        )
        return claims["sub"], claims["email"]
