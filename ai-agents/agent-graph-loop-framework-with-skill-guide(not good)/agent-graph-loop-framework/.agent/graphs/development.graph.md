# Development Graph

**用途**：新增功能、实现模块、按需求生成代码框架。

```text
START
  → CONTEXT
  → REQUIREMENT_ANALYSIS / IMPACT_ANALYSIS [按需]
  → PLAN [按需]
  → IMPLEMENT [Implementation Loop]
  → TARGETED_VERIFY
      ├─ FAIL → FIX / DEBUG LOOP
      └─ PASS or documented gap → REVIEW_IF_RISK
  → DONE / DONE_WITH_RISK / BLOCKED
```

角色：

- Coordinator：主线程。
- Explorer：上下文和影响搜索。
- Implementer：按计划实施。
- Verifier：运行与改动相关且环境允许的检查；`scripts/verify.sh` 只在确需全套门禁时使用。
- Reviewer：安全关键、跨模块、高影响或难以独立判断时使用，只读且与实施者隔离。

验证边界：

- 构建配置、集成或产物受影响时运行对应构建；行为变更优先运行相关测试，再按风险扩大回归。
- 无关的全量构建、全量测试、部署或提交不是开发 Graph 的固定收尾步骤。
- 已知相关失败不能标记完成；关键检查受环境限制时说明风险，不伪称 PASS。

## Skill 绑定

- Entry：`.agent/skills/model-skill/SKILL.md`
- 主 Reference：`.agent/skills/model-skill/references/us-feature-dev.md`
- 构建 Reference：需要使用项目配置构建时才加载 `.agent/skills/model-skill/references/us-build.md`
- 配置：`.evospec/module.config.yaml` 的 `architecture`、`development`、`build`、`artifacts`、`paths`
- 规则：按文件与阶段加载适用规则；Skill reference 不自动触发后续构建、部署或审查。
