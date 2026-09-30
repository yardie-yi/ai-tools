# Documentation Graph

**用途**：README、设计文档、接口文档和注释。

```text
START → CONTEXT → DOC_PLAN → WRITE_DOCS → CONSISTENCY_VERIFY → OPTIONAL_REVIEW → DONE
```

默认只修改文档和注释。文档中的接口、命令、路径和行为必须从源码、脚本或 CI 证据确认，不能凭记忆编写。

## Skill 绑定

生成代码架构分析文档时使用 `.agent/skills/model-skill/references/us-code-analysis.md`，输出目录来自 `.evospec/module.config.yaml` 的 `paths.code_analysis_output`。普通 README/接口文档按本 Graph 执行即可。
