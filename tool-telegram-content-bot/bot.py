import re
import logging
from telegram import Update, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import (
    Application,
    CommandHandler,
    MessageHandler,
    CallbackQueryHandler,
    ConversationHandler,
    filters,
    ContextTypes,
)
from config import load_config
from state import ConversationState, load_state, save_state, clear_state
from url_fetcher import extract_url, fetch_text
from claude_client import ClaudeClient
from notion_client_wrapper import NotionClientWrapper

logging.basicConfig(level=logging.INFO)

# Conversation states
AWAITING_APPROVAL = 0
AWAITING_REVISION = 1
AWAITING_DATE = 2

# Callback data constants
CB_APPROVE = "approve"
CB_REVISE = "revise"
CB_NEW_VERSION = "new_version"
CB_LINKEDIN = "linkedin"
CB_DATE_TODAY = "date_today"
CB_DATE_TOMORROW = "date_tomorrow"
CB_DATE_NONE = "date_none"

_IMPERATIVE_PATTERN = re.compile(
    r'\b(make|remove|add|change|shorten|lengthen|fix|rewrite|delete|include|exclude|'
    r'зроби|прибери|додай|зміни|скороти|видали|перепиши|включи|виключи|прибрати|зробити)\b',
    re.IGNORECASE,
)


def is_instruction(text: str) -> bool:
    if len(text) < 100:
        return True
    if _IMPERATIVE_PATTERN.search(text):
        return True
    return False


def _approval_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("✅ Approve", callback_data=CB_APPROVE),
            InlineKeyboardButton("✏️ Revise", callback_data=CB_REVISE),
        ],
        [
            InlineKeyboardButton("🔄 New version", callback_data=CB_NEW_VERSION),
            InlineKeyboardButton("🔀 LinkedIn", callback_data=CB_LINKEDIN),
        ],
    ])


def _date_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([[
        InlineKeyboardButton("📅 Сьогодні", callback_data=CB_DATE_TODAY),
        InlineKeyboardButton("📅 Завтра", callback_data=CB_DATE_TOMORROW),
        InlineKeyboardButton("📅 Без дати", callback_data=CB_DATE_NONE),
    ]])


def _extract_message_text(update: Update) -> str:
    msg = update.message
    return (msg.text or msg.caption or "").strip()


