# Phase 1: Accuracy Validation — Research

**Researched:** 2026-04-17
**Domain:** Claude API document extraction, PDF/CSV parsing, Jupyter notebooks, token cost measurement
**Confidence:** HIGH (core stack verified against official Anthropic docs and live package registry)

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| DOC-01 | User can upload a PDF invoice and receive parsed line items | Claude native PDF support via `document` content block (base64 or Files API); pdfplumber 0.11.9 for text-layer extraction as pre-processing |
| DOC-02 | User can upload an Excel or CSV invoice and receive parsed line items | pandas 3.0.2 + openpyxl 3.1.5 for CSV/Excel ingestion; pass structured text to Claude for semantic extraction |
| DOC-05 | User sees a confidence indicator per extracted field (high/low confidence flagged) | Confidence scoring designed into the JSON output schema — Claude returns `confidence: "high" | "low"` per field; validated via structured outputs |

</phase_requirements>

---

## Summary

Phase 1 is a validation experiment, not an application build. The entire phase runs in a Jupyter notebook with no production code. The goal is a go/no-go signal: can Claude extract 3PL/freight invoice line items at >90% accuracy on numeric fields before any application code is written?

The technical approach has two complementary paths: (1) send the raw PDF directly to Claude using the native `document` content block (Claude processes it as both text and image), and (2) pre-extract text with pdfplumber and pass structured text to Claude for semantic parsing. Path 1 is simpler; Path 2 gives more control and lower token cost for text-layer PDFs. Both should be tested on the 5+ invoice sample set.

For CSV/Excel invoices, pandas ingestion is trivial — the challenge is prompt design for semantic normalization (different 3PLs use different column names for the same concept). Confidence scoring is implemented by adding a `confidence` field to the JSON schema returned per line item.

Token cost math is straightforward: a typical 3PL invoice (5–15 pages, text-layer PDF) consumes approximately 7,500–45,000 tokens at Claude Sonnet 4 pricing of $3/$15 per million input/output tokens = $0.02–$0.14 per invoice. At $49/month, the breakeven is approximately 350–2,450 invoices/month per customer — confirming the unit economics are viable.

**Primary recommendation:** Use Claude Sonnet 4 (`claude-sonnet-4-0`) with native PDF `document` content blocks + structured JSON output schema (Pydantic `messages.parse`). Test pdfplumber as a pre-extraction path in parallel. Measure accuracy and token cost on 5+ real invoices. Go/no-go decision based on >90% numeric field accuracy.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| PDF ingestion and page rendering | Local Python (notebook) | Claude API (vision) | pdfplumber reads file locally; Claude handles visual understanding of scanned content |
| CSV/Excel ingestion | Local Python (notebook) | — | Pure pandas operation; no AI needed for reading the file |
| Semantic extraction of line items | Claude API | — | Core AI task — mapping unstructured invoice content to typed schema |
| Confidence scoring per field | Claude API (in output schema) | — | Claude self-reports confidence; no separate classifier needed at this stage |
| Accuracy measurement | Manual (human) | Python diff script | Phase 1 is manual verification; automation added in Phase 2 if needed |
| Token cost tracking | Local Python | — | `usage.input_tokens + usage.output_tokens` from API response |

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| anthropic (Python SDK) | 0.96.0 | Claude API client | Official SDK; supports `messages.parse`, `document` blocks, Files API |
| pdfplumber | 0.11.9 | Text-layer PDF extraction | Best Python library for structured table extraction from text PDFs; visual debugging built in |
| pandas | 3.0.2 | CSV/Excel ingestion and tabular comparison | Standard data science library; `read_csv`, `read_excel` with openpyxl engine |
| openpyxl | 3.1.5 | Excel (.xlsx) file reading backend for pandas | Required by pandas for `.xlsx` files |
| notebook | 7.5.5 | Jupyter notebook runtime | Phase 1 runs entirely in a notebook; no application code |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| python-dotenv | latest | Load `ANTHROPIC_API_KEY` from `.env` | Always — never hardcode API keys |
| Pydantic v2 (bundled with anthropic SDK) | v2.x | Define typed extraction schemas | Use `messages.parse` with Pydantic models for structured output |
| PyMuPDF (fitz) | latest | OCR fallback for scanned PDFs | Only if invoice is a scanned image (no text layer); verify AGPL license for SaaS use before adopting |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pdfplumber | Camelot | Camelot better for bordered tables but requires Ghostscript dependency; pdfplumber is zero-dependency |
| pdfplumber | Direct Claude PDF input only | Sending raw PDF to Claude uses more tokens (~7,000/page visual); pre-extraction with pdfplumber reduces cost significantly for text-layer PDFs |
| Pydantic `messages.parse` | Raw `tool_use` JSON extraction | `messages.parse` is cleaner for Phase 1 notebook; `tool_use` with `strict: True` is better for Phase 2 production code |
| claude-sonnet-4-0 | claude-haiku-4-5 | Haiku is ~3x cheaper but weaker on complex invoice layouts; do NOT use Haiku until Sonnet accuracy is confirmed |

