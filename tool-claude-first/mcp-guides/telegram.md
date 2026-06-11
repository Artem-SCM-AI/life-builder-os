# Telegram MCP Setup

**What this enables:** Claude can send messages, read chats, and interact with Telegram on your behalf.

## Steps

1. Open Telegram → search for **@BotFather**
2. Send `/newbot` → follow prompts → get your bot token (format: `123456789:ABCdef...`)
3. Open `.mcp.json` → replace `REPLACE_WITH_YOUR_BOT_TOKEN` with your token
4. Add your bot to any chat/channel where you want Claude to operate

## Verify

Open VS Code → Claude Code → type:
```
Send "test" to my bot chat
```

## Troubleshoot

- Bot not responding: make sure you started a conversation with the bot first (send it `/start`)
- "Chat not found": bot must be a member of the target chat
