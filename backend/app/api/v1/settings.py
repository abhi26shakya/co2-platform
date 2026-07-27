"""Settings endpoints beyond core auth: avatar, preferences, sessions,
data export, account deletion. Password/2FA/OAuth stay in api/v1/auth.py.
"""
import uuid
from typing import Annotated

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.core.deps import CurrentSessionId, CurrentUser, DbSession
from app.repositories.preferences import PreferencesRepository
from app.repositories.refresh_tokens import RefreshTokenRepository
from app.schemas.auth import AccountDeleteRequest, AvatarOut, SessionOut, UserOut
from app.schemas.preferences import PreferencesOut, PreferencesUpdate
from app.services.settings import (
    InvalidAvatarError,
    SettingsService,
    WrongPasswordError,
    build_user_out,
)
from app.storage.local import get_storage

router = APIRouter(prefix="/settings", tags=["settings"])


@router.post("/avatar", response_model=AvatarOut)
async def upload_avatar(
    user: CurrentUser, db: DbSession, file: Annotated[UploadFile, File()]
) -> AvatarOut:
    data = await file.read()
    storage = get_storage()
    service = SettingsService(db, storage)
    try:
        user = await service.upload_avatar(
            user, data, file.content_type or "application/octet-stream"
        )
    except InvalidAvatarError as e:
        raise HTTPException(status_code=422, detail=e.detail) from e
    out = await build_user_out(user, storage)
    return AvatarOut(avatar_url=out.avatar_url or "")


@router.delete("/avatar", response_model=UserOut)
async def delete_avatar(user: CurrentUser, db: DbSession) -> UserOut:
    storage = get_storage()
    user = await SettingsService(db, storage).delete_avatar(user)
    return await build_user_out(user, storage)


@router.post("/account/delete", status_code=204)
async def delete_account(
    payload: AccountDeleteRequest, user: CurrentUser, db: DbSession
) -> None:
    try:
        await SettingsService(db, get_storage()).soft_delete_account(
            user, current_password=payload.current_password
        )
    except WrongPasswordError as e:
        raise HTTPException(status_code=401, detail="Current password is incorrect") from e


@router.get("/sessions", response_model=list[SessionOut])
async def list_sessions(
    user: CurrentUser, db: DbSession, current_session_id: CurrentSessionId
) -> list[SessionOut]:
    tokens = await RefreshTokenRepository(db).list_active_for_user(user.id)
    return [
        SessionOut(
            id=t.id,
            device_name=t.device_name,
            ip_address=t.ip_address,
            user_agent=t.user_agent,
            created_at=t.created_at,
            last_used_at=t.last_used_at,
            is_current=t.id == current_session_id,
        )
        for t in tokens
    ]


@router.delete("/sessions/{session_id}", status_code=204)
async def revoke_session(session_id: uuid.UUID, user: CurrentUser, db: DbSession) -> None:
    repo = RefreshTokenRepository(db)
    token = await repo.get_owned(session_id, user.id)
    if token is None:
        raise HTTPException(status_code=404, detail="Session not found")
    await repo.revoke(token)
    await db.commit()


@router.delete("/sessions", status_code=204)
async def revoke_other_sessions(
    user: CurrentUser, db: DbSession, current_session_id: CurrentSessionId
) -> None:
    """Log out every device except the one making this request."""
    await RefreshTokenRepository(db).revoke_all_for_user(
        user.id, except_token_id=current_session_id
    )
    await db.commit()


@router.get("/preferences", response_model=PreferencesOut)
async def get_preferences(user: CurrentUser, db: DbSession) -> PreferencesOut:
    prefs = await PreferencesRepository(db).get_or_create(user.id)
    await db.commit()
    return PreferencesOut.model_validate(prefs)


@router.put("/preferences", response_model=PreferencesOut)
async def replace_preferences(
    payload: PreferencesUpdate, user: CurrentUser, db: DbSession
) -> PreferencesOut:
    prefs = await PreferencesRepository(db).replace(user.id, **payload.model_dump())
    await db.commit()
    return PreferencesOut.model_validate(prefs)


@router.get("/export", response_model=dict)
async def export_data(user: CurrentUser, db: DbSession) -> dict:
    return await SettingsService(db, get_storage()).export_data(user)
