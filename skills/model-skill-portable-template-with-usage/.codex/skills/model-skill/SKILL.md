---
name: model-skill
description: 通用项目开发维护工作流入口。根据用户意图分发到需求、开发、修复、构建、部署、Git、调试、代码分析或规则管理流程；所有项目差异均从 .evospec/module.config.yaml 读取。
---

# 通用项目开发维护工作流

## 核心原则

1. **流程通用、参数配置化**：服务器、工具链、架构、日志、部署、Git、文档路径等项目差异，只允许出现在 `.evospec/module.config.yaml` 或 `.evospec/rules/` 中。
2. **配置优先**：执行任何阶段前先读取配置，不凭经验补全项目命令，不把配置值回写到 `references/*.md`。
3. **证据优先**：涉及代码、构建、部署和提交时，以仓库现状、命令输出和配置为准。
4. **渐进读取**：只读取当前阶段需要的配置节、规则和 reference，避免一次加载全部内容。

## 开发阶段地图

```text
需求分析 → 功能开发/Bug修复 → 编译构建 → 推板验证 → Git提交
```

| 用户意图关键词 | 分发到 | 子skill文件 |
|---|---|---|
| 分析需求、PRD、设计方案、接口设计 | 需求分析 | @references/us-requirements.md |
| 新增功能、添加插件、实现接口 | 功能开发 | @references/us-feature-dev.md |
| bug、报错、异常、定位问题、修复 | Bug修复 | @references/us-bug-fix.md |
| 编译、构建、make、cmake、ssh | 编译构建 | @references/us-build.md |
| 推板、adb、部署、验证 | 推板验证 | @references/us-board-deploy.md |
| 提交、commit、push、git | Git管理 | @references/us-git-submit.md |
| 调试、日志、串口、logcat | 调试命令 | @references/debug-commands.md |
| 项目文档、PRD路径、模块位置 | 项目资源 | @references/project-info.md |
| 环境配置、工具链、ssh连接 | 环境配置 | @references/env-setup.md |
| 分析代码、架构分析、流程分析、代码功能 | 代码分析 | @references/us-code-analysis.md |
| 查看规则、添加规则、禁用规则、规则管理 | 规则管理 | @references/us-rules.md |

## 新项目初始化与迁移

当用户要求初始化模板、迁移到新模块、完善项目配置或让本 Skill 适配当前仓库时，必须先读取 `@USAGE.md` 的“给 Agent 看的初始化协议”。先扫描当前仓库证据，再填写配置；服务器、远端目录、目标设备、板端路径、进程、正式 push 目标和凭据来源等无法可靠确认的信息必须询问用户，不得猜测。配置不完整的高风险能力应保持 `enabled: false`，默认只做静态检查和 dry-run。

## 执行协议

收到用户请求后按顺序执行：

1. 读取 `.evospec/module.config.yaml` 的 `schema_version`、`module`、`paths` 和当前阶段对应配置节。
2. 检查当前阶段所需字段：值为空、为 `REQUIRED` 或配置节 `enabled: false` 时，不构造虚假命令；说明缺失字段并继续完成不依赖该字段的部分。
3. 读取 `.evospec/rules/INDEX.md`，筛选当前阶段 `enabled` 的规则，再读取对应规则文件。
4. 读取上表对应的 `references/*.md`，按其中流程执行。
5. 跨阶段任务按实际顺序串联；每个阶段结束时明确输入、输出和下一阶段前置条件。

## 配置引用约定

reference 中使用 `<config: a.b.c>` 表示配置路径；数组使用 `<config: a.b[i]>`。执行时替换为真实值，不把占位符原样作为命令运行。

配置中的命令可使用以下模板变量：

- `{module.root}`、`{module.id}`、`{module.name}`
- `{artifact.id}`、`{artifact.local_path}`、`{artifact.target_path}`
- `{task.id}`、`{task.summary}`
- 其他变量以配置文件 `templating.variables` 为准

## 跨项目移植规则

移植到新项目时：

1. 复制 `.codex/skills/model-skill/`、`.evospec/rules/` 和 `.evospec/scripts/`。
2. 以通用模板创建 `.evospec/module.config.yaml`，只修改配置，不修改路由表和 reference 文件集合。
3. 保持 `references/` 中现有 Markdown 文件的文件名和职责稳定；项目独有步骤通过配置命令、规则开关或项目文档表达。
4. 迁移后运行配置检查：路径存在性、构建命令 dry-run、部署场景列表、Git push ref、输出目录可写性。
