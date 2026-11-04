#!/usr/bin/env python3
"""Read-only check of the supplied work-hour snapshots; no service access."""
import hashlib
import json
import os
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent
FILES = ["source.json", "before.json", "write-response.json", "readback.json"]


def fingerprints():
    return {name: hashlib.sha256((ROOT / name).read_bytes()).hexdigest() for name in FILES}


def key(row):
    return (row["employee"], row["date"])


def key_text(value):
    return "|".join(value)


started = datetime.now().astimezone().isoformat()
hashes_before = fingerprints()
source, before, response, after = [json.loads((ROOT / name).read_text()) for name in FILES]
source_by_key = {key(row): row for row in source}
before_by_id = {row["id"]: row for row in before}
after_by_id = {row["id"]: row for row in after}
source_keys, before_keys, after_keys = map(lambda rows: set(map(key, rows)), [source, before, after])
expected_new_keys = source_keys - before_keys
added = [row for row in after if row["id"] not in before_by_id]
duplicates = {key_text(k): v for k, v in Counter(map(key, after)).items() if v > 1}
mismatches = [
    {"id": row["id"], "key": key_text(key(row)), "expected_hours": source_by_key[key(row)]["hours"], "actual_hours": row["hours"]}
    for row in after
    if key(row) in source_by_key and row["hours"] != source_by_key[key(row)]["hours"]
]
changed_existing = [row for record_id, row in before_by_id.items() if after_by_id.get(record_id) != row]
expected_add_counts = Counter(expected_new_keys)
actual_add_counts = Counter(map(key, added))

checks = [
    {"name": "source_keys_unique", "pass": len(source_keys) == len(source)},
    {"name": "existing_records_preserved", "pass": not changed_existing, "changed_or_missing": changed_existing},
    {"name": "required_keys_present", "pass": not source_keys - after_keys, "missing": list(map(key_text, sorted(source_keys - after_keys)))},
    {"name": "no_unexpected_business_keys", "pass": not after_keys - source_keys - before_keys},
    {"name": "readback_hours_match_source", "pass": not mismatches, "mismatches": mismatches},
    {"name": "readback_business_keys_unique", "pass": not duplicates, "duplicates": duplicates},
    {"name": "only_one_row_added_per_missing_key", "pass": actual_add_counts == expected_add_counts,
     "expected": {key_text(k): v for k, v in expected_add_counts.items()},
     "actual": {key_text(k): v for k, v in actual_add_counts.items()}},
    {"name": "response_count_agrees_with_snapshot_delta", "pass": response["created_records"] == len(added),
     "response_created_records": response["created_records"], "snapshot_added_records": len(added),
     "interpretation_limit": "Count discrepancy only; snapshots lack operation/scope/timestamp correlation."},
]
hashes_after = fingerprints()
checks.append({"name": "input_files_unchanged_during_check", "pass": hashes_before == hashes_after})
passed = sum(check["pass"] for check in checks)
result = {
    "executed_at": started,
    "finished_at": datetime.now().astimezone().isoformat(),
    "cwd": os.getcwd(),
    "command": [sys.executable, str(Path(__file__).resolve())],
    "python_version": sys.version,
    "input_sha256_before": hashes_before,
    "input_sha256_after": hashes_after,
    "checker_sha256": hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
    "counts": {"source_rows": len(source), "before_rows": len(before), "expected_rows": len(before) + len(expected_new_keys), "readback_rows": len(after), "added_rows": len(added)},
    "hours": {"source": sum(r["hours"] for r in source), "before": sum(r["hours"] for r in before), "expected": sum(r["hours"] for r in before) + sum(source_by_key[k]["hours"] for k in expected_new_keys), "readback": sum(r["hours"] for r in after)},
    "raw_write_response": response,
    "checks": checks,
    "summary": {"total": len(checks), "pass": passed, "fail": len(checks) - passed},
    "exit_code": 0 if passed == len(checks) else 1,
    "overall": "PASS" if passed == len(checks) else "FAIL",
}
output = json.dumps(result, ensure_ascii=False, indent=2) + "\n"
(ROOT / "check-results.json").write_text(output)
print(output, end="")
sys.exit(result["exit_code"])
