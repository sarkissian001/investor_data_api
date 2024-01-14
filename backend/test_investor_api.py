import pytest
from fastapi.testclient import TestClient
from .investor_api import app
from httpx import Response

MOCK_API_KEY = "some_api_key123"
MOCK_API_REFRESH_TOKEN = "some_refresh_token123"
MOCK_API_USER = "testuser"


# Fixture for the FastAPI test client
@pytest.fixture
def client():
    return TestClient(app)


# Fixture to mock external requests
@pytest.fixture(autouse=True)
def mock_external_request(monkeypatch):
    async def mock_post(*args, **kwargs):
        if kwargs["data"]["apikey"] == MOCK_API_KEY and kwargs["data"]["username"] == MOCK_API_USER:
            return Response(status_code=200,
                            json={"access_token": MOCK_API_KEY, "refresh_token": MOCK_API_REFRESH_TOKEN})

        return Response(status_code=401, json={"details": "Unauthorised"})

    monkeypatch.setattr("httpx.AsyncClient.post", mock_post)


def test_get_access_token_success(client):
    response = client.post("/connect/token", data={"username": MOCK_API_USER, "apikey": MOCK_API_KEY})
    assert response.status_code == 200
    assert "access_token" in response.json()
    assert "refresh_token" in response.json()


def test_get_access_token_invalid_credentials(client):
    response = client.post("/connect/token", data={"username": "foo", "apikey": "bar"})
    assert response.status_code == 401
