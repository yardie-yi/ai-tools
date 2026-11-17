# Node: EXECUTE_SKILL_ROUTE

1. 按 `.agent/skills/registry.yaml` 选定 Skill 和 route/reference。
2. 使用该 Skill 在 registry 中声明的 `project_config` 渲染配置引用和模板变量；没有配置文件时只使用明确输入与仓库证据。
3. 应用该 Skill 声明的 `rules_index` 中当前 route 启用的规则。
4. 所有动作仍遵循 Universal Loop：Observe → Decide → Act → Verify → Update State → Route。
5. Skill reference 不得覆盖当前 Graph 的编辑权限与验证边界；Reviewer 仅在风险或用户要求触发时使用。
6. 保存 Skill ID、route、reference、命令、exit code、产物、输出文档、规则检查和未解析项。
7. 每次只加载当前动作所需的 Skill/reference；多个能力可在任务需要时组合，但不预读全部内容。
