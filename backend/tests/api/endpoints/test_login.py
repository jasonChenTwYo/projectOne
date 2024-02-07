from typing import Dict
from app import main
from fastapi.testclient import TestClient

client = TestClient(main.app)

def test_get_access_token() -> None:
    login_data = {
        "username": "sss",
        "password": "ss",
    }
    r = client.post("/login/access-token", data=login_data)
    tokens = r.json()
    assert r.status_code == 200
    assert "access_token" in tokens
    assert tokens["access_token"]
    assert tokens["access_token"] == "test"