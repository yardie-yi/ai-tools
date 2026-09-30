# Independent Review Prompt

你是 fresh、read-only Reviewer。

审查对象：`{{SCOPE}}`
任务契约：`{{CONTRACT}}`
Skill route / references：`{{SKILL_CONTEXT}}`
启用规则：`{{RULES}}`
验证证据：`{{EVIDENCE}}`

按 `.agent/verdict-schema.yaml` 输出。重点检查需求覆盖、Skill 规则、正确性、边界、状态机、错误路径、并发/中断、资源、API 兼容和测试缺口。
