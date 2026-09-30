# Graph + Loop + Skill 多 Agent 工程框架

这是一套可移植到新项目的项目级 Agent 工程模板，适用于 Codex、Claude Code 和 Pi。

想先了解概念、运行方式和接入步骤，可看 [图解 HTML](docs/PROJECT_EXPLAINED.html) 或 [Markdown 说明](docs/PROJECT_EXPLAINED.md)。

它不依赖 LangGraph 才能运行，而是先以“协议化状态机 + 项目级 Skill”方式落地：

```text
用户任务
  ↓
Graph Router：选择任务图
  ↓
Coordinator：维护状态并调度
  ↓
Graph：控制宏观路线、权限和停止条件
  ↓
Skill Registry：选择并绑定已注册 Skill 的阶段流程
  ↓
.evospec：提供项目参数和启用规则
  ↓
Node / Loop：Observe → Decide → Act → Verify → Update → Route
  ↓
Explorer / Implementer / Debugger / Verifier / Reviewer
  ↓
Build / Test / Lint / Dry-run / CI 等确定性证据
```

## 核心设计

- **Graph**：针对不同任务定义不同路线，例如需求分析、开发、Bug 修复、编译调试、测试调试、代码审查和 Skill 辅助阶段。
- **Loop**：定义节点内部如何迭代、何时停止、何时升级和何时刷新新 Agent。
- **Skill**：`.agent/skills/` 是跨工具中央 Skill 目录；`model-skill` 仅在任务需要 `.evospec` 专有流程时提供需求、开发、修复、构建、部署、Git、调试、项目资源、环境、代码分析和规则管理方法，后续可注册独立 Skill。
- **EvoSpec**：`.evospec/module.config.yaml` 保存模块和项目参数；`.evospec/rules/` 保存项目约束。
- **Coordinator**：主线程角色，负责选图、选 Skill route、维护状态、分派任务、聚合证据和决定下一条边。
- **Verifier**：只负责确定性验证，不负责批准自己的实现。
- **Reviewer**：使用独立上下文进行只读审查。
- **Fresh Agent**：当原 Agent 重复失败、方向错误或上下文污染时，用干净交接包启动新 Agent。

## Graph 与 Skill 的关系

```text
Graph 决定：做什么、能不能写、何时停止、失败走哪里
Skill 决定：当前阶段按哪些项目化步骤执行
.evospec 决定：项目真实参数、路径、命令、规则开关是什么
```

Graph 的权限和风险边界优先。Skill 不能绕过只读 Graph、适用的验证或用户授权；Build/Test/Review 按任务影响选择，不是每次固定三件套。

## 快速开始

1. 把本目录内容复制到项目根目录。
2. 编辑 `.agent/project.yaml`，填入项目类型、门禁和重试预算。
3. 编辑 `.evospec/module.config.yaml`，先填入本次要使用的模块、构建、部署、调试或 Git 参数；未确认能力保持禁用。
4. 编辑 `scripts/project-commands.sh`，使 wrapper 与 `.evospec` 中的真实构建环境保持一致。
5. 根据需要删除不使用的平台适配目录，例如只用 Codex 时可删除 `.claude/` 和 `.pi/`。
6. 运行：

```bash
python3 scripts/validate-skills.py
python3 scripts/validate-framework.py
python3 scripts/validate-evospec.py
```

模板初始配置含 `REQUIRED`，`validate-evospec.py` 默认给出 WARN 而不失败；项目交付前可执行：

```bash
python3 scripts/validate-evospec.py --strict
```

7. 需要演练多阶段流程时，可创建 run state 并在 CLI 中输入：

```bash
python3 scripts/new-run.py "验证 Graph + Loop + Skill 框架"
```

```text
请按项目里的 Graph + Loop + Skill 协议执行。
先遵守 AGENTS.md；仅按目标读取相关 Graph/Loop，需要项目专有能力时再加载对应 Skill、配置和规则。多阶段任务才维护 run state。
任务：根据 .evospec/input/prd 中的 PowerManager 需求实现模块代码框架。
```

## 推荐的首次验证

Codex：

```bash
codex --ask-for-approval never "总结本项目加载到的 Graph、Skill registry 和默认安全边界。"
```

Claude Code：

```text
/agents
```

然后确认存在 `coordinator`、`explorer`、`implementer`、`debugger`、`verifier`、`reviewer`，并调用：

```text
/graph-loop-runner 分析当前项目配置是否完整，只做静态检查
```

Pi：

```text
启动后确认 Context 中加载了 AGENTS.md，并通过 /graph-development 等 prompt template 启动任务。
```

## 目录说明

- `AGENTS.md`：Codex、Pi 等工具的项目总入口。
- `CLAUDE.md`：Claude Code 项目入口。
- `.agent/`：跨工具核心协议、Graph、Node、Loop、状态、Prompt 和 Skill。
- `.agent/skills/registry.yaml`：所有中央 Skill、Graph binding、辅助 route、配置和规则入口的注册表。
- `.agent/skills/model-skill/`：已迁入的默认通用项目开发维护 Skill。
- `.evospec/skills/`：独立 Skill 的可选项目配置目录。
- `.evospec/`：项目参数、规则、需求输入、设计/Bug/提交/分析输出及部署辅助脚本。
- `.codex/`：Codex 自定义子 Agent 配置。
- `.claude/`：Claude Code 子 Agent、runner Skill 和可选 Hook。
- `.pi/`：Pi 的项目 settings、runner skill 和 prompt templates。
- `scripts/`：构建、测试、状态管理、EvoSpec 检查和框架校验脚本。
- `docs/`：架构、定制、使用、示例、model-skill 分析和新增 Skill 配置说明。


## 后续新增 Skill

完整流程见 [`docs/ADDING_SKILLS.md`](docs/ADDING_SKILLS.md)。核心规则：

```text
.agent/skills/<skill-id>/     唯一业务实现
.agent/skills/registry.yaml   注册 entry、Graph binding、route、配置和规则
.evospec/skills/              可选的 Skill 专用项目配置
.claude/skills/、.pi/skills/  只放薄适配器
```

新增后至少运行：

```bash
python3 scripts/validate-skills.py
python3 scripts/validate-framework.py
```

## 重要边界

- read-only Graph 不允许修改代码。
- Implementer 不能单独宣布任务完成。
- Build/Test 失败时，Reviewer 的主观判断不能覆盖确定性失败。
- `.evospec` 中的 `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG` 不得作为真实命令或路径执行。
- 无法运行硬件测试、专用工具链或 CI 时，结论只能是 `PASS_WITH_RISK` 或 `BLOCKED_ENVIRONMENT`，不能伪装成完整 `PASS`。
- 部署、push、目标端删除、停止进程和远端覆盖默认只允许静态检查/dry-run；真实执行需要用户明确授权。
- `.evospec/scripts/deploy_from_config.py` 使用配置驱动的 shell 命令，执行非 dry-run 前必须检查渲染结果。
- Pi 核心不假设内置 subagent；多 Agent 可通过多个 session、`/fork`、外部 tmux，或项目自行安装的 extension/package 实现。
