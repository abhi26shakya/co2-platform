"""Test setup: isolated test database, dependency override, auth helpers.

The test DB URL comes from CO2_TEST_DATABASE_URL (defaults to the compose/CI
postgres). Tables are created fresh for the session and dropped afterwards.
"""
import asyncio
import os
import tempfile
import uuid

import pytest

os.environ.setdefault(
    "CO2_TEST_DATABASE_URL",
    "postgresql+asyncpg://co2:co2password@localhost:5432/co2_test",
)
os.environ["CO2_STORAGE_LOCAL_PATH"] = tempfile.mkdtemp(prefix="co2-test-storage-")
os.environ["CO2_RATE_LIMIT_ENABLED"] = "0"  # hardening tests re-enable per-test
os.environ["CO2_AUTH_RATE_LIMIT"] = "5/minute"  # tight limit so tests can trigger it fast
os.environ["CO2_RATE_LIMIT_ENABLED"] = "false"  # re-enabled by the rate-limit test only
os.environ["CO2_AUTH_RATE_LIMIT"] = "5/minute"

from fastapi.testclient import TestClient  # noqa: E402
from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine  # noqa: E402
from sqlalchemy.pool import NullPool  # noqa: E402

from app import models  # noqa: E402, F401
from app.db.base import Base  # noqa: E402
from app.db.session import get_db  # noqa: E402
from app.main import app  # noqa: E402

TEST_DB_URL = os.environ["CO2_TEST_DATABASE_URL"]

# NullPool: connections are loop-bound in asyncpg; never share across event loops.
test_engine = create_async_engine(TEST_DB_URL, poolclass=NullPool)
test_session_maker = async_sessionmaker(test_engine, expire_on_commit=False)


async def _override_get_db():
    async with test_session_maker() as session:
        yield session


app.dependency_overrides[get_db] = _override_get_db


@pytest.fixture(scope="session", autouse=True)
def prepare_database():
    async def create():
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)
            await conn.run_sync(Base.metadata.create_all)
        # mirror compose boot: registry seeded before the app serves traffic
        from app.db.seed import MOCK_MODEL
        from app.models import MLModel

        async with test_session_maker() as session:
            session.add(MLModel(**MOCK_MODEL))
            await session.commit()

    async def drop():
        async with test_engine.begin() as conn:
            await conn.run_sync(Base.metadata.drop_all)

    asyncio.run(create())
    yield
    asyncio.run(drop())


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def user_factory(client):
    """Signup + login a fresh user; returns (email, password, token_pair_dict)."""

    def make(password: str = "s3cure-pass-123"):
        email = f"user-{uuid.uuid4().hex[:10]}@test.dev"
        r = client.post(
            "/api/v1/auth/signup",
            json={"email": email, "password": password, "full_name": "Test Researcher"},
        )
        assert r.status_code == 201, r.text
        r = client.post("/api/v1/auth/login", json={"email": email, "password": password})
        assert r.status_code == 200, r.text
        return email, password, r.json()

    return make


@pytest.fixture
def auth_headers(user_factory):
    _, _, tokens = user_factory()
    return {"Authorization": f"Bearer {tokens['access_token']}"}
