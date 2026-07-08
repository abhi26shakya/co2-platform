"""Local filesystem storage - development default. Mirrors the future S3 backend."""
import shutil
from pathlib import Path
from typing import BinaryIO

from app.core.config import get_settings


class LocalStorageBackend:
    def __init__(self) -> None:
        self._root = Path(get_settings().storage_local_path).resolve()
        self._root.mkdir(parents=True, exist_ok=True)

    def _path(self, key: str) -> Path:
        path = (self._root / key).resolve()
        if not path.is_relative_to(self._root):  # path traversal guard
            raise ValueError(f"Illegal storage key: {key}")
        return path

    async def save(self, key: str, file: BinaryIO, content_type: str) -> str:
        path = self._path(key)
        path.parent.mkdir(parents=True, exist_ok=True)
        with path.open("wb") as out:
            shutil.copyfileobj(file, out)
        return key

    async def get_url(self, key: str) -> str:
        return f"/api/v1/files/{key}"

    async def delete(self, key: str) -> None:
        path = self._path(key)
        path.unlink(missing_ok=True)

    async def exists(self, key: str) -> bool:
        return self._path(key).is_file()


def get_storage() -> LocalStorageBackend:
    return LocalStorageBackend()
