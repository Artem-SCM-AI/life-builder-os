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
MAX_RETRIES = 3
MAX_CHARS = 500


def split_into_parts(text: str, max_chars: int = MAX_CHARS) -> list[str]:
    sentences = re.split(r'(?<=[.!?])\s+', text.strip())
    parts = []
    current = ""

    for sentence in sentences:
        if not sentence:
            continue
        candidate = (current + " " + sentence).strip() if current else sentence
        if len(candidate) <= max_chars:
            current = candidate
        else:
            if current:
                parts.append(current)
            # single sentence longer than max_chars — split at last space
            if len(sentence) > max_chars:
                while len(sentence) > max_chars:
                    cut = sentence[:max_chars].rfind(" ")
                    cut = cut if cut > 0 else max_chars
                    parts.append(sentence[:cut].strip())
                    sentence = sentence[cut:].strip()
            current = sentence

    if current:
        parts.append(current)

    return parts or [text]


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
        post_text = row.get("post_text", "")
        first_comment = row.get("first_comment", "")

        if not post_text:
            sheets.update_row(row_index, status="failed", error="post_text is empty")
            send_alert(tg_token, tg_chat, f"⚠️ Threads: row {row_index} skipped — post_text is empty")
            continue

        parts = split_into_parts(post_text)

        # Post first part
        try:
            post_id = threads.create_post(parts[0])
        except ThreadsAuthError as e:
            sheets.update_row(row_index, status="auth_error", error=str(e))
            send_alert(tg_token, tg_chat, f"⚠️ Threads: token expired\n{e}")
            return
        except ThreadsAPIError as e:
            new_retry = retry_count + 1
            if new_retry >= MAX_RETRIES:
                sheets.update_row(row_index, status="failed", error=str(e), retry_count=new_retry)
            else:
                sheets.update_row(row_index, error=str(e), retry_count=new_retry)
            send_alert(tg_token, tg_chat, f"⚠️ Threads: post failed (attempt {new_retry})\n{e}")
            continue

        # Post continuation parts immediately (no sleep between them)
        last_id = post_id
        for part in parts[1:]:
            try:
                last_id = threads.create_reply(last_id, part)
            except (ThreadsAuthError, ThreadsAPIError) as e:
                sheets.update_row(row_index, status="posted_partial", post_id=post_id, error=str(e))
                send_alert(tg_token, tg_chat, f"⚠️ Threads: thread continuation failed\n{e}")
                break
        else:
            # All parts posted — now wait and post engagement comment
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
                except (ThreadsAuthError, ThreadsAPIError) as e:
                    sheets.update_row(
                        row_index,
                        status="posted_no_comment",
                        posted_at=posted_at,
                        post_id=post_id,
                        error=str(e),
                    )
                    send_alert(tg_token, tg_chat, f"⚠️ Threads: post published, comment failed\n{e}")
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
