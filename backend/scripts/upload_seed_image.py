import asyncio
import numpy as np
import rasterio
import rasterio.io
from rasterio.transform import from_bounds
import httpx

BOUNDS = (79.5, 22.5, 79.6, 22.6)

def geotiff_bytes() -> bytes:
    w, h, bands = 64, 64, 3
    transform = from_bounds(*BOUNDS, w, h)
    data = (np.random.default_rng(42).random((bands, h, w)) * 4000).astype("uint16")
    mem = rasterio.io.MemoryFile()
    with mem.open(
        driver="GTiff",
        width=w,
        height=h,
        count=bands,
        dtype="uint16",
        crs="EPSG:4326",
        transform=transform,
    ) as dst:
        dst.write(data)
    return mem.read()

async def upload():
    payload = {"email": "demo@emissia.dev", "password": "demopass123"}
    async with httpx.AsyncClient() as client:
        r = await client.post("http://127.0.0.1:8000/api/v1/auth/login", json=payload)
        if r.status_code != 200:
            print("Failed to login:", r.text)
            return
        token = r.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        r_list = await client.get("http://127.0.0.1:8000/api/v1/images", headers=headers)
        if r_list.status_code == 200 and r_list.json()["total"] > 0:
            print("Database already has seeded images.")
            return

        print("Uploading seed GeoTIFF...")
        files = {"file": ("vindhyachal_scene.tif", geotiff_bytes(), "image/tiff")}
        r_upload = await client.post(
            "http://127.0.0.1:8000/api/v1/uploads",
            headers=headers,
            files=files,
            data={"source": "sentinel-5p"}
        )
        if r_upload.status_code == 201:
            print("Seed GeoTIFF uploaded successfully:", r_upload.json()["filename"])
        else:
            print("Failed to upload seed GeoTIFF:", r_upload.text)

if __name__ == "__main__":
    asyncio.run(upload())
