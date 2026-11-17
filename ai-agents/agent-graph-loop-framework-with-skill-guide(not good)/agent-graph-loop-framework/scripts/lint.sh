#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/project-commands.sh"
mkdir -p .agent/logs
LOG=".agent/logs/lint-$(date +%Y%m%d-%H%M%S).log"

run() {
  echo "+ $*" | tee "$LOG"
  bash -lc "$*" 2>&1 | tee -a "$LOG"
}

if [[ -n "$PROJECT_LINT_CMD" ]]; then
  run "$PROJECT_LINT_CMD"
elif [[ -f package.json ]] && grep -q '"lint"' package.json; then
  run "npm run lint"
elif command -v ruff >/dev/null 2>&1 && [[ -f pyproject.toml ]]; then
  run "ruff check ."
elif command -v clang-format >/dev/null 2>&1 && find . -path './build' -prune -o \( -name '*.c' -o -name '*.h' \) -print -quit | grep -q .; then
  echo "clang-format found, but no project lint command is configured; skipping mutation-based formatting." | tee "$LOG"
else
  echo "No lint command configured; lint gate skipped." | tee "$LOG"
fi
