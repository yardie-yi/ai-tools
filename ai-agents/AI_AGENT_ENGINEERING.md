---
title: 项目内 AI Agent 工程化方案（CLI 使用版）
document_id: PROJECT-LOCAL-AI-AGENT-ENGINEERING
version: 1.0.0
status: baseline
scope: project-local
audience:
  - Codex CLI
  - Claude Code
  - Pi
  - OpenCode
  - OMP
language: zh-CN
---

# 项目内 AI Agent 工程化方案（CLI 使用版）

## 0. 文档用途

本文档用于指导 CLI Agent 在**单个软件项目内部**搭建、运行和迁移 AI Agent 工程化平台。

目标是让开发者在项目根目录启动 Codex、Claude Code、Pi、OpenCode 或其他终端 Agent 后，Agent 能按照以下工程方式运行：

- Harness Engineering：执行环境、权限、沙箱、进程、工作树、上下文和质量门禁。
- Loop Engineering：分析、计划、实施、验证、审查、修复和再验证闭环。
- Graph Engineering：任务依赖图、并行工作流、状态转移和资源锁。
- Skill Engineering：可复用的方法、脚本、参考资料和项目知识。
- Context Engineering：按角色提供最小且充分的上下文。
- Reliability Engineering：超时、重试、恢复、幂等和人工升级。
- Evaluation Engineering：记录一次通过率、返工次数、缺陷逃逸率和人工介入率。

本文档同时面向两类读者：

1. **人类开发者**：理解平台结构、配置边界和迁移方式。
2. **CLI Agent**：根据本文档创建、检查、修改或迁移项目内 Agent 配置。

本文档中的关键词含义如下：

- **MUST / 必须**：不可违反的约束。
- **MUST NOT / 禁止**：不可执行的行为。
- **SHOULD / 应当**：除非有明确理由，否则应遵守。
- **MAY / 可以**：可选能力。

---

# 1. 核心需求

项目内 AI Agent 平台必须满足以下需求。

## 1.1 终端内运行

开发者在项目根目录启动以下任意 CLI：

```bash
codex
```

```bash
claude
```

```bash
pi
```

```bash
opencode
```

CLI 中的主会话默认作为 **Coordinator（总控 Agent）**。

Coordinator 不直接承担全部代码实现，而是通过项目内编排能力创建和管理 Worker、Investigator、Reviewer 和 Fixer。

## 1.2 多 Agent 工作模式

目标运行结构：

```text
你
│
▼
Coordinator（总控 Agent）
│
├── Worker A：实现功能 A
├── Worker B：实现功能 B
├── Investigator：调查需求、代码路径或问题根因
└── Reviewer：独立审查
        │
        ├── PASS → Coordinator → Integration
        └── FAIL → 创建新的 Fixer/Worker 修复
```

核心约束：

- Coordinator 拥有项目全局视角。
- Worker 只处理一张 Feature Card。
- Reviewer 必须是新的独立会话。
- Reviewer 必须只读。
- Reviewer 不能接收 Worker 的完整对话记录。
- Reviewer 返回 FAIL 后，必须创建新的 Fixer 会话。
- 禁止让原 Worker 自我审查、自我批准。
- 禁止用原 Worker 的旧会话直接继续修复。
- 最终完成状态必须由程序化门禁和 Reviewer 共同决定。

## 1.3 只使用项目内配置

本方案禁止依赖以下全局 AI Agent 平台目录：

```text
~/.ai-agent-platform/
```

项目必须可以通过复制自身的配置目录迁移到新项目。

允许依赖的外部程序仅包括：

- Git。
- Node.js、Python 或项目选择的运行时。
- Codex、Claude Code、Pi、OpenCode 等 CLI 本体。
- 项目自己的编译器、SDK、工具链和测试环境。

账号登录信息、API Key、Token、私钥和本机硬件信息禁止提交到 Git。

---

# 2. 总体架构

```text
┌───────────────────────────────────────────────┐
│          Codex / Claude / Pi 主终端           │
│                                               │
│  Coordinator                                 │
│  - 与用户交互                                 │
│  - 理解需求                                   │
│  - 维护全局上下文                             │
│  - 创建 Feature Graph                         │
│  - 创建 Feature Card                          │
│  - 查看 Build Board                           │
└──────────────────────┬────────────────────────┘
                       │ 项目内 MCP / CLI API
                       ▼
┌───────────────────────────────────────────────┐
│             .ai-agent/platform               │
│                                               │
│  Harness Runtime                             │
│  Graph Engine                                │
│  Loop Engine                                 │
│  Scheduler                                   │
│  Context Packer                              │
│  Worktree Manager                            │
│  Policy Engine                               │
│  Gate Runner                                 │
│  Event Store                                 │
└─────────────┬──────────────────┬──────────────┘
              │                  │
       ┌──────▼──────┐    ┌──────▼──────┐
       │ Worker A    │    │ Worker B    │
       │ 新进程       │    │ 新进程       │
       │ 新会话       │    │ 新会话       │
       │ 独立 Worktree│    │ 独立 Worktree│
       └──────┬──────┘    └──────┬──────┘
              └──────────┬───────┘
                         ▼
                 Deterministic Gates
              Build / Test / Static Check
                         │
                         ▼
                ┌─────────────────┐
                │ Reviewer        │
                │ 新进程、新会话   │
                │ 只读             │
                └───────┬─────────┘
                        │
             ┌──────────┴──────────┐
             │                     │
           PASS                   FAIL
             │                     │
             ▼                     ▼
        Integration          Fresh Fixer
                                   │
                                   ▼
                              Gates + Review
```

架构的核心原则：

> 模型负责分析、判断和实施；程序负责流程、状态、隔离、权限、重试和完成条件。

---

# 3. 工程概念与实现位置

| 工程概念 | 项目内实现 |
|---|---|
| Harness Engineering | `.ai-agent/platform/engine/`、Worktree、进程、权限、上下文、日志 |
| Loop Engineering | `.ai-agent/platform/workflows/`、`loop-engine` |
| Graph Engineering | Feature Graph、依赖边、状态机、并行调度、资源锁 |
| Skill Engineering | `.ai-agent/platform/skills/`、`.ai-agent/project/skills/` |
| Context Engineering | `.ai-agent/project/context/`、Context Packer |
| Policy Engineering | `.ai-agent/project/policies/` |
| Reliability Engineering | 超时、重试次数、恢复、幂等、人工门禁 |
| Observability Engineering | Run ID、Session ID、事件、日志、Token、成本、测试报告 |
| Evaluation Engineering | 一次通过率、返工次数、Reviewer FAIL 原因、人工介入率 |

边界必须明确：

