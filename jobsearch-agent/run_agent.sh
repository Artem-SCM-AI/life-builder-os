#!/bin/bash
# Job Search Agent — Universal Runner
# Usage: run_agent.sh <jobs|orchestrator>

AGENT="${1:-jobs}"
INSTALL_DIR="$HOME/.jobsearch"
LOG_FILE="$INSTALL_DIR/data/${AGENT}.log"
AGENT_FILE="$INSTALL_DIR/agents/${AGENT}_agent.md"

if [ ! -f "$AGENT_FILE" ]; then
  echo "$(date): ERROR — agent file not found: $AGENT_FILE" >> "$LOG_FILE"
  exit 1
fi

source "$INSTALL_DIR/config.env" 2>/dev/null

TOOLS="Bash,Read,Write,WebSearch,mcp__plugin_marketing_notion__*"
if [ "$AGENT" = "orchestrator" ]; then
  TOOLS="Bash,Read,mcp__plugin_marketing_notion__*"
fi

echo "$(date): Starting $AGENT agent" >> "$LOG_FILE"

cd "$INSTALL_DIR" && claude \
  --allowedTools "$TOOLS" \
  --permission-mode bypassPermissions \
  -p "$(cat "$AGENT_FILE")" \
  >> "$LOG_FILE" 2>&1

EXIT_CODE=$?
echo "$(date): $AGENT agent finished (exit: $EXIT_CODE)" >> "$LOG_FILE"
exit $EXIT_CODE
