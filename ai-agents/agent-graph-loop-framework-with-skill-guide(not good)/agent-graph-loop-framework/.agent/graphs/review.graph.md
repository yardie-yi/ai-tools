# Review Graph

**用途**：只读代码审查、PR/diff 审查、风险审查。

```text
START
  → COLLECT_CONTRACT_AND_DIFF
  → VERIFY_AVAILABLE_EVIDENCE
  → REVIEW_REQUIREMENT_COVERAGE
  → REVIEW_CORRECTNESS
  → REVIEW_DOMAIN_RISKS
  → REVIEW_TEST_COVERAGE
  → VERDICT
      ├─ PASS
      ├─ PASS_WITH_RISK
      ├─ FAIL_LOCAL
      ├─ FAIL_STRUCTURAL
      ├─ NEED_USER_DECISION
      └─ BLOCKED_ENVIRONMENT
```

Reviewer 必须：

- 使用 fresh context。
- 只读，不修复。
- 每个 blocking finding 给出文件、符号、证据和建议方向。
- 不把格式或个人风格当作 blocking finding，除非隐藏真实缺陷。
- 对高风险或结论冲突场景，可启动 Second Reviewer；两个 Reviewer 的共识仍不能覆盖失败的确定性验证。

## Skill 绑定

Reviewer 可读取当前任务已经加载的 Skill reference、`.evospec` 配置和启用规则作为契约证据。`.agent/skills/model-skill/agents/grader.md` 只用于验证 Skill 分发与配置渲染，不能替代本 Graph 的代码 Reviewer。
