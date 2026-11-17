# 新增 Skill 配置指南

本文说明后续如何在本框架中新增、迁移和维护 Skill，并保证它能够被 Graph Router、Loop、Verifier、Reviewer、Codex、Claude Code 和 Pi 正确使用。

本框架的唯一权威 Skill 源目录是：

```text
.agent/skills/
```

不要把同一份业务 Skill 分别复制到 `.codex/skills/`、`.claude/skills/` 和 `.pi/skills/` 后各自修改。平台目录只放“薄适配器”；真正的流程、reference 和配置入口统一保存在 `.agent/skills/<skill-id>/`。

---

## 1. 先判断应该改哪一层

新增内容前，先按下表判断。很多“新增 Skill”实际上只需要修改配置或规则。

| 需求变化 | 应修改的位置 | 是否需要新 Skill |
|---|---|---|
| 服务器、路径、芯片、进程、工具链、分支发生变化 | `.evospec/module.config.yaml` 或 Skill 自己的 `.evospec/skills/<skill-id>.config.yaml` | 否 |
| 项目新增强制规范、禁止项或门禁 | `.evospec/rules/` | 否 |
| 现有 Skill 的某个阶段步骤需要小幅调整，且所有项目都适用 | 现有 Skill 的 `references/*.md` | 通常否 |
| 新增一类可复用、职责独立的能力或工作流 | `.agent/skills/<new-skill>/` | 是 |
| 新任务具有新的宏观权限、节点、停止条件或失败路线 | `.agent/graphs/` + `.agent/router.yaml` | 通常需要新 Graph，可同时绑定新 Skill |
| 只是希望在 Claude/Pi 中增加一个方便的命令入口 | `.claude/skills/` 或 `.pi/skills/` 中增加薄适配器 | 否，不复制业务 Skill |
| 只是需要新的 Explorer、Verifier、Reviewer 等隔离角色 | `.codex/agents/`、`.claude/agents/` | 否，这是 Agent，不是 Skill |

推荐原则：

```text
项目差异 → 配置
项目约束 → Rules
局部执行方法 → Skill
宏观状态机 → Graph
局部反复验证 → Loop
角色隔离 → Agent
```

---

## 2. 两种新增方式

### 方式 A：新增独立 Skill（推荐）

适用于新的、可独立复用的能力，例如：

- 自动生成测试报告；
- 需求库同步；
- 静态分析结果归档；
- AUTOSAR 配置检查；
- CAN 信号一致性检查；
- 发布包制作与检查。

目录示例：

```text
.agent/skills/test-report-skill/
├── SKILL.md                 # 必需：入口、职责、路由和执行协议
├── README.md                # 推荐：给人看的说明
├── USAGE.md                 # 可选：初始化、迁移、完整用法
├── references/              # 推荐：较长或按阶段拆分的流程
│   ├── collect-results.md
│   └── generate-report.md
└── agents/                  # 可选：仅属于该 Skill 的 grader/judge
    └── grader.md
```

### 方式 B：给现有 `model-skill` 增加 route/reference（谨慎）

只有新阶段明确属于通用“需求 → 开发/修复 → 构建 → 部署 → Git”生命周期，并且所有使用 `model-skill` 的项目都需要它时才采用。

当前 `model-skill` 的 11 个 reference 被框架视为稳定集合。一般优先创建独立 Skill，而不是扩大这个集合。

若确实扩展 `model-skill`，必须同步修改：

1. `.agent/skills/model-skill/references/<new-route>.md`
2. `.agent/skills/model-skill/SKILL.md` 的意图路由表
3. `.agent/skills/model-skill/README.md` 和 `USAGE.md`
4. `.agent/skills/registry.yaml`
5. 必要时 `.agent/router.yaml`、`.agent/graphs/skill-workflow.graph.md` 和 `.agent/graph-decision-table.md`
6. `scripts/validate-evospec.py` 中的 `EXPECTED_REFERENCES`
7. `docs/MODEL_SKILL_ANALYSIS.md`

