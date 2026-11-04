import json,pathlib,hashlib
p=pathlib.Path('/tmp/verification-research')
s=js("JSON.stringify({url:location.href,title:document.title,text:document.body.innerText,links:Array.from(document.querySelectorAll('a[href]')).map(a=>({text:a.innerText,href:a.href}))})")
(p/'browser-gardener.json').write_text(s)
a=json.loads(s)
assert a['url']=='https://x.com/poteto/status/2090546476464451907'
assert 'every team needs a gardener' in a['text']
print('PASS gardener quote read',len(a['text']),'characters')
print(a['text'][:6000])
article=json.loads((p/'browser-article.json').read_text())
assert 'The Complete Guide to pstack Pt. 1' in article['text']
assert 'Thanks for reading and stay tuned for Part 2!' in article['text']
assert 'Sep 1, 2026' in article['text']
actual={x['href'] for x in article['links']}
expected=json.loads((p/'direct-links.json').read_text())
assert len(expected)==14
assert set(expected)<=actual
print('PASS original X article contains opening, closing, date and all 14 unique body link URLs')
for f in sorted(p.glob('browser-*.json')):
 data=json.loads(f.read_text()); txt=data['text'];assert len(txt)>500,f.name
 (p/(f.stem+'.txt')).write_text(txt)
 print('CAPTURE',f.name,'chars='+str(len(txt)),'sha256='+hashlib.sha256(f.read_bytes()).hexdigest(),'url='+data['url'])
print('PASS all 18 browser captures contain >500 characters')
