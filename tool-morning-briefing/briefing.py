import argparse
import os

from anthropic import Anthropic
from dotenv import load_dotenv

from reader import read_context
from sender import send_error_alert, send_telegram

PROMPT_TEMPLATE = """You are Artem's morning assistant. Generate his daily briefing in Ukrainian.

[USER PROFILE]
{user_profile}

[CURRENT PROJECTS & STATE — hot.md]
{hot_md}

[ACTIVE PROJECTS DETAIL]
{project_current}

Answer these 4 questions:
1. The ONE most important thing to do today
2. What needs action before noon and why
3. What is at risk if ignored today
4. One open decision to make before starting work

Rules:
- Max 200 words
- Ukrainian language
- Start with most urgent item
- Plain text only — no markdown, no headers
- Do not repeat project names more than once each"""


def build_prompt(context: dict) -> str:
    return PROMPT_TEMPLATE.format(**context)


def generate_briefing(prompt: str, api_key: str) -> str:
    client = Anthropic(api_key=api_key)
    message = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}],
    )
    return message.content[0].text


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true", help="Print to stdout, skip Telegram")
    args = parser.parse_args()

    load_dotenv("config.env")

    token = os.environ["TELEGRAM_TOKEN"]
    chat_id = os.environ["TELEGRAM_CHAT_ID"]
    api_key = os.environ["ANTHROPIC_API_KEY"]

    try:
        context = read_context(
            hot_md_path=os.environ["HOT_MD_PATH"],
            project_current_path=os.environ["PROJECT_CURRENT_PATH"],
            user_profile_path=os.environ["USER_PROFILE_PATH"],
        )
        prompt = build_prompt(context)
        briefing = generate_briefing(prompt, api_key)

        if args.dry_run:
            print(briefing)
        else:
            send_telegram(token, chat_id, briefing)

    except Exception as e:
        send_error_alert(token, chat_id, str(e))
        raise


if __name__ == "__main__":
    main()
