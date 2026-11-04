"""Verify the original three inputs match the hashes captured for every command."""
from pathlib import Path
import hashlib
import json

root = Path(__file__).resolve().parent
records = [json.loads((root / 'evidence' / f'{name}.json').read_text()) for name in ('existing', 'contract', 'runtime')]
inputs = ('codec.py', 'test_codec.py', 'CONTRACT.md')
lines = []
for name in inputs:
    actual = hashlib.sha256((root / name).read_bytes()).hexdigest()
    assert all(record['input_sha256_before'][name] == actual and record['input_sha256_after'][name] == actual for record in records), name
    lines.append(f'{name} {actual}')
output = 'IMMUTABLE_INPUTS_VERIFIED: 3/3 SHA-256 unchanged across all verification commands\n' + '\n'.join(lines) + '\n'
(root / 'evidence/immutability.log').write_text(output)
print(output, end='')
