from pathlib import Path
from collections import Counter
from datetime import datetime,timezone
import json,re,sqlite3
H=Path.home();OUT=Path('/tmp/verification-research')
kw=re.compile(r'verif|validat|test|evidence|测[试量]|验证|核[验实对]|回读|证据|确认|编译|部署|接口|硬件|版本|板端|主机|基线|性能|速度|不对|没[有生]|实际|成功|完成|已修复|日志|误|检查',re.I)
# Extract only message text, not whole event metadata or tool argument blobs.
def msgtext(c):
 if isinstance(c,str):return c
 if isinstance(c,list):return '\n'.join(x.get('text','') for x in c if isinstance(x,dict) and x.get('type') in ('text','input_text','output_text'))
 return ''
def clean(s):
 s='\n'.join('[REDACTED credential-bearing line]' if any(k in line for k in ('密码','口令','密钥','授权码')) else line for line in s.split('\n'))
 s=re.sub(r'(?:sk-[A-Za-z0-9_-]{12,}|Bearer\s+[A-Za-z0-9._-]{12,})','[REDACTED]',s)
 s=re.sub(r'(?i)(["\']?(?:password|passwd|api[_-]?key|access[_-]?token|secret)["\']?\s*[:=]\s*)[^\n,} ]+',r'\1[REDACTED]',s)
 return s
stats={}; hits=[]; users=[]; allmsgs=[]
files=sorted((H/'.pi/agent/sessions').rglob('*.jsonl'))
st={'files':len(files),'bytes':sum(p.stat().st_size for p in files),'records':0,'roles':Counter(),'types':Counter(),'errors':[],'timestamps':[],'nested_subagent_files':sum(p.name=='session.jsonl' for p in files)}
for p in files:
 for n,line in enumerate(p.open(errors='replace'),1):
  try:o=json.loads(line)
  except Exception as e:st['errors'].append({'path':str(p),'line':n,'error':str(e)});continue
  st['records']+=1;st['types'][o.get('type','unknown')]+=1
  if isinstance(o.get('timestamp'),str):st['timestamps'].append(o['timestamp'])
  m=o.get('message',{});role=m.get('role')
  if not role:continue
  st['roles'][role]+=1
  if role=='system':continue
  text=msgtext(m.get('content'));item={'path':str(p),'line':n,'role':role,'timestamp':o.get('timestamp'),'text':clean(text)}
  allmsgs.append(item)
  if role=='user':users.append(item)
  if kw.search(text):hits.append(item)
st['time_min']=min(st['timestamps']);st['time_max']=max(st['timestamps']);del st['timestamps'];stats['pi']=st
vscfiles=sorted((H/'.config/Code/User/workspaceStorage').glob('*/chatSessions/*'))
st={'files':len(vscfiles),'bytes':sum(p.stat().st_size for p in vscfiles),'records':0,'errors':[],'kinds':Counter(),'nonempty_requests':0,'times':[]}
vschits=[]
def walk(o,p,n):
 if isinstance(o,dict):
  if 'creationDate' in o:st['times'].append(o['creationDate'])
  if isinstance(o.get('requests'),list):st['nonempty_requests']+=len(o['requests'])
  for k,v in o.items():
   if isinstance(v,str) and kw.search(v):vschits.append({'path':str(p),'line':n,'key':k,'text':clean(v)})
   else:walk(v,p,n)
 elif isinstance(o,list):
  for v in o:walk(v,p,n)
for p in vscfiles:
 if not p.is_file():continue
 if p.suffix=='.jsonl':lines=list(enumerate(p.open(errors='replace'),1))
 else:lines=[(1,p.read_text())]
 for n,line in lines:
  try:o=json.loads(line)
  except Exception as e:st['errors'].append({'path':str(p),'line':n,'error':str(e)});continue
  st['records']+=1;st['kinds'][str(o.get('kind','snapshot'))]+=1;walk(o,p,n)
if st['times']:
 st['time_min']=datetime.fromtimestamp(min(st['times'])/1000,timezone.utc).isoformat();st['time_max']=datetime.fromtimestamp(max(st['times'])/1000,timezone.utc).isoformat()
del st['times'];stats['vscode']=st
stats['claude']={'sessions_exists':(H/'.claude/sessions').exists(),'sessions_files':len(list((H/'.claude/sessions').rglob('*'))),'projects_exists':(H/'.claude/projects').exists()}
stats['pi']['nested_subagent_user_role_messages']=sum(x['role']=='user' and Path(x['path']).name=='session.jsonl' for x in allmsgs)
stats['pi']['top_level_user_role_messages']=sum(x['role']=='user' and Path(x['path']).name!='session.jsonl' for x in allmsgs)
(OUT/'other-stats.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2))
print(json.dumps(stats,ensure_ascii=False,indent=2));print('hits',len(hits),'users',len(users),'vsc_hits',len(vschits))
