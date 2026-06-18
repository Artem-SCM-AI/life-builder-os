"""
10x Talent Portal → Notion scraper
Fetches all missions and pushes them to Notion database.
"""

import json
import os
import re
import sys
from datetime import datetime, timezone

import requests
from dotenv import load_dotenv
from notion_client import Client
from notion_client.errors import APIResponseError

load_dotenv()

BEARER_TOKEN = os.environ.get("BEARER_TOKEN", "")
CONTRACTOR_ID = os.environ.get("CONTRACTOR_ID", "")
NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
NOTION_DATABASE_ID = os.environ.get("NOTION_DATABASE_ID", "")
API_BASE = "https://web-api.10x.team"

HEADERS = {
    "Authorization": f"Bearer {BEARER_TOKEN}",
    "Content-Type": "application/json",
    "Accept": "application/json",
}


def strip_html(text: str) -> str:
    """Remove HTML tags from description."""
    if not text:
        return ""
    return re.sub(r"<[^>]+>", " ", text).strip()[:2000]


def fetch_missions() -> list[dict]:
    """Fetch all missions from 10x API."""
    url = f"{API_BASE}/contractors/{CONTRACTOR_ID}/missions?q=1"
    print(f"[API] Fetching: {url}")

    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
    except requests.RequestException as e:
        print(f"[ERROR] Network error: {e}")
        sys.exit(1)

    if resp.status_code == 401:
        print("[ERROR] 401 — токен протух. Відкрий DevTools і скопіюй новий Bearer token.")
        sys.exit(1)

    if resp.status_code == 403:
        print("[ERROR] 403 — перевір CONTRACTOR_ID у .env")
        sys.exit(1)

    if resp.status_code != 200:
        print(f"[ERROR] API повернув {resp.status_code}: {resp.text[:300]}")
        sys.exit(1)

    data = resp.json()
    missions = data.get("contractorMissions", [])
    print(f"[API] Отримано місій: {len(missions)}")
    return missions


def normalize(m: dict) -> dict:
    """Convert raw API mission to clean Notion-ready dict."""
    mission_id = str(m.get("id", ""))

    invitation = m.get("invitation") or {}
    application = m.get("application") or {}
    is_invited = bool(invitation) if invitation else False
    is_applied = bool(application) if application else False

    compensation = m.get("compensationTierSummary") or ""
    effort = m.get("effortHours")
    effort_str = f"{effort}h/week" if effort else ""

    workplace = m.get("workplaceType") or ""
    location = m.get("locationName") or m.get("country") or ""
    employment = m.get("employmentType") or ""
    cluster = m.get("cluster") or m.get("departmentName") or ""
    role = m.get("role") or ""

    description_raw = m.get("description") or m.get("whyWeNeedYou") or ""
    description = strip_html(description_raw)

    return {
        "id": mission_id,
        "title": str(m.get("title", ""))[:200],
        "company": str(m.get("employerName", ""))[:200],
        "role": role[:100],
        "cluster": cluster[:100],
        "location": location[:100],
        "workplace": workplace[:100],
        "employment": employment[:100],
        "compensation": compensation[:200],
        "effort": effort_str[:50],
        "is_invited": is_invited,
        "is_applied": is_applied,
        "is_match": bool(m.get("isMatch")),
        "description": description,
        "url": f"https://talent-portal.10x.team/missions/{mission_id}",
        "date_found": datetime.now(timezone.utc).date().isoformat(),
    }


# ─── Notion ───────────────────────────────────────────────────────────────────

def get_existing_ids(notion: Client, db_id: str) -> set[str]:
    seen = set()
    cursor = None
    while True:
        kwargs = {"database_id": db_id, "page_size": 100}
        if cursor:
            kwargs["start_cursor"] = cursor
        resp = notion.databases.query(**kwargs)
        for page in resp["results"]:
            mid = (
                page["properties"]
                .get("Mission ID", {})
                .get("rich_text", [{}])[0]
                .get("text", {})
                .get("content", "")
            )
            if mid:
                seen.add(mid)
        if not resp["has_more"]:
            break
        cursor = resp["next_cursor"]
    return seen


def push_to_notion(notion: Client, db_id: str, m: dict) -> bool:
    def txt(val: str):
        return [{"text": {"content": val[:2000]}}] if val else []

    props = {
        "Title": {"title": [{"text": {"content": m["title"]}}]},
        "Mission ID": {"rich_text": txt(m["id"])},
        "Company": {"rich_text": txt(m["company"])},
        "Role": {"rich_text": txt(m["role"])},
        "Cluster": {"rich_text": txt(m["cluster"])},
        "Location": {"rich_text": txt(m["location"])},
        "Employment": {"rich_text": txt(m["employment"])},
        "Compensation": {"rich_text": txt(m["compensation"])},
        "Effort": {"rich_text": txt(m["effort"])},
        "URL": {"url": m["url"]},
        "Date Found": {"date": {"start": m["date_found"]}},
        "Status": {"select": {"name": "New"}},
        "Invited": {"checkbox": m["is_invited"]},
        "Applied": {"checkbox": m["is_applied"]},
        "AI Match": {"checkbox": m["is_match"]},
    }

    if m["workplace"]:
        props["Workplace"] = {"select": {"name": m["workplace"]}}

    if m["description"]:
        props["Description"] = {"rich_text": txt(m["description"])}

    try:
        notion.pages.create(parent={"database_id": db_id}, properties=props)
        return True
    except APIResponseError as e:
        print(f"  [Notion ERROR] {m['title'][:50]}: {e}")
        return False


# ─── Main ─────────────────────────────────────────────────────────────────────

def main():
    missing = [k for k in ["BEARER_TOKEN", "CONTRACTOR_ID", "NOTION_TOKEN", "NOTION_DATABASE_ID"]
               if not os.environ.get(k)]
    if missing:
        print(f"[ERROR] Не заповнені в .env: {', '.join(missing)}")
        sys.exit(1)

    raw = fetch_missions()
    missions = [normalize(m) for m in raw]

    notion = Client(auth=NOTION_TOKEN)
    existing = get_existing_ids(notion, NOTION_DATABASE_ID)
    print(f"[Notion] Вже є в базі: {len(existing)}")

    added = skipped = failed = 0
    for m in missions:
        if m["id"] in existing:
            skipped += 1
            continue
        if push_to_notion(notion, NOTION_DATABASE_ID, m):
            added += 1
            existing.add(m["id"])
            print(f"  ✓ {m['title'][:70]}")
        else:
            failed += 1

    print(f"\n✅ Додано: {added} | Пропущено (вже є): {skipped} | Помилок: {failed}")


if __name__ == "__main__":
    main()
