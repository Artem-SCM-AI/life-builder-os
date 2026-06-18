# FlowerOS — Core Bot Implementation Plan (Plan 1 of 3)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Working Telegram loyalty bot for one flower shop — client registration, profile management, scheduler-driven reminders, and order creation with manager notification. No external API dependencies (LMachine/Flora24/Monobank are Plan 2).

**Architecture:** One Python service, one bot token per shop loaded from YAML config. Conversation state managed via python-telegram-bot ConversationHandlers for multi-step flows (onboarding, profile add); order flow driven by global MessageHandler + CallbackQueryHandlers with state in `user_data`. Pending reminders tracked in `bot_data["pending_reminders"]` dict keyed by `tg_id`.

**Tech Stack:** Python 3.11+, python-telegram-bot 21.x (async), pyairtable 2.x, APScheduler 3.x, PyYAML, pytest + pytest-asyncio

---

## Plan Scope

This plan covers:
- Project setup + config loader
- Airtable client (Users, Profiles, Orders tables)
- Onboarding flow (/start → profile creation)
- Profile management (/profiles, add profile)
- Scheduler: daily date scan + reminder dispatch
- Order flow: client sends budget → order created → manager notified → delivery type → payment method selected
- Multi-tenant bot factory + main entry point

**Out of scope (Plan 2):** LMachine cashback, Flora24 stock check, Monobank payment link, manager photo forward, cash payment confirmation.

