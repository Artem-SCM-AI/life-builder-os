from unittest.mock import MagicMock, call, patch
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from threads_client import ThreadsAPIError, ThreadsAuthError
from poster import split_into_parts


# ---------------------------------------------------------------------------
# split_into_parts unit tests
# ---------------------------------------------------------------------------

def test_split_short_text_returns_single_part():
    text = "Short post."
    assert split_into_parts(text) == ["Short post."]


def test_split_multiple_sentences_fit_in_one_part():
    text = "Sentence one. Sentence two. Sentence three."
    result = split_into_parts(text, max_chars=500)
    assert result == ["Sentence one. Sentence two. Sentence three."]


def test_split_splits_at_sentence_boundary():
    long_sentence = "A" * 490 + "."
    second_sentence = "B" * 100 + "."
    text = long_sentence + " " + second_sentence
    result = split_into_parts(text, max_chars=500)
    assert len(result) == 2
    assert result[0] == long_sentence
    assert result[1] == second_sentence


def test_split_falls_back_to_word_boundary_for_long_sentence():
    # Single sentence longer than max_chars — must split at word boundary
    text = ("word " * 105).strip()  # ~525 chars
    result = split_into_parts(text, max_chars=500)
    assert len(result) >= 2
    for part in result:
        assert len(part) <= 500


def test_split_three_parts():
    # Produce exactly 3 parts
    long_s = "X" * 490 + "."
    text = long_s + " " + long_s + " " + long_s
    result = split_into_parts(text, max_chars=500)
    assert len(result) == 3
    for part in result:
        assert len(part) <= 500


def test_split_empty_string_returns_original():
    result = split_into_parts("")
    assert result == [""]


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _setup_env(monkeypatch):
    monkeypatch.setenv("THREADS_ACCESS_TOKEN", "tok")
    monkeypatch.setenv("GOOGLE_CREDENTIALS_PATH", "./creds.json")
    monkeypatch.setenv("SPREADSHEET_ID", "sheet_id")
    monkeypatch.setenv("TELEGRAM_TOKEN", "tg_tok")
    monkeypatch.setenv("TELEGRAM_CHAT_ID", "chat_id")


def _due_row(**overrides):
    base = {"_row": 2, "post_text": "Hello world.", "first_comment": "Comment", "retry_count": 0}
    return {**base, **overrides}


# ---------------------------------------------------------------------------
# Single-part posts (text fits in one part)
# ---------------------------------------------------------------------------

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

    mock_threads.create_post.assert_called_once_with("Hello world.")
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
    row = _due_row(retry_count=2)
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


# ---------------------------------------------------------------------------
# Multi-part posts (text splits into 2+ parts)
# ---------------------------------------------------------------------------

def _long_two_part_text():
    # Two sentences each ~490 chars — forces split into 2 parts
    s1 = "A" * 489 + "."
    s2 = "B" * 489 + "."
    return s1 + " " + s2, s1, s2


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_multipart_posts_continuation_immediately_then_comment_after_sleep(
    mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch
):
    _setup_env(monkeypatch)
    text, part1, part2 = _long_two_part_text()
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_123"
    mock_threads.create_reply.side_effect = ["reply_456", "comment_789"]
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row(post_text=text)]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    # Part 1 posted as main post
    mock_threads.create_post.assert_called_once_with(part1)
    # Part 2 posted immediately as reply to post_123 (no sleep yet)
    # Then first_comment posted as reply to reply_456 (after sleep)
    assert mock_threads.create_reply.call_args_list == [
        call("post_123", part2),
        call("reply_456", "Comment"),
    ]
    # Sleep happens once after all parts posted
    mock_sleep.assert_called_once_with(120)
    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "posted"
    assert kw["post_id"] == "post_123"


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_posted_partial_when_continuation_reply_fails(
    mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch
):
    _setup_env(monkeypatch)
    text, part1, part2 = _long_two_part_text()
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_123"
    mock_threads.create_reply.side_effect = ThreadsAPIError("Reply failed")
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    mock_sheets.get_due_rows.return_value = [_due_row(post_text=text)]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "posted_partial"
    assert kw["post_id"] == "post_123"
    # No sleep — we broke out before the else clause
    mock_sleep.assert_not_called()
    mock_alert.assert_called_once()


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_run_passes_sheet_tab_to_sheets_client(
    mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch
):
    _setup_env(monkeypatch)
    mock_tc.return_value = MagicMock()
    mock_sc.return_value = MagicMock()
    mock_sc.return_value.get_due_rows.return_value = []

    from poster import run
    run(sheet_tab="artem-org-ua")

    _, kwargs = mock_sc.call_args
    assert kwargs.get("sheet_tab") == "artem-org-ua"