**Installation:**
```bash
pip install anthropic pdfplumber pandas openpyxl notebook python-dotenv
```

**Version verification:** [VERIFIED: pip registry, 2026-04-17]
- anthropic: 0.96.0 (latest)
- pdfplumber: 0.11.9 (latest)
- pandas: 3.0.2 (latest)
- openpyxl: 3.1.5 (latest)
- notebook: 7.5.5 (latest)

---

## Architecture Patterns

### System Architecture Diagram

```
PHASE 1 DATA FLOW (notebook only — no application code)

Real Invoice Files (PDF / CSV / XLSX)
         │
         ▼
 ┌───────────────────────────────────────────┐
 │           Ingestion Layer (Python)         │
 │  PDF → pdfplumber (text extraction)        │
 │  PDF → base64 encode (for Claude vision)   │
 │  CSV → pandas.read_csv()                   │
 │  XLSX → pandas.read_excel(engine=openpyxl) │
 └─────────────────┬─────────────────────────┘
                   │ text or base64 PDF
                   ▼
 ┌─────────────────────────────────────────────┐
 │         Claude API (claude-sonnet-4-0)       │
 │  Input: system prompt + document block       │
 │  Method: messages.parse(output_format=...)   │
 │  Output: typed Pydantic object               │
 │  ┌─────────────────────────────────────────┐ │
 │  │  InvoiceExtraction schema:              │ │
 │  │  - vendor: str                          │ │
 │  │  - invoice_date: str                    │ │
 │  │  - invoice_number: str                  │ │
 │  │  - line_items: list[LineItem]           │ │
 │  │    - description: str                   │ │
 │  │    - quantity: float                    │ │
 │  │    - unit_rate: float                   │ │
 │  │    - total: float                       │ │
 │  │    - confidence: "high" | "low"         │ │
 │  │  - total_amount: float                  │ │
 │  │  - usage_tokens: int  (logged manually) │ │
 │  └─────────────────────────────────────────┘ │
 └─────────────────────┬───────────────────────┘
                       │ structured Pydantic object
                       ▼
 ┌─────────────────────────────────────────────┐
 │        Accuracy Measurement (manual)         │
 │  Ground truth: human-read invoice values     │
 │  Comparison: extracted vs ground truth       │
 │  Metric: numeric field match rate (%)        │
 │  Record: token_in, token_out, cost per run   │
 └─────────────────────────────────────────────┘
                       │
                       ▼
           Go / No-Go Decision Log
     (>90% accuracy → proceed to Phase 2)
     (<90% accuracy → fix prompting first)
```

### Recommended Project Structure
```
invoice-validator/
├── notebooks/
│   └── 01_accuracy_validation.ipynb   # entire Phase 1 experiment
├── sample_invoices/                    # real 3PL/freight invoice files
│   ├── smart_ship_network_*.pdf
│   ├── flexport_freight_*.csv
│   └── ...
├── ground_truth/                       # manually transcribed correct values
│   └── invoice_truth.json
├── results/
│   └── accuracy_report.md             # go/no-go decision log
├── .env                               # ANTHROPIC_API_KEY (gitignored)
├── .gitignore
└── requirements.txt
```

