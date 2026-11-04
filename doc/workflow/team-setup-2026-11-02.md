# Team 设置记录

2026 年 11 月 2 日，按用户更正，撤销此前加入全局 AGENTS.md 的协作规则，直接删除旧 subagents 内容并将目录改名为 Team。本轮未创建备份；回退使用此前已存在的原始文件副本。

## 当前结果

入口为 [Team README](../../Team/README.md)。团队按用户实际工作设置为当前主助手 Lead 加四类专业角色：Analyst 需求与架构、Engineer 嵌入式开发、Quality 独立质量验证、Work Assistant 工作事务。角色按需使用，不默认全员运行。

| 项目 | 修改前 | 当前 |
| --- | --- | --- |
| 全局规则 | 原要求外新增协作与流程改进段落 | 仓库源、Codex 和 Claude 三份均恢复原文 |
| 角色目录 | subagents，5 个旧文件 | 旧内容直接删除，目录改名为 Team |
| 团队组织 | 通用 debugger / embedded-debugger / reviewer / doc-writer | Lead 统筹，四类专业角色覆盖具体工作链路 |
| 开发流程 | 角色说明未落实完整开发主线 | 对齐 → 实现 → 自测 → 独立审查 → 板端或模拟验证 → 小交付与人工审查 |
| 非开发工作 | 泛化文档角色 | 资料知识库、周报工时、餐补分别路由到已有 Skill |
| 调用方式 | 全局规则中加入角色入口 | 不改全局加载规则，由用户显式要求读取 Team 入口 |

## 设计依据

- 原全局规则保留证据与持久化要求，Team 仅引用，不复制修改。
- [原开发工作流](../../ai-agents/workflow/复杂需求与架构输入_Agent开发流程交接_20261021.md)提供六步主线、Graph 依赖与唯一写入者、Loop 修复预算、复杂资料对齐、板端与模拟证据边界。
- [帖文与评论笔记](poteto-bot-team-notes.md)提供少而精、复用 Skill、脚本承担稳定步骤、职责与权限明确、完成可验证的建议。
- 已阅读现有开发维护、21L 排查、车辆服务协议、接口登记、UI 同步、资料整理、周报工时和餐补 Skill。业务细节保留在原 Skill；Team 只做分工和路由，项目配置不跨项目复用。

## 文件布局

```text
Team/
  README.md
  resources.md
  roles/
    lead.md
    analyst.md
    engineer.md
    quality.md
    work-assistant.md
  workflows/
    development.md
    operations.md
  templates/
    task.md
```

## 验证方法

回退时逐文件比较原始 SHA-256，确认三份规则恢复；逐个删除旧目录条目后执行目录重命名，确认新目录当时为空。随后创建 Team 的 10 个文件。

最终执行下列命令检查三份全局规则的原始哈希、旧目录与文件缺失、Team 文件清单、本地链接和 Markdown 格式，以及改动后的文档引用。检查范围不包含未改动的其他工作区文件。

```bash
python3 - <<'PY'
from pathlib import Path
import hashlib, re
repo = Path('/home/yardie/Desktop/persional/ai-tool/ai-tools')
baseline = '6d7ef56dccda93b90de4a85970eff6c3c3183450c60654a83144bf8ce19a3ec6'
for path in [repo / 'AGENTS.MD/全局/AGENTS.md', Path('/home/yardie/.codex/AGENTS.md'), Path('/home/yardie/.claude/CLAUDE.md')]:
    assert hashlib.sha256(path.read_bytes()).hexdigest() == baseline, path
print('PASS: 3/3 global instruction files restored to original SHA-256')
assert not (repo / 'subagents').exists()
team = repo / 'Team'
expected = {'README.md', 'resources.md', 'roles/lead.md', 'roles/analyst.md', 'roles/engineer.md', 'roles/quality.md', 'roles/work-assistant.md', 'workflows/development.md', 'workflows/operations.md', 'templates/task.md'}
assert {str(p.relative_to(team)) for p in team.rglob('*') if p.is_file()} == expected
assert not any(p.name in {'debugger.md', 'embedded-debugger.md', 'code-reviewer.md', 'doc-writer.md'} for p in team.rglob('*'))
print('PASS: old directory and old role files absent; 10/10 new Team files present')
files = list(team.rglob('*.md')) + [repo / 'doc/workflow' / name for name in ['poteto-bot-team-notes.md', 'team-improvement-2026-11-02.md', 'team-setup-2026-11-02.md']]
links = 0
for path in files:
    body = path.read_text()
    assert sum(line.startswith('```') for line in body.splitlines()) % 2 == 0, path
    assert not any(line.rstrip() != line for line in body.splitlines()), path
    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', body):
        if '://' not in target:
            target_path = target.split('#', 1)[0]
            assert (path.parent / target_path).resolve().is_file(), (path, target)
            links += 1
print(f'PASS: {links} local file links resolve; Markdown format checks pass')
for path in team.rglob('*.md'):
    assert 'subagents/' not in path.read_text(), path
print('PASS: Team has no references to the deleted role directory')
PY

git -C ai-tools diff --check
```

实际输出：

```text
PASS: 3/3 global instruction files restored to original SHA-256
PASS: old directory and old role files absent; 10/10 new Team files present
PASS: 55 local file links resolve; Markdown format checks pass
PASS: Team has no references to the deleted role directory
```

Python 校验退出码为 0；`git -C ai-tools diff --check` 无输出、退出码为 0。

## 规则审阅与未验证项

已逐项审阅以下任务如何流转；这是规则检查，不是实际业务任务运行：

| 场景 | 按 Team 应有的行为 |
| --- | --- |
| 新增模块但取消接口语义冲突 | Analyst 标出冲突，由 Lead 收敛需求；不静默选一种语义编码 |
| 只分析 21L 超时日志 | Engineer 调用对应 Skill，只分析证据，不自动修代码或操作板卡 |
| 只编译 8775 | 核对项目配置与服务器目录，编译结果单列，不自动部署 |
| 协议同步 | Engineer 作为生成链唯一写入者，依次更新表格、生成、构建及同步契约 |
| 模拟通过但要求真实板端 | 模拟范围可通过，必需板端项仍未完成 |
| 只更新周报 | Work Assistant 按对应模式处理本期周报，不顺带改工时 |
| 相同任务再次填餐补 | 按 Skill 查重，只补缺失记录，回读日期与金额 |
| 简单文字修改 | 当前助手直接执行与核验，不创建整队 |

未注册平台原生 Agent、未创建调度、未运行真实开发/板端/飞书任务，也未验证新的 Claude 会话加载或多 Agent 执行效果。独立审查需要实际独立执行者；Markdown 角色权限并不是工具层隔离。真实效果需在后续具体任务中用运行证据检验。
