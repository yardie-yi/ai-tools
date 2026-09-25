"""Small paired content-generation benchmark. Secrets stay in environment/registry."""
import argparse
import datetime as dt
import html
import json
import os
from pathlib import Path
import re
import statistics
import shutil
import subprocess
import time
import urllib.error
import urllib.parse
import urllib.request

ROOT = Path(__file__).resolve().parent


def credential(name):
    value = os.environ.get(name)
    if value:
        return value
    if os.name == 'nt':
        import winreg
        try:
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, 'Environment') as key:
                return winreg.QueryValueEx(key, name)[0]
        except OSError:
            pass
    raise RuntimeError('Missing credential: ' + name)


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise RuntimeError('Redirect refused for authenticated request')


def post_json(url, token, data, extra_headers=None):
    if urllib.parse.urlsplit(url).scheme != 'https':
        raise RuntimeError('HTTPS required')
    headers = {'Authorization': 'Bearer ' + token, 'Content-Type': 'application/json'}
    headers.update(extra_headers or {})
    req = urllib.request.Request(url, json.dumps(data, ensure_ascii=False).encode(), headers)
    start = time.perf_counter()
    try:
        with urllib.request.build_opener(NoRedirect()).open(req, timeout=100) as response:
            result = json.load(response)
    except urllib.error.HTTPError as exc:
        # Extract a short, redacted server explanation, never headers/full body.
        note = ''
        try:
            body = json.loads(exc.read(4096))
            error = body.get('error', {})
            note = str(error.get('message', error.get('type', ''))) if isinstance(error, dict) else str(error)
            for secret in [token, os.environ.get('ANTHROPIC_AUTH_TOKEN', '')]:
                if secret:
                    note = note.replace(secret, '[REDACTED]')
            note = re.sub(r'(?i)(sk-|ts_)[a-z0-9_-]+', '[REDACTED]', note)[:250]
        except Exception:
            pass
        raise RuntimeError('HTTP ' + str(exc.code) + (' ' + note if note else '')) from None
    except urllib.error.URLError as exc:
        raise RuntimeError('Network failure: ' + type(exc.reason).__name__) from None
    return result, time.perf_counter() - start


BACKEND = os.environ.get('BENCH_WRITER_BACKEND', 'codex')
WRITER_MODEL = 'gpt-6-astra' if BACKEND == 'codex' else os.environ.get('ANTHROPIC_DEFAULT_SONNET_MODEL', 'glm-5.1')


