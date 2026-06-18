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


def test_generate_briefing_calls_claude_cli():
    mock_result = MagicMock()
    mock_result.returncode = 0
    mock_result.stdout = "Брифінг готовий"

    with patch("briefing.subprocess.run", return_value=mock_result) as mock_run:
        result = generate_briefing("test prompt")

    assert result == "Брифінг готовий"
    mock_run.assert_called_once_with(
        ["/Users/artem/.local/bin/claude", "--print", "test prompt"],
        capture_output=True,
        text=True,
        timeout=60,
    )


def test_generate_briefing_raises_on_nonzero_exit():
    mock_result = MagicMock()
    mock_result.returncode = 1
    mock_result.stderr = "auth error"

    with patch("briefing.subprocess.run", return_value=mock_result):
        try:
            generate_briefing("test prompt")
            assert False, "Should have raised"
        except RuntimeError as e:
            assert "auth error" in str(e)
