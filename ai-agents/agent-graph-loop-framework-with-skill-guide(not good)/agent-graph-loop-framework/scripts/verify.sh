#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

status=0

echo "===== evospec ====="
if python3 "$ROOT/scripts/validate-evospec.py"; then
  echo "evospec: PASS/WARN"
else
  code=$?
  echo "evospec: FAIL (exit $code)" >&2
  status=1
fi

for step in lint build test; do
  echo "===== $step ====="
  if "$ROOT/scripts/$step.sh"; then
    echo "$step: PASS"
  else
    code=$?
    echo "$step: FAIL (exit $code)" >&2
    status=1
  fi
done
exit "$status"