**Open questions — status update 2026-06-12:**
1. ~~Flora24 API~~ — **CUT from the roadmap.** Pilot shop has no CRM (Excel/notebooks). Stock is handled by attribute-level ordering + florist daily checklist (Plan 2). Ignore all Flora24 references.
2. ~~LMachine API~~ — **partner confirmed** (Artem's friends). Plan 2 will use real endpoints from their docs; ledger requirements: report §5.2.
3. Monobank merchant account status for the shop — still open.

---

## Amendments (2026-06-12) — apply during execution

> Source: `2026-06-12-report-floweros-prelaunch-analysis.md`. These amendments override the corresponding task specs below. Write tests first for each change, same TDD discipline.

**A1 — Task 2 (Config): points list.** `ShopConfig` gains `points: list[PointConfig]` — each point: `point_id`, `address`, `manager_chat_id` (overrides shop-level default when set). Pilot config has one point. Shop-level `manager_chat_id` remains the fallback.

**A2 — Task 3 (Models): Order fields.** `Order` gains: `point_id: str = ""`, `format: str = ""` (`mono`|`mix`), `mono_type: str = ""`, `colors: list = field(default_factory=list)`, `size_band: str = ""` (`compact`|`standard`|`statement`), `same_day: bool = False`, `description_text: str = ""`, `photo_file_id: str = ""`. These fields MUST exist from day one even where flows don't fill them yet — history is never recoverable retroactively. Task 4 (AirtableClient) persists them.

**A3 — Task 8 (Scheduler): idempotent reminders.** Dispatch keyed by `(profile_id, date_label, year)` against a `reminders_sent` log (Airtable table). A re-run of the 09:00 job the same day must send nothing new. Test: run `scan_and_send_reminders()` twice → second run produces zero sends.

**A4 — Task 9 (Order Flow): attribute-level ordering.** Extend beyond budget capture:
- Format keyboard: `mono` / `mix`
- Mono → mono-type keyboard from a static per-shop list in config (`mono_types: [троянди, півонії, хризантеми, тюльпани]`); seasonal/daily gating arrives in Plan 2
- Mix → colors multi-pick keyboard + size-band keyboard (compact / standard / statement)
- Budget: band keyboard (per-shop bands in config) + "✍️ Своя сума" → numeric input
- Escape hatch at every step: "💬 Описати словами" → free text + profile summary forwarded to manager chat, order created with `description_text`, flow ends with confirmation to client
- All attributes saved on the Order record

**A5 — Commission: flat 7% on GROSS order value.** `commission_pct` stays in config; no progressive-rate logic anywhere; cashback redemption never reduces the commission base (matters for Plan 2 transaction recording).

---

## File Structure

```
floweros/
├── .env.example
├── .gitignore
├── requirements.txt
├── pytest.ini
├── main.py                        # Entry: loads all shop configs, runs all bots
├── shops/
│   └── shop_example.yaml          # Template config (committed, not the real tokens)
├── config/
│   └── loader.py                  # ShopConfig dataclass + YAML loader
├── db/
│   ├── __init__.py
│   ├── models.py                  # User, Profile, ProfileDate, Order dataclasses
│   └── client.py                  # AirtableClient
├── bot/
│   ├── __init__.py
│   ├── factory.py                 # build_application(config) → Application
│   ├── states.py                  # ConversationState enum (S)
│   ├── keyboards.py               # InlineKeyboard builders
│   └── handlers/
│       ├── __init__.py
│       ├── onboarding.py          # /start, survey, create User+Profile
│       ├── profiles.py            # /profiles, add profile flow
│       └── orders.py              # budget capture, delivery type, payment method
├── scheduler/
│   ├── __init__.py
│   └── jobs.py                    # APScheduler setup, scan_and_send_reminders()
└── tests/
    ├── __init__.py
    ├── conftest.py                 # Shared fixtures
    ├── test_config.py
    ├── test_db_models.py
    ├── test_db_client.py
    ├── test_keyboards.py
    ├── test_onboarding.py
    ├── test_profiles.py
    ├── test_orders.py
    └── test_scheduler.py
```

---

## Task 1: Project Setup

**Files:**
- Create: `floweros/requirements.txt`
- Create: `floweros/pytest.ini`
- Create: `floweros/.env.example`
- Create: `floweros/.gitignore`
- Create: `floweros/shops/shop_example.yaml`

- [ ] **Step 1: Create directory structure**

```bash
mkdir -p floweros/{config,db,bot/handlers,scheduler,shops,tests}
touch floweros/{config,db,bot,bot/handlers,scheduler,tests}/__init__.py
```

- [ ] **Step 2: Write requirements.txt**

```
# floweros/requirements.txt
python-telegram-bot==21.3
pyairtable==2.3.3
apscheduler==3.10.4
pyyaml==6.0.1
python-dotenv==1.0.1
pytest==8.2.2
pytest-asyncio==0.23.7
pytest-mock==3.14.0
```

- [ ] **Step 3: Write pytest.ini**

```ini
# floweros/pytest.ini
[pytest]
asyncio_mode = auto
testpaths = tests
```

- [ ] **Step 4: Write .env.example**

```bash
# floweros/.env.example
AIRTABLE_TOKEN=patXXXXXXXXXXXXXX.XXXXXXXXXXXXXX
BOT_TOKEN_001=1234567890:ABCDEFabcdef
```

- [ ] **Step 5: Write .gitignore**

```
.env
shops/*.yaml
!shops/shop_example.yaml
__pycache__/
*.pyc
.pytest_cache/
```

- [ ] **Step 6: Write shops/shop_example.yaml**

```yaml
# floweros/shops/shop_example.yaml
shop_id: "shop_001"
shop_name: "Квіти Дніпро"
city: "Дніпро"
bot_token: "${BOT_TOKEN_001}"
airtable_base_id: "appXXXXXXXXXXXXXX"
manager_chat_id: -1001234567890
commission_pct: 7
```

- [ ] **Step 7: Install dependencies**

```bash
cd floweros && pip install -r requirements.txt
```

- [ ] **Step 8: Commit**

```bash
git add floweros/
git commit -m "chore: scaffold floweros project structure"
```

---

## Task 2: Config Manager

**Files:**
- Create: `floweros/config/loader.py`
- Create: `floweros/tests/test_config.py`

- [ ] **Step 1: Write failing test**

```python
# floweros/tests/test_config.py
import pytest
from config.loader import load_shop_configs, ShopConfig


def test_loads_yaml_config(tmp_path):
    (tmp_path / "shop_001.yaml").write_text("""
shop_id: "shop_001"
shop_name: "Test Shop"
city: "Kyiv"
bot_token: "real_token_123"
airtable_base_id: "appABC"
manager_chat_id: -1001234567890
commission_pct: 7
""")
    configs = load_shop_configs(str(tmp_path))
    assert len(configs) == 1
    assert configs[0].shop_id == "shop_001"
    assert configs[0].commission_pct == 7


def test_resolves_env_var_in_token(tmp_path, monkeypatch):
    monkeypatch.setenv("BOT_TOKEN_001", "resolved_token_abc")
    (tmp_path / "shop_001.yaml").write_text("""
shop_id: "shop_001"
shop_name: "Test"
city: "Kyiv"
bot_token: "${BOT_TOKEN_001}"
airtable_base_id: "appABC"
manager_chat_id: -100123
commission_pct: 7
""")
    configs = load_shop_configs(str(tmp_path))
    assert configs[0].bot_token == "resolved_token_abc"


def test_raises_on_missing_env_var(tmp_path, monkeypatch):
    monkeypatch.delenv("MISSING_VAR", raising=False)
    (tmp_path / "shop_001.yaml").write_text("""
shop_id: "shop_001"
shop_name: "Test"
city: "Kyiv"
bot_token: "${MISSING_VAR}"
airtable_base_id: "appABC"
manager_chat_id: -100123
commission_pct: 7
""")
    with pytest.raises(KeyError):
        load_shop_configs(str(tmp_path))


def test_loads_multiple_shops(tmp_path):
    for i in (1, 2):
        (tmp_path / f"shop_00{i}.yaml").write_text(f"""
shop_id: "shop_00{i}"
shop_name: "Shop {i}"
city: "Kyiv"
bot_token: "token_{i}"
airtable_base_id: "appABC{i}"
manager_chat_id: -100{i}
commission_pct: 7
""")
    configs = load_shop_configs(str(tmp_path))
    assert len(configs) == 2
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
cd floweros && pytest tests/test_config.py -v
```
Expected: `ModuleNotFoundError: No module named 'config.loader'`

- [ ] **Step 3: Write implementation**

```python
# floweros/config/loader.py
import os
import yaml
from dataclasses import dataclass
from pathlib import Path


@dataclass
class ShopConfig:
    shop_id: str
    shop_name: str
    city: str
    bot_token: str
    airtable_base_id: str
    manager_chat_id: int
    commission_pct: float


def load_shop_configs(shops_dir: str = "shops") -> list[ShopConfig]:
    configs = []
    for path in sorted(Path(shops_dir).glob("*.yaml")):
        with open(path) as f:
            data = yaml.safe_load(f)
        resolved = {}
        for key, value in data.items():
            if isinstance(value, str) and value.startswith("${") and value.endswith("}"):
                env_var = value[2:-1]
                resolved[key] = os.environ[env_var]
            else:
                resolved[key] = value
        configs.append(ShopConfig(**resolved))
    return configs
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pytest tests/test_config.py -v
```
Expected: 4 passed

- [ ] **Step 5: Commit**

```bash
git add config/loader.py tests/test_config.py
git commit -m "feat: shop config loader with env var resolution"
```

---

## Task 3: Data Models

**Files:**
- Create: `floweros/db/models.py`
- Create: `floweros/tests/test_db_models.py`

- [ ] **Step 1: Write failing test**

```python
# floweros/tests/test_db_models.py
from db.models import User, Profile, ProfileDate, Order


def test_user_defaults():
    u = User(tg_id=123, shop_id="shop_001", name="Іван")
    assert u.phone == ""
    assert u.notify_preference == "bot"
    assert u.referrer_tg_id is None
    assert u.airtable_id == ""


def test_profile_defaults():
    p = Profile(user_id=123, relation_label="Дружина")
    assert p.dates == []
    assert p.flowers == []
    assert p.is_shared is False
    assert p.source_user_id is None


def test_profile_date_stores_mmdd():
    d = ProfileDate(label="День народження", date="03-15")
    assert d.label == "День народження"
    assert d.date == "03-15"


def test_order_default_status():
    o = Order(user_id=123, profile_id="rec_abc", shop_id="shop_001", budget=500)
    assert o.status == "pending_photo"
    assert o.payment_method == ""
    assert o.airtable_id == ""


def test_profile_dates_are_independent_per_instance():
    p1 = Profile(user_id=1, relation_label="A")
    p2 = Profile(user_id=2, relation_label="B")
    p1.dates.append(ProfileDate("test", "01-01"))
    assert p2.dates == []
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pytest tests/test_db_models.py -v
```
Expected: `ImportError`

- [ ] **Step 3: Write implementation**

```python
# floweros/db/models.py
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ProfileDate:
    label: str   # e.g., "День народження"
    date: str    # MM-DD format, e.g., "03-15"


@dataclass
class User:
    tg_id: int
    shop_id: str
    name: str
    phone: str = ""
    notify_preference: str = "bot"
    referrer_tg_id: Optional[int] = None
    joined_at: str = ""
    airtable_id: str = ""


@dataclass
class Profile:
    user_id: int
    relation_label: str
    dates: list = field(default_factory=list)        # list[ProfileDate]
    flowers: list = field(default_factory=list)      # list[str]
    vase_height_cm: int = 0
    forbidden_flowers: list = field(default_factory=list)
    preferred_colors: list = field(default_factory=list)
    delivery_address: str = ""
    notify_preference: str = "bot"
    is_shared: bool = False
    source_user_id: Optional[int] = None
    airtable_id: str = ""


@dataclass
class Order:
    user_id: int
    profile_id: str
    shop_id: str
    budget: int
    status: str = "pending_photo"
    photo_url: str = ""
    payment_method: str = ""
    delivery_address: str = ""
    delivery_time: str = ""
    created_at: str = ""
    airtable_id: str = ""
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pytest tests/test_db_models.py -v
```
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add db/models.py tests/test_db_models.py
git commit -m "feat: User, Profile, ProfileDate, Order data models"
```

---

## Task 4: AirtableClient

**Files:**
- Create: `floweros/db/client.py`
- Create: `floweros/tests/test_db_client.py`

AirtableClient wraps `pyairtable`. All JSON arrays (dates, flowers) are stored as JSON strings in Airtable text fields because Airtable's array fields are link fields, not free-form arrays.

- [ ] **Step 1: Write failing tests**

```python
# floweros/tests/test_db_client.py
import json
import pytest
from unittest.mock import MagicMock
from db.client import AirtableClient
from db.models import User, Profile, ProfileDate, Order
from datetime import date, timedelta


@pytest.fixture
def mock_table(monkeypatch):
    table = MagicMock()
    api_instance = MagicMock()
    api_instance.table.return_value = table
    monkeypatch.setattr("db.client.Api", lambda key: api_instance)
    return table


def test_create_user_sets_airtable_id(mock_table):
    mock_table.create.return_value = {"id": "recUSER1", "fields": {}}
    client = AirtableClient("fake_key", "fake_base")
    user = User(tg_id=12345, shop_id="shop_001", name="Іван")
    result = client.create_user(user)
    assert result.airtable_id == "recUSER1"
    mock_table.create.assert_called_once()


def test_get_user_returns_none_when_not_found(mock_table):
    mock_table.all.return_value = []
    client = AirtableClient("fake_key", "fake_base")
    assert client.get_user(99999) is None


def test_get_user_returns_user_when_found(mock_table):
    mock_table.all.return_value = [{
        "id": "recUSER1",
        "fields": {
            "tg_id": 12345,
            "shop_id": "shop_001",
            "name": "Іван",
            "phone": "+380501234567",
            "notify_preference": "bot",
            "joined_at": "2026-06-10T10:00:00",
        }
    }]
    client = AirtableClient("fake_key", "fake_base")
    result = client.get_user(12345)
    assert result is not None
    assert result.tg_id == 12345
    assert result.name == "Іван"
    assert result.airtable_id == "recUSER1"


def test_create_profile_sets_airtable_id(mock_table):
    mock_table.create.return_value = {"id": "recPRO1", "fields": {}}
    client = AirtableClient("fake_key", "fake_base")
    profile = Profile(
        user_id=12345,
        relation_label="Дружина",
        dates=[ProfileDate("День народження", "03-15")],
        flowers=["троянди"],
    )
    result = client.create_profile(profile)
    assert result.airtable_id == "recPRO1"
    _, kwargs = mock_table.create.call_args
    # dates stored as JSON string
    fields = mock_table.create.call_args[0][0]
    assert json.loads(fields["dates"]) == [{"label": "День народження", "date": "03-15"}]


def test_get_profiles_for_user_empty(mock_table):
    mock_table.all.return_value = []
    client = AirtableClient("fake_key", "fake_base")
    assert client.get_profiles_for_user(12345) == []


def test_get_profiles_for_user_returns_profile(mock_table):
    mock_table.all.return_value = [{
        "id": "recPRO1",
        "fields": {
            "user_id": 12345,
            "relation_label": "Дружина",
            "dates": json.dumps([{"label": "День народження", "date": "03-15"}]),
            "flowers": json.dumps(["троянди"]),
            "vase_height_cm": 30,
            "forbidden_flowers": "[]",
            "preferred_colors": "[]",
            "delivery_address": "",
            "notify_preference": "bot",
            "is_shared": False,
        }
    }]
    client = AirtableClient("fake_key", "fake_base")
    results = client.get_profiles_for_user(12345)
    assert len(results) == 1
    assert results[0].relation_label == "Дружина"
    assert results[0].dates[0].date == "03-15"
    assert results[0].flowers == ["троянди"]


def test_get_upcoming_reminders_finds_match(mock_table):
    target_mmdd = (date.today() + timedelta(days=2)).strftime("%m-%d")
    mock_table.all.return_value = [{
        "id": "recPRO1",
        "fields": {
            "user_id": 12345,
            "relation_label": "Дружина",
            "dates": json.dumps([{"label": "День народження", "date": target_mmdd}]),
            "flowers": "[]",
            "vase_height_cm": 0,
            "forbidden_flowers": "[]",
            "preferred_colors": "[]",
            "delivery_address": "",
            "notify_preference": "bot",
            "is_shared": False,
        }
    }]
    client = AirtableClient("fake_key", "fake_base")
    client.get_user = lambda tg_id: User(tg_id=tg_id, shop_id="shop_001", name="Іван")
    results = client.get_upcoming_reminders(days_ahead=2)
    assert len(results) == 1
    assert results[0][0].relation_label == "Дружина"
    assert results[0][1].name == "Іван"


def test_get_upcoming_reminders_skips_non_matching(mock_table):
    mock_table.all.return_value = [{
        "id": "recPRO1",
        "fields": {
            "user_id": 12345,
            "relation_label": "Дружина",
            "dates": json.dumps([{"label": "НГ", "date": "01-01"}]),
            "flowers": "[]",
            "vase_height_cm": 0,
            "forbidden_flowers": "[]",
            "preferred_colors": "[]",
            "delivery_address": "",
            "notify_preference": "bot",
            "is_shared": False,
        }
    }]
    client = AirtableClient("fake_key", "fake_base")
    results = client.get_upcoming_reminders(days_ahead=2)
    assert results == []


def test_create_order_sets_airtable_id(mock_table):
    mock_table.create.return_value = {"id": "recORD1", "fields": {}}
    client = AirtableClient("fake_key", "fake_base")
    order = Order(user_id=12345, profile_id="recPRO1", shop_id="shop_001", budget=800)
    result = client.create_order(order)
    assert result.airtable_id == "recORD1"


def test_update_order_calls_airtable_update(mock_table):
    client = AirtableClient("fake_key", "fake_base")
    client.update_order("recORD1", {"status": "paid"})
    mock_table.update.assert_called_once_with("recORD1", {"status": "paid"})
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pytest tests/test_db_client.py -v
```
Expected: `ImportError: cannot import name 'AirtableClient'`

- [ ] **Step 3: Write implementation**

```python
# floweros/db/client.py
import json
from datetime import datetime, date, timedelta
from typing import Optional
from pyairtable import Api
from .models import User, Profile, ProfileDate, Order


class AirtableClient:
    def __init__(self, api_key: str, base_id: str):
        self.api = Api(api_key)
        self.base_id = base_id

    def _table(self, name: str):
        return self.api.table(self.base_id, name)

    # --- Users ---

    def create_user(self, user: User) -> User:
        fields = {
            "tg_id": user.tg_id,
            "shop_id": user.shop_id,
            "name": user.name,
            "phone": user.phone,
            "notify_preference": user.notify_preference,
            "joined_at": datetime.utcnow().isoformat(),
        }
        if user.referrer_tg_id:
            fields["referrer_tg_id"] = user.referrer_tg_id
        record = self._table("Users").create(fields)
        user.airtable_id = record["id"]
        return user

    def get_user(self, tg_id: int) -> Optional[User]:
        records = self._table("Users").all(formula=f"{{tg_id}}={tg_id}")
        if not records:
            return None
        r = records[0]
        f = r["fields"]
        return User(
            tg_id=f["tg_id"],
            shop_id=f.get("shop_id", ""),
            name=f.get("name", ""),
            phone=f.get("phone", ""),
            notify_preference=f.get("notify_preference", "bot"),
            referrer_tg_id=f.get("referrer_tg_id"),
            joined_at=f.get("joined_at", ""),
            airtable_id=r["id"],
        )

    # --- Profiles ---

    def create_profile(self, profile: Profile) -> Profile:
        fields = {
            "user_id": profile.user_id,
            "relation_label": profile.relation_label,
            "dates": json.dumps([{"label": d.label, "date": d.date} for d in profile.dates]),
            "flowers": json.dumps(profile.flowers),
            "vase_height_cm": profile.vase_height_cm,
            "forbidden_flowers": json.dumps(profile.forbidden_flowers),
            "preferred_colors": json.dumps(profile.preferred_colors),
            "delivery_address": profile.delivery_address,
            "notify_preference": profile.notify_preference,
            "is_shared": profile.is_shared,
        }
        if profile.source_user_id:
            fields["source_user_id"] = profile.source_user_id
        record = self._table("Profiles").create(fields)
        profile.airtable_id = record["id"]
        return profile

    def _record_to_profile(self, record: dict) -> Profile:
        f = record["fields"]
        dates_raw = json.loads(f.get("dates", "[]"))
        return Profile(
            user_id=f.get("user_id", 0),
            relation_label=f.get("relation_label", ""),
            dates=[ProfileDate(d["label"], d["date"]) for d in dates_raw],
            flowers=json.loads(f.get("flowers", "[]")),
            vase_height_cm=f.get("vase_height_cm", 0),
            forbidden_flowers=json.loads(f.get("forbidden_flowers", "[]")),
            preferred_colors=json.loads(f.get("preferred_colors", "[]")),
            delivery_address=f.get("delivery_address", ""),
            notify_preference=f.get("notify_preference", "bot"),
            is_shared=f.get("is_shared", False),
            source_user_id=f.get("source_user_id"),
            airtable_id=record["id"],
        )

    def get_profiles_for_user(self, tg_id: int) -> list:
        records = self._table("Profiles").all(formula=f"{{user_id}}={tg_id}")
        return [self._record_to_profile(r) for r in records]

    def get_upcoming_reminders(self, days_ahead: int = 2) -> list:
        target_mmdd = (date.today() + timedelta(days=days_ahead)).strftime("%m-%d")
        records = self._table("Profiles").all()
        results = []
        for r in records:
            profile = self._record_to_profile(r)
            for d in profile.dates:
                if d.date == target_mmdd:
                    user = self.get_user(profile.user_id)
                    if user:
                        results.append((profile, user))
                    break
        return results

    # --- Orders ---

    def create_order(self, order: Order) -> Order:
        now = datetime.utcnow().isoformat()
        fields = {
            "user_id": order.user_id,
            "profile_id": order.profile_id,
            "shop_id": order.shop_id,
            "budget": order.budget,
            "status": order.status,
            "delivery_address": order.delivery_address,
            "created_at": now,
        }
        record = self._table("Orders").create(fields)
        order.airtable_id = record["id"]
        order.created_at = now
        return order

    def update_order(self, airtable_id: str, fields: dict) -> None:
        self._table("Orders").update(airtable_id, fields)

    def get_order(self, airtable_id: str) -> Optional[Order]:
        record = self._table("Orders").get(airtable_id)
        if not record:
            return None
        f = record["fields"]
        return Order(
            user_id=f.get("user_id", 0),
            profile_id=f.get("profile_id", ""),
            shop_id=f.get("shop_id", ""),
            budget=f.get("budget", 0),
            status=f.get("status", "pending_photo"),
            photo_url=f.get("photo_url", ""),
            payment_method=f.get("payment_method", ""),
            delivery_address=f.get("delivery_address", ""),
            delivery_time=f.get("delivery_time", ""),
            created_at=f.get("created_at", ""),
            airtable_id=record["id"],
        )
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pytest tests/test_db_client.py -v
```
Expected: 10 passed

- [ ] **Step 5: Commit**

```bash
git add db/client.py tests/test_db_client.py
git commit -m "feat: AirtableClient — users, profiles, orders CRUD"
```

---

## Task 5: Bot States + Keyboards

**Files:**
- Create: `floweros/bot/states.py`
- Create: `floweros/bot/keyboards.py`
- Create: `floweros/tests/test_keyboards.py`

- [ ] **Step 1: Write failing test**

```python
# floweros/tests/test_keyboards.py
from unittest.mock import MagicMock
from bot.keyboards import (
    main_menu_keyboard,
    payment_method_keyboard,
    delivery_type_keyboard,
    confirm_keyboard,
    profiles_keyboard,
    manager_order_keyboard,
    manager_cash_confirm_keyboard,
)


def _all_buttons(kb):
    return [btn for row in kb.inline_keyboard for btn in row]


def test_main_menu_keyboard_has_four_buttons():
    assert len(_all_buttons(main_menu_keyboard())) == 4


def test_payment_method_keyboard_has_three_rows():
    assert len(payment_method_keyboard().inline_keyboard) == 3


def test_delivery_type_keyboard_has_two_rows():
    assert len(delivery_type_keyboard().inline_keyboard) == 2


def test_profiles_keyboard_always_has_add_button():
    kb = profiles_keyboard([])
    texts = [b.text for b in _all_buttons(kb)]
    assert "➕ Додати профіль" in texts


def test_profiles_keyboard_shows_each_profile():
    p = MagicMock()
    p.relation_label = "Дружина"
    p.airtable_id = "recABC"
    kb = profiles_keyboard([p])
    texts = [b.text for b in _all_buttons(kb)]
    assert any("Дружина" in t for t in texts)


def test_manager_order_keyboard_encodes_order_id():
    kb = manager_order_keyboard("recORD123")
    data = [b.callback_data for b in _all_buttons(kb)]
    assert any("recORD123" in d for d in data)


def test_manager_cash_confirm_encodes_order_id():
    kb = manager_cash_confirm_keyboard("recORD456")
    data = [b.callback_data for b in _all_buttons(kb)]
    assert any("recORD456" in d for d in data)
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pytest tests/test_keyboards.py -v
```
Expected: `ImportError`

- [ ] **Step 3: Write bot/states.py**

```python
# floweros/bot/states.py
from enum import IntEnum, auto


class S(IntEnum):
    # Onboarding
    ONBOARDING_NAME = auto()
    ONBOARDING_PHONE = auto()
    ONBOARDING_PROFILE_LABEL = auto()
    ONBOARDING_PROFILE_DATES = auto()
    ONBOARDING_PROFILE_FLOWERS = auto()
    ONBOARDING_PROFILE_VASE = auto()
    ONBOARDING_PROFILE_FORBIDDEN = auto()
    ONBOARDING_PROFILE_COLORS = auto()
    # Profile add
    PROFILE_ADD_LABEL = auto()
    PROFILE_ADD_DATES = auto()
    PROFILE_ADD_FLOWERS = auto()
```

- [ ] **Step 4: Write bot/keyboards.py**

```python
# floweros/bot/keyboards.py
from telegram import InlineKeyboardButton, InlineKeyboardMarkup


def main_menu_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("👤 Профілі", callback_data="profiles"),
            InlineKeyboardButton("💳 Картка", callback_data="card"),
        ],
        [
            InlineKeyboardButton("📦 Замовлення", callback_data="my_orders"),
            InlineKeyboardButton("💬 Запитати флориста", callback_data="support"),
        ],
    ])