```text
AGENTS.md / CLAUDE.md
    负责告诉主 CLI 当前项目采用什么行为规范。

Skill
    负责描述某一类任务如何执行。

Graph
    负责描述任务之间如何依赖和流转。

Loop
    负责描述执行失败后如何继续。

Harness
    负责真正启动进程、约束权限、管理状态并执行门禁。
```

Graph 和 Loop 禁止只停留在提示词中，必须有可执行状态。

---

# 4. 项目目录结构

推荐目录：

```text
your-project/
├── AGENTS.md
├── CLAUDE.md
├── .mcp.json
├── .gitignore
│
├── .ai-agent/
│   ├── VERSION
│   ├── README.md
│   │
│   ├── platform/                       # 通用平台，迁移时原样复制
│   │   ├── dist/
│   │   │   ├── agentctl.mjs
│   │   │   └── agentd.mjs
│   │   │
│   │   ├── engine/
│   │   │   ├── graph-engine.mjs
│   │   │   ├── loop-engine.mjs
│   │   │   ├── scheduler.mjs
│   │   │   ├── worktree-manager.mjs
│   │   │   ├── context-packer.mjs
│   │   │   ├── policy-engine.mjs
│   │   │   ├── gate-runner.mjs
│   │   │   └── event-store.mjs
│   │   │
│   │   ├── adapters/
│   │   │   ├── codex-adapter.mjs
│   │   │   ├── claude-adapter.mjs
│   │   │   ├── pi-adapter.mjs
│   │   │   └── opencode-adapter.mjs
│   │   │
│   │   ├── roles/
│   │   │   ├── coordinator.md
│   │   │   ├── investigator.md
│   │   │   ├── worker.md
│   │   │   ├── reviewer.md
│   │   │   └── fixer.md
│   │   │
│   │   ├── workflows/
│   │   │   ├── feature-delivery.json
│   │   │   ├── bug-fix.json
│   │   │   └── requirement-analysis.json
│   │   │
│   │   ├── skills/
│   │   │   ├── feature-decomposition/
│   │   │   ├── implementation-worker/
│   │   │   ├── root-cause-analysis/
│   │   │   ├── independent-review/
│   │   │   └── integration-check/
│   │   │
│   │   ├── schemas/
│   │   │   ├── feature-card.schema.json
│   │   │   ├── worker-result.schema.json
│   │   │   ├── review-verdict.schema.json
│   │   │   └── run-state.schema.json
│   │   │
│   │   └── templates/
│   │
│   ├── project/                        # 项目相关，新项目主要修改这里
│   │   ├── project.json
│   │   ├── project.local.example.json
│   │   │
│   │   ├── context/
│   │   │   ├── architecture.md
│   │   │   ├── build-guide.md
│   │   │   ├── module-map.json
│   │   │   └── terminology.md
│   │   │
│   │   ├── policies/
│   │   │   ├── paths.json
│   │   │   ├── commands.json
│   │   │   ├── security.json
│   │   │   └── resources.json
│   │   │
│   │   ├── workflows/
│   │   │   └── feature-delivery.override.json
│   │   │
│   │   └── skills/
│   │       ├── project-build/
│   │       ├── project-test/
│   │       ├── freertos-module/
│   │       └── power-management/
│   │
│   └── state/                          # 运行时生成，禁止提交 Git
│       ├── runs/
│       ├── worktrees/
│       ├── locks/
│       ├── logs/
│       └── cache/
│
├── .codex/
│   ├── config.toml
│   ├── hooks.json
│   └── agents/
│       ├── investigator.toml
│       ├── worker.toml
│       ├── reviewer.toml
│       └── fixer.toml
│
├── .agents/
│   └── skills/                         # Codex Skill 适配输出
│
├── .claude/
│   ├── settings.json
│   ├── settings.local.json             # 本机可选，禁止提交
│   ├── agents/
│   │   ├── coordinator.md
│   │   ├── investigator.md
│   │   ├── worker.md
│   │   ├── reviewer.md
│   │   └── fixer.md
│   └── skills/                         # Claude Skill 适配输出
│
└── scripts/
    ├── agent-bootstrap.ps1
    ├── agent-bootstrap.sh
    ├── agent-sync.ps1
    └── agent-sync.sh
```

---

# 5. 可移植边界

## 5.1 通用平台

```text
.ai-agent/platform/
```

保存以下通用内容：

- Harness Runtime。
- Graph Engine。
- Loop Engine。
- Scheduler。
- Worktree Manager。
- Context Packer。
- Gate Runner。
- 各 CLI Adapter。
- 通用角色。
- 通用 Workflow。
- 通用 Skill。
- JSON Schema。

新项目迁移时，这个目录应整体复制，原则上不修改。

## 5.2 项目配置

```text
.ai-agent/project/
```

保存以下项目专属内容：

- 项目名称和类型。
- 构建、测试、静态检查命令。
- 源码目录和测试目录。
- 模块映射。
- 架构说明。
- 术语表。
- 路径权限。
- 硬件资源。
- 项目专属 Skill。
- 工作流覆盖项。

新项目主要修改这个目录。

## 5.3 CLI 适配目录

```text
.codex/
.agents/
.claude/
AGENTS.md
CLAUDE.md
.mcp.json
```

这些文件让 Codex、Claude 等工具识别项目平台。

建议将以下目录作为唯一内容源：

```text
.ai-agent/platform/roles/
.ai-agent/platform/skills/
.ai-agent/project/skills/
```

以下目录作为生成或同步后的适配输出：

```text
.codex/agents/
.agents/skills/
.claude/agents/
.claude/skills/
```

同步命令约定：

```bash
node .ai-agent/platform/dist/agentctl.mjs sync
```

Windows 环境应优先复制或生成文件，不依赖符号链接。

---

# 6. CLI Agent 执行契约

当 CLI Agent 收到“根据本文档搭建项目内 AI Agent 平台”的请求时，必须按照本节执行。

## 6.1 模式识别

### 模式 A：初始化

满足以下条件时进入初始化模式：

```text
.ai-agent/platform/ 不存在
```

CLI Agent 必须：

1. 检查项目语言、构建系统、测试系统和 Git 状态。
2. 创建本文档定义的目录结构。
3. 创建最小可运行平台。
4. 创建项目配置模板。
5. 创建 Codex 和 Claude 适配文件。
6. 创建 `.gitignore` 条目。
7. 运行配置检查。
8. 不修改业务代码。

### 模式 B：项目适配

满足以下条件时进入项目适配模式：

```text
.ai-agent/platform/ 已存在
.ai-agent/project/ 仍为模板或不完整
```

CLI Agent 必须：

