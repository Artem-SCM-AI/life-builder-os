from unittest.mock import patch
import clickup_client
from clickup_client import (
    get_tasks_closed_today,
    get_tasks_created_today,
    get_tasks_closed_this_week,
    get_tasks_created_this_week,
)

START = 1718700000000
END = 1718799999000
MID = (START + END) // 2


def _task(name, status_type, date_done=None, date_created=None, parent=None):
    return {
        "name": name,
        "status": {"type": status_type},
        "date_done": str(date_done) if date_done else None,
        "date_created": str(date_created) if date_created else None,
        "parent": parent,
        "priority": {"priority": "normal"},
        "due_date": None,
    }


def test_get_tasks_closed_today_returns_closed_in_range():
    tasks = [
        _task("Done", "closed", date_done=MID),
        _task("Open", "open"),
        _task("Old closed", "closed", date_done=START - 1),
    ]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_today_range_kyiv", return_value=(START, END)):
        result = get_tasks_closed_today("token", "team")
    assert len(result) == 1
    assert "Done" in result[0]


def test_get_tasks_created_today_excludes_subtasks():
    tasks = [
        _task("Parent", "open", date_created=MID),
        _task("Subtask", "open", date_created=MID, parent="some_id"),
    ]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_today_range_kyiv", return_value=(START, END)):
        result = get_tasks_created_today("token", "team")
    assert len(result) == 1
    assert "Parent" in result[0]


def test_get_tasks_closed_this_week_returns_closed_in_range():
    tasks = [_task("Weekly done", "closed", date_done=MID)]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_week_range_kyiv", return_value=(START, END)):
        result = get_tasks_closed_this_week("token", "team")
    assert len(result) == 1
    assert "Weekly done" in result[0]


def test_get_tasks_created_this_week_excludes_subtasks():
    tasks = [
        _task("Top", "open", date_created=MID),
        _task("Sub", "open", date_created=MID, parent="p"),
    ]
    with patch.object(clickup_client, "_get", return_value=tasks), \
         patch.object(clickup_client, "_week_range_kyiv", return_value=(START, END)):
        result = get_tasks_created_this_week("token", "team")
    assert len(result) == 1
    assert "Top" in result[0]
