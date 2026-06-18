from unittest.mock import MagicMock, call, patch
import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from threads_client import ThreadsAPIError, ThreadsAuthError
from poster import parse_thread_parts, split_into_parts


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
# parse_thread_parts unit tests
# ---------------------------------------------------------------------------

def test_parse_thread_inline_markers():
    text = "t1 Хук поста\nt2 Основний текст\nt3 Закриття"
    parts = parse_thread_parts(text)
    assert parts == ["Хук поста", "Основний текст", "Закриття"]


def test_parse_thread_block_markers():
    text = "t1\nХук поста\n\nt2\nОсновний текст\n\nt3\nЗакриття"
    parts = parse_thread_parts(text)
    assert parts == ["Хук поста", "Основний текст", "Закриття"]


def test_parse_thread_multiline_part():
    text = "t1 Хук\nt2 Рядок перший\nРядок другий\nt3 Фінал"
    parts = parse_thread_parts(text)
    assert parts == ["Хук", "Рядок перший\nРядок другий", "Фінал"]


def test_parse_thread_strips_single_marker():
    assert parse_thread_parts("t1 Тільки один блок") == ["Тільки один блок"]


def test_parse_thread_returns_none_for_regular_post():
    assert parse_thread_parts("Звичайний пост без маркерів") is None


def test_parse_thread_strips_markers_from_output():
    text = "t1 Частина один\nt2 Частина два"
    parts = parse_thread_parts(text)
    assert all("t1" not in p and "t2" not in p for p in parts)


def test_parse_thread_case_insensitive():
    text = "T1 Перша\nT2 Друга"
    parts = parse_thread_parts(text)
    assert parts == ["Перша", "Друга"]


def test_parse_thread_double_digit_markers():
    parts = parse_thread_parts("t1 A\nt2 B\nt10 C\nt11 D")
    assert len(parts) == 4
    assert parts[2] == "C"
    assert parts[3] == "D"


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
    assert mock_alert.call_count == 2  # "post published" + "comment failed"


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
# Multi-part posts (text auto-splits into 2+ parts)
# ---------------------------------------------------------------------------

def _long_two_part_text():
    s1 = "A" * 489 + "."
    s2 = "B" * 489 + "."
    return s1 + " " + s2, s1, s2


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_multipart_posts_continuation_then_comment(
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

    mock_threads.create_post.assert_called_once_with(part1)
    assert mock_threads.create_reply.call_args_list == [
        call("post_123", part2),
        call("reply_456", "Comment"),
    ]
    assert mock_sleep.call_args_list == [call(10), call(120)]
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
    mock_sleep.assert_called_once_with(10)
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


# ---------------------------------------------------------------------------
# Explicit thread via t1/t2/... markers in post_text
# ---------------------------------------------------------------------------

@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_thread_markers_post_as_chain(
    mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch
):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_1"
    mock_threads.create_reply.side_effect = ["post_2", "post_3"]
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    text = "t1 Хук поста\nt2 Основний текст\nt3 Фінал"
    mock_sheets.get_due_rows.return_value = [_due_row(post_text=text, first_comment="")]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    mock_threads.create_post.assert_called_once_with("Хук поста")
    assert mock_threads.create_reply.call_args_list == [
        call("post_1", "Основний текст"),
        call("post_2", "Фінал"),
    ]
    kw = mock_sheets.update_row.call_args[1]
    assert kw["status"] == "posted"


@patch("poster.load_dotenv")
@patch("poster.time.sleep")
@patch("poster.send_alert")
@patch("poster.SheetsClient")
@patch("poster.ThreadsClient")
def test_thread_markers_strips_labels_from_published_text(
    mock_tc, mock_sc, mock_alert, mock_sleep, mock_dotenv, monkeypatch
):
    _setup_env(monkeypatch)
    mock_threads = MagicMock()
    mock_threads.create_post.return_value = "post_1"
    mock_threads.create_reply.return_value = "post_2"
    mock_tc.return_value = mock_threads
    mock_sheets = MagicMock()
    text = "t1 Перша частина\nt2 Друга частина"
    mock_sheets.get_due_rows.return_value = [_due_row(post_text=text, first_comment="")]
    mock_sc.return_value = mock_sheets

    from poster import run
    run()

    published_root = mock_threads.create_post.call_args[0][0]
    assert "t1" not in published_root
    assert "t2" not in published_root
    assert published_root == "Перша частина"