1. 保留 `.ai-agent/platform/`。
2. 检查当前项目结构。
3. 推断构建、测试、源码和模块信息。
4. 修改 `.ai-agent/project/`。
5. 同步 CLI Adapter。
6. 运行 `doctor`。
7. 输出仍需用户提供的信息。

### 模式 C：升级

满足以下条件时进入升级模式：

```text
用户明确要求升级平台
```

CLI Agent 必须：

1. 读取 `.ai-agent/VERSION`。
2. 备份 `.ai-agent/project/`。
3. 只替换 `.ai-agent/platform/`。
4. 禁止覆盖项目配置。
5. 执行配置迁移。
6. 重新同步 Adapter。
7. 运行完整检查。

## 6.2 信息推断规则

CLI Agent 应先通过仓库内容推断：

- 构建系统。
- 编译命令。
- 测试命令。
- 源码目录。
- 测试目录。
- 模块划分。
- CI 命令。
- 编码规范。
- 静态分析工具。

只有无法从仓库推断的信息才询问用户，例如：

- 工具链安装路径。
- 目标板型号。
- J-Link 序列号。
- 串口号。
- 服务器地址。
- 硬件测试台名称。
- 私有 SDK 路径。
- 烧录方式。
- Secret。
- 禁止修改的安全目录。

禁止把 Secret、Token 或私钥写入已跟踪文件。

## 6.3 修改限制

CLI Agent 在搭建平台时：

- 必须先展示准备创建或修改的文件范围。
- 禁止修改业务代码。
- 禁止重写现有 CI，除非用户明确要求。
- 禁止删除已有 Agent 配置。
- 发现已有配置时，应合并而不是直接覆盖。
- 不确定是否能覆盖时，应保留原文件并生成迁移说明。

---

# 7. 角色设计

## 7.1 Coordinator

Coordinator 是唯一拥有完整项目视角的 Agent。

### 输入

- 用户需求。
- 项目愿景和架构。
- Build Board。
- Feature Graph。
- 所有 Feature Card 状态。
- Worker 结构化结果。
- Gate 报告。
- Reviewer 结论。
- 风险和阻塞项。

### 职责

Coordinator 必须：

1. 理解用户需求。
2. 识别歧义、风险和依赖。
3. 决定是否需要 Investigator。
4. 创建 Feature Graph。
5. 创建边界明确的 Feature Card。
6. 调度满足依赖的 Worker。
7. 查看结构化结果。
8. 请求确定性门禁。
9. 请求独立 Reviewer。
10. 根据 PASS/FAIL 推进状态。
11. 汇总结果给用户。

Coordinator 禁止：

- 默认直接修改生产代码。
- 把完整会话发送给 Worker。
- 让 Worker 自己批准结果。
- 仅根据 Worker 的文字声明判断完成。
- 绕过测试和 Reviewer。
- 在 Reviewer FAIL 后恢复原 Worker 会话。

## 7.2 Investigator

Investigator 是只读调查 Agent。

### 适用任务

- 需求追踪。
- 架构调查。
- 调用链调查。
- 问题根因分析。
- 接口影响分析。
- 历史实现比较。
- 测试覆盖调查。

### 输出

Investigator 必须输出：

- 结论。
- 证据。
- 文件路径。
- 符号或函数名称。
- 不确定项。
- 风险。
- 建议的任务边界。

Investigator 禁止：

- 修改文件。
- 直接实现修复。
- 创建子 Agent。
- 扩大调查范围。

## 7.3 Worker

Worker 只实现一张 Feature Card。

Worker 必须：

- 使用独立进程或会话。
- 使用独立 Git Worktree。
- 只接收最小上下文。
- 只修改 `allowed_paths`。
- 遵守 `forbidden_paths`。
- 执行 Feature Card 声明的测试。
- 返回符合 Schema 的 WorkerResult。
- 明确列出未解决问题和范围偏移。

Worker 禁止：

- 读取完整 Build Board。
- 读取 Coordinator 完整对话。
- 修改未授权目录。
- 自行扩大需求。
- 启动其他 Agent。
- 调用项目编排 API。
- 宣布自己已被批准。

## 7.4 Reviewer

Reviewer 是独立、只读的验收 Agent。

Reviewer 必须：

- 使用新进程。
- 使用新会话。
- 不复用 Worker 上下文。
- 不接收 Worker 完整对话。
- 读取 Feature Card、Diff、Gate 报告和相关源码。
- 对每一条验收标准返回结果。
- 最终返回 `PASS` 或 `FAIL`。
- 提供文件、位置、证据和必修项。

Reviewer 禁止：

- 修改代码。
- 实施修复。
- 与原 Worker 继续讨论。
- 用“总体不错”代替明确结论。
- 忽略失败的确定性门禁。

## 7.5 Fixer

Fixer 是 Reviewer FAIL 后创建的新 Worker。

Fixer 必须接收：

- 原 Feature Card。
- 失败提交或 Patch。
- 确定性测试报告。
- Reviewer Findings。
- 当前尝试次数。

Fixer 禁止接收：

- 原 Worker 的完整对话。
- Coordinator 的完整对话。
- 与修复无关的其他 Feature 上下文。

Fixer 必须使用新的会话。推荐使用新的修复分支或新的 Worktree。

---

# 8. Graph Engineering

## 8.1 Feature Graph

Feature Graph 是有向无环图，节点表示工作单元，边表示依赖关系。

示例：

```text
REQ-01 需求分析
   │
   ▼
ARCH-01 接口和架构冻结
   │
   ├─────────────┐
   ▼             ▼
CORE-01       HAL-01
核心状态机     硬件适配
   │             │
   └──────┬──────┘
          ▼
       TEST-01
          │
          ▼
       HIL-01
```

## 8.2 状态机

推荐状态：

```text
DRAFT
  ↓
READY
  ↓
RUNNING
  ↓
VERIFYING
  ↓
REVIEWING
  ├── PASS → PASSED → INTEGRATING → DONE
  └── FAIL → FIX_REQUIRED → FIXING
                           ↓
                       VERIFYING
                           ↓
                       REVIEWING
```

异常状态：

```text
BLOCKED
TIMEOUT
CONFLICT
POLICY_DENIED
HUMAN_GATE
MAX_ATTEMPTS_REACHED
CANCELLED
```

## 8.3 状态转移约束

