"""Image validation + geospatial metadata extraction + preview generation.

Pure functions over bytes/paths - no DB, no HTTP - so they are trivially testable
and reusable by the future Celery preprocessing worker.
"""
import io
from dataclasses import dataclass, field

import numpy as np
import rasterio
from PIL import Image
from rasterio.errors import RasterioIOError
from rasterio.warp import transform_bounds

# magic bytes -> canonical content type
_SIGNATURES: list[tuple[bytes, str]] = [
    (b"\x89PNG\r\n\x1a\n", "image/png"),
    (b"\xff\xd8\xff", "image/jpeg"),
    (b"II*\x00", "image/tiff"),  # little-endian TIFF (incl. GeoTIFF)
    (b"MM\x00*", "image/tiff"),  # big-endian TIFF
]

ALLOWED_EXTENSIONS = {".png", ".jpg", ".jpeg", ".tif", ".tiff"}
PREVIEW_MAX_PX = 1024


class InvalidImageError(Exception):
    def __init__(self, detail: str) -> None:
        self.detail = detail


@dataclass
class ExtractedMetadata:
    content_type: str
    width: int | None = None
    height: int | None = None
    bounds_wgs84: list[float] | None = None  # [min_lon, min_lat, max_lon, max_lat]
    crs: str | None = None
    extra: dict = field(default_factory=dict)
    preview_png: bytes | None = None  # only for TIFFs (browsers can't render them)


def sniff_content_type(head: bytes) -> str:
    """Trust magic bytes, never the client-declared Content-Type."""
    for sig, ctype in _SIGNATURES:
        if head.startswith(sig):
            return ctype
    raise InvalidImageError("Unsupported or corrupt file. Allowed: PNG, JPG, TIFF/GeoTIFF.")


def extract_metadata(data: bytes) -> ExtractedMetadata:
    ctype = sniff_content_type(data[:16])
    if ctype == "image/tiff":
        return _extract_tiff(data)
    return _extract_plain(data, ctype)


def _extract_plain(data: bytes, ctype: str) -> ExtractedMetadata:
    try:
        with Image.open(io.BytesIO(data)) as img:
            width, height = img.size
    except Exception as e:  # noqa: BLE001 - PIL raises many types
        raise InvalidImageError("Could not read image file.") from e
    return ExtractedMetadata(content_type=ctype, width=width, height=height)


def _extract_tiff(data: bytes) -> ExtractedMetadata:
    try:
        with rasterio.MemoryFile(data) as mem, mem.open() as src:
            meta = ExtractedMetadata(
                content_type="image/tiff",
                width=src.width,
                height=src.height,
                extra={"band_count": src.count, "dtype": str(src.dtypes[0])},
            )
            if src.crs is not None:
                meta.crs = str(src.crs)
                b = (
                    transform_bounds(src.crs, "EPSG:4326", *src.bounds)
                    if str(src.crs) != "EPSG:4326"
                    else tuple(src.bounds)
                )
                meta.bounds_wgs84 = [round(v, 6) for v in b]
            meta.preview_png = _render_preview(src)
            return meta
    except RasterioIOError as e:
        raise InvalidImageError("Could not read TIFF/GeoTIFF file.") from e


def _render_preview(src: "rasterio.DatasetReader") -> bytes:
    """Percentile-stretched PNG preview, longest side <= PREVIEW_MAX_PX."""
    scale = max(src.width, src.height) / PREVIEW_MAX_PX
    out_w = max(1, int(src.width / max(scale, 1)))
    out_h = max(1, int(src.height / max(scale, 1)))
    bands = min(src.count, 3)
    arr = src.read(
        indexes=list(range(1, bands + 1)),
        out_shape=(bands, out_h, out_w),
    ).astype("float64")

    stretched = np.empty_like(arr, dtype="uint8")
    for i in range(bands):
        band = arr[i]
        finite = band[np.isfinite(band)]
        if finite.size == 0:
            stretched[i] = 0
            continue
        lo, hi = np.percentile(finite, (2, 98))
        if hi <= lo:
            hi = lo + 1
        stretched[i] = (np.clip((band - lo) / (hi - lo), 0, 1) * 255).astype("uint8")

    img_arr = stretched[0] if bands == 1 else np.moveaxis(stretched, 0, -1)
    mode = "L" if bands == 1 else "RGB"
    buf = io.BytesIO()
    Image.fromarray(img_arr, mode=mode).save(buf, format="PNG")
    return buf.getvalue()
