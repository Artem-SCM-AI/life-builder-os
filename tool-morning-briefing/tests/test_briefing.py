from unittest.mock import MagicMock, patch

from briefing import generate_briefing
from prompts import SYSTEM_PROMPT


def test_generate_briefing_prepends_system_prompt_and_calls_claude():
    mock_result = MagicMock()
    mock_result.returncode = 0
    mock_result.stdout = "Брифінг готовий"

    with patch("briefing.subprocess.run", return_value=mock_result) as mock_run:
        result = generate_briefing("test prompt")

    assert result == "Брифінг готовий"
    expected = f"{SYSTEM_PROMPT}\n\ntest prompt"
    mock_run.assert_called_once_with(
        ["/Users/artem/.local/bin/claude", "--print", expected],
        capture_output=True,
        text=True,
        timeout=60,
    )


def test_generate_briefing_raises_with_details_on_nonzero_exit():
    mock_result = MagicMock()
    mock_result.returncode = 1
    mock_result.stderr = "auth error"
    mock_result.stdout = ""

    with patch("briefing.subprocess.run", return_value=mock_result):
        try:
            generate_briefing("test prompt")
            assert False, "Should have raised"
        except RuntimeError as e:
            assert "rc=1" in str(e)
            assert "auth error" in str(e)
