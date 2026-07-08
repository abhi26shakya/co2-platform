"""Structured request logging + a global exception guard.

Every request logs one line: method, path, status, duration. Unhandled
exceptions log the traceback and return a clean JSON 500 (never a stack trace
to the client).
"""
import logging
import time

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

logger = logging.getLogger("emissia")


def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )


def install_middleware(app: FastAPI) -> None:
    @app.middleware("http")
    async def request_logger(request: Request, call_next):
        start = time.perf_counter()
        try:
            response = await call_next(request)
        except Exception:  # noqa: BLE001 - last-resort guard
            duration = (time.perf_counter() - start) * 1000
            logger.exception(
                "unhandled error method=%s path=%s duration_ms=%.1f",
                request.method,
                request.url.path,
                duration,
            )
            return JSONResponse(status_code=500, content={"detail": "Internal server error"})
        duration = (time.perf_counter() - start) * 1000
        logger.info(
            "method=%s path=%s status=%s duration_ms=%.1f",
            request.method,
            request.url.path,
            response.status_code,
            duration,
        )
        # basic security headers
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
        return response
