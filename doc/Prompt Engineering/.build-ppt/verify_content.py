from pathlib import Path
from zipfile import ZipFile
from xml.etree import ElementTree as ET
import json
import re

base = Path(__file__).resolve().parents[1]
deck = base / 'Prompt Engineering 分享.pptx'
ns = {'a': 'http://schemas.openxmlformats.org/drawingml/2006/main'}
texts = {}
with ZipFile(deck) as archive:
    for name in archive.namelist():
        if re.fullmatch(r'ppt/(slides/slide|notesSlides/notesSlide)\d+\.xml', name):
            root = ET.fromstring(archive.read(name))
            texts[name] = '\n'.join(node.text or '' for node in root.findall('.//a:t', ns))
    external_links = []
    for name in archive.namelist():
        if name.endswith('.rels'):
            root = ET.fromstring(archive.read(name))
            external_links.extend((name, r.attrib.get('Target')) for r in root if r.attrib.get('TargetMode') == 'External')

for name, content in texts.items():
    assert not re.search(r'https?://|来源清单|参考文献|引用文章|参考文章|参考资料|References|Bibliography', content, re.I), name
assert not external_links, external_links
slides = {key: value for key, value in texts.items() if key.startswith('ppt/slides/')}
assert len(slides) == 24
for index in (12, 13):
    content = slides[f'ppt/slides/slide{index}.xml']
    assert '伪代码' in content
    assert len(re.findall(r'# .*?[\u4e00-\u9fff]', content)) >= 3

report = {'slides': len(slides), 'speaker_notes': len(texts) - len(slides), 'article_source_sections': 0, 'external_links': external_links, 'pseudocode_comment_check': 'pass'}
(Path(__file__).parent / 'content-check.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False))
