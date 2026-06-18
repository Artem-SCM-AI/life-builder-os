import requests


def send_telegram(token: str, chat_id: str, text: str) -> None:
    requests.post(
        f"https://api.telegram.org/bot{token}/sendMessage",
        data={"chat_id": chat_id, "text": text},
        timeout=10,
    )


def send_error_alert(token: str, chat_id: str, error: str) -> None:
    try:
        send_telegram(token, chat_id, f"Morning briefing failed: {error}")
    except Exception:
        pass
