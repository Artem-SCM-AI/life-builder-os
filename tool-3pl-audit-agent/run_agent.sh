#!/bin/bash
export PATH="/Users/$USER/.local/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

AGENT="${1:-3pl_audit}"
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
AGENTS_DIR="$BASE_DIR/agents"
DATA_DIR="$BASE_DIR/data"
LOG="$DATA_DIR/${AGENT}.log"

if [ "$AGENT" = "3pl_audit" ]; then
  PROMPT_FILE="$AGENTS_DIR/3pl_audit_agent.md"
else
  echo "Unknown agent: $AGENT"
  exit 1
fi

if [ ! -f "$PROMPT_FILE" ]; then
  echo "Prompt file not found: $PROMPT_FILE"
  exit 1
fi

echo "=== [$AGENT] $(date '+%Y-%m-%d %H:%M:%S') ===" >> "$LOG"
(cd "$BASE_DIR" && claude \
  --allowedTools "Write Read Bash" \
  --permission-mode bypassPermissions \
  -p "$(cat "$PROMPT_FILE")") >> "$LOG" 2>&1
echo "=== done (exit:$?) $(date '+%H:%M:%S') ===" >> "$LOG"
