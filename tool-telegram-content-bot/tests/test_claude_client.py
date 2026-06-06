from unittest.mock import MagicMock, patch
from config import Config
from claude_client import ClaudeClient

FAKE_CONFIG = Config(
    telegram_bot_token="x",
    anthropic_api_key="test-key",
    notion_api_key="x",
    notion_database_id="x",
    allowed_user_id=123,
)


def _make_response(text: str):
    response = MagicMock()
    response.content = [MagicMock(text=text)]
    return response


def test_generate_post_calls_api_and_returns_text():
    with patch("claude_client.anthropic.Anthropic") as MockAnthropic:
        mock_client = MockAnthropic.return_value
        mock_client.messages.create.return_value = _make_response("Generated post text")
        client = ClaudeClient(FAKE_CONFIG)
        result = client.generate_post("interesting AI news", "Threads")
        assert result == "Generated post text"
        call_kwargs = mock_client.messages.create.call_args.kwargs
        assert call_kwargs["model"] == "claude-sonnet-4-6"
        assert any("Threads" in str(m) for m in call_kwargs["messages"])
        assert any("interesting AI news" in str(m) for m in call_kwargs["messages"])


def test_revise_post_includes_previous_draft_and_feedback():
    with patch("claude_client.anthropic.Anthropic") as MockAnthropic:
        mock_client = MockAnthropic.return_value
        mock_client.messages.create.return_value = _make_response("Revised post")
        client = ClaudeClient(FAKE_CONFIG)
        result = client.revise_post(
            source_text="AI news",
            platform="Threads",
            previous_draft="First draft",
            feedback="Make it shorter",
        )
        assert result == "Revised post"
        messages = mock_client.messages.create.call_args.kwargs["messages"]
        message_texts = [str(m) for m in messages]
        combined = " ".join(message_texts)
        assert "First draft" in combined
        assert "Make it shorter" in combined
