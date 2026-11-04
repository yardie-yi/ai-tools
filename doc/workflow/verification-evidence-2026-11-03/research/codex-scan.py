import pathlib,json,re,sqlite3,collections,hashlib,datetime
ROOT=pathlib.Path('/home/yardie/.codex'); OUT=pathlib.Path('/tmp/verification-research')
kw=re.compile(r'验证|测试|编译|证据|实测|板端|真机|回归|复现|检查|验收|测量|基线|mock|regression|verif|test|build|assert|pass|fail',re.I)
correct=re.compile(r'不对|错了|没有|并没|不是|必须|不要|没做|没测|真机|板端|实际|确认|校验|证据|就说|不能|重新|不应该|假的|需要|完善',re.I)
exclude=re.compile(r'请检查codex、pi等所有的对话|Verification 的skill|Verification skill|只读审计所有可发现的本地 Codex|只读检查本机所有可访问 Codex')
def safe(s):
 s='\n'.join('[CREDENTIAL-RELATED LINE OMITTED]' if re.search(r'password|passwd|credentials|密码|secret|apikey|API[_\\-]*KEY',line,re.I) else line for line in s.splitlines())
 s=re.sub(r'(?i)(?:sk-[a-z0-9_-]{10,}|apikey[_\\a-z0-9-]{16,}|gh[pousr]_[a-z0-9_]{12,}|bearer\s+[a-z0-9._-]{12,})','[REDACTED_SECRET]',s)
 s=re.sub(r'(?i)((?:api[_\\-]*key|password|passwd|secret|token)\s*[=:]\s*)[^\s,;]{5,}',r'\1[REDACTED_SECRET]',s)
 s=re.sub(r'(?i)(https?://)[^/@\s]+:[^/@\s]+@',r'\1[REDACTED_AUTH]@',s)
 s=re.sub(r'\b\d{1,3}(?:\.\d{1,3}){3}\b','[IP]',s)
 return s
(OUT/'codex-files.jsonl').write_text('')
files=sorted(set(ROOT.joinpath('sessions').rglob('*.jsonl'))|set(ROOT.joinpath('archived_sessions').rglob('*.jsonl')))
state=sqlite3.connect(f'file:{ROOT}/state_5.sqlite?mode=ro',uri=True)
rows=state.execute('select id,rollout_path,created_at,updated_at,archived from threads').fetchall()
extra=[]; missing=[]
for tid,path,*_ in rows:
 p=pathlib.Path(path)
 if p.exists() and p not in files: extra.append(p)
 elif not p.exists(): missing.append({'thread_id':tid,'rollout_path':path})
