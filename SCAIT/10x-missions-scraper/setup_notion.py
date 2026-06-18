"""
One-time setup: creates the Notion database for 10x missions.
Run ONCE before fetch_missions.py.

Usage:
  python setup_notion.py

It will print the database ID — paste it into .env as NOTION_DATABASE_ID
"""

import os
import sys

from dotenv import load_dotenv
from notion_client import Client
from notion_client.errors import APIResponseError

load_dotenv()

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
NOTION_PARENT_PAGE_ID = os.environ.get("NOTION_PARENT_PAGE_ID", "")


def create_database(notion: Client, parent_page_id: str) -> str:
    """Create the 10x Missions database in Notion. Returns database ID."""
    db = notion.databases.create(
        parent={"type": "page_id", "page_id": parent_page_id},
        title=[{"type": "text", "text": {"content": "10x Talent Portal — Missions"}}],
        icon={"type": "emoji", "emoji": "🎯"},
        properties={
            "Title": {"title": {}},
            "Mission ID": {"rich_text": {}},
            "Company": {"rich_text": {}},
            "Role": {"rich_text": {}},
            "Cluster": {"rich_text": {}},
            "Location": {"rich_text": {}},
            "Workplace": {
                "select": {
                    "options": [
                        {"name": "remote", "color": "green"},
                        {"name": "hybrid", "color": "yellow"},
                        {"name": "onsite", "color": "orange"},
                    ]
                }
            },
            "Employment": {"rich_text": {}},
            "Compensation": {"rich_text": {}},
            "Effort": {"rich_text": {}},
            "Status": {
                "select": {
                    "options": [
                        {"name": "New", "color": "blue"},
                        {"name": "Interested", "color": "green"},
                        {"name": "Applied", "color": "yellow"},
                        {"name": "Skip", "color": "gray"},
                    ]
                }
            },
            "Invited": {"checkbox": {}},
            "Applied": {"checkbox": {}},
            "AI Match": {"checkbox": {}},
            "URL": {"url": {}},
            "Date Found": {"date": {}},
            "Description": {"rich_text": {}},
        },
    )
    return db["id"]


def main():
    if not NOTION_TOKEN:
        print("[ERROR] NOTION_TOKEN not set in .env")
        sys.exit(1)

    if not NOTION_PARENT_PAGE_ID:
        print("[ERROR] NOTION_PARENT_PAGE_ID not set in .env")
        print("        Open any Notion page and copy the ID from the URL:")
        print("        notion.so/your-workspace/THIS-IS-THE-ID?...")
        sys.exit(1)

    notion = Client(auth=NOTION_TOKEN)

    print("[INFO] Creating Notion database '10x Talent Portal — Missions'...")
    try:
        db_id = create_database(notion, NOTION_PARENT_PAGE_ID)
    except APIResponseError as e:
        print(f"[ERROR] Notion API error: {e}")
        sys.exit(1)

    print(f"\n✅ Database created!")
    print(f"\nPaste this into your .env file:")
    print(f"NOTION_DATABASE_ID={db_id}")


if __name__ == "__main__":
    main()
