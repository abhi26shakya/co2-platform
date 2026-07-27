"""TOTP-based two-factor authentication: setup, enable, disable, backup codes.

Kept separate from AuthService to keep that module focused on session
issuance; this owns the credential-strength/2FA-state side of "auth".
"""
import base64
import io
import secrets

import pyotp
import qrcode
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import hash_password, verify_password
from app.models import User
from app.repositories.preferences import BackupCodeRepository
from app.repositories.users import UserRepository

BACKUP_CODE_COUNT = 10


class TwoFactorError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail


class TwoFactorService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.users = UserRepository(session)
        self.backup_codes = BackupCodeRepository(session)

    async def start_setup(self, user: User) -> tuple[str, str]:
        """Generate a pending (unconfirmed) secret. Returns (otpauth_uri, qr_base64)."""
        secret = pyotp.random_base32()
        await self.users.update(user, totp_secret=secret)
        await self.session.commit()

        issuer = get_settings().app_name
        uri = pyotp.TOTP(secret).provisioning_uri(name=user.email, issuer_name=issuer)
        img = qrcode.make(uri)
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        qr_base64 = base64.b64encode(buf.getvalue()).decode()
        return uri, qr_base64

    async def confirm_enable(self, user: User, code: str) -> list[str]:
        if not user.totp_secret or not pyotp.TOTP(user.totp_secret).verify(code, valid_window=1):
            raise TwoFactorError("Invalid verification code.")
        await self.users.update(user, totp_enabled=True)

        codes = [secrets.token_hex(4) for _ in range(BACKUP_CODE_COUNT)]
        await self.backup_codes.delete_all_for_user(user.id)
        await self.backup_codes.create_many(user.id, [hash_password(c) for c in codes])
        await self.session.commit()
        return codes

    async def disable(self, user: User, *, current_password: str, code: str) -> None:
        if not verify_password(current_password, user.hashed_password):
            raise TwoFactorError("Current password is incorrect.")
        if not self._verify_code_sync(user, code) and not await self._consume_backup_code(
            user, code
        ):
            raise TwoFactorError("Invalid verification code.")
        await self.users.update(user, totp_enabled=False, totp_secret=None)
        await self.backup_codes.delete_all_for_user(user.id)
        await self.session.commit()

    async def verify_login_code(self, user: User, code: str) -> bool:
        if self._verify_code_sync(user, code):
            return True
        return await self._consume_backup_code(user, code)

    def _verify_code_sync(self, user: User, code: str) -> bool:
        if not user.totp_secret:
            return False
        return bool(pyotp.TOTP(user.totp_secret).verify(code, valid_window=1))

    async def _consume_backup_code(self, user: User, code: str) -> bool:
        for stored in await self.backup_codes.list_unused(user.id):
            if verify_password(code, stored.code_hash):
                await self.backup_codes.mark_used(stored)
                return True
        return False
