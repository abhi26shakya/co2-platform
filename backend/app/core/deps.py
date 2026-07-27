"""Shared FastAPI dependencies."""
import uuid
from typing import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import decode_access_token, decode_access_token_session_id
from app.db.session import get_db
from app.models import User
from app.repositories.users import UserRepository

_bearer = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> User:
    if credentials is None:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    user = await UserRepository(db).get_by_id(user_id)
    if user is None or not user.is_active:
        raise HTTPException(status_code=401, detail="User not found or disabled")
    return user


async def get_current_session_id(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(_bearer)],
) -> uuid.UUID | None:
    """The refresh-token (session) id embedded in the current access token, if any.

    Older/foreign tokens without a `sid` claim simply yield None - callers treat
    that as "can't tell which session is current", not an error.
    """
    if credentials is None:
        return None
    return decode_access_token_session_id(credentials.credentials)


CurrentUser = Annotated[User, Depends(get_current_user)]
CurrentSessionId = Annotated[uuid.UUID | None, Depends(get_current_session_id)]
DbSession = Annotated[AsyncSession, Depends(get_db)]