def writer(prompt, max_tokens=1800):
    if BACKEND == 'codex':
        start = time.perf_counter()
        executable = shutil.which('codex.cmd') or shutil.which('codex')
        args = [executable, 'exec', '--ephemeral', '--skip-git-repo-check',
                '--ignore-user-config', '-m', WRITER_MODEL,
                '-c', 'model_reasoning_effort="medium"',
                '-c', 'web_search="disabled"',
                '-c', 'model_provider="openai_http_benchmark"',
                '-c', 'model_providers.openai_http_benchmark.name="OpenAI HTTPS benchmark"',
                '-c', 'model_providers.openai_http_benchmark.wire_api="responses"',
                '-c', 'model_providers.openai_http_benchmark.requires_openai_auth=true',
                '-c', 'model_providers.openai_http_benchmark.supports_websockets=false',
                '--disable', 'plugins',
                '--json', '-']
        child = subprocess.run(args, input=('本次是受控的纯文本生成测速。资料已完整提供。'
                               '不要读取文件、调用工具、搜索网络、创建文件或执行命令；直接给出最终正文。\n'+prompt),
                               capture_output=True, text=True, encoding='utf-8', errors='replace',
                               cwd=ROOT, timeout=150)
        elapsed = time.perf_counter()-start
        messages, usage, tools_used, failures, item_errors = [], {}, [], [], []
        for line in child.stdout.splitlines():
            try:
                event = json.loads(line)
            except ValueError:
                continue
            if event.get('type') == 'item.completed':
                item = event.get('item', {})
                if item.get('type') == 'agent_message':
                    messages.append(item.get('text', ''))
                elif item.get('type') == 'error':
                    item_errors.append(str(item.get('message', ''))[:250])
                elif item.get('type') != 'reasoning':
                    tools_used.append(item.get('type'))
            if event.get('type') == 'turn.completed':
                usage = event.get('usage', {})
            if event.get('type') in ('error', 'turn.failed'):
                failures.append(event.get('message', str(event.get('error', ''))))
        if child.returncode or not messages:
            # Event messages are short diagnostics. Do not expose full child stdout/stderr.
            detail = str(failures[-1])[:200] if failures else 'no completed agent message'
            raise RuntimeError('Codex probe failed: '+detail)
        text = messages[-1]
        return {'elapsed_s':elapsed,'model':WRITER_MODEL, 'usage':usage,
                'stop_reason':'completed','text':text,'characters':len(text),
                'han_characters':len(re.findall(r'[\u4e00-\u9fff]',text)),
                'tools_used':tools_used,'backend':'codex-cli',
                'reasoning_effort':'medium','item_errors':item_errors}
    base = os.environ['ANTHROPIC_BASE_URL'].rstrip('/')
    url = base + ('/messages' if base.endswith('/v1') else '/v1/messages')
    result, elapsed = post_json(url, credential('ANTHROPIC_AUTH_TOKEN'), {
        'model': WRITER_MODEL,
        'max_tokens': max_tokens,
        'temperature': 0,
        'system': '你是准确、简洁的中文技术文档作者。只依据所给资料完成任务，不使用工具，不虚构命令或测试结果。',
        'messages': [{'role': 'user', 'content': prompt}],
    }, {'anthropic-version': '2023-06-01'})
    text = ''.join(x.get('text', '') for x in result.get('content', []) if x.get('type') == 'text')
    return {
        'elapsed_s': elapsed, 'model': result.get('model'),
        'usage': result.get('usage', {}), 'stop_reason': result.get('stop_reason'),
        'text': text, 'characters': len(text),
        'han_characters': len(re.findall(r'[\u4e00-\u9fff]', text)),
    }


def jev(payload):
    response, elapsed = post_json('https://api.typesafe.ai/v1/systemone',
                                  credential('TYPESAFE_API_KEY'), payload)
    return response, elapsed


