from unittest.mock import patch, MagicMock
from url_fetcher import extract_url, fetch_text


def test_extract_url_finds_url():
    text = "Interesting article https://example.com/article check it out"
    assert extract_url(text) == "https://example.com/article"


def test_extract_url_returns_none_when_no_url():
    assert extract_url("just plain text with no links") is None


def test_extract_url_with_only_url():
    assert extract_url("https://t.me/channel/123") == "https://t.me/channel/123"


def test_fetch_text_returns_extracted_content():
    with patch("url_fetcher.trafilatura.fetch_url") as mock_fetch, \
         patch("url_fetcher.trafilatura.extract") as mock_extract:
        mock_fetch.return_value = "<html>page content</html>"
        mock_extract.return_value = "Extracted article text here."
        result = fetch_text("https://example.com")
        assert result == "Extracted article text here."
        mock_fetch.assert_called_once_with("https://example.com")


def test_fetch_text_returns_none_when_fetch_fails():
    with patch("url_fetcher.trafilatura.fetch_url") as mock_fetch:
        mock_fetch.return_value = None
        result = fetch_text("https://example.com")
        assert result is None


def test_fetch_text_returns_none_when_extract_fails():
    with patch("url_fetcher.trafilatura.fetch_url") as mock_fetch, \
         patch("url_fetcher.trafilatura.extract") as mock_extract:
        mock_fetch.return_value = "<html>page</html>"
        mock_extract.return_value = None
        result = fetch_text("https://example.com")
        assert result is None
