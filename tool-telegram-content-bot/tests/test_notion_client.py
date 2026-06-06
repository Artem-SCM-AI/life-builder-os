from datetime import date
from unittest.mock import MagicMock, patch
from config import Config
from notion_client_wrapper import NotionClientWrapper

FAKE_CONFIG = Config(
    telegram_bot_token="x",
    anthropic_api_key="x",
    notion_api_key="test-notion-key",
    notion_database_id="test-db-id",
    allowed_user_id=123,
)

POST_TEXT = "I quit drugs at 27. On my own. No clinic. Just a decision."


def test_add_to_calendar_with_today_sets_date():
    with patch("notion_client_wrapper.Client") as MockClient:
        mock_pages = MockClient.return_value.pages
        client = NotionClientWrapper(FAKE_CONFIG)
        client.add_to_calendar(POST_TEXT, "Threads", "today")
        call_kwargs = mock_pages.create.call_args.kwargs
        props = call_kwargs["properties"]
        assert props["Status"]["select"]["name"] == "Ready"
        assert props["Channel"]["select"]["name"] == "Threads"
        assert props["Publish Date"]["date"]["start"] == date.today().isoformat()
        assert POST_TEXT[:60] in props["Post"]["title"][0]["text"]["content"]


def test_add_to_calendar_with_no_date_omits_date_property():
    with patch("notion_client_wrapper.Client") as MockClient:
        mock_pages = MockClient.return_value.pages
        client = NotionClientWrapper(FAKE_CONFIG)
        client.add_to_calendar(POST_TEXT, "LinkedIn", "no_date")
        props = mock_pages.create.call_args.kwargs["properties"]
        assert "Publish Date" not in props
        assert props["Channel"]["select"]["name"] == "LinkedIn"


def test_add_to_calendar_content_block_has_full_text():
    with patch("notion_client_wrapper.Client") as MockClient:
        mock_pages = MockClient.return_value.pages
        client = NotionClientWrapper(FAKE_CONFIG)
        client.add_to_calendar(POST_TEXT, "Threads", "no_date")
        children = mock_pages.create.call_args.kwargs["children"]
        block_text = children[0]["paragraph"]["rich_text"][0]["text"]["content"]
        assert block_text == POST_TEXT
