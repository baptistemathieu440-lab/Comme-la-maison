#!/bin/bash
# Reinstall graphify in Claude Code on the web sessions (containers are ephemeral).
set -euo pipefail

if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

export PATH="$HOME/.local/bin:$PATH"

if ! command -v uv >/dev/null 2>&1; then
  curl -LsSf https://astral.sh/uv/install.sh | sh
fi

if ! command -v graphify >/dev/null 2>&1; then
  uv tool install graphifyy
fi

# Copies the /graphify skill into ~/.claude/skills (idempotent)
graphify install >/dev/null

if [ -n "${CLAUDE_ENV_FILE:-}" ]; then
  echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$CLAUDE_ENV_FILE"
fi
