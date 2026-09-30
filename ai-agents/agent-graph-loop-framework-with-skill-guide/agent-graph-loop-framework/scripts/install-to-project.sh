#!/usr/bin/env bash
set -euo pipefail

SOURCE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-}"
MODE="${2:-}"

if [[ -z "$TARGET" ]]; then
  echo "usage: $0 <target-project-directory> [--force]" >&2
  exit 2
fi

mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd)"

items=(AGENTS.md CLAUDE.md .agent .evospec .codex .claude .pi)
for item in "${items[@]}"; do
  src="$SOURCE_ROOT/$item"
  dst="$TARGET/$item"
  if [[ -e "$dst" && "$MODE" != "--force" ]]; then
    echo "SKIP existing: $dst"
    continue
  fi
  if [[ -e "$dst" && "$MODE" == "--force" ]]; then
    backup="$dst.backup.$(date +%Y%m%d-%H%M%S)"
    mv "$dst" "$backup"
    echo "BACKUP: $dst -> $backup"
  fi
  cp -a "$src" "$dst"
  echo "COPY: $item"
done

mkdir -p "$TARGET/scripts"
for script in project-commands.sh build.sh test.sh lint.sh verify.sh new-run.py check-run-state.py validate-framework.py validate-evospec.py; do
  src="$SOURCE_ROOT/scripts/$script"
  dst="$TARGET/scripts/$script"
  if [[ -e "$dst" && "$MODE" != "--force" ]]; then
    echo "SKIP existing: $dst"
  else
    if [[ -e "$dst" && "$MODE" == "--force" ]]; then
      mv "$dst" "$dst.backup.$(date +%Y%m%d-%H%M%S)"
    fi
    cp -a "$src" "$dst"
    echo "COPY: scripts/$script"
  fi
done

cat <<MSG

Installed Graph + Loop framework into:
  $TARGET

Next:
  1. Edit .agent/project.yaml
  2. Edit .evospec/module.config.yaml
  3. Edit scripts/project-commands.sh
  4. Run python3 scripts/validate-framework.py
MSG
