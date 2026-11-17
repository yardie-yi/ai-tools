#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/project-commands.sh"
mkdir -p .agent/logs
LOG=".agent/logs/test-$(date +%Y%m%d-%H%M%S).log"

run() {
  echo "+ $*" | tee "$LOG"
  bash -lc "$*" 2>&1 | tee -a "$LOG"
}

if [[ -n "$PROJECT_TEST_CMD" ]]; then
  run "$PROJECT_TEST_CMD"
elif [[ -d build && -f build/CTestTestfile.cmake ]]; then
  run "ctest --test-dir build --output-on-failure"
elif [[ -f pytest.ini || -f pyproject.toml || -d tests ]]; then
  if command -v pytest >/dev/null 2>&1; then run "pytest -q"; else echo "pytest not installed" >&2; exit 2; fi
elif [[ -f package.json ]]; then
  run "npm test -- --runInBand"
elif [[ -f Makefile || -f makefile ]]; then
  run "make test"
else
  echo "No test command configured. Edit scripts/project-commands.sh." | tee "$LOG" >&2
  exit 2
fi
