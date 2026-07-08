import uuid
from datetime import datetime

from pydantic import BaseModel


class MLModelOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    name: str
    version: str
    architecture: str | None
    accuracy: float | None
    precision_score: float | None
    recall: float | None
    f1_score: float | None
    is_active: bool
    trained_at: datetime | None
    created_at: datetime
