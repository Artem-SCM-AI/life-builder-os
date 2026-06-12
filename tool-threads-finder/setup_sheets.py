"""Run once to set up the Google Sheets structure with headers and initial keywords."""
import gspread
from config import load_config
from sheets_client import LOG_COLUMNS, REPLY_MAP_COLUMNS

INITIAL_KEYWORDS = {
    'Sales & Marketing': [
        'збираю ліди вручну',
        'CRM вручну',
        'звіт по рекламі вручну',
        'публікую пости вручну',
        'переношу ліди вручну',
    ],
    'Ops & Finance': [
        'обробляю інвойси вручну',
        'відстежую залишки вручну',
        'розношу витрати вручну',
        'відстежую відправлення вручну',
    ],
    'HR & Legal': [
        'переглядаю резюме вручну',
        'відповідаю на питання клієнтів вручну',
        'готую договори вручну',
    ],
    'Owners': [
        'відповідаю клієнтам вручну',
        'записую клієнтів вручну',
        'веду облік вручну',
        'хочу автоматизувати',
    ],
    'Job Seekers': [
        'шукаю вакансії вручну',
        'адаптую резюме вручну',
    ],
}

def setup():
    cfg = load_config()
    gc = gspread.service_account(filename=cfg.credentials_path)
    ss = gc.open_by_key(cfg.sheets_id)
    existing = {ws.title for ws in ss.worksheets()}

    for tab_name, keywords in INITIAL_KEYWORDS.items():
        if tab_name in existing:
            print(f"  skip (exists): {tab_name}")
            continue
        ws = ss.add_worksheet(tab_name, rows=100, cols=2)
        ws.append_row(['keyword', 'active'])
        for kw in keywords:
            ws.append_row([kw, 'TRUE'])
        print(f"  created: {tab_name} ({len(keywords)} keywords)")

    if 'Log' not in existing:
        ws = ss.add_worksheet('Log', rows=5000, cols=len(LOG_COLUMNS))
        ws.append_row(LOG_COLUMNS)
        print("  created: Log")
    else:
        print("  skip (exists): Log")

    if 'Reply Map' not in existing:
        ws = ss.add_worksheet('Reply Map', rows=1000, cols=len(REPLY_MAP_COLUMNS))
        ws.append_row(REPLY_MAP_COLUMNS)
        print("  created: Reply Map")
    else:
        print("  skip (exists): Reply Map")

    print("Setup complete.")

if __name__ == '__main__':
    setup()