| 当前状态 | 触发条件 | 下一状态 |
|---|---|---|
| DRAFT | Feature Card 校验通过 | READY |
| READY | 依赖完成且资源可用 | RUNNING |
| RUNNING | WorkerResult 有效 | VERIFYING |
| VERIFYING | 所有门禁通过 | REVIEWING |
| VERIFYING | 任一门禁失败 | FIX_REQUIRED |
| REVIEWING | Reviewer PASS | PASSED |
| REVIEWING | Reviewer FAIL | FIX_REQUIRED |
| FIX_REQUIRED | 未超过修复次数 | FIXING |
| FIX_REQUIRED | 超过修复次数 | HUMAN_GATE |
| FIXING | 新 Fixer 启动 | RUNNING |
| PASSED | 集成条件满足 | INTEGRATING |
| INTEGRATING | 集成门禁通过 | DONE |
| 任意运行状态 | 超时 | TIMEOUT |

## 8.4 并行条件

Feature 只有同时满足以下条件才可并行：

- 所有依赖节点已经完成。
- 公共接口已冻结。
- 文件所有权没有冲突。
- 不争用同一个互斥资源。
- 不依赖尚未验证的架构决策。
- 不修改同一个高冲突核心文件。

适合并行：

```text
Worker A：src/power/state_machine.c
Worker B：platform/pmic/pmic_driver.c
Worker C：tests/power/
```

不适合并行：

```text
Worker A：修改 power_manager.c
Worker B：修改 power_manager.c
Worker C：重新设计 power_manager.h 公共接口
```

---

# 9. Loop Engineering

标准交付闭环：

```text
用户需求
  ↓
需求分析
  ↓
调查与证据收集
  ↓
Feature Graph
  ↓
Feature Card
  ↓
Worker 实施
  ↓
确定性门禁
  ↓
独立 Reviewer
  ├── PASS → 集成门禁 → DONE
  └── FAIL → Fresh Fixer → 门禁 → Fresh Reviewer
```

Loop 必须具有以下限制：

```text
maxFixAttempts
workerTimeout
reviewerTimeout
maxParallelWorkers
humanApprovalRules
```

推荐默认值：

```json
{
  "maxFixAttempts": 2,
  "workerTimeoutSeconds": 1800,
  "reviewerTimeoutSeconds": 900,
  "maxParallelWorkers": 3
}
```

超过最大修复次数后，必须进入：

```text
HUMAN_GATE
```

禁止无限循环。

---

# 10. Context Engineering

## 10.1 Coordinator 上下文

Coordinator 可以接收：

- 用户需求。
- 产品目标。
- 架构文档。
- 模块映射。
- Build Board。
- Feature Graph。
- 所有节点状态。
- 结构化结果。
- 风险和阻塞项。

## 10.2 Worker 上下文

Worker 只接收：

- 一张 Feature Card。
- Base SHA。
- 允许修改目录。
- 禁止修改目录。
- 必要上下文文件。
- 接口约束。
- 验收标准。
- 必须执行的测试。
- 必须使用的 Skill。

Worker 默认不接收：

- Coordinator 完整聊天记录。
- 全部项目计划。
- 其他 Worker 对话。
- 无关需求。
- 无关目录的大量源码。
- Reviewer 历史对话。

## 10.3 Reviewer 上下文

Reviewer 接收：

- 原始 Feature Card。
- Base 到 Candidate 的精确 Diff。
- 确定性 Gate 报告。
- 相关源码。
- 架构和规范中与验收相关的部分。

Reviewer 不接收：

- Worker 完整聊天记录。
- Worker 私有草稿。
- Coordinator 对 Worker 的主观评价。
- 原 Worker 的自我总结作为唯一证据。

---

# 11. Feature Card 规范

示例：

```yaml
id: PM-001
title: 实现电源状态机核心逻辑

goal: >
  根据需求定义 OFF、STANDBY、ACTIVE 和 SUSPEND 状态，
  实现状态转换逻辑和非法转换保护。

base_sha: 7f83a4c

dependencies:
  - PM-REQ-ANALYSIS
  - PM-ARCH-01

allowed_paths:
  - src/power/**
  - include/power/**
  - tests/power/**

forbidden_paths:
  - bootloader/**
  - third_party/**
  - platform/security/**

context_files:
  - docs/requirements/power-management.md
  - docs/architecture/power-state-machine.md
  - include/platform/wakeup_source.h

non_goals:
  - 不实现具体 PMIC 驱动
  - 不修改 FreeRTOS Tick 配置
  - 不修改公共诊断协议

acceptance_criteria:
  - id: AC-01
    text: 所有合法状态转换均有明确处理
  - id: AC-02
    text: 非法状态转换返回 POWER_E_INVALID_TRANSITION
  - id: AC-03
    text: 状态切换期间不持有跨模块全局锁
  - id: AC-04
    text: 单元测试覆盖每一条状态边

required_tests:
  - cmake --build build --target power_tests
  - ./build/tests/power_tests

required_skills:
  - power-management
  - embedded-c-state-machine
  - unit-test-design

resources:
  - jlink-target-01

output_schema:
  path: .ai-agent/platform/schemas/worker-result.schema.json
```

一张 Feature Card 必须做到：

- 单一目标。
- 明确输入。
- 明确边界。
- 明确非目标。
- 明确允许修改的路径。
- 明确验收标准。
- 明确验证命令。
- 可以独立审查。
- 可以独立失败和重试。

---

# 12. WorkerResult 规范

示例：

```json
{
  "cardId": "PM-001",
  "attempt": 1,
  "status": "completed",
  "baseSha": "7f83a4c",
  "commitSha": "81a123d",
  "changedFiles": [
    "src/power/state_machine.c",
    "include/power/state_machine.h",
    "tests/power/test_state_machine.c"
  ],
  "acceptanceEvidence": [
    {
      "acceptanceId": "AC-01",
      "evidence": "tests/power/test_state_machine.c covers all declared valid transitions"
    }
  ],
  "tests": [
    {
      "command": "./build/tests/power_tests",
      "status": "passed",
      "exitCode": 0
    }
  ],
  "unresolvedIssues": [],
  "scopeDeviations": [],
  "notes": []
}
```

注意：

> Worker 声称测试通过，不代表 Gate 已通过。Harness 必须在独立流程中重新运行必要测试。

---

# 13. ReviewVerdict 规范

示例：

```json
{
  "cardId": "PM-001",
  "attempt": 1,
  "verdict": "FAIL",
  "acceptanceResults": [
    {
      "acceptanceId": "AC-01",
      "status": "PASS",
      "evidence": "All declared valid transitions are implemented."
    },
    {
      "acceptanceId": "AC-03",
      "status": "FAIL",
      "evidence": "src/power/state_machine.c:184 retains g_power_lock while calling HAL."
    }
  ],
  "blockingFindings": [
    {
      "id": "RV-001",
      "severity": "high",
      "file": "src/power/state_machine.c",
      "line": 184,
      "problem": "跨模块调用期间持有全局锁，可能产生锁反转。",
      "requiredFix": "在调用 power_hal_enter_state() 前释放锁，并增加状态版本复核。"
    }
  ],
  "nonBlockingFindings": [],
  "confidence": 0.93
}
```

