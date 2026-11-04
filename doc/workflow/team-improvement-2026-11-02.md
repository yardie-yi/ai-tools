# Agent 团队配置改进记录

> 已撤销：用户随后要求回退本轮全局规则修改并重建团队。仓库源、Codex 与 Claude 的全局规则已恢复；旧 subagents 内容已直接删除，目录改为 Team。以下保留为历史记录，其中的旧路径、同步状态与验证命令不代表当前配置。当前入口见 [Team](../../Team/README.md)，本次重建见 [Team 设置记录](team-setup-2026-11-02.md)。

2026 年 11 月 2 日，根据 [Lauren 帖文及评论学习笔记](poteto-bot-team-notes.md)，把可执行的协作规则写入当前 Codex、Claude 配置和共享角色说明。

## 配置变化

| 项目 | 修改前 | 修改后 |
| --- | --- | --- |
| 全局规则 | 完成证据与持久化要求 | 原文保留，追加复杂需求复述、按需分工、复用流程与自动任务触发规则 |
| 角色数量 | 4 个 Markdown 角色 | 仍为 4 个，未注册新 Bot |
| 共享角色入口 | 旧 Windows 路径与重复接入示例 | 当前 Linux 路径、跨机器定位方法、按需加载入口 |
| 委派 | 泛化的调用原则 | 明确目标、输入、读写范围、产物、验收与交接条件 |
| 整合验收 | 结构化输出要求 | 主助手核对命令输出和产物，对受影响的交互补充验证 |
| 可复用经验 | 依赖人工选择角色文件 | 全局入口指向共享约定，四个角色均引用该约定 |

修改文件：

- 仓库规则源：`ai-tools/AGENTS.MD/全局/AGENTS.md`。
- 本机部署副本：`/home/yardie/.codex/AGENTS.md`、`/home/yardie/.claude/CLAUDE.md`。
- 共享约定与角色：`ai-tools/subagents/README.md`、`code-reviewer.md`、`debugger.md`、`doc-writer.md`、`embedded-debugger.md`。

四个角色的原有正文保留，各增加一条共享约定入口。共享 README 从 74 行改为 53 行；此数字只表示文件规模变化，不代表运行成本或效率改善。

## 备份与核验

修改前的 8 个文件保存在 `/home/yardie/.local/state/ai-tools/team-improvement-20261102-4a8rltat/`，`manifest.json` 记录原路径、备份路径和 SHA-256。同步部署副本前检查其仍与备份一致，避免覆盖期间发生的用户修改。

已执行的检查包括：备份哈希核对、原有全局规则逐字保留、三份全局规则字节比较、四个角色原正文比较、9 个本地 Markdown 引用与全局入口路径检查、代码围栏及尾随空格检查。结果如下：

```text
PASS: 8/8 backup hashes match the before-state manifest
PASS: 3/3 global instruction copies match; original evidence and persistence rules preserved
PASS: 4/4 original role bodies preserved; each adds one shared-contract pointer
PASS: 9 local Markdown links and the global entry path resolve; stale Windows paths removed
PASS: modified source files have balanced code fences and no trailing whitespace
BEFORE/AFTER: shared README 74 -> 53 lines; roles 4 -> 4
Global SHA-256: d664d8b39b8a07199a4717bfa3e8f0ddf9bf09fca28ea5af4192ab63d0367d0c
```

以下为实际执行的最终核验命令，从 `/home/yardie/Desktop/persional/ai-tool` 运行。它会重新比较部署内容、验证角色及文档入口，并检查 Git diff 的空白问题：

```bash
python3 - <<'PY'
from pathlib import Path
import re
repo = Path('ai-tools').resolve()
source = repo / 'AGENTS.MD/全局/AGENTS.md'
assert source.read_bytes() == Path('/home/yardie/.codex/AGENTS.md').read_bytes()
assert source.read_bytes() == Path('/home/yardie/.claude/CLAUDE.md').read_bytes()
files = list((repo / 'subagents').glob('*.md')) + list((repo / 'doc/workflow').glob('*2026-11-02.md')) + [repo / 'doc/workflow/poteto-bot-team-notes.md']
links = 0
for path in files:
    for target in re.findall(r'\[[^\]]+\]\(([^)]+)\)', path.read_text()):
        if '://' not in target:
            assert (path.parent / target).resolve().is_file(), (path, target)
            links += 1
print('PASS: 3 global instruction copies identical')
print(f'PASS: {links} local role and workflow-document links resolve')
PY

git -C ai-tools diff --check -- subagents
```

## 生效范围与限制

当前聊天已收到更新后的 AGENTS.md 文本；Claude 的配置文件已同步，但未启动新的 Claude 会话验证加载。角色文件仍是按需读取的说明，不是工具层强制的权限沙箱。跨机器迁移时需重新定位仓库入口。

本次未运行多 Agent 实战、创建自动任务、修改外部账号权限或发布仓库，未测量 token、耗时和返工变化。配置检查通过不等于行为效果已得到验证；后续真实任务需以实际产物和运行记录评估效果。
