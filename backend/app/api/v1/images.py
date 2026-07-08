"""Upload + image asset endpoints (dataset management builds on these)."""
import uuid
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse

from app.core.deps import CurrentUser, DbSession
from app.models import SatelliteImage
from app.repositories.images import ImageRepository
from app.schemas.image import ImageListOut, ImageOut
from app.services.imaging import InvalidImageError
from app.services.uploads import UploadService
from app.storage.local import LocalStorageBackend, get_storage

router = APIRouter(tags=["images"])


async def _to_out(image: SatelliteImage, storage: LocalStorageBackend) -> ImageOut:
    out = ImageOut.model_validate(image)
    out.url = await storage.get_url(image.storage_key)
    if image.preview_key:
        out.preview_url = await storage.get_url(image.preview_key)
    return out


@router.post("/uploads", response_model=ImageOut, status_code=201)
async def upload_image(
    user: CurrentUser,
    db: DbSession,
    file: Annotated[UploadFile, File()],
    plant_id: Annotated[uuid.UUID | None, Form()] = None,
    source: Annotated[str, Form()] = "upload",
) -> ImageOut:
    data = await file.read()
    storage = get_storage()
    try:
        image = await UploadService(db, storage).handle(
            owner_id=user.id,
            filename=file.filename or "unnamed",
            data=data,
            plant_id=plant_id,
            source=source,
        )
    except InvalidImageError as e:
        raise HTTPException(status_code=422, detail=e.detail) from e
    return await _to_out(image, storage)


@router.get("/images", response_model=ImageListOut)
async def list_images(
    user: CurrentUser,
    db: DbSession,
    search: str | None = None,
    source: str | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> ImageListOut:
    storage = get_storage()
    rows, total = await ImageRepository(db).list_owned(
        user.id, search=search, source=source, page=page, page_size=page_size
    )
    return ImageListOut(
        items=[await _to_out(img, storage) for img in rows],
        total=total,
        page=page,
        page_size=page_size,
    )


@router.get("/images/{image_id}", response_model=ImageOut)
async def get_image(image_id: uuid.UUID, user: CurrentUser, db: DbSession) -> ImageOut:
    image = await ImageRepository(db).get_owned(image_id, user.id)
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    return await _to_out(image, get_storage())


@router.delete("/images/{image_id}", status_code=204)
async def delete_image(image_id: uuid.UUID, user: CurrentUser, db: DbSession) -> None:
    repo = ImageRepository(db)
    image = await repo.get_owned(image_id, user.id)
    if image is None:
        raise HTTPException(status_code=404, detail="Image not found")
    storage = get_storage()
    await storage.delete(image.storage_key)
    if image.preview_key:
        await storage.delete(image.preview_key)
    await repo.delete(image)
    await db.commit()


@router.get("/files/{key:path}", include_in_schema=False)
async def serve_file(key: str) -> FileResponse:
    """Dev-mode file serving for LocalStorageBackend.

    Keys contain unguessable UUIDs; in production this route is replaced by
    S3 presigned URLs from the storage backend (see docs/architecture.md).
    """
    storage = get_storage()
    try:
        if not await storage.exists(key):
            raise HTTPException(status_code=404, detail="File not found")
        return FileResponse(storage._path(key))  # noqa: SLF001 - local backend only
    except ValueError as e:  # path traversal guard tripped
        raise HTTPException(status_code=404, detail="File not found") from e