CORPUS = [
    {'id': 'purpose', 'text': 'Ponytail 是编码助手的技能／插件，约束实现方式：先理解需求，再优先复用现有代码、标准库和平台能力。它不是业务程序需要调用的运行时 SDK。'},
    {'id': 'prerequisites', 'text': 'Codex 插件方式需要可用的 Codex CLI 和 Node.js；node 应在 hook 的 PATH 中。安装前可在终端检查 codex --version 和 node --version。'},
    {'id': 'install', 'text': '在终端依次执行：codex plugin marketplace add DietrichGebert/ponytail；codex plugin add ponytail@ponytail。不要把这两行当聊天中的 slash 指令。'},
    {'id': 'activate', 'text': '安装后运行 codex，在交互界面通过 /hooks 查看实际脚本并按界面流程信任。桌面版按 README 重启，在目标项目新开任务。当前 hook 配置有 SessionStart、SubagentStart、UserPromptSubmit 三类事件。'},
    {'id': 'first_task', 'text': 'Codex 中通过 @ 查找并选择 Ponytail 技能。初次使用可单独发送 @ponytail lite，然后提出一个小任务：先读 AGENTS.md、相关代码和调用处，优先复用，不新增不必要依赖，运行项目要求的验证。lite 是试用建议，插件缺省为 full。'},
    {'id': 'verification', 'text': '确认技能可被找到、模式与预期一致、助手读取实际代码、改动保持明确需求，并运行项目验证。安装成功不等于所有 hook 已经生效；确认实际输出。'},
    {'id': 'levels', 'text': 'lite 按要求实现并指出简单替代方案；full 实施简化阶梯；ultra 更积极收缩需求；off 停用当前模式。环境变量 PONYTAIL_DEFAULT_MODE 的优先级高于 config.json，未配置时为 full。Windows 配置路径为 %APPDATA%\\ponytail\\config.json。'},
    {'id': 'review', 'text': 'ponytail-review 关注当前 diff 的过度设计，列出可简化位置与替代方式；只报告不修改。标签包括 delete、stdlib、native、yagni、shrink。正确性、安全性与性能仍需正常审查。'},
    {'id': 'audit', 'text': 'ponytail-audit 以整个仓库为范围寻找重复封装、只有一个实现的接口、仅转发的包装层、无用配置等，按值得优先处理的程度给出报告。它不会自动实施删除。'},
    {'id': 'debt', 'text': 'ponytail-debt 扫描代码中的 ponytail: 注释，形成简化台账，包含位置、适用上限与升级条件。没有升级触发条件的记录应被标记。需要落盘时显式要求保存文件。'},
    {'id': 'gain', 'text': 'ponytail-gain 展示上游已有 benchmark 数据，不会计算当前项目节省的行数或成本。核查时 gain 仍包含较旧的单次生成统计，README 的代理执行基准已更新，两种测法不可混用。'},
    {'id': 'claude', 'text': 'Claude Code 在对话框分两次发送 /plugin marketplace add DietrichGebert/ponytail 和 /plugin install ponytail@ponytail。其技能通常用 /ponytail、/ponytail-review 等 slash 形式调用。'},
    {'id': 'cursor', 'text': 'Cursor 可 clone 仓库后执行 node ponytail/scripts/cursor-hooks.js install；规则文件和 hook 方式是替代路径，存在不同限制。具体配置应查 README 与 Cursor 适配文档。'},
    {'id': 'project_rules', 'text': '对于支持 AGENTS.md 的助手，可以把简化原则合并进项目规则，保留已有构建、硬件和测试要求。仅规则方式没有插件的自动状态、命令注册和 hook。插件 off 不会删除项目规则。'},
    {'id': 'hardware', 'text': '嵌入式项目中，简化不能删除真实硬件需要的校准，也不能在不了解执行上下文时随意改变延时、计时或阻塞方式。应先查已有实现，再根据真实环境验证。'},
    {'id': 'typesafe', 'text': 'TypeSafe 的 Jev 处理结构化判断、概率和选项；Ponytail 是给编码助手的规则。Ponytail 本身不需要 TypeSafe API Key。'},
]
MANDATORY = {'purpose', 'prerequisites', 'install', 'activate', 'first_task', 'verification'}
TASK = ('写一份“Windows 用户在 Codex 桌面版使用 Ponytail 的首次上手说明”。'
        '读者是初次接触的工程师。只介绍用途、安装、新任务激活、第一次调用与验证；'
        '不要展开其他宿主、审查工具或收益统计。')
OUTPUT_RULES = ('只输出 Markdown 正文，使用恰好四个编号步骤。中文正文控制在300至450个汉字左右（命令不计）。'
                '必须准确包含两条终端安装命令、/hooks、重启桌面版和新开任务、@ponytail lite，'
                '提醒实际项目验证。不得写成已替用户完成安装。')


def rank():
    payload = {
        'model': 'jev-latest',
        'state': {'writing_task': TASK, 'passages': CORPUS},
        'questions': {
            item['id']: {
                'type': 'noul',
                'instructions': f'Does `passages[{i}].text` provide directly useful material for `writing_task`?',
                'criteria': {
                    'true': 'Directly needed for the requested beginner Codex installation and first-use handout.',
                    'false': 'Other hosts, advanced topics, statistics, or tangential information outside the requested scope.',
                },
            } for i, item in enumerate(CORPUS)
        },
    }
    start = time.perf_counter()
    result, api_elapsed = jev(payload)
    scores = {item['id']: result['answers'][item['id']]['noul'] for item in CORPUS}
    # Explicitly required facts are retained in BOTH branches; model cannot discard them.
    retained = [x for x in CORPUS if x['id'] in MANDATORY or scores[x['id']] >= .7]
    return retained, {'api_s': api_elapsed, 'phase_s': time.perf_counter()-start,
                      'model': result.get('model'), 'usage': result.get('usage'),
                      'scores': scores, 'retained_ids': [x['id'] for x in retained]}


