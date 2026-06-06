import re
import trafilatura

_URL_PATTERN = re.compile(r'https?://\S+')


def extract_url(text: str) -> str | None:
    match = _URL_PATTERN.search(text)
    return match.group(0) if match else None


def fetch_text(url: str) -> str | None:
    downloaded = trafilatura.fetch_url(url)
    if not downloaded:
        return None
    return trafilatura.extract(downloaded)