如果不更新第 6 项，框架校验会认为 reference 集合发生了非法变化。

---

## 3. Skill 命名规则

Skill ID 同时用于目录名、registry key 和 `SKILL.md` frontmatter 的 `name`。

推荐规则：

```text
全小写 kebab-case
```

示例：

```text
test-report-skill
requirement-library-sync
can-signal-audit
release-package-check
```

必须保持一致：

```text
.agent/skills/test-report-skill/
registry.yaml: skills.test-report-skill
SKILL.md: name: test-report-skill
```

不要使用：

- 空格、中文目录名或大小写混合；
- `codex-`、`claude-`、`pi-` 等平台前缀；
- `helper`、`misc`、`common` 等职责不清的名称；
- 与 Graph、Agent 或已有 Skill 同名但职责不同的名称。

---

## 4. 创建最小 Skill

### 4.1 `SKILL.md` 模板

```markdown
---
name: test-report-skill
description: 用户要求从已有测试结果生成项目测试报告时使用；不运行测试、不修改产品代码。
---

# Test Report Skill

## 职责

- 收集已存在的测试日志、结果文件和版本信息。
- 校验报告输入是否完整。
- 按项目配置生成测试报告。
- 不负责修改产品代码，也不把未运行的测试标记为通过。

## 输入

- 当前任务目标。
- 测试日志或结果目录。
- 当前代码版本/提交信息。
- `<config: report.output_dir>` 等项目配置。

## 输出

- 报告文件路径。
- 已覆盖和未覆盖测试项。
- 输入缺失项。
- 生成过程的验证证据。

## 路由

| 用户意图 | reference |
|---|---|
| 收集、归一化测试结果 | @references/collect-results.md |
| 生成测试报告 | @references/generate-report.md |

## 执行协议

1. 读取 registry 中本 Skill 的配置入口和规则索引。
2. 只读取当前 route 对应的 reference。
3. 执行 Skill preflight。
4. 按 Universal Loop 执行：Observe → Decide → Act → Verify → Update State → Route。
5. 不突破父 Graph 的编辑权限、重试预算和 Reviewer/Verifier 门禁。
```

`description` 要写清楚三件事：

1. 这个 Skill 做什么；
2. 什么时候应选它；
3. 不负责什么或关键边界是什么。

不要只写“用于测试”或“项目辅助 Skill”，否则 Router 很难可靠选择。

### 4.2 `references/*.md` 模板

```markdown
# Route: generate-report

## 目标

根据已验证的测试结果生成结构化报告。

## 前置条件

- 测试结果目录存在。
- 版本信息已确定。
- 输出目录可写。

## 输入

- `<config: report.input_paths>`
- `<config: report.output_dir>`
- 当前 run state 中的 verification evidence

## 执行步骤

1. 收集输入文件并记录来源。
2. 检查结果格式和重复项。
3. 区分 PASS、FAIL、SKIPPED、NOT_RUN。
4. 生成报告。
5. 校验报告可解析且包含版本、时间、范围和未验证项。

## 停止条件

- 报告生成成功且通过格式检查；或
- 输入不足，输出 `NEED_USER_DECISION` / `BLOCKED_ENVIRONMENT`。

## 禁止事项

- 不把缺失结果解释为 PASS。
- 不修改原始测试日志。
- 不覆盖父 Graph 的完成条件。
```

长流程放在 reference 中，`SKILL.md` 只保留适用边界、轻量路由和必要的通用约束；与当前 route 无关的内容不要预读。

---

## 5. 在 `registry.yaml` 注册

编辑：

```text
.agent/skills/registry.yaml
```

路径约定：

- `entry`、`usage`、`readme`、`grader`、`project_config`、`rules_index`、`references_root`：相对于项目根目录。
- `graph_bindings` 和 `auxiliary_routes` 中的 reference：相对于该 Skill 根目录，也就是 `entry` 所在目录。

