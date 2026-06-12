from datetime import datetime, timezone, timedelta
import gspread

LOG_COLUMNS = ['timestamp', 'segment', 'keyword', 'post_id', 'post_text', 'our_reply_id', 'our_reply_text']
REPLY_MAP_COLUMNS = ['timestamp', 'our_reply_id', 'their_comment_id', 'commenter', 'comment_text', 'telegram_msg_id', 'status']
RESERVED_TABS = {'Log', 'Reply Map'}


class SheetsClient:
    def __init__(self, spreadsheet_id: str, credentials_path: str):
        gc = gspread.service_account(filename=credentials_path)
        self._ss = gc.open_by_key(spreadsheet_id)

    def keyword_tabs(self) -> list[tuple[str, list[str]]]:
        """Returns [(segment_name, [active_keywords])] for all non-reserved tabs."""
        result = []
        for ws in self._ss.worksheets():
            if ws.title in RESERVED_TABS:
                continue
            rows = ws.get_all_records()
            keywords = [r['keyword'] for r in rows if str(r.get('active', '')).upper() == 'TRUE']
            if keywords:
                result.append((ws.title, keywords))
        return result

    def seen_ids(self) -> set[str]:
        """Post IDs from the last 30 days."""
        cutoff = (datetime.now(timezone.utc) - timedelta(days=30)).isoformat()
        rows = self._get_or_create('Log', LOG_COLUMNS).get_all_records()
        return {r['post_id'] for r in rows if r.get('timestamp', '') >= cutoff}

    def replies_today(self) -> int:
        today = datetime.now(timezone.utc).date().isoformat()
        rows = self._get_or_create('Log', LOG_COLUMNS).get_all_records()
        return sum(1 for r in rows if r.get('timestamp', '').startswith(today))

    def append_log(self, segment: str, keyword: str, post_id: str,
                   post_text: str, our_reply_id: str, our_reply_text: str) -> None:
        ws = self._get_or_create('Log', LOG_COLUMNS)
        ws.append_row([
            datetime.now(timezone.utc).isoformat(),
            segment, keyword, post_id, post_text, our_reply_id, our_reply_text,
        ])

    def our_reply_ids_last_7_days(self) -> list[str]:
        cutoff = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat()
        rows = self._get_or_create('Log', LOG_COLUMNS).get_all_records()
        return [r['our_reply_id'] for r in rows
                if r.get('timestamp', '') >= cutoff and r.get('our_reply_id')]

    def known_their_comment_ids(self) -> set[str]:
        rows = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS).get_all_records()
        return {r['their_comment_id'] for r in rows if r.get('their_comment_id')}

    def append_reply_map(self, our_reply_id: str, their_comment_id: str,
                         commenter: str, comment_text: str, telegram_msg_id: int) -> None:
        ws = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS)
        ws.append_row([
            datetime.now(timezone.utc).isoformat(),
            our_reply_id, their_comment_id, commenter, comment_text,
            str(telegram_msg_id),  # stored as string for sheet lookup
            'pending',
        ])

    def find_their_comment_id(self, telegram_msg_id: str) -> str | None:
        # telegram_msg_id passed as str; internally already converted from int by caller
        rows = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS).get_all_records()
        for r in rows:
            if str(r.get('telegram_msg_id', '')) == str(telegram_msg_id):
                return r.get('their_comment_id')
        return None

    def update_reply_map_status(self, telegram_msg_id: str, status: str) -> None:
        ws = self._get_or_create('Reply Map', REPLY_MAP_COLUMNS)
        rows = ws.get_all_records()
        for i, r in enumerate(rows, start=2):
            if str(r.get('telegram_msg_id', '')) == str(telegram_msg_id):
                col_idx = REPLY_MAP_COLUMNS.index('status') + 1
                ws.update_cell(i, col_idx, status)
                return

    def _get_or_create(self, name: str, columns: list[str]):
        try:
            return self._ss.worksheet(name)
        except gspread.WorksheetNotFound:
            ws = self._ss.add_worksheet(name, rows=1000, cols=len(columns))
            ws.append_row(columns)
            return ws
