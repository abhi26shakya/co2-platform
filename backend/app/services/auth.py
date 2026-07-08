"""Authentication business logic. Routers stay thin; everything testable lives here."""
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import (
    create_access_token,
    generate_refresh_token,
    hash_password,
    hash_refresh_token,
    verify_password,
)
from app.models import User
from app.repositories.refresh_tokens import RefreshTokenRepository
from app.repositories.users import UserRepository


class AuthError(Exception):
    def __init__(self, status_code: int, detail: str) -> None:
        self.status_code = status_code
        self.detail = detail


class AuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.tokens = RefreshTokenRepository(session)

    async def signup(self, *, email: str, password: str, full_name: str) -> User:
        if await self.users.get_by_email(email):
            raise AuthError(409, "An account with this email already exists")
        user = await self.users.create(
            email=email, hashed_password=hash_password(password), full_name=full_name
        )
        await self.session.commit()
        return user

    async def login(self, *, email: str, password: str) -> tuple[str, str]:
        user = await self.users.get_by_email(email)
        # Same error for unknown email and wrong password - no account enumeration.
        if user is None or not verify_password(password, user.hashed_password):
            raise AuthError(401, "Invalid email or password")
        if not user.is_active:
            raise AuthError(403, "Account is disabled")
        pair = await self._issue_pair(user.id)
        await self.session.commit()
        return pair

    async def refresh(self, raw_refresh_token: str) -> tuple[str, str]:
        """Rotation: the presented refresh token is revoked and a new pair issued."""
        token = await self.tokens.get_valid(hash_refresh_token(raw_refresh_token))
        if token is None:
            raise AuthError(401, "Invalid or expired refresh token")
        await self.tokens.revoke(token)
        pair = await self._issue_pair(token.user_id)
        await self.session.commit()
        return pair

    async def logout(self, raw_refresh_token: str) -> None:
        token = await self.tokens.get_valid(hash_refresh_token(raw_refresh_token))
        if token is not None:
            await self.tokens.revoke(token)
            await self.session.commit()

    async def _issue_pair(self, user_id: uuid.UUID) -> tuple[str, str]:
        access = create_access_token(user_id)
        raw_refresh, refresh_hash = generate_refresh_token()
        await self.tokens.create(
            user_id=user_id,
            token_hash=refresh_hash,
            ttl_days=get_settings().refresh_token_expire_days,
        )
        return access, raw_refresh