完整示例：

```yaml
skills:
  model-skill:
    # 保留现有配置
    entry: .agent/skills/model-skill/SKILL.md
    # ...

  test-report-skill:
    entry: .agent/skills/test-report-skill/SKILL.md
    readme: .agent/skills/test-report-skill/README.md
    usage: .agent/skills/test-report-skill/USAGE.md
    grader: .agent/skills/test-report-skill/agents/grader.md
    project_config: .evospec/skills/test-report-skill.config.yaml
    rules_index: .evospec/rules/INDEX.md
    references_root: .agent/skills/test-report-skill/references

    graph_bindings:
      test-debug:
        - references/collect-results.md
      review:
        - references/generate-report.md

    auxiliary_routes:
      collect-test-results: references/collect-results.md
      generate-test-report: references/generate-report.md
```

字段说明：

| 字段 | 必需 | 说明 |
|---|---:|---|
| `entry` | 是 | Skill 的 `SKILL.md` 路径 |
| `readme` | 否 | 给人看的概览 |
| `usage` | 否 | 初始化、迁移和详细使用说明 |
| `grader` | 否 | 检查 Skill 分发和输出契约；不能代替代码 Reviewer |
| `project_config` | 否 | 本 Skill 的项目参数来源；无项目参数时可省略 |
| `rules_index` | 否 | 项目规则索引；通常复用 `.evospec/rules/INDEX.md` |
| `references_root` | 否 | reference 根目录，便于校验和加载 |
| `graph_bindings` | 否 | 当某个核心 Graph 运行到相关阶段时加载的 reference |
| `auxiliary_routes` | 否 | 没有独立核心 Graph、通过 `skill-workflow` 执行的 route |

### Graph binding 与 auxiliary route 的区别

```text
graph_bindings
```

表示 Skill 是某个核心 Graph 的阶段方法。例如 `development` Graph 在 IMPLEMENT 或 BUILD 阶段加载某个 reference。

```text
auxiliary_routes
```

表示该任务没有独立宏观 Graph，使用通用 `skill-workflow` Graph 执行。例如“生成测试报告”“查询项目资源”或“渲染部署命令”。

同一个阶段只选择一个主 Skill。确实需要多个 Skill 时，应在 Graph 中按顺序调用，避免一次把多个 Skill 全部加载进上下文。

---

## 6. 配置项目参数

### 6.1 复用模块公共配置

新 Skill 只需要模块名、代码路径、构建命令等公共信息时，可以直接使用：

```yaml
project_config: .evospec/module.config.yaml
```

不要复制相同的服务器、路径或构建命令到多个配置文件中。

### 6.2 使用独立 Skill 配置

Skill 有独立参数和 schema 时，推荐放在：

```text
.evospec/skills/<skill-id>.config.yaml
```

例如：

```yaml
schema_version: 1

report:
  input_paths:
    - build/test-results
  output_dir: .evospec/output/test-report
  formats:
    - markdown
    - json

verification:
  require_version: true
  require_timestamp: true
  allow_missing_tests: false

templating:
  unresolved_markers:
    - REQUIRED
    - PLACEHOLDER
    - TODO_CONFIG
```

规则：

- 项目真实值放配置，不写进 `SKILL.md` 或 reference。
- 密码、Token、私钥不得进入仓库配置。
- 未确定值使用明确 unresolved marker。
- 高风险能力增加 `enabled: false`，配置和授权完整后再开启。
- Skill preflight 必须只检查当前 route 真正需要的字段，不能因无关字段缺失阻塞只读工作。

`.evospec/skills/README.md` 中也保留了该目录的简要约定。

---

## 7. 添加或复用 Rules

项目级约束继续放在：

```text
.evospec/rules/
```

新规则文件示例：