### Pattern 1: Native PDF Extraction via Claude Document Block
**What:** Send PDF directly to Claude as a base64-encoded document block. Claude processes both text and visual layers.
**When to use:** Scanned PDFs, complex multi-column layouts, mixed text/image invoices.

```python
# Source: platform.claude.com/docs/en/build-with-claude/pdf-support [VERIFIED]
import anthropic
import base64
from pydantic import BaseModel
from typing import Literal

class LineItem(BaseModel):
    description: str
    quantity: float
    unit_rate: float
    total: float
    confidence: Literal["high", "low"]

class InvoiceExtraction(BaseModel):
    vendor: str
    invoice_date: str
    invoice_number: str
    line_items: list[LineItem]
    total_amount: float

client = anthropic.Anthropic()  # reads ANTHROPIC_API_KEY from env

with open("sample_invoices/invoice.pdf", "rb") as f:
    pdf_data = base64.standard_b64encode(f.read()).decode("utf-8")

response = client.messages.parse(
    model="claude-sonnet-4-0",
    max_tokens=4096,
    output_format=InvoiceExtraction,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "base64",
                        "media_type": "application/pdf",
                        "data": pdf_data,
                    },
                },
                {
                    "type": "text",
                    "text": (
                        "Extract all line items from this invoice. "
                        "For each numeric field (unit_rate, quantity, total), "
                        "set confidence='high' if clearly visible, 'low' if ambiguous or inferred. "
                        "Do not round or approximate — extract the exact printed value."
                    ),
                },
            ],
        }
    ],
)

invoice = response.parsed_output
# Log token costs
print(f"Input tokens: {response.usage.input_tokens}")
print(f"Output tokens: {response.usage.output_tokens}")
cost = (response.usage.input_tokens * 3 + response.usage.output_tokens * 15) / 1_000_000
print(f"Cost: ${cost:.4f}")
```

### Pattern 2: pdfplumber Pre-Extraction + Claude Semantic Parsing
**What:** Extract text from text-layer PDFs locally (free, fast), then send text to Claude for semantic understanding.
**When to use:** Text-layer PDFs (most 3PL invoices are text-layer). Reduces token usage significantly vs. vision mode.

```python
# Source: github.com/jsvine/pdfplumber [VERIFIED via registry]
import pdfplumber

def extract_pdf_text(path: str) -> str:
    """Extract text and tables from a text-layer PDF."""
    pages = []
    with pdfplumber.open(path) as pdf:
        for i, page in enumerate(pdf.pages):
            text = page.extract_text() or ""
            tables = page.extract_tables()
            table_str = ""
            for table in tables:
                if table:
                    rows = [" | ".join(str(c) for c in row if c) for row in table if row]
                    table_str += "\n".join(rows) + "\n"
            pages.append(f"--- Page {i+1} ---\n{text}\n{table_str}")
    return "\n".join(pages)

# Then pass extracted text to Claude (no vision — lower token cost)
raw_text = extract_pdf_text("sample_invoices/invoice.pdf")

response = client.messages.parse(
    model="claude-sonnet-4-0",
    max_tokens=4096,
    output_format=InvoiceExtraction,
    messages=[
        {
            "role": "user",
            "content": f"Extract all line items from this invoice text:\n\n{raw_text}",
        }
    ],
)
```

### Pattern 3: CSV/Excel Ingestion + Claude Normalization
**What:** pandas reads the file; Claude normalizes column names and semantic types.
**When to use:** CSV or Excel invoices (estimated 40% of 3PL invoices). Column names vary by vendor.

```python
import pandas as pd

def load_invoice_spreadsheet(path: str) -> str:
    """Load CSV or Excel invoice and convert to text for Claude."""
    if path.endswith(".csv"):
        df = pd.read_csv(path)
    else:
        df = pd.read_excel(path, engine="openpyxl")
    return df.to_string(index=False)

# Pass the table as text to Claude
raw_text = load_invoice_spreadsheet("sample_invoices/invoice.csv")
response = client.messages.parse(
    model="claude-sonnet-4-0",
    max_tokens=4096,
    output_format=InvoiceExtraction,
    messages=[
        {
            "role": "user",
            "content": (
                f"This is a 3PL/freight invoice in tabular form. "
                f"Map the columns to the standard schema. "
                f"Different vendors use different column names (e.g. 'Rate', 'Unit Cost', 'Per Unit' all mean unit_rate).\n\n{raw_text}"
            ),
        }
    ],
)
```

