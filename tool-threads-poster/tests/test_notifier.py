from unittest.mock import patch
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from notifier import send_alert


@patch("notifier.requests.post")
def test_send_alert_calls_telegram_api(mock_post):
    send_alert("bot_token", "chat_123", "Test message")
    mock_post.assert_called_once()
    url = mock_post.call_args[0][0]
    assert "bot_token" in url


@patch("notifier.requests.post", side_effect=Exception("Network error"))
def test_send_alert_does_not_raise_on_failure(mock_post):
    send_alert("bot_token", "chat_123", "Test message")  # must not raise
