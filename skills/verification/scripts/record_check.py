#!/usr/bin/env python3
"""Record one argv command and its evidence; never decide business acceptance.

Paths given with --input are relative to --cwd; --out is relative to this CLI.
Logs and argv are unredacted: supply non-secret arguments and inspect before sharing.
No environment is recorded. Interrupt cleanup covers only the direct child, not
detached descendants or remote work. No timeout or full process-tree management.
"""

import argparse
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
import time


def fingerprint(path):
    if not path.is_file():
        raise OSError(f"Not a readable regular file: {path}")
    digest = hashlib.sha256()
    size = 0
    with path.open("rb") as source:
        for chunk in iter(lambda: source.read(1024 * 1024), b""):
            digest.update(chunk)
            size += len(chunk)
    return {"path": str(path), "sha256": digest.hexdigest(), "size_bytes": size}


def private_file(path):
    return os.fdopen(os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o600), "wb")


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--out", required=True, help="new directory; parent must exist")
    parser.add_argument("--cwd", required=True)
    parser.add_argument("--input", action="append", default=[])
    parser.add_argument("command", nargs=argparse.REMAINDER)
    args = parser.parse_args(argv)
    command = args.command[1:] if args.command[:1] == ["--"] else args.command
    if not command:
        parser.error("provide -- COMMAND ARGS")
    try:
        cwd = Path(args.cwd).expanduser().resolve(strict=True)
        if not cwd.is_dir():
            raise NotADirectoryError(str(cwd))
        inputs = [(cwd / Path(p).expanduser()).absolute() for p in args.input]
        before = [fingerprint(p) for p in inputs]
        out = Path(args.out).expanduser().absolute()
        out.mkdir(mode=0o700)
    except OSError as error:
        parser.error(str(error))

    record = {"schema_version": 1, "argv": command, "cwd": str(cwd),
              "started_at_utc": utc_now(), "inputs_before": before,
              "returncode": None, "outcome": "launch_error", "interrupted": False}
    started = time.monotonic()
    stdout_path, stderr_path = out / "stdout.log", out / "stderr.log"
    try:
        with private_file(stdout_path) as stdout, private_file(stderr_path) as stderr:
            try:
                process = subprocess.Popen(command, cwd=cwd, stdout=stdout,
                                           stderr=stderr, shell=False)
            except OSError as error:
                record["launch_error"] = str(error)
            else:
                try:
                    record["returncode"] = process.wait()
                except KeyboardInterrupt:
                    record["interrupted"] = True
                    process.terminate()
                    try:
                        process.wait(timeout=5)
                    except subprocess.TimeoutExpired:
                        process.kill()
                        process.wait()
                    record["returncode"] = process.returncode
                record["outcome"] = ("command_succeeded" if process.returncode == 0
                                     and not record["interrupted"] else "command_failed")
        record["ended_at_utc"] = utc_now()
        record["elapsed_seconds"] = round(time.monotonic() - started, 6)
        record["inputs_after"] = []
        for path in inputs:
            try:
                after = fingerprint(path)
            except OSError as error:
                after = {"path": str(path), "sha256": None, "error": str(error)}
            record["inputs_after"].append(after)
        record["logs"] = {"stdout": fingerprint(stdout_path),
                          "stderr": fingerprint(stderr_path)}
        with private_file(out / "result.json") as destination:
            destination.write((json.dumps(record, ensure_ascii=False, indent=2) + "\n").encode())
    except OSError as error:
        print(f"Recorder error; partial evidence retained in {out}: {error}", file=sys.stderr)
        return 2
    print(out / "result.json")
    if record["interrupted"]:
        return 130
    code = record["returncode"]
    return 127 if code is None else (128 - code if code < 0 else code)


if __name__ == "__main__":
    sys.exit(main())
