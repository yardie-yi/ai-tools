# Claude Code Project Instructions

先遵守 `AGENTS.md`。`.agent/` 是按需索引的 Graph/Loop/Skill 定义，`.evospec/` 是项目专有配置；普通问答与局部编辑不必加载全套流程。

Claude Code 处理需要多阶段追踪的任务时：

1. 按目标选择相关 Graph；只有需要 `.evospec` 专有流程时才从 registry 选择 Skill，并加载对应 reference、配置和规则。
2. 仅在并行探索、独立审查或长任务上下文隔离确有收益时使用项目级 subagent；不强制拆分每个阶段。
3. 高风险、跨模块或用户要求时使用独立只读 Reviewer。Verifier 的命令结果必须是真实执行证据。
4. 需要恢复的任务使用 `.agent/state-template.json`；短任务无需 run state。上下文反复无进展时才考虑 fresh Agent。
5. 安全的本地编辑、定向检查、构建和测试可直接执行；部署、push 和远端破坏性动作需要具体授权。

可直接调用项目 Skill：

```text
/graph-loop-runner <任务描述>
```

项目级 Stop Hook 默认为关闭状态。需要 Stop 门禁时，参考 `.claude/settings.stop-gate.example.json`，审阅后再合并到 `.claude/settings.json`。

新增 Claude Skill 时，业务实现必须保留在 `.agent/skills/<skill-id>/`；`.claude/skills/` 只放薄适配器。完整步骤见 `docs/ADDING_SKILLS.md`。
