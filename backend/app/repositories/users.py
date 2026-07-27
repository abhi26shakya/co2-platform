import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import User


class UserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_email(self, email: str) -> User | None:
        return await self.session.scalar(select(User).where(User.email == email.lower()))

    async def get_by_id(self, user_id: uuid.UUID) -> User | None:
        return await self.session.get(User, user_id)

    async def get_by_google_id(self, google_id: str) -> User | None:
        return await self.session.scalar(select(User).where(User.google_id == google_id))

    async def create(self, *, email: str, hashed_password: str, full_name: str) -> User:
        user = User(email=email.lower(), hashed_password=hashed_password, full_name=full_name)
        self.session.add(user)
        await self.session.flush()
        return user

    async def update(self, user: User, **fields: Any) -> User:
        for key, value in fields.items():
            setattr(user, key, value)
        await self.session.flush()
        return user
