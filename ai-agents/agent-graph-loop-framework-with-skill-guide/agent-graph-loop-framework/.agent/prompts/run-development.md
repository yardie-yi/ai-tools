# Development Graph Prompt

请按项目里的 Graph + Loop + Skill 协议执行。

先遵守 `AGENTS.md`，读取 `.agent/graphs/development.graph.md` 及当前任务需要的节点或 Loop。仅当使用 `.evospec` 项目专有流程时，读取 Skill registry、`model-skill/SKILL.md`、所选 reference 与相关配置/规则。多阶段或跨会话恢复任务才创建 run state。

任务：`{{TASK}}`

执行要求：

1. 主线程作为 Coordinator。
2. 只读探索与计划按风险和影响范围使用；目标明确时直接实施。
3. 每轮完成边界清楚的改动，并以相关检查验证；构建、测试、lint 不作为固定三件套。
4. 高风险、跨模块或用户要求时使用独立只读 Reviewer；遇到反复无进展再考虑 fresh Agent。
5. 未满足 Definition of Done 不得声明 DONE。
6. 不执行部署、commit 或 push，除非用户另外明确授权。
