# 架构说明

## 分层

```text
Project Instructions: AGENTS.md / CLAUDE.md
        ↓
Graph Router: .agent/router.yaml
        ↓
Task Graphs: .agent/graphs/
        ↓
Skill Registry: .agent/skills/registry.yaml
        ↓
Stage Workflow: .agent/skills/<selected-skill>/
        ↓
Project Configuration + Rules: .evospec/
        ↓
Reusable Nodes: .agent/nodes/
        ↓
Local Loops: .agent/loops/
        ↓
Roles: Coordinator / Explorer / Implementer / Debugger / Verifier / Reviewer
        ↓
Harness: Filesystem / Shell / Git / Build / Test / CI / MCP
        ↓
State + Evidence + Verdict + Refresh Policy
```

## 为什么是多个 Graph

不同任务具有不同目标、权限和停止条件。需求分析不应默认改代码；代码审查不应由 Reviewer 自动修复；编译调试的核心完成标准是相应构建恢复，而新功能开发应有需求覆盖及与风险相称的验证。独立审查仅在高风险、跨模块或用户要求时使用。

## 为什么仍然需要 Skill

Graph 描述需要时的宏观状态机，但不适合保存每种能力的详细执行方法。Skill 提供可复用阶段流程，registry 负责项目专有路由，`.evospec` 将项目差异配置化，避免把服务器、路径、进程和分支写进通用 Graph。`model-skill` 是当前内置 Skill，不是每个任务的默认步骤；后续独立能力可按 `docs/ADDING_SKILLS.md` 注册。

## 当前 Graph 与 model-skill 的组合

- `requirement` → `us-requirements.md`
- `development` → `us-feature-dev.md`；构建受影响时再读取 `us-build.md`
- `bugfix` → `us-bug-fix.md`；需要项目调试命令或构建时再读取相应 reference
- `compile-debug` → `us-build.md`；环境不就绪时再读取 `env-setup.md`
- 辅助构建、部署、Git、环境、代码分析和规则管理 → `skill-workflow` Graph

绑定关系见 `.agent/skills/registry.yaml`；仅在任务需要项目 Skill 时使用。

## 为什么 Verifier 与 Reviewer 分开

- Verifier 回答“命令和行为证据是什么”。
- Reviewer 回答“这些证据和改动是否满足任务契约、Skill 规则，是否存在遗漏风险”。
- Coordinator 将两者合并后路由。
- `model-skill/agents/grader.md` 只检查 Skill 分发和配置渲染，不替代二者。

## 为什么刷新 Agent

同一 Agent 的上下文可能被旧假设、重复日志和失败修复锚定。Fresh Agent 接收精简事实包，可以独立重新判断。但刷新不能解决产品需求或部署目标本身的歧义，这类问题必须交给用户或负责人。


## 多 Skill 扩展

新增 Skill 时，中央实现放在 `.agent/skills/<skill-id>/`。现有 Graph 可通过 `graph_bindings` 调用；短辅助流程使用全局唯一的 `auxiliary_routes`；具有独立权限、Loop 或停止条件的任务应新建 Graph。Codex、Claude 和 Pi 的平台目录只提供薄入口。
