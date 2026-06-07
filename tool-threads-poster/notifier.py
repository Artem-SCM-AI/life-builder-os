import requests


def send_alert(token: str, chat_id: str, message: str) -> None:
    try:
        requests.post(
            f"https://api.telegram.org/bot{token}/sendMessage",
            data={"chat_id": chat_id, "text": message},
            timeout=10,
        )
    except Exception:
        pass
