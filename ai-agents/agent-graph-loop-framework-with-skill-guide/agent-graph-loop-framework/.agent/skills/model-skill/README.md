# model-skill 通用项目开发工作流

`model-skill` 是一个稳定路由层：保留需求、开发、修复、构建、部署、Git、调试、资源、环境、代码分析和规则管理 11 个 reference；项目差异全部集中在 `.evospec/module.config.yaml`。

## 使用说明

轻量初始化入口见 [`INITIALIZE.md`](INITIALIZE.md)；只有需要字段细节时再查 [`USAGE.md`](USAGE.md)。新项目首次使用某项能力前配置该能力依赖的字段；未确认的服务器、部署和 push 信息不得猜测。

## 使用方式

在本 Graph + Loop 框架中显式调用：

```text
请按项目 Graph Router 执行，并使用 model-skill，帮我分析这个需求
请按项目 Graph Router 执行，并使用 model-skill，修复这个崩溃
请按项目 Graph Router 执行，并使用 model-skill，编译并部署
```

执行顺序：判断是否需要本 Skill → 选择当前 route → 按需读取配置、规则和对应 reference → 执行并产出证据。不自动进入下一阶段。

## references 文件集合

| 文件 | 职责 |
|---|---|
| `us-requirements.md` | 需求分析与设计文档 |
| `us-feature-dev.md` | 功能实现与开发检查 |
| `us-bug-fix.md` | 定位、修复与回归 |
| `us-build.md` | 配置驱动构建 |
| `us-board-deploy.md` | 配置驱动部署与验证 |
| `us-git-submit.md` | Commit、push 与记录 |
| `debug-commands.md` | 日志、进程和调试命令 |
| `project-info.md` | 项目资源配置导航 |
| `env-setup.md` | 环境与凭据检查 |
| `us-code-analysis.md` | 持久化代码分析 |
| `us-rules.md` | 规则生命周期管理 |

跨项目迁移时保持以上文件名和职责不变。

## 配置分层

`.evospec/module.config.yaml` 主要配置节：

- `module`：模块身份、平台、框架和运行进程
- `paths`：输入与输出目录
- `work_item`：任务系统、编号和文件命名
- `architecture`：分层、数据流和关联模块
- `build` / `artifacts`：构建策略与产物
- `deploy`：部署场景、命令模板和验证标准
- `debug`：日志、进程和配置文件查询
- `git`：commit 模板、push 目标和禁止路径
- `development`：语言、日志、注释、性能与扩展契约
- `code_analysis`：已有分析文档的选择提示

所有命令中的密码、token 和私钥不得写入配置。

## 移植到新项目

1. 复制 `.agent/skills/model-skill/`、`.evospec/rules/`、`.evospec/scripts/`。
2. 复制通用模板配置；先填写本次需要的 `REQUIRED` 项，其他占位符保留且不得作为真实命令执行。
3. 保持 `references/*.md` 不增不删；项目特殊流程优先表达为配置命令或规则开关。
4. 删除模板中的示例输入/输出，只保留 `.gitkeep`。
5. 只验证本次准备使用的能力：相关配置占位符、构建命令/产物或部署 `--list/--dry-run`；Git push 模板仅在计划推送时检查。

## 部署脚本

`push_to_board.bat` 是通用包装器，实际逻辑由 `deploy_from_config.py` 读取配置：

```bat
.evospec\scripts\push_to_board.bat --list
.evospec\scripts\push_to_board.bat code_only --dry-run
.evospec\scripts\push_to_board.bat code_only
```

需要 Python 3 与 PyYAML。自动化 Agent 也可以不使用脚本，直接按 `us-board-deploy.md` 渲染命令。

## 修改边界

- 改服务器、路径、芯片、进程、日志宏、分支：改配置。
- 改项目强制约束：改规则和对应配置开关。
- 改所有项目共用流程：才改 reference。
- 改适用边界：才改 `SKILL.md` 描述或轻量索引。
