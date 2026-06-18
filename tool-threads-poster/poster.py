import argparse
import os
import re
import sys
import time
from datetime import datetime, timezone

from dotenv import load_dotenv

from notifier import send_alert
from sheets_client import SheetsClient
from threads_client import ThreadsAPIError, ThreadsAuthError, ThreadsClient

COMMENT_DELAY_SECONDS = 120
THREAD_PART_DELAY_SECONDS = 10
MAX_RETRIES = 3
MAX_CHARS = 500


def parse_thread_parts(text: str) -> list[str] | None:
    """Split post_text into thread parts using t1/t2/... markers.

    Supports both inline and block format:
        t1 Hook text here
        t2 Second part

        t1
        Hook text here

        t2
        Second part

    Returns list of clean parts (markers stripped) if 2+ found, else None.
    """
    text = text.strip()
    if not re.search(r'^t\d+', text, flags=re.MULTILINE | re.IGNORECASE):
        return None
    parts = re.split(r'^t\d+[ \t]*\n?', text, flags=re.MULTILINE | re.IGNORECASE)
    parts = [p.strip() for p in parts if p.strip()]
    return parts or None


def split_into_parts(text: str, max_chars: int = MAX_CHARS) -> list[str]:
    text = text.strip()
    if len(text) <= max_chars:
        return [text]

    split_positions = [m.end() for m in re.finditer(r'[.!?]\s+', text)]

    parts = []
    start = 0

    while start < len(text):
        remaining = text[start:]
        if len(remaining) <= max_chars:
            parts.append(remaining.strip())
            break

        end = start + max_chars
        best = None
        for pos in split_positions:
            if start < pos <= end:
                best = pos

        if best:
            parts.append(text[start:best].rstrip())
            start = best
        else:
            cut = text[start:end].rfind(" ")
            if cut > 0:
                parts.append(text[start:start + cut])
                start = start + cut + 1
            else:
                parts.append(text[start:end])
                start = end

    return parts or [text]


def build_notification(account: str, scheduled_time: str, status: str, detail: str = "") -> str:
    lines = [
        f"Threads Poster ({account})",
        f"Post planned at {scheduled_time}",
        f"Status: {status}" + (" ✅" if status == "posted" else ""),
    ]
    if detail:
        lines.append(detail)
    return "\n".join(lines)


def run(config_path: str = "config.env", sheet_tab: str = "monetizer-biz") -> None:
    load_dotenv(config_path)

    threads = ThreadsClient(os.environ["THREADS_ACCESS_TOKEN"])
    sheets = SheetsClient(
        os.environ["GOOGLE_CREDENTIALS_PATH"],
        os.environ["SPREADSHEET_ID"],
        sheet_tab=sheet_tab,
    )
    tg_token = os.environ["TELEGRAM_TOKEN"]
    tg_chat = os.environ["TELEGRAM_CHAT_ID"]

    due_rows = sheets.get_due_rows(datetime.now(timezone.utc))

    for row in due_rows:
        row_index = row["_row"]
        retry_count = int(row.get("retry_count") or 0)
        post_text = row.get("post_text", "").replace("—", "-")
        first_comment = row.get("first_comment", "").replace("—", "-")
        scheduled_time = row.get("scheduled_time", "")

        if not post_text:
            sheets.update_row(row_index, status="failed", error="post_text is empty")
            send_alert(tg_token, tg_chat, build_notification(sheet_tab, scheduled_time, "failed", "post_text is empty"))
            continue

        parts = parse_thread_parts(post_text) or split_into_parts(post_text)

        # Post first part
        try:
            post_id = threads.create_post(parts[0])
        except ThreadsAuthError as e:
            sheets.update_row(row_index, status="auth_error", error=str(e))
            send_alert(tg_token, tg_chat, build_notification(sheet_tab, scheduled_time, "auth_error", str(e)))
            return
        except ThreadsAPIError as e:
            new_retry = retry_count + 1
            if new_retry >= MAX_RETRIES:
                sheets.update_row(row_index, status="failed", error=str(e), retry_count=new_retry)
            else:
                sheets.update_row(row_index, error=str(e), retry_count=new_retry)
            send_alert(tg_token, tg_chat, build_notification(sheet_tab, scheduled_time, f"failed (attempt {new_retry})", str(e)))
            continue

        last_id = post_id
        for part in parts[1:]:
            time.sleep(THREAD_PART_DELAY_SECONDS)
            try:
                last_id = threads.create_reply(last_id, part)
            except (ThreadsAuthError, ThreadsAPIError) as e:
                sheets.update_row(row_index, status="posted_partial", post_id=post_id, error=str(e))
                send_alert(tg_token, tg_chat, build_notification(sheet_tab, scheduled_time, "posted_partial", str(e)))
                break
        else:
            # All parts posted
            send_alert(tg_token, tg_chat, build_notification(sheet_tab, scheduled_time, "post published ✅"))

            # Wait and post engagement comment
            time.sleep(COMMENT_DELAY_SECONDS)

            posted_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
            if first_comment:
                try:
                    threads.create_reply(last_id, first_comment)
                    sheets.update_row(
                        row_index,
                        status="posted",
                        posted_at=posted_at,
                        post_id=post_id,
                        error="",
                    )
                    send_alert(tg_token, tg_chat, build_notification(sheet_tab, scheduled_time, "comment published ✅"))
                except (ThreadsAuthError, ThreadsAPIError) as e:
                    sheets.update_row(
                        row_index,
                        status="posted_no_comment",
                        posted_at=posted_at,
                        post_id=post_id,
                        error=str(e),
                    )
                    send_alert(tg_token, tg_chat, build_notification(sheet_tab, scheduled_time, "comment failed", str(e)))
            else:
                sheets.update_row(
                    row_index,
                    status="posted",
                    posted_at=posted_at,
                    post_id=post_id,
                    error="",
                )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="config.env", help="Path to .env config file")
    parser.add_argument("--account", default="monetizer-biz", help="Account slug (used as sheet tab name)")
    args = parser.parse_args()
    run(config_path=args.config, sheet_tab=args.account)
