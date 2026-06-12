import asyncio
import logging

from telegram import Bot, Update
from telegram.ext import Application, MessageHandler, filters, ContextTypes

from config import load_config
from sheets_client import SheetsClient
from threads_client import ThreadsClient, ThreadsAPIError

MONITOR_INTERVAL = 300

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)

cfg = load_config()
sheets = SheetsClient(cfg.sheets_id, cfg.credentials_path)
threads = ThreadsClient(cfg.threads_token)


async def monitor_replies() -> None:
    bot = Bot(token=cfg.telegram_bot_token)
    while True:
        try:
            our_reply_ids = sheets.our_reply_ids_last_7_days()
            known_ids = sheets.known_their_comment_ids()

            for our_reply_id in our_reply_ids:
                try:
                    replies = threads.get_replies(our_reply_id)
                except ThreadsAPIError as e:
                    log.warning(f"get_replies failed for {our_reply_id}: {e}")
                    continue

                for reply in replies:
                    their_id = reply.get('id', '')
                    if their_id in known_ids:
                        continue
                    commenter = reply.get('username', 'unknown')
                    comment_text = reply.get('text', '')
                    text = (
                        f"💬 Відповідь на твій коментар\n\n"
                        f"Від: @{commenter}\n"
                        f'"{comment_text}"'
                    )
                    sent = await bot.send_message(chat_id=cfg.telegram_chat_id, text=text)
                    sheets.append_reply_map(our_reply_id, their_id, commenter, comment_text, sent.message_id)
                    known_ids.add(their_id)
                    log.info(f"Notified: reply {their_id} from @{commenter}")

        except Exception as e:
            log.error(f"Monitor error: {e}")

        await asyncio.sleep(MONITOR_INTERVAL)


async def handle_telegram_reply(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    msg = update.message
    if not msg or not msg.reply_to_message:
        return

    original_msg_id = str(msg.reply_to_message.message_id)
    their_comment_id = sheets.find_their_comment_id(original_msg_id)
    if not their_comment_id:
        return

    try:
        threads.reply(their_comment_id, msg.text)
        sheets.update_reply_map_status(original_msg_id, 'replied')
        await msg.reply_text('✅ Опубліковано')
        log.info(f"Published reply to {their_comment_id}")
    except Exception as e:
        await msg.reply_text(f'❌ Помилка: {e}')
        log.error(f"Failed to publish reply: {e}")


async def main() -> None:
    app = (
        Application.builder()
        .token(cfg.telegram_bot_token)
        .build()
    )
    app.add_handler(
        MessageHandler(
            filters.TEXT & filters.REPLY & filters.Chat(chat_id=int(cfg.telegram_chat_id)),
            handle_telegram_reply,
        )
    )
    async with app:
        await app.start()
        asyncio.create_task(monitor_replies())
        await app.updater.start_polling()
        await asyncio.Event().wait()


if __name__ == '__main__':
    asyncio.run(main())