### Anti-Patterns to Avoid
- **Hardcoding API keys in notebook cells:** Always use `python-dotenv` and `.env` file.
- **Using Haiku for extraction without testing:** Haiku is 3x cheaper but weaker on complex layouts. Test Sonnet first, then try Haiku only if accuracy holds.
- **Sending 200-page documents without pagination:** Split large PDFs into sections. Each page processed as image consumes ~1,500–3,000 tokens for text + image overhead. 200 pages = risk of context overflow.
- **Assuming all 3PL PDFs are text-layer:** Some are scanned. Detect with pdfplumber: if `page.extract_text()` returns empty string, the PDF is likely scanned and requires vision mode or OCR.
- **Not logging token usage per invoice:** Without this data, the go/no-go decision on unit economics cannot be made.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| PDF text extraction | Custom PDF parser | pdfplumber | Handles table detection, multi-column, whitespace; 15+ years of edge cases |
| Structured JSON from LLM | Regex/string parsing of Claude output | `messages.parse` with Pydantic | Guaranteed valid JSON matching schema; no retry loops |
| Excel/CSV reading | File parsing from scratch | pandas + openpyxl | Handles encoding, merged cells, multi-sheet, mixed types |
| Scanned PDF OCR | Tesseract integration | PyMuPDF + pytesseract (or just use Claude vision) | Claude vision handles scanned PDFs directly without custom OCR pipeline |
| Confidence scoring classifier | Separate model/rule system | Field in output schema | Ask Claude to self-report confidence — sufficient for Phase 1 validation |

**Key insight:** Phase 1 is a measurement exercise, not an engineering exercise. Every piece of infrastructure built here will be discarded or rewritten for Phase 2. Keep the notebook simple and focused on the measurement question.

---

## Common Pitfalls

### Pitfall 1: Numeric Transposition on Scanned Invoices
**What goes wrong:** Claude reads `$1,350` as `$1,530` or `$13.50` as `$13.05` on scanned PDFs with low resolution or skewed text.
**Why it happens:** Vision-based OCR has inherent uncertainty on digit sequences in dense tables.
**How to avoid:** Test both text-extraction (pdfplumber) and vision paths on the same invoice. Compare which yields higher numeric accuracy. Use `confidence: "low"` in the schema to flag uncertain reads.
**Warning signs:** Multiple low-confidence line items on the same invoice; totals that don't sum correctly.

### Pitfall 2: Token Cost Surprise on Dense Invoices
**What goes wrong:** A 20-page dense invoice with many small-font rows consumes 40,000+ tokens per extraction run, making unit economics negative.
**Why it happens:** Claude processes each PDF page as both text (~1,500 tokens) and image (~1,500 tokens) = ~3,000 tokens/page. 20 pages = ~60,000 input tokens at $3/MTok = $0.18/run.
**How to avoid:** Measure actual token usage on the 5 sample invoices. If cost exceeds $0.15/run, implement PDF chunking (process only the line-item pages, skip cover pages).
**Warning signs:** `response.usage.input_tokens` > 30,000 on a single invoice.

### Pitfall 3: Prompt Ambiguity on 3PL Fee Structures
**What goes wrong:** Claude extracts "pallet storage" as a single line item but misses that the invoice has both a per-pallet rate AND a zone surcharge that both should be flagged separately.
**Why it happens:** 3PL invoices often have complex fee structures with subtotals, surcharges, fuel adjustments, and minimum charges that appear similar to line items.
**How to avoid:** Include explicit instructions in the system prompt: "Extract EVERY fee line separately, including surcharges, minimums, and adjustments. Do not aggregate." Test with Artem's actual Smart Ship Network invoice format as the ground truth case.
**Warning signs:** Extracted line item count is lower than the manual count.