def assess(text, stop_reason):
    checks = {
        'marketplace_command': 'codex plugin marketplace add DietrichGebert/ponytail' in text,
        'install_command': 'codex plugin add ponytail@ponytail' in text,
        'hooks': '/hooks' in text, 'mode': '@ponytail lite' in text,
        'restart': '重启' in text, 'new_task': ('新' in text and ('任务' in text or '会话' in text)),
        'verification': '验证' in text or '测试' in text,
        'not_truncated': stop_reason not in ('max_tokens', 'length'),
    }
    return checks


def run():
    results = []
    for pair in range(1, 4):
        order = ['A', 'B'] if pair % 2 else ['B', 'A']
        for arm in order:
            print(json.dumps({'event':'start','pair':pair,'arm':arm}),flush=True)
            start = time.perf_counter()
            info = None
            passages = CORPUS
            if arm == 'B':
                passages, info = rank()
                print(json.dumps({'event':'typesafe_complete','pair':pair,'api_s':info['api_s'],
                                  'retained':len(passages),'model':info['model']}),flush=True)
            prompt = TASK + '\n' + OUTPUT_RULES + '\n资料：\n' + json.dumps(passages, ensure_ascii=False)
            result = writer(prompt)
            result.update({'pair': pair, 'arm': arm, 'total_s': time.perf_counter()-start,
                           'typesafe': info, 'input_characters': len(prompt),
                           'passage_count': len(passages)})
            result['checks'] = assess(result['text'], result['stop_reason'])
            results.append(result)
            (ROOT/'results.json').write_text(json.dumps(results, ensure_ascii=False, indent=2), encoding='utf-8')
            (ROOT/f'{arm}{pair}.md').write_text(result['text'], encoding='utf-8')
            print(json.dumps({k:result[k] for k in ('pair','arm','total_s','elapsed_s','characters','han_characters','stop_reason','checks')},ensure_ascii=False),flush=True)
    summary = {}
    for arm in ['A', 'B']:
        subset = [x for x in results if x['arm']==arm]
        summary[arm] = {
            'n': len(subset), 'median_s': statistics.median(x['total_s'] for x in subset),
            'min_s': min(x['total_s'] for x in subset), 'max_s': max(x['total_s'] for x in subset),
            'mean_s': statistics.mean(x['total_s'] for x in subset),
            'median_writer_s': statistics.median(x['elapsed_s'] for x in subset),
            'median_characters': statistics.median(x['characters'] for x in subset),
            'passed': sum(all(x['checks'].values()) for x in subset),
        }
    summary['change_pct'] = (summary['B']['median_s']/summary['A']['median_s']-1)*100
    summary['writer_requested'] = WRITER_MODEL
    summary['timestamp'] = dt.datetime.now().astimezone().isoformat()
    (ROOT/'summary.json').write_text(json.dumps(summary,ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(summary,ensure_ascii=False),flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser()
    parser.add_argument('--probe', choices=['jev','writer'])
    args=parser.parse_args()
    ROOT.mkdir(parents=True,exist_ok=True)
    try:
        if args.probe=='jev':
            r,t=jev({'model':'jev-latest','state':'This handout explains installing Ponytail in Codex.',
                     'questions':{'topic':{'type':'choice','instructions':'What is this text about?',
                                          'criteria':{'installation':'Installing a coding assistant plugin','other':'Other topics'}}}})
            print(json.dumps({'probe':'jev','elapsed_s':t,'response':r},ensure_ascii=False))
        elif args.probe=='writer':
            r=writer('只输出“连接成功”。',max_tokens=80)
            print(json.dumps({'probe':'writer',**r},ensure_ascii=False))
        else:
            run()
    except Exception as exc:
        print(json.dumps({'error_type':type(exc).__name__,'message':str(exc)},ensure_ascii=False),flush=True)
        raise SystemExit(1)
