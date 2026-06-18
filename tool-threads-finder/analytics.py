"""
Threads Analytics → Google Sheets

Writes two tabs:
  Posts  — per-post metrics for the last 50 posts
  Daily  — account-level daily metrics for the last 28 days

Required env vars (same .env as the finder tool):
  THREADS_ACCESS_TOKEN
  GOOGLE_CREDENTIALS_JSON
  ANALYTICS_SHEET_ID       ← create a new Sheet, share with the service account email
"""

import os
import sys
import time
from datetime import datetime, timezone, timedelta

import gspread
import requests
from dotenv import load_dotenv

load_dotenv()

TOKEN = os.getenv("THREADS_ACCESS_TOKEN")
CREDENTIALS_PATH = os.getenv("GOOGLE_CREDENTIALS_JSON", "credentials.json")
SHEET_ID = os.getenv("ANALYTICS_SHEET_ID")
BASE_URL = "https://graph.threads.net/v1.0"

POSTS_HEADERS = ["Date", "Post", "Views", "Likes", "Replies", "Reposts", "Quotes", "Engagement", "Eng Rate %", "Post ID"]
DAILY_HEADERS = ["Date", "Views", "Likes", "Replies", "Reposts", "Quotes"]


# ---------------------------------------------------------------------------
# API
# ---------------------------------------------------------------------------

def _get(path: str, **params) -> dict:
    resp = requests.get(f"{BASE_URL}/{path}", params={"access_token": TOKEN, **params})
    if not resp.ok:
        raise RuntimeError(f"API error {resp.status_code}: {resp.text}")
    return resp.json()


def fetch_posts(limit: int = 50) -> list[dict]:
    data = _get("me/threads", fields="id,text,timestamp", limit=limit)
    return data.get("data", [])


def fetch_post_insights(post_id: str) -> dict:
    time.sleep(0.3)  # stay within rate limits
    data = _get(f"{post_id}/insights", metric="views,likes,replies,reposts,quotes")
    result = {}
    for item in data.get("data", []):
        name = item["name"]
        if "total_value" in item:
            result[name] = item["total_value"]["value"]
        elif "values" in item:
            result[name] = sum(v["value"] for v in item["values"])
    return result


def fetch_account_daily(days: int = 28) -> list[dict]:
    now = datetime.now(timezone.utc)
    since = int((now - timedelta(days=days)).timestamp())
    until = int(now.timestamp())
    data = _get(
        "me/threads_insights",
        metric="views,likes,replies,reposts,quotes",
        period="day",
        since=since,
        until=until,
    )
    # Pivot: {date: {metric: value}}
    by_date: dict[str, dict] = {}
    for item in data.get("data", []):
        name = item["name"]
        if "values" in item:
            for v in item["values"]:
                date = v["end_time"][:10]
                by_date.setdefault(date, {})[name] = v["value"]
        elif "total_value" in item:
            # Some metrics return a period aggregate — spread it to "all" key
            by_date.setdefault("_total", {})[name] = item["total_value"]["value"]

    rows = []
    for date in sorted(by_date.keys(), reverse=True):
        if date == "_total":
            continue
        m = by_date[date]
        rows.append({
            "date": date,
            "views": m.get("views", 0),
            "likes": m.get("likes", 0),
            "replies": m.get("replies", 0),
            "reposts": m.get("reposts", 0),
            "quotes": m.get("quotes", 0),
        })
    return rows


# ---------------------------------------------------------------------------
# Sheets
# ---------------------------------------------------------------------------

def open_or_create_tab(spreadsheet: gspread.Spreadsheet, name: str, headers: list[str]) -> gspread.Worksheet:
    try:
        ws = spreadsheet.worksheet(name)
    except gspread.WorksheetNotFound:
        ws = spreadsheet.add_worksheet(title=name, rows=2000, cols=len(headers))
        ws.append_row(headers, value_input_option="RAW")
    return ws


def upsert_rows(ws: gspread.Worksheet, rows: list[list], key_col: int = 0) -> tuple[int, int]:
    """Upsert rows by key_col value. Returns (updated, appended)."""
    existing = ws.get_all_values()
    if len(existing) <= 1:
        if rows:
            ws.append_rows(rows, value_input_option="USER_ENTERED")
        return 0, len(rows)

    key_to_row = {r[key_col]: idx + 2 for idx, r in enumerate(existing[1:]) if len(r) > key_col}
    to_update = []
    to_append = []
    for row in rows:
        key = str(row[key_col])
        if key in key_to_row:
            to_update.append((key_to_row[key], row))
        else:
            to_append.append(row)

    for row_num, values in to_update:
        ws.update(f"A{row_num}", [values], value_input_option="USER_ENTERED")

    if to_append:
        ws.append_rows(to_append, value_input_option="USER_ENTERED")

    return len(to_update), len(to_append)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main() -> None:
    if not TOKEN:
        sys.exit("Missing THREADS_ACCESS_TOKEN in .env")
    if not SHEET_ID:
        gc_tmp = gspread.service_account(filename=CREDENTIALS_PATH)
        email = gc_tmp.auth.service_account_email
        sys.exit(
            f"\nMissing ANALYTICS_SHEET_ID in .env\n"
            f"1. Create a new Google Sheet\n"
            f"2. Share it (Editor) with: {email}\n"
            f"3. Add ANALYTICS_SHEET_ID=<sheet-id> to .env\n"
        )

    gc = gspread.service_account(filename=CREDENTIALS_PATH)
    spreadsheet = gc.open_by_key(SHEET_ID)

    # --- Posts tab ---
    print("Fetching posts...")
    raw_posts = fetch_posts(50)
    posts_rows = []
    for p in raw_posts:
        ins = fetch_post_insights(p["id"])
        text = (p.get("text") or "").replace("\n", " ")[:80]
        date = (p.get("timestamp") or "")[:10]
        views = ins.get("views", 0)
        likes = ins.get("likes", 0)
        replies = ins.get("replies", 0)
        reposts = ins.get("reposts", 0)
        quotes = ins.get("quotes", 0)
        engagement = likes + replies + reposts + quotes
        eng_rate = round(engagement / views * 100, 2) if views else 0.0
        posts_rows.append([date, text, views, likes, replies, reposts, quotes, engagement, eng_rate, p["id"]])

    posts_rows.sort(key=lambda r: r[0], reverse=True)

    ws_posts = open_or_create_tab(spreadsheet, "Posts", POSTS_HEADERS)
    upd, app = upsert_rows(ws_posts, posts_rows, key_col=9)  # Post ID is last col
    print(f"  Posts: {upd} updated, {app} added")

    # --- Daily tab ---
    print("Fetching account daily insights...")
    daily_rows = fetch_account_daily(28)
    daily_table = [[r["date"], r["views"], r["likes"], r["replies"], r["reposts"], r["quotes"]] for r in daily_rows]

    ws_daily = open_or_create_tab(spreadsheet, "Daily", DAILY_HEADERS)
    upd, app = upsert_rows(ws_daily, daily_table, key_col=0)  # Date is key
    print(f"  Daily: {upd} updated, {app} added")

    print("\nDone.")


if __name__ == "__main__":
    main()
