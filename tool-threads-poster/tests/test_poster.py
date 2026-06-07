from unittest.mock import MagicMock, patch
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from threads_client import ThreadsAPIError, ThreadsAuthError


def _setup_env(monkeypatch):
    monkeypatch.setenv("THREADS_ACCESS_TOKEN", "tok")
    monkeypatch.setenv("GOOGLE_CREDENTIALS_PATH", "./creds.json")
    monkeypatch.setenv("SPREADSHEET_ID", "sheet_id")
    monkeypatch.setenv("TELEGRAM_TOKEN", "tg_tok")
    monkeypatch.setenv("TELEGRAM_CHAT_ID", "chat_id")


def _due_row():
    return {"_row": 2, "post_text": "Hello", "first_comment": "Comment", "retry_count": 0}


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_posts_and_replies(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_123"
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    mock_threads.create_post.assert_called_once_with("Hello")
    mock_sleep.assert_called_once_with(120)
    mock_threads.create_reply.assert_called_once_with("post_123", "Comment")
    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "posted"
    assert kw["post_id"] == "post_123"


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_posted_no_comment_when_reply_fails(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_123"
    mock_threads.create_reply.side_effect = ThreadsAPIError("Reply failed")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "posted_no_comment"
    mock_alert.assert_called_once()


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_increments_retry_on_post_fail(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.side_effect = ThreadsAPIError("Post failed")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    kw = mock_sheets.update_row.call_args[1]
    assert kw["retry_count"] == 1
    assert kw.get("status") != "posted"
    mock_alert.assert_called_once()


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_sets_failed_at_max_retries(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.side_effect = ThreadsAPIError("Post failed")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    row = {**_due_row(), "retry_count": 2}
    mock_sheets.get_due_rows.return_value = [row]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "failed"
    assert kw["retry_count"] == 3


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_stops_all_rows_on_auth_error(mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.side_effect = ThreadsAuthError("Token expired")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row(), _due_row()]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    assert mock_sheets.update_row.call_count == 1
    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "auth_error"