Reviewer 的最终结论只能是：

```text
PASS
```

或：

```text
FAIL
```

不允许使用模糊结论：

```text
大体可以
基本通过
建议优化
看起来没问题
```

---

# 14. 项目主配置

文件：

```text
.ai-agent/project/project.json
```

示例：

```json
{
  "schemaVersion": 1,

  "project": {
    "name": "automotive-cluster",
    "type": "embedded",
    "rootMarker": ".git"
  },

  "backend": {
    "default": "inherit",
    "coordinator": "inherit",
    "investigator": "inherit",
    "worker": "inherit",
    "reviewer": "inherit",
    "fixer": "inherit"
  },

  "orchestration": {
    "defaultWorkflow": "feature-delivery",
    "maxParallelWorkers": 3,
    "maxFixAttempts": 2,
    "freshWorkerSession": true,
    "freshReviewerSession": true,
    "freshFixerSession": true,
    "isolation": "git-worktree",
    "workerTimeoutSeconds": 1800,
    "reviewerTimeoutSeconds": 900
  },

  "commands": {
    "configure": [
      "cmake -S . -B build"
    ],
    "build": [
      "cmake --build build -j"
    ],
    "unitTest": [
      "ctest --test-dir build --output-on-failure"
    ],
    "staticAnalysis": [
      "python tools/run_static_analysis.py"
    ],
    "formatCheck": [
      "python tools/check_format.py"
    ]
  },

  "gates": {
    "beforeReview": [
      "build",
      "unitTest",
      "staticAnalysis"
    ],
    "beforeMerge": [
      "build",
      "unitTest",
      "integrationReview"
    ]
  },

  "context": {
    "coordinator": [
      "docs/product-vision.md",
      "docs/architecture.md",
      ".ai-agent/project/context/module-map.json"
    ],
    "worker": {
      "mode": "feature-card-only",
      "allowScopedRepoDiscovery": true
    },
    "reviewer": {
      "include": [
        "featureCard",
        "gitDiff",
        "gateReport",
        "relevantSource"
      ],
      "exclude": [
        "workerTranscript",
        "coordinatorTranscript"
      ]
    }
  },

  "paths": {
    "source": [
      "src/**",
      "include/**"
    ],
    "tests": [
      "tests/**"
    ],
    "denyRead": [
      ".env",
      ".env.*",
      "secrets/**",
      "credentials/**",
      "private_keys/**"
    ]
  },

  "humanApproval": [
    "dependencyChange",
    "publicApiChange",
    "bootloaderChange",
    "firmwareSigning",
    "destructiveCommand"
  ],

  "resources": {
    "jlink-target-01": {
      "capacity": 1
    },
    "serial-port-com7": {
      "capacity": 1
    },
    "hardware-test-bench": {
      "capacity": 1
    }
  }
}
```

`inherit` 的含义：

```text
从 Codex 启动 Coordinator
→ 默认使用 Codex 启动子角色

从 Claude 启动 Coordinator
→ 默认使用 Claude 启动子角色
```

可选混合配置：

```json
{
  "backend": {
    "default": "inherit",
    "worker": "codex",
    "investigator": "claude",
    "reviewer": "claude",
    "fixer": "codex"
  }
}
```

第一版建议全部使用 `inherit`。

---

# 15. 工作流配置

文件：

```text
.ai-agent/platform/workflows/feature-delivery.json
```

示例：

```json
{
  "name": "feature-delivery",
  "version": 1,

  "nodes": {
    "analyze": {
      "type": "agent",
      "role": "coordinator",
      "globalContext": true
    },

    "investigate": {
      "type": "fanout",
      "role": "investigator",
      "readOnly": true,
      "freshSession": true,
      "parallel": true
    },

    "plan": {
      "type": "agent",
      "role": "coordinator",
      "produces": [
        "featureCards",
        "dependencyGraph"
      ]
    },

    "implement": {
      "type": "fanout",
      "role": "worker",
      "foreach": "readyFeatureCards",
      "freshSession": true,
      "isolation": "git-worktree"
    },

    "verify": {
      "type": "deterministicGate",
      "commandsFrom": "project.commands",
      "requires": [
        "build",
        "unitTest",
        "staticAnalysis"
      ]
    },

    "review": {
      "type": "agent",
      "role": "reviewer",
      "freshSession": true,
      "readOnly": true,
      "input": [
        "featureCard",
        "diff",
        "gateReport"
      ],
      "exclude": [
        "workerTranscript"
      ]
    },

    "decide": {
      "type": "switch",
      "expression": "review.verdict",
      "cases": {
        "PASS": "integrate",
        "FAIL": "fix"
      }
    },

    "fix": {
      "type": "agent",
      "role": "fixer",
      "freshSession": true,
      "newWorktree": true,
      "input": [
        "originalFeatureCard",
        "failedCommit",
        "reviewFindings",
        "gateReport"
      ],
      "next": "verify"
    },

    "integrate": {
      "type": "deterministic",
      "action": "mergeReviewedCommit"
    }
  },

  "limits": {
    "maxFixAttempts": 2,
    "onLimit": "HUMAN_GATE"
  }
}
```

---

# 16. 根目录 AGENTS.md

推荐内容：

```markdown
# Project AI Agent Contract

This repository contains a project-local AI Agent platform under `.ai-agent/`.

The main interactive session is the Coordinator unless
`AI_AGENT_ROLE` explicitly specifies another role.

## Required startup sequence

Before modifying production code:

1. Read `.ai-agent/project/project.json`.
2. Read relevant context under `.ai-agent/project/context/`.
3. Classify the request.
4. Create a Feature Graph.
5. Create bounded Feature Cards.
6. Dispatch implementation through the project-local platform.
7. Run deterministic gates.
8. Request an independent Reviewer.
9. Accept work only after all gates pass and Reviewer returns PASS.

## Coordinator rules

The Coordinator:

- owns the complete project context;
- owns the Feature Graph and Build Board;
- may create Feature Cards;
- may dispatch Workers, Investigators and Reviewers;
- must use the project-local orchestration server;
- must not directly implement production features by default;
- must not send the complete Coordinator transcript to Workers;
- must not mark a task complete based only on Worker self-report.

## Worker rules

A Worker:

- receives exactly one Feature Card;
- modifies only declared allowed paths;
- must not broaden task scope;
- must not spawn another agent;
- must not invoke orchestration tools;
- must run declared tests;
- must return a structured WorkerResult.

## Reviewer rules

A Reviewer:

- runs in a fresh context;
- is read-only;
- receives the Feature Card, diff, gate report and relevant source;
- must not receive the Worker transcript;
- returns exactly PASS or FAIL;
- must provide evidence for every failed acceptance criterion;
- must not modify code.

## Failure handling

When review returns FAIL:

- do not resume the authoring Worker;
- create a new Fix Attempt;
- start a fresh Fixer session;
- provide only the original Feature Card, failed commit,
  gate report and reviewer findings;
- run all gates again;
- start another fresh Reviewer.

## Completion condition

A Feature is complete only when:

- required tests pass;
- policy checks pass;
- Reviewer returns PASS;
- integration checks pass.
```