```markdown
---
id: R009
status: enabled
name: test-report-no-fake-pass
applies-to: generate-test-report
---

# R009 · 测试报告不得伪造通过项

## 规则内容

缺少原始测试证据的用例必须标记为 NOT_RUN 或 UNKNOWN，不得标记为 PASS。

## 检查时机

生成测试报告前和报告校验阶段。

## 违规处理

停止报告发布，列出缺失证据。
```

然后同步更新：

```text
.evospec/rules/INDEX.md
```

`applies-to` 应与 registry 中的 route 名或 Skill 阶段名一致，便于渐进加载。

如果规则只属于某个 Skill，仍可以放在统一规则目录，但命名和 `applies-to` 必须清晰；除非确有独立规则生命周期，不建议再建第二套 rules 系统。

---

## 8. 接入 Graph Router

新增 Skill 后，根据任务复杂度选择以下三种接法。

### 8.1 绑定现有 Graph

适合沿用现有权限和完成条件的任务。

例如测试报告只作为 `test-debug` 的收尾阶段：

```yaml
graph_bindings:
  test-debug:
    - references/collect-results.md
    - references/generate-report.md
```

还应在对应 Graph 文档中写明调用位置和顺序，例如：

```text
TEST PASS → COLLECT_RESULTS → GENERATE_REPORT → REVIEW → DONE
```

### 8.2 添加 auxiliary route

适合独立但流程较短、可由通用 Skill Graph 控制的任务。

1. 在新 Skill 的 `auxiliary_routes` 中注册 route。
2. 在 `.agent/router.yaml` 的 `skill-workflow` 选择条件中加入该用户意图。
3. 在 `.agent/graph-decision-table.md` 增加一行。
4. 如有特殊权限，在 `.agent/graphs/skill-workflow.graph.md` 的权限边界中补充。

示例 Router 条件：

```yaml
- graph: skill-workflow
  file: .agent/graphs/skill-workflow.graph.md
  edit_mode: stage-defined
  choose_when:
    - 用户要求生成、更新或校验测试报告
```

### 8.3 新建独立 Graph

满足任一情况时不要只加 auxiliary route，应新建 Graph：

- 有独立的多阶段生命周期；
- 编辑权限与现有 Graph 不同；
- 有专用 Loop、重试预算或停止条件；
- 失败后需要特殊回退路径；
- 必须经过独立审批、硬件验证或人工决策。

需要同步：

1. `.agent/graphs/<graph-id>.graph.md`
2. `.agent/router.yaml`
3. `.agent/graph-decision-table.md`
4. `.agent/skills/registry.yaml` 的 `graph_bindings`
5. 必要的 `.agent/nodes/` 和 `.agent/loops/`
6. `.agent/project.yaml` 中的门禁或重试预算

---

## 9. 更新 Run State

运行阶段进入新 Skill 时，Coordinator 必须从 registry 写入：

```json
{
  "skill": {
    "selected_skill": "test-report-skill",
    "selected_skill_route": "generate-test-report",
    "entry": ".agent/skills/test-report-skill/SKILL.md",
    "references": [
      "references/generate-report.md"
    ],
    "project_config": ".evospec/skills/test-report-skill.config.yaml",
    "rules_index": ".evospec/rules/INDEX.md",
    "loaded_rules": [
      "R009"
    ],
    "unresolved_fields": [],
    "preflight_status": "EXECUTABLE"
  }
}
```

不要把 registry 中不存在的默认路径硬编码进 state。

一个任务按顺序调用多个 Skill 时，每次阶段切换都更新当前 `skill` 字段，并在最终报告中列出调用顺序、route 和证据。不要一次并行加载所有 Skill。

---

## 10. 平台适配

### 10.1 Codex

通常无需复制 Skill 到 `.codex/skills/`。Codex 通过 `AGENTS.md` 和 `.agent/skills/registry.yaml` 读取中央 Skill。

只有需要独立角色时才增加：

```text
.codex/agents/<role>.toml
```

例如新增专用测试报告 Verifier，而不是创建第二份 Skill。

### 10.2 Claude Code

需要 slash command 或自动发现入口时，可增加薄适配器：

