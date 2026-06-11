# GitHub MCP Setup

**What this enables:** Claude can read/write files in your GitHub repos, create issues, and manage code.

## Steps

1. Open github.com → Settings → Developer settings → Personal access tokens → **Tokens (classic)**
2. Generate new token → select scopes: `repo`, `read:org`
3. Copy the token (shown once — save it)
4. Open `.mcp.json` → replace `REPLACE_WITH_YOUR_PAT` with your token

## Verify

Open VS Code → Claude Code → type:
```
List my GitHub repositories
```

## Troubleshoot

- "Bad credentials": token may have expired — generate a new one
- Repos not showing: check that `repo` scope was selected