---

# 17. Claude 项目入口

根目录 `CLAUDE.md`：

```markdown
@AGENTS.md

## Claude Code adapter

- Use the project-local orchestration server.
- Treat `.ai-agent/project/project.json` as the project configuration.
- Do not replace the executable Feature Graph with an informal task list.
- Do not resume a failed implementation agent as the Fixer.
```

---

# 18. Codex 项目配置

`.codex/config.toml` 示例：

```toml
[mcp_servers.project_agent]
command = "node"
args = [
  ".ai-agent/platform/dist/agentd.mjs",
  "--project-root",
  "."
]
```

`.codex/agents/worker.toml` 示例：

```toml
name = "worker"
description = "Implements exactly one Feature Card in an isolated worktree."
sandbox_mode = "workspace-write"

developer_instructions = """
You are an implementation Worker.

You receive exactly one Feature Card.

Rules:
1. Modify only allowed_paths.
2. Do not expand task scope.
3. Do not modify forbidden_paths.
4. Run the tests declared by the Feature Card.
5. Return output conforming to worker-result.schema.json.
6. Do not spawn subagents.
7. Do not invoke project orchestration tools.
8. Do not act as Coordinator.
"""
```

`.codex/agents/reviewer.toml` 示例：

```toml
name = "reviewer"
description = "Independent read-only acceptance reviewer."
sandbox_mode = "read-only"

developer_instructions = """
You are an independent Reviewer.

Inputs:
- Feature Card
- acceptance criteria
- exact base-to-candidate diff
- deterministic gate report
- relevant source files

You must not receive or request the Worker transcript.

For each acceptance criterion:
- return PASS or FAIL;
- cite concrete evidence;
- identify blocking defects.

Do not edit files.
Do not fix defects.
Return output conforming to review-verdict.schema.json.
"""
```

---

# 19. Claude Agent 配置

`.mcp.json` 示例：

```json
{
  "mcpServers": {
    "project_agent": {
      "type": "stdio",
      "command": "node",
      "args": [
        ".ai-agent/platform/dist/agentd.mjs",
        "--project-root",
        "."
      ]
    }
  }
}
```

`.claude/agents/worker.md` 示例：

```markdown
---
name: worker
description: Implements one Feature Card in an isolated worktree.
model: inherit
tools: Read, Grep, Glob, Edit, Write, Bash
disallowedTools: Agent
permissionMode: acceptEdits
maxTurns: 64
isolation: worktree
skills:
  - implementation-worker
---

Implement exactly one Feature Card.

Do not act as Coordinator.
Do not spawn agents.
Do not call project orchestration tools.
Do not modify paths outside allowed_paths.
Do not broaden the feature.
Run declared tests.
Return a structured WorkerResult.
```

`.claude/agents/reviewer.md` 示例：

```markdown
---
name: reviewer
description: Independent read-only reviewer that returns PASS or FAIL.
model: inherit
tools: Read, Grep, Glob
disallowedTools: Write, Edit, Bash, Agent
permissionMode: plan
maxTurns: 32
skills:
  - independent-review
---

Review the candidate change independently.

You receive:
- the original Feature Card;
- the base-to-candidate diff;
- deterministic gate results;
- relevant source files.

You must not receive the Worker transcript.

Return:
- PASS or FAIL;
- one result for every acceptance criterion;
- blocking findings with file, location and evidence;
- required corrective actions.

Do not modify files.
```

---

# 20. 子 Agent 防递归

子 Agent 的 Worktree 中通常也包含 Agent 配置。若不限制，Worker 可能把自己当作 Coordinator，再次创建 Agent。

必须同时使用以下措施：

```text
AI_AGENT_CHILD=1
AI_AGENT_ROLE=worker|reviewer|investigator|fixer
AI_AGENT_NESTING_DEPTH=0
```

并执行以下策略：

- Worker 禁止调用 Agent 创建工具。
- Worker 禁止调用项目编排服务。
- Reviewer 禁止调用 Agent 创建工具。
- Reviewer 禁止调用项目编排服务。
- 子角色配置明确声明“不得作为 Coordinator”。
- Harness 对子进程注入专用环境变量。
- Harness 拒绝深度大于 0 的子 Agent 创建请求。

只有 Coordinator 有权调用项目编排 API。

---

# 21. Harness Runtime 最小接口

建议提供两个项目内入口：

```text
agentctl.mjs
    面向用户和脚本。

agentd.mjs
    面向 Codex、Claude 等 CLI 的 MCP/stdio 服务。
```

## 21.1 agentctl 目标命令

```bash
node .ai-agent/platform/dist/agentctl.mjs bootstrap
node .ai-agent/platform/dist/agentctl.mjs sync
node .ai-agent/platform/dist/agentctl.mjs doctor
node .ai-agent/platform/dist/agentctl.mjs run
node .ai-agent/platform/dist/agentctl.mjs status
node .ai-agent/platform/dist/agentctl.mjs resume
node .ai-agent/platform/dist/agentctl.mjs abort
node .ai-agent/platform/dist/agentctl.mjs migrate
```

职责：

```text
bootstrap
    初始化项目目录、模板和运行目录。

sync
    同步 Roles、Skills 和 CLI Adapter。

doctor
    检查 Git、Node、CLI、Schema、配置、路径和构建命令。

run
    创建并执行一个 Run。

status
    输出 Build Board 和节点状态。

resume
    从持久化状态恢复中断的 Run。

abort
    终止 Run 和相关子进程。

migrate
    迁移配置 Schema 和平台版本。
```

## 21.2 agentd 目标工具

```text
run_create
run_define_graph
run_dispatch_ready
run_await_events
run_request_review
run_apply_verdict
run_integrate
run_status
run_abort
```

Coordinator 应调用高层工具，而不是直接处理：

- Git Worktree 命令。
- Session ID。
- 子进程。
- JSON 校验。
- 重试次数。
- 状态转移。
- 资源锁。
- 日志存储。

---

# 22. 确定性门禁

完成判断禁止只依赖语言模型。

推荐门禁：

