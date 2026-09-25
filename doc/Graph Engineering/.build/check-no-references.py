import zipfile, re, xml.etree.ElementTree as ET
from pathlib import Path
root=Path(r'C:\DATA\personal\ai-tools\doc\Graph Engineering')
hits=[]
with zipfile.ZipFile(root/'Graph_Engineering_分享.pptx') as z:
    for name in z.namelist():
        if re.match(r'ppt/(slides|notesSlides)/[^/]+\.xml$',name):
            text=' '.join(ET.fromstring(z.read(name)).itertext())
            if re.search(r'Anatoli|Kopadze|FxTwitter|来源清单|参考资料|原文|https?://',text):
                hits.append((name,text))
html=(root/'Graph_Engineering_详解.html').read_text(encoding='utf8')
html_hits=re.findall(r'.{0,20}(?:原文|来源清单|Anatoli|FxTwitter|官方文档|发布页|href="https?).{0,30}',html)
print('PPT reference matches:',hits)
print('HTML reference matches:',html_hits)
assert not hits and not html_hits
assert 'http://www.w3.org/2000/svg' in html
