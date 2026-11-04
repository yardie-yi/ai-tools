import json,sys,re,pathlib
pat=sys.argv[1]; low=int(sys.argv[2]); high=int(sys.argv[3]); maxlen=int(sys.argv[4]) if len(sys.argv)>4 else 1500
for p in pathlib.Path('/home/yardie/.codex').joinpath('sessions').rglob('*.jsonl'):
 if pat not in p.name: continue
 print(p)
 for i,l in enumerate(p.open(),1):
  if not low<=i<=high:continue
  x=json.loads(l);z=x.get('payload',{}); typ=z.get('type');role=z.get('role','')
  if x.get('type')!='response_item':continue
  if role in ('system','developer') or typ in ('reasoning',):continue
  t='\n'.join(c.get('text','') for c in z.get('content',[]) if isinstance(c,dict)) if typ=='message' else str(z.get('output',z.get('arguments','')))
  t='\n'.join('[CREDENTIAL-RELATED LINE OMITTED]' if re.search(r'password|passwd|credentials|密码|secret|apikey|API[_\\-]*KEY',a,re.I) else a for a in t.splitlines())
  t=re.sub(r'\b\d{1,3}(?:\.\d{1,3}){3}\b','[IP]',t)
  print(i, x.get('timestamp'),typ,role,z.get('name',''),t[:maxlen])
