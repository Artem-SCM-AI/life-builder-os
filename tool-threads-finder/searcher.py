import sys
import logging
from datetime import datetime, timezone, timedelta

MAX_REPLIES_PER_DAY = 8
MAX_POST_AGE_HOURS = 3
MIN_POST_LENGTH = 20

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')
log = logging.getLogger(__name__)


def _bootstrap_defaults(g: dict) -> None:
    """Populate module globals with real implementations if tests have not
    already patched them.  Called once per reload; skipped if the name is
    already present (i.e. a mock was injected by patch() before reload)."""
    if 'load_config' not in g:
        from config import load_config as _lc
        g['load_config'] = _lc
    if 'SheetsClient' not in g:
        from sheets_client import SheetsClient as _SC
        g['SheetsClient'] = _SC
    if 'ThreadsClient' not in g:
        from threads_client import ThreadsClient as _TC, ThreadsAPIError as _TAE
        g['ThreadsClient'] = _TC
        g['ThreadsAPIError'] = _TAE
    if 'ClaudeClient' not in g:
        from claude_client import ClaudeClient as _CC
        g['ClaudeClient'] = _CC


_bootstrap_defaults(globals())


def run() -> None:
    _g = globals()
    cfg = _g['load_config']()

    try:
        sheets = _g['SheetsClient'](cfg.sheets_id, cfg.credentials_path)
        seen = sheets.seen_ids()
        today_count = sheets.replies_today()
    except Exception as e:
        log.error(f"Sheets load failed: {e} — exiting without posting")
        sys.exit(1)

    if today_count >= MAX_REPLIES_PER_DAY:
        log.info(f"Daily cap reached ({today_count}/{MAX_REPLIES_PER_DAY})")
        return

    threads = _g['ThreadsClient'](cfg.threads_token)
    claude = _g['ClaudeClient'](cfg.anthropic_key)
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
