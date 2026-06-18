from unittest.mock import patch

from sender import send_error_alert, send_telegram


def test_send_telegram_posts_to_correct_url():
    with patch("sender.requests.post") as mock_post:
        send_telegram("TOKEN123", "CHAT456", "Hello")

    mock_post.assert_called_once_with(
        "https://api.telegram.org/botTOKEN123/sendMessage",
        data={"chat_id": "CHAT456", "text": "Hello"},
        timeout=10,
    )


def test_send_error_alert_prefixes_message():
    with patch("sender.send_telegram") as mock_send:
        send_error_alert("TOKEN", "CHAT", "something broke")

    mock_send.assert_called_once_with(
        "TOKEN", "CHAT", "Morning briefing failed: something broke"
    )


def test_send_error_alert_does_not_raise_on_telegram_failure():
    with patch("sender.send_telegram", side_effect=Exception("network error")):
        send_error_alert("TOKEN", "CHAT", "error")  # must not raise
