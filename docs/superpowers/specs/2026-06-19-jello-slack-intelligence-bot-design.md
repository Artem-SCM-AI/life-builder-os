# Jello Slack Intelligence Bot — Design Spec

**Date:** 2026-06-19  
**Status:** Approved  
**Context:** Jello/Accommerce SC operations. Slack workspace → ClickUp task creation + Google Sheets archive.

---

## Problem

All Accommerce team communication happens in Slack. Action items, decisions, and requests get buried in threads. Artem misses tasks that should be in ClickUp, and incoming questions sit unanswered for too long.

## Goal

A real-time Slack bot that:
1. Reads every message across all channels and DMs
2. Classifies messages by type using Claude Haiku
3. Proposes ClickUp tasks (user confirms with ✅)
4. Drafts reply suggestions for messages directed at Artem (user sends with ✅)
5. Logs all messages to Google Sheets as company backlog

---

## Architecture

```
Slack (all channels + DMs)
        │
        ▼
  FastAPI server (Railway)
        │
        ├─── Verify Slack signature (security)
        ├─── Ignore bot messages (prevent loops)
        │
        ├─── Claude Haiku → classify + extract fields
        │
        ├─── Google Sheets ← all messages (Slack Log)
        │
        ├─── action_item → thread reply → reaction ✅ → ClickUp task created
        │
        └─── reply_needed → DM to Artem → reaction ✅ → bot sends reply in channel
```

---

## Message Classification

Claude Haiku classifies each incoming message into one or more of these types:

| Type | Trigger | Action |
|------|---------|--------|
| `action_item` | A task for someone to do | Bot replies in thread with proposed ClickUp task → ✅ to create |
| `decision` | A decision was made | Logged to Sheets only |
| `reply_needed` | Question/request directed at Artem (DM or @mention) | DM to Artem with draft reply → ✅ to send |
| `info` | Informational update | Logged to Sheets only |
| `noise` | Small talk, emoji-only, reactions | Ignored |

A single message can be both `action_item` and `reply_needed` simultaneously.

---

## Flow 1: Action Item → ClickUp

1. Incoming message classified as `action_item`
2. Claude extracts: title, description, suggested assignee, priority
3. Bot replies in the same Slack thread:
   ```
   🎯 Action item detected:
   **[title]**
   [1-line context]
   React ✅ to create in ClickUp · ❌ to dismiss
   ```
4. Artem (or anyone) reacts ✅ → `reaction_added` event triggers ClickUp task creation
5. Task created in **Slack Backlog** list (Supply Chain space), status: `To Do`
6. Task fields: name, description, Slack message permalink, channel, sender, date, tags: `source:slack` + channel name
7. Bot confirms in thread: "✅ Task created: [ClickUp link]"

---

## Flow 2: Reply Draft → Send

1. Incoming message classified as `reply_needed` (DM to Artem, @artem mention, or clear question expecting his response)
2. Claude drafts a contextually appropriate reply (English, professional, concise)
3. Bot sends **private DM to Artem**:
   ```
   📩 Reply needed — [Sender] in [#channel / DM]:
   "[original message]"

   ✏️ Draft:
   "[suggested reply text]"

   React ✅ to send via bot · or copy-paste above to send yourself
   ```
4. Two modes available per message — Artem chooses:
   - **Copy-paste mode (default):** draft sits in DM, Artem copies the text and sends himself from his own Slack account
   - **Auto-send mode:** Artem reacts ✅ → bot posts the draft in the original channel/thread from its own account ("Jello Assistant")
5. If Artem reacts ✏️ (pencil) → bot waits; Artem's next reply in this DM thread replaces the draft, then ✅ sends it via bot

---

## Flow 3: Sheets Logging

Every message (except `noise`) is appended to Google Sheets "Slack Log":

| Column | Value |
|--------|-------|
| Timestamp | ISO 8601 |
| Channel | channel name |
| Author | display name |
| Message | full text |
| Classification | action_item / decision / reply_needed / info |
| Task Created | ClickUp task ID or blank |
| Task URL | ClickUp link or blank |
| Slack Permalink | link to original message |

---

## Components

```
jello-slack-bot/
├── main.py              # FastAPI app, Slack event router
├── classifier.py        # Claude Haiku: classify + extract task/reply fields
├── clickup.py           # ClickUp API client (create task, link back)
├── sheets.py            # Google Sheets API client (append row)
├── slack_client.py      # Slack Web API (reply in thread, DM Artem, send reply)
├── config.py            # Env vars loading + validation
├── requirements.txt
└── railway.toml         # Railway deploy config
```

---

## Environment Variables

| Variable | Description |
|----------|-------------|
| `SLACK_BOT_TOKEN` | Bot OAuth token (xoxb-…) |
| `SLACK_SIGNING_SECRET` | For webhook signature verification |
| `ANTHROPIC_API_KEY` | Claude Haiku API |
| `CLICKUP_TOKEN` | Existing token from `$CLICKUP_TOKEN` |
| `CLICKUP_LIST_ID` | New "Slack Backlog" list ID in Supply Chain space |
| `GOOGLE_SHEETS_ID` | Slack Log spreadsheet ID |
| `GOOGLE_SERVICE_ACCOUNT_JSON` | Service account credentials (Railway env) |
| `ARTEM_SLACK_USER_ID` | Artem's Slack user ID for DM routing |

---

## Slack App Permissions Required

**Bot Token Scopes:**
- `channels:history` — read public channel messages
- `groups:history` — read private channel messages
- `im:history` — read DMs
- `im:write` — send DMs to Artem
- `chat:write` — post messages and replies
- `reactions:read` — detect ✅ confirmations
- `users:read` — resolve user display names

**Event Subscriptions:**
- `message.channels`
- `message.groups`
- `message.im`
- `reaction_added`

---

## Deployment

- **Platform:** Railway (single dyno, ~$5/month)
- **Endpoint:** `POST /slack/events` (Slack webhook)
- **Health check:** `GET /health`
- **Slack URL verification:** handled on first deploy (challenge response)

---

## Claude Haiku Prompt Strategy

Single call per message. System prompt includes:
- Jello/Accommerce context (SC company, key people: Clemens, Andrei, Malcolm, Raj, Ziyao)
- Artem's Slack user ID so model knows when to flag `reply_needed`
- Output format: JSON `{ classification: [...], task?: {...}, reply_draft?: "..." }`

Cost estimate: ~$0.001 per message (Haiku input pricing). At 500 messages/day → ~$0.50/day.

---

## Out of Scope

- Auto-sending replies without confirmation
- Reading message history on startup (only new messages from deploy)
- Editing or deleting Slack messages
- Multi-workspace support
- Team-facing Q&A (other team members asking the bot directly) — deferred to v2
