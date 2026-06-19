# tool-morning-briefing/briefing.py
import argparse
import os
import subprocess
from datetime import date, timedelta

from dotenv import load_dotenv

from clickup_client import (
    get_tasks_closed_today,
    get_tasks_closed_this_week,
    get_tasks_created_this_week,
    get_tasks_created_today,
    get_tasks_due_today,
)
from formatter import format_evening, format_morning, format_weekly
from prompts import (
    SYSTEM_PROMPT,
    build_evening_prompt,
    build_morning_prompt,
    build_weekly_prompt,
)
from reader import extract_current_focus, read_context
from sender import send_error_alert, send_telegram
from state import (
    extract_commitment,
    load_state,
    load_weekly_rate,
    save_state,
    save_weekly_rate,
)

CLAUDE_PATH = "/Users/artem/.local/bin/claude"


def generate_briefing(prompt: str) -> str:
    full_prompt = f"{SYSTEM_PROMPT}\n\n{prompt}"
    result = subprocess.run(
        [CLAUDE_PATH, "--print", full_prompt],
        capture_output=True,
        text=True,
        timeout=60,
    )
    if result.returncode != 0:
        raise RuntimeError(
            f"Claude CLI error (rc={result.returncode}):\n"
            f"stderr: {result.stderr.strip()}\n"
            f"stdout: {result.stdout.strip()}"
        )
    return result.stdout.strip()


def _clickup_env() -> tuple[str, str]:
    return os.environ.get("CLICKUP_TOKEN", ""), os.environ.get("CLICKUP_TEAM_ID", "")


def run_morning(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    cu_token, cu_team = _clickup_env()
    yesterday = today - timedelta(days=1)

    evening_state = load_state("evening", yesterday)
    yesterday_commitment = (
        extract_commitment(evening_state) if evening_state else "Немає (перший день)"
    )

    hot_md_text = read_context(
        hot_md_path=os.environ["HOT_MD_PATH"],
        project_current_path=os.environ["PROJECT_CURRENT_PATH"],
        user_profile_path=os.environ["USER_PROFILE_PATH"],
    )["hot_md"]
    hot_focus = extract_current_focus(hot_md_text)

    due_today = get_tasks_due_today(cu_token, cu_team) if cu_token else []
    prompt = build_morning_prompt(today, yesterday_commitment, due_today, hot_focus)
    text = generate_briefing(prompt)
    save_state("morning", today, text)

    message = format_morning(text, today, due_today)
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


def run_evening(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    cu_token, cu_team = _clickup_env()
    morning_state = load_state("morning", today) or "Ранковий бріф не знайдено"

    closed_today = get_tasks_closed_today(cu_token, cu_team) if cu_token else []
    created_today = get_tasks_created_today(cu_token, cu_team) if cu_token else []

    prompt = build_evening_prompt(today, morning_state, closed_today)
    text = generate_briefing(prompt)
    save_state("evening", today, text)

    message = format_evening(text, today, closed_today, len(created_today))
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


def run_weekly(today: date, token: str, chat_id: str, dry_run: bool) -> None:
    cu_token, cu_team = _clickup_env()
    closed = get_tasks_closed_this_week(cu_token, cu_team) if cu_token else []
    created = get_tasks_created_this_week(cu_token, cu_team) if cu_token else []
    closed_count, created_count = len(closed), len(created)
    total = closed_count + created_count
    rate = round(closed_count / total * 100) if total else 0

    iso = today.isocalendar()
    year, week = iso[0], iso[1]
    prev_week = week - 1 if week > 1 else 52
    prev_year = year if week > 1 else year - 1
    prev_rate = load_weekly_rate(prev_year, prev_week)

    prompt = build_weekly_prompt(today, closed_count, created_count, rate, prev_rate)
    text = generate_briefing(prompt)
    save_weekly_rate(year, week, float(rate))

    message = format_weekly(text, today, closed_count, created_count, rate)
    if dry_run:
        print(message)
    else:
        send_telegram(token, chat_id, message)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--type", choices=["morning", "evening", "weekly"], default="morning")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    load_dotenv("config.env")
    token = os.environ["TELEGRAM_TOKEN"]
    chat_id = os.environ["TELEGRAM_CHAT_ID"]
    briefing_type = args.type
    today = date.today()

    try:
        if briefing_type == "morning":
            run_morning(today, token, chat_id, args.dry_run)
        elif briefing_type == "evening":
            run_evening(today, token, chat_id, args.dry_run)
        elif briefing_type == "weekly":
            run_weekly(today, token, chat_id, args.dry_run)
    except Exception as e:
        send_error_alert(token, chat_id, f"{briefing_type.capitalize()} briefing failed: {e}")
        raise


if __name__ == "__main__":
    main()
