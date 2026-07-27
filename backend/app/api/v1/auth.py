from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import RedirectResponse

from app.core.config import get_settings
from app.core.deps import CurrentUser, DbSession
from app.core.device import describe_device
from app.core.ratelimit import limiter
from app.core.security import create_mfa_token, decode_mfa_token
from app.repositories.users import UserRepository
from app.schemas.auth import (
    GoogleAuthorizeOut,
    GoogleStatusOut,
    LoginRequest,
    LoginResult,
    PasswordChangeRequest,
    RefreshRequest,
    SignupRequest,
    TokenPair,
    TwoFactorDisableRequest,
    TwoFactorEnableOut,
    TwoFactorEnableRequest,
    TwoFactorSetupOut,
    TwoFactorVerifyRequest,
    UserOut,
    UserUpdate,
)
from app.services.auth import AuthError, AuthService
from app.services.oauth import GoogleOAuthService, OAuthError
from app.services.security2fa import TwoFactorError, TwoFactorService
from app.services.settings import build_user_out
from app.storage.local import get_storage

router = APIRouter(prefix="/auth", tags=["auth"])


def _client_ip(request: Request) -> str | None:
    return request.client.host if request.client else None


@router.post("/signup", response_model=UserOut, status_code=201)
@limiter.limit(get_settings().auth_rate_limit)
async def signup(request: Request, payload: SignupRequest, db: DbSession) -> UserOut:
    try:
        user = await AuthService(db).signup(
            email=payload.email, password=payload.password, full_name=payload.full_name
        )
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) from e
    return UserOut.model_validate(user)


@router.post("/login", response_model=LoginResult)
@limiter.limit(get_settings().auth_rate_limit)
async def login(request: Request, payload: LoginRequest, db: DbSession) -> LoginResult:
    user_agent = request.headers.get("user-agent")
    try:
        result = await AuthService(db).login(
            email=payload.email,
            password=payload.password,
            device_name=describe_device(user_agent),
            ip_address=_client_ip(request),
            user_agent=user_agent,
        )
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) from e
    if not isinstance(result, tuple):
        # 2FA enabled: password verified, but no session yet.
        return LoginResult(mfa_required=True, mfa_token=create_mfa_token(result.id))
    access, refresh = result
    return LoginResult(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenPair)
@limiter.limit(get_settings().auth_rate_limit)
async def refresh(request: Request, payload: RefreshRequest, db: DbSession) -> TokenPair:
    try:
        access, new_refresh = await AuthService(db).refresh(
            payload.refresh_token,
            ip_address=_client_ip(request),
            user_agent=request.headers.get("user-agent"),
        )
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) from e
    return TokenPair(access_token=access, refresh_token=new_refresh)


@router.post("/logout", status_code=204)
async def logout(payload: RefreshRequest, db: DbSession) -> None:
    await AuthService(db).logout(payload.refresh_token)


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> UserOut:
    return await build_user_out(user, get_storage())


@router.patch("/me", response_model=UserOut)
async def update_me(payload: UserUpdate, user: CurrentUser, db: DbSession) -> UserOut:
    fields = payload.model_dump(exclude_unset=True)
    if fields:
        await UserRepository(db).update(user, **fields)
        await db.commit()
        await db.refresh(user)
    return await build_user_out(user, get_storage())


@router.post("/change-password", status_code=204)
async def change_password(
    payload: PasswordChangeRequest, user: CurrentUser, db: DbSession
) -> None:
    try:
        await AuthService(db).change_password(
            user, current_password=payload.current_password, new_password=payload.new_password
        )
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) from e


@router.post("/2fa/setup", response_model=TwoFactorSetupOut)
async def setup_2fa(user: CurrentUser, db: DbSession) -> TwoFactorSetupOut:
    uri, qr = await TwoFactorService(db).start_setup(user)
    return TwoFactorSetupOut(otpauth_uri=uri, qr_code_base64=qr)


@router.post("/2fa/enable", response_model=TwoFactorEnableOut)
async def enable_2fa(
    payload: TwoFactorEnableRequest, user: CurrentUser, db: DbSession
) -> TwoFactorEnableOut:
    try:
        codes = await TwoFactorService(db).confirm_enable(user, payload.code)
    except TwoFactorError as e:
        raise HTTPException(status_code=400, detail=e.detail) from e
    return TwoFactorEnableOut(backup_codes=codes)


@router.post("/2fa/disable", status_code=204)
async def disable_2fa(
    payload: TwoFactorDisableRequest, user: CurrentUser, db: DbSession
) -> None:
    try:
        await TwoFactorService(db).disable(
            user, current_password=payload.current_password, code=payload.code
        )
    except TwoFactorError as e:
        raise HTTPException(status_code=400, detail=e.detail) from e


@router.post("/2fa/verify", response_model=TokenPair)
async def verify_2fa(
    request: Request, payload: TwoFactorVerifyRequest, db: DbSession
) -> TokenPair:
    user_id = decode_mfa_token(payload.mfa_token)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired MFA token")
    user = await UserRepository(db).get_by_id(user_id)
    if user is None or not user.is_active or not user.totp_enabled:
        raise HTTPException(status_code=401, detail="Invalid or expired MFA token")
    if not await TwoFactorService(db).verify_login_code(user, payload.code):
        raise HTTPException(status_code=401, detail="Invalid verification code")

    user_agent = request.headers.get("user-agent")
    access, refresh_token = await AuthService(db).issue_pair_for_user(
        user.id,
        device_name=describe_device(user_agent),
        ip_address=_client_ip(request),
        user_agent=user_agent,
    )
    return TokenPair(access_token=access, refresh_token=refresh_token)


@router.get("/oauth/google/status", response_model=GoogleStatusOut)
async def google_oauth_status(user: CurrentUser) -> GoogleStatusOut:
    return GoogleStatusOut(
        configured=get_settings().google_oauth_configured,
        connected=user.google_id is not None,
        google_email=user.google_email,
    )


@router.get("/oauth/google/connect", response_model=GoogleAuthorizeOut)
async def google_oauth_connect(user: CurrentUser, db: DbSession) -> GoogleAuthorizeOut:
    try:
        url = GoogleOAuthService(db).build_authorize_url(user.id)
    except OAuthError as e:
        raise HTTPException(status_code=400, detail=e.detail) from e
    return GoogleAuthorizeOut(authorize_url=url)


@router.get("/oauth/google/callback", include_in_schema=False)
async def google_oauth_callback(
    db: DbSession, code: str | None = None, state: str | None = None, error: str | None = None
) -> RedirectResponse:
    settings_url = f"{get_settings().frontend_url}/settings?tab=account"
    if error or not code or not state:
        return RedirectResponse(f"{settings_url}&google=error")
    try:
        await GoogleOAuthService(db).handle_callback(code=code, state=state)
    except OAuthError:
        return RedirectResponse(f"{settings_url}&google=error")
    return RedirectResponse(f"{settings_url}&google=connected")


@router.delete("/oauth/google", response_model=UserOut)
async def google_oauth_disconnect(user: CurrentUser, db: DbSession) -> UserOut:
    await GoogleOAuthService(db).disconnect(user)
    return await build_user_out(user, get_storage())
