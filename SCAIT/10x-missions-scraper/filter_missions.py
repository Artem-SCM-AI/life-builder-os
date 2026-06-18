"""
Фільтрує вакансії в Notion базуючись на профілі Артема.
Релевантні → "To Do", нерелевантні → "Irrelevant"
"""

import os
import sys
from dotenv import load_dotenv
from notion_client import Client

load_dotenv()

NOTION_TOKEN = os.environ.get("NOTION_TOKEN", "")
NOTION_DATABASE_ID = os.environ.get("NOTION_DATABASE_ID", "")

# ─── Профіль Артема ────────────────────────────────────────────────────────────
# Head of Supply Chain, 5+ років в e-commerce
# Китайський sourcing, 3PL, Amazon FBA/FBM, inventory, customs, COGS, команди

RELEVANT_KEYWORDS = [
    "procurement", "supply chain", "sourcing", "logistics", "operations",
    "operational", "coo", "vp operations", "chief operations",
    "quality assurance", "quality", "qc", "process engineering",
    "lean", "six sigma", "infrastructure optimization",
    "operational excellence", "warehouse", "inventory", "3pl", "freight",
    "customs", "import", "export", "transformation consultant",
    "transformation program", "digital transformation",
    "project manager", "delivery manager", "change consultant",
    "organizational design", "scale-up consultant", "scaling advisor",
    "managing director", "general manager",
]

IRRELEVANT_KEYWORDS = [
    "lawyer", "legal", "counsel", "notary", "compliance",
    "medical", "doctor", "surgeon", "physiotherapist", "gp ", "healthcare practitioner",
    "financial", "finance", "accounting", "accountant", "tax", "treasury",
    "investment", "pension", "insurance", "cfo", "chief financial",
    "software engineer", "developer", "devops", "platform engineer",
    "cyber security", "security architect", "ciso", "cloud architect",
    "machine learning engineer", "mlops", "data scientist",
    "systems architect", "software architect",
    "hr ", "human resources", "chro", "recruiter", "talent acquisition",
    "marketing", "brand", "pr specialist", "journalist", "cmo",
    "sales", "account manager", "business development", "crm",
    "real estate", "realtor",
    "graphic designer", "visual designer", "product designer",
    "architect ", "building", "construction",
    "ai specialist", "ai architect",
    "dutch, german", "french language",
    "eidas", "kyc", "aml", "gdpr", "dora", "nis2",
    "competition law", "intellectual property",
]


def classify(title: str) -> str:
    t = title.lower()

    for kw in RELEVANT_KEYWORDS:
        if kw in t:
            return "To Do"

    for kw in IRRELEVANT_KEYWORDS:
        if kw in t:
            return "Irrelevant"

    return "To Do"  # якщо не зрозуміло — краще залишити для перегляду


def fetch_all_pages(notion: Client, db_id: str) -> list[dict]:
    pages = []
    cursor = None
    while True:
        kwargs = {"database_id": db_id, "page_size": 100}
        if cursor:
            kwargs["start_cursor"] = cursor
        resp = notion.databases.query(**kwargs)
        pages.extend(resp["results"])
        if not resp["has_more"]:
            break
        cursor = resp["next_cursor"]
    return pages


def update_status(notion: Client, page_id: str, status: str):
    notion.pages.update(
        page_id=page_id,
        properties={"Status": {"select": {"name": status}}}
    )


def main():
    if not NOTION_TOKEN or not NOTION_DATABASE_ID:
        print("[ERROR] Перевір .env")
        sys.exit(1)

    notion = Client(auth=NOTION_TOKEN)

    print("Завантажую вакансії з Notion...")
    pages = fetch_all_pages(notion, NOTION_DATABASE_ID)
    print(f"Знайдено: {len(pages)}\n")

    to_do = irrelevant = 0

    for page in pages:
        title_parts = page["properties"].get("Title", {}).get("title", [])
        title = title_parts[0]["text"]["content"] if title_parts else ""
        page_id = page["id"]

        status = classify(title)

        update_status(notion, page_id, status)

        icon = "✅" if status == "To Do" else "❌"
        print(f"  {icon} [{status}] {title[:70]}")

        if status == "To Do":
            to_do += 1
        else:
            irrelevant += 1

    print(f"\n✅ To Do: {to_do} | ❌ Irrelevant: {irrelevant}")


if __name__ == "__main__":
    main()
