import os
from dataclasses import dataclass

from dotenv import load_dotenv

load_dotenv()


@dataclass
class Config:
    telegram_bot_token: str
    anthropic_api_key: str
    notion_api_key: str
    notion_database_id: str
    allowed_user_id: int


def load_config() -> Config:
    return Config(
        telegram_bot_token=_require("TELEGRAM_BOT_TOKEN"),
        anthropic_api_key=_require("ANTHROPIC_API_KEY"),
        notion_api_key=_require("NOTION_API_KEY"),
        notion_database_id=_require("NOTION_DATABASE_ID"),
        allowed_user_id=int(_require("ALLOWED_USER_ID")),
    )


def _require(key: str) -> str:
    value = os.getenv(key)
    if not value:
        raise ValueError(f"Missing required env var: {key}")
    return value
