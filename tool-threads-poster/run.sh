#!/bin/bash
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

ACCOUNT="${1:-monetizer-biz}"
CONFIG="config.${ACCOUNT}.env"

if [ ! -f "$CONFIG" ]; then
    echo "Config not found: $CONFIG"
    exit 1
fi

if [ ! -d ".venv" ]; then
    python3 -m venv .venv
    source .venv/bin/activate
    pip install -r requirements.txt -q
fi

source .venv/bin/activate
python poster.py --config "$CONFIG" --account "$ACCOUNT"