def payment_method_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("💳 Онлайн оплата", callback_data="pay_online")],
        [InlineKeyboardButton("💵 Готівка (+3% кешбек)", callback_data="pay_cash")],
        [InlineKeyboardButton("🏧 Термінал", callback_data="pay_terminal")],
    ])


def delivery_type_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("🚗 Доставка", callback_data="delivery_delivery")],
        [InlineKeyboardButton("🏪 Самовивіз", callback_data="delivery_pickup")],
    ])


def confirm_keyboard() -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("✅ Підтверджую", callback_data="confirm_yes"),
            InlineKeyboardButton("❌ Скасувати", callback_data="confirm_no"),
        ]
    ])


def profiles_keyboard(profiles: list) -> InlineKeyboardMarkup:
    rows = [
        [InlineKeyboardButton(f"🌹 {p.relation_label}", callback_data=f"profile_{p.airtable_id}")]
        for p in profiles
    ]
    rows.append([InlineKeyboardButton("➕ Додати профіль", callback_data="profile_add")])
    return InlineKeyboardMarkup(rows)


def manager_order_keyboard(order_id: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [InlineKeyboardButton("📸 Надіслати фото букету", callback_data=f"mgr_photo_{order_id}")],
    ])


def manager_cash_confirm_keyboard(order_id: str) -> InlineKeyboardMarkup:
    return InlineKeyboardMarkup([
        [
            InlineKeyboardButton("✅ Оплату отримано", callback_data=f"mgr_cash_{order_id}"),
            InlineKeyboardButton("❌ Скасувати", callback_data=f"mgr_cancel_{order_id}"),
        ]
    ])
