import uuid
from datetime import UTC, datetime
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import BackupCode, UserPreferences


class PreferencesRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_or_create(self, user_id: uuid.UUID) -> UserPreferences:
        prefs = await self.session.scalar(
            select(UserPreferences).where(UserPreferences.user_id == user_id)
        )
        if prefs is None:
            prefs = UserPreferences(user_id=user_id)
            self.session.add(prefs)
            await self.session.flush()
        return prefs

    async def replace(self, user_id: uuid.UUID, **fields: Any) -> UserPreferences:
        prefs = await self.get_or_create(user_id)
        for key, value in fields.items():
            setattr(prefs, key, value)
        await self.session.flush()
        return prefs


class BackupCodeRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_many(self, user_id: uuid.UUID, code_hashes: list[str]) -> None:
        for code_hash in code_hashes:
            self.session.add(BackupCode(user_id=user_id, code_hash=code_hash))
        await self.session.flush()

    async def list_unused(self, user_id: uuid.UUID) -> list[BackupCode]:
        result = await self.session.scalars(
            select(BackupCode).where(
                BackupCode.user_id == user_id, BackupCode.used_at.is_(None)
            )
        )
        return list(result)

    async def mark_used(self, code: BackupCode) -> None:
        code.used_at = datetime.now(UTC)
        await self.session.flush()

    async def delete_all_for_user(self, user_id: uuid.UUID) -> None:
        codes = await self.session.scalars(
            select(BackupCode).where(BackupCode.user_id == user_id)
        )
        for code in codes:
            await self.session.delete(code)
        await self.session.flush()
