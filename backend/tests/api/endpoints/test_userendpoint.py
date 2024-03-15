from pathlib import Path
from uuid import uuid4
from httpx import AsyncClient

from odmantic import AIOEngine, SyncEngine
from pymongo import MongoClient
import pytest
from motor.motor_asyncio import AsyncIOMotorClient
import pytest_asyncio
from sqlalchemy import StaticPool, create_engine
from sqlmodel import SQLModel, Session, select
from app import main
from fastapi.testclient import TestClient
from app.api.utils import get_password_hash

from app.config.config import settings
from app.db_mongodb.mongodb_models import LoginToken
from app.db_mysql.mysql_engine import get_session
from app.db_mysql.mysql_models import UserTable
from app.db_mongodb import mongodb_sync_dao, mongodb_async_dao


@pytest.fixture(autouse=True)
def setup_and_teardown(session: Session):
    # Setup
    settings.VIDEO_BASE_PATH = "tests/static/video"
    settings.IMG_BASE_PATH = "tests/static/img"
    sync_client = MongoClient(f"mongodb://root:pass@{settings.MONGODB_HOST}:27017/")
    async_client = AsyncIOMotorClient(
        f"mongodb://root:pass@{settings.MONGODB_HOST}:27017/"
    )
    mongodb_sync_dao.sync_engine = SyncEngine(client=sync_client, database="example_db")
    mongodb_async_dao.async_engine = AIOEngine(
        client=async_client, database="example_db"
    )

    def get_session_override():
        return session

    main.app.dependency_overrides[get_session] = get_session_override
    yield
    # Teardown
    main.app.dependency_overrides.clear()
    mongodb_sync_dao.sync_engine.get_collection(LoginToken).drop()


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture():

    client = TestClient(main.app)
    return client


@pytest_asyncio.fixture(scope="session")
async def test_async_client():
    async with AsyncClient(app=main.app, base_url="http://test") as ac:
        yield ac


def test_register(session: Session, client: TestClient):

    register_data = {
        "account": "test_account",
        "user_name": "test_user",
        "email": "user@example.com",
        "password": "1234567",
    }
    response = client.post(
        "/api/register",
        json=register_data,
    )

    statement = select(UserTable).where(UserTable.email == "user@example.com")
    results = session.exec(statement)
    user = results.one()

    assert response.status_code == 200
    assert response.json() == {"message": "success"}
    assert Path(f"{settings.VIDEO_BASE_PATH}/{str(user.user_id)}").exists()
    assert Path(f"{settings.IMG_BASE_PATH}/{str(user.user_id)}").exists()

    Path(f"{settings.VIDEO_BASE_PATH}/{str(user.user_id)}").rmdir()
    Path(f"{settings.IMG_BASE_PATH}/{str(user.user_id)}").rmdir()


def test_get_access_token(session: Session, client: TestClient) -> None:

    user = UserTable(
        account="test_account",
        user_name="test_user",
        email="user@example.com",
        password_hash=get_password_hash("1234567"),
    )
    session.add(user)
    session.commit()

    login_data = {
        "username": "user@example.com",
        "password": "1234567",
    }
    r = client.post("/api/login/access-token", data=login_data)
    tokens = r.json()
    assert r.status_code == 200
    assert "access_token" in tokens
    assert mongodb_sync_dao.sync_engine.find_one(
        LoginToken, LoginToken.access_token == tokens["access_token"]
    )


@pytest.mark.asyncio(scope="session")
async def test_logout(test_async_client: AsyncClient):

    response = await test_async_client.post("/api/logout")

    assert response.status_code == 401

    user_id = uuid4()
    access_token = uuid4()
    refresh_token = uuid4()

    mongodb_sync_dao.save_login_token(user_id, access_token, refresh_token)

    response = await test_async_client.post(
        "/api/logout", headers={"Authorization": f"Bearer {access_token}"}
    )

    assert response.status_code == 200
    assert response.json() == {"message": "logoutSuccess"}
    assert not mongodb_sync_dao.find_login_token(user_id)

    response = await test_async_client.post(
        "/api/logout", headers={"Authorization": f"Bearer {access_token}"}
    )
    assert response.status_code == 404
