import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, Field


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=255)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RefreshRequest(BaseModel):
    refresh_token: str


class TokenPair(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class LoginResult(BaseModel):
    """Either a real token pair, or a signal that a 2FA code is required next."""

    access_token: str | None = None
    refresh_token: str | None = None
    token_type: str = "bearer"
    mfa_required: bool = False
    mfa_token: str | None = None


class UserOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    organization: str | None = None
    job_title: str | None = None
    country: str | None = None
    bio: str | None = None
    avatar_url: str | None = None
    totp_enabled: bool = False
    google_connected: bool = False


class UserUpdate(BaseModel):
    full_name: str | None = Field(default=None, min_length=1, max_length=255)
    organization: str | None = Field(default=None, max_length=255)
    job_title: str | None = Field(default=None, max_length=255)
    country: str | None = Field(default=None, max_length=100)
    bio: str | None = Field(default=None, max_length=2000)


class PasswordChangeRequest(BaseModel):
    current_password: str
    new_password: str = Field(min_length=8, max_length=128)


class AccountDeleteRequest(BaseModel):
    current_password: str


class AvatarOut(BaseModel):
    avatar_url: str


class SessionOut(BaseModel):
    id: uuid.UUID
    device_name: str | None
    ip_address: str | None
    user_agent: str | None
    created_at: datetime
    last_used_at: datetime | None
    is_current: bool


class TwoFactorSetupOut(BaseModel):
    otpauth_uri: str
    qr_code_base64: str


class TwoFactorEnableRequest(BaseModel):
    code: str = Field(min_length=6, max_length=6)


class TwoFactorEnableOut(BaseModel):
    backup_codes: list[str]


class TwoFactorDisableRequest(BaseModel):
    current_password: str
    code: str = Field(min_length=6, max_length=10)


class TwoFactorVerifyRequest(BaseModel):
    mfa_token: str
    code: str = Field(min_length=6, max_length=10)


class GoogleAuthorizeOut(BaseModel):
    authorize_url: str


class GoogleStatusOut(BaseModel):
    configured: bool
    connected: bool
    google_email: str | None = None
