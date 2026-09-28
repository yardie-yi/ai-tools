#!/usr/bin/env python3
"""Check for Browser Harness and install it from the package registry when absent."""

from __future__ import annotations

import argparse
import importlib.util
import json
import os
import site
import shutil
import subprocess
import sys
import sysconfig
from pathlib import Path


def executable() -> str | None:
    direct = shutil.which("browser-harness")
    if direct:
        return direct

    configured = os.environ.get("BROWSER_HARNESS_BIN")
    candidates = [Path(configured)] if configured else []
    jev_project = os.environ.get("JEV_PROJECT_DIR")
    if jev_project:
        candidates.append(Path(jev_project) / ".venv" / "bin" / "browser-harness")
    candidates.append(
        Path("/home/yardie/Desktop/persional/ai-tool/jev-ultrafast")
        / ".venv"
        / "bin"
        / "browser-harness"
    )
    candidates.append(Path.cwd() / ".venv" / "bin" / "browser-harness")
    candidates.append(Path(site.USER_BASE) / "bin" / "browser-harness")
    scripts_dir = sysconfig.get_path("scripts")
    if scripts_dir:
        candidates.append(Path(scripts_dir) / "browser-harness")
    for parent in Path(__file__).resolve().parents:
        candidates.append(parent / "jev-ultrafast" / ".venv" / "bin" / "browser-harness")
    for candidate in candidates:
        if candidate.is_file() and os.access(candidate, os.X_OK):
            return str(candidate)

    uv = shutil.which("uv")
    if uv:
        result = subprocess.run(
            [uv, "tool", "dir", "--bin"],
            check=False,
            capture_output=True,
            text=True,
        )
        if result.returncode == 0:
            candidate = Path(result.stdout.strip()) / "browser-harness"
            if candidate.is_file():
                return str(candidate)
    return None


def available() -> dict[str, object]:
    command = executable()
    module = importlib.util.find_spec("browser_harness") is not None
    return {"available": bool(command), "command": command, "module": module}


def run(command: list[str]) -> subprocess.CompletedProcess[str]:
    return subprocess.run(command, check=False, capture_output=True, text=True)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-only", action="store_true")
    args = parser.parse_args()

    status = available()
    if status["available"] or args.check_only:
        print(json.dumps(status))
        return 0 if status["available"] else 1

    uv = shutil.which("uv")
    if uv:
        install = [uv, "tool", "install", "browser-harness"]
    else:
        install = [sys.executable, "-m", "pip", "install", "--user", "browser-harness"]

    result = run(install)
    status = available()
    status.update(
        {
            "install_command": install,
            "install_exit_code": result.returncode,
            "install_stdout": result.stdout[-2000:],
            "install_stderr": result.stderr[-2000:],
        }
    )

    command = status.get("command")
    if result.returncode == 0 and command:
        check = run([str(command), "--help"])
        status["verification_exit_code"] = check.returncode
        status["available"] = check.returncode == 0

    print(json.dumps(status))
    return 0 if status["available"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
