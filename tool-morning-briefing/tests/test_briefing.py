from unittest.mock import MagicMock, patch

from briefing import build_prompt, generate_briefing


def test_build_prompt_includes_all_labeled_sections():
    context = {
        "hot_md": "hot content here",
        "project_current": "project details here",
        "user_profile": "profile info here",
    }
    prompt = build_prompt(context)

    assert "[USER PROFILE]" in prompt
    assert "profile info here" in prompt
    assert "[CURRENT PROJECTS & STATE — hot.md]" in prompt
    assert "hot content here" in prompt
    assert "[ACTIVE PROJECTS DETAIL]" in prompt
    assert "project details here" in prompt
    assert "Ukrainian" in prompt


def test_generate_briefing_calls_haiku_model():
    mock_client = MagicMock()
    mock_client.messages.create.return_value.content = [MagicMock(text="Брифінг готовий")]

    with patch("briefing.Anthropic", return_value=mock_client):
        result = generate_briefing("test prompt", "test-api-key")

    assert result == "Брифінг готовий"
    mock_client.messages.create.assert_called_once_with(
        model="claude-haiku-4-5-20251001",
        max_tokens=400,
        messages=[{"role": "user", "content": "test prompt"}],
    )
