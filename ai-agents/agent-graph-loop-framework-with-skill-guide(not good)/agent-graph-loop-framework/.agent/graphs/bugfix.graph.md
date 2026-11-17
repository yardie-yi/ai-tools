# Bugfix Graph

**用途**：问题单、运行时异常、错误行为、日志故障。

```text
START
  → CONTEXT
  → REPRODUCE_OR_TRACE
  → ROOT_CAUSE [Bugfix Loop]
  → ROOT_CAUSE_CHECK
      ├─ evidence sufficient → FIX_PLAN
      └─ weak/repeated hypothesis → REASSESS / FRESH_DEBUGGER_IF_STUCK
  → IMPLEMENT_FIX
  → TARGETED_VERIFY
      ├─ FAIL → ROOT_CAUSE / FIX
      └─ PASS or documented gap → REVIEW_IF_RISK
  → DONE / DONE_WITH_RISK / BLOCKED
```

完成条件：

- 说明复现方式或静态追踪证据。
- 区分 symptom 与 root cause。
- 最小修复，验证原问题与受影响的回归路径；构建和硬件验证按改动与可用环境选择。
- 高风险或测试期望可疑时，请独立 Reviewer 检查是否只是适配错误实现。

## Skill 绑定

- Entry：`.agent/skills/model-skill/SKILL.md`
- 主 Reference：`.agent/skills/model-skill/references/us-bug-fix.md`
- 调试 Reference：需要配置中的日志/进程命令时才加载 `.agent/skills/model-skill/references/debug-commands.md`
- 构建 Reference：需要项目构建时才加载 `.agent/skills/model-skill/references/us-build.md`
- 配置：`.evospec/module.config.yaml` 的 `paths`、`architecture`、`debug`、`development`、`build`
- 规则：按改动文件加载适用规则。生成 Bug 记录不代表修复正确，验证以实际证据为准。
