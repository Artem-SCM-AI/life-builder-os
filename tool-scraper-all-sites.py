"""
Scrape ALL pages of sevaustinov.me/hypergrowth-research/ using real URLs.
Saves each page as a text file in hypergrowth_pages/.
"""

import asyncio
import re
from pathlib import Path
from playwright.async_api import async_playwright

PAGES = [
    # Indexes
    ("growth-laws-index", "https://sevaustinov.me/hypergrowth-research/insights/growth-laws.html"),
    ("sales-laws-index", "https://sevaustinov.me/hypergrowth-research/insights/sales-laws.html"),
    ("archetypes", "https://sevaustinov.me/hypergrowth-research/insights/archetypes.html"),
    ("cross-insights", "https://sevaustinov.me/hypergrowth-research/insights/cross-insights.html"),
    ("pattern-matrix", "https://sevaustinov.me/hypergrowth-research/data/pattern-matrix.html"),
    ("comparison-tables", "https://sevaustinov.me/hypergrowth-research/data/comparison-tables.html"),
    ("methodology", "https://sevaustinov.me/hypergrowth-research/insights/methodology.html"),
    # Growth Law detail pages
    ("gl1-wedge-clarity", "https://sevaustinov.me/hypergrowth-research/insights/laws/wedge-clarity.html"),
    ("gl2-prestige-first", "https://sevaustinov.me/hypergrowth-research/insights/laws/prestige-first.html"),
    ("gl3-domain-expert-gtm", "https://sevaustinov.me/hypergrowth-research/insights/laws/domain-expert-gtm.html"),
    ("gl4-proof-before-scale", "https://sevaustinov.me/hypergrowth-research/insights/laws/proof-before-scale.html"),
    ("gl5-labor-budget-pricing", "https://sevaustinov.me/hypergrowth-research/insights/laws/labor-budget-pricing.html"),
    ("gl6-expansion-flywheel", "https://sevaustinov.me/hypergrowth-research/insights/laws/expansion-flywheel.html"),
    # Sales Law detail pages
    ("sl1-founder-sells-first", "https://sevaustinov.me/hypergrowth-research/insights/sales-laws/founder-sells-first.html"),
    ("sl2-demo-against-own-work", "https://sevaustinov.me/hypergrowth-research/insights/sales-laws/demo-against-own-work.html"),
    ("sl3-wtp-as-qualification", "https://sevaustinov.me/hypergrowth-research/insights/sales-laws/wtp-as-qualification.html"),
    ("sl4-paid-pilot-structure", "https://sevaustinov.me/hypergrowth-research/insights/sales-laws/paid-pilot-structure.html"),
    ("sl5-objector-as-champion", "https://sevaustinov.me/hypergrowth-research/insights/sales-laws/objector-as-champion.html"),
    ("sl6-practitioner-pull", "https://sevaustinov.me/hypergrowth-research/insights/sales-laws/practitioner-pull.html"),
    # Company profiles
    ("co-abridge", "https://sevaustinov.me/hypergrowth-research/companies/abridge.html"),
    ("co-cognition", "https://sevaustinov.me/hypergrowth-research/companies/cognition.html"),
    ("co-decagon", "https://sevaustinov.me/hypergrowth-research/companies/decagon.html"),
    ("co-deel", "https://sevaustinov.me/hypergrowth-research/companies/deel.html"),
    ("co-glean", "https://sevaustinov.me/hypergrowth-research/companies/glean.html"),
    ("co-gong", "https://sevaustinov.me/hypergrowth-research/companies/gong.html"),
    ("co-harvey", "https://sevaustinov.me/hypergrowth-research/companies/harvey.html"),
    ("co-hebbia", "https://sevaustinov.me/hypergrowth-research/companies/hebbia.html"),
    ("co-incident-io", "https://sevaustinov.me/hypergrowth-research/companies/incident-io.html"),
    ("co-intercom-fin", "https://sevaustinov.me/hypergrowth-research/companies/intercom-fin.html"),
    ("co-legora", "https://sevaustinov.me/hypergrowth-research/companies/legora.html"),
    ("co-listen-labs", "https://sevaustinov.me/hypergrowth-research/companies/listen-labs.html"),
    ("co-moveworks", "https://sevaustinov.me/hypergrowth-research/companies/moveworks.html"),
    ("co-ramp", "https://sevaustinov.me/hypergrowth-research/companies/ramp.html"),
    ("co-sierra", "https://sevaustinov.me/hypergrowth-research/companies/sierra.html"),
    ("co-wiz", "https://sevaustinov.me/hypergrowth-research/companies/wiz.html"),
    ("co-writer", "https://sevaustinov.me/hypergrowth-research/companies/writer.html"),
]

OUTPUT_DIR = Path("hypergrowth_pages")


def clean_text(text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r" {2,}", " ", text)
    return text.strip()


async def scrape_page(page, url: str) -> str:
    await page.goto(url, wait_until="networkidle", timeout=30000)
    await page.wait_for_timeout(1500)

    content = await page.evaluate("""
        () => {
            const remove = document.querySelectorAll('nav, header, footer, script, style');
            remove.forEach(el => el.remove());
            const selectors = ['main', 'article', '[role="main"]', '.content', '#content', 'body'];
            for (const sel of selectors) {
                const el = document.querySelector(sel);
                if (el && el.innerText && el.innerText.trim().length > 100) {
                    return el.innerText;
                }
            }
            return document.body.innerText;
        }
    """)
    return clean_text(content)


async def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    success, failed = 0, 0

    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
        )
        page = await context.new_page()

        for slug, url in PAGES:
            try:
                content = await scrape_page(page, url)
                if "NOT_FOUND" in content or len(content) < 150:
                    print(f"  ❌ [{slug}] — 404 or empty ({len(content)} chars)")
                    failed += 1
                    continue
                out_file = OUTPUT_DIR / f"{slug}.txt"
                out_file.write_text(content, encoding="utf-8")
                print(f"  ✅ [{slug}] — {len(content):,} chars")
                success += 1
            except Exception as e:
                print(f"  ❌ [{slug}] — Error: {e}")
                failed += 1

        await browser.close()

    print(f"\n{'='*40}")
    print(f"Done: {success} saved, {failed} failed")
    print(f"Files in: {OUTPUT_DIR.resolve()}")


asyncio.run(main())
