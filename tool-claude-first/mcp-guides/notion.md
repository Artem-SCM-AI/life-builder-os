# Notion MCP Setup

**What this enables:** Claude can create pages, databases, tasks, and read your Notion workspace directly from conversation.

## Steps

1. Open notion.com → Settings → Connections → Develop or manage integrations
2. Click **New integration** → give it a name (e.g. "Claude") → Submit
3. Copy the **Internal Integration Token** (starts with `secret_`)
4. Open `.mcp.json` in your repo
5. Replace `REPLACE_WITH_YOUR_NOTION_TOKEN` with your token
6. In each Notion page/database you want Claude to access: open page menu → **Add connections** → select your integration

## Verify

Open VS Code → Claude Code → type:
```
Search my Notion for "test"
```
Claude should respond with search results (or "nothing found").

## Troubleshoot

- "Not authorized": check that you added the integration to specific pages (step 6)
- "Invalid token": re-copy from Notion settings, no extra spaces
