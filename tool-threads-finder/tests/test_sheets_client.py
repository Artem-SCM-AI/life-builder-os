import pytest
from unittest.mock import MagicMock, patch, call
from datetime import datetime, timezone, timedelta

@pytest.fixture
def mock_ss():
    ss = MagicMock()
    log_ws = MagicMock()
    log_ws.title = 'Log'
    reply_map_ws = MagicMock()
    reply_map_ws.title = 'Reply Map'
    sales_ws = MagicMock()
    sales_ws.title = 'Sales & Marketing'
    ss.worksheets.return_value = [sales_ws, log_ws, reply_map_ws]
    ss.worksheet.side_effect = lambda name: {
        'Log': log_ws, 'Reply Map': reply_map_ws, 'Sales & Marketing': sales_ws
    }[name]
    return ss, log_ws, reply_map_ws, sales_ws

def test_keyword_tabs_returns_active_keywords(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    sales_ws.get_all_records.return_value = [
        {'keyword': 'збираю ліди вручну', 'active': 'TRUE'},
        {'keyword': 'CRM вручну', 'active': 'FALSE'},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        tabs = client.keyword_tabs()
    assert len(tabs) == 1
    assert tabs[0][0] == 'Sales & Marketing'
    assert tabs[0][1] == ['збираю ліди вручну']

def test_seen_ids_filters_to_30_days(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    old = (datetime.now(timezone.utc) - timedelta(days=31)).isoformat()
    recent = datetime.now(timezone.utc).isoformat()
    log_ws.get_all_records.return_value = [
        {'post_id': 'old1', 'timestamp': old},
        {'post_id': 'new1', 'timestamp': recent},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        seen = client.seen_ids()
    assert 'new1' in seen
    assert 'old1' not in seen

def test_replies_today_counts_only_today(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    today = datetime.now(timezone.utc).date().isoformat()
    yesterday = (datetime.now(timezone.utc) - timedelta(days=1)).date().isoformat()
    log_ws.get_all_records.return_value = [
        {'timestamp': f'{today}T10:00:00+00:00', 'post_id': 'p1'},
        {'timestamp': f'{today}T11:00:00+00:00', 'post_id': 'p2'},
        {'timestamp': f'{yesterday}T10:00:00+00:00', 'post_id': 'p3'},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        assert client.replies_today() == 2

def test_find_their_comment_id_returns_match(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    reply_map_ws.get_all_records.return_value = [
        {'telegram_msg_id': '999', 'their_comment_id': 'tc_abc'},
    ]
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        result = client.find_their_comment_id('999')
    assert result == 'tc_abc'

def test_find_their_comment_id_returns_none_on_miss(mock_ss):
    ss, log_ws, reply_map_ws, sales_ws = mock_ss
    reply_map_ws.get_all_records.return_value = []
    with patch('sheets_client.gspread.service_account', return_value=MagicMock(open_by_key=lambda k: ss)):
        from sheets_client import SheetsClient
        client = SheetsClient('sheet_id', 'creds.json')
        assert client.find_their_comment_id('999') is None
