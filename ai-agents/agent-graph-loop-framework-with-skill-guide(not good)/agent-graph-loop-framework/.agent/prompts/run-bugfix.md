# Bugfix Prompt

请执行 Bugfix Graph，并使用 model-skill。

任务/问题：`{{TASK}}`

证据：`{{EVIDENCE}}`

加载 `us-bug-fix.md`、按需 `debug-commands.md`、进入构建时 `us-build.md`，以及相关 `.evospec` 配置和 bug-fix 启用规则。

规则：先复现或静态追踪，再定位 root cause；只修根因；运行相关验证和回归。高风险或跨模块时使用只读 fresh Reviewer；反复没有新证据时考虑刷新 Debugger。生成 Bug 记录不能替代验证。
