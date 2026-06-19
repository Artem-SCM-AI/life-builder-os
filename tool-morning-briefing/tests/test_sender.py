from unittest.mock import patch

from sender import send_error_alert, send_telegram


def test_send_telegram_posts_with_html_parse_mode():
    with patch("sender.requests.post") as mock_post:
        send_telegram("TOKEN123", "CHAT456", "Hello")

    mock_post.assert_called_once_with(
        "https://api.telegram.org/botTOKEN123/sendMessage",
        data={"chat_id": "CHAT456", "text": "Hello", "parse_mode": "HTML"},
        timeout=10,
    )


def test_send_error_alert_forwards_message_as_given():
    with patch("sender.send_telegram") as mock_send:
        send_error_alert("TOKEN", "CHAT", "Evening briefing failed: network error")

    mock_send.assert_called_once_with(
        "TOKEN", "CHAT", "Evening briefing failed: network error"
    )


def test_send_error_alert_does_not_raise_on_telegram_failure():
    with patch("sender.send_telegram", side_effect=Exception("network error")):
        send_error_alert("TOKEN", "CHAT", "error")  # must not raise
