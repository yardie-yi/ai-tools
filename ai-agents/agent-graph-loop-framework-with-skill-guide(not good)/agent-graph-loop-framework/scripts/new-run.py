#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime, timezone
import json, re, sys

root = Path(__file__).resolve().parents[1]
template = json.loads((root / '.agent/state-template.json').read_text(encoding='utf-8'))
task = ' '.join(sys.argv[1:]).strip() or 'Unnamed task'
now = datetime.now(timezone.utc)
slug = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]+', '-', task).strip('-')[:50] or 'task'
run_id = f"{now.strftime('%Y%m%d-%H%M%S')}-{slug}"
template['run_id'] = run_id
template['created_at'] = now.isoformat()
template['updated_at'] = now.isoformat()
template['task']['goal'] = task
template['task']['user_request'] = task
out_dir = root / '.agent/runs'
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / f'{run_id}.json'
out.write_text(json.dumps(template, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(out.relative_to(root))
