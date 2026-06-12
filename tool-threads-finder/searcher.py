import sys
import logging
from datetime import datetime, timezone, timedelta

from config import load_config
from sheets_client import SheetsClient
from threads_client import ThreadsClient
from claude_client import ClaudeClient

MAX_REPLIES_PER_DAY = 8
MAX_POST_AGE_HOURS = 3
MIN_POST_LENGTH = 40

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)


def run() -> None:
    cfg = load_config()

    try:
        sheets = SheetsClient(cfg.sheets_id, cfg.credentials_path)
        seen = sheets.seen_ids()
        today_count = sheets.replies_today()
    except Exception as e:
        log.error(f"Sheets load failed: {e} — exiting without posting")
        sys.exit(1)

    if today_count >= MAX_REPLIES_PER_DAY:
        log.info(f"Daily cap reached ({today_count}/{MAX_REPLIES_PER_DAY})")
        return

    threads = ThreadsClient(cfg.threads_token)
    claude = ClaudeClient(cfg.anthropic_key)
    cutoff = datetime.now(timezone.utc) - timedelta(hours=MAX_POST_AGE_HOURS)

    for segment, keywords in sheets.keyword_tabs():
        for keyword in keywords:
            if today_count >= MAX_REPLIES_PER_DAY:
                return

            try:
                posts = threads.search(keyword)
            except Exception as e:
                log.warning(f"Search failed for '{keyword}': {e}")
                continue

            for post in posts:
                if today_count >= MAX_REPLIES_PER_DAY:
                    return

                post_id = post.get('id', '')
                text = post.get('text', '')

                if post_id in seen:
                    continue
                if len(text) < MIN_POST_LENGTH:
                    continue
                try:
                    ts = post.get('timestamp', '')
                    post_time = datetime.fromisoformat(ts.replace('Z', '+00:00'))
                    if post_time < cutoff:
                        continue
                except (ValueError, AttributeError):
                    continue

                try:
                    reply_text = claude.generate_reply(segment, text)
                    our_reply_id = threads.reply(post_id, reply_text)
                    sheets.append_log(segment, keyword, post_id, text, our_reply_id, reply_text)
                    seen.add(post_id)
                    today_count += 1
                    log.info(f"Replied [{segment}] {post_id} — {reply_text[:60]}...")
                except Exception as e:
                    log.warning(f"Failed to reply to {post_id}: {e}")


if __name__ == '__main__':
    run()
