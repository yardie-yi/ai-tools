# Model Skill Workflow Prompt

请按 `.agent/graphs/skill-workflow.graph.md` 执行。

任务：`{{TASK}}`

要求：

1. 读取 `.agent/skills/registry.yaml` 和 `.agent/skills/model-skill/SKILL.md`。
2. 从 auxiliary routes 中选择 exactly one route。
3. 只加载对应 reference、相关 `.evospec` 配置和当前阶段启用规则。
4. 先执行 Skill preflight。
5. unresolved markers 不得作为真实值。
6. 部署、push、目标端删除、停止进程和远端覆盖默认只允许 dry-run；真实执行需要用户明确授权。
7. 输出命令、exit code、产物/文档、规则检查、未解析配置和下一步。