```text
.claude/skills/test-report/SKILL.md
```

内容只负责转发，不复制业务规则：

```markdown
---
name: test-report
description: 用户明确要求按项目 Graph/Loop 流程生成已有测试结果的报告时调用中央 test-report-skill。
---

Follow `AGENTS.md`; read the selected Graph and Skill route only as needed.
Select `test-report-skill` and the matching route for `$ARGUMENTS`.
Execute the parent Graph and central Skill under `.agent/skills/test-report-skill/`.
Do not duplicate or override the central Skill instructions.
```

### 10.3 Pi

同样只增加薄适配器或 prompt template：

```text
.pi/skills/test-report/SKILL.md
.pi/prompts/test-report.md
```

核心流程仍引用 `.agent/skills/test-report-skill/`。

### 10.4 防止版本漂移

禁止：

```text
.agent/skills/test-report-skill/       一份
.claude/skills/test-report-skill/      再复制一份完整业务内容
.pi/skills/test-report-skill/          再复制一份完整业务内容
```

允许：

```text
.agent/skills/test-report-skill/       唯一业务实现
.claude/skills/test-report/            薄入口
.pi/skills/test-report/                薄入口
```

---

## 11. Grader、Verifier 与 Reviewer

新增 Skill 时要明确三者职责：

- **Skill Grader**：检查是否选对 route、是否读取正确配置/规则、输出格式是否符合 Skill 契约。
- **Verifier**：运行命令并保存 exit code、日志、产物或格式检查证据。
- **Reviewer**：判断结果是否满足用户任务、Graph 完成条件和风险要求。

Grader 不能代替 Verifier 或 Reviewer。

需要 grader 时，推荐输出：

```text
PASS
FAIL_ROUTE
FAIL_CONFIG
FAIL_RULE_LOADING
FAIL_OUTPUT_CONTRACT
NEED_USER_DECISION
```

代码是否正确仍由确定性验证和独立 Reviewer 决定。

---

## 12. 校验命令

新增 Skill 后运行：

```bash
python3 scripts/validate-skills.py
python3 scripts/validate-framework.py
```

如果修改了 `model-skill` 或 `.evospec/module.config.yaml`，再运行：

```bash
python3 scripts/validate-evospec.py
python3 scripts/validate-evospec.py --strict
```

`validate-skills.py` 检查：

- registry YAML 可解析；
- `default_skill` 存在；
- Skill ID、目录名和 frontmatter `name` 一致；
- `entry`、README、USAGE、grader、config、rules index 和 references 路径存在；
- Graph binding 指向已注册 Graph；
- auxiliary route 没有跨 Skill 重名；
- reference 路径存在；
- Skill 中没有残留 `.codex/skills/...` 等旧中央路径。

Skill 自己有独立配置 schema 时，建议增加：

```text
scripts/validate-<skill-id>.py
```

然后让 `scripts/validate-framework.py` 调用它，或在 CI 中显式运行。

---

## 13. 最小验收测试

### 13.1 静态加载测试

```text
请只做静态检查：读取 .agent/skills/registry.yaml，列出所有 Skill、entry、Graph bindings、auxiliary routes 和配置路径，不执行任何项目命令。
```

预期：新 Skill 能被找到，路径完整，无未声明 route。

### 13.2 自动路由测试

```text
请按项目 Graph Router 执行：生成当前版本的测试报告。先说明选择的 Graph、Skill 和 route，不执行高风险动作。
```

预期：选择预期 Graph 和新 Skill route。

### 13.3 显式选择测试

```text
请按 skill-workflow Graph 执行，并显式使用 test-report-skill 的 generate-test-report route。只做 preflight 和 dry-run。
```

### 13.4 权限边界测试

```text
请按 Review Graph 使用 test-report-skill 检查报告。禁止修改源码和原始测试结果。
```

预期：Skill 不会扩大 Review Graph 的只读权限。

### 13.5 未配置字段测试

