"""Upload orchestration: validate -> store original -> extract metadata ->
store preview -> persist SatelliteImage + Upload audit row."""
import uuid
from io import BytesIO
from pathlib import Path

from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models import SatelliteImage, Upload
from app.services.imaging import ALLOWED_EXTENSIONS, InvalidImageError, extract_metadata
from app.storage.base import StorageBackend


class UploadService:
    def __init__(self, session: AsyncSession, storage: StorageBackend) -> None:
        self.session = session
        self.storage = storage

    async def handle(
        self,
        *,
        owner_id: uuid.UUID,
        filename: str,
        data: bytes,
        plant_id: uuid.UUID | None = None,
        source: str = "upload",
    ) -> SatelliteImage:
        upload = Upload(user_id=owner_id, status="pending")
        self.session.add(upload)
        await self.session.flush()

        try:
            image = await self._process(
                owner_id=owner_id,
                filename=filename,
                data=data,
                plant_id=plant_id,
                source=source,
            )
        except InvalidImageError as e:
            upload.status = "failed"
            upload.error = e.detail
            await self.session.commit()
            raise

        upload.status = "completed"
        upload.image_id = image.id
        await self.session.commit()
        await self.session.refresh(image)
        return image

    async def _process(
        self,
        *,
        owner_id: uuid.UUID,
        filename: str,
        data: bytes,
        plant_id: uuid.UUID | None,
        source: str,
    ) -> SatelliteImage:
        settings = get_settings()
        max_bytes = settings.max_upload_mb * 1024 * 1024
        if len(data) == 0:
            raise InvalidImageError("Empty file.")
        if len(data) > max_bytes:
            raise InvalidImageError(f"File exceeds the {settings.max_upload_mb} MB limit.")

        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise InvalidImageError(
                f"Extension '{ext or 'none'}' not allowed. Use PNG, JPG, or TIFF/GeoTIFF."
            )

        meta = extract_metadata(data)  # raises InvalidImageError on bad magic/corrupt file

        image_id = uuid.uuid4()
        safe_name = Path(filename).name.replace(" ", "_")
        storage_key = f"images/{owner_id}/{image_id}/{safe_name}"
        await self.storage.save(storage_key, BytesIO(data), meta.content_type)

        preview_key: str | None = None
        if meta.preview_png is not None:
            preview_key = f"previews/{owner_id}/{image_id}.png"
            await self.storage.save(preview_key, BytesIO(meta.preview_png), "image/png")

        image = SatelliteImage(
            id=image_id,
            owner_id=owner_id,
            plant_id=plant_id,
            filename=safe_name,
            storage_key=storage_key,
            preview_key=preview_key,
            content_type=meta.content_type,
            size_bytes=len(data),
            width=meta.width,
            height=meta.height,
            bounds=meta.bounds_wgs84,
            crs=meta.crs,
            source=source,
            meta=meta.extra,
        )
        self.session.add(image)
        await self.session.flush()
        return image
