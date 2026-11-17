# Requirement Analysis Graph

**用途**：需求解析、需求变更影响、设计输入和实现方案；默认只读。

```text
START
  → CONTEXT
  → REQUIREMENT_ANALYSIS [Requirement Analysis Loop]
  → IMPACT_ANALYSIS
  → PLAN
  → CONDITIONAL_REVIEW
      ├─ simple/low-risk → DONE
      └─ cross-module/safety/ambiguous → INDEPENDENT_REVIEW
            ├─ PASS → DONE
            ├─ FAIL_LOCAL → REQUIREMENT_ANALYSIS
            └─ NEED_USER_DECISION → USER
```

引用：

- `.agent/nodes/context.md`
- `.agent/nodes/requirement-analysis.md`
- `.agent/nodes/impact-analysis.md`
- `.agent/nodes/plan.md`
- `.agent/loops/requirement-analysis-loop.md`
- `.agent/loops/review-loop.md`

完成条件：

- 需求点可追踪。
- 受影响模块、接口、状态、任务/中断、配置、诊断和测试范围明确。
- 假设和阻塞问题明确。
- 非简单需求已经独立审查，或说明为何不需要。

## Skill 绑定

- Entry：`.agent/skills/model-skill/SKILL.md`
- Reference：`.agent/skills/model-skill/references/us-requirements.md`
- 配置：`.evospec/module.config.yaml` 的 `module`、`paths`、`work_item`、`architecture`、`development`
- 规则：加载需求阶段适用且 enabled 的 `.evospec/rules/`；无匹配规则时不强行套用开发规则。
