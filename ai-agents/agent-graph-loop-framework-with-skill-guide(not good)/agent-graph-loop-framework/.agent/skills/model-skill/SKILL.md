---
name: model-skill
description: 处理需要本项目 .evospec 配置的专有流程，如构建、推板、提交或生成需求/缺陷记录；普通代码问答和局部编辑不触发。
---

# 项目流程索引

本 Skill 提供配置驱动的阶段方法，不决定任务权限、Graph 或是否继续下一阶段。先按用户目标选择一项，只读取对应文件；跨阶段任务才加载额外 reference。不要按关键词机械匹配或一次读取全部资料。

| 当前任务需要 | 读取 |
|---|---|
| 生成需求分析或设计交付物 | [us-requirements.md](references/us-requirements.md) |
| 按项目约定开发功能 | [us-feature-dev.md](references/us-feature-dev.md) |
| 定位并记录缺陷修复 | [us-bug-fix.md](references/us-bug-fix.md) |
| 使用配置的构建策略 | [us-build.md](references/us-build.md) |
| 在目标设备部署或验证 | [us-board-deploy.md](references/us-board-deploy.md) |
| 用户要求提交或推送 | [us-git-submit.md](references/us-git-submit.md) |
| 使用项目日志/进程调试命令 | [debug-commands.md](references/debug-commands.md) |
| 查找项目参数或资源路径 | [project-info.md](references/project-info.md) |
| 配置或排查工具链环境 | [env-setup.md](references/env-setup.md) |
| 产出项目代码架构分析 | [us-code-analysis.md](references/us-code-analysis.md) |
| 查看或修改项目规则 | [us-rules.md](references/us-rules.md) |
| 初始化或迁移此 Skill 的项目配置 | [INITIALIZE.md](INITIALIZE.md)；仅需字段细节时再查 [USAGE.md](USAGE.md) |

执行前只读取当前动作依赖的 `.evospec/module.config.yaml` 配置节及适用规则。配置缺失时不猜测命令、路径或目标；可继续完成不依赖它的安全部分。`<config: a.b>` 是配置引用，不是可执行文本。

本地已确认安全的检查、构建和相关测试可按任务需要执行。部署、push、远端删除/覆盖或停进程须有具体用户授权；构建成功不自动进入部署，修复完成也不自动进入提交。结果以实际证据为准。
