"""Development seed: demo researcher, mock model registry row, and sample plants.

Run:  python -m scripts.seed        (from backend/, after `alembic upgrade head`)
Idempotent - safe to re-run.
"""
import asyncio
from datetime import UTC, datetime

from sqlalchemy import select

from app.core.security import hash_password
from app.db.session import async_session_maker
from app.models import MLModel, Plant, User

DEMO_USER = {
    "email": "demo@emissia.dev",
    "password": "demopass123",
    "full_name": "Demo Researcher",
}

PLANTS = [
    # name, country, capacity_mw, lat, lon, external_id
    ("Vindhyachal Super Thermal Power Station", "India", 4760, 24.0983, 82.6714, "IND-VINDH"),
    ("Mundra Thermal Power Station", "India", 4620, 22.8244, 69.5525, "IND-MUNDRA"),
    ("Sasan Ultra Mega Power Project", "India", 3960, 23.9827, 82.6270, "IND-SASAN"),
    ("Talcher Super Thermal Power Station", "India", 3000, 21.0959, 85.0756, "IND-TALCHER"),
    ("Korba Super Thermal Power Plant", "India", 2600, 22.3861, 82.6786, "IND-KORBA"),
    ("Belchatow Power Station", "Poland", 5102, 51.2664, 19.3300, "POL-BELCH"),
    ("Taichung Power Plant", "Taiwan", 5500, 24.2117, 120.4819, "TWN-TAICH"),
]


async def seed() -> None:
    async with async_session_maker() as session:
        if not await session.scalar(select(User).where(User.email == DEMO_USER["email"])):
            session.add(
                User(
                    email=DEMO_USER["email"],
                    hashed_password=hash_password(DEMO_USER["password"]),
                    full_name=DEMO_USER["full_name"],
                )
            )
            print(f"created user {DEMO_USER['email']} / {DEMO_USER['password']}")

        if not await session.scalar(select(MLModel).where(MLModel.version == "mock-0.1.0")):
            session.add(
                MLModel(
                    name="co2-unet-mock",
                    version="mock-0.1.0",
                    architecture="U-Net (placeholder)",
                    is_active=True,
                    last_trained_at=datetime.now(UTC),
                )
            )
            print("created model registry row mock-0.1.0")

        for name, country, cap, lat, lon, ext_id in PLANTS:
            if not await session.scalar(select(Plant).where(Plant.external_id == ext_id)):
                session.add(
                    Plant(
                        name=name, country=country, capacity_mw=cap,
                        lat=lat, lon=lon, source="seed", external_id=ext_id,
                    )
                )
        await session.commit()
        print(f"seed complete ({len(PLANTS)} plants ensured)")


if __name__ == "__main__":
    asyncio.run(seed())
