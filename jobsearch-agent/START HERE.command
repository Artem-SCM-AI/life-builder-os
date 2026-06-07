#!/bin/bash
# ─────────────────────────────────────────────────────────────
# Job Search Agent — Smart Installer
# Double-click this file. Terminal opens automatically.
# ─────────────────────────────────────────────────────────────

set -e
INSTALL_DIR="$HOME/.jobsearch"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

clear
echo ""
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo -e "${BLUE}   Job Search Agent — Installer               ${NC}"
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo ""

# ── Step 1: Node.js ───────────────────────────────────────────
echo "Checking Node.js..."
if command -v node &> /dev/null; then
  echo -e "${GREEN}✓ Node.js found ($(node --version))${NC}"
else
  echo -e "${YELLOW}Node.js not found.${NC}"
  echo ""
  echo "Please install Node.js first:"
  echo "  → Go to https://nodejs.org"
  echo "  → Download the LTS version"
  echo "  → Run the installer"
  echo "  → Come back and double-click this file again"
  echo ""
  read -p "Press Enter to open nodejs.org in your browser..."
  open "https://nodejs.org"
  exit 1
fi

# ── Step 2: Claude Code CLI ───────────────────────────────────
echo ""
echo "Checking Claude Code CLI..."
if command -v claude &> /dev/null; then
  echo -e "${GREEN}✓ Claude Code found ($(claude --version 2>/dev/null | head -1))${NC}"
else
  echo "Installing Claude Code CLI..."
  npm install -g @anthropic/claude-code
  echo -e "${GREEN}✓ Claude Code installed${NC}"
fi

# ── Step 3: Login ─────────────────────────────────────────────
echo ""
echo "Checking Claude login..."
if claude whoami &> /dev/null 2>&1; then
  echo -e "${GREEN}✓ Already logged in${NC}"
else
  echo "Opening browser to log in to Claude..."
  echo "(Use your claude.ai account — Pro plan required)"
  echo ""
  claude login
  echo -e "${GREEN}✓ Logged in${NC}"
fi

# ── Step 4: Copy files ────────────────────────────────────────
echo ""
echo "Installing files to $INSTALL_DIR..."
mkdir -p "$INSTALL_DIR"/{agents,scripts,templates,data}
cp "$SCRIPT_DIR/agents/"*.md "$INSTALL_DIR/agents/"
cp "$SCRIPT_DIR/scripts/"*.py "$INSTALL_DIR/scripts/"
cp "$SCRIPT_DIR/templates/"*.md "$INSTALL_DIR/templates/"
cp "$SCRIPT_DIR/run_agent.sh" "$INSTALL_DIR/run_agent.sh"
chmod +x "$INSTALL_DIR/run_agent.sh"
cp "$SCRIPT_DIR/config.env.example" "$INSTALL_DIR/config.env"
touch "$INSTALL_DIR/data/seen_jobs.md"
echo -e "${GREEN}✓ Files installed${NC}"

# ── Step 5: Run setup ─────────────────────────────────────────
echo ""
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo -e "${BLUE}  Ready. Starting your profile setup...      ${NC}"
echo -e "${BLUE}══════════════════════════════════════════════${NC}"
echo ""
read -p "Press Enter to continue..."
bash "$SCRIPT_DIR/setup.sh"
