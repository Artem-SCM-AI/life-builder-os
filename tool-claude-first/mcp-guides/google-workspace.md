# Google Workspace MCP Setup

**What this enables:** Claude can read and write Google Sheets, Docs, and search Drive.

## Steps

1. Go to console.cloud.google.com → Create a new project (or use existing)
2. Enable **Google Drive API** and **Google Sheets API**
3. Go to **Credentials** → Create credentials → **OAuth 2.0 Client ID** → Desktop app
4. Download the JSON credentials file → save as `credentials.json` in your repo root
5. Open `.mcp.json` → replace `REPLACE_WITH_PATH_TO_credentials.json` with `credentials.json`
6. First run will open a browser for OAuth consent — approve access

## Verify

Open VS Code → Claude Code → type:
```
List my recent Google Drive files
```

## Troubleshoot

- OAuth popup doesn't appear: run `npx @modelcontextprotocol/server-gdrive` in terminal manually
- "credentials.json not found": check the path matches exactly
