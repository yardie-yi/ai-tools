# Shared Subagents

本目录存放 Codex 和 Claude 通用的 subagent 角色定义。

这些文件是纯 Markdown 角色说明，不绑定任何单一工具的私有格式。Codex、Claude 或项目内 skill 都可以按绝对路径读取后作为子任务提示词使用。

## 目录定位

```text
C:\Users\Administrator\ai-tools\subagents\
```

## 角色列表

| 场景 | Subagent |
|---|---|
| 通用 bug 定位、异常分析 | `debugger.md` |
| 嵌入式、FreeRTOS、Linux、驱动、协议、板级问题 | `embedded-debugger.md` |
| 代码审查、风险检查、回归影响评估 | `code-reviewer.md` |
| 技术文档、日报、周报、会议纪要、复盘 | `doc-writer.md` |

## 调用原则

1. 主助手先判断任务是否需要专门角色。
2. 只有任务边界清晰时才调用 subagent。
3. subagent 只处理一个明确子任务，不承担全局调度。
4. subagent 输出必须结构化，方便主助手整合。
5. 不编造硬件现象、寄存器值、日志内容、测试结果。

## Codex 使用方式

当任务需要专门角色时，主助手可读取对应文件，例如：

```text
C:\Users\Administrator\ai-tools\subagents\debugger.md
```

然后将该文件内容作为 subagent 的角色约束，并补充当前任务输入。

适合在 skill 的 `SKILL.md` 中加入如下规则：

```md
## Subagent 使用规则

当任务需要专门角色时，优先读取全局 subagent：

- bug 定位：`C:\Users\Administrator\ai-tools\subagents\debugger.md`
- 嵌入式问题：`C:\Users\Administrator\ai-tools\subagents\embedded-debugger.md`
- 代码审查：`C:\Users\Administrator\ai-tools\subagents\code-reviewer.md`
- 文档输出：`C:\Users\Administrator\ai-tools\subagents\doc-writer.md`
```

## Claude 使用方式

Claude Code 也可直接引用同一批 Markdown 文件。

项目级 `CLAUDE.md` 或 skill 入口中可加入：

```md
当需要专门 subagent 时，读取：

- `C:\Users\Administrator\ai-tools\subagents\debugger.md`
- `C:\Users\Administrator\ai-tools\subagents\embedded-debugger.md`
- `C:\Users\Administrator\ai-tools\subagents\code-reviewer.md`
- `C:\Users\Administrator\ai-tools\subagents\doc-writer.md`
```

## 与 Skill 的关系

- `skills/<skill-name>/agents/`：放某个 skill 专用 subagent。
- `ai-tools/subagents/`：放多个项目、多个工具共用的 subagent。

如果一个角色只服务于单个 skill，放在该 skill 的 `agents/` 目录。
如果一个角色会被多个项目、Codex、Claude 共同使用，放在本目录。
