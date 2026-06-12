import pytest
from unittest.mock import patch
import os

def test_load_config_raises_on_missing_vars():
    with patch.dict(os.environ, {}, clear=True):
        from config import load_config
        with pytest.raises(ValueError, match="Missing env vars"):
            load_config()

def test_load_config_returns_config():
    env = {
        'THREADS_ACCESS_TOKEN': 'tok',
        'ANTHROPIC_API_KEY': 'key',
        'GOOGLE_SHEETS_ID': 'sheetid',
        'TELEGRAM_BOT_TOKEN': 'bottoken',
        'TELEGRAM_CHAT_ID': '12345',
    }
    with patch.dict(os.environ, env, clear=True):
        from config import load_config
        cfg = load_config()
        assert cfg.threads_token == 'tok'
        assert cfg.anthropic_key == 'key'
        assert cfg.sheets_id == 'sheetid'
        assert cfg.credentials_path == 'credentials.json'
        assert cfg.telegram_bot_token == 'bottoken'
        assert cfg.telegram_chat_id == '12345'