files+=extra
stats={'scan_command':'python /tmp/verification-research/codex-scan.py','started_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'scope':'Local Codex only; complete programmatic traversal, representative semantic reading only','files_discovered':len(files),'session_files':sum('/sessions/' in str(p) for p in files),'archived_files':sum('/archived_sessions/' in str(p) for p in files),'extra_files_from_state':len(extra),'state_threads':len(rows),'missing_state_rollouts':missing,'files_scanned':0,'lines_scanned':0,'parse_errors':[],'types':collections.Counter(),'roles':collections.Counter(),'user_deduplicated':0,'user_relevant':0,'current_research_excluded_records':0,'template_excluded_records':0,'timestamps':[]}
users=[]; hits=[]; seen=set(); excluded_files=[]
for p in files:
 stat={'path':str(p),'lines':0,'bytes_at_start':p.stat().st_size,'sha256':None}; digest=hashlib.sha256(); f_exclude=False; entries=[]
 with p.open('rb') as f:
  for n,line in enumerate(f,1):
   digest.update(line); stat['lines']+=1; stats['lines_scanned']+=1
   try: x=json.loads(line)
   except Exception as e: stats['parse_errors'].append({'path':str(p),'line':n,'error':str(e)}); continue
   ts=x.get('timestamp'); stats['types'][x.get('type','unknown')]+=1
   if ts: stats['timestamps'].append(ts)
   pl=x.get('payload',{}); typ=pl.get('type',''); role=pl.get('role','')
   if role: stats['roles'][role]+=1
   text=''
   if x.get('type')=='response_item' and typ=='message': text='\n'.join(a.get('text','') for a in pl.get('content',[]) if isinstance(a,dict))
   elif x.get('type')=='event_msg' and typ=='user_message': text=pl.get('message',''); role='user_event'
   elif x.get('type')=='response_item' and typ in ['function_call_output','custom_tool_call_output']: text=str(pl.get('output','')); role='tool'
   if not text: continue
   text=re.sub(r'<in-app-browser-context[\s\S]*?</in-app-browser-context>', '', text).strip()
   if role in ['user','user_event'] and exclude.search(text): f_exclude=True
   if role in ['user','user_event'] and (text.startswith('# AGENTS.md') or text.startswith('<environment_context>') or text.startswith('<INSTRUCTIONS>') or '<turn_aborted>' in text or '<subagent_notification>' in text or text.startswith('<skill>') or '<external_codex_apps_open_page>' in text): stats['template_excluded_records']+=1; continue
   if role not in ['user','user_event','assistant','tool']: continue
   if kw.search(text): entries.append({'path':str(p),'line':n,'timestamp':ts,'role':role,'text':safe(text),'raw_hash':hashlib.sha256(text.encode()).hexdigest()})
   if role in ['user','user_event'] and text not in seen:
    seen.add(text); users.append({'path':str(p),'line':n,'timestamp':ts,'role':role,'text':safe(text),'relevant':bool(kw.search(text)),'research':bool(exclude.search(text))})
 if f_exclude:
  excluded_files.append(str(p)); stats['current_research_excluded_records']+=len(entries)
 else: hits+=entries
 stat['sha256']=digest.hexdigest(); stats['files_scanned']+=1
 with (OUT/'codex-files.jsonl').open('a') as o: o.write(json.dumps(stat,ensure_ascii=False)+'\n')
users=[u for u in users if u['path'] not in excluded_files and not u['research']]
stats['user_deduplicated']=len(users); stats['user_relevant']=sum(u['relevant'] for u in users); stats['matched_records']=len(hits)
stats['excluded_current_research_files']=excluded_files
stats['min_timestamp']=min(stats['timestamps']) if stats['timestamps'] else None; stats['max_timestamp']=max(stats['timestamps']) if stats['timestamps'] else None; del stats['timestamps']
for name in ['history.jsonl','session_index.jsonl']:
 p=ROOT/name; errs=[]; rec=0; ts=[]
 if p.exists():
  for n,line in enumerate(p.open(),1):
   try:
    x=json.loads(line); rec+=1
    if x.get('ts'): ts.append(x['ts'])
   except Exception as e: errs.append({'line':n,'error':str(e)})
 stats[name]={'exists':p.exists(),'records':rec,'parse_errors':errs}
hist=sqlite3.connect(f'file:{ROOT}/thread_history_1.sqlite?mode=ro',uri=True)
stats['thread_history']={'items':hist.execute('select count(*) from thread_items').fetchone()[0],'threads':hist.execute('select count(distinct thread_id) from thread_items').fetchone()[0],'types':dict(hist.execute('select item_type,count(*) from thread_items group by item_type'))}
known_ids={p.name.split('rollout-',1)[-1][20:].split('.jsonl')[0] for p in files}
# projected item IDs not sufficient to deduplicate; these are supplemental and not claimed as separate conversations.
proj=[]; perr=[]
for tid,ordinal,timestamp,typ,raw in hist.execute('select thread_id,rollout_ordinal,created_at_ms,item_type,item_json from thread_items'):
 try: x=json.loads(raw)
 except Exception as e: perr.append({'thread_id':tid,'ordinal':ordinal,'error':str(e)}); continue
 if typ=='userMessage':
  text='\n'.join(a.get('text','') for a in x.get('content',[]) if isinstance(a,dict))
  text=re.sub(r'<in-app-browser-context[\s\S]*?</in-app-browser-context>', '', text).strip()
  if kw.search(text) and not exclude.search(text) and text not in seen and not text.startswith('# AGENTS.md'): proj.append({'thread_id':tid,'ordinal':ordinal,'timestamp':timestamp,'text':safe(text)})
stats['thread_history']['parse_errors']=perr; stats['thread_history']['additional_user_matches']=len(proj)
(OUT/'codex-coverage.json').write_text(json.dumps(stats,ensure_ascii=False,indent=2))
(OUT/'codex-users.json').write_text(json.dumps(users,ensure_ascii=False,indent=2))
(OUT/'codex-projection-extra-users.json').write_text(json.dumps(proj,ensure_ascii=False,indent=2))
with (OUT/'codex-hits.jsonl').open('w') as o:
 for h in hits: o.write(json.dumps(h,ensure_ascii=False)+'\n')
print(json.dumps({k:v for k,v in stats.items() if k not in ['types','roles','missing_state_rollouts','excluded_current_research_files']},ensure_ascii=False,indent=2))
print('missing_rollout_count',len(missing),'excluded_current_research_files',len(excluded_files))
for i,u in enumerate(users):
 if u['relevant'] and correct.search(u['text']):
  print(i,u['timestamp'],u['path']+':'+str(u['line']),u['text'][:320].replace('\n',' '))
