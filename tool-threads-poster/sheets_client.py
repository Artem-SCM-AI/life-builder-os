from datetime import datetime, timezone
import gspread
import pytz


class SheetsClient:
    def __init__(self, credentials_path: str, spreadsheet_id: str, sheet_tab: str):
        gc = gspread.service_account(filename=credentials_path)
        self._sheet = gc.open_by_key(spreadsheet_id).worksheet(sheet_tab)

    def get_due_rows(self, now_utc: datetime) -> list[dict]:
        records = self._sheet.get_all_records()
        due = []
        for i, row in enumerate(records, start=2):
            row = {k.strip(): (v.strip() if isinstance(v, str) else v) for k, v in row.items()}
            if row.get("status") != "pending":
                continue
            if int(row.get("retry_count") or 0) >= 3:
                continue
            scheduled = _parse_time(row.get("scheduled_time", ""), row.get("timezone", ""))
            if scheduled is None or scheduled > now_utc:
                continue
            due.append({"_row": i, **row})
        return due

    def update_row(self, row_index: int, **fields) -> None:
        headers = [h.strip() for h in self._sheet.row_values(1)]
        for key, value in fields.items():
            if key in headers:
                col = headers.index(key) + 1
                self._sheet.update_cell(row_index, col, value)


def _parse_time(scheduled_time: str, tz_name: str) -> datetime | None:
    try:
        tz = pytz.timezone(
            "America/New_York" if tz_name == "ET" else "Europe/Kyiv"
        )
        naive = datetime.strptime(scheduled_time, "%Y-%m-%d %H:%M")
        return tz.localize(naive).astimezone(timezone.utc)
    except Exception:
        return None
