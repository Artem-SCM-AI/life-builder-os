"""Extract all href links from the hypergrowth research site."""

import asyncio
from playwright.async_api import async_playwright


async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page()
        await page.goto("https://sevaustinov.me/hypergrowth-research/", wait_until="networkidle")
        await page.wait_for_timeout(2000)

        links = await page.evaluate("""
            () => {
                const anchors = document.querySelectorAll('a[href]');
                return Array.from(anchors).map(a => ({
                    text: a.innerText.trim().slice(0, 80),
                    href: a.href
                })).filter(l => l.href && l.href !== '#');
            }
        """)

        print("All links on the page:\n")
        for link in links:
            print(f"  [{link['text']}] → {link['href']}")

        await browser.close()


asyncio.run(main())
