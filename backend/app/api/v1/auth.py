from fastapi import APIRouter, HTTPException, Request

from app.core.config import get_settings
from app.core.deps import CurrentUser, DbSession
from app.core.ratelimit import limiter
from app.schemas.auth import (
    LoginRequest,
    RefreshRequest,
    SignupRequest,
    TokenPair,
    UserOut,
    UserUpdate,
)
from app.services.auth import AuthError, AuthService

router = APIRouter(prefix="/auth", tags=["auth"])


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


@router.post("/login", response_model=TokenPair)
@limiter.limit(get_settings().auth_rate_limit)
async def login(request: Request, payload: LoginRequest, db: DbSession) -> TokenPair:
    try:
        access, refresh = await AuthService(db).login(
            email=payload.email, password=payload.password
        )
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) from e
    return TokenPair(access_token=access, refresh_token=refresh)


@router.post("/refresh", response_model=TokenPair)
@limiter.limit(get_settings().auth_rate_limit)
async def refresh(request: Request, payload: RefreshRequest, db: DbSession) -> TokenPair:
    try:
        access, new_refresh = await AuthService(db).refresh(payload.refresh_token)
    except AuthError as e:
        raise HTTPException(status_code=e.status_code, detail=e.detail) from e
    return TokenPair(access_token=access, refresh_token=new_refresh)


@router.post("/logout", status_code=204)
async def logout(payload: RefreshRequest, db: DbSession) -> None:
    await AuthService(db).logout(payload.refresh_token)


@router.get("/me", response_model=UserOut)
async def me(user: CurrentUser) -> UserOut:
    return UserOut.model_validate(user)


@router.patch("/me", response_model=UserOut)
async def update_me(payload: UserUpdate, user: CurrentUser, db: DbSession) -> UserOut:
    if payload.full_name is not None:
        user.full_name = payload.full_name
    await db.commit()
    await db.refresh(user)
    return UserOut.model_validate(user)
