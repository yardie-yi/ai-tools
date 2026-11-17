#!/usr/bin/env python3
from pathlib import Path
import json
import re
import subprocess
import sys
import tomllib

try:
    import yaml
except ImportError:
    print('Framework validation: FAIL')
    print('- PyYAML is required: python -m pip install pyyaml')
    raise SystemExit(2)

root = Path(__file__).resolve().parents[1]
errors = []

for p in root.rglob('*.json'):
    try:
        json.loads(p.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'JSON {p.relative_to(root)}: {e}')

for p in root.rglob('*.toml'):
    try:
        tomllib.loads(p.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'TOML {p.relative_to(root)}: {e}')

for p in root.rglob('*.yaml'):
    try:
        yaml.safe_load(p.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'YAML {p.relative_to(root)}: {e}')

for p in (root / 'scripts').glob('*.sh'):
    result = subprocess.run(['bash', '-n', str(p)], capture_output=True, text=True)
    if result.returncode:
        errors.append(f'Bash {p.relative_to(root)}: {result.stderr.strip()}')

python_files = list((root / 'scripts').glob('*.py'))
python_files.extend((root / '.evospec/scripts').glob('*.py'))
for p in python_files:
    try:
        compile(p.read_text(encoding='utf-8'), str(p), 'exec')
    except Exception as exc:
        errors.append(f'Python {p.relative_to(root)}: {exc}')

required = [
    'AGENTS.md', 'CLAUDE.md', '.agent/router.yaml', '.agent/protocol.md',
    '.agent/skills/registry.yaml', '.agent/skills/model-skill/SKILL.md',
    '.agent/graphs/development.graph.md', '.agent/graphs/skill-workflow.graph.md',
    '.agent/loops/review-loop.md', '.evospec/module.config.yaml',
    '.evospec/rules/INDEX.md', '.codex/agents/reviewer.toml',
    '.claude/agents/reviewer.md', '.pi/skills/graph-loop-runner/SKILL.md',
    'scripts/validate-evospec.py', 'scripts/validate-skills.py',
    'docs/ADDING_SKILLS.md', '.evospec/skills/README.md'
]
for rel in required:
    if not (root / rel).exists():
        errors.append(f'missing required file: {rel}')

# Validate basic Claude frontmatter.
for p in (root / '.claude/agents').glob('*.md'):
    text = p.read_text(encoding='utf-8')
    if not text.startswith('---\n') or '\n---\n' not in text[4:]:
        errors.append(f'invalid Claude frontmatter: {p.relative_to(root)}')
    if not re.search(r'^name:\s*\S+', text, re.M):
        errors.append(f'missing Claude agent name: {p.relative_to(root)}')

# Validate project Skill frontmatter and source-path migration.
skill = root / '.agent/skills/model-skill/SKILL.md'
if skill.exists():
    text = skill.read_text(encoding='utf-8')
    if not text.startswith('---\n') or '\n---\n' not in text[4:]:
        errors.append('invalid model-skill frontmatter')
for p in (root / '.agent/skills/model-skill').rglob('*.md') if (root / '.agent/skills/model-skill').exists() else []:
    if '.codex/skills/model-skill' in p.read_text(encoding='utf-8'):
        errors.append(f'stale .codex skill path: {p.relative_to(root)}')

for validator in ('validate-skills.py', 'validate-evospec.py'):
    result = subprocess.run(
        [sys.executable, str(root / 'scripts' / validator), '--root', str(root)],
        capture_output=True,
        text=True,
    )
    if result.returncode:
        errors.append(f'{validator} failed: ' + (result.stdout + result.stderr).strip())

if errors:
    print('Framework validation: FAIL')
    for e in errors:
        print(f'- {e}')
    sys.exit(1)
print('Framework validation: PASS')
