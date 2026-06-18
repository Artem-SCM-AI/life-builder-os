# Claude Memory Optimization Guide

How to structure context so Claude remembers what matters across sessions and within long conversations.

---

## Why Claude "Forgets"

Three root causes:

**1. Duplication between CLAUDE.md and memory files.**
CLAUDE.md loads every session. If it contains content already in memory files, both compete for attention — neither wins.

**2. Files too large.**
Files over 4–5KB get read in full but retained partially. Content at the bottom of a long file is the first to disappear when context compresses.

**3. Design/product details not structured.**
Hex codes, fonts, product prices, URLs — scattered across files or only in code. In long sessions, they vanish.

---

## Four-Level Architecture

```
Level 1: CLAUDE.md          — Always loaded. Rules + pointers only. Max 80 lines.
Level 2: MEMORY.md index    — Always loaded. Sharp triggers per file. Max 200 lines.
Level 3: Memory files       — Loaded on demand. Max 3KB each. One topic per file.
Level 4: Project files      — Read when needed. Design tokens, specs, code.
```

---

## Level 1 — CLAUDE.md Rules

**Keep:**
- Workflow rules (GSD entry points, file naming convention)
- Communication rules (language, format preferences)
- Pointers to memory files by topic

**Remove:**
- Biographical content → already in `user_profile.md`
- 3PL rates → already in `reference_data.md`
- Product models / COGS targets → already in `reference_data.md`
- Anything that duplicates a memory file

**Target:** Under 80 lines. No prose. No repeated facts.

---

## Level 2 — MEMORY.md Triggers

Each line in MEMORY.md must answer: "When would Claude need this?"

**Bad trigger:**
```
- [brand_voice_life_builder_os.md] — Brand voice guidelines
```

**Good trigger:**
```
- [brand_voice_rules.md] — Load when writing Threads/LinkedIn posts, TOV review, or any @monetizer_biz content
```

**Rule:** If you can't write a specific trigger in one line, the file covers too many topics. Split it.

---

## Level 3 — Memory File Rules

| Rule | Standard |
|------|----------|
| Max size | 3KB (~60–80 lines) |
| Topics per file | 1 |
| Structure | Fact first → Why → How to apply |
| Update frequency | After any confirmed change to what the file covers |

**When a file exceeds 3KB:** split by sub-topic. Each part becomes its own file with its own trigger.

**Example split for brand_voice_life_builder_os.md (9.3KB → 3 files):**
- `brand_voice_rules.md` — DO / AVOID rules only
- `brand_voice_content_types.md` — content type table + AI prompts
- `brand_threads_ops.md` — posting mechanics (volume, timing, bio, pinned reply)

---

## Level 4 — Design Tokens File

Create one file per product line with all visual specs. Read at the start of any UI task.

**File:** `ref-design-tokens.md`

**Structure per product/brand:**
```markdown
## Life Builder OS / Gumroad Products
Font: Inter
Primary blue: #2563EB
Background: #FFFFFF
Breakpoints: 768px (tablet), 480px (mobile)
Quiz scale: 0=red #EF4444, 1=orange #F97316, 2=yellow #EAB308, 3=lime #84CC16, 4=green #22C55E

## [Next product brand]
...
```

**Rule:** Every time a new color, font, or breakpoint is added to a product — update this file immediately.

---

## Maintenance Protocol

### After each session where something was "forgotten":

1. Identify what was forgotten.
2. Find where it *should* have been — memory file, CLAUDE.md, or design tokens.
3. Either: add it there, or ask Claude: *"Save this to memory: [fact]"*.

### Monthly check:

- Review MEMORY.md index. Remove entries for completed tasks or outdated facts.
- Check any memory file over 3KB. Split if needed.
- Verify CLAUDE.md stays under 80 lines.

### When adding a new product or brand:

1. Create a memory file: `project_[product_name].md`
2. Add its design tokens to `ref-design-tokens.md`
3. Add a trigger line to MEMORY.md

---

## Implementation Priority

| Step | Action | Impact |
|------|--------|--------|
| 1 | Create `ref-design-tokens.md` with all current hex codes + fonts | High — fixes UI forgetting immediately |
| 2 | Split `brand_voice_life_builder_os.md` into 3 files | High — 9.3KB file is too large |
| 3 | Rewrite MEMORY.md trigger lines | Medium — improves when files are loaded |
| 4 | Trim CLAUDE.md — remove duplicated biographical content | Medium — reduces noise per session |
| 5 | Audit all memory files over 3KB | Low — ongoing maintenance |

---

## Telling Claude What to Remember

Say: *"Запам'ятай: [факт]"* or *"Save to memory: [fact]"*

Claude will create or update the appropriate memory file and add a pointer to MEMORY.md.

If Claude saves something wrong or incomplete — correct it immediately in the same session. Memory files are only as good as what gets written into them.
