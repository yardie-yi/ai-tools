#!/usr/bin/env python3
from pathlib import Path
import json, sys

ALLOWED_VERDICTS = {
    'NOT_RUN', 'PASS', 'PASS_WITH_RISK', 'FAIL_LOCAL', 'FAIL_STRUCTURAL',
    'NEED_USER_DECISION', 'BLOCKED_ENVIRONMENT'
}
ALLOWED_FINAL = {'NOT_DONE', 'DONE', 'DONE_WITH_RISK', 'BLOCKED', 'CANCELLED'}

if len(sys.argv) != 2:
    raise SystemExit('usage: check-run-state.py .agent/runs/<run>.json')
path = Path(sys.argv[1])
data = json.loads(path.read_text(encoding='utf-8'))
required = ['run_id', 'task', 'routing', 'skill', 'loop', 'verification', 'review', 'final']
missing = [k for k in required if k not in data]
errors = []
if missing:
    errors.append(f'missing top-level keys: {missing}')
if data.get('review', {}).get('verdict') not in ALLOWED_VERDICTS:
    errors.append('invalid review.verdict')
review = data.get('review', {})
if review.get('required') not in {True, False, None}:
    errors.append('review.required must be a boolean when present')
if data.get('final', {}).get('status') not in ALLOWED_FINAL:
    errors.append('invalid final.status')

preflight = data.get('skill', {}).get('preflight_status')
if preflight not in {'NOT_RUN', 'EXECUTABLE', 'DRY_RUN_ONLY', 'NEED_USER_DECISION', 'BLOCKED_ENVIRONMENT'}:
    errors.append('invalid skill.preflight_status')
if data.get('final', {}).get('status') == 'DONE':
    for gate in ('build', 'test'):
        status = data.get('verification', {}).get(gate, {}).get('status')
        if status not in {'PASS', 'NOT_REQUIRED'}:
            errors.append(f'final DONE but verification.{gate}.status={status!r}')
    if review.get('required') is True and review.get('verdict') != 'PASS':
        errors.append('final DONE with required review requires review.verdict PASS')
    if review.get('verdict') in {'FAIL_LOCAL', 'FAIL_STRUCTURAL', 'NEED_USER_DECISION', 'BLOCKED_ENVIRONMENT'}:
        errors.append('final DONE cannot retain a failing or blocked review verdict')
if errors:
    print('INVALID')
    for e in errors:
        print(f'- {e}')
    raise SystemExit(1)
print('VALID')
