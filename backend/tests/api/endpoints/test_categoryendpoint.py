from uuid import uuid4
from fastapi.encoders import jsonable_encoder
from fastapi.testclient import TestClient
import pytest
from sqlalchemy import StaticPool, create_engine
from sqlmodel import SQLModel, Session

from app import main
from app.api.deps import get_login_token
from app.api.response import GetAllCategoryResponse
from app.db_mongodb.mongodb_models import LoginToken
from app.db_mysql.mysql_engine import get_session
from app.db_mysql.mysql_models import CategoryTable

login_user_id = str(uuid4())


@pytest.fixture(autouse=True)
def setup_and_teardown(session: Session):
    # Setup

    def get_session_override():
        return session

    def get_login_token_override():
        return LoginToken(
            user_id=login_user_id, access_token=str(uuid4()), refresh_token=str(uuid4())
        )

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


def test_get_all_category(client: TestClient, session: Session):
    data1 = CategoryTable(category_name="This is the first category")
    data2 = CategoryTable(category_name="This is the second category")
    session.add(data1)
    session.add(data2)
    session.commit()

    # Define expected response
    expected_response = GetAllCategoryResponse(
        categories=[
            {
                "category_id": data1.category_id,
                "category_name": "This is the first category",
            },
            {
                "category_id": data2.category_id,
                "category_name": "This is the second category",
            },
        ],
        message="success",
    )

    # Make a GET request to the endpoint
    response = client.get("/api/get-category/all")

    # Assert that the response is as expected
    assert response.status_code == 200
    assert response.json() == jsonable_encoder(expected_response)
