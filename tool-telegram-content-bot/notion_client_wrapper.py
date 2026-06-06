from datetime import date, timedelta
from notion_client import Client
from config import Config


class NotionClientWrapper:
    def __init__(self, config: Config) -> None:
        self._client = Client(auth=config.notion_api_key)
        self._database_id = config.notion_database_id

    def add_to_calendar(self, text: str, platform: str, date_choice: str) -> None:
        title = text[:60].strip()
        properties: dict = {
            "Post": {"title": [{"text": {"content": title}}]},
            "Content": {"rich_text": [{"text": {"content": text}}]},
            "Channel": {"select": {"name": platform}},
            "Status": {"select": {"name": "Ready"}},
        }
        resolved = _resolve_date(date_choice)
        if resolved:
            properties["Publish Date"] = {"date": {"start": resolved}}

        self._client.pages.create(
            parent={"database_id": self._database_id},
            properties=properties,
            children=[{
                "object": "block",
                "type": "paragraph",
                "paragraph": {
                    "rich_text": [{"type": "text", "text": {"content": text}}]
                },
            }],
        )


def _resolve_date(date_choice: str) -> str | None:
    today = date.today()
    if date_choice == "today":
        return today.isoformat()
    if date_choice == "tomorrow":
        return (today + timedelta(days=1)).isoformat()
    return None
