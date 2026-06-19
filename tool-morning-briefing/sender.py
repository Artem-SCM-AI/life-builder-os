import requests


def send_telegram(token: str, chat_id: str, text: str, parse_mode: str | None = "HTML") -> None:
    data: dict = {"chat_id": chat_id, "text": text}
    if parse_mode is not None:
        data["parse_mode"] = parse_mode
    requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data=data,
        timeout=10,
    )


def send_error_alert(token: str, chat_id: str, message: str) -> None:
    try:
        send_telegram(token, chat_id, message, parse_mode=None)
    except Exception:
        pass
