from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import json
import re

class Audit(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.targets = []
        self.resources = []
        self.sections = 0
        self.headings = []
        self.capture_heading = False
        self.pre_depth = 0
        self.blocks = []
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if 'id' in attrs:
            self.ids.append(attrs['id'])
        if tag == 'section':
            self.sections += 1
        if tag == 'h2':
            self.capture_heading = True
        for key in ['href', 'src']:
            value = attrs.get(key, '')
            if value.startswith('#'):
                self.targets.append(value[1:])
            elif value:
                self.resources.append(value)
        if tag == 'pre':
            self.pre_depth += 1
            self.blocks.append('')
    def handle_endtag(self, tag):
        if tag == 'h2':
            self.capture_heading = False
        if tag == 'pre':
            self.pre_depth -= 1
    def handle_data(self, text):
        if self.capture_heading:
            self.headings.append(text)
        if self.pre_depth:
            self.blocks[-1] += text

folder = Path(__file__).resolve().parents[1]
html = folder / 'Prompt Engineering 详细解释.html'
raw = html.read_text(encoding='utf-8')
audit = Audit()
audit.feed(raw)
duplicate_ids = [key for key, count in Counter(audit.ids).items() if count > 1]
broken_anchors = sorted(set(audit.targets) - set(audit.ids) - {''})
external_resources = [item for item in audit.resources if re.match(r'(?:https?:)?//', item)]
assert not duplicate_ids, duplicate_ids
assert not broken_anchors, broken_anchors
assert not external_resources, external_resources
assert audit.sections >= 12, audit.sections
assert not re.search(r'来源清单|参考文献|参考文章|参考资料|Bibliography|References', raw, re.I)
comments = [block for block in audit.blocks if re.search(r'(?m)^\s*(#|//)\s*.*[\u4e00-\u9fff]', block)]
assert comments, 'No Chinese-commented teaching code found'
report = {'sections': audit.sections, 'headings': audit.headings, 'duplicate_ids': duplicate_ids, 'broken_anchors': broken_anchors, 'external_resources': external_resources, 'code_blocks': len(audit.blocks), 'commented_code_blocks': len(comments), 'size_bytes': html.stat().st_size}
(Path(__file__).parent / 'html-content-check.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False))
