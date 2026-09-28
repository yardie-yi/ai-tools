#!/usr/bin/env python3
"""Find Browser Harness, or install its CLI in the user's tool environment."""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import sys
from pathlib import Path


def find_cli() -> str | None:
    candidates = [shutil.which("browser-harness"), os.environ.get("BROWSER_HARNESS_BIN")]
    jev_dir = os.environ.get("JEV_PROJECT_DIR")
    if jev_dir:
        candidates.append(str(Path(jev_dir) / ".venv/bin/browser-harness"))
    candidates.extend(
        [
            str(Path.home() / "Desktop/persional/ai-tool/jev-ultrafast/.venv/bin/browser-harness"),
            str(Path.cwd() / ".venv/bin/browser-harness"),
            str(Path.home() / ".local/share/buglist-assistant/browser-harness-venv/bin/browser-harness"),
        ]
    )
    uv = shutil.which("uv")
    if uv:
        result = subprocess.run([uv, "tool", "dir", "--bin"], capture_output=True, text=True)
        if result.returncode == 0:
            candidates.append(str(Path(result.stdout.strip()) / "browser-harness"))
    for candidate in candidates:
        if candidate and Path(candidate).is_file() and os.access(candidate, os.X_OK):
            return str(Path(candidate).resolve())
    return None


def main() -> int:
    cli = find_cli()
    installed = False
    if not cli:
        uv = shutil.which("uv")
        if uv:
            command = [uv, "tool", "install", "browser-harness"]
        else:
            venv = Path.home() / ".local/share/buglist-assistant/browser-harness-venv"
            venv.parent.mkdir(parents=True, exist_ok=True)
            create = subprocess.run([sys.executable, "-m", "venv", str(venv)], capture_output=True, text=True)
            if create.returncode != 0:
                print(json.dumps({"available": False, "error": create.stderr[-1000:]}))
                return 1
            command = [str(venv / "bin/pip"), "install", "browser-harness"]
        result = subprocess.run(command, capture_output=True, text=True, timeout=300)
        if result.returncode != 0:
            print(json.dumps({"available": False, "error": result.stderr[-1000:], "command": command}))
            return 1
        cli = find_cli()
        installed = True
    if not cli:
        print(json.dumps({"available": False, "error": "Installation succeeded but CLI was not found"}))
        return 1
    verify = subprocess.run([cli, "--version"], capture_output=True, text=True, timeout=30)
    info = {"available": verify.returncode == 0, "command": cli, "installed_now": installed, "version": verify.stdout.strip()}
    if verify.returncode != 0:
        info["error"] = verify.stderr[-1000:]
    print(json.dumps(info, ensure_ascii=False))
    return 0 if info["available"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
