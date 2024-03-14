import asyncio
from uuid import uuid4
from fastapi.testclient import TestClient
from httpx import AsyncClient
import pytest
import pytest_asyncio
from sqlalchemy import StaticPool, create_engine
from sqlmodel import SQLModel, Session

from app import main
from app.api.deps import get_login_token
from app.db_mongodb.mongodb_models import LoginToken, VideoComment
from app.db_mysql.mysql_engine import get_session

from app.config.config import settings
from app.db_mysql.mysql_engine import get_session
from app.db_mongodb import mongodb_sync_dao, mongodb_async_dao
from odmantic import AIOEngine, SyncEngine
from pymongo import MongoClient
from motor.motor_asyncio import AsyncIOMotorClient
from asyncio import get_event_loop

sync_client = MongoClient(f"mongodb://root:pass@{settings.MONGODB_HOST}:27017/")
async_client = AsyncIOMotorClient(f"mongodb://root:pass@{settings.MONGODB_HOST}:27017/")
mongodb_sync_dao.sync_engine = SyncEngine(client=sync_client, database="example_db")
mongodb_async_dao.async_engine = AIOEngine(client=async_client, database="example_db")


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


login_user_id = str(uuid4())


@pytest.fixture(name="token",scope="session")
def token_fixture() -> LoginToken:
    return LoginToken(
        user_id=login_user_id, access_token=str(uuid4()), refresh_token=str(uuid4())
    )


@pytest.fixture(name="client")
def client_fixture(session: Session, token: LoginToken):
    def get_session_override():
        return session

    def get_login_token_override():
        return token

    main.app.dependency_overrides[get_session] = get_session_override
    main.app.dependency_overrides[get_login_token] = get_login_token_override

    client = TestClient(main.app)
    yield client
    main.app.dependency_overrides.clear()

@pytest_asyncio.fixture(scope="session")
async def test_async_client(token: LoginToken):
    def get_login_token_override():
        return token

    main.app.dependency_overrides[get_login_token] = get_login_token_override
    async with AsyncClient(app=main.app, base_url="http://test") as ac:
        yield ac
    main.app.dependency_overrides.clear()    

@pytest.mark.asyncio(scope="session")
async def test_add_comment(test_async_client:AsyncClient):
    response = await test_async_client.post(
        "api/add/comment",
        json={
            "video_id": f"{uuid4()}",
            "comment_message": "test comment",
        },
    )
    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "success"

    mongodb_sync_dao.sync_engine.get_collection(VideoComment).drop()


@pytest.mark.asyncio(scope="session")
async def test_add_replies(test_async_client:AsyncClient):

    video_comment = VideoComment(
        user_id=str(uuid4()), video_id=str(uuid4()), comment_message="test", replies=[]
    )
    result = mongodb_sync_dao.sync_engine.save(video_comment)

  
    response = await test_async_client.post(
            "api/add/replies",
            json={
                "comment_id": f"{result.id}",
                "comment_message": "This is a test reply",
            },
        )

    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "success"

    data = mongodb_sync_dao.sync_engine.find_one(
        VideoComment, VideoComment.id == result.id
    )

    assert len(data.replies) == 1
    assert data.replies[0].comment_message == "This is a test reply"
    assert data.replies[0].user_id == login_user_id

    response = await test_async_client.post(

            "api/add/replies",
            json={
                "comment_id": f"{result.id}",
                "comment_message": "This is a testTwo reply",
            },
        )

    assert response.status_code == 200
    assert "message" in response.json()
    assert response.json()["message"] == "success"

    data = mongodb_sync_dao.sync_engine.find_one(
        VideoComment, VideoComment.id == result.id
    )

    assert len(data.replies) == 2
    assert data.replies[1].comment_message == "This is a testTwo reply"
    assert data.replies[1].user_id == login_user_id

    mongodb_sync_dao.sync_engine.get_collection(VideoComment).drop()
