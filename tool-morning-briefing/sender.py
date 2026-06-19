import requests


def send_telegram(token: str, chat_id: str, text: str, parse_mode: str = "HTML") -> None:
    requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data={"chat_id": chat_id, "text": text, "parse_mode": parse_mode},
        timeout=10,
    )


def send_error_alert(token: str, chat_id: str, message: str) -> None:
    try:
        send_telegram(token, chat_id, message)
    except Exception:
        pass
