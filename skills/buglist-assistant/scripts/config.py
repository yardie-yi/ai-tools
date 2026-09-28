#!/usr/bin/env python3
"""Persist project-specific Buglist settings without overwriting omitted fields."""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from urllib.parse import parse_qsl, urlencode, urlsplit, urlunsplit


def redacted_url(value: str) -> str:
    parts = urlsplit(value)
    query = urlencode(
        [(key, "***" if any(word in key.lower() for word in ("token", "key", "secret", "auth", "sig")) else item) for key, item in parse_qsl(parts.query, keep_blank_values=True)]
    )
    host = parts.hostname or ""
    if parts.port:
        host += f":{parts.port}"
    return urlunsplit((parts.scheme, host, parts.path, query, ""))


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--project-root", type=Path, default=Path.cwd())
    parser.add_argument("--url")
    parser.add_argument("--keyword", action="append")
    parser.add_argument("--clear-keywords", action="store_true")
    args = parser.parse_args()
    path = args.project_root.resolve() / ".evospec/buglist-assistant.json"
    config = json.loads(path.read_text(encoding="utf-8")) if path.is_file() else {}
    if args.url is not None:
        if urlsplit(args.url).scheme not in ("http", "https") or not urlsplit(args.url).hostname:
            parser.error("--url must be an HTTP(S) URL")
        config["buglist_url"] = args.url
    if args.keyword is not None or args.clear_keywords:
        config["log_filename_keywords"] = list(dict.fromkeys(args.keyword or []))
    if "buglist_url" in config and "log_filename_keywords" in config:
        path.parent.mkdir(parents=True, exist_ok=True)
        temporary = path.with_suffix(".json.tmp")
        temporary.write_text(json.dumps(config, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        os.chmod(temporary, 0o600)
        temporary.replace(path)
        status = "configured"
    else:
        status = "needs_input"
    print(json.dumps({
        "status": status,
        "config_path": str(path),
        "buglist_url": redacted_url(config["buglist_url"]) if "buglist_url" in config else None,
        "log_filename_keywords": config.get("log_filename_keywords"),
        "missing": [name for name in ("buglist_url", "log_filename_keywords") if name not in config],
    }, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
