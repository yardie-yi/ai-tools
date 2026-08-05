---
name: model-skill
description: cluster-app 仪表盘HMI应用模块的开发维护总入口skill。手动触发。根据当前开发阶段自动分发到对应子skill，实现开发流程标准化。
---

# cluster-app 模块开发维护工作流

## 模块简介

cluster-app 是车载仪表盘 HMI 应用，基于 AWTK 框架，主进程为 awtkhmi，运行于 ac8215e 平台。

## 开发阶段地图

```
需求分析 → 功能开发/Bug修复 → 编译构建 → 推板验证 → Git提交
```

| 用户意图关键词 | 分发到 | 子skill文件 |
|---|---|---|
| 分析需求、PRD、设计方案、接口设计 | 需求分析 | @references/us-requirements.md |
| 新增功能、添加插件、实现接口 | 功能开发 | @references/us-feature-dev.md |
| bug、报错、异常、定位问题、修复 | Bug修复 | @references/us-bug-fix.md |
| 编译、构建、make、cmake、ssh | 编译构建 | @references/us-build.md |
|                                        |          |                                 |
| 推板、adb、部署、验证 | 推板验证 | @references/us-board-deploy.md |
| 提交、commit、push、git | Git管理 | @references/us-git-submit.md |
| 调试、日志、串口、logcat | 调试命令 | @references/debug-commands.md |
| 项目文档、PRD路径、模块位置 | 项目资源 | @references/project-info.md |
| 环境配置、工具链、ssh连接 | 环境配置 | @references/env-setup.md |
| 分析代码、架构分析、流程分析、代码功能 | 代码分析 | @references/us-code-analysis.md |
| 查看规则、添加规则、禁用规则、规则管理 | 规则管理 | @references/us-rules.md |

## 使用方式

收到用户请求后：

0. **首先读取 `.evospec/module.config.yaml`，将配置值加载到上下文**，后续所有操作以此配置为准，不使用任何硬编码值
1. 判断用户当前处于哪个开发阶段（可能跨多个阶段）
2. **读取 `.evospec/rules/INDEX.md`，加载当前阶段适用的 enabled 规则**
3. 读取对应子skill文件，按其指引执行；在规则检查点验证规则
4. 如果阶段不明确，直接问用户："你当前在哪个阶段？（需求分析 / 功能开发 / Bug修复 / 编译 / 推板验证 / Git提交）"

## 各阶段适用规则速查

| 阶段 | 适用规则 |
|------|----------|
| 功能开发 | R003 plugin-base · R007 chinese-comments · R008 no-redundant-ui-call · R009 presentation-access-via-controller |
| Bug修复 | R002 log-required · R007 chinese-comments · R008 no-redundant-ui-call · R009 presentation-access-via-controller |
| 推板验证 | R004 build-before-deploy |
| Git提交 | R001 commit-format · R002 log-required · R005 no-build-artifacts |

## 关键路径速查

> 产物路径从 `.evospec/module.config.yaml` 的 `artifacts` 节读取，以配置文件为准。

## 跨模块 skill 同步规则

将本模块 skill 同步到其他模块（如 update-service）时，**禁止直接覆盖**以下文件：

| 文件 | 原因 |
|------|------|
| `references/us-build.md` | 各模块编译命令、服务器路径、工具链不同 |
| `references/us-board-deploy.md` | 各模块推板路径、进程名、写保护方式不同 |

**可以同步**的文件（流程通用）：

| 文件 | 说明 |
|------|------|
| `references/us-git-submit.md` | git 提交/push 格式对所有模块一致 |
| `change_log.md` | 记录历史，各模块共用 |
| `SKILL.md` 中的通用规则 | 如本节跨模块规则 |

同步前必须先 diff 对比，确认只修改通用部分，不覆盖模块特有配置。
