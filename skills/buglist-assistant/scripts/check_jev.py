#!/usr/bin/env python3
"""Detect an existing Jev installation without starting or installing it."""

from __future__ import annotations

import json
import os
import shutil
from pathlib import Path


def main() -> int:
    candidates = [shutil.which("jev"), os.environ.get("JEV_BIN")]
    project = os.environ.get("JEV_PROJECT_DIR")
    if project:
        candidates.append(str(Path(project) / ".venv/bin/jev"))
    candidates.append(str(Path.home() / "Desktop/persional/ai-tool/jev-ultrafast/.venv/bin/jev"))
    for candidate in candidates:
        if candidate and Path(candidate).is_file() and os.access(candidate, os.X_OK):
            print(json.dumps({"available": True, "command": str(Path(candidate).resolve()), "api_key_set": bool(os.environ.get("TYPESAFE_API_KEY"))}))
            return 0
    print(json.dumps({"available": False, "api_key_set": bool(os.environ.get("TYPESAFE_API_KEY"))}))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