```

- [ ] **Step 5: Run test — expect PASS**

```bash
pytest tests/test_keyboards.py -v
```
Expected: 7 passed

- [ ] **Step 6: Commit**

```bash
git add bot/states.py bot/keyboards.py tests/test_keyboards.py
git commit -m "feat: conversation states enum and inline keyboard builders"
```

---

## Task 6: Onboarding Handler

**Files:**
- Create: `floweros/bot/handlers/onboarding.py`
- Create: `floweros/tests/test_onboarding.py`

The onboarding ConversationHandler guides the user through: name → phone → profile label → dates → flowers → vase → forbidden flowers → colors → save to Airtable.

- [ ] **Step 1: Write shared test fixtures in conftest.py**

```python
# floweros/tests/conftest.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from telegram import Update, Message, User as TGUser, CallbackQuery
from telegram.ext import ContextTypes


@pytest.fixture
def tg_user():
    u = MagicMock(spec=TGUser)
    u.id = 12345
    u.first_name = "Іван"
    return u


@pytest.fixture
def mock_message(tg_user):
    msg = AsyncMock(spec=Message)
    msg.text = ""
    msg.reply_text = AsyncMock()
    return msg


@pytest.fixture
def mock_update(tg_user, mock_message):
    upd = MagicMock(spec=Update)
    upd.effective_user = tg_user
    upd.message = mock_message
    upd.callback_query = None
    return upd


@pytest.fixture
def mock_db():
    db = MagicMock()
    db.get_user.return_value = None
    db.create_user.return_value = MagicMock(airtable_id="recUSER1")
    db.create_profile.return_value = MagicMock(airtable_id="recPRO1")
    db.get_profiles_for_user.return_value = []
    db.create_order.return_value = MagicMock(airtable_id="recORD1")
    return db


@pytest.fixture
def mock_context(mock_db):
    ctx = MagicMock(spec=ContextTypes.DEFAULT_TYPE)
    ctx.user_data = {}
    ctx.bot = AsyncMock()
    ctx.application = MagicMock()
    ctx.application.bot_data = {
        "airtable": mock_db,
        "shop_config": MagicMock(
            shop_id="shop_001",
            manager_chat_id=-100123,
        ),
        "pending_reminders": {},
    }
    return ctx
```

- [ ] **Step 2: Write failing tests**

```python
# floweros/tests/test_onboarding.py
import pytest
from telegram.ext import ConversationHandler
from bot.handlers.onboarding import (
    start, get_name, get_phone, skip_phone,
    get_profile_label, collect_date, done_dates,
    get_flowers, skip_flowers, get_vase, skip_vase,
    get_forbidden, skip_forbidden, finish_onboarding, skip_colors,
)
from bot.states import S


@pytest.mark.asyncio
async def test_start_new_user_asks_for_name(mock_update, mock_context):
    result = await start(mock_update, mock_context)
    mock_update.message.reply_text.assert_called_once()
    assert result == S.ONBOARDING_NAME


@pytest.mark.asyncio
async def test_start_existing_user_returns_end(mock_update, mock_context, mock_db):
    mock_db.get_user.return_value = MagicMock(name="Іван")
    result = await start(mock_update, mock_context)
    assert result == ConversationHandler.END


@pytest.mark.asyncio
async def test_get_name_stores_name_and_asks_phone(mock_update, mock_context):
    mock_update.message.text = "Іван"
    result = await get_name(mock_update, mock_context)
    assert mock_context.user_data["name"] == "Іван"
    assert result == S.ONBOARDING_PHONE


@pytest.mark.asyncio
async def test_get_phone_stores_and_advances(mock_update, mock_context):
    mock_update.message.text = "+380501234567"
    result = await get_phone(mock_update, mock_context)
    assert mock_context.user_data["phone"] == "+380501234567"
    assert result == S.ONBOARDING_PROFILE_LABEL


@pytest.mark.asyncio
async def test_skip_phone_sets_empty(mock_update, mock_context):
    result = await skip_phone(mock_update, mock_context)
    assert mock_context.user_data["phone"] == ""
    assert result == S.ONBOARDING_PROFILE_LABEL


@pytest.mark.asyncio
async def test_collect_date_parses_dd_mm_correctly(mock_update, mock_context):
    mock_context.user_data["profile_dates"] = []
    mock_update.message.text = "День народження: 15.03"
    result = await collect_date(mock_update, mock_context)
    assert len(mock_context.user_data["profile_dates"]) == 1
    assert mock_context.user_data["profile_dates"][0].date == "03-15"
    assert result == S.ONBOARDING_PROFILE_DATES


@pytest.mark.asyncio
async def test_collect_date_invalid_stays_in_state(mock_update, mock_context):
    mock_context.user_data["profile_dates"] = []
    mock_update.message.text = "bad input"
    result = await collect_date(mock_update, mock_context)
    assert len(mock_context.user_data["profile_dates"]) == 0
    assert result == S.ONBOARDING_PROFILE_DATES


@pytest.mark.asyncio
async def test_done_dates_without_dates_stays(mock_update, mock_context):
    mock_context.user_data["profile_dates"] = []
    result = await done_dates(mock_update, mock_context)
    assert result == S.ONBOARDING_PROFILE_DATES


@pytest.mark.asyncio
async def test_done_dates_with_dates_advances(mock_update, mock_context):
    from db.models import ProfileDate
    mock_context.user_data["profile_dates"] = [ProfileDate("НГ", "01-01")]
    result = await done_dates(mock_update, mock_context)
    assert result == S.ONBOARDING_PROFILE_FLOWERS


@pytest.mark.asyncio
async def test_finish_onboarding_creates_user_and_profile(mock_update, mock_context, mock_db):
    from db.models import ProfileDate
    mock_context.user_data.update({
        "name": "Іван",
        "phone": "+380501234567",
        "profile_label": "Дружина",
        "profile_dates": [ProfileDate("День народження", "03-15")],
        "profile_flowers": ["троянди"],
        "profile_vase": 30,
        "profile_forbidden": [],
        "profile_colors": [],
    })
    mock_update.message.text = "/skip"
    result = await skip_colors(mock_update, mock_context)
    mock_db.create_user.assert_called_once()
    mock_db.create_profile.assert_called_once()
    assert result == ConversationHandler.END
```

- [ ] **Step 3: Run test — expect FAIL**

```bash
pytest tests/test_onboarding.py -v
```
Expected: `ImportError`

- [ ] **Step 4: Write implementation**

```python
# floweros/bot/handlers/onboarding.py
from telegram import Update
from telegram.ext import (
    ConversationHandler, CommandHandler, MessageHandler,
    filters, ContextTypes,
)
from bot.states import S
from bot.keyboards import main_menu_keyboard
from db.models import User, Profile, ProfileDate


def _db(context: ContextTypes.DEFAULT_TYPE):
    return context.application.bot_data["airtable"]


def _config(context: ContextTypes.DEFAULT_TYPE):
    return context.application.bot_data["shop_config"]


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    tg_id = update.effective_user.id
    existing = _db(context).get_user(tg_id)
    if existing:
        await update.message.reply_text(
            f"З поверненням, {existing.name}! 🌸",
            reply_markup=main_menu_keyboard(),
        )
        return ConversationHandler.END
    await update.message.reply_text(
        "Привіт! Я допоможу нагадувати про важливі дати та підбирати букети. "
        "Як вас звати?"
    )
    return S.ONBOARDING_NAME


