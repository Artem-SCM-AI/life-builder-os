import requests
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

_KYIV = ZoneInfo("Europe/Kiev")


def _day_range(days_offset: int) -> tuple:
    now = datetime.now(timezone.utc)
    day = now + timedelta(days=days_offset)
    start = datetime(day.year, day.month, day.day, 0, 0, 0, tzinfo=timezone.utc)
    end = datetime(day.year, day.month, day.day, 23, 59, 59, tzinfo=timezone.utc)
    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)


def _today_range_kyiv() -> tuple[int, int]:
    now = datetime.now(_KYIV)
    start = datetime(now.year, now.month, now.day, 0, 0, 0, tzinfo=_KYIV)
    end = datetime(now.year, now.month, now.day, 23, 59, 59, tzinfo=_KYIV)
    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)


def _week_range_kyiv() -> tuple[int, int]:
    now = datetime.now(_KYIV)
    monday = now - timedelta(days=now.weekday())
    start = datetime(monday.year, monday.month, monday.day, 0, 0, 0, tzinfo=_KYIV)
    friday = start + timedelta(days=4)
    end = datetime(friday.year, friday.month, friday.day, 23, 59, 59, tzinfo=_KYIV)
    return int(start.timestamp() * 1000), int(end.timestamp() * 1000)


def _get(token: str, team_id: str, params: dict) -> list:
    resp = requests.get(
        f"https://api.clickup.com/api/v2/team/{team_id}/task",
        headers={"Authorization": token},
        params={**params, "include_closed": "true", "subtasks": "true"},
        timeout=15,
    )
    resp.raise_for_status()
    return resp.json().get("tasks", [])


def _fmt(t: dict) -> str:
    p = t.get("priority")
    priority = p.get("priority", "–") if p and isinstance(p, dict) else "–"
    due = t.get("due_date")
    due_str = datetime.fromtimestamp(int(due) / 1000, tz=timezone.utc).strftime("%m-%d") if due else "--"
    return f"• [{priority}] {t['name']} ({due_str})"


def get_tasks_due_today(token: str, team_id: str, limit: int = 15) -> list:
    start, end = _day_range(0)
    tasks = _get(token, team_id, {"due_date_gte": start, "due_date_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("due_date")
        and start <= int(t["due_date"]) <= end
        and t.get("status", {}).get("type") != "closed"
    ]
    return result[:limit]


def get_tasks_closed_yesterday(token: str, team_id: str, limit: int = 10) -> list:
    start, end = _day_range(-1)
    tasks = _get(token, team_id, {"date_updated_gte": start, "date_updated_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_done")
        and start <= int(t["date_done"]) <= end
        and t.get("status", {}).get("type") == "closed"
    ]
    return result[:limit]


def get_tasks_created_yesterday(token: str, team_id: str, limit: int = 10) -> list:
    start, end = _day_range(-1)
    # top-level tasks only (no subtasks) to avoid bulk-creation noise
    tasks = _get(token, team_id, {"date_created_gte": start, "date_created_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_created")
        and start <= int(t["date_created"]) <= end
        and not t.get("parent")
    ]
    return result[:limit]


def get_tasks_closed_today(token: str, team_id: str, limit: int = 15) -> list[str]:
    start, end = _today_range_kyiv()
    tasks = _get(token, team_id, {"date_updated_gte": start, "date_updated_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_done")
        and start <= int(t["date_done"]) <= end
        and t.get("status", {}).get("type") == "closed"
    ]
    return result[:limit]


def get_tasks_created_today(token: str, team_id: str, limit: int = 15) -> list[str]:
    start, end = _today_range_kyiv()
    tasks = _get(token, team_id, {"date_created_gte": start, "date_created_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_created")
        and start <= int(t["date_created"]) <= end
        and not t.get("parent")
    ]
    return result[:limit]


def get_tasks_closed_this_week(token: str, team_id: str, limit: int = 50) -> list[str]:
    start, end = _week_range_kyiv()
    tasks = _get(token, team_id, {"date_updated_gte": start, "date_updated_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_done")
        and start <= int(t["date_done"]) <= end
        and t.get("status", {}).get("type") == "closed"
    ]
    return result[:limit]


def get_tasks_created_this_week(token: str, team_id: str, limit: int = 50) -> list[str]:
    start, end = _week_range_kyiv()
    tasks = _get(token, team_id, {"date_created_gte": start, "date_created_lte": end})
    result = [
        _fmt(t) for t in tasks
        if t.get("date_created")
        and start <= int(t["date_created"]) <= end
        and not t.get("parent")
    ]
    return result[:limit]


def format_clickup_section(due_today: list, closed_yesterday: list, created_yesterday: list) -> str:
    parts = [
        "📋 ЗАДАЧІ НА СЬОГОДНІ\n" + ("\n".join(due_today) if due_today else "Немає"),
        "✅ ЗАКРИТО ВЧОРА\n" + ("\n".join(closed_yesterday) if closed_yesterday else "Немає"),
        "🆕 ПОСТАВЛЕНО ВЧОРА\n" + ("\n".join(created_yesterday) if created_yesterday else "Немає"),
    ]
    return "\n\n".join(parts)
