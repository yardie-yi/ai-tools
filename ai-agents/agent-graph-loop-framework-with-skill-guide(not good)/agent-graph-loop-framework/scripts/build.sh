#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/project-commands.sh"
mkdir -p .agent/logs
LOG=".agent/logs/build-$(date +%Y%m%d-%H%M%S).log"

run() {
  echo "+ $*" | tee "$LOG"
  bash -lc "$*" 2>&1 | tee -a "$LOG"
}

if [[ -n "$PROJECT_BUILD_CMD" ]]; then
  run "$PROJECT_BUILD_CMD"
elif [[ -f CMakeLists.txt ]]; then
  run "cmake -S . -B build && cmake --build build --parallel"
elif [[ -f Makefile || -f makefile ]]; then
  run "make -j${JOBS:-2}"
elif [[ -f package.json ]]; then
  run "npm run build"
else
  echo "No build command configured. Edit scripts/project-commands.sh." | tee "$LOG" >&2
  exit 2
fi
