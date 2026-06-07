from unittest.mock import MagicMock, patch
from datetime import datetime, timezone
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from sheets_client import SheetsClient


HEADERS = [
    "scheduled_time", "timezone", "post_text", "first_comment",
    "status", "posted_at", "post_id", "error", "retry_count"
]


def _make_client(records):
    with patch("sheets_client.gspread.service_account") as mock_gc:
        mock_sheet = MagicMock()
        mock_sheet.get_all_records.return_value = records
        mock_sheet.row_values.return_value = HEADERS
        mock_gc.return_value.open_by_key.return_value.sheet1 = mock_sheet
        client = SheetsClient("creds.json", "sheet_id")
        client._sheet = mock_sheet
        return client, mock_sheet


def _row(status="pending", retry_count=0, time="2026-06-08 07:00", tz="ET"):
    return {
        "scheduled_time": time, "timezone": tz,
        "post_text": "Hello", "first_comment": "Comment",
        "status": status, "posted_at": "", "post_id": "",
        "error": "", "retry_count": retry_count,
    }


# 12:00 UTC = 08:00 ET (EDT, UTC-4)
NOW = datetime(2026, 6, 8, 12, 0, tzinfo=timezone.utc)


def test_returns_due_pending_row():
    client, _ = _make_client([_row()])
    due = client.get_due_rows(NOW)
    assert len(due) == 1
    assert due[0]["post_text"] == "Hello"


def test_skips_already_posted_row():
    client, _ = _make_client([_row(status="posted")])
    assert client.get_due_rows(NOW) == []


def test_skips_row_with_max_retries():
    client, _ = _make_client([_row(retry_count=3)])
    assert client.get_due_rows(NOW) == []


def test_skips_future_row():
    client, _ = _make_client([_row(time="2026-06-08 20:00")])
    assert client.get_due_rows(NOW) == []


def test_kyiv_timezone_conversion():
    # 16:00 Kyiv (UTC+3) = 13:00 UTC — not yet due at NOW (12:00 UTC)
    client, _ = _make_client([_row(time="2026-06-08 16:00", tz="Kyiv")])
    assert client.get_due_rows(NOW) == []


def test_row_includes_row_index():
    client, _ = _make_client([_row()])
    due = client.get_due_rows(NOW)
    assert due[0]["_row"] == 2


def test_update_row_sets_cell():
    client, mock_sheet = _make_client([])
    client.update_row(2, status="posted", post_id="abc123")
    calls = mock_sheet.update_cell.call_args_list
    updated_fields = {call[0][2] for call in calls}
    assert "posted" in updated_fields
    assert "abc123" in updated_fields
