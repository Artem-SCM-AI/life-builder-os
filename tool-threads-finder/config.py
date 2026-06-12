import os
from dataclasses import dataclass
from dotenv import load_dotenv

@dataclass
class Config:
    threads_token: str
    anthropic_key: str
    sheets_id: str
    credentials_path: str
    telegram_bot_token: str
    telegram_chat_id: str

_REQUIRED = ['THREADS_ACCESS_TOKEN', 'ANTHROPIC_API_KEY', 'GOOGLE_SHEETS_ID',
             'TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID']

def load_config() -> Config:
    load_dotenv()
    missing = [k for k in _REQUIRED if not os.getenv(k)]
    if missing:
        raise ValueError(f"Missing env vars: {', '.join(missing)}")
    return Config(
        threads_token=os.environ['THREADS_ACCESS_TOKEN'],
        anthropic_key=os.environ['ANTHROPIC_API_KEY'],
        sheets_id=os.environ['GOOGLE_SHEETS_ID'],
        credentials_path=os.getenv('GOOGLE_CREDENTIALS_JSON', 'credentials.json'),
        telegram_bot_token=os.environ['TELEGRAM_BOT_TOKEN'],
        telegram_chat_id=os.environ['TELEGRAM_CHAT_ID'],
    )
