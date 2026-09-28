#!/usr/bin/env python3
"""Place a Bug directory in a category without breaking its original path."""

import argparse
import json
import os
import re
from pathlib import Path


SAFE_BUG_ID = re.compile(r"[A-Za-z0-9][A-Za-z0-9_-]*\Z")
SAFE_GROUP = re.compile(r"[a-z0-9][a-z0-9-]*\Z")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--project-root", required=True, type=Path)
    parser.add_argument("--bug-id", required=True)
    parser.add_argument("--group", required=True, help="Stable ASCII category slug")
    args = parser.parse_args()

    if not SAFE_BUG_ID.fullmatch(args.bug_id):
        parser.error(f"unsafe bug ID: {args.bug_id!r}")
    if not SAFE_GROUP.fullmatch(args.group):
        parser.error(f"unsafe group: {args.group!r}")

    root = args.project_root.resolve() / ".evospec" / "output" / "bug-log"
    groups = root / "groups"
    alias = root / args.bug_id
    destination = groups / args.group / args.bug_id
    groups.mkdir(parents=True, exist_ok=True)

    if alias.is_symlink():
        source = alias.resolve(strict=True)
        if source == destination:
            status = "already_grouped"
        else:
            if source.parent.parent != groups or source.name != args.bug_id:
                parser.error(f"Bug path points outside managed groups: {source}")
            if destination.exists() or destination.is_symlink():
                parser.error(f"destination already exists: {destination}")
            destination.parent.mkdir(parents=True, exist_ok=True)
            source.rename(destination)
            alias.unlink()
            alias.symlink_to(os.path.relpath(destination, alias.parent), target_is_directory=True)
            status = "reclassified"
    elif alias.is_dir():
        if destination.exists() or destination.is_symlink():
            parser.error(f"destination already exists: {destination}")
        destination.parent.mkdir(parents=True, exist_ok=True)
        alias.rename(destination)
        alias.symlink_to(os.path.relpath(destination, alias.parent), target_is_directory=True)
        status = "grouped"
    elif alias.exists():
        parser.error(f"Bug path is not a directory: {alias}")
    else:
        if destination.exists() or destination.is_symlink():
            parser.error(f"destination already exists without Bug alias: {destination}")
        destination.mkdir(parents=True)
        alias.symlink_to(os.path.relpath(destination, alias.parent), target_is_directory=True)
        status = "created"

    print(json.dumps({"status": status, "bug_id": args.bug_id, "group": args.group,
                      "path": str(alias), "grouped_path": str(destination)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
