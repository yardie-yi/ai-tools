# Fresh Agent Loop

## 触发

读取 `.agent/refresh-policy.yaml`。

## 交接

使用 `.agent/prompts/fresh-agent-handoff.md`，只传递：

- 任务契约
- 当前 Graph/Node
- Selected Skill/route、加载的 reference 和规则
- 相关 `.evospec` 配置字段与 unresolved items
- 当前代码状态
- 失败证据
- 已尝试动作摘要及结果
- 已否定假设
- 约束和停止条件

## 新 Agent 第一轮

1. 独立检查证据。
2. 明确接受或推翻旧 root cause。
3. 给出新的验证路径。
4. 未形成新证据前不复制旧修复。

## 结束

将旧 agent id、新 agent id、触发原因和结果写入 `refresh_history`。
