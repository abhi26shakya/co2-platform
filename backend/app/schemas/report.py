import uuid
from datetime import datetime
from typing import Literal

from pydantic import BaseModel


class CreateReportRequest(BaseModel):
    format: Literal["pdf", "csv"] = "pdf"


class ReportOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    title: str
    format: str
    params: dict
    created_at: datetime
    url: str | None = None  # populated by the router