把一个必需配置临时设为 `REQUIRED`，执行 preflight。

预期：输出 `DRY_RUN_ONLY`、`NEED_USER_DECISION` 或 `BLOCKED_ENVIRONMENT`，不得构造虚假命令。

---

## 14. 新增 Skill 检查清单

- [ ] Skill ID 使用 kebab-case。
- [ ] 目录、registry key 和 `SKILL.md` 的 `name` 完全一致。
- [ ] `description` 明确写出用途、触发场景和边界。
- [ ] 项目参数放入 `.evospec`，未硬编码在 Skill/reference。
- [ ] 长流程按 route 拆到 `references/`，没有一次加载全部 reference。
- [ ] 已在 `.agent/skills/registry.yaml` 注册。
- [ ] 已选择 Graph binding、auxiliary route 或新 Graph 三种接法之一。
- [ ] 新 auxiliary route 已更新 `.agent/router.yaml` 和 `.agent/graph-decision-table.md`。
- [ ] 新 Graph 已定义编辑权限、节点、Loop、停止条件和失败路线。
- [ ] 需要的 Rules 已加入 `.evospec/rules/` 并同步 `INDEX.md`。
- [ ] Run State 会记录 selected skill、route、reference、config、rules 和 preflight。
- [ ] Claude/Pi 只增加薄适配器，没有复制中央 Skill 内容。
- [ ] Grader、Verifier、Reviewer 的职责没有混淆。
- [ ] 已运行 `validate-skills.py` 和 `validate-framework.py`。
- [ ] 已完成静态加载、自动路由、显式选择、权限边界和未配置字段测试。
- [ ] README、CUSTOMIZE、USAGE 或相关项目文档已更新。

---

## 15. 常见错误

### 错误 1：只复制目录，不注册 registry

结果：Agent 找不到 Skill，或只能在用户显式给出文件路径时偶然使用。

修复：更新 `.agent/skills/registry.yaml`，并运行 `validate-skills.py`。

### 错误 2：把 Skill 当成 Graph

结果：Skill 自己决定能否改代码、何时停止、失败后如何重试，破坏整个框架的门禁。

修复：Skill 只描述阶段方法；权限、Loop、Reviewer 和停止条件仍由父 Graph 管理。

### 错误 3：把项目值写进 reference

结果：Skill 无法移植，服务器、路径和分支会污染其他项目。

修复：移到 `.evospec` 配置或项目 Rules。

### 错误 4：多个平台各维护一份 Skill

结果：Codex、Claude 和 Pi 的行为逐渐不一致。

修复：`.agent/skills/` 保持唯一实现，平台目录只做薄适配。

### 错误 5：新增 route 却不更新 Router

结果：显式调用可用，但自然语言任务无法自动选中。

修复：更新 `router.yaml`、decision table 和必要的 Graph 权限说明。

### 错误 6：Grader 给出 PASS 就认为代码正确

结果：流程格式正确，但实际 build/test 或需求覆盖可能失败。

修复：仍然运行 Verifier，并由 fresh Reviewer 给出最终 Verdict。

### 错误 7：扩展 model-skill 后忘记更新 validator

结果：`validate-evospec.py` 报 reference set mismatch。

修复：更新 `EXPECTED_REFERENCES`；或者恢复稳定集合，把新能力改成独立 Skill。

---

## 16. 推荐的新增顺序

```text
1. 明确 Skill 职责和边界
2. 创建 .agent/skills/<skill-id>/SKILL.md
3. 拆分必要 references
4. 配置 .evospec 参数和 rules
5. 注册 registry
6. 绑定现有 Graph / auxiliary route / 新 Graph
7. 更新 Router 和 decision table
8. 增加可选平台薄适配器
9. 增加 Skill 专用 validator（如需要）
10. 运行校验和路由测试
11. 更新文档并提交
```

按这个顺序，Skill 不会绕过 Graph + Loop，也不会把项目差异重新硬编码回通用流程。
