from pathlib import Path
import hashlib,re,yaml
repo=Path(__file__).resolve().parents[3]
skill=repo/'skills/verification'
checked=0
for file in skill.rglob('*.md'):
    content=file.read_text()
    assert not any(line.rstrip()!=line for line in content.splitlines()),file
    for target in re.findall(r'\]\(([^)]+)\)',content):
        if '://' in target or target.startswith('#'):continue
        path=target.split('#',1)[0]
        assert (file.parent/path).is_file(),(file,target)
        checked+=1
meta=yaml.safe_load((skill/'agents/openai.yaml').read_text())
assert 25 <= len(meta['interface']['short_description']) <= 64
assert '$verification' in meta['interface']['default_prompt']
assert meta.get('policy',{}).get('allow_implicit_invocation',True)
expected=hashlib.sha256((skill/'SKILL.md').read_bytes()).hexdigest()
for home in ['.codex/skills','.pi/agent/skills','.claude/skills']:
    installed=Path.home()/home/'verification'
    assert installed.is_symlink() and installed.resolve()==skill
    assert hashlib.sha256((installed/'SKILL.md').read_bytes()).hexdigest()==expected
print(f'PASS: {checked} local Markdown references, UI metadata, 3 installed links and identical entrypoint SHA-256')