```text
配置校验
路径权限检查
禁止文件读取检查
Git Diff 范围检查
编译
单元测试
静态分析
格式检查
接口兼容检查
Secret 扫描
依赖变更检查
集成测试
硬件测试
```

完成条件：

```text
ACCEPT =
    WorkerResult.status == "completed"
    AND required_gates == PASS
    AND policy_checks == PASS
    AND Reviewer.verdict == "PASS"
    AND integration_gates == PASS
```

任何一项失败都不能标记 Feature 为 DONE。

---

# 23. 嵌入式项目扩展

嵌入式项目必须额外考虑硬件资源互斥。

资源示例：

```json
{
  "resources": {
    "jlink-target-01": {
      "capacity": 1
    },
    "serial-port-com7": {
      "capacity": 1
    },
    "hardware-test-bench": {
      "capacity": 1
    },
    "can-channel-0": {
      "capacity": 1
    }
  }
}
```

三个 Worker 可以并行修改不同模块，但不能同时：

- 烧录同一块板。
- 占用同一个 J-Link。
- 打开同一个串口。
- 控制同一个继电器台。
- 使用同一个 CAN 通道。
- 操作同一个 HIL 工位。

嵌入式推荐门禁：

- 交叉编译。
- Host 单元测试。
- 静态分析。
- MISRA 或项目规则。
- 栈使用检查。
- ROM/RAM 增量检查。
- 链接映射检查。
- 未定义符号检查。
- 中断上下文规则检查。
- FreeRTOS API 上下文检查。
- 烧录。
- 串口日志采集。
- HIL 测试。
- 看门狗和低功耗测试。

---

# 24. 示例：电源管理模块

用户输入：

```text
分析电源管理模块需求，给出设计方案，
实施代码框架，并补充测试。
```

Coordinator 创建 Feature Graph：

```text
PM-REQ-01   需求梳理与歧义识别
PM-ARCH-01  状态机与接口方案
PM-CORE-01  核心状态机
PM-HAL-01   PMIC/HAL 适配
PM-RTOS-01  FreeRTOS 同步与定时器
PM-TEST-01  单元测试
PM-HIL-01   板级验证
```

调查阶段：

```text
Investigator A：分析需求和状态转换
Investigator B：分析 HAL、PMIC 和唤醒源代码
Investigator C：分析 FreeRTOS 锁、定时器和中断上下文
```

接口冻结后并行实施：

```text
Worker A：核心状态机
Worker B：PMIC/HAL Adapter
Worker C：单元测试和 Mock
```

Reviewer 检查：

- 状态转换是否完整。
- 非法事件是否处理。
- 中断上下文是否调用阻塞 API。
- 锁是否跨模块持有。
- 休眠和唤醒是否存在竞态。
- 错误路径是否回滚。
- 超时是否溢出。
- 栈和静态内存是否合理。
- 验收标准是否全部覆盖。

Reviewer FAIL 示例：

```text
在持有 power_lock 时调用 PMIC SPI 接口，
存在高优先级任务等待和锁反转风险。
```

Harness 必须执行：

```text
PM-CORE-01 attempt 1 → FAIL
        ↓
创建 PM-CORE-01 attempt 2
        ↓
新 Worktree
        ↓
新 Fixer Session
        ↓
输入原 Feature Card + failed commit + gate report + RV-001
        ↓
重新编译和测试
        ↓
新 Reviewer Session
```

---

# 25. 运行状态和可观测性

每个 Run 保存：

```text
.ai-agent/state/runs/RUN-20260817-001/
├── run.json
├── graph.json
├── events.jsonl
├── board.json
│
├── cards/
│   ├── PM-CORE-01.yaml
│   └── PM-HAL-01.yaml
│
├── results/
│   ├── PM-CORE-01-attempt-1.json
│   └── PM-CORE-01-attempt-2.json
│
├── reviews/
│   ├── PM-CORE-01-review-1.json
│   └── PM-CORE-01-review-2.json
│
├── gates/
│   ├── PM-CORE-01-attempt-1.json
│   └── PM-CORE-01-attempt-2.json
│
├── logs/
├── diffs/
└── metrics.json
```

推荐记录：

- Run ID。
- Feature ID。
- Attempt。
- Agent Role。
- CLI Backend。
- Session ID。
- Worktree。
- Base SHA。
- Candidate SHA。
- 开始和结束时间。
- 退出码。
- Token 和成本。
- Gate 结果。
- Reviewer 结果。
- 人工介入。
- 失败原因。

评估指标：

- Feature 一次通过率。
- 平均 Fix 次数。
- Reviewer FAIL 原因分布。
- Worker 超时率。
- 合并冲突率。
- 每个完成 Feature 的 Token。
- 每个完成 Feature 的成本。
- 人工介入率。
- 缺陷逃逸率。

---

# 26. `.gitignore` 建议

```gitignore
# AI Agent runtime
.ai-agent/state/
.ai-agent/project/project.local.json

# Claude local settings
.claude/settings.local.json

# Environment and secrets
.env
.env.*
secrets/
credentials/
private_keys/

# Agent temporary output
*.agent.log
*.agent.tmp
```

`.ai-agent/platform/`、`.ai-agent/project/`、`.codex/`、`.agents/`、`.claude/agents/` 和 `.claude/skills/` 应提交 Git。

---

# 27. 新项目迁移

从模板项目复制：

```text
AGENTS.md
CLAUDE.md
.mcp.json
.ai-agent/
.codex/
.agents/
.claude/
scripts/
```

禁止复制：

```text
.ai-agent/state/
.ai-agent/project/project.local.json
.claude/settings.local.json
.env
Secret
Token
私钥
旧 Run
旧 Worktree
旧日志
旧 Feature Card
```

复制后执行：

```bash
node .ai-agent/platform/dist/agentctl.mjs bootstrap
node .ai-agent/platform/dist/agentctl.mjs sync
node .ai-agent/platform/dist/agentctl.mjs doctor
```

然后修改：

```text
.ai-agent/project/project.json
.ai-agent/project/context/
.ai-agent/project/policies/
.ai-agent/project/skills/
```

---

# 28. 新项目必须修改的内容

必须检查和修改：

- `project.name`。
- `project.type`。
- 构建命令。
- 测试命令。
- 静态分析命令。
- 源码目录。
- 测试目录。
- 模块映射。
- 架构说明。
- 禁止访问目录。
- 需要人工审批的变更。
- 硬件资源。
- 项目专属 Skill。

通常不修改：

- Coordinator 规则。
- Worker 规则。
- Reviewer 规则。
- Feature Card Schema。
- WorkerResult Schema。
- ReviewVerdict Schema。
- Graph Engine。
- Loop Engine。
- Worktree Manager。
- Codex Adapter。
- Claude Adapter。

