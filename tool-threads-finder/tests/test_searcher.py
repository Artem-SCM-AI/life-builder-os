import pytest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timezone, timedelta

def make_post(post_id='p1', text='обробляю інвойси вручну щодня', hours_ago=1):
    ts = (datetime.now(timezone.utc) - timedelta(hours=hours_ago)).strftime('%Y-%m-%dT%H:%M:%SZ')
    return {'id': post_id, 'text': text, 'timestamp': ts, 'username': 'user1'}

def run_searcher(sheets_mock, threads_mock, claude_mock):
    with patch('searcher.SheetsClient', return_value=sheets_mock), \
         patch('searcher.ThreadsClient', return_value=threads_mock), \
         patch('searcher.ClaudeClient', return_value=claude_mock), \
         patch('searcher.load_config', return_value=MagicMock()):
        import importlib, searcher
        importlib.reload(searcher)
        searcher.run()

def test_exits_early_when_daily_cap_reached():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 8
    threads = MagicMock()
    run_searcher(sheets, threads, MagicMock())
    threads.search.assert_not_called()

def test_skips_seen_post():
    sheets = MagicMock()
    sheets.seen_ids.return_value = {'p1'}
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси вручну'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1')]
    claude = MagicMock()
    run_searcher(sheets, threads, claude)
    claude.generate_reply.assert_not_called()

def test_skips_post_older_than_3_hours():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси вручну'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1', hours_ago=4)]
    claude = MagicMock()
    run_searcher(sheets, threads, claude)
    claude.generate_reply.assert_not_called()

def test_skips_post_too_short():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1', text='короткий')]
    claude = MagicMock()
    run_searcher(sheets, threads, claude)
    claude.generate_reply.assert_not_called()

def test_posts_reply_and_logs_for_qualifying_post():
    sheets = MagicMock()
    sheets.seen_ids.return_value = set()
    sheets.replies_today.return_value = 0
    sheets.keyword_tabs.return_value = [('Ops & Finance', ['інвойси вручну'])]
    threads = MagicMock()
    threads.search.return_value = [make_post('p1')]
    threads.reply.return_value = 'our_reply_id_1'
    claude = MagicMock()
    claude.generate_reply.return_value = 'Класика. Ми це автоматизували.'
    run_searcher(sheets, threads, claude)
    threads.reply.assert_called_once_with('p1', 'Класика. Ми це автоматизували.')
    sheets.append_log.assert_called_once()

def test_exits_on_sheets_load_failure():
    sheets = MagicMock()
    sheets.seen_ids.side_effect = Exception("Sheets down")
    with patch('searcher.SheetsClient', return_value=sheets), \
         patch('searcher.ThreadsClient', return_value=MagicMock()), \
         patch('searcher.ClaudeClient', return_value=MagicMock()), \
         patch('searcher.load_config', return_value=MagicMock()), \
         pytest.raises(SystemExit):
        import importlib, searcher
        importlib.reload(searcher)
        searcher.run()
