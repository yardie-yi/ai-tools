# 项目资源索引

> 本页是配置导航，不保存项目路径常量。先读取 `.evospec/module.config.yaml`。

## 模块信息

- 标识：`<config: module.id>`
- 名称：`<config: module.name>`
- 描述：`<config: module.description>`
- 根目录：`<config: module.root>`
- 平台/框架：`<config: module.platform>` / `<config: module.framework>`

## 文档与产物目录

| 用途 | 配置路径 |
|---|---|
| 架构来源 | `paths.architecture_sources` |
| 需求输入 | `paths.requirement_input` |
| 设计输出 | `paths.design_output` |
| Bug 记录 | `paths.bug_log_output` |
| 提交记录 | `paths.push_log_output` |
| 代码分析 | `paths.code_analysis_output` |

## 架构与关联模块

读取 `architecture.style`、`architecture.flow`、`architecture.layers` 和 `architecture.related_modules`。配置只用于导航，最终以当前源码和项目架构文档为准。

## 构建、部署与调试

- 构建：`@references/us-build.md`
- 环境：`@references/env-setup.md`
- 部署：`@references/us-board-deploy.md`
- 调试：`@references/debug-commands.md`

## 配置完整性

发现空值或 unresolved marker 时，明确指出完整配置路径；不得沿用其他项目的旧值。
