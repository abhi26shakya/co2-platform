"""Best-effort email notifications gated by per-user preferences.

Called from the tail end of prediction/upload/report completion. Never
raises - a broken mailbox or SMTP outage must not fail the request that
triggered it. There's no Celery/queue in this repo yet (post-v1 backlog),
so this is synchronous best-effort, not a durable delivery guarantee.
"""
import logging
import uuid

from sqlalchemy.ext.asyncio import AsyncSession

from app.repositories.preferences import PreferencesRepository
from app.repositories.users import UserRepository
from app.services.email import EmailService

logger = logging.getLogger("emissia.notifications")

_PREFERENCE_FIELD = {
    "prediction_completed": "notify_prediction_completed",
    "upload_finished": "notify_upload_finished",
    "report_generated": "notify_report_generated",
}


async def notify_user(
    session: AsyncSession, *, user_id: uuid.UUID, kind: str, subject: str, body: str
) -> None:
    try:
        user = await UserRepository(session).get_by_id(user_id)
        if user is None or not user.is_active:
            return
        prefs = await PreferencesRepository(session).get_or_create(user_id)
        await session.commit()
        if not prefs.notify_email_enabled:
            return
        field = _PREFERENCE_FIELD.get(kind)
        if field is not None and not getattr(prefs, field):
            return
        await EmailService().send(to=user.email, subject=subject, body=body)
    except Exception:  # noqa: BLE001 - notifications must never break the caller
        logger.exception("notification send failed: user_id=%s kind=%s", user_id, kind)
