#!/usr/bin/env python3
"""Locate an existing Jev executable or jev-ultrafast checkout without installing it."""

from __future__ import annotations

import json
import os
import shutil
from pathlib import Path


def project_candidates() -> list[Path]:
    candidates: list[Path] = []
    configured = os.environ.get("JEV_PROJECT_DIR")
    if configured:
        candidates.append(Path(configured))
    candidates.append(Path.cwd() / "jev-ultrafast")
    for parent in Path(__file__).resolve().parents:
        candidates.append(parent / "jev-ultrafast")
    candidates.append(Path.home() / "Desktop" / "persional" / "ai-tool" / "jev-ultrafast")
    return list(dict.fromkeys(path.resolve() for path in candidates))


def main() -> int:
    executable = shutil.which("jev")
    if executable:
        print(
            json.dumps(
                {
                    "available": True,
                    "kind": "executable",
                    "command": [executable],
                    "cwd": str(Path.cwd()),
                }
            )
        )
        return 0

    for project in project_candidates():
        if (project / "pyproject.toml").is_file() and (project / "jev_ultrafast").is_dir():
            venv_jev = project / ".venv" / "bin" / "jev"
            if venv_jev.is_file() and os.access(venv_jev, os.X_OK):
                command = [str(venv_jev)]
            elif shutil.which("uv"):
                command = ["uv", "run"]
                if (project / ".env").is_file():
                    command.extend(["--env-file", ".env"])
                command.append("jev")
            else:
                continue
            print(
                json.dumps(
                    {
                        "available": True,
                        "kind": "project",
                        "project": str(project),
                        "command": command,
                        "cwd": str(project),
                    }
                )
            )
            return 0

    print(json.dumps({"available": False}))
    return 1


if __name__ == "__main__":
    raise SystemExit(main())