---

# 29. 平台升级

版本文件：

```text
.ai-agent/VERSION
```

示例：

```text
agent-platform-version=0.1.0
config-schema-version=1
workflow-schema-version=1
```

升级步骤：

```text
1. 备份 .ai-agent/project/
2. 替换 .ai-agent/platform/
3. 保留 .ai-agent/project/
4. 运行 agentctl migrate
5. 运行 agentctl sync
6. 运行 agentctl doctor
7. 执行一次 dry-run
```

禁止在升级时覆盖项目配置。

---

# 30. 推荐落地阶段

## 阶段 1：规则和配置

实现：

- `AGENTS.md`。
- `CLAUDE.md`。
- `.ai-agent/project/project.json`。
- Feature Card Schema。
- WorkerResult Schema。
- ReviewVerdict Schema。
- Codex/Claude 角色。
- 通用 Skills。

目标：即使没有完整 Runtime，也能让 CLI 按统一规则运行。

## 阶段 2：Harness MVP

实现：

- Run 状态。
- Feature Graph。
- Feature Card。
- Git Worktree。
- Codex Adapter。
- Claude Adapter。
- Worker 启动。
- Reviewer 启动。
- PASS/FAIL。
- Fresh Fixer。
- 最大修复次数。

## 阶段 3：确定性门禁

加入：

- 编译。
- 单元测试。
- 静态检查。
- 路径范围检查。
- Secret 检查。
- 公共接口变化检查。
- Diff 大小检查。

## 阶段 4：嵌入式扩展

加入：

- 工具链矩阵。
- 目标板资源锁。
- 串口资源锁。
- 烧录。
- HIL。
- 栈和内存报告。
- MISRA。
- 日志采集。

## 阶段 5：多 CLI 适配

加入：

- Pi Adapter。
- OpenCode Adapter。
- OMP Adapter。
- 统一 Dashboard。
- 成本统计。
- Evals。
- 跨项目模板升级。

---

# 31. 反模式

禁止采用以下做法作为最终平台：

## 31.1 一个超长提示词完成所有工作

问题：

- 无确定性状态。
- 无独立 Reviewer。
- 无失败恢复。
- 无隔离。
- 无资源锁。

## 31.2 Coordinator 直接承担全部编码

问题：

- 全局上下文被实现细节污染。
- 难以并行。
- 难以独立审查。
- 容易自我确认。

## 31.3 Worker 自己审查自己

问题：

- 缺少独立性。
- 容易忽略自己的假设。
- Reviewer PASS 失去意义。

## 31.4 Reviewer FAIL 后继续原 Worker 会话

问题：

- 不符合 Fresh Fixer 原则。
- 原有错误思路和上下文持续污染。
- 无法验证新 Agent 是否能根据事实独立修复。

## 31.5 所有 Agent 共享完整上下文

问题：

- Token 浪费。
- 上下文污染。
- 任务边界不清。
- 信息泄露范围扩大。

## 31.6 只依赖 Agent 声称“测试通过”

问题：

- 测试可能未执行。
- 输出可能被误读。
- 环境可能不同。
- 无程序化证据。

---

# 32. 用户操作示例

启动 Codex：

```bash
codex
```

输入：

```text
按照项目内的 feature-delivery 工作流处理以下需求：

分析电源管理模块需求，生成设计方案，
实施代码框架并完成独立审查。

先建立 Feature Graph，不要直接修改业务代码。
```

启动 Claude：

```bash
claude
```

输入相同需求。

预期状态输出：

```text
[RUN] RUN-20260817-001 created
[PLAN] 6 Feature Cards generated
[READY] PM-CORE-01, PM-HAL-01, PM-TEST-01
[WORKER] PM-CORE-01 started
[WORKER] PM-HAL-01 started
[GATE] PM-CORE-01 build PASS
[GATE] PM-CORE-01 unitTest PASS
[REVIEW] PM-CORE-01 FAIL: RV-001
[FIXER] PM-CORE-01 attempt=2 started with fresh session
[GATE] PM-CORE-01 attempt=2 PASS
[REVIEW] PM-CORE-01 attempt=2 PASS
[MERGE] PM-CORE-01 integrated
```

---

# 33. Definition of Done

平台初始化完成必须满足：

- [ ] 所有配置都在项目中。
- [ ] 不依赖全局 Agent 平台目录。
- [ ] 新项目可以通过复制配置迁移。
- [ ] `AGENTS.md` 已存在。
- [ ] `CLAUDE.md` 已存在。
- [ ] 项目配置已填写。
- [ ] Codex Adapter 已生成。
- [ ] Claude Adapter 已生成。
- [ ] Worker 具有路径边界。
- [ ] Reviewer 为只读。
- [ ] Reviewer 使用新会话。
- [ ] FAIL 会创建新 Fixer。
- [ ] 最大修复次数已配置。
- [ ] Runtime State 不提交 Git。
- [ ] Secret 不进入项目配置。
- [ ] Build/Test Gate 可以实际运行。
- [ ] `doctor` 检查通过。
- [ ] 至少完成一次 dry-run。

Feature 完成必须满足：

- [ ] Feature Card Schema 校验通过。
- [ ] WorkerResult Schema 校验通过。
- [ ] 修改范围符合路径策略。
- [ ] 所有 required tests 通过。
- [ ] 所有 policy checks 通过。
- [ ] Reviewer 返回 PASS。
- [ ] Integration Gate 通过。
- [ ] Run 状态已持久化。
- [ ] 用户收到变更、证据、风险和未解决项汇总。

---

# 34. 最终设计结论

本项目采用以下模型：

```text
一个项目
=
业务代码
+
项目内 Agent Platform
+
Codex Adapter
+
Claude Adapter
+
项目配置
+
项目 Skills
+
项目运行状态
```

最终目录边界：

```text
.ai-agent/platform/
    通用、可移植、尽量不修改。

.ai-agent/project/
    项目相关，新项目需要适配。

.codex/ + .agents/
    Codex 适配。

.claude/ + CLAUDE.md + .mcp.json
    Claude 适配。

.ai-agent/state/
    临时运行状态，不提交 Git。
```

最终迁移流程：

```text
复制模板
→ 清理 Runtime State
→ 修改项目配置
→ 同步 Adapter
→ 执行 doctor
→ dry-run
→ 启动 Codex 或 Claude
```

最终原则：

> 项目本身就是完整的 AI Agent 工程化运行单元。

> Coordinator 掌握全局，Worker 最小上下文实施，Reviewer 独立审查，FAIL 交给新的 Fixer。

> 模型负责分析、判断和实施；Harness 负责状态、隔离、权限、重试、门禁和完成条件。
