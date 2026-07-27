"""Thin SMTP wrapper. No-op (logged) when CO2_SMTP_ENABLED is unset - there is
no email provider configured for local dev, and sends must never block or
fail the request that triggered them (see services/notifications.py).
"""
import logging
from email.message import EmailMessage

import aiosmtplib

from app.core.config import get_settings

logger = logging.getLogger("emissia.email")


class EmailService:
    async def send(self, *, to: str, subject: str, body: str) -> None:
        settings = get_settings()
        if not settings.smtp_enabled:
            logger.info("email suppressed (smtp disabled): to=%s subject=%r", to, subject)
            return

        message = EmailMessage()
        message["From"] = settings.smtp_from_address
        message["To"] = to
        message["Subject"] = subject
        message.set_content(body)

        await aiosmtplib.send(
            message,
            hostname=settings.smtp_host,
            port=settings.smtp_port,
            username=settings.smtp_user,
            password=settings.smtp_password,
            start_tls=True,
        )
