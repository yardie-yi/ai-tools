# Refactor Graph

**用途**：明确要求行为保持不变的去重、拆分和结构调整。

```text
START
  → CONTEXT
  → RELEVANT_BASELINE
      ├─ AVAILABLE → REFACTOR_PLAN
      └─ UNAVAILABLE → DOCUMENT_RISK
  → IMPLEMENT_SMALL_STEP [Implementation Loop]
  → TARGETED_VERIFY
      ├─ PASS + more steps → IMPLEMENT_SMALL_STEP
      ├─ PASS + done → REVIEW_IF_RISK
      └─ FAIL → REVERT_OR_DEBUG
  → DONE
```

保留可比较的行为基线，按改动范围验证；不要求每一小步都跑全量构建和测试。无法建立基线时，不得宣称行为完全保持不变。

## Skill 绑定

需要项目特有的构建或规则时，按需参考 `.agent/skills/model-skill/references/us-feature-dev.md`；普通重构不自动加载该 Skill。
