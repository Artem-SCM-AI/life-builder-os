# 10x Talent Portal → Notion Scraper

Забирає всі місії з talent-portal.10x.team і кладе в Notion базу даних.

---

## Як отримати Bearer Token

1. Відкрий [talent-portal.10x.team/missions](https://talent-portal.10x.team/missions/) в браузері (увійди в акаунт)
2. Відкрий DevTools → вкладка **Network**
3. Перезавантаж сторінку (F5)
4. В фільтрі пошуку введи `missions`
5. Клікни на будь-який запит до `web-api.10x.team`
6. В розділі **Request Headers** знайди рядок `Authorization: Bearer <TOKEN>`
7. Скопіюй токен (все після `Bearer `)

Токен живе ~1 годину. Щоразу потрібно оновлювати вручну або запускати скрипт поки сесія активна.

---

## Налаштування

### 1. Встанови залежності

```bash
cd "SCAIT/10x-missions-scraper"
pip install -r requirements.txt
```

### 2. Створи .env файл

```bash
cp .env.example .env
```

Заповни у `.env`:

| Змінна | Звідки брати |
|--------|-------------|
| `BEARER_TOKEN` | З браузера DevTools (див. вище) |
| `NOTION_TOKEN` | [notion.so/my-integrations](https://notion.so/my-integrations) → New integration → copy Secret |
| `NOTION_PARENT_PAGE_ID` | ID будь-якої Notion сторінки де буде база (з URL після workspace/) |

### 3. Підключи інтеграцію до Notion сторінки

У Notion → відкрий батьківську сторінку → `...` (три крапки) → **Connections** → знайди свою інтеграцію → підключи.

### 4. Створи базу даних (один раз)

```bash
python setup_notion.py
```

Скопіюй `NOTION_DATABASE_ID=...` з виводу в `.env`.

### 5. Запускай

```bash
python fetch_missions.py
```

---

## Що потрапляє в Notion

| Колонка | Тип | Опис |
|---------|-----|------|
| Role | Заголовок | Назва позиції |
| Company | Text | Компанія |
| Location | Text | Країна / місто |
| Workplace | Select | remote / hybrid / onsite |
| Budget | Text | Ставка (якщо є) |
| Domain | Text | Сфера / домен |
| Status | Select | New / Interested / Applied / Skip |
| Invited | Checkbox | Чи запросили тебе |
| Matched | Checkbox | Чи є AI match |
| URL | URL | Посилання на місію |
| Date Found | Date | Дата додавання |
| Description | Text | Короткий опис |

---

## Повторний запуск

Просто запускай `python fetch_missions.py` — дублікати автоматично пропускаються (перевірка по Mission ID).
