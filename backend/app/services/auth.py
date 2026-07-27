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

    async def login(
        self,
        *,
        email: str,
        password: str,
        device_name: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[str, str] | User:
        user = await self.users.get_by_email(email)
        # Same error for unknown email and wrong password - no account enumeration.
        if user is None or not verify_password(password, user.hashed_password):
            raise AuthError(401, "Invalid email or password")
        if not user.is_active:
            raise AuthError(403, "Account is disabled")
        if user.totp_enabled:
            # Caller (router) issues the short-lived mfa_token; no session yet.
            return user
        pair = await self._issue_pair(
            user.id, device_name=device_name, ip_address=ip_address, user_agent=user_agent
        )
        await self.session.commit()
        return pair

    async def issue_pair_for_user(
        self,
        user_id: uuid.UUID,
        *,
        device_name: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[str, str]:
        """Used to complete login after a successful 2FA/backup-code verification."""
        pair = await self._issue_pair(
            user_id, device_name=device_name, ip_address=ip_address, user_agent=user_agent
        )
        await self.session.commit()
        return pair

    async def refresh(
        self,
        raw_refresh_token: str,
        *,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[str, str]:
        """Rotation: the presented refresh token is revoked and a new pair issued."""
        token = await self.tokens.get_valid(hash_refresh_token(raw_refresh_token))
        if token is None:
            raise AuthError(401, "Invalid or expired refresh token")
        await self.tokens.revoke(token)
        pair = await self._issue_pair(
            token.user_id,
            device_name=token.device_name,
            ip_address=ip_address or token.ip_address,
            user_agent=user_agent or token.user_agent,
        )
        await self.session.commit()
        return pair

    async def logout(self, raw_refresh_token: str) -> None:
        token = await self.tokens.get_valid(hash_refresh_token(raw_refresh_token))
        if token is not None:
            await self.tokens.revoke(token)
            await self.session.commit()

    async def change_password(
        self, user: User, *, current_password: str, new_password: str
    ) -> None:
        if not verify_password(current_password, user.hashed_password):
            raise AuthError(401, "Current password is incorrect")
        await self.users.update(user, hashed_password=hash_password(new_password))
        await self.tokens.revoke_all_for_user(user.id)
        await self.session.commit()

    async def _issue_pair(
        self,
        user_id: uuid.UUID,
        *,
        device_name: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> tuple[str, str]:
        raw_refresh, refresh_hash = generate_refresh_token()
        token = await self.tokens.create(
            user_id=user_id,
            token_hash=refresh_hash,
            ttl_days=get_settings().refresh_token_expire_days,
            device_name=device_name,
            ip_address=ip_address,
            user_agent=user_agent,
        )
        access = create_access_token(user_id, session_id=token.id)
        return access, raw_refresh
