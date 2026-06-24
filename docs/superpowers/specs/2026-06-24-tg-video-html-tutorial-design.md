# Design: TG Video Tutorial — HTML Presentation with Claude Code

**Date:** 2026-06-24  
**Status:** Approved  

---

## Goal

Produce a recorded tutorial video for Telegram channel "The Life Builder OS" showing how to build an 8-bit themed HTML presentation using Claude Code. Response to audience requests after Lukyan football training presentation was shared.

## Decisions

| Dimension | Decision | Rationale |
|-----------|----------|-----------|
| Recording tool | Loom | Free, one-click, mp4 output, no editing needed |
| Platform | Telegram channel (horizontal) | Where the audience asked |
| Duration | 8–10 min | Enough for full walkthrough without padding |
| Approach | Live build from scratch | Authentic, audience sees real process |
| Camera | Screen + webcam bubble | Personal connection without full talking head |
| Topic | Presentation about "how to build presentations" | Meta angle — content = tutorial |
| Visual style | 8-bit retro (NES / Super Mario / Contra) | Memorable, stands out from typical slides |
| Special element | Token limits shown before and after | Transparency about real Claude Code cost |

## Video Structure

10 blocks, ~9 minutes total. See full script: `script-tg-video-html-tutorial.md`

1. Hook — show Lukyan presentation, state intent (0:30)
2. Lock in limits — screenshot Claude Code usage (0:30)
3. Prompt 1 — structure, open raw HTML in browser (1:30)
4. Prompt 2 — 8-bit design, refresh and react (1:00)
5. Prompt 3 — copyable code block, detail fixes (1:30)
6. Live fixes — whatever breaks on camera, fix it (1:30)
7. Final walkthrough — all 10 slides (1:00)
8. Git push — 3 commands, show GitHub Pages live (1:00)
9. Limits after — show token cost (0:20)
10. Outro — links in description (0:20)

## Prompts

Three staged prompts: structure → design → details. Full text in script file.

## Deliverable

- Script file: `script-tg-video-html-tutorial.md`
- Video: recorded via Loom, downloaded as mp4, posted to TG channel
