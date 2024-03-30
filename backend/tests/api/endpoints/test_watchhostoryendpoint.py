import logging
from uuid import uuid4

from fastapi.testclient import TestClient
import pytest
from sqlalchemy import StaticPool, create_engine
from sqlmodel import SQLModel, Session
from app import main
from app.api.deps import get_login_token
from app.api.utils import get_password_hash
from app.db_mongodb.mongodb_models import LoginToken
from app.db_mysql.mysql_engine import get_session
from app.db_mysql.mysql_models import (
    CategoryTable,
    UserTable,
    VideoTable,
    WatchHistoryTable,
)


logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)

user_id = uuid4()

testToken = LoginToken(
    account="test_account",
    user_id=str(user_id),
    access_token=str(uuid4()),
    refresh_token=str(uuid4()),
)


@pytest.fixture(autouse=True)
def setup_and_teardown(session: Session):
    # Setup
    def get_session_override():
        return session

    def get_login_token_override():
        return testToken

    main.app.dependency_overrides[get_session] = get_session_override
    main.app.dependency_overrides[get_login_token] = get_login_token_override
    yield
    # Teardown
    main.app.dependency_overrides.clear()


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


def test_get_watch_history(client: TestClient, session: Session):
    user = UserTable(
        user_id=user_id,
        account="test_account",
        user_name="test_user",
        email="user@example.com",
        password_hash=get_password_hash("1234567"),
    )
    video = VideoTable(
        user_id=user.user_id,
        title="test",
        description="test",
        video_path="test",
        thumbnail_path="test",
        categories=[CategoryTable(category_name="This is the first category")],
    )

    new_watch_history = WatchHistoryTable(
        user_id=user.user_id,
        video_id=video.video_id,
    )
    session.add(user)
    session.add(video)
    session.add(new_watch_history)
    session.commit()

    response = client.get("/api/history/1")
    assert response.status_code == 200
    logging.info(response.json())


def test_add_watch_history(client: TestClient, session: Session):
    user = UserTable(
        user_id=user_id,
        account="test_account",
        user_name="test_user",
        email="user@example.com",
        password_hash=get_password_hash("1234567"),
    )

    video = VideoTable(
        user_id=user.user_id,
        title="test",
        description="test",
        video_path="test",
        thumbnail_path="test",
        categories=[CategoryTable(category_name="This is the first category")],
    )

    session.add(user)
    session.add(video)
    session.commit()

    response = client.post(f"/api/add-history/{video.video_id}")
    assert response.status_code == 200