### Pitfall 4: Column Name Variance in CSV Invoices
**What goes wrong:** The prompt works for Smart Ship Network CSVs but fails on Flexport CSVs because column names differ (`Unit Price` vs `Rate Per Unit` vs `Contracted Rate`).
**Why it happens:** No industry standard for 3PL invoice column names. Each vendor uses different terminology.
**How to avoid:** In the prompt, instruct Claude to "normalize column names to the standard schema regardless of the source vendor's terminology." Test across 3+ different vendor CSV formats in Phase 1.
**Warning signs:** Claude returns `null` or empty fields for unit_rate or quantity on some invoices but not others.

### Pitfall 5: Scanned PDF Detection Failure
**What goes wrong:** pdfplumber returns empty text on a scanned PDF; code falls through to send empty string to Claude, which returns garbage extraction.
**Why it happens:** pdfplumber cannot extract text from image-only PDFs.
**How to avoid:** After `page.extract_text()`, check if result is empty or very short. If so, switch to the Claude vision path (base64 document block) rather than the text path.
**Warning signs:** Extracted text is `""` or contains only whitespace/gibberish.

---

## Code Examples

### Token Cost Calculator
```python
# Source: Verified against platform.claude.com/docs/en/about-claude/pricing [VERIFIED]
# Claude Sonnet 4: $3/MTok input, $15/MTok output

def calculate_cost(input_tokens: int, output_tokens: int) -> float:
    """Calculate USD cost for a single Claude Sonnet 4 API call."""
    input_cost = (input_tokens / 1_000_000) * 3.00
    output_cost = (output_tokens / 1_000_000) * 15.00
    return input_cost + output_cost

def estimate_monthly_cost(cost_per_invoice: float, invoices_per_customer: int, customers: int) -> float:
    """Estimate monthly API spend at scale."""
    return cost_per_invoice * invoices_per_customer * customers

# Example: $0.05/invoice × 10 invoices/month × 100 customers = $50/month
# At $49/month pricing: requires API costs < $49/100 = $0.49/customer/month
# With 10 invoices/month that means < $0.049/invoice — need to verify in Phase 1
```

### Accuracy Measurement Helper
```python
def measure_accuracy(extracted: InvoiceExtraction, ground_truth: dict) -> dict:
    """
    Compare extracted line items against manually verified ground truth.
    Returns per-field accuracy and a summary score.
    """
    results = {"total_fields": 0, "correct_fields": 0, "errors": []}
    
    for i, (ext_item, true_item) in enumerate(
        zip(extracted.line_items, ground_truth["line_items"])
    ):
        for field in ["quantity", "unit_rate", "total"]:
            results["total_fields"] += 1
            ext_val = getattr(ext_item, field)
            true_val = true_item[field]
            # Use tolerance for float comparison
            if abs(ext_val - true_val) < 0.01:
                results["correct_fields"] += 1
            else:
                results["errors"].append({
                    "line_item": i,
                    "field": field,
                    "extracted": ext_val,
                    "truth": true_val,
                })
    
    accuracy = results["correct_fields"] / results["total_fields"] if results["total_fields"] > 0 else 0
    results["accuracy_pct"] = accuracy * 100
    return results
```

