"""Business logic for the Settings feature: profile, avatar, preferences,
data export, and account deletion. Auth-credential-changing operations
(password change, 2FA, OAuth) live in services/auth.py, security2fa.py and
oauth.py instead - this module owns everything else.
"""
import io
import uuid
from datetime import UTC, datetime
from typing import BinaryIO

from PIL import Image
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import verify_password
from app.models import Report, User
from app.repositories.images import ImageRepository
from app.repositories.preferences import PreferencesRepository
from app.repositories.refresh_tokens import RefreshTokenRepository
from app.repositories.users import UserRepository
from app.schemas.auth import UserOut
from app.storage.base import StorageBackend


class WrongPasswordError(Exception):
    pass

AVATAR_MAX_BYTES = 5 * 1024 * 1024
_AVATAR_CONTENT_TYPES = {"image/png": ".png", "image/jpeg": ".jpg", "image/webp": ".webp"}


class InvalidAvatarError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail


async def build_user_out(user: User, storage: StorageBackend) -> UserOut:
    out = UserOut.model_validate(user)
    if user.avatar_key:
        out.avatar_url = await storage.get_url(user.avatar_key)
    out.google_connected = user.google_id is not None
    out.totp_enabled = user.totp_enabled
    return out


class SettingsService:
    def __init__(self, session: AsyncSession, storage: StorageBackend) -> None:
        self.session = session
        self.storage = storage
        self.users = UserRepository(session)
        self.preferences = PreferencesRepository(session)
        self.tokens = RefreshTokenRepository(session)

    async def update_profile(self, user: User, **fields: str | None) -> User:
        await self.users.update(user, **fields)
        await self.session.commit()
        return user

    async def upload_avatar(self, user: User, data: bytes, content_type: str) -> User:
        if len(data) > AVATAR_MAX_BYTES:
            raise InvalidAvatarError("Avatar must be smaller than 5 MB.")
        ext = _AVATAR_CONTENT_TYPES.get(content_type)
        if ext is None:
            raise InvalidAvatarError("Avatar must be PNG, JPEG, or WEBP.")
        try:
            with Image.open(io.BytesIO(data)) as img:
                img.verify()
        except Exception as e:  # noqa: BLE001 - PIL raises many types
            raise InvalidAvatarError("Could not read image file.") from e

        old_key = user.avatar_key
        key = f"avatars/{user.id}/{uuid.uuid4()}{ext}"
        file_obj: BinaryIO = io.BytesIO(data)
        await self.storage.save(key, file_obj, content_type)
        await self.users.update(user, avatar_key=key)
        await self.session.commit()
        if old_key:
            await self.storage.delete(old_key)
        return user

    async def delete_avatar(self, user: User) -> User:
        if user.avatar_key:
            await self.storage.delete(user.avatar_key)
            await self.users.update(user, avatar_key=None)
            await self.session.commit()
        return user

    async def export_data(self, user: User) -> dict:
        images, _ = await ImageRepository(self.session).list_owned(
            user.id, page=1, page_size=10_000
        )
        reports = list(
            (
                await self.session.execute(
                    select(Report)
                    .where(Report.user_id == user.id)
                    .order_by(Report.created_at.desc())
                )
            )
            .scalars()
            .all()
        )
        prefs = await self.preferences.get_or_create(user.id)
        return {
            "exported_at": datetime.now(UTC).isoformat(),
            "profile": {
                "id": str(user.id),
                "email": user.email,
                "full_name": user.full_name,
                "organization": user.organization,
                "job_title": user.job_title,
                "country": user.country,
                "bio": user.bio,
                "created_at": user.created_at.isoformat(),
            },
            "preferences": {
                c.name: getattr(prefs, c.name)
                for c in prefs.__table__.columns
                if c.name not in {"id", "user_id", "created_at", "updated_at"}
            },
            "uploads": [
                {
                    "id": str(img.id),
                    "filename": img.filename,
                    "created_at": img.created_at.isoformat(),
                }
                for img in images
            ],
            "reports": [
                {"id": str(r.id), "title": r.title, "created_at": r.created_at.isoformat()}
                for r in reports
            ],
        }

    async def soft_delete_account(self, user: User, *, current_password: str) -> None:
        if not verify_password(current_password, user.hashed_password):
            raise WrongPasswordError
        if user.avatar_key:
            await self.storage.delete(user.avatar_key)
        anon = f"deleted-{user.id}@deleted.emissia.invalid"
        await self.users.update(
            user,
            is_active=False,
            deleted_at=datetime.now(UTC),
            email=anon,
            full_name="Deleted User",
            organization=None,
            job_title=None,
            country=None,
            bio=None,
            avatar_key=None,
            google_id=None,
            google_email=None,
        )
        await self.tokens.revoke_all_for_user(user.id)
        await self.session.commit()
