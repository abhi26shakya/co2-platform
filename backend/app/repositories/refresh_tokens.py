import uuid
from datetime import UTC, datetime, timedelta

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import RefreshToken


class RefreshTokenRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create(
        self,
        *,
        user_id: uuid.UUID,
        token_hash: str,
        ttl_days: int,
        device_name: str | None = None,
        ip_address: str | None = None,
        user_agent: str | None = None,
    ) -> RefreshToken:
        now = datetime.now(UTC)
        token = RefreshToken(
            user_id=user_id,
            token_hash=token_hash,
            expires_at=now + timedelta(days=ttl_days),
            device_name=device_name,
            ip_address=ip_address,
            user_agent=user_agent,
            last_used_at=now,
        )
        self.session.add(token)
        await self.session.flush()
        return token

    async def get_valid(self, token_hash: str) -> RefreshToken | None:
        token = await self.session.scalar(
            select(RefreshToken).where(RefreshToken.token_hash == token_hash)
        )
        if token is None or token.revoked or token.expires_at < datetime.now(UTC):
            return None
        return token

    async def get_owned(self, token_id: uuid.UUID, user_id: uuid.UUID) -> RefreshToken | None:
        token = await self.session.get(RefreshToken, token_id)
        if token is None or token.user_id != user_id:
            return None
        return token

    async def list_active_for_user(self, user_id: uuid.UUID) -> list[RefreshToken]:
        now = datetime.now(UTC)
        result = await self.session.scalars(
            select(RefreshToken)
            .where(
                RefreshToken.user_id == user_id,
                RefreshToken.revoked.is_(False),
                RefreshToken.expires_at > now,
            )
            .order_by(RefreshToken.last_used_at.desc().nulls_last())
        )
        return list(result)

    async def revoke(self, token: RefreshToken) -> None:
        token.revoked = True
        await self.session.flush()

    async def revoke_all_for_user(
        self, user_id: uuid.UUID, *, except_token_id: uuid.UUID | None = None
    ) -> None:
        stmt = update(RefreshToken).where(RefreshToken.user_id == user_id).values(revoked=True)
        if except_token_id is not None:
            stmt = stmt.where(RefreshToken.id != except_token_id)
        await self.session.execute(stmt)
