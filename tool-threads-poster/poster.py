import os
import time
from datetime import datetime, timezone

from dotenv import load_dotenv

from notifier import send_alert
from sheets_client import SheetsClient
from threads_client import ThreadsAPIError, ThreadsAuthError, ThreadsClient

COMMENT_DELAY_SECONDS = 120
MAX_RETRIES = 3


def run() -> None:
    load_dotenv("config.env")

    threads = ThreadsClient(os.environ["THREADS_ACCESS_TOKEN"])
    sheets = SheetsClient(
        os.environ["GOOGLE_CREDENTIALS_PATH"],
        os.environ["SPREADSHEET_ID"],
    )
    tg_token = os.environ["TELEGRAM_TOKEN"]
    tg_chat = os.environ["TELEGRAM_CHAT_ID"]

    due_rows = sheets.get_due_rows(datetime.now(timezone.utc))

    for row in due_rows:
        row_index = row["_row"]
        retry_count = int(row.get("retry_count", 0))
        post_text = row.get("post_text", "")
        first_comment = row.get("first_comment", "")

        if not post_text:
            sheets.update_row(row_index, status="failed", error="post_text is empty")
            send_alert(tg_token, tg_chat, f"⚠️ Threads: row {row_index} skipped — post_text is empty")
            continue

        try:
            post_id = threads.create_post(post_text)
        except ThreadsAuthError as e:
            sheets.update_row(row_index, status="auth_error", error=str(e))
            send_alert(tg_token, tg_chat, f"Threads: token expired\n{e}")
            return
        except ThreadsAPIError as e:
            new_retry = retry_count + 1
            if new_retry >= MAX_RETRIES:
                sheets.update_row(row_index, status="failed", error=str(e), retry_count=new_retry)
            else:
                sheets.update_row(row_index, error=str(e), retry_count=new_retry)
            send_alert(tg_token, tg_chat, f"Threads: post failed (attempt {new_retry})\n{e}")
            continue

        time.sleep(COMMENT_DELAY_SECONDS)

        posted_at = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
        try:
            threads.create_reply(post_id, first_comment)
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
            send_alert(tg_token, tg_chat, f"Threads: post published, comment failed\n{e}")


if __name__ == "__main__":
    run()
