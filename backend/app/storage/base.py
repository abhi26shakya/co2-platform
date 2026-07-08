"""StorageBackend protocol. Local now, S3 later - same interface."""
from typing import BinaryIO, Protocol


class StorageBackend(Protocol):
    async def save(self, key: str, file: BinaryIO, content_type: str) -> str:
        """Persist a file, return its storage key."""
        ...

    async def get_url(self, key: str) -> str:
        """Return a URL the frontend can load (local path route or presigned S3 URL)."""
        ...

    async def delete(self, key: str) -> None: ...

    async def exists(self, key: str) -> bool: ...
