"""Local-only command evidence capture; preserves child exit status."""
import datetime
import hashlib
import json
from pathlib import Path
import platform
import shlex
import subprocess
import sys
import time

root = Path(__file__).resolve().parent
inputs = ('codec.py', 'test_codec.py', 'CONTRACT.md', 'verify_contract.py', 'collect_evidence.py')
def fingerprints():
    return {name: hashlib.sha256((root / name).read_bytes()).hexdigest() for name in inputs}
name = sys.argv[1]
args = sys.argv[2:]
if args and args[0] == '--':
    args = args[1:]
started = datetime.datetime.now().astimezone().isoformat()
before = fingerprints()
clock_start = time.monotonic()
run = subprocess.run(args, cwd=root, capture_output=True, text=True)
record = {
    'started_at': started,
    'finished_at': datetime.datetime.now().astimezone().isoformat(),
    'cwd': str(root),
    'argv': args,
    'command': shlex.join(args),
    'collector_python': sys.version,
    'platform': platform.platform(),
    'duration_seconds': time.monotonic() - clock_start,
    'input_sha256_before': before,
    'input_sha256_after': fingerprints(),
    'exit_code': run.returncode,
    'stdout': run.stdout,
    'stderr': run.stderr,
}
(root / 'evidence' / f'{name}.json').write_text(json.dumps(record, ensure_ascii=False, indent=2) + '\n')
log = f"Started: {started}\nCWD: {root}\nCommand: {record['command']}\nExit code: {run.returncode}\n\nSTDOUT:\n{run.stdout}\nSTDERR:\n{run.stderr}"
(root / 'evidence' / f'{name}.log').write_text(log)
print(log)
sys.exit(run.returncode)
