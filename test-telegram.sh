#!/bin/bash

set -euo pipefail

# Simple Telegram test runner for scripts/testTelegramConnection.js
# Usage examples:
#   bash scripts/test-telegram.sh --token "1234:abcd" --chat "987654321"
#   bash scripts/test-telegram.sh --text "Thông báo thử nghiệm"
#   TELEGRAM_BOT_TOKEN=1234:abcd TELEGRAM_CHAT_ID=987654321 bash scripts/test-telegram.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

TOKEN="${TELEGRAM_BOT_TOKEN:-}"
CHAT_ID="${TELEGRAM_CHAT_ID:-}"
TEXT="Ping kiểm tra kết nối Telegram từ MIA Logistics"
DRY_RUN="false"

print_help() {
  cat <<EOF
Test Telegram connection

Options:
  --token <TOKEN>       Telegram bot token (overrides TELEGRAM_BOT_TOKEN)
  --chat <CHAT_ID>      Telegram chat id (overrides TELEGRAM_CHAT_ID)
  --text <TEXT>         Message text to send (default: "$TEXT")
  --dry-run             Do not actually send, only validate config
  -h, --help            Show this help

ENV alternatives:
  TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

Examples:
  bash scripts/test-telegram.sh --token "1234:abcd" --chat "987654321"
  TELEGRAM_BOT_TOKEN=1234:abcd TELEGRAM_CHAT_ID=987654321 bash scripts/test-telegram.sh --text "Hello"
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --token)
      TOKEN="$2"; shift 2 ;;
    --chat)
      CHAT_ID="$2"; shift 2 ;;
    --text)
      TEXT="$2"; shift 2 ;;
    --dry-run)
      DRY_RUN="true"; shift 1 ;;
    -h|--help)
      print_help; exit 0 ;;
    *)
      echo "Unknown option: $1" >&2; print_help; exit 1 ;;
  esac
done

if [[ -z "$TOKEN" || -z "$CHAT_ID" ]]; then
  echo "[ERROR] Missing TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID. Use --token/--chat or set env vars." >&2
  exit 2
fi

echo "🔎 Using Telegram config: CHAT_ID=$CHAT_ID"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "✅ Dry-run OK. Skipping send."
  exit 0
fi

echo "🚀 Sending test message..."
TELEGRAM_BOT_TOKEN="$TOKEN" TELEGRAM_CHAT_ID="$CHAT_ID" \
  node "$REPO_ROOT/scripts/testTelegramConnection.js" --text "$TEXT"

STATUS=$?
if [[ $STATUS -eq 0 ]]; then
  echo "✅ Message sent successfully"
else
  echo "🛑 Failed to send message (exit $STATUS)" >&2
fi
exit $STATUS


