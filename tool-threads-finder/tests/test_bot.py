import sys
import importlib
import pytest
from unittest.mock import AsyncMock, MagicMock, patch


def reload_bot():
    """Reload bot module with mocked external dependencies."""
    # Remove cached bot module so reload picks up fresh patches
    sys.modules.pop('bot', None)

    mock_cfg = MagicMock(
        telegram_bot_token='tok',
        telegram_chat_id='123',
        sheets_id='sid',
        credentials_path='creds.json',
        threads_token='ttoken',
    )

    with patch('config.load_config', return_value=mock_cfg), \
         patch('sheets_client.SheetsClient', return_value=MagicMock()), \
         patch('threads_client.ThreadsClient', return_value=MagicMock()):
        import bot
        importlib.reload(bot)
    return bot


@pytest.mark.asyncio
async def test_handle_telegram_reply_publishes_to_threads():
    bot_module = reload_bot()

    sheets = MagicMock()
    sheets.find_their_comment_id.return_value = 'tc_abc'
    threads = MagicMock()

    update = MagicMock()
    update.message.text = 'Так, розкажу детальніше'
    update.message.reply_to_message.message_id = 999
    update.message.reply_text = AsyncMock()

    with patch.object(bot_module, 'sheets', sheets), \
         patch.object(bot_module, 'threads', threads):
        await bot_module.handle_telegram_reply(update, MagicMock())

    threads.reply.assert_called_once_with('tc_abc', 'Так, розкажу детальніше')
    sheets.update_reply_map_status.assert_called_once_with('999', 'replied')
    update.message.reply_text.assert_called_once_with('✅ Опубліковано')


@pytest.mark.asyncio
async def test_handle_telegram_reply_ignores_non_reply_messages():
    bot_module = reload_bot()
    threads = MagicMock()

    update = MagicMock()
    update.message.reply_to_message = None

    with patch.object(bot_module, 'threads', threads):
        await bot_module.handle_telegram_reply(update, MagicMock())

    threads.reply.assert_not_called()


@pytest.mark.asyncio
async def test_handle_telegram_reply_ignores_unknown_notification():
    bot_module = reload_bot()
    sheets = MagicMock()
    sheets.find_their_comment_id.return_value = None
    threads = MagicMock()

    update = MagicMock()
    update.message.reply_to_message.message_id = 777

    with patch.object(bot_module, 'sheets', sheets), \
         patch.object(bot_module, 'threads', threads):
        await bot_module.handle_telegram_reply(update, MagicMock())

    threads.reply.assert_not_called()
