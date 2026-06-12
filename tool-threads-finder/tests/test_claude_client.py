import pytest
from unittest.mock import MagicMock, patch


def make_mock_response(text: str):
    msg = MagicMock()
    msg.content = [MagicMock(text=text)]
    return msg


def test_generate_reply_returns_string():
    with patch('claude_client.anthropic.Anthropic') as mock_cls:
        mock_cls.return_value.messages.create.return_value = make_mock_response('Це класика. Ми автоматизували такий процес — інвойси парсяться агентом, йдуть в таблицю. Як це виглядало у вас?')
        from claude_client import ClaudeClient
        client = ClaudeClient('test-key')
        result = client.generate_reply('Ops & Finance', 'обробляю інвойси вручну кожен день')
    assert isinstance(result, str)
    assert len(result) > 0


def test_generate_reply_truncates_over_280_chars():
    long_text = 'А ' * 200  # 400 chars
    with patch('claude_client.anthropic.Anthropic') as mock_cls:
        mock_cls.return_value.messages.create.return_value = make_mock_response(long_text)
        from claude_client import ClaudeClient
        client = ClaudeClient('test-key')
        result = client.generate_reply('Owners', 'test post')
    assert len(result) <= 280


def test_generate_reply_passes_segment_and_post_to_claude():
    with patch('claude_client.anthropic.Anthropic') as mock_cls:
        mock_instance = mock_cls.return_value
        mock_instance.messages.create.return_value = make_mock_response('ok')
        from claude_client import ClaudeClient
        ClaudeClient('key').generate_reply('HR & Legal', 'переглядаю резюме вручну')
        call_kwargs = mock_instance.messages.create.call_args
        user_content = call_kwargs.kwargs['messages'][0]['content']
    assert 'HR & Legal' in user_content
    assert 'переглядаю резюме вручну' in user_content