async def get_name(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["name"] = update.message.text.strip()
    await update.message.reply_text(
        f"{context.user_data['name']}, ваш номер телефону? Або /skip"
    )
    return S.ONBOARDING_PHONE


async def get_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["phone"] = update.message.text.strip()
    await update.message.reply_text(
        "Для кого зазвичай купуєте квіти? (наприклад: Дружина, Мама, Кохана)"
    )
    return S.ONBOARDING_PROFILE_LABEL


async def skip_phone(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["phone"] = ""
    await update.message.reply_text(
        "Для кого зазвичай купуєте квіти? (наприклад: Дружина, Мама, Кохана)"
    )
    return S.ONBOARDING_PROFILE_LABEL


async def get_profile_label(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_label"] = update.message.text.strip()
    context.user_data["profile_dates"] = []
    await update.message.reply_text(
        "Важливі дати — по одній у форматі 'Назва: ДД.ММ'\n"
        "Приклад: 'День народження: 15.03'\n"
        "Надішліть /done коли завершите."
    )
    return S.ONBOARDING_PROFILE_DATES


async def collect_date(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    text = update.message.text.strip()
    try:
        label, date_str = [p.strip() for p in text.split(":", 1)]
        day, month = date_str.split(".")
        date_code = f"{int(month):02d}-{int(day):02d}"
        context.user_data["profile_dates"].append(ProfileDate(label, date_code))
        await update.message.reply_text(f"✅ {label}: {date_str}\nЩе або /done")
    except (ValueError, IndexError):
        await update.message.reply_text("Формат: 'Назва: ДД.ММ'. Спробуйте ще раз.")
    return S.ONBOARDING_PROFILE_DATES


async def done_dates(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if not context.user_data.get("profile_dates"):
        await update.message.reply_text("Додайте хоча б одну дату у форматі 'Назва: ДД.ММ'")
        return S.ONBOARDING_PROFILE_DATES
    await update.message.reply_text(
        "Які квіти подобаються? Через кому. Або /skip"
    )
    return S.ONBOARDING_PROFILE_FLOWERS


async def get_flowers(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_flowers"] = [f.strip() for f in update.message.text.split(",")]
    await update.message.reply_text("Висота вази в сантиметрах? Або /skip")
    return S.ONBOARDING_PROFILE_VASE


async def skip_flowers(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_flowers"] = []
    await update.message.reply_text("Висота вази в сантиметрах? Або /skip")
    return S.ONBOARDING_PROFILE_VASE


async def get_vase(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    try:
        context.user_data["profile_vase"] = int(update.message.text.strip())
    except ValueError:
        await update.message.reply_text("Введіть число (наприклад: 30). Або /skip")
        return S.ONBOARDING_PROFILE_VASE
    await update.message.reply_text("Є заборонені квіти? Через кому. Або /skip")
    return S.ONBOARDING_PROFILE_FORBIDDEN


async def skip_vase(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_vase"] = 0
    await update.message.reply_text("Є заборонені квіти? Через кому. Або /skip")
    return S.ONBOARDING_PROFILE_FORBIDDEN


async def get_forbidden(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_forbidden"] = [f.strip() for f in update.message.text.split(",")]
    await update.message.reply_text(
        "Улюблені кольори? (наприклад: рожеві, білі) Або /skip"
    )
    return S.ONBOARDING_PROFILE_COLORS


async def skip_forbidden(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_forbidden"] = []
    await update.message.reply_text(
        "Улюблені кольори? (наприклад: рожеві, білі) Або /skip"
    )
    return S.ONBOARDING_PROFILE_COLORS


async def finish_onboarding(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_colors"] = [c.strip() for c in update.message.text.split(",")]
    return await _save_and_finish(update, context)


async def skip_colors(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["profile_colors"] = []
    return await _save_and_finish(update, context)


async def _save_and_finish(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    db = _db(context)
    config = _config(context)
    tg_id = update.effective_user.id

    user = User(
        tg_id=tg_id,
        shop_id=config.shop_id,
        name=context.user_data["name"],
        phone=context.user_data.get("phone", ""),
    )
    if context.user_data.get("referrer_tg_id"):
        user.referrer_tg_id = context.user_data["referrer_tg_id"]
    db.create_user(user)

    profile = Profile(
        user_id=tg_id,
        relation_label=context.user_data["profile_label"],
        dates=context.user_data.get("profile_dates", []),
        flowers=context.user_data.get("profile_flowers", []),
        vase_height_cm=context.user_data.get("profile_vase", 0),
        forbidden_flowers=context.user_data.get("profile_forbidden", []),
        preferred_colors=context.user_data.get("profile_colors", []),
    )
    db.create_profile(profile)

    await update.message.reply_text(
        f"Чудово! Профіль '{profile.relation_label}' збережено. "
        "Нагадуємо за 2 дні до кожної дати 🌸",
        reply_markup=main_menu_keyboard(),
    )
    return ConversationHandler.END


def build_conv_handler() -> ConversationHandler:
    return ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            S.ONBOARDING_NAME: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_name)
            ],
            S.ONBOARDING_PHONE: [
                CommandHandler("skip", skip_phone),
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_phone),
            ],
            S.ONBOARDING_PROFILE_LABEL: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_profile_label)
            ],
            S.ONBOARDING_PROFILE_DATES: [
                CommandHandler("done", done_dates),
                MessageHandler(filters.TEXT & ~filters.COMMAND, collect_date),
            ],
            S.ONBOARDING_PROFILE_FLOWERS: [
                CommandHandler("skip", skip_flowers),
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_flowers),
            ],
            S.ONBOARDING_PROFILE_VASE: [
                CommandHandler("skip", skip_vase),
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_vase),
            ],
            S.ONBOARDING_PROFILE_FORBIDDEN: [
                CommandHandler("skip", skip_forbidden),
                MessageHandler(filters.TEXT & ~filters.COMMAND, get_forbidden),
            ],
            S.ONBOARDING_PROFILE_COLORS: [
                CommandHandler("skip", skip_colors),
                MessageHandler(filters.TEXT & ~filters.COMMAND, finish_onboarding),
            ],
        },
        fallbacks=[CommandHandler("start", start)],
        name="onboarding",
    )
```

- [ ] **Step 5: Run test — expect PASS**

```bash
pytest tests/test_onboarding.py -v
```
Expected: 11 passed

- [ ] **Step 6: Commit**

```bash
git add bot/handlers/onboarding.py tests/test_onboarding.py tests/conftest.py
git commit -m "feat: onboarding conversation handler with profile creation"
```

---

## Task 7: Profile Management Handler

**Files:**
- Create: `floweros/bot/handlers/profiles.py`
- Create: `floweros/tests/test_profiles.py`

- [ ] **Step 1: Write failing tests**

```python
# floweros/tests/test_profiles.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from telegram import Update, CallbackQuery, Message
from telegram.ext import ConversationHandler
from bot.handlers.profiles import (
    show_profiles, profile_add_start, profile_add_label,
    profile_add_date, profile_add_done_dates, profile_add_flowers,
    profile_skip_flowers,
)
from bot.states import S


@pytest.fixture
def mock_update_with_callback(mock_update):
    query = AsyncMock(spec=CallbackQuery)
    query.answer = AsyncMock()
    query.message = AsyncMock(spec=Message)
    query.message.reply_text = AsyncMock()
    mock_update.callback_query = query
    return mock_update


@pytest.mark.asyncio
async def test_show_profiles_empty(mock_update, mock_context):
    await show_profiles(mock_update, mock_context)
    mock_update.message.reply_text.assert_called_once()


@pytest.mark.asyncio
async def test_show_profiles_shows_count(mock_update, mock_context, mock_db):
    p = MagicMock()
    p.relation_label = "Дружина"
    p.airtable_id = "recABC"
    mock_db.get_profiles_for_user.return_value = [p]
    await show_profiles(mock_update, mock_context)
    text = mock_update.message.reply_text.call_args[0][0]
    assert "1" in text


@pytest.mark.asyncio
async def test_profile_add_start_asks_for_label(mock_update_with_callback, mock_context):
    result = await profile_add_start(mock_update_with_callback, mock_context)
    mock_update_with_callback.callback_query.message.reply_text.assert_called_once()
    assert result == S.PROFILE_ADD_LABEL


@pytest.mark.asyncio
async def test_profile_add_label_stores_and_advances(mock_update, mock_context):
    mock_update.message.text = "Мама"
    result = await profile_add_label(mock_update, mock_context)
    assert mock_context.user_data["new_profile_label"] == "Мама"
    assert mock_context.user_data["new_profile_dates"] == []
    assert result == S.PROFILE_ADD_DATES


@pytest.mark.asyncio
async def test_profile_add_date_parses_correctly(mock_update, mock_context):
    mock_context.user_data["new_profile_dates"] = []
    mock_update.message.text = "День народження: 05.04"
    result = await profile_add_date(mock_update, mock_context)
    assert len(mock_context.user_data["new_profile_dates"]) == 1
    assert mock_context.user_data["new_profile_dates"][0].date == "04-05"
    assert result == S.PROFILE_ADD_DATES


@pytest.mark.asyncio
async def test_profile_add_date_invalid_stays(mock_update, mock_context):
    mock_context.user_data["new_profile_dates"] = []
    mock_update.message.text = "wrong"
    result = await profile_add_date(mock_update, mock_context)
    assert result == S.PROFILE_ADD_DATES
    assert len(mock_context.user_data["new_profile_dates"]) == 0


@pytest.mark.asyncio
async def test_profile_add_done_dates_without_dates_stays(mock_update, mock_context):
    mock_context.user_data["new_profile_dates"] = []
    result = await profile_add_done_dates(mock_update, mock_context)
    assert result == S.PROFILE_ADD_DATES


@pytest.mark.asyncio
async def test_profile_add_done_dates_with_dates_advances(mock_update, mock_context):
    from db.models import ProfileDate
    mock_context.user_data["new_profile_dates"] = [ProfileDate("НГ", "01-01")]
    result = await profile_add_done_dates(mock_update, mock_context)
    assert result == S.PROFILE_ADD_FLOWERS


@pytest.mark.asyncio
async def test_profile_skip_flowers_saves_profile(mock_update, mock_context, mock_db):
    mock_context.user_data.update({
        "new_profile_label": "Теща",
        "new_profile_dates": [],
        "new_profile_flowers": [],
    })
    result = await profile_skip_flowers(mock_update, mock_context)
    mock_db.create_profile.assert_called_once()
    assert result == ConversationHandler.END
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pytest tests/test_profiles.py -v
```
Expected: `ImportError`

- [ ] **Step 3: Write implementation**

```python
# floweros/bot/handlers/profiles.py
from telegram import Update
from telegram.ext import (
    ConversationHandler, CommandHandler, MessageHandler,
    CallbackQueryHandler, filters, ContextTypes,
)
from bot.states import S
from bot.keyboards import profiles_keyboard, main_menu_keyboard
from db.models import Profile, ProfileDate


def _db(context: ContextTypes.DEFAULT_TYPE):
    return context.application.bot_data["airtable"]


async def show_profiles(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    tg_id = update.effective_user.id
    profiles = _db(context).get_profiles_for_user(tg_id)
    if not profiles:
        await update.message.reply_text(
            "У вас немає профілів. Додайте перший!",
            reply_markup=profiles_keyboard([]),
        )
    else:
        await update.message.reply_text(
            f"Ваші профілі ({len(profiles)}):",
            reply_markup=profiles_keyboard(profiles),
        )


async def show_card(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    await update.message.reply_text(
        "💳 Картка лояльності\n\nБаланс кешбеку доступний після підключення системи лояльності."
    )


async def profile_add_start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    query = update.callback_query
    await query.answer()
    await query.message.reply_text("Як назвемо цей профіль? (наприклад: Дружина, Мама)")
    return S.PROFILE_ADD_LABEL


async def profile_add_label(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["new_profile_label"] = update.message.text.strip()
    context.user_data["new_profile_dates"] = []
    await update.message.reply_text(
        "Важливі дати у форматі 'Назва: ДД.ММ'. Або /done"
    )
    return S.PROFILE_ADD_DATES


async def profile_add_date(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    text = update.message.text.strip()
    try:
        label, date_str = [p.strip() for p in text.split(":", 1)]
        day, month = date_str.split(".")
        date_code = f"{int(month):02d}-{int(day):02d}"
        context.user_data["new_profile_dates"].append(ProfileDate(label, date_code))
        await update.message.reply_text(f"✅ {label} додано. Ще або /done")
    except (ValueError, IndexError):
        await update.message.reply_text("Формат: 'Назва: ДД.ММ'")
    return S.PROFILE_ADD_DATES


async def profile_add_done_dates(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    if not context.user_data.get("new_profile_dates"):
        await update.message.reply_text("Додайте хоча б одну дату.")
        return S.PROFILE_ADD_DATES
    await update.message.reply_text("Улюблені квіти через кому. Або /skip")
    return S.PROFILE_ADD_FLOWERS


async def profile_add_flowers(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["new_profile_flowers"] = [f.strip() for f in update.message.text.split(",")]
    return await _save_new_profile(update, context)


async def profile_skip_flowers(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    context.user_data["new_profile_flowers"] = []
    return await _save_new_profile(update, context)


async def _save_new_profile(update: Update, context: ContextTypes.DEFAULT_TYPE) -> int:
    profile = Profile(
        user_id=update.effective_user.id,
        relation_label=context.user_data["new_profile_label"],
        dates=context.user_data.get("new_profile_dates", []),
        flowers=context.user_data.get("new_profile_flowers", []),
    )
    _db(context).create_profile(profile)
    await update.message.reply_text(
        f"Профіль '{profile.relation_label}' збережено! 🌸",
        reply_markup=main_menu_keyboard(),
    )
    return ConversationHandler.END


def build_conv_handler() -> ConversationHandler:
    return ConversationHandler(
        entry_points=[CallbackQueryHandler(profile_add_start, pattern="^profile_add$")],
        states={
            S.PROFILE_ADD_LABEL: [
                MessageHandler(filters.TEXT & ~filters.COMMAND, profile_add_label)
            ],
            S.PROFILE_ADD_DATES: [
                CommandHandler("done", profile_add_done_dates),
                MessageHandler(filters.TEXT & ~filters.COMMAND, profile_add_date),
            ],
            S.PROFILE_ADD_FLOWERS: [
                CommandHandler("skip", profile_skip_flowers),
                MessageHandler(filters.TEXT & ~filters.COMMAND, profile_add_flowers),
            ],
        },
        fallbacks=[CommandHandler("profiles", show_profiles)],
        name="profile_add",
    )
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pytest tests/test_profiles.py -v
```
Expected: 9 passed

- [ ] **Step 5: Commit**

```bash
git add bot/handlers/profiles.py tests/test_profiles.py
git commit -m "feat: profile management handler — list and add flow"
```

---

## Task 8: Scheduler — Reminder Dispatch

**Files:**
- Create: `floweros/scheduler/jobs.py`
- Create: `floweros/tests/test_scheduler.py`

The scheduler runs daily at 09:00. It calls `get_upcoming_reminders(days_ahead=2)`, sends a reminder message to each user, and stores the profile_id in `bot_data["pending_reminders"][tg_id]` so the order handler knows which profile triggered the order.

- [ ] **Step 1: Write failing tests**

```python
# floweros/tests/test_scheduler.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from datetime import date, timedelta
from db.models import Profile, ProfileDate, User
from scheduler.jobs import scan_and_send_reminders, _is_in_two_days, create_scheduler


def test_is_in_two_days_true():
    target = (date.today() + timedelta(days=2)).strftime("%m-%d")
    assert _is_in_two_days(target) is True


def test_is_in_two_days_false():
    not_target = (date.today() + timedelta(days=5)).strftime("%m-%d")
    assert _is_in_two_days(not_target) is False


@pytest.mark.asyncio
async def test_scan_sends_reminder_and_stores_pending():
    target_mmdd = (date.today() + timedelta(days=2)).strftime("%m-%d")
    profile = Profile(
        user_id=12345,
        relation_label="Дружина",
        dates=[ProfileDate("День народження", target_mmdd)],
        flowers=["троянди"],
        vase_height_cm=30,
    )
    profile.airtable_id = "recPRO1"
    user = User(tg_id=12345, shop_id="shop_001", name="Іван")

    mock_db = MagicMock()
    mock_db.get_upcoming_reminders.return_value = [(profile, user)]

    pending = {}
    mock_app = MagicMock()
    mock_app.bot = AsyncMock()
    mock_app.bot.send_message = AsyncMock()
    mock_app.bot_data = {
        "airtable": mock_db,
        "shop_config": MagicMock(shop_id="shop_001"),
        "pending_reminders": pending,
    }

    await scan_and_send_reminders([mock_app])

    mock_app.bot.send_message.assert_called_once()
    call = mock_app.bot.send_message.call_args
    assert call.kwargs["chat_id"] == 12345
    assert "Дружина" in call.kwargs["text"]
    assert "троянди" in call.kwargs["text"]
    assert pending[12345] == "recPRO1"


@pytest.mark.asyncio
async def test_scan_no_reminder_when_no_matches():
    mock_db = MagicMock()
    mock_db.get_upcoming_reminders.return_value = []
    pending = {}
    mock_app = MagicMock()
    mock_app.bot = AsyncMock()
    mock_app.bot_data = {
        "airtable": mock_db,
        "shop_config": MagicMock(shop_id="shop_001"),
        "pending_reminders": pending,
    }
    await scan_and_send_reminders([mock_app])
    mock_app.bot.send_message.assert_not_called()
    assert pending == {}


@pytest.mark.asyncio
async def test_scan_continues_after_single_app_error():
    mock_db = MagicMock()
    mock_db.get_upcoming_reminders.side_effect = Exception("Airtable down")
    mock_app = MagicMock()
    mock_app.bot = AsyncMock()
    mock_app.bot_data = {
        "airtable": mock_db,
        "shop_config": MagicMock(shop_id="shop_001"),
        "pending_reminders": {},
    }
    # Should not raise
    await scan_and_send_reminders([mock_app])


def test_create_scheduler_registers_daily_job():
    from apscheduler.schedulers.asyncio import AsyncIOScheduler
    scheduler = create_scheduler([])
    assert isinstance(scheduler, AsyncIOScheduler)
    assert scheduler.get_job("daily_reminder_scan") is not None
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pytest tests/test_scheduler.py -v
```
Expected: `ImportError`

- [ ] **Step 3: Write implementation**

```python
# floweros/scheduler/jobs.py
import logging
from datetime import date, timedelta
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

logger = logging.getLogger(__name__)


def _is_in_two_days(date_mmdd: str) -> bool:
    return date_mmdd == (date.today() + timedelta(days=2)).strftime("%m-%d")


async def scan_and_send_reminders(applications: list) -> None:
    for app in applications:
        config = app.bot_data["shop_config"]
        try:
            db = app.bot_data["airtable"]
            pending = app.bot_data.setdefault("pending_reminders", {})
            reminders = db.get_upcoming_reminders(days_ahead=2)
            for profile, user in reminders:
                date_labels = ", ".join(
                    d.label for d in profile.dates if _is_in_two_days(d.date)
                )
                flowers_text = ", ".join(profile.flowers) if profile.flowers else "будь-які квіти"
                msg = (
                    f"🌸 Через 2 дні — {date_labels} для '{profile.relation_label}'\n\n"
                    f"Улюблені квіти: {flowers_text}\n"
                    f"Висота вази: {profile.vase_height_cm} см\n\n"
                    f"Який бюджет на букет? (введіть суму в гривнях)"
                )
                await app.bot.send_message(chat_id=user.tg_id, text=msg)
                pending[user.tg_id] = profile.airtable_id
                logger.info("Reminder sent: shop=%s user=%s profile=%s",
                            config.shop_id, user.tg_id, profile.relation_label)
        except Exception:
            logger.exception("Reminder scan failed for shop %s", config.shop_id)


def create_scheduler(applications: list) -> AsyncIOScheduler:
    scheduler = AsyncIOScheduler()
    scheduler.add_job(
        scan_and_send_reminders,
        trigger=CronTrigger(hour=9, minute=0),
        args=[applications],
        id="daily_reminder_scan",
        replace_existing=True,
    )
    return scheduler
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pytest tests/test_scheduler.py -v
```
Expected: 5 passed

- [ ] **Step 5: Commit**

```bash
git add scheduler/jobs.py tests/test_scheduler.py
git commit -m "feat: daily reminder scheduler with pending_reminders tracking"
```

---

## Task 9: Order Flow Handler

**Files:**
- Create: `floweros/bot/handlers/orders.py`
- Create: `floweros/tests/test_orders.py`

The order flow is event-driven (not a ConversationHandler). Entry: user sends a number while having a `pending_reminders` entry. State stored in `user_data`. Steps: budget → create order + notify manager → delivery type → (if delivery) address → payment method → confirm.

- [ ] **Step 1: Write failing tests**

```python
# floweros/tests/test_orders.py
import pytest
from unittest.mock import AsyncMock, MagicMock
from telegram import Update, Message, CallbackQuery
from telegram.ext import ContextTypes
from bot.handlers.orders import handle_budget, handle_delivery_type, handle_payment_method


@pytest.fixture
def mock_update_with_budget(mock_update):
    mock_update.message.text = "800"
    return mock_update


@pytest.fixture
def context_with_pending(mock_context, mock_db):
    from db.models import Profile, ProfileDate
    profile = Profile(
        user_id=12345,
        relation_label="Дружина",
        dates=[ProfileDate("НГ", "01-01")],
        flowers=["троянди"],
        vase_height_cm=30,
    )
    profile.airtable_id = "recPRO1"
    mock_db.get_profiles_for_user.return_value = [profile]
    mock_context.application.bot_data["pending_reminders"][12345] = "recPRO1"
    return mock_context


@pytest.mark.asyncio
async def test_handle_budget_ignores_when_no_pending(mock_update_with_budget, mock_context):
    mock_context.application.bot_data["pending_reminders"] = {}
    await handle_budget(mock_update_with_budget, mock_context)
    mock_update_with_budget.message.reply_text.assert_not_called()


@pytest.mark.asyncio
async def test_handle_budget_rejects_non_numeric(mock_update, context_with_pending):
    mock_update.message.text = "багато"
    await handle_budget(mock_update, context_with_pending)
    text = mock_update.message.reply_text.call_args[0][0]
    assert "гривнях" in text.lower() or "суму" in text.lower()


@pytest.mark.asyncio
async def test_handle_budget_rejects_below_minimum(mock_update, context_with_pending):
    mock_update.message.text = "100"
    await handle_budget(mock_update, context_with_pending)
    text = mock_update.message.reply_text.call_args[0][0]
    assert "200" in text


@pytest.mark.asyncio
async def test_handle_budget_creates_order_and_notifies_manager(
    mock_update_with_budget, context_with_pending, mock_db
):
    await handle_budget(mock_update_with_budget, context_with_pending)
    mock_db.create_order.assert_called_once()
    order_arg = mock_db.create_order.call_args[0][0]
    assert order_arg.budget == 800
    assert order_arg.user_id == 12345
    context_with_pending.bot.send_message.assert_called_once()
    manager_call = context_with_pending.bot.send_message.call_args
    assert manager_call.kwargs["chat_id"] == -100123
    assert "800" in manager_call.kwargs["text"]


@pytest.mark.asyncio
async def test_handle_budget_clears_pending(mock_update_with_budget, context_with_pending):
    await handle_budget(mock_update_with_budget, context_with_pending)
    assert 12345 not in context_with_pending.application.bot_data["pending_reminders"]


@pytest.mark.asyncio
async def test_handle_delivery_type_delivery_asks_address(mock_update, mock_context):
    query = AsyncMock(spec=CallbackQuery)
    query.answer = AsyncMock()
    query.data = "delivery_delivery"
    query.message = AsyncMock(spec=Message)
    query.message.reply_text = AsyncMock()
    mock_update.callback_query = query
    mock_context.user_data["current_order_id"] = "recORD1"
    await handle_delivery_type(mock_update, mock_context)
    assert mock_context.user_data.get("delivery_type") == "delivery"
    query.message.reply_text.assert_called_once()


@pytest.mark.asyncio
async def test_handle_delivery_type_pickup_skips_address(mock_update, mock_context):
    query = AsyncMock(spec=CallbackQuery)
    query.answer = AsyncMock()
    query.data = "delivery_pickup"
    query.message = AsyncMock(spec=Message)
    query.message.reply_text = AsyncMock()
    mock_update.callback_query = query
    mock_context.user_data["current_order_id"] = "recORD1"
    await handle_delivery_type(mock_update, mock_context)
    assert mock_context.user_data.get("delivery_type") == "pickup"
    # Should show payment keyboard directly
    text_shown = query.message.reply_text.call_args[0][0]
    assert text_shown  # some message shown


@pytest.mark.asyncio
async def test_handle_payment_method_records_method(mock_update, mock_context, mock_db):
    query = AsyncMock(spec=CallbackQuery)
    query.answer = AsyncMock()
    query.data = "pay_cash"
    query.message = AsyncMock(spec=Message)
    query.message.reply_text = AsyncMock()
    mock_update.callback_query = query
    mock_context.user_data["current_order_id"] = "recORD1"
    mock_context.user_data["delivery_type"] = "pickup"
    await handle_payment_method(mock_update, mock_context)
    mock_db.update_order.assert_called_once_with(
        "recORD1", {"payment_method": "cash", "status": "pending_photo"}
    )
```

- [ ] **Step 2: Run test — expect FAIL**

```bash
pytest tests/test_orders.py -v
```
Expected: `ImportError`

- [ ] **Step 3: Write implementation**

```python
# floweros/bot/handlers/orders.py
from telegram import Update
from telegram.ext import ContextTypes, MessageHandler, CallbackQueryHandler, filters
from bot.keyboards import delivery_type_keyboard, payment_method_keyboard
from db.models import Order

PAYMENT_METHOD_MAP = {
    "pay_online": "online",
    "pay_cash": "cash",
    "pay_terminal": "terminal",
}


def _db(context: ContextTypes.DEFAULT_TYPE):
    return context.application.bot_data["airtable"]


def _config(context: ContextTypes.DEFAULT_TYPE):
    return context.application.bot_data["shop_config"]


async def handle_budget(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    tg_id = update.effective_user.id
    pending = context.application.bot_data.get("pending_reminders", {})
    profile_id = pending.get(tg_id)
    if not profile_id:
        return

    text = update.message.text.strip()
    try:
        budget = int(text)
    except ValueError:
        await update.message.reply_text("Введіть суму в гривнях цифрами (наприклад: 800)")
        return

    if budget < 200:
        await update.message.reply_text("Мінімальна сума замовлення — 200 грн.")
        return

    db = _db(context)
    config = _config(context)
    profiles = db.get_profiles_for_user(tg_id)
    profile = next((p for p in profiles if p.airtable_id == profile_id), None)

    if not profile:
        await update.message.reply_text("Профіль не знайдено. Спробуйте /start")
        del pending[tg_id]
        return

    order = Order(
        user_id=tg_id,
        profile_id=profile_id,
        shop_id=config.shop_id,
        budget=budget,
        status="pending_photo",
    )
    order = db.create_order(order)
    del pending[tg_id]
    context.user_data["current_order_id"] = order.airtable_id

    flowers_text = ", ".join(profile.flowers) if profile.flowers else "не вказано"
    forbidden_text = ", ".join(profile.forbidden_flowers) if profile.forbidden_flowers else "немає"
    colors_text = ", ".join(profile.preferred_colors) if profile.preferred_colors else "будь-які"

    manager_msg = (
        f"🌸 Нове замовлення!\n\n"
        f"Профіль: {profile.relation_label}\n"
        f"Бюджет: {budget} грн\n"
        f"Квіти: {flowers_text}\n"
        f"Заборонені: {forbidden_text}\n"
        f"Кольори: {colors_text}\n"
        f"Ваза: {profile.vase_height_cm} см\n\n"
        f"ID замовлення: {order.airtable_id}"
    )
    await context.bot.send_message(chat_id=config.manager_chat_id, text=manager_msg)

    await update.message.reply_text(
        f"✅ Замовлення прийнято! Бюджет: {budget} грн\n"
        "Флорист підбирає букет — очікуйте фото 📸\n\n"
        "Оберіть спосіб отримання:",
        reply_markup=delivery_type_keyboard(),
    )


async def handle_delivery_type(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    delivery_type = query.data.replace("delivery_", "")
    context.user_data["delivery_type"] = delivery_type

    if delivery_type == "delivery":
        await query.message.reply_text("Вкажіть адресу доставки:")
        context.user_data["awaiting_address"] = True
    else:
        context.user_data["delivery_address"] = ""
        await query.message.reply_text(
            "Самовивіз. Оберіть спосіб оплати:",
            reply_markup=payment_method_keyboard(),
        )


async def handle_delivery_address(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    if not context.user_data.get("awaiting_address"):
        return
    address = update.message.text.strip()
    context.user_data["delivery_address"] = address
    context.user_data["awaiting_address"] = False

    order_id = context.user_data.get("current_order_id")
    if order_id:
        _db(context).update_order(order_id, {"delivery_address": address})

    await update.message.reply_text(
        f"Адреса: {address}\n\nОберіть спосіб оплати:",
        reply_markup=payment_method_keyboard(),
    )


async def handle_payment_method(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    query = update.callback_query
    await query.answer()
    method = PAYMENT_METHOD_MAP.get(query.data, "")
    order_id = context.user_data.get("current_order_id")

    if order_id:
        _db(context).update_order(order_id, {
            "payment_method": method,
            "status": "pending_photo",
        })

    cashback_note = " +3% кешбек нараховано!" if method == "cash" else ""
    await query.message.reply_text(
        f"✅ Замовлення оформлено!\n"
        f"Спосіб оплати: {query.data.replace('pay_', '').upper()}{cashback_note}\n\n"
        "Флорист зв'яжеться з вами коли букет буде готовий."
    )
    context.user_data.pop("current_order_id", None)
    context.user_data.pop("delivery_type", None)
    context.user_data.pop("delivery_address", None)


def register_handlers(app) -> None:
    app.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND & filters.Regex(r'^\d+$'),
            handle_budget,
        ),
        group=1,
    )
    app.add_handler(
        MessageHandler(
            filters.TEXT & ~filters.COMMAND,
            handle_delivery_address,
        ),
        group=2,
    )
    app.add_handler(
        CallbackQueryHandler(handle_delivery_type, pattern=r"^delivery_"),
        group=1,
    )
    app.add_handler(
        CallbackQueryHandler(handle_payment_method, pattern=r"^pay_"),
        group=1,
    )
```

- [ ] **Step 4: Run test — expect PASS**

```bash
pytest tests/test_orders.py -v
```
Expected: 9 passed

- [ ] **Step 5: Commit**

```bash
git add bot/handlers/orders.py tests/test_orders.py
git commit -m "feat: order flow — budget capture, manager notification, delivery, payment"
```

---

## Task 10: Bot Factory + main.py

**Files:**
- Create: `floweros/bot/handlers/__init__.py` (update)
- Create: `floweros/bot/factory.py`
- Create: `floweros/main.py`

- [ ] **Step 1: Update bot/handlers/__init__.py**

```python
# floweros/bot/handlers/__init__.py
from bot.handlers import onboarding, profiles, orders
```

- [ ] **Step 2: Write bot/factory.py**

```python
# floweros/bot/factory.py
import os
from telegram.ext import Application, CommandHandler, CallbackQueryHandler
from config.loader import ShopConfig
from db.client import AirtableClient
from bot.handlers import onboarding, profiles, orders


def build_application(config: ShopConfig) -> Application:
    airtable = AirtableClient(
        api_key=os.environ["AIRTABLE_TOKEN"],
        base_id=config.airtable_base_id,
    )

    app = Application.builder().token(config.bot_token).build()
    app.bot_data["shop_config"] = config
    app.bot_data["airtable"] = airtable
    app.bot_data["pending_reminders"] = {}

    # ConversationHandlers (group 0, higher priority)
    app.add_handler(onboarding.build_conv_handler(), group=0)
    app.add_handler(profiles.build_conv_handler(), group=0)

    # Global command handlers
    app.add_handler(CommandHandler("profiles", profiles.show_profiles), group=0)
    app.add_handler(CommandHandler("card", profiles.show_card), group=0)

    # Profile list callback
    app.add_handler(
        CallbackQueryHandler(profiles.show_profiles, pattern="^profiles$"), group=0
    )

    # Order flow handlers (groups 1, 2 — after ConversationHandlers)
    orders.register_handlers(app)

    return app
```

- [ ] **Step 3: Write main.py**

```python
# floweros/main.py
import asyncio
import logging
import os
from dotenv import load_dotenv
from config.loader import load_shop_configs
from bot.factory import build_application
from scheduler.jobs import create_scheduler

logging.basicConfig(
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    level=logging.INFO,
)
logger = logging.getLogger(__name__)


async def run_all() -> None:
    load_dotenv()
    configs = load_shop_configs("shops")
    if not configs:
        logger.error("No shop configs found in shops/. Exiting.")
        return

    applications = [build_application(c) for c in configs]

    scheduler = create_scheduler(applications)
    scheduler.start()
    logger.info("Scheduler started — daily reminders at 09:00")

    logger.info("Starting %d bot(s): %s",
                len(applications), [c.shop_id for c in configs])

    # Initialize all applications
    for app in applications:
        await app.initialize()

    # Start polling for all bots concurrently
    async with asyncio.TaskGroup() as tg:
        for app in applications:
            tg.create_task(_run_polling(app))


async def _run_polling(app) -> None:
    await app.updater.start_polling(drop_pending_updates=True)
    await app.start()
    logger.info("Bot started: %s", app.bot_data["shop_config"].shop_id)
    await app.updater.idle()
    await app.stop()
    await app.shutdown()


if __name__ == "__main__":
    asyncio.run(run_all())
```

- [ ] **Step 4: Run full test suite**

```bash
cd floweros && pytest -v
```
Expected: all tests pass (should be ~45 tests total)

- [ ] **Step 5: Commit**

```bash
git add bot/factory.py bot/handlers/__init__.py main.py
git commit -m "feat: bot factory, multi-tenant setup, main entry point"
```

---

## Task 11: Smoke Test — Manual Run

Before calling Plan 1 complete, run the bot locally against a real test shop config to verify end-to-end flow.

- [ ] **Step 1: Create test shop config**

Copy `shops/shop_example.yaml` to `shops/shop_test.yaml`, fill in real:
- `bot_token` (from BotFather test bot)
- `airtable_base_id` (new empty Airtable base)
- `manager_chat_id` (your own Telegram ID for testing)

Create Airtable tables: `Users`, `Profiles`, `Orders` with the fields from the spec (Section 4).

- [ ] **Step 2: Create .env**

```bash
cp .env.example .env
# Fill in AIRTABLE_TOKEN and BOT_TOKEN_TEST values
```

- [ ] **Step 3: Run the bot**

```bash
python main.py
```
Expected: logs show "Bot started: shop_test"

- [ ] **Step 4: Test onboarding flow**

Open Telegram, send `/start` to the test bot. Walk through:
- Enter name
- Enter or skip phone
- Enter profile label (e.g., "Дружина")
- Add a date 2 days from today in `ДД.ММ` format — e.g., if today is June 11, enter "13.06"
- Enter "Дружина: 13.06", then `/done`
- Skip or enter flowers, vase, etc.

Expected: welcome message with main menu keyboard. Record appears in Airtable `Users` and `Profiles` tables.

- [ ] **Step 5: Test reminder dispatch manually**

Trigger the scheduler job directly without waiting for 09:00:

```python
# In Python REPL (with .env loaded and main.py context):
import asyncio
from scheduler.jobs import scan_and_send_reminders
# Pass the running app list
asyncio.run(scan_and_send_reminders(applications))
```

Expected: Telegram message received: "Через 2 дні — [date label] для 'Дружина'... Який бюджет?"

- [ ] **Step 6: Test order flow**

Reply to the reminder with a budget amount (e.g., `800`).

Expected:
- Manager chat receives notification with profile details and budget
- Bot replies asking for delivery type
- Select delivery or pickup
- Select payment method
- Confirmation message shown
- Airtable `Orders` table has new record with `status: pending_photo`

- [ ] **Step 7: Commit smoke test notes**

```bash
git commit --allow-empty -m "chore: Plan 1 smoke test passed — core flow verified"
```

---

## Self-Review

**Spec coverage check:**

| Spec requirement | Task |
|---|---|
| Multi-tenant: one service, separate tokens | Task 10 (factory + main.py) |
| Shop config per YAML | Task 2 |
| Airtable: Users, Profiles, Orders | Task 4 |
| Onboarding flow: name, phone, profile, dates, preferences | Task 6 |
| Profile management: list, add | Task 7 |
| Scheduler: daily 09:00 scan | Task 8 |
| Reminder dispatch: 2 days ahead, stores pending | Task 8 |
| Order flow: budget → order creation → manager notification | Task 9 |
| Delivery type selection | Task 9 |
| Payment method selection | Task 9 |
| Order recorded in Airtable | Task 9 |
| ConversationState enum | Task 5 |
| InlineKeyboard builders | Task 5 |

**Deferred to Plan 2 (by design):**
- LMachine registration/cashback (requires confirmed API)
- Flora24 stock check before reminder (requires confirmed API)
- Monobank payment link generation (requires merchant account)
- Manager photo → forward to client (Plan 2)
- Cash payment confirmation by manager (Plan 2)

**Placeholder scan:** None found.

**Type consistency:** `Profile.airtable_id` used consistently across `db/client.py`, `scheduler/jobs.py`, `bot/handlers/orders.py`. `pending_reminders[tg_id] = profile.airtable_id` in scheduler matches `profile_id = pending.get(tg_id)` in orders handler. ✓

---

Plan complete. Saved to `docs/superpowers/plans/2026-06-10-floweros-bot.md`.

**Two execution options:**

**1. Subagent-Driven (recommended)** — fresh subagent per task, review between tasks, fast parallel iteration

**2. Inline Execution** — run tasks in this session with checkpoints

Which approach?
