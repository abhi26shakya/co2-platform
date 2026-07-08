import uuid
from datetime import datetime

from pydantic import BaseModel


class ImageOut(BaseModel):
    model_config = {"from_attributes": True}

    id: uuid.UUID
    filename: str
    content_type: str
    size_bytes: int
    width: int | None
    height: int | None
    bounds: list[float] | None
    crs: str | None
    source: str
    plant_id: uuid.UUID | None
    meta: dict
    created_at: datetime
    # populated by the router, not the ORM
    url: str | None = None
    preview_url: str | None = None


class ImageListOut(BaseModel):
    items: list[ImageOut]
    total: int
    page: int
    page_size: int
