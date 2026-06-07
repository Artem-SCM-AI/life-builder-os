from unittest.mock import patch, MagicMock
import pytest
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from threads_client import ThreadsClient, ThreadsAuthError, ThreadsAPIError


def _resp(status_code, json_data):
    r = MagicMock()
    r.status_code = status_code
    r.ok = status_code < 400
    r.json.return_value = json_data
    r.text = str(json_data)
    return r


@pytest.fixture
def client():
    return ThreadsClient(access_token="test_token")


@patch("threads_client.requests.post")
def test_create_post_returns_post_id(mock_post, client):
    mock_post.side_effect = [
        _resp(200, {"id": "container_123"}),
        _resp(200, {"id": "post_456"}),
    ]
    assert client.create_post("Hello world") == "post_456"


@patch("threads_client.requests.post")
def test_create_reply_returns_reply_id(mock_post, client):
    mock_post.side_effect = [
        _resp(200, {"id": "container_789"}),
        _resp(200, {"id": "reply_012"}),
    ]
    result = client.create_reply("post_456", "My first comment")
    assert result == "reply_012"
    params = mock_post.call_args_list[0][1]["params"]
    assert params["reply_to_id"] == "post_456"


@patch("threads_client.requests.post")
def test_create_post_raises_auth_error_on_401(mock_post, client):
    mock_post.return_value = _resp(401, {"error": "invalid token"})
    with pytest.raises(ThreadsAuthError):
        client.create_post("Hello")


@patch("threads_client.requests.post")
def test_create_post_raises_api_error_on_500(mock_post, client):
    mock_post.return_value = _resp(500, {"error": "server error"})
    with pytest.raises(ThreadsAPIError):
        client.create_post("Hello")


@patch("threads_client.requests.post")
def test_create_post_does_not_include_reply_to_id(mock_post, client):
    mock_post.side_effect = [
        _resp(200, {"id": "container_123"}),
        _resp(200, {"id": "post_456"}),
    ]
    client.create_post("Hello world")
    params = mock_post.call_args_list[0][1]["params"]
    assert "reply_to_id" not in params


@patch("threads_client.requests.post")
def test_create_post_raises_auth_error_when_publish_returns_401(mock_post, client):
    mock_post.side_effect = [
        _resp(200, {"id": "container_123"}),
        _resp(401, {"error": "invalid token"}),
    ]
    with pytest.raises(ThreadsAuthError):
        client.create_post("Hello")


@patch("threads_client.requests.post")
def test_create_post_raises_api_error_when_publish_returns_500(mock_post, client):
    mock_post.side_effect = [
        _resp(200, {"id": "container_123"}),
        _resp(500, {"error": "server error"}),
    ]
    with pytest.raises(ThreadsAPIError):
        client.create_post("Hello")


@patch("threads_client.requests.post")
def test_create_reply_raises_auth_error_on_401(mock_post, client):
    mock_post.return_value = _resp(401, {"error": "invalid token"})
    with pytest.raises(ThreadsAuthError):
        client.create_reply("post_456", "My comment")
