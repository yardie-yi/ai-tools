# Requirement Analysis Prompt

请执行 Requirement Analysis Graph，只读，不修改代码。

任务：`{{TASK}}`

加载：

- `.agent/skills/model-skill/references/us-requirements.md`
- `.evospec/module.config.yaml` 的 `module`、`paths`、`work_item`、`architecture`、`development`
- 当前阶段启用规则

输出：

- 需求契约
- 影响模块和调用链
- 接口/状态/任务/中断/配置/诊断/测试影响
- 需求点到实现位置和验证方式的追踪矩阵
- 假设、风险和真正阻塞问题
- 高风险时使用独立 Reviewer