async def handle_content(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    text = _extract_message_text(update)

    if not text:
        await update.message.reply_text(
            "Я бачу тільки медіа. Надішли текст або посилання."
        )
        return ConversationHandler.END

    platform = "Threads"

    url = extract_url(text)
    if url:
        await update.message.reply_text("Знайшов посилання, отримую текст...")
        fetched = fetch_text(url)
        if fetched:
            text = fetched
        else:
            await update.message.reply_text(
                "Не вдалось отримати текст зі сторінки. Надішли текст вручну."
            )
            return ConversationHandler.END

    state = ConversationState(source_text=text, platform=platform)
    save_state(user_id, state)

    await update.message.reply_text("Генерую...")
    try:
        draft = claude.generate_post(text, platform)
    except Exception as e:
        logging.error("Claude API error: %s", e)
        await update.message.reply_text("Помилка генерації. Спробуй ще раз.")
        return ConversationHandler.END

    state.current_draft = draft
    save_state(user_id, state)

    await update.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_linkedin_content(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    args = context.args
    text = " ".join(args).strip() if args else ""

    if not text:
        await update.message.reply_text("Надішли текст після /l, наприклад: /l [текст новини]")
        return ConversationHandler.END

    state = ConversationState(source_text=text, platform="LinkedIn")
    save_state(user_id, state)

    await update.message.reply_text("Генерую LinkedIn-пост...")
    try:
        draft = claude.generate_post(text, "LinkedIn")
    except Exception as e:
        logging.error("Claude API error: %s", e)
        await update.message.reply_text("Помилка генерації. Спробуй ще раз.")
        return ConversationHandler.END

    state.current_draft = draft
    save_state(user_id, state)

    await update.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_approve(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.callback_query.answer()
    await update.callback_query.message.reply_text(
        "Коли публікувати?", reply_markup=_date_keyboard()
    )
    return AWAITING_DATE


async def handle_new_version(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    state = load_state(user_id)

    await update.callback_query.answer()
    await update.callback_query.message.reply_text("Генерую новий варіант...")

    try:
        draft = claude.generate_post(state.source_text, state.platform)
    except Exception as e:
        logging.error("Claude API error: %s", e)
        await update.callback_query.message.reply_text("Помилка генерації. Спробуй ще раз.")
        return AWAITING_APPROVAL

    state.current_draft = draft
    save_state(user_id, state)

    await update.callback_query.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_linkedin_switch(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    state = load_state(user_id)
    state.platform = "LinkedIn"
    save_state(user_id, state)

    await update.callback_query.answer()
    await update.callback_query.message.reply_text("Генерую LinkedIn-версію...")

    try:
        draft = claude.generate_post(state.source_text, "LinkedIn")
    except Exception as e:
        logging.error("Claude API error: %s", e)
        await update.callback_query.message.reply_text("Помилка генерації. Спробуй ще раз.")
        return AWAITING_APPROVAL

    state.current_draft = draft
    save_state(user_id, state)

    await update.callback_query.message.reply_text(draft, reply_markup=_approval_keyboard())
    return AWAITING_APPROVAL


async def handle_revise(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    await update.callback_query.answer()
    await update.callback_query.message.reply_text(
        "Що змінити? Або надішли свій варіант:"
    )
    return AWAITING_REVISION


async def handle_revision_input(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    claude: ClaudeClient = context.bot_data["claude"]
    state = load_state(user_id)
    text = update.message.text.strip()

    if is_instruction(text):
        await update.message.reply_text("Оновлюю...")
        try:
            new_draft = claude.revise_post(
                source_text=state.source_text,
                platform=state.platform,
                previous_draft=state.current_draft,
                feedback=text,
            )
        except Exception as e:
            logging.error("Claude API error: %s", e)
            await update.message.reply_text("Помилка генерації. Спробуй ще раз.")
            return AWAITING_REVISION
        state.revision_history.append((text, state.current_draft))
        state.current_draft = new_draft
        save_state(user_id, state)
        await update.message.reply_text(new_draft, reply_markup=_approval_keyboard())
    else:
        state.current_draft = text
        save_state(user_id, state)
        await update.message.reply_text(text, reply_markup=_approval_keyboard())

    return AWAITING_APPROVAL


async def handle_date(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    user_id = update.effective_user.id
    notion: NotionClientWrapper = context.bot_data["notion"]
    state = load_state(user_id)

    date_map = {
        CB_DATE_TODAY: ("today", "сьогодні"),
        CB_DATE_TOMORROW: ("tomorrow", "завтра"),
        CB_DATE_NONE: ("no_date", "без дати"),
    }
    callback_data = update.callback_query.data
    date_tuple = date_map.get(callback_data)
    if date_tuple is None:
        await update.callback_query.answer()
        return AWAITING_DATE
    date_choice, date_label = date_tuple

    await update.callback_query.answer()

    try:
        notion.add_to_calendar(state.current_draft, state.platform, date_choice)
        await update.callback_query.message.reply_text(
            f"Збережено в Notion ✅\nПлатформа: {state.platform}\nДата: {date_label}"
        )
    except Exception as e:
        logging.error("Notion save failed: %s", e)
        await update.callback_query.message.reply_text(
            f"Не вдалось зберегти в Notion. Ось текст — збережи вручну:\n\n{state.current_draft}"
        )

    clear_state(user_id)
    return ConversationHandler.END


async def handle_cancel(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    clear_state(update.effective_user.id)
    await update.message.reply_text("Скасовано. Надішли новий пост коли будеш готовий.")
    return ConversationHandler.END


def _build_auth_filter(allowed_user_id: int) -> filters.BaseFilter:
    return filters.User(user_id=allowed_user_id)


def main() -> None:
    config = load_config()
    auth = _build_auth_filter(config.allowed_user_id)

    app = Application.builder().token(config.telegram_bot_token).build()
    app.bot_data["claude"] = ClaudeClient(config)
    app.bot_data["notion"] = NotionClientWrapper(config)

    conv_handler = ConversationHandler(
        entry_points=[
            MessageHandler(auth & filters.TEXT & ~filters.COMMAND, handle_content),
            CommandHandler("l", handle_linkedin_content, filters=auth),
            CommandHandler("linkedin", handle_linkedin_content, filters=auth),
        ],
        states={
            AWAITING_APPROVAL: [
                CallbackQueryHandler(handle_approve, pattern=f"^{CB_APPROVE}$"),
                CallbackQueryHandler(handle_revise, pattern=f"^{CB_REVISE}$"),
                CallbackQueryHandler(handle_new_version, pattern=f"^{CB_NEW_VERSION}$"),
                CallbackQueryHandler(handle_linkedin_switch, pattern=f"^{CB_LINKEDIN}$"),
            ],
            AWAITING_REVISION: [
                MessageHandler(auth & filters.TEXT & ~filters.COMMAND, handle_revision_input),
            ],
            AWAITING_DATE: [
                CallbackQueryHandler(handle_date, pattern=r"^(date_today|date_tomorrow|date_none)$"),
            ],
        },
        fallbacks=[CommandHandler("cancel", handle_cancel, filters=auth)],
        per_user=True,
        per_chat=True,
    )

    app.add_handler(conv_handler)
    app.run_polling()


if __name__ == "__main__":
    main()