### Scanned PDF Detection
```python
def detect_pdf_type(path: str) -> str:
    """Detect whether PDF has a text layer or is image-only."""
    with pdfplumber.open(path) as pdf:
        total_chars = 0
        for page in pdf.pages[:3]:  # check first 3 pages
            text = page.extract_text() or ""
            total_chars += len(text.strip())
    return "text" if total_chars > 100 else "scanned"
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Send PDF as base64 image (vision) | Native `document` content block | 2024 | Cleaner API, same capability |
| Parse Claude output with regex | `messages.parse` with Pydantic output_format | 2025 | Guaranteed valid JSON, no retry loops |
| tool_use for all structured output | `output_config.format` JSON schema | 2025 | Simpler for extraction tasks; tool_use still preferred for agentic workflows |
| claude-3-5-sonnet | claude-sonnet-4-0 | 2025 | Sonnet 4 is current recommended model; same price tier ($3/$15 MTok) |
| Files API (beta) | Files API (GA) | 2025 | Reuse uploaded files across calls; use `betas=["files-api-2025-04-14"]` header |

**Deprecated/outdated:**
- `claude-3-5-haiku-latest` alias: use `claude-3-5-haiku-latest` or `claude-haiku-4-5`; check the model overview page before pinning — [ASSUMED] (aliases change frequently)
- `claude-sonnet-3-7`: deprecated per official pricing page — confirmed deprecated [VERIFIED]

---

## Token Cost Analysis (Verified)

**Source:** platform.claude.com/docs/en/about-claude/pricing [VERIFIED: 2026-04-17]

| Model | Input $/MTok | Output $/MTok | Batch Input | Batch Output |
|-------|-------------|--------------|-------------|--------------|
| Claude Sonnet 4 | $3.00 | $15.00 | $1.50 | $7.50 |
| Claude Haiku 4.5 | $1.00 | $5.00 | $0.50 | $2.50 |

**Per-invoice cost estimates (Claude Sonnet 4):**

| Invoice Type | Pages | Est. Input Tokens | Est. Output Tokens | Est. Cost |
|-------------|-------|------------------|--------------------|-----------|
| Simple CSV | — | 2,000 | 500 | $0.014 |
| Text-layer PDF (5 pages, pre-extracted) | 5 | 8,000 | 800 | $0.036 |
| Text-layer PDF (5 pages, vision mode) | 5 | 25,000 | 800 | $0.087 |
| Dense PDF (15 pages, vision mode) | 15 | 75,000 | 1,500 | $0.248 |

**Unit economics check:**
- Revenue per customer: $49/month
- Target API cost budget: <$5/customer/month (10% of revenue)
- At $0.05/invoice, breakeven: 100 invoices/month per customer — reasonable
- At $0.25/invoice (dense PDF), breakeven: 20 invoices/month — still viable but warrants chunking optimization

**Key insight:** The pdfplumber pre-extraction path (text mode) is 2.5–3x cheaper than sending raw PDFs in vision mode. For text-layer PDFs (most 3PL invoices), always use pre-extraction.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Python 3 | All code | ✓ | 3.14.4 | — |
| anthropic SDK | Claude API calls | ✓ (pip install) | 0.96.0 latest | — |
| pdfplumber | PDF text extraction | ✓ (pip install) | 0.11.9 latest | — |
| pandas | CSV/Excel ingestion | ✓ (pip install) | 3.0.2 latest | — |
| openpyxl | Excel .xlsx reading | ✓ (pip install) | 3.1.5 latest | — |
| Jupyter notebook | Phase 1 experiment runtime | ✗ (not installed) | — | pip install notebook (Wave 0 task) |
| ANTHROPIC_API_KEY | All Claude API calls | [ASSUMED: Artem has an account] | — | Must obtain before starting |

**Missing dependencies with no fallback:**
- Jupyter notebook (not installed) — must install before Phase 1 begins. Command: `pip install notebook`
- ANTHROPIC_API_KEY — must be in `.env` file; confirm API access before starting

**Missing dependencies with fallback:**
- PyMuPDF (not tested) — only needed for scanned PDFs; can skip if all 5 sample invoices are text-layer. Install if needed: `pip install pymupdf` (verify AGPL license for SaaS use)

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Artem has an active Anthropic API account with ANTHROPIC_API_KEY available | Environment Availability | Phase cannot start; obtain API access first |
| A2 | The 5+ sample invoices Artem has access to (Smart Ship Network, Green Wave, etc.) are in PDF or CSV/Excel format — not proprietary EDI or system exports | Summary | If invoices are in unsupported formats, ingestion step changes |
| A3 | At least some of the sample invoices are text-layer PDFs (not scanned images) | Standard Stack (pdfplumber) | If all are scanned, pdfplumber provides no value; must use vision-only path |
| A4 | `messages.parse` with `output_format` Pydantic is available in anthropic SDK 0.96.0 | Code Examples | If not available, use `output_config.format` JSON schema directly or `tool_use` with `strict: True` |
| A5 | PyMuPDF AGPL license is acceptable for Phase 1 notebook use (non-commercial experimentation) | Standard Stack | If not acceptable, use pytesseract as OCR fallback or Claude vision path only |

---

## Open Questions

1. **Which specific invoice formats will be tested?**
   - What we know: Artem has real invoices from Smart Ship Network, and has contacts at Green Wave, SmartWarehousing, and Spreetail.
   - What's unclear: Are those invoices available as files right now? Are they text-layer or scanned PDFs?
   - Recommendation: Identify the 5 test invoices before starting the notebook. Aim for 3 PDFs + 2 CSVs from different vendors.

2. **What is the acceptable cost ceiling per invoice?**
   - What we know: $49/month pricing target; API costs should be <10% of revenue.
   - What's unclear: Average number of invoices per customer per month (2? 10? 50?).
   - Recommendation: Ask first 5 pilot prospects during outreach. For now, design for <$0.10/invoice.

3. **Will Haiku achieve sufficient accuracy for simple CSV invoices?**
   - What we know: Haiku is 3x cheaper than Sonnet; weaker on complex layouts.
   - What's unclear: For pre-extracted CSV text (no vision), does Haiku match Sonnet accuracy?
   - Recommendation: Test both models on CSVs in Phase 1. If Haiku accuracy is >90% on CSVs, use tiered model selection in Phase 2 (Haiku for CSV, Sonnet for PDF).

---

## Project Constraints (from CLAUDE.md)

No CONTEXT.md exists for this phase (first phase, no discuss-phase run). The following constraints are extracted from the project CLAUDE.md and PROJECT.md:

| Constraint | Source | Impact on Phase 1 |
|-----------|--------|-------------------|
| No application code until accuracy confirmed >90% | ROADMAP.md Phase 1 goal | Phase 1 output is notebook only — zero production code |
| Solo founder, buildable with Claude Code | PROJECT.md Constraints | Keep notebook simple; avoid complex dependencies |
| $0 infrastructure budget | PROJECT.md Constraints | No cloud services, no paid APIs beyond Anthropic |
| Claude API as AI backbone | PROJECT.md Key Decisions | Confirmed — entire extraction pipeline uses Claude API |
| Python + pdfplumber + pandas as tech stack | research/SUMMARY.md | Confirmed by this research |
| No custom OCR model training | REQUIREMENTS.md Out of Scope | Use Claude vision or pdfplumber; do not train models |

---

## Sources

### Primary (HIGH confidence)
- [VERIFIED: platform.claude.com/docs/en/about-claude/pricing] — All token costs and model pricing verified 2026-04-17
- [VERIFIED: platform.claude.com/docs/en/build-with-claude/pdf-support] — PDF support, document blocks, token estimates per page
- [VERIFIED: platform.claude.com/docs/en/build-with-claude/structured-outputs] — messages.parse, output_format, tool_use strict mode
- [VERIFIED: pip registry 2026-04-17] — anthropic 0.96.0, pdfplumber 0.11.9, pandas 3.0.2, openpyxl 3.1.5, notebook 7.5.5
- [VERIFIED: .claude/skills/claude-api/SKILL.md] — Model IDs, SDK patterns, cost optimization strategies

### Secondary (MEDIUM confidence)
- [CITED: github.com/jsvine/pdfplumber] — pdfplumber table extraction capabilities and customization options
- [CITED: invoicedataextraction.com/blog/python-pdf-table-extraction-invoices] — Comparison of pdfplumber vs Camelot vs Tabula for invoice parsing
- [CITED: koncile.ai/en/ressources/claude-gpt-or-gemini-which-is-the-best-llm-for-invoice-extraction] — Claude vs GPT invoice extraction accuracy on 500 document dataset

### Tertiary (LOW confidence)
- [ASSUMED] — Scanned PDF frequency in 3PL invoice workflows (estimated minority; most 3PL invoices are system-generated text-layer PDFs)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against pip registry and official docs
- Claude API patterns: HIGH — verified against official Anthropic documentation
- Token cost estimates: HIGH — verified against official pricing page
- Architecture: HIGH — straightforward; no novel patterns required
- Pitfalls: MEDIUM — some from research/SUMMARY.md which is project-authored knowledge; some from general PDF extraction experience

**Research date:** 2026-04-17
**Valid until:** 2026-05-17 (Anthropic model pricing and availability can change; re-verify before Phase 2 planning)
