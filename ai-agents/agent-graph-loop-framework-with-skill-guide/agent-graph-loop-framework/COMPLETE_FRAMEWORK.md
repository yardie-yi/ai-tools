# Graph + Loop + Skill 多 Agent 工程框架：完整文件内容

本文件按路径汇总模板中的全部文本文件（不递归包含本文件自身）。当前版本已将 `model-skill` 迁入 `.agent/skills/model-skill/`，将 `.evospec/` 放在与 `.agent/` 同级目录，并新增后续 Skill 注册、Graph 接入和校验说明。

> 历史汇总快照，可能与当前文件不一致；执行规则以实际 `AGENTS.md`、Skill 和 Graph 文件为准，不要把本汇总当作指令源。

- 汇总文件数：136
- 当前中央 Skill：`model-skill`；后续 Skill 统一放入 `.agent/skills/<skill-id>/`
- 新增 Skill 指南：`docs/ADDING_SKILLS.md`
- 通用 Skill 校验：`scripts/validate-skills.py`
- 原有 model-skill reference：11 个，文件名、数量和内容保持不变
- 项目参数与规则：`.evospec/module.config.yaml`、`.evospec/skills/`、`.evospec/rules/`

## 目录树

````````text
.agent/
.agent/graphs/
.agent/loops/
.agent/nodes/
.agent/prompts/
.agent/runs/
.agent/skills/
.agent/skills/model-skill/
.agent/skills/model-skill/agents/
.agent/skills/model-skill/references/
.claude/
.claude/agents/
.claude/skills/
.claude/skills/graph-loop-runner/
.codex/
.codex/agents/
.evospec/
.evospec/bugLog/
.evospec/input/
.evospec/input/prd/
.evospec/output/
.evospec/output/bug-log/
.evospec/output/code-analysis/
.evospec/output/design/
.evospec/output/push-log/
.evospec/rules/
.evospec/scripts/
.evospec/skills/
.pi/
.pi/prompts/
.pi/skills/
.pi/skills/graph-loop-runner/
docs/
scripts/
.agent/graph-decision-table.md
.agent/graphs/bugfix.graph.md
.agent/graphs/compile-debug.graph.md
.agent/graphs/development.graph.md
.agent/graphs/docs.graph.md
.agent/graphs/qa.graph.md
.agent/graphs/refactor.graph.md
.agent/graphs/requirement.graph.md
.agent/graphs/review.graph.md
.agent/graphs/skill-workflow.graph.md
.agent/graphs/test-debug.graph.md
.agent/loops/bugfix-loop.md
.agent/loops/compile-debug-loop.md
.agent/loops/implementation-loop.md
.agent/loops/refresh-agent-loop.md
.agent/loops/requirement-analysis-loop.md
.agent/loops/review-loop.md
.agent/loops/test-debug-loop.md
.agent/loops/universal-loop.md
.agent/nodes/compile.md
.agent/nodes/context.md
.agent/nodes/execute-skill-route.md
.agent/nodes/impact-analysis.md
.agent/nodes/implement.md
.agent/nodes/load-skill-context.md
.agent/nodes/plan.md
.agent/nodes/report.md
.agent/nodes/reproduce-trace.md
.agent/nodes/requirement-analysis.md
.agent/nodes/review.md
.agent/nodes/root-cause.md
.agent/nodes/route-failure.md
.agent/nodes/skill-preflight.md
.agent/nodes/test.md
.agent/nodes/verify.md
.agent/project.yaml
.agent/prompts/fresh-agent-handoff.md
.agent/prompts/run-bugfix.md
.agent/prompts/run-compile-debug.md
.agent/prompts/run-development.md
.agent/prompts/run-requirement-analysis.md
.agent/prompts/run-review.md
.agent/prompts/run-skill-workflow.md
.agent/protocol.md
.agent/refresh-policy.yaml
.agent/router.yaml
.agent/run-state.schema.json
.agent/runs/.gitkeep
.agent/skills/README.md
.agent/skills/model-skill/README.md
.agent/skills/model-skill/SKILL.md
.agent/skills/model-skill/USAGE.md
.agent/skills/model-skill/agents/grader.md
.agent/skills/model-skill/change_log.md
.agent/skills/model-skill/references/debug-commands.md
.agent/skills/model-skill/references/env-setup.md
.agent/skills/model-skill/references/project-info.md
.agent/skills/model-skill/references/us-board-deploy.md
.agent/skills/model-skill/references/us-bug-fix.md
.agent/skills/model-skill/references/us-build.md
.agent/skills/model-skill/references/us-code-analysis.md
.agent/skills/model-skill/references/us-feature-dev.md
.agent/skills/model-skill/references/us-git-submit.md
.agent/skills/model-skill/references/us-requirements.md
.agent/skills/model-skill/references/us-rules.md
.agent/skills/registry.yaml
.agent/state-template.json
.agent/verdict-schema.yaml
.claude/agents/coordinator.md
.claude/agents/debugger.md
.claude/agents/explorer.md
.claude/agents/implementer.md
.claude/agents/reviewer.md
.claude/agents/second-reviewer.md
.claude/agents/verifier.md
.claude/settings.json
.claude/settings.stop-gate.example.json
.claude/skills/graph-loop-runner/SKILL.md
.codex/agents/coordinator.toml
.codex/agents/debugger.toml
.codex/agents/explorer.toml
.codex/agents/implementer.toml
.codex/agents/reviewer.toml
.codex/agents/second-reviewer.toml
.codex/agents/verifier.toml
.codex/config.toml
.evospec/input/prd/.gitkeep
.evospec/module.config.yaml
.evospec/output/bug-log/.gitkeep
.evospec/output/code-analysis/.gitkeep
.evospec/output/design/.gitkeep
.evospec/output/push-log/.gitkeep
.evospec/rules/INDEX.md
.evospec/rules/R001-commit-format.md
.evospec/rules/R002-log-required.md
.evospec/rules/R003-plugin-base.md
.evospec/rules/R004-build-before-deploy.md
.evospec/rules/R005-no-build-artifacts.md
.evospec/rules/R006-log-in-generated-code.md
.evospec/rules/R007-chinese-comments.md
.evospec/rules/R008-no-redundant-ui-call.md
.evospec/scripts/deploy_from_config.py
.evospec/scripts/push_to_board.bat
.evospec/skills/README.md
.gitignore
.pi/prompts/fresh-agent-handoff.md
.pi/prompts/graph-bugfix.md
.pi/prompts/graph-compile-debug.md
.pi/prompts/graph-development.md
.pi/prompts/graph-requirement.md
.pi/prompts/graph-review.md
.pi/prompts/graph-skill-workflow.md
.pi/settings.json
.pi/skills/graph-loop-runner/SKILL.md
AGENTS.md
CLAUDE.md
README.md
docs/ADDING_SKILLS.md
docs/ARCHITECTURE.md
docs/CUSTOMIZE.md
docs/EXAMPLES.md
docs/MODEL_SKILL_ANALYSIS.md
docs/SOURCES.md
docs/USAGE.md
scripts/build.sh
scripts/check-run-state.py
scripts/install-to-project.ps1
scripts/install-to-project.sh
scripts/lint.sh
scripts/new-run.py
scripts/project-commands.sh
scripts/test.sh
scripts/validate-evospec.py
scripts/validate-framework.py
scripts/validate-skills.py
scripts/verify.sh
````````

## 文件内容

### `.agent/graph-decision-table.md`

````````markdown
# Graph 选择表

| 主要目标 | 典型输入 | Graph | Skill binding/route | 默认编辑权限 | 完成证据 |
|---|---|---|---|---|---|
| 解释或查找 | 函数、模块、文档问题 | `qa` | `project-info`（需要项目配置导航时） | 只读 | 文件和符号证据 |
| 需求/影响分析 | 需求文档、变更项 | `requirement` | `us-requirements.md` | 只读 | 覆盖矩阵、影响范围、方案 |
| 新功能/模块实现 | 需求 + 实现目标 | `development` | `us-feature-dev.md` + `us-build.md` | 可写 | Build + Test + Review |
| 运行时 Bug | 日志、问题单、错误行为 | `bugfix` | `us-bug-fix.md` + `debug-commands.md` + `us-build.md` | 可写 | 复现/追踪 + 根因 + 回归验证 |
| 编译/链接失败 | build log、undefined reference | `compile-debug` | `us-build.md` + `env-setup.md` | 受控可写 | Build PASS |
| 测试/CI 失败 | test log、失败用例 | `test-debug` | 无专用 reference，使用核心 Loop | 受控可写 | 目标测试 + 必要回归 PASS |
| 代码/PR 审查 | diff、PR、模块风险 | `review` | 无，使用独立 Reviewer | 只读 | 结构化 Verdict |
| 行为保持重构 | baseline + cleanup/refactor | `refactor` | 可参考 `us-feature-dev.md` 的规则检查 | 可写 | Baseline + Build/Test + Review |
| 文档/注释 | README、设计、接口文档 | `docs` | `us-code-analysis.md`（代码分析文档时） | docs-only | 与源码/脚本一致 |
| 普通构建 | 无失败证据的 build 请求 | `skill-workflow` | route `build` | 执行构建 | exit code + artifact |
| 推板/部署 | ADB/SSH、目标板、产物传输 | `skill-workflow` | route `board-deploy` | 默认 dry-run | 授权 + preflight + deploy + 验证 |
| Git 提交/push | commit、push、提交记录 | `skill-workflow` | route `git-submit` | 默认检查；写操作需授权 | status/diff + commit/push evidence |
| 调试/日志/进程查询 | logcat、串口、进程、配置 | `skill-workflow` | route `debug-commands` | 只读/非破坏性执行 | 命令与原始证据 |
| 环境检查 | 工具链、服务器、凭据来源 | `skill-workflow` | route `env-setup` | 只读/preflight | 可用性与缺失项 |
| 代码架构分析 | 调用链、数据流、状态机 | `skill-workflow` | route `code-analysis` | 只读或分析文档可写 | 文件/符号/版本证据 |
| 规则管理 | 查看、启用、禁用规则 | `skill-workflow` | route `rules` | 规则文件受控写入 | 索引与 frontmatter 一致 |

## 冲突处理

1. 用户显式指定 Graph 时优先，但不能突破安全边界。
2. 用户只指定 `model-skill` 时，仍按最终目标选择 Graph；Skill 不是 Graph 的替代品。
3. 存在构建失败证据时用 `compile-debug`，不是普通 `build` route。
4. 部署、push、远端删除和停止进程必须经过用户授权；配置不完整时只做静态检查或 dry-run。
5. 一个任务可由父 Graph 调用 Skill reference，不必因为进入构建阶段切换整个父 Graph。
````````

### `.agent/graphs/bugfix.graph.md`

````````markdown
# Bugfix Graph

**用途**：问题单、运行时异常、错误行为、日志故障。

```text
START
  → CONTEXT
  → REPRODUCE_OR_TRACE
  → ROOT_CAUSE [Bugfix Loop]
  → ROOT_CAUSE_CHECK
      ├─ evidence sufficient → FIX_PLAN
      └─ weak/repeated hypothesis → FRESH_DEBUGGER
  → IMPLEMENT_FIX
  → COMPILE [Compile Debug Loop]
  → TARGET_TEST [Test Debug Loop]
  → REGRESSION_VERIFY
  → REVIEW
      ├─ PASS → DONE
      ├─ FAIL_LOCAL → IMPLEMENT_FIX
      ├─ FAIL_STRUCTURAL → ROOT_CAUSE + FRESH_DEBUGGER
      └─ NEED_USER_DECISION → USER
```

完成条件：

- 说明复现方式或静态追踪证据。
- 区分 symptom 与 root cause。
- 最小修复，且验证目标行为和回归风险。
- Reviewer 检查“测试是否只是适配错误实现”。

## Skill 绑定

- Entry：`.agent/skills/model-skill/SKILL.md`
- 主 Reference：`.agent/skills/model-skill/references/us-bug-fix.md`
- 调试 Reference：`.agent/skills/model-skill/references/debug-commands.md`
- 构建 Reference：`.agent/skills/model-skill/references/us-build.md`
- 配置：`.evospec/module.config.yaml` 的 `paths`、`architecture`、`debug`、`development`、`build`
- 规则：bug-fix 阶段启用规则。生成 Bug 记录不代表修复正确，仍需确定性回归和 Reviewer。
````````

### `.agent/graphs/compile-debug.graph.md`

````````markdown
# Compile Debug Graph

**用途**：编译、链接、CMake/Make、include、宏、类型和符号错误。

```text
START
  → READ_BUILD_LOG
  → CLASSIFY_ERROR
  → SEARCH_SYMBOLS_AND_CONFIG
  → ROOT_CAUSE
  → FIX_MINIMAL
  → BUILD
      ├─ PASS → CHANGE_REVIEW_IF_NEEDED → DONE
      ├─ FAIL/new_error → NEXT_ITERATION
      ├─ FAIL/same_error_twice → FRESH_DEBUGGER
      └─ RETRY_EXHAUSTED → BLOCKED_OR_FRESH_DEBUGGER
```

使用 `.agent/loops/compile-debug-loop.md`。

错误分类至少包括：

- include/path
- macro/config
- syntax/type
- undefined/duplicate symbol
- link order/library
- generated code
- build target/source list
- toolchain/environment

禁止：注释调用、删除功能或放宽告警策略来伪造构建通过，除非任务明确要求且有证据。

## Skill 绑定

- 构建流程：`.agent/skills/model-skill/references/us-build.md`
- 环境检查：`.agent/skills/model-skill/references/env-setup.md`
- 项目命令和工具链来自 `.evospec/module.config.yaml`；配置缺失时不得猜测远程服务器、shell 或 clean 命令。
````````

### `.agent/graphs/development.graph.md`

````````markdown
# Development Graph

**用途**：新增功能、实现模块、按需求生成代码框架。

```text
START
  → CONTEXT
  → REQUIREMENT_ANALYSIS
  → IMPACT_ANALYSIS
  → PLAN
  → OPTIONAL_PLAN_REVIEW
  → IMPLEMENT [Implementation Loop]
  → COMPILE [Compile Debug Loop]
      ├─ PASS → TEST
      └─ EXHAUSTED → REFRESH_DEBUGGER / BLOCKED
  → TEST [Test Debug Loop]
      ├─ PASS → VERIFY
      └─ EXHAUSTED → REFRESH_DEBUGGER / BLOCKED
  → VERIFY
  → REVIEW [Review Loop]
      ├─ PASS → DONE
      ├─ PASS_WITH_RISK → RISK_DECISION
      ├─ FAIL_LOCAL → IMPLEMENT
      ├─ FAIL_STRUCTURAL → PLAN + FRESH_IMPLEMENTER
      └─ NEED_USER_DECISION → USER
```

角色：

- Coordinator：主线程。
- Explorer：上下文和影响搜索。
- Implementer：按计划实施。
- Verifier：运行 `scripts/verify.sh` 或等价命令。
- Reviewer：fresh、只读。

强制门禁：

- 非平凡代码变更必须 build。
- 行为变更必须运行相关测试。
- Reviewer 不能由 Implementer 自己充当。
- 不能因环境缺失直接输出完整 `PASS`。

## Skill 绑定

- Entry：`.agent/skills/model-skill/SKILL.md`
- 主 Reference：`.agent/skills/model-skill/references/us-feature-dev.md`
- 构建 Reference：`.agent/skills/model-skill/references/us-build.md`
- 配置：`.evospec/module.config.yaml` 的 `architecture`、`development`、`build`、`artifacts`、`paths`
- 规则：feature-dev 阶段启用规则。Skill 的“进入构建”不能跳过本 Graph 的 Test、Verifier 和 Reviewer。
````````

### `.agent/graphs/docs.graph.md`

````````markdown
# Documentation Graph

**用途**：README、设计文档、接口文档和注释。

```text
START → CONTEXT → DOC_PLAN → WRITE_DOCS → CONSISTENCY_VERIFY → OPTIONAL_REVIEW → DONE
```

默认只修改文档和注释。文档中的接口、命令、路径和行为必须从源码、脚本或 CI 证据确认，不能凭记忆编写。

## Skill 绑定

生成代码架构分析文档时使用 `.agent/skills/model-skill/references/us-code-analysis.md`，输出目录来自 `.evospec/module.config.yaml` 的 `paths.code_analysis_output`。普通 README/接口文档按本 Graph 执行即可。
````````

### `.agent/graphs/qa.graph.md`

````````markdown
# Q&A Graph

**用途**：解释、定位、比较、总结；默认只读。

```text
START → CONTEXT → ANSWER → DONE
```

- `CONTEXT`：使用 `.agent/nodes/context.md`；必要时调用 Explorer。
- `ANSWER`：基于实际文件和符号回答，不猜测不存在的实现。
- `DONE`：无需 build/test；但若声称行为正确，必须说明证据范围。

停止条件：用户问题得到直接回答，且不遗漏关键不确定性。

## Skill 绑定

当问题涉及模块身份、文档目录、构建/部署/调试配置导航时，可加载 `.agent/skills/model-skill/references/project-info.md`；普通代码解释无需加载 Skill。
````````

### `.agent/graphs/refactor.graph.md`

````````markdown
# Refactor Graph

**用途**：明确要求行为保持不变的去重、拆分和结构调整。

```text
START
  → CONTEXT
  → BASELINE_VERIFY
      ├─ PASS → REFACTOR_PLAN
      └─ UNAVAILABLE → RISK_DECISION
  → IMPLEMENT_SMALL_STEP [Implementation Loop]
  → BUILD_AND_TEST
      ├─ PASS + more steps → IMPLEMENT_SMALL_STEP
      ├─ PASS + done → REVIEW
      └─ FAIL → REVERT_OR_DEBUG
  → REVIEW
  → DONE
```

每次迭代必须是可回滚的小步。无法建立 baseline 时，不得宣称行为完全保持不变。

## Skill 绑定

可复用 `.agent/skills/model-skill/references/us-feature-dev.md` 中的最小改动、规则检查和构建要求，但不得把重构误判为新功能，也不得跳过 baseline。
````````

### `.agent/graphs/requirement.graph.md`

````````markdown
# Requirement Analysis Graph

**用途**：需求解析、需求变更影响、设计输入和实现方案；默认只读。

```text
START
  → CONTEXT
  → REQUIREMENT_ANALYSIS [Requirement Analysis Loop]
  → IMPACT_ANALYSIS
  → PLAN
  → CONDITIONAL_REVIEW
      ├─ simple/low-risk → DONE
      └─ cross-module/safety/ambiguous → INDEPENDENT_REVIEW
            ├─ PASS → DONE
            ├─ FAIL_LOCAL → REQUIREMENT_ANALYSIS
            └─ NEED_USER_DECISION → USER
```

引用：

- `.agent/nodes/context.md`
- `.agent/nodes/requirement-analysis.md`
- `.agent/nodes/impact-analysis.md`
- `.agent/nodes/plan.md`
- `.agent/loops/requirement-analysis-loop.md`
- `.agent/loops/review-loop.md`

完成条件：

- 需求点可追踪。
- 受影响模块、接口、状态、任务/中断、配置、诊断和测试范围明确。
- 假设和阻塞问题明确。
- 非简单需求已经独立审查，或说明为何不需要。

## Skill 绑定

- Entry：`.agent/skills/model-skill/SKILL.md`
- Reference：`.agent/skills/model-skill/references/us-requirements.md`
- 配置：`.evospec/module.config.yaml` 的 `module`、`paths`、`work_item`、`architecture`、`development`
- 规则：加载需求阶段适用且 enabled 的 `.evospec/rules/`；无匹配规则时不强行套用开发规则。
````````

### `.agent/graphs/review.graph.md`

````````markdown
# Review Graph

**用途**：只读代码审查、PR/diff 审查、风险审查。

```text
START
  → COLLECT_CONTRACT_AND_DIFF
  → VERIFY_AVAILABLE_EVIDENCE
  → REVIEW_REQUIREMENT_COVERAGE
  → REVIEW_CORRECTNESS
  → REVIEW_DOMAIN_RISKS
  → REVIEW_TEST_COVERAGE
  → VERDICT
      ├─ PASS
      ├─ PASS_WITH_RISK
      ├─ FAIL_LOCAL
      ├─ FAIL_STRUCTURAL
      ├─ NEED_USER_DECISION
      └─ BLOCKED_ENVIRONMENT
```

Reviewer 必须：

- 使用 fresh context。
- 只读，不修复。
- 每个 blocking finding 给出文件、符号、证据和建议方向。
- 不把格式或个人风格当作 blocking finding，除非隐藏真实缺陷。
- 对高风险或结论冲突场景，可启动 Second Reviewer；两个 Reviewer 的共识仍不能覆盖失败的确定性验证。

## Skill 绑定

Reviewer 可读取当前任务已经加载的 Skill reference、`.evospec` 配置和启用规则作为契约证据。`.agent/skills/model-skill/agents/grader.md` 只用于验证 Skill 分发与配置渲染，不能替代本 Graph 的代码 Reviewer。
````````

### `.agent/graphs/skill-workflow.graph.md`

````````markdown
# Project Skill Workflow Graph

**用途**：处理现有核心 Graph 未单独建图的已注册 Skill 辅助阶段。当前默认包括 model-skill 的普通构建、部署/推板、Git 提交与 push、调试命令、项目资源、环境检查、代码分析和规则管理；后续 Skill 可按 `docs/ADDING_SKILLS.md` 增加 route。

```text
START
  → LOAD_SKILL_CONTEXT
  → SELECT_SKILL_ROUTE
  → SKILL_PREFLIGHT
      ├─ configuration complete → EXECUTE_SKILL_ROUTE
      ├─ safe read-only/dry-run possible → EXECUTE_SAFE_PART
      └─ blocking configuration missing → NEED_USER_DECISION / BLOCKED
  → VERIFY_STAGE_OUTPUT
  → OPTIONAL_REVIEW
  → REPORT
  → DONE
```

## 引用节点

- `.agent/nodes/load-skill-context.md`
- `.agent/nodes/skill-preflight.md`
- `.agent/nodes/execute-skill-route.md`
- `.agent/nodes/report.md`
- `.agent/loops/universal-loop.md`

## 路由来源

1. 读取 `.agent/skills/registry.yaml`。
2. 根据用户显式选择、任务目标和全局唯一的 `auxiliary_routes` 选择 Skill 与 route。
3. 读取选中 Skill 的 entry；不得默认所有 route 都属于 model-skill。
4. 只加载该 route 对应的 reference、registry 声明的配置文件和当前阶段启用规则。

## 当前 model-skill route 的权限边界

- `project-info`、`env-setup`、`code-analysis`、`rules` 默认只读；用户明确要求生成分析文档或修改规则时，按目标范围受控写入。
- `build` 可执行构建，但不得自行清理未知目录。
- `board-deploy` 默认先 `--list` / `--dry-run`；真实部署、删除目标端文件或重启进程需要用户明确授权且配置完整。
- `git-submit` 默认只检查 status/diff 和生成建议；执行 commit、push 前必须有真实任务编号、目标分支和用户授权。
- `debug-commands` 只运行配置中存在的非破坏性命令，不猜测进程名、设备路径或凭据。

新增 Skill route 的权限必须在本 Graph 或专用 Graph 中补充，Skill 自身不得扩大权限。

## 完成条件

- 已记录 `selected_skill`、`selected_skill_route`、加载的 reference 和规则。
- 配置占位符没有被当成真实命令执行。
- 执行结果包含命令、exit code、关键输出或明确的未执行原因。
- 高风险动作具有用户授权和对应验证证据。
````````

### `.agent/graphs/test-debug.graph.md`

````````markdown
# Test Debug Graph

**用途**：单元测试、集成测试、CI 测试或回归测试失败。

```text
START
  → READ_FAILURE
  → CLASSIFY_FAILURE
  → REPRODUCE_MINIMALLY
  → ROOT_CAUSE
  → DECIDE_CODE_OR_TEST
  → FIX_MINIMAL
  → RERUN_TARGET_TEST
      ├─ PASS → REGRESSION_TEST
      ├─ FAIL/same_signature_twice → FRESH_DEBUGGER
      └─ RETRY_EXHAUSTED → BLOCKED_OR_USER
  → REVIEW
  → DONE
```

使用 `.agent/loops/test-debug-loop.md`。

规则：

- 不通过删除断言、跳过用例或放宽期望来“修复”测试。
- 修改测试前必须说明原期望为何错误，并引用需求/接口证据。

## Skill 绑定

`model-skill` 当前没有独立测试调试 reference。本 Graph 以 `.agent/loops/test-debug-loop.md` 为权威；如测试依赖项目构建或环境，可按需加载 `us-build.md` 或 `env-setup.md`。
````````

### `.agent/loops/bugfix-loop.md`

````````markdown
# Bugfix Loop

每轮：

1. 归一化失败签名。
2. 提出一个可证伪 root-cause 假设。
3. 用最小实验或代码搜索验证。
4. 仅在证据支持时修复。
5. 重跑复现和相关回归。

相同签名连续两次且没有新证据时刷新 Debugger。
````````

### `.agent/loops/compile-debug-loop.md`

````````markdown
# Compile Debug Loop

1. 运行 build 并提取第一组根错误，不追逐级联错误。
2. 分类：路径/宏/语法/类型/符号/链接/目标/工具链。
3. 搜索定义、声明、调用和构建配置。
4. 输出 root cause 和预期修复效果。
5. 实施最小修复。
6. 重新 build。

停止：build exit code 为 0。

刷新：同签名两次、三轮上限、错误数/严重度无改善或范围扩大。
````````

### `.agent/loops/implementation-loop.md`

````````markdown
# Implementation Loop

每轮只处理一个计划任务：

1. 读取 task contract。
2. 修改最小文件集合。
3. 运行 targeted verification。
4. 成功后标记任务完成；失败则记录签名并路由。
5. 继续下一个任务。

停止：所有计划任务完成，且没有已知本地失败。

禁止：一次修改多个独立模块、无关重构、未验证即勾选完成。
````````

### `.agent/loops/refresh-agent-loop.md`

````````markdown
# Fresh Agent Loop

## 触发

读取 `.agent/refresh-policy.yaml`。

## 交接

使用 `.agent/prompts/fresh-agent-handoff.md`，只传递：

- 任务契约
- 当前 Graph/Node
- Selected Skill/route、加载的 reference 和规则
- 相关 `.evospec` 配置字段与 unresolved items
- 当前代码状态
- 失败证据
- 已尝试动作摘要及结果
- 已否定假设
- 约束和停止条件

## 新 Agent 第一轮

1. 独立检查证据。
2. 明确接受或推翻旧 root cause。
3. 给出新的验证路径。
4. 未形成新证据前不复制旧修复。

## 结束

将旧 agent id、新 agent id、触发原因和结果写入 `refresh_history`。
````````

### `.agent/loops/requirement-analysis-loop.md`

````````markdown
# Requirement Analysis Loop

每轮：

1. 选择一个未解决需求维度。
2. 读取需求和相关代码/测试。
3. 更新需求契约和影响矩阵。
4. 识别矛盾、歧义和缺失信息。
5. 由 Explorer 返回证据摘要。

停止：需求可执行、影响可追踪、测试方式明确。

刷新/升级：达到探索上限仍有关键矛盾时，启动 fresh analyst 或请求用户决策。
````````

### `.agent/loops/review-loop.md`

````````markdown
# Review Loop

1. Coordinator 准备精简审查包。
2. 启动 fresh、read-only Reviewer。
3. Reviewer 输出结构化 Verdict。
4. Coordinator 路由：
   - `PASS` → 下一节点/DONE
   - `PASS_WITH_RISK` → 风险接受决策
   - `FAIL_LOCAL` → 原 Agent 修复，最多配置的 review-fix 次数
   - `FAIL_STRUCTURAL` → 回到 PLAN + fresh Implementer
   - `NEED_USER_DECISION` → 用户
   - `BLOCKED_ENVIRONMENT` → blocker 报告
5. 修复后必须重新运行受影响的 build/test，再重新 Reviewer。

写代码的 Agent 不能是唯一 Reviewer。
````````

### `.agent/loops/test-debug-loop.md`

````````markdown
# Test Debug Loop

1. 选择最小失败用例。
2. 比较期望、实际和需求契约。
3. 判断产品代码、测试期望、环境或随机性问题。
4. 修复根因。
5. 重跑目标测试，再运行必要回归。

停止：目标测试和必要回归通过。

不得通过 skip、删除断言或放宽期望绕过失败。
````````

### `.agent/loops/universal-loop.md`

````````markdown
# Universal Loop

```text
OBSERVE → DECIDE → ACT → VERIFY → UPDATE → ROUTE
```

每轮约束：

- 一个清晰目标。
- 一个主要假设或动作。
- 一个可观察验证。
- 必须更新 state。
- 未产生新证据的重复动作计为 no-progress。
- 退出、继续、刷新和升级必须说明依据。
- 使用 Skill 时，每轮只读取当前 route 的最小 reference/config/rules，并记录 preflight 状态。
````````

### `.agent/nodes/compile.md`

````````markdown
# Node: COMPILE

- 使用 `.agent/project.yaml` 指定的稳定 wrapper，默认 `./scripts/build.sh`；真实构建策略、shell 和 artifact 必须与 `.evospec/module.config.yaml` 的 `build`/`artifacts` 一致。
- 保存完整日志到 `.agent/logs/`，主状态只保留关键错误和签名。
- 记录命令、exit code、目标、配置和时间。
- Build PASS 只证明构建门禁，不证明需求完整。
````````

### `.agent/nodes/context.md`

````````markdown
# Node: CONTEXT

目标：用最小上下文确定项目结构、任务入口和相关证据。

动作：

1. 读取任务、当前 state、`.agent/project.yaml`、Skill registry 和相关 `.evospec` 项目配置。
2. 定位相关需求、源码、头文件、测试、构建文件和 CI。
3. 使用 Explorer 搜索调用链和符号，不把原始大日志全部返回主线程。
4. 记录 `files_inspected`、`symbols`、`unknowns`、配置来源和候选 Skill route。

退出条件：已经知道“改哪里/查哪里/如何验证”，或明确列出真正阻塞项。
````````

### `.agent/nodes/execute-skill-route.md`

````````markdown
# Node: EXECUTE_SKILL_ROUTE

1. 按 `.agent/skills/registry.yaml` 选定 Skill 和 route/reference。
2. 使用该 Skill 在 registry 中声明的 `project_config` 渲染配置引用和模板变量；没有配置文件时只使用明确输入与仓库证据。
3. 应用该 Skill 声明的 `rules_index` 中当前 route 启用的规则。
4. 所有动作仍遵循 Universal Loop：Observe → Decide → Act → Verify → Update State → Route。
5. Skill reference 不得覆盖当前 Graph 的编辑权限、重试预算、独立验证和 Reviewer 门禁。
6. 保存 Skill ID、route、reference、命令、exit code、产物、输出文档、规则检查和未解析项。
7. 一个阶段只加载一个主 Skill；多个 Skill 必须由 Graph 按顺序调用，不得一次加载全部内容。
````````

### `.agent/nodes/impact-analysis.md`

````````markdown
# Node: IMPACT_ANALYSIS

至少检查：

- 直接受影响模块和间接受影响调用方
- 公共接口、数据结构和 ABI/API
- 状态机、任务、定时器、中断和并发
- NVM、配置、标定、诊断和通信信号
- 构建目标、生成代码和条件宏
- 单元、集成、系统和硬件测试
- 兼容性、迁移和回滚

输出“需求点 → 实现位置候选 → 验证方式”的追踪矩阵。
````````

### `.agent/nodes/implement.md`

````````markdown
# Node: IMPLEMENT

- 每轮选择一个未完成计划任务。
- 修改前重新核对目标文件和接口。
- 实施最小且可解释的变更。
- 运行最小验证后才能标记任务完成。
- 记录 changed files 和行为变化。
- 发现计划与代码现实冲突时停止该任务并返回 Coordinator，不自行扩大范围。
````````

### `.agent/nodes/load-skill-context.md`

````````markdown
# Node: LOAD_SKILL_CONTEXT

1. 读取 `.agent/skills/registry.yaml`。
2. 解析选中 Skill 的 entry、project config、rules index 和 reference 根目录。
3. 将 `selected_skill`、候选 route、配置文件和规则索引写入 run state。
4. 只读取当前 Graph 绑定或当前辅助 route 所需的 reference；禁止一次加载整个 Skill。
5. 若 Skill、配置或 rules index 缺失，输出 `BLOCKED_ENVIRONMENT`，不得静默降级为猜测。
````````

### `.agent/nodes/plan.md`

````````markdown
# Node: PLAN

计划必须具体到可分派任务：

- task id
- owner role
- files/symbols
- intended change
- dependency
- verification
- rollback
- risk

计划中的独立任务可以并行；修改同一文件或同一状态机的任务默认串行。

高风险计划在实施前调用独立 Reviewer；局部、低风险计划可以直接进入实现。
````````

### `.agent/nodes/report.md`

````````markdown
# Node: REPORT

最终报告固定包含：

- Selected Graph / reason
- Selected Skill / route
- Loaded references / enabled rules / unresolved configuration
- Task and Definition of Done
- Requirement/impact summary
- Plan and completed tasks
- Changed files
- Build/Test/Lint/Reproduction/Dry-run evidence
- Reviewer Verdict and findings
- Refresh history
- Remaining risks and blockers
- Suggested next action（仅在确有未完成依赖时）
````````

### `.agent/nodes/reproduce-trace.md`

````````markdown
# Node: REPRODUCE_OR_TRACE

优先级：

1. 可执行的最小复现。
2. 测试或日志中的稳定失败签名。
3. 静态调用链和状态转换证据。
4. 仅在以上不可用时使用推断。

输出 symptom、触发条件、期望行为、实际行为、影响范围和复现可信度。
````````

### `.agent/nodes/requirement-analysis.md`

````````markdown
# Node: REQUIREMENT_ANALYSIS

输出一个可执行的需求契约：

- Requirement ID / 来源
- 触发条件
- 输入与输出
- 正常行为
- 异常行为和降级
- 状态与状态转换
- 时序、周期和超时
- 接口兼容要求
- 资源与安全约束
- 验收方式
- 假设与歧义

不得把实现细节误当成需求，除非现有架构已构成明确约束。
````````

### `.agent/nodes/review.md`

````````markdown
# Node: REVIEW

Reviewer 输入：

- 用户任务和 Definition of Done
- 需求/接口契约
- 当前 diff 或 changed files
- Verifier 证据
- 必要源码和测试

Reviewer 不应接收 Implementer 的全部长推理，以降低锚定偏差。

输出严格遵循 `.agent/verdict-schema.yaml`。
````````

### `.agent/nodes/root-cause.md`

````````markdown
# Node: ROOT_CAUSE

Root cause 必须解释：

- 为什么会出现当前 symptom。
- 哪个具体条件、接口、状态或配置导致。
- 为什么建议修复点比症状点更合适。
- 哪个验证可以证伪该假设。

只描述“某行报错”不等于 root cause。
````````

### `.agent/nodes/route-failure.md`

````````markdown
# Node: ROUTE_FAILURE

Coordinator 按以下顺序判断：

1. 环境是否阻塞？是 → `BLOCKED_ENVIRONMENT`。
2. 是否需求/产品选择不明确？是 → `NEED_USER_DECISION`。
3. 是否局部且方向正确？是 → 原 Agent 修复，但受预算限制。
4. 是否重复错误、无进展或结构性失败？是 → Fresh Agent。
5. 是否 Reviewer/Verifier 证据冲突？是 → Second Reviewer 或用户决策。
6. 其余情况 → 停止并报告证据不足，不盲目继续。
````````

### `.agent/nodes/skill-preflight.md`

````````markdown
# Node: SKILL_PREFLIGHT

执行选中 Skill 阶段前检查：

1. 从 `.agent/skills/registry.yaml` 读取选中 Skill 的 `project_config`、`rules_index` 和 reference。
2. 若配置文件存在，确认其可解析且 schema/version 受支持；没有项目配置的纯流程 Skill 可省略该项。
3. 当前 route 所需配置节存在，命令、路径和标识中不存在 `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG` 等未解析标记。
4. 若配置了 rules index，确认索引与规则 frontmatter 一致，并只筛选当前 route 启用的规则。
5. 涉及部署、push、删除、停止进程、发布或覆盖文件时，确认用户授权、目标和回滚条件。
6. 可以安全完成的只读分析或 dry-run 不因无关字段缺失而停止。
7. 不把 registry 中不存在的默认配置路径写入 run state。

输出：`EXECUTABLE`、`DRY_RUN_ONLY`、`NEED_USER_DECISION` 或 `BLOCKED_ENVIRONMENT`。
````````

### `.agent/nodes/test.md`

````````markdown
# Node: TEST

- 先运行与变更最相关的测试，再运行必要回归。
- 记录测试范围、命令、exit code 和失败用例。
- 对硬件相关任务区分 host test、SIL、HIL 和实车/设备验证。
- 无法运行关键测试时，记录原因和替代证据，Verdict 不得是无风险 PASS。
````````

### `.agent/nodes/verify.md`

````````markdown
# Node: VERIFY

Verifier 独立于 Implementer：

1. 检查工作区和 changed files。
2. 运行 lint/build/test/reproduction。
3. 对照 Definition of Done 和需求追踪矩阵。
4. 输出确定性证据，不修改源代码。
5. 将结果写入 run state 的 `verification`。

Verifier 的 PASS 不替代 Reviewer；Reviewer 的 PASS 也不替代 Verifier。
````````

### `.agent/project.yaml`

````````yaml
version: 2

project:
  name: REPLACE_WITH_PROJECT_NAME
  domain: embedded-software
  primary_language: C
  safety_level: project-defined

skill_system:
  registry: .agent/skills/registry.yaml
  default_skill: model-skill
  project_config: .evospec/module.config.yaml
  rules_index: .evospec/rules/INDEX.md
  unresolved_markers: [REQUIRED, PLACEHOLDER, TODO_CONFIG]

commands:
  build: ./scripts/build.sh
  test: ./scripts/test.sh
  lint: ./scripts/lint.sh
  verify: ./scripts/verify.sh
  validate_evospec: ./scripts/validate-evospec.py

retry_budgets:
  requirement_analysis: 3
  implementation_tasks: 8
  bugfix: 4
  compile_debug: 3
  test_debug: 3
  review_fix: 2
  same_error_before_refresh: 2
  no_progress_before_refresh: 2

quality_gates:
  require_requirement_traceability: true
  require_build_after_code_change: true
  require_tests_after_behavior_change: true
  require_independent_review: true
  require_skill_preflight: true
  allow_pass_when_tests_unavailable: false
  unavailable_test_verdict: PASS_WITH_RISK

high_impact_actions:
  require_explicit_user_authorization:
    - deploy
    - push
    - target_remove
    - stop_remote_process
    - overwrite_remote_file
  default_mode: dry-run

embedded_review_focus:
  - initialization_order
  - state_machine_completeness
  - invalid_state_handling
  - task_period_and_deadline
  - interrupt_and_concurrency
  - timeout_handling
  - memory_and_stack
  - dynamic_allocation
  - api_compatibility
  - diagnostic_reporting
  - nvm_and_configuration
  - hardware_dependency

protected_paths:
  - .git/
  - .env
  - credentials/
  - secrets/

notes:
  - "`.agent/project.yaml` 管理 Agent 编排、门禁和重试预算。"
  - "`.evospec/module.config.yaml` 管理模块、构建、部署、调试和 Git 等项目参数。"
  - "shell wrapper 位于 scripts/；其真实行为必须与 `.evospec` 配置保持一致。"
````````

### `.agent/prompts/fresh-agent-handoff.md`

````````markdown
# Fresh Agent Handoff

## Identity

- Previous agent role/id:
- New agent role/id:
- Refresh trigger:

## Task Contract

- Goal:
- Selected Graph:
- Current Node:
- Definition of Done:
- Constraints:

## Skill Context

- Selected Skill:
- Selected Skill route:
- Loaded references:
- Loaded `.evospec` rules:
- Relevant configuration fields:
- Unresolved configuration:

## Current Repository State

- Changed files:
- Relevant files/symbols:
- Current branch/worktree:

## Deterministic Evidence

- Build command/result:
- Test command/result:
- Lint/static result:
- Reproduction/dry-run evidence:
- Normalized error signature:

## Previous Attempts — Summary Only

1. Action:
   Result:
2. Action:
   Result:

## Disproved or Unsafe Directions

-

## Open Questions

-

## Required First Action for Fresh Agent

Independently inspect the evidence and state whether the previous root-cause/implementation direction is accepted, rejected, or still unproven. Re-read the selected Skill reference and relevant `.evospec` configuration; do not repeat an old fix without new evidence.
````````

### `.agent/prompts/run-bugfix.md`

````````markdown
# Bugfix Prompt

请执行 Bugfix Graph，并使用 model-skill。

任务/问题：`{{TASK}}`

证据：`{{EVIDENCE}}`

加载 `us-bug-fix.md`、按需 `debug-commands.md`、进入构建时 `us-build.md`，以及相关 `.evospec` 配置和 bug-fix 启用规则。

规则：先复现或静态追踪，再定位 root cause；只修根因；运行目标验证和回归；使用 fresh Reviewer。相同错误签名连续两次时刷新 Debugger。生成 Bug 记录不能替代验证。
````````

### `.agent/prompts/run-compile-debug.md`

````````markdown
# Compile Debug Prompt

请从 Compile Debug Graph 开始。

构建日志：`{{BUILD_LOG}}`

加载 `us-build.md`、按需 `env-setup.md` 和 `.evospec` 构建配置。先分类错误并定位 root cause，再做最小修复。最多按项目配置重试；相同签名连续两次时刷新 Debugger。不得猜测服务器、clean 命令或工具链，也不得删除功能或注释调用绕过错误。
````````

### `.agent/prompts/run-development.md`

````````markdown
# Development Graph Prompt

请按项目里的 Graph + Loop + Skill 协议执行。

读取：

- `AGENTS.md`
- `.agent/project.yaml`
- `.agent/router.yaml`
- `.agent/graphs/development.graph.md`
- `.agent/skills/registry.yaml`
- `.agent/skills/model-skill/SKILL.md`
- `us-feature-dev.md`；进入构建时读取 `us-build.md`
- `.evospec/module.config.yaml` 的相关配置节
- `.evospec/rules/INDEX.md` 和 feature-dev 启用规则
- Graph 引用的 nodes 和 loops
- 当前 run state；如无则创建

任务：`{{TASK}}`

执行要求：

1. 主线程作为 Coordinator。
2. Explorer 只读分析上下文、配置来源和影响。
3. 先完成需求契约与计划，再实施。
4. Implementer 每轮只完成一个计划任务。
5. Verifier 独立运行 build/test/lint。
6. Reviewer 使用 fresh context，只读审查 Skill 规则、需求和验证证据。
7. 达到 `.agent/refresh-policy.yaml` 条件时刷新 Agent。
8. 未满足 Definition of Done 不得声明 DONE。
9. 不执行部署、commit 或 push，除非用户另外明确授权。
````````

### `.agent/prompts/run-requirement-analysis.md`

````````markdown
# Requirement Analysis Prompt

请执行 Requirement Analysis Graph，只读，不修改代码。

任务：`{{TASK}}`

加载：

- `.agent/skills/model-skill/references/us-requirements.md`
- `.evospec/module.config.yaml` 的 `module`、`paths`、`work_item`、`architecture`、`development`
- 当前阶段启用规则

输出：

- 需求契约
- 影响模块和调用链
- 接口/状态/任务/中断/配置/诊断/测试影响
- 需求点到实现位置和验证方式的追踪矩阵
- 假设、风险和真正阻塞问题
- 高风险时使用独立 Reviewer
````````

### `.agent/prompts/run-review.md`

````````markdown
# Independent Review Prompt

你是 fresh、read-only Reviewer。

审查对象：`{{SCOPE}}`
任务契约：`{{CONTRACT}}`
Skill route / references：`{{SKILL_CONTEXT}}`
启用规则：`{{RULES}}`
验证证据：`{{EVIDENCE}}`

按 `.agent/verdict-schema.yaml` 输出。重点检查需求覆盖、Skill 规则、正确性、边界、状态机、错误路径、并发/中断、资源、API 兼容和测试缺口。
````````

### `.agent/prompts/run-skill-workflow.md`

````````markdown
# Model Skill Workflow Prompt

请按 `.agent/graphs/skill-workflow.graph.md` 执行。

任务：`{{TASK}}`

要求：

1. 读取 `.agent/skills/registry.yaml` 和 `.agent/skills/model-skill/SKILL.md`。
2. 从 auxiliary routes 中选择 exactly one route。
3. 只加载对应 reference、相关 `.evospec` 配置和当前阶段启用规则。
4. 先执行 Skill preflight。
5. unresolved markers 不得作为真实值。
6. 部署、push、目标端删除、停止进程和远端覆盖默认只允许 dry-run；真实执行需要用户明确授权。
7. 输出命令、exit code、产物/文档、规则检查、未解析配置和下一步。
````````

### `.agent/protocol.md`

````````markdown
# Graph + Loop + Skill 执行协议

## 1. 一次复杂任务的标准生命周期

```text
CLASSIFY
  ↓
SELECT_GRAPH
  ↓
SELECT_SKILL_BINDING_OR_ROUTE
  ↓
LOAD_CONFIG_AND_RULES
  ↓
CREATE_OR_LOAD_STATE
  ↓
EXECUTE_NODE_LOOP
  ↓
COLLECT_EVIDENCE
  ↓
INDEPENDENT_REVIEW
  ↓
ROUTE_VERDICT
  ↓
DONE / RETRY / REFRESH_AGENT / USER_DECISION / BLOCKED
```

## 2. 分层职责

```text
Graph Router      → 任务宏观路线、权限和停止条件
Graph/Node/Loop   → 阶段、迭代、验证、审查和刷新
Skill Registry    → Graph 与阶段 reference 的绑定
Registered Skill  → 当前阶段的可复用执行流程；model-skill 是默认内置 Skill
.evospec config   → 项目/模块参数
.evospec rules    → 当前阶段启用的项目约束
Verifier/Reviewer → 独立正确性证据
```

任何 Skill 都不得扩大 Graph 的编辑权限、跳过质量门禁或把未配置字段解释为真实值。

## 3. Universal Node Loop

每个非简单节点执行：

1. **Observe**：读取当前 state、文件、日志、Skill reference、配置和上轮证据。
2. **Decide**：形成一个可证伪的下一步假设或动作。
3. **Act**：只执行一个边界清楚的动作。
4. **Verify**：运行最小但有效的确定性检查。
5. **Update State**：记录动作、Skill route、已加载规则、证据、错误签名、变更文件和剩余问题。
6. **Route**：退出节点、继续本 Loop、调用子图、刷新 Agent 或升级用户。

## 4. Skill 加载协议

1. 读取 `.agent/skills/registry.yaml`。
2. 核对 Graph 的 `graph_bindings`；辅助阶段使用 `auxiliary_routes`。
3. 读取选中 Skill 的 entry，并只读取选中的 reference。
4. 读取 registry 为该 Skill 声明的 `project_config`；没有项目配置的 Skill 可省略。
5. 读取 registry 声明的 `rules_index`，再加载匹配 route 且 enabled 的规则；未声明 rules index 时不猜测默认规则。
6. 执行 `.agent/nodes/skill-preflight.md`。
7. 将 `selected_skill`、`selected_skill_route`、references、rules 和 unresolved fields 写入 state。

禁止一次加载全部 references；禁止把其他项目的历史值补入配置。

## 5. 角色隔离

### Coordinator

- 拥有全局任务状态和路由权。
- 选择 Graph、Skill binding/route 并维护 state。
- 不把所有搜索日志塞进主上下文。
- 不替 Verifier 伪造执行结果。
- 不替 Reviewer 修改其 Verdict。

### Explorer

- 只读。
- 返回文件路径、符号、调用链、需求影响、配置来源和未知项。
- 不负责实施。

### Implementer

- 只在 Plan 足够具体且 Skill preflight 允许后实施。
- 每轮只完成一个计划任务或一个紧密耦合的小组任务。
- 不自我批准。

### Debugger

- 必须先输出错误分类和 root cause 假设。
- 不允许盲目试错或通过删除功能绕过错误。

### Verifier

- 运行 build/test/lint/reproduction/dry-run。
- 输出命令、exit code、关键日志、时间和适用范围。
- 可以生成构建产物，但不能编辑源文件。

### Reviewer

- fresh context、只读。
- 接收任务契约、diff、验证证据、Skill route、启用规则和必要源码，不接收 Implementer 的完整推理过程。
- 输出 `.agent/verdict-schema.yaml` 规定的 Verdict。

### Skill Grader

- 每个 Skill 可在 registry 中声明自己的 `grader`；当前 `model-skill` 使用 `.agent/skills/model-skill/agents/grader.md`。
- Grader 仅检查 Skill 分发、配置渲染、规则加载和输出契约，不能替代代码 Reviewer、测试结果或构建证据。

## 6. 正确性判断

证据强度从高到低：

1. 可重复的命令执行和 exit code。
2. 明确需求、接口契约、标准和已批准设计。
3. 目标行为的复现前后对比。
4. 静态分析和独立 Reviewer 的具体证据。
5. Worker 自述、直觉或未验证推断。

Reviewer 不得用“看起来正确”覆盖失败的测试；Verifier 也不能仅凭测试通过断言所有需求均覆盖。

## 7. 路由规则

- `PASS` → 当前 Graph 的下一节点或 DONE。
- `PASS_WITH_RISK` → Coordinator 判断风险是否需要用户接受。
- `FAIL_LOCAL` → 原 Implementer/Debugger 可修复，受 review-fix 上限限制。
- `FAIL_STRUCTURAL` → 回退到 PLAN，刷新 Implementer，必要时启动第二 Reviewer。
- `NEED_USER_DECISION` → 只询问真正阻塞且无法从项目证据解决的问题。
- `BLOCKED_ENVIRONMENT` → 记录缺失工具链、硬件、权限、配置或服务；输出已完成部分和恢复步骤。

Skill preflight 结果：

- `EXECUTABLE` → 正常执行。
- `DRY_RUN_ONLY` → 只渲染和检查，不执行高影响命令。
- `NEED_USER_DECISION` → 请求目标、凭据来源、任务号或授权。
- `BLOCKED_ENVIRONMENT` → 记录缺失依赖。

## 8. Fresh Agent 原则

Fresh Agent 不是“多问一个模型意见”，而是消除旧上下文锚定：

- 使用同一职责但新的 agent thread/session。
- 仅传递事实、当前代码状态、失败证据、Skill route、启用规则、尝试摘要、禁止重复项和验收标准。
- 不传递旧 Agent 的全部思维过程。
- 新 Agent 必须重新形成 root cause 或实现方案，不得默认旧假设正确。

## 9. 人工确认边界

以下情况优先询问用户，而不是无限刷新 Agent：

- 两种需求解释都有合理证据。
- 涉及产品策略、法规、安全目标或硬件行为决策。
- 需要真实服务器、密钥、供应商工具或物理设备。
- 修复需要破坏兼容性或扩大范围。
- 执行真实部署、push、远端删除、停止进程或覆盖文件。


## 10. 新增 Skill

新增、迁移或扩展 Skill 时，必须遵循 `docs/ADDING_SKILLS.md`。中央实现放在 `.agent/skills/<skill-id>/`，在 `registry.yaml` 注册，并通过 Graph binding、auxiliary route 或独立 Graph 接入。平台目录只允许薄适配器。
````````

### `.agent/refresh-policy.yaml`

````````yaml
version: 2

refresh_triggers:
  - id: retry_budget_exhausted
    condition: current_loop_iteration >= configured_max_iterations
    action: spawn_fresh_same_role

  - id: repeated_error
    condition: same_normalized_error_signature_count >= 2
    action: spawn_fresh_debugger

  - id: no_measurable_progress
    condition: no_progress_iterations >= 2
    action: stop_original_agent_and_reassess

  - id: structural_review_failure
    condition: reviewer_verdict == FAIL_STRUCTURAL
    action: return_to_plan_and_spawn_fresh_implementer

  - id: expanding_scope_without_gain
    condition: changed_file_scope_increases AND verification_does_not_improve
    action: freeze_changes_and_spawn_fresh_reviewer

  - id: context_pollution
    condition: agent_cannot_summarize_current_root_cause_or_repeats_discarded_hypotheses
    action: compact_handoff_and_spawn_fresh_agent

  - id: evidence_conflict
    condition: verifier_and_reviewer_or_two_reviewers_reach_materially_conflicting_conclusions
    action: spawn_second_reviewer_or_request_user_decision

same_agent_allowed_when:
  - verdict == FAIL_LOCAL
  - retry_budget_remaining
  - error_signature_changed_or_progress_measurable
  - fix_scope_is_local

never_refresh_blindly_when:
  - requirement_has_two_valid_product_interpretations
  - decision_changes_public_api_or_backward_compatibility
  - safety_or_regulatory_decision_requires_owner_approval
  - physical_hardware_or_external_service_is_required
  - required_evospec_value_or_high_impact_authorization_is_missing

handoff_template: .agent/prompts/fresh-agent-handoff.md
````````

### `.agent/router.yaml`

````````yaml
version: 2

default_graph: qa

selection_priority:
  - explicit_user_selection
  - dominant_task_goal
  - failure_evidence
  - requested_edit_scope
  - skill_auxiliary_intent
  - fallback

rules:
  - graph: compile-debug
    file: .agent/graphs/compile-debug.graph.md
    edit_mode: controlled
    choose_when:
      - 输入包含编译器、链接器、CMake、Make、include、宏或 undefined reference 错误
      - 用户主要目标是修复构建失败

  - graph: test-debug
    file: .agent/graphs/test-debug.graph.md
    edit_mode: controlled
    choose_when:
      - 输入包含单元测试、集成测试或 CI 测试失败证据
      - 构建已通过且主要目标是让测试恢复

  - graph: review
    file: .agent/graphs/review.graph.md
    edit_mode: read-only
    choose_when:
      - 用户要求 review、审查、audit、风险检查或评估当前 diff
      - 未要求同时修复

  - graph: requirement
    file: .agent/graphs/requirement.graph.md
    edit_mode: read-only
    choose_when:
      - 用户要求需求分析、需求变更影响、设计输入分析或实现方案
      - 用户未要求直接实现

  - graph: development
    file: .agent/graphs/development.graph.md
    edit_mode: write
    choose_when:
      - 用户要求新增功能、实现模块、生成代码框架或按需求开发

  - graph: bugfix
    file: .agent/graphs/bugfix.graph.md
    edit_mode: write
    choose_when:
      - 用户描述运行时错误、问题单、日志异常或不符合预期行为
      - 错误不只是纯编译或纯测试失败

  - graph: refactor
    file: .agent/graphs/refactor.graph.md
    edit_mode: write
    choose_when:
      - 用户明确要求保持行为不变的重构、拆分、去重或清理

  - graph: docs
    file: .agent/graphs/docs.graph.md
    edit_mode: docs-only
    choose_when:
      - 用户主要要求 README、设计文档、注释或接口文档变更

  - graph: skill-workflow
    file: .agent/graphs/skill-workflow.graph.md
    edit_mode: stage-defined
    choose_when:
      - 用户主要目标是普通构建而非修复构建错误
      - 用户要求推板、部署、ADB/SSH 传输或目标端验证
      - 用户要求 git commit、push 或提交记录
      - 用户要求配置驱动的日志/进程/环境检查
      - 用户要求项目资源、代码架构分析或规则管理
      - 用户明确要求 model-skill 的辅助阶段，且没有更具体的核心 Graph

  - graph: qa
    file: .agent/graphs/qa.graph.md
    edit_mode: read-only
    choose_when:
      - 简单解释、查找、比较、总结或无需执行验证的问答

routing_guards:
  - 用户显式指定 Graph 时优先使用；若与安全边界冲突，说明冲突并选择安全路线。
  - 用户只显式指定 model-skill 时，仍根据最终目标选择核心 Graph 或 skill-workflow，不机械跳过 Graph Router。
  - 同时包含开发和编译错误时，通常以 development 为父 Graph，并调用 compile-debug 子图。
  - 同时包含 Bug 和测试失败时，先判断测试是否只是复现证据；若是，则使用 bugfix 父 Graph。
  - 普通 build 使用 skill-workflow/build；已有失败证据使用 compile-debug。
  - deploy、push、远端删除和停止进程必须经过 Skill preflight 与用户授权。
  - 不因单个关键词机械选图；以用户最终目标和证据类型为准。
````````

### `.agent/run-state.schema.json`

````````json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Graph Loop Agent Run State",
  "type": "object",
  "required": [
    "run_id",
    "task",
    "routing",
    "skill",
    "loop",
    "verification",
    "review",
    "final"
  ],
  "properties": {
    "run_id": {
      "type": "string",
      "minLength": 1
    },
    "task": {
      "type": "object"
    },
    "routing": {
      "type": "object",
      "required": [
        "selected_graph",
        "current_node",
        "status"
      ]
    },
    "loop": {
      "type": "object"
    },
    "verification": {
      "type": "object"
    },
    "review": {
      "type": "object",
      "properties": {
        "verdict": {
          "enum": [
            "NOT_RUN",
            "PASS",
            "PASS_WITH_RISK",
            "FAIL_LOCAL",
            "FAIL_STRUCTURAL",
            "NEED_USER_DECISION",
            "BLOCKED_ENVIRONMENT"
          ]
        }
      }
    },
    "final": {
      "type": "object",
      "properties": {
        "status": {
          "enum": [
            "NOT_DONE",
            "DONE",
            "DONE_WITH_RISK",
            "BLOCKED",
            "CANCELLED"
          ]
        }
      }
    },
    "skill": {
      "type": "object",
      "required": [
        "selected_skill",
        "selected_skill_route",
        "preflight_status"
      ],
      "properties": {
        "selected_skill": {
          "type": "string"
        },
        "selected_skill_route": {
          "type": "string"
        },
        "references": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "loaded_rules": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "unresolved_fields": {
          "type": "array",
          "items": {
            "type": "string"
          }
        },
        "preflight_status": {
          "enum": [
            "NOT_RUN",
            "EXECUTABLE",
            "DRY_RUN_ONLY",
            "NEED_USER_DECISION",
            "BLOCKED_ENVIRONMENT"
          ]
        }
      }
    }
  }
}
````````

### `.agent/runs/.gitkeep`

````````text

````````

### `.agent/skills/README.md`

````````markdown
# 项目级 Skill 层

`.agent/skills/` 是 Graph + Loop 框架的跨工具 Skill 目录。它不依赖 Codex、Claude Code 或 Pi 的某一个原生目录；各平台通过 `AGENTS.md`、`CLAUDE.md` 和项目 runner 显式加载。

## 分层关系

```text
Graph Router
  ↓ 选择宏观任务路线
Task Graph / Node / Loop
  ↓ 选择阶段和迭代方式
Skill Registry
  ↓ 绑定阶段流程
<selected-skill> reference
  ↓ 读取 registry 声明的项目参数与规则
.evospec/module.config.yaml 或 .evospec/skills/*.config.yaml + .evospec/rules/
```

## 当前 Skill

- `model-skill/`：需求、开发、Bug 修复、构建、部署、Git、调试、项目资源、环境、代码分析和规则管理。
- `registry.yaml`：所有 Skill 的 entry、Graph binding、辅助 route、项目配置和规则入口。

## 使用边界

- Graph 负责宏观路线、权限、停止条件和 Reviewer/Verifier 门禁。
- Skill 负责阶段内的项目化步骤，不可绕过 Graph 的只读边界或质量门禁。
- 选中 Skill 的项目配置中存在 `REQUIRED`、`PLACEHOLDER` 或 `TODO_CONFIG` 时，相关高风险动作必须停止或保持 dry-run。
- Skill grader 只评估路由、配置、规则和输出契约，不代替框架中的代码 Reviewer 或确定性 Verifier。


## 新增 Skill

中央业务实现统一放在：

```text
.agent/skills/<skill-id>/
```

并在 `registry.yaml` 注册。不要在 `.codex/skills/`、`.claude/skills/`、`.pi/skills/` 复制完整 Skill；平台目录只放薄入口。

完整目录模板、registry 字段、Graph 接入、`.evospec` 配置、Rules、平台适配和验收清单见：

```text
docs/ADDING_SKILLS.md
```

新增后运行：

```bash
python3 scripts/validate-skills.py
python3 scripts/validate-framework.py
```
````````

### `.agent/skills/model-skill/README.md`

````````markdown
# model-skill 通用项目开发工作流

`model-skill` 是一个稳定路由层：保留需求、开发、修复、构建、部署、Git、调试、资源、环境、代码分析和规则管理 11 个 reference；项目差异全部集中在 `.evospec/module.config.yaml`。

## 使用说明

完整迁移方法、配置字段说明和 Agent 初始化协议见 [`USAGE.md`](USAGE.md)。新项目第一次使用时应先按该文档完成配置，未确认的服务器、部署和 push 信息不得猜测。

## 使用方式

在本 Graph + Loop 框架中显式调用：

```text
请按项目 Graph Router 执行，并使用 model-skill，帮我分析这个需求
请按项目 Graph Router 执行，并使用 model-skill，修复这个崩溃
请按项目 Graph Router 执行，并使用 model-skill，编译并部署
```

执行顺序：读取配置 → 判断阶段 → 加载阶段规则 → 读取对应 reference → 执行并产出证据。

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
2. 复制通用模板配置并填写所有 `REQUIRED` 项。
3. 保持 `references/*.md` 不增不删；项目特殊流程优先表达为配置命令或规则开关。
4. 删除模板中的示例输入/输出，只保留 `.gitkeep`。
5. 依次验证：配置占位符、构建 dry-run、artifact 路径、部署 `--list/--dry-run`、Git push 模板。

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
- 改意图分类：才改 `SKILL.md` 路由表。
````````

### `.agent/skills/model-skill/SKILL.md`

````````markdown
---
name: model-skill
description: Graph + Loop 框架中的通用项目开发维护工作流入口。根据用户意图分发到需求、开发、修复、构建、部署、Git、调试、代码分析或规则管理流程；所有项目差异均从 .evospec/module.config.yaml 读取。
---

# 通用项目开发维护工作流

## 核心原则

1. **流程通用、参数配置化**：服务器、工具链、架构、日志、部署、Git、文档路径等项目差异，只允许出现在 `.evospec/module.config.yaml` 或 `.evospec/rules/` 中。
2. **配置优先**：执行任何阶段前先读取配置，不凭经验补全项目命令，不把配置值回写到 `references/*.md`。
3. **证据优先**：涉及代码、构建、部署和提交时，以仓库现状、命令输出和配置为准。
4. **渐进读取**：只读取当前阶段需要的配置节、规则和 reference，避免一次加载全部内容。

## 在 Graph + Loop 框架中的职责

- Graph Router 先选择宏观任务 Graph；本 Skill 不替代 Graph。
- `.agent/skills/registry.yaml` 将 Graph 或辅助 route 绑定到本 Skill 的 reference。
- Graph 的编辑权限、重试预算、Verifier、Reviewer 和停止条件高于 Skill 内的阶段跳转。
- Skill 负责阶段内项目流程；`.evospec` 提供项目值；执行证据写入统一 run state。

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

1. 复制 `.agent/skills/model-skill/`、`.evospec/rules/` 和 `.evospec/scripts/`。
2. 以通用模板创建 `.evospec/module.config.yaml`，只修改配置，不修改路由表和 reference 文件集合。
3. 保持 `references/` 中现有 Markdown 文件的文件名和职责稳定；项目独有步骤通过配置命令、规则开关或项目文档表达。
4. 迁移后运行配置检查：路径存在性、构建命令 dry-run、部署场景列表、Git push ref、输出目录可写性。
````````

### `.agent/skills/model-skill/USAGE.md`

````````markdown
# model-skill 通用模板使用说明

- 文档版本：1.0
- 适用配置版本：`.evospec/module.config.yaml` → `schema_version: 2`
- 适用对象：模板使用者、负责初始化或迁移模板的 Agent

## 0. 文档目的

`model-skill` 将项目开发流程与项目参数分离：

- 通用流程位于 `.agent/skills/model-skill/`；
- 项目参数位于 `.evospec/module.config.yaml`；
- 项目强制约束位于 `.evospec/rules/`；
- 需求、设计、Bug、部署和代码分析记录位于 `.evospec/input/`、`.evospec/output/`；
- `references/` 只保存稳定的阶段流程，不保存服务器、芯片、路径、进程、日志宏、分支等项目常量。

## 在 Graph + Loop 框架中的集成方式

本模板已迁入 `.agent/skills/model-skill/`。使用时先由 `.agent/router.yaml` 选择 Graph，再由 `.agent/skills/registry.yaml` 选择本 Skill 的 reference；`.evospec/` 与 `.agent/` 同级。Graph 的只读边界、Loop 重试、Verifier、Reviewer 和用户授权门禁不能被本 Skill 覆盖。

本文分为两部分：

1. **给人看的迁移说明**：在新模块或新项目中需要复制、修改、补充和验证什么。
2. **给 Agent 看的初始化协议**：Agent 应如何读取代码、填写配置、向用户询问无法确认的信息，并完成验证。

---

# 第一部分：给人看的使用说明

## 1. 适用场景

以下情况可以使用本模板：

- 为一个新模块建立统一的需求、开发、构建、部署和提交工作流；
- 将已有项目的专用 Skill 改造成配置驱动的通用 Skill；
- 在同一代码仓库中，为不同模块分别维护构建、产物、部署和调试参数；
- 将模板从一个项目复制到另一个项目，同时避免携带旧项目的服务器、路径、进程或分支信息。

## 2. 目录放置方式

将模板复制到新项目或新模块的根目录。推荐结构如下：

```text
<module-root>/
├─ .agent/
│  └─ skills/
│     └─ model-skill/
│        ├─ SKILL.md
│        ├─ README.md
│        ├─ USAGE.md
│        ├─ agents/
│        └─ references/          # 保持现有 11 个 Markdown 文件
├─ .evospec/
│  ├─ module.config.yaml         # 当前模块的唯一主配置
│  ├─ rules/                     # 项目约束
│  ├─ scripts/                   # 通用辅助脚本
│  ├─ input/prd/                 # 需求输入
│  └─ output/
│     ├─ design/
│     ├─ bug-log/
│     ├─ push-log/
│     └─ code-analysis/
└─ <项目源码与构建文件>
```

### 模块级与项目级放置

- **一个仓库只有一个主要模块**：放在仓库根目录。
- **一个仓库包含多个相对独立模块**：每个模块可各自维护一份 `.evospec/module.config.yaml`；Skill 可以共用，也可以跟随模块复制。
- `module.root` 应指向配置所描述模块的根目录。优先使用相对路径，避免写入个人电脑绝对路径。

## 3. 迁移时不得随意修改的内容

### 3.1 `references/` 的保护边界

`references/` 中以下 11 个 Markdown 文件应保持文件名、数量和职责稳定：

| 文件 | 职责 |
|---|---|
| `us-requirements.md` | 需求分析与设计文档 |
| `us-feature-dev.md` | 功能开发 |
| `us-bug-fix.md` | Bug 定位、修复与回归 |
| `us-build.md` | 构建流程 |
| `us-board-deploy.md` | 部署与验证 |
| `us-git-submit.md` | Git 提交与推送 |
| `debug-commands.md` | 调试命令 |
| `project-info.md` | 项目资源导航 |
| `env-setup.md` | 环境检查 |
| `us-code-analysis.md` | 代码架构分析 |
| `us-rules.md` | 规则管理 |

迁移到新项目时：

- 不新增、删除或重命名这些文件；
- 不把项目服务器、账号、绝对路径、进程名、芯片名、日志宏或分支写进这些文件；
- 只有当所有项目都需要改变同一套通用流程时，才修改对应 reference；
- 项目差异优先写入配置文件，其次写入规则文件。

### 3.2 `SKILL.md` 路由表

通常不需要修改路由表。只有新增了真正独立的工作阶段或意图类别，且现有 11 个阶段无法承载时，才评估修改；普通项目差异不属于修改路由表的理由。

## 4. 新项目必须修改的主配置

主配置文件：

```text
.evospec/module.config.yaml
```

模板中的 `REQUIRED` 表示尚未配置。使用相关功能前必须替换；不得把 `REQUIRED` 当成真实命令、路径或名称执行。

### 4.1 模块基本信息：`module`

| 配置项 | 需要填写的内容 | 常见来源 |
|---|---|---|
| `module.id` | 稳定、简短、可用于文件或日志标识的模块 ID | 模块目录名、构建目标名 |
| `module.name` | 人类可读名称 | README、产品或模块名称 |
| `module.description` | 模块职责简述 | README、架构文档、源码入口 |
| `module.root` | 模块根目录，建议相对路径 | 模板放置位置 |
| `module.platform` | OS、芯片平台、MCU、SoC 或运行平台 | 工具链、构建脚本、项目文档 |
| `module.framework` | 主要框架或运行体系，可为空 | 源码、依赖和构建文件 |
| `module.runtime_processes` | 运行时进程、服务或任务名称 | 服务文件、启动脚本、板端实测 |

### 4.2 文档路径：`paths`

根据当前项目的目录习惯填写：

- `architecture_sources`：架构文档、接口文档、README 等来源；
- `requirement_input`：需求或 PRD 输入目录；
- `design_output`：设计方案输出目录；
- `bug_log_output`：Bug 修复记录目录；
- `push_log_output`：提交和推送记录目录；
- `code_analysis_output`：代码分析文档目录。

若没有既有目录，建议保留模板中的 `.evospec/input` 和 `.evospec/output` 结构。路径优先使用相对路径。

### 4.3 任务编号：`work_item`

| 配置项 | 说明 |
|---|---|
| `system` | Jira、禅道、GitHub Issue、内部需求系统或 `manual` |
| `id_label` | 文档中展示的编号名称，例如“需求编号”“Task ID” |
| `id_pattern` | 编号校验正则；不确定时可暂用宽松规则 |
| `filename_template` | 设计、Bug 和提交记录的文件命名模板 |

如果团队没有任务系统，可配置：

```yaml
work_item:
  system: manual
  id_label: Task ID
  id_pattern: "^.+$"
  filename_template: "{date}-{task.id}-{summary}.md"
```

Agent 不得自行编造任务编号。用户没有提供编号时，应保留可见占位符或询问用户。

### 4.4 架构信息：`architecture`

- `style`：分层架构、事件驱动、插件式、客户端/服务端、裸机任务模型等；
- `flow`：核心数据或控制流，按发生顺序填写；
- `layers`：主要层级、目录或职责；
- `related_modules`：本模块经常交互或可能受影响的模块。

架构配置用于帮助 Agent 导航，不能替代源码事实。代码与配置不一致时，应以代码和正式架构文档为依据，并更新配置或记录差异。

### 4.5 构建配置：`build`

至少要确认：

- 是否允许自动构建：`enabled`；
- 默认构建策略：`default_strategy`；
- 每种策略使用的宿主 Shell；
- 工具链初始化方式；
- 构建命令；
- 清理命令；
- 常见错误及处理方式。

一个项目可以同时配置多个策略，例如：

- `local`：本机编译；
- `remote`：SSH 到编译服务器；
- `container`：Docker 或开发容器；
- `ci`：只提供 CI 触发或复现步骤。

示例结构：

```yaml
build:
  enabled: true
  default_strategy: local
  strategies:
    local:
      enabled: true
      host_shell: bash
      description: 本机增量构建
      commands:
        - cmake --build build --target demo
      manual_steps: []
    remote:
      enabled: false
      host_shell: bash
      description: 远程编译服务器构建
      commands: []
      manual_steps: []
  clean_command: "cmake --build build --target clean"
  common_errors: []
```

远程服务器地址、用户名、端口和远端工作目录无法从仓库可靠确认时，必须由用户提供。密码、Token 和私钥不得写入配置。

### 4.6 构建产物：`artifacts`

每个需要验证或部署的产物都应有独立 ID：

```yaml
artifacts:
  - id: main_binary
    description: 主程序
    build_strategy: local
    local_path: build/bin/demo
    target_path: /opt/demo/bin/demo
```

每项至少确认：

- `id`：供部署场景引用；
- `description`：产物用途；
- `build_strategy`：由哪个构建策略生成；
- `local_path`：本地产物路径；
- `target_path`：目标设备路径，若不部署可留空。

不要仅凭文件扩展名判断哪个产物应部署；存在多个候选文件时应由用户确认。

### 4.7 部署配置：`deploy`

部署涉及覆盖、删除和重启，必须保守配置。

只有以下信息完整且验证过时，才把 `deploy.enabled` 设置为 `true`：

- 传输方式，如 adb、scp、rsync、串口工具或厂商工具；
- 执行命令所使用的宿主 Shell；
- 设备连接检查命令；
- 文件系统准备或挂载命令；
- 需要停止和恢复的进程或服务；
- 每个部署场景对应的 artifact；
- 目标端删除、传输和恢复命令；
- 部署后的验证命令和成功标准。

推荐为不同改动范围配置不同场景：

```yaml
deploy:
  enabled: true
  transport: adb
  host_shell: cmd
  preflight_commands:
    - adb get-state
  prepare_commands: []
  stop_process_command_template: "adb shell pkill -f {process}"
  processes:
    - demo_service
  scenarios:
    code_only:
      description: 仅部署主程序
      artifact_id: main_binary
      remove_commands:
        - adb shell rm -f {artifact.target_path}
      transfer_command:
        - adb push {artifact.local_path} {artifact.target_path}
  post_commands: []
  verification:
    commands:
      - adb shell ps | grep demo_service
    success_criteria:
      - 目标进程正常运行
      - 日志中没有持续错误
```

以上命令只是结构示例，不能直接复制到不了解的项目。

如果目标设备、序列号、板端路径、进程名、停止/启动方式或权限要求不确定：

1. 保持 `deploy.enabled: false`；
2. 让 Agent 列出待确认项；
3. 用户确认后再启用；
4. 首次执行必须先 `--dry-run`。

### 4.8 调试配置：`debug`

需要按项目填写：

- 实时日志命令；
- 清空、保存日志命令；
- 不同宿主系统的过滤命令；
- 日志 TAG；
- 进程查询命令模板；
- 常用配置文件路径。

如果项目没有统一日志工具，可以复用仓库现有调试方式；不要为了填满配置而创造新的日志体系。

### 4.9 Git 配置：`git`

确认：

- Commit Message 格式；
- 描述语言和长度；
- Git 托管或评审方式；
- remote；
- 目标分支或 review ref；
- push 命令模板；
- 允许的分支模式；
- 禁止提交的构建目录和产物。

示例：

```yaml
git:
  enabled: true
  commit:
    template: "{task.id}: {task.summary}"
    summary_language: zh-CN
    max_summary_length: 72
  push:
    provider: git
    remote: origin
    target_branch: refs/heads/main
    command_template: "git push {remote} HEAD:{target_branch}"
  branch_patterns: []
  forbidden_paths:
    - build/
    - out/
    - "*.o"
    - "*.bin"
```

不能仅根据当前本地分支猜测正式推送目标。Gerrit review ref、受保护分支或特殊 push option 必须由仓库规范或用户确认。

### 4.10 开发规则参数：`development`

该配置描述项目代码约束，不描述业务需求。

- `languages`：主要编程语言；
- `build_file_patterns`：新增源码时可能需要修改的构建文件；
- `logging`：日志 include、命名空间、宏、固定 TAG 和必打点位置；
- `comments`：注释语言和粒度；
- `high_frequency_calls`：循环、轮询、定时器等高频路径中的高开销调用；
- `extension_contract`：插件、驱动、策略等扩展点的基类、工厂函数和注册方式。

若项目没有某种机制，应将对应 `enabled` 设置为 `false`，不要为满足模板而虚构接口。

### 4.11 代码分析配置：`code_analysis`

- `index_mode`：通常保持 `discover`；
- `preferred_documents`：可为高频问题配置关键词与优先分析文档。

这部分可为空，不影响基础开发流程。

## 5. 哪些内容应写到哪里

| 变化类型 | 修改位置 |
|---|---|
| 模块名、平台、框架、目录 | `module.config.yaml` |
| 构建服务器、工具链、命令 | `module.config.yaml` → `build` |
| 产物和板端路径 | `module.config.yaml` → `artifacts`、`deploy` |
| 进程、日志命令、TAG | `module.config.yaml` → `module`、`debug`、`development.logging` |
| Commit 格式和推送分支 | `module.config.yaml` → `git` |
| 项目必须遵守的编码或提交规则 | `.evospec/rules/` 与配置开关 |
| 单个需求、设计、Bug 或分析结果 | `.evospec/input/`、`.evospec/output/` |
| 所有项目都应改变的阶段流程 | 对应 `references/*.md`，谨慎修改 |
| 意图分类或阶段路由 | `SKILL.md`，极少修改 |

## 6. 凭据和敏感信息

禁止把以下内容写入仓库配置：

- 密码；
- Access Token；
- SSH 私钥正文；
- Cookie；
- 设备解锁密钥；
- 内部服务的长期密钥。

配置中只允许保存：

- 服务器地址、端口和用户名（团队允许提交时）；
- 环境变量名称；
- SSH Host 别名；
- 凭据管理工具名称；
- “从何处获取凭据”的说明。

例如：

```yaml
credential_source: "SSH config host alias: build-server"
```

不要写：

```yaml
password: "123456"
```

## 7. 人工迁移流程

### 步骤 1：复制模板

复制以下目录和文件：

```text
.agent/skills/model-skill/
.evospec/rules/
.evospec/scripts/
.evospec/module.config.yaml
.evospec/input/
.evospec/output/
```

### 步骤 2：清理旧项目残留

全文检查并删除或替换：

- 旧项目名和模块名；
- 旧芯片、平台或框架名；
- 旧服务器地址、用户名和目录；
- 旧板端路径、进程和服务名；
- 旧 Git remote、分支和 Gerrit ref；
- 旧日志 TAG、宏和 include；
- 旧构建目标和产物名。

### 步骤 3：填写可确定配置

优先从当前仓库的 README、构建文件、脚本、CI、服务定义和同类模块中获取证据。

### 步骤 4：补充用户才能确认的信息

重点确认远程服务器、目标设备、部署权限、正式推送目标、任务系统规则和验收标准。

### 步骤 5：保持不完整功能关闭

- 构建未配置完整：将对应 strategy 的 `enabled` 设为 `false`；
- 部署未配置完整：保持 `deploy.enabled: false`；
- Git 推送未确认：可保留本地 commit 流程，但不得执行 push；
- 日志、插件或高频调用规则不适用：设置对应 `enabled: false`。

### 步骤 6：执行验收检查

- YAML 能正常解析；
- 没有 `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG` 被误当成真实值；
- 配置中的相对路径从模块根目录解析正确；
- 构建命令与仓库脚本一致；
- artifact 路径和构建结果一致；
- deploy scenario 引用的 artifact 均存在；
- 首次部署先运行 `--list` 和 `--dry-run`；
- Git push 目标已由仓库规范或用户确认；
- `references/` 的 11 个文件未增删、未改名；
- 配置和文档中没有密码、Token 或私钥。

## 8. 推荐的初始化请求

将模板复制到新项目后，可以对 Agent 使用以下请求：

```text
使用 model-skill 的通用模板初始化协议，分析当前模块代码和构建文件，完善
.evospec/module.config.yaml。能够从仓库可靠确定的内容直接填写；无法确定的内容
按 USAGE.md 的要求集中询问我。不要猜测服务器、板端路径、进程、部署命令、
正式 push 分支或凭据。保持 references 中现有 Markdown 文件不增不删、不改名。
完成后先做配置检查和 dry-run，不执行真实部署和 push。
```

---

# 第二部分：给 Agent 看的初始化协议

## 9. Agent 的任务定义

当用户要求“初始化模板”“迁移 Skill”“完善模块配置”“让 model-skill 适配当前项目”时，Agent 应执行本节协议。

Agent 的目标不是把所有字段机械填满，而是：

1. 从当前项目证据中提取可信配置；
2. 把项目差异写入 `.evospec/module.config.yaml` 或 `.evospec/rules/`；
3. 对无法可靠确定的信息向用户提问；
4. 对不完整或危险的功能保持禁用；
5. 验证配置能被读取，但在未经授权时不执行真实部署、远程构建或 push；
6. 保持 `references/` 路由文件集合稳定。

## 10. Agent 的硬性约束

Agent **必须**遵守：

1. 不新增、删除、重命名 `references/` 中现有 11 个 Markdown 文件。
2. 不因项目差异大改 `SKILL.md` 路由表。
3. 不把项目常量写入 `references/*.md`。
4. 不沿用其他项目、历史对话或模板示例中的服务器、路径、进程、芯片、日志宏或分支。
5. 不编造任务编号、构建命令、产物路径、部署命令、进程名或 push ref。
6. 不把密码、Token、私钥或 Cookie 写入配置、脚本、日志或文档。
7. 不覆盖用户已有且与本次初始化无关的修改。
8. 对删除、覆盖、停止进程、重启、真实部署、远程执行和 push 等动作保持保守；未获得明确授权时只分析、配置和 dry-run。
9. 证据冲突时不得静默选择，应列出冲突并向用户确认。
10. 用户已经提供过的信息不得重复询问。

## 11. Agent 的证据优先级

填写配置时按以下优先级判断：

1. 当前仓库可执行脚本、构建文件和 CI 配置；
2. 当前源码、服务文件、注册表和配置文件；
3. 当前仓库 README、架构文档和开发说明；
4. Git remote、分支配置和提交规范；
5. 同仓库同类型模块的稳定实现；
6. 用户明确提供的信息；
7. 命名和目录结构推断。

第 7 类只能形成候选，不能用于填写高风险字段。

## 12. Agent 初始化流程

### 阶段 A：定位范围

1. 确认当前仓库或模块根目录。
2. 查找 `.evospec/module.config.yaml`；不存在时从通用模板创建。
3. 读取 `SKILL.md`、本 `USAGE.md`、配置模板和规则索引。
4. 记录当前 Git 状态，避免覆盖用户修改。
5. 建立初始化清单，不立即执行构建、部署或 push。

### 阶段 B：扫描项目证据

按需检查：

- `README*`、`docs/`、架构说明；
- `CMakeLists.txt`、Makefile、Ninja、Meson、Gradle、Cargo、package 脚本等构建入口；
- `build*.sh`、`build*.bat`、PowerShell、Python 构建脚本；
- CI 文件、Dockerfile、开发容器配置；
- 启动脚本、systemd service、init 脚本、任务注册代码；
- 日志头文件、宏定义和同类模块日志用法；
- 插件基类、工厂函数和注册文件；
- `.git/config`、remote、团队提交说明；
- 既有产物输出目录和部署脚本；
- `.gitignore` 中的构建产物模式。

只读取与配置有关的必要范围，不无目的遍历大型仓库。

### 阶段 C：给配置项分级

Agent 必须把待填写内容分成三类。

#### C1. 可直接填写

只有在仓库证据唯一、明确且低风险时直接填写，例如：

- 模块目录名和已声明的构建 target；
- 源码语言；
- 已存在的本地构建脚本及其参数；
- 构建文件模式；
- 已明确声明的产物输出路径；
- 仓库中明确存在的日志宏和 include；
- 明确的插件基类和注册入口；
- `.gitignore` 中明确的生成目录；
- 模板自带的 `.evospec/input`、`.evospec/output` 路径。

填写时应保留证据位置，供最终报告说明。

#### C2. 可以提出候选，但需用户确认

存在多个合理值或环境差异时，Agent 应展示候选并询问用户，例如：

- 多个构建 target 中哪个是当前模块目标；
- Debug、Release 或产品变体哪个是默认策略；
- 多个产物中哪些需要部署；
- 多个进程或服务哪个属于当前模块；
- 多个 remote 或分支中哪个是正式推送目标；
- 多种部署脚本中哪个是团队当前使用方式；
- 架构风格、模块职责或关联模块的概括。

未经确认，不得把候选当成确定事实用于真实操作。

#### C3. 必须由用户输入或明确确认

以下信息无法从仓库可靠确定时，Agent 必须询问用户：

- 远程编译服务器地址或 SSH Host 别名；
- 远程用户名、端口、远端源码目录和工具链初始化方式；
- 凭据来源或认证方式，但不得索要密码、Token 或私钥正文；
- 目标设备类型、设备序列号或连接选择规则；
- 板端安装目录、可写分区和权限要求；
- 需要停止、启动或重启的进程/服务，以及安全命令；
- 正式部署场景和验证成功标准；
- Git/Gerrit 正式 push 分支、review ref 或 push option；
- 团队任务系统、任务编号格式和 Commit 规范；
- 用户期望启用或禁用的高风险自动化能力；
- 仓库外部的内部文档、服务器或设备信息。

## 13. Agent 的提问规则

### 13.1 什么时候提问

Agent 完成首轮代码扫描后再提问，避免询问可以从仓库确定的信息。

### 13.2 如何提问

- 将相关问题集中成一组；
- 每个问题注明为什么需要；
- 已发现候选时给出候选和证据；
- 允许用户回答“暂不配置”；
- 不询问秘密值，只询问凭据来源；
- 不使用模糊问题，如“还有别的吗”；
- 不重复询问用户已回答的内容。

推荐格式：

```text
以下字段无法从当前仓库可靠确定，请确认：

1. 默认构建方式
   - 发现候选：local_build.sh、CI remote-build
   - 请选择：local / remote / 两者都保留

2. 远程构建连接
   - 需要：SSH Host 别名、远端工作目录、工具链初始化命令
   - 不需要提供密码或私钥；可回答“暂不配置远程构建”

3. 部署目标
   - 需要：传输方式、目标路径、进程名、停止/恢复方式
   - 不确定时将保持 deploy.enabled: false

4. 正式推送目标
   - 当前只检测到 remote origin，无法确认正式 branch/ref
   - 请提供目标分支或回答“仅配置本地 commit”
```

### 13.3 用户暂时无法提供时

Agent 应：

- 保留空值或 `REQUIRED`；
- 将对应 strategy 或功能设为 `enabled: false`；
- 在最终报告中列出阻塞项；
- 继续完成不依赖该信息的配置；
- 不用模板示例或其他项目值代替。

## 14. Agent 修改文件的规则

### 14.1 优先修改

1. `.evospec/module.config.yaml`
2. `.evospec/rules/INDEX.md` 和已有规则文件的开关或项目约束
3. `.gitignore`，仅在用户允许且确有生成物遗漏时
4. `README.md`，仅补充当前模块如何调用 Skill 或链接本说明

### 14.2 谨慎修改

- `SKILL.md`：只允许补充“初始化时读取 USAGE.md”等通用入口，不因项目参数改路由。
- `.evospec/scripts/`：只修改通用解析能力，不写入项目常量。

### 14.3 默认不得修改

- `references/` 的文件集合、文件名和路由职责；
- 与当前初始化无关的业务代码；
- 用户已有的未提交改动；
- 凭据文件和个人环境配置。

## 15. 字段填写策略

### 15.1 `REQUIRED`、空值和 `enabled`

- `REQUIRED`：该功能使用前必须解决的阻塞配置；
- 空字符串或空数组：该项可选、暂未知或当前不适用；
- `enabled: false`：即使其他字段存在，也不得执行该能力；
- `enabled: true`：仅在必要字段完整、命令来源可信且已验证时设置。

不要为了消除 `REQUIRED` 而填入猜测值。

### 15.2 命令配置

- 优先引用仓库已有脚本，而不是在 YAML 中复制长命令；
- 命令应从 `module.root` 可稳定执行；
- 路径含空格时正确引用；
- 区分 Windows `cmd`、PowerShell 和 POSIX shell；
- 远程命令应明确本地层与远端层的引号边界；
- 破坏性命令必须有前置检查；
- 命令中不得包含秘密值。

### 15.3 模板变量

配置命令可使用：

- `{module.root}`、`{module.id}`、`{module.name}`；
- `{artifact.id}`、`{artifact.local_path}`、`{artifact.target_path}`；
- `{task.id}`、`{task.summary}`；
- 部署进程变量 `{process}`；
- 配置明确支持的其他变量。

Agent 在 dry-run 中必须检查所有变量已解析，不能把带 `{...}` 的未解析命令直接执行。

## 16. Agent 验证协议

### 16.1 静态检查

Agent 至少检查：

1. YAML 语法正确，根节点为 mapping；
2. `schema_version` 与模板兼容；
3. 所有启用节不存在未解决的 `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG`；
4. `build.default_strategy` 指向已存在且启用的策略；
5. `artifacts[*].id` 唯一；
6. 每个部署场景引用存在的 artifact；
7. 所有相对路径从模块根目录解析；
8. Git 禁止路径覆盖主要构建输出；
9. 配置中没有明显密码、Token、私钥或 Cookie；
10. `references/` 仍为原有 11 个 Markdown 文件。

### 16.2 安全 dry-run

在用户未要求真实执行时：

- 可以解析和展示构建命令，但不执行远程构建；
- 可以运行无副作用的版本、路径和连接检查；
- 部署仅运行：

```bat
.evospec\scripts\push_to_board.bat --list
.evospec\scripts\push_to_board.bat <scenario-id> --dry-run
```

- 不执行 remove、push、copy、stop、restart、reboot 等真实动作；
- 不执行 Git push。

若脚本依赖 PyYAML，应先检查依赖；缺少时报告安装命令，不宣称验证成功。

### 16.3 可执行性检查

只有用户明确要求并授权后，才执行实际构建、部署或 push。执行前仍需：

- 展示所选策略或场景；
- 确认工作区状态；
- 确认命令不含未解析字段；
- 确认产物属于本次构建；
- 对破坏性动作说明影响范围；
- 保存实际输出和结论。

## 17. Agent 完成后的输出格式

初始化完成后，Agent 应给出以下报告：

```markdown
# model-skill 初始化结果

## 已修改文件
- `.evospec/module.config.yaml`
- ...

## 自动识别并写入
| 配置路径 | 值 | 证据 |
|---|---|---|

## 用户确认后写入
| 配置路径 | 值 | 用户确认内容 |
|---|---|---|

## 保持禁用或未解决
| 配置路径 | 原因 | 需要用户提供 |
|---|---|---|

## 验证结果
- YAML：通过/失败
- 构建配置：通过/未验证
- 部署列表：通过/未配置
- 部署 dry-run：通过/未执行
- Git push 目标：已确认/未确认
- references 文件集合：未变化

## 未执行的高风险操作
- 未执行真实部署
- 未执行 Git push
- ...

## 下一步
- 用户需要补充的最少信息
- 可以安全执行的下一条命令
```

报告必须区分：

- 从代码确定的事实；
- Agent 的推断；
- 用户确认的信息；
- 尚未解决的内容；
- 实际执行过的命令；
- 仅展示但未执行的命令。

## 18. Agent 自检清单

初始化结束前逐项确认：

- [ ] 已读取本 `USAGE.md`
- [ ] 已读取当前配置和规则索引
- [ ] 已检查工作区状态并保护用户改动
- [ ] 已从当前仓库收集证据，没有复用旧项目值
- [ ] 可确定字段已填写并有证据
- [ ] 不确定字段已询问用户或保持禁用
- [ ] 未索要或保存秘密值
- [ ] 未新增、删除、重命名 references 文件
- [ ] 未因项目差异修改路由表
- [ ] 所有启用配置无未解析占位符
- [ ] 已完成 YAML 和路径检查
- [ ] 部署仅 dry-run，除非用户明确授权真实执行
- [ ] 未执行 Git push，除非用户明确授权
- [ ] 已输出初始化结果和未解决项

---

# 附录 A：最小可用配置范围

如果用户暂时只需要需求分析和本地代码开发，最小配置可以只完成：

- `module`；
- `paths`；
- `work_item`；
- `architecture` 的基本描述；
- `development`；
- 本地 `build` 策略；
- `git.commit`。

同时可以保持：

```yaml
deploy:
  enabled: false
```

并在 Git push 目标未确认时不执行 push。

# 附录 B：配置决策原则

遇到不确定项时按以下顺序选择：

1. **能从当前仓库唯一证明**：填写。
2. **存在多个候选**：展示候选并询问用户。
3. **涉及外部环境或破坏性操作**：必须询问用户。
4. **用户暂时不能确认**：保持禁用并记录。
5. **模板示例看起来可用但无项目证据**：不得使用。
````````

### `.agent/skills/model-skill/agents/grader.md`

````````markdown
# Grader Agent

评估 model-skill 的测试输出是否符合通用工作流和当前项目配置。

## 评估顺序

1. 读取测试 assertions。
2. 读取 `.evospec/module.config.yaml`，确认期望值来自配置而非 grader 硬编码。
3. 检查实际输出是否分发到正确 reference、加载适用规则并正确渲染配置。
4. 对每条断言输出 passed / failed 和可定位 evidence。

## 核心维度

- 分发准确性
- 配置读取与占位符检查
- 阶段步骤完整性
- 规则执行正确性
- 命令、路径和格式未泄漏其他项目硬编码
- 失败结论与证据一致
````````

### `.agent/skills/model-skill/change_log.md`

````````markdown
# change_log — model-skill

## 2026-08-27 集成 Graph + Loop 多 Agent 框架

- Skill 统一放置到 `.agent/skills/model-skill/`，不再依赖单一 CLI 的原生目录。
- `.evospec/` 保持在项目根目录，与 `.agent/` 同级。
- Graph Router 控制宏观路线；model-skill reference 控制节点内项目流程；Verifier/Reviewer 仍负责独立验证。
- 保持原有 11 个 `references/*.md` 的文件名、数量和职责不变。

## 2026-08-04 通用模板初始化

- 保留 11 个稳定 reference 路由文件。
- 项目差异统一由 `.evospec/module.config.yaml` 和规则配置驱动。
- 提供配置驱动的部署脚本包装器。
- 模板输入与输出目录仅保留 `.gitkeep`。

## 2026-08-04 增加通用模板使用说明

- 新增 `USAGE.md`，分别提供人工迁移指南和 Agent 初始化协议。
- 明确配置项的自动识别、用户确认和必须询问分级。
- 明确服务器、目标设备、部署路径、进程和正式 push 目标不得猜测。
- 在 `SKILL.md` 与 `README.md` 中增加初始化入口，未修改 reference 路由文件集合。
````````

### `.agent/skills/model-skill/references/debug-commands.md`

````````markdown
# 调试命令

> 调试工具、日志标签、进程和配置文件均来自 `.evospec/module.config.yaml` → `debug`、`deploy`、`module`。

## 日志

- 实时日志：`<config: debug.log_command>`
- 清空日志：`<config: debug.clear_log_command>`
- 保存日志：`<config: debug.save_log_command_windows>`（按当前宿主系统选择）
- 过滤日志：从 `<config: debug.filter_commands>` 选择当前宿主系统模板，将 `{tags}` 替换为 `<config: debug.log_tags>` 拼接结果。

## 进程与服务

对 `<config: module.runtime_processes>` 或 `<config: deploy.processes>` 使用 `<config: debug.process_query_command_template>`；停止进程使用部署配置中的命令模板，不自行假设 `killall`、`pkill` 或 systemd 可用。

## 配置文件

若 `<config: debug.config_files>` 非空，先确认读取权限，再使用项目配置的传输/终端工具查看；为空时不构造路径。

## 常见定位顺序

1. 确认进程/服务是否存在。
2. 抓取未过滤的短窗口完整日志。
3. 用配置 TAG 缩小范围，并定位首个 ERROR/FATAL 或状态偏移。
4. 对照设计、代码分析和当前源码确认调用链。
5. 保存原始日志和复现时间，避免只保留筛选结果。
````````

### `.agent/skills/model-skill/references/env-setup.md`

````````markdown
# 环境配置

> 环境配置来源为 `.evospec/module.config.yaml` → `build`、`deploy`、`debug`、`git`。

## 初始化步骤

1. 确认宿主系统、所需工具和版本。
2. 对每个启用的 build strategy 检查其 shell、命令、远端连接与工具链初始化方式。
3. 检查部署 transport 可用性和目标设备连接。
4. 检查 Git remote、凭据和目标分支。
5. 不在仓库配置中保存密码、token 或私钥；只允许保存凭据来源或操作提示。

## 构建环境

展示 `<config: build.strategies>` 中启用策略的 description 和 manual_steps。自动命令执行失败时区分：网络、认证、工具缺失、工具链未初始化和源码错误。

## 部署环境

运行 `<config: deploy.preflight_commands>`；只做连接检查，不在环境配置阶段执行删除、覆盖或重启命令。

## 可移植性检查

迁移到其他项目后至少确认：

- `module.root` 与 paths 均相对模块根目录解析
- build 命令不含旧项目地址、用户、目标名或芯片名
- artifacts 与 deploy scenarios 一一对应
- debug TAG、进程名和配置文件路径已替换
- git push 模板与仓库托管方式一致
````````

### `.agent/skills/model-skill/references/project-info.md`

````````markdown
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
````````

### `.agent/skills/model-skill/references/us-board-deploy.md`

````````markdown
# 推板验证

> 部署传输方式、命令、进程、路径和验证标准全部来自 `.evospec/module.config.yaml` → `deploy` 与 `artifacts`。

## 前提条件

1. `<config: deploy.enabled>` 为 true。
2. 本次代码改动后已重新构建，对应产物存在且时间有效（R004）。
3. 目标设备连接正常，部署场景与改动范围匹配。
4. 命令中不存在 `REQUIRED`、`PLACEHOLDER` 或其他未解析标记。

## 场景选择

列出 `<config: deploy.scenarios>` 的 id 和 description：

- 用户已明确场景时直接使用。
- 未明确时根据改动文件和 artifact 描述选择最小充分场景，并说明判断依据。
- 无法可靠判断时只列出场景，不执行破坏性命令。

## 执行顺序

1. 执行 `<config: deploy.preflight_commands>`。
2. 执行 `<config: deploy.prepare_commands>`。
3. 对 `<config: deploy.processes>` 使用 `<config: deploy.stop_process_command_template>`。
4. 解析场景的 `artifact_id`，确认其 `local_path`。
5. 执行场景 `remove_commands` 和 `transfer_command`。
6. 执行 `<config: deploy.post_commands>`。
7. 执行 `<config: deploy.verification.commands>`，逐条核对 `success_criteria`。

命令模板中的 `{artifact.*}`、`{process}` 等变量必须先替换。任一步骤失败都应停止后续破坏性动作并保留输出。

## 可选脚本

Windows 可运行：

```bat
.evospec\scripts\push_to_board.bat --list
.evospec\scripts\push_to_board.bat <scenario-id> --dry-run
.evospec\scripts\push_to_board.bat <scenario-id>
```

脚本只负责读取配置并顺序执行，不保存项目参数。

## 验证结论

成功必须同时满足：命令退出正常、产物传输成功、目标进程/服务状态符合预期、关键日志无持续错误。失败则返回 `@references/us-bug-fix.md`；成功后可进入 `@references/us-git-submit.md`。
````````

### `.agent/skills/model-skill/references/us-bug-fix.md`

````````markdown
# Bug 修复

> 执行前读取 `.evospec/module.config.yaml` 中的 `paths`、`architecture`、`debug`、`development`，并加载 bug-fix 阶段启用规则。

## 适用场景

- 功能异常、错误日志、崩溃、卡死或性能退化
- 回调、消息、接口或界面未按预期工作
- 偶现问题、回归问题或环境相关问题

## 排查流程

### 0. 文档优先

1. 列出 `<config: paths.design_output>`，读取与现象相关的设计文档。
2. 列出 `<config: paths.code_analysis_output>`，按 `<config: code_analysis.preferred_documents>` 的关键词选择相关分析文档。
3. 输出初步定位：涉及模块、可疑路径、设计预期、已知证据和仍缺信息。

目录为空时可跳过，但不得把缺少文档解释为“没有设计”。

### 1. 固化现象

记录：触发步骤、期望结果、实际结果、发生频率、首个异常时间点、环境、版本、最近相关改动和原始日志。

### 2. 建立证据链

使用 `@references/debug-commands.md` 中由配置渲染的命令抓取日志；结合源码、调用链、配置值和版本差异逐步缩小范围。优先找到“第一个错误状态”，不要只修复最终表象。

### 3. 提出并验证根因假设

每个假设都应包含：支持证据、反证、验证方法和结论。修改前先确认根因能够解释全部主要现象。

### 4. 最小修复

只修改根因相关代码，并执行 R006、R007、R008 等启用规则。修复不得静默吞错、扩大副作用或用硬编码绕过配置。

### 5. 回归验证

至少验证：原问题、相邻正常路径、异常路径、重复执行、重启/重新初始化（适用时）以及性能/日志量（适用时）。构建与部署分别进入 `@references/us-build.md` 和 `@references/us-board-deploy.md`。

### 6. 生成修复记录

验证通过后，在 `<config: paths.bug_log_output>` 生成文件，命名遵循 `<config: work_item.filename_template>`。

```markdown
# Bug 修复记录

- 日期：YYYY-MM-DD
- <任务编号标签>：#XXXXXX
- 涉及模块：

## 问题现象
## 复现条件
## 根因与证据
## 修改点
| 文件 | 修改内容 |
|---|---|
## 验证结果
## 回归范围
## 风险与回滚
```

生成记录后进入 `@references/us-git-submit.md`。
````````

### `.agent/skills/model-skill/references/us-build.md`

````````markdown
# 编译构建

> 所有构建方式和命令来自 `.evospec/module.config.yaml` → `build`；禁止把项目命令写回本文件。

## 执行步骤

1. 确认 `<config: build.enabled>` 为 true。
2. 选择用户指定策略；未指定时使用 `<config: build.default_strategy>`。
3. 读取对应 `<config: build.strategies.<id>>`，检查 `enabled` 和未解析占位符。
4. 记录当前 commit、工作区状态和构建开始时间。
5. 执行 `command` 或按顺序执行 `commands`。
6. 检查退出码、首个错误和 `<config: artifacts>` 中对应产物的存在性与更新时间。

## 失败处理

- 先保留完整输出，再定位第一个有效错误。
- 匹配 `<config: build.common_errors>` 时执行对应 action。
- 自动方式因网络、凭据或外部环境失败时，可展示 `<config: build.strategies.<id>.manual_steps>`，但不得宣称构建成功。
- 清理构建只能使用 `<config: build.clean_command>` 或项目现有可靠命令，不自行猜测。

## 构建结论格式

```text
构建策略：<id>
执行命令：<已脱敏命令>
结果：成功 / 失败 / 未执行
产物：<artifact id、路径、时间>
关键日志：<首个错误或成功摘要>
```

成功后进入 `@references/us-board-deploy.md`；仅需本地验证时可在此结束。
````````

### `.agent/skills/model-skill/references/us-code-analysis.md`

````````markdown
# 代码架构分析

> 分析结果存放于 `<config: paths.code_analysis_output>`；文档选择提示来自 `<config: code_analysis>`，但最终由仓库内容决定。

## 原则

- 先复用已有分析文档，再按需读取源码验证。
- 分析结论必须引用文件、符号或配置证据。
- 不把过时文档当成源码事实；发现偏差时标记并更新。

## 使用方式

### 排障时

1. 列出分析目录。
2. 根据现象与 `<config: code_analysis.preferred_documents>` 的 keywords 选择文档。
3. 定位到模块、文件和符号后，再读取最小必要源码范围。

### 主动分析时

1. 明确分析问题：模块职责、初始化、调用链、消息流、状态机、错误处理或资源生命周期。
2. 从入口、核心数据结构和外部边界开始，建立可验证的流程。
3. 输出 Mermaid 图或表格时同时列出源文件和关键符号。
4. 写入分析目录并更新“最后分析时间”和“源码版本/commit”。

## 推荐文档结构

```markdown
# <主题> 分析

- 最后分析时间：YYYY-MM-DD
- 源码版本：<commit>
- 源文件：`path:line`、`symbol`

## 范围与结论
## 关键模块
## 调用/数据流
## 异常与边界
## 配置依赖
## 已知不确定项
```

新增分析文档允许按主题创建，但不应改变 `references/` 的路由文件集合。
````````

### `.agent/skills/model-skill/references/us-feature-dev.md`

````````markdown
# 功能开发

> 执行前读取 `.evospec/module.config.yaml` 中的 `architecture`、`development`、`build`、`paths`，并加载 feature-dev 阶段启用的规则。

## 适用场景

- 新增功能、模块、接口、消息或配置项
- 扩展现有业务流程或界面行为
- 实现已评审的设计方案

## 开发流程

### 1. 对齐设计与仓库现状

1. 读取 `<config: paths.design_output>` 中对应设计文档。
2. 读取相关代码分析文档和直接依赖文件。
3. 按 `<config: architecture.flow>` 确认数据从输入到输出的完整路径；配置为空时，以源码和项目架构文档为准。
4. 查找同类实现，复用现有命名、错误处理、日志、测试和构建方式，避免另起一套模式。

### 2. 制定最小改动清单

列出计划修改的文件、接口、配置、测试和文档。不要提前修改无关代码；发现设计与代码不一致时先记录差异，再选择兼容方案。

### 3. 实现功能

通用顺序：

1. 定义输入、输出和数据结构。
2. 实现核心业务逻辑与异常分支。
3. 接入外部接口、消息、界面或持久化层。
4. 更新构建文件（匹配 `<config: development.build_file_patterns>`）。
5. 补充测试、日志和必要文档。

具体框架、基类、日志宏、注释语言和高频调用约束均从 `development` 配置及规则读取，不在本文件硬编码。

### 4. 规则检查点

- **扩展/插件约束**：执行 R003；仅当 `<config: development.extension_contract.enabled>` 为 true 时强制。
- **日志约束**：执行 R006；使用 `<config: development.logging.macros>`，高频路径按配置限频。
- **注释约束**：执行 R007；按 `<config: development.comments>`，不默认要求所有项目逐行注释。
- **高频调用约束**：执行 R008；对配置中的函数提示词和调用模式做变化检测或事件驱动优化。

### 5. 自检

- [ ] 实现覆盖设计与验收标准
- [ ] 错误路径、边界值和资源释放完整
- [ ] 未引入项目外硬编码路径、地址、分支或进程名
- [ ] 新文件已加入构建
- [ ] 规则检查通过
- [ ] 变更范围与计划一致

完成后进入 `@references/us-build.md`。
````````

### `.agent/skills/model-skill/references/us-git-submit.md`

````````markdown
# Git 提交管理

> Commit、push、分支和禁止提交项来自 `.evospec/module.config.yaml` → `git`、`work_item`、`paths`。

## 提交前检查

1. 查看 `git status`、`git diff` 和必要的测试/验证结果。
2. 只暂存本次任务相关文件，优先 `git add <具体路径>`。
3. 对照 `<config: git.forbidden_paths>` 和 R005 检查暂存区。
4. Bug 修复场景确认 `<config: paths.bug_log_output>` 已生成记录（R002）。
5. 不修改或覆盖用户无关改动。

## Commit Message

使用 `<config: git.commit.template>`，将 `{task.id}` 与 `{task.summary}` 替换为真实值，并遵守语言与长度配置。任务编号缺失时不得编造。

示例仅展示模板变量，不代表固定项目格式：

```text
<rendered git.commit.template>
```

## 提交与推送

```bash
git status
git diff --cached
git commit -m "<rendered commit message>"
```

推送命令由 `<config: git.push.command_template>` 渲染，变量来自同一配置节。执行前确认当前分支、remote 和目标分支；网络或权限失败时保留 commit，并给出相同的已渲染命令供用户在正确环境执行。

## 生成提交记录

push 成功后，在 `<config: paths.push_log_output>` 生成文件，命名遵循 `<config: work_item.filename_template>`。

```markdown
# 提交记录

- 日期：YYYY-MM-DD
- <任务编号标签>：#XXXXXX
- 分支：
- Commit：

## Commit Message
## 提交文件列表
| 文件 | 改动说明 |
|---|---|
## 构建与验证结论
## 推送目标
```
````````

### `.agent/skills/model-skill/references/us-requirements.md`

````````markdown
# 需求分析

> 执行前读取 `.evospec/module.config.yaml` 中的 `module`、`paths`、`work_item`、`architecture` 和 `development`。

## 适用场景

- 收到新需求、PRD 或变更说明
- 评估影响范围、接口或配置变化
- 输出可实施、可验证的设计方案

## 分析步骤

### 1. 读取输入与现状

1. 从 `<config: paths.requirement_input>` 读取与任务最相关的最新需求材料。
2. 读取 `<config: paths.architecture_sources>` 和现有代码分析文档。
3. 从用户描述或任务系统中获取 `<config: work_item.id_label>`；缺失时使用可见占位符，不虚构编号。

### 2. 建立需求基线

明确：目标、范围、非目标、验收标准、异常路径、兼容性和待确认项。区分“需求事实”“现有实现”“分析假设”。

### 3. 评估影响范围

按照 `<config: architecture.layers>` 和仓库实际结构检查：

- 需要新增或修改哪些模块、接口、消息、配置和数据结构？
- 是否影响 `<config: architecture.related_modules>`？
- 是否影响构建、部署、日志、测试或回滚？
- 是否存在版本兼容、性能、安全或资源约束？

### 4. 输出设计方案

在 `<config: paths.design_output>` 生成文档，文件名遵循 `<config: work_item.filename_template>`。

```markdown
# 设计方案

- 日期：YYYY-MM-DD
- <任务编号标签>：#XXXXXX
- 需求摘要：
- 需求来源：

## 目标与非目标

## 现状与约束

## 影响范围

| 模块/层级 | 文件或接口 | 改动类型 | 影响说明 |
|---|---|---|---|

## 设计方案

### 数据与控制流
### 接口/消息变更
### 配置变更
### 异常与降级

## 验证方案

## 风险与待确认项

## 预估工作量
```

### 5. 进入开发前检查

设计必须能够映射到文件、接口和验收步骤；未确认项不可伪装成确定结论。完成后进入 `@references/us-feature-dev.md`。
````````

### `.agent/skills/model-skill/references/us-rules.md`

````````markdown
# 规则管理

规则位于 `.evospec/rules/`，每条规则独立启用或禁用。项目参数由 `.evospec/module.config.yaml` 提供，规则文件只描述通用约束和读取方式。

## 查看规则

读取 `.evospec/rules/INDEX.md`，按阶段、状态和文件展示规则；随后核对规则 frontmatter 与索引是否一致。

## 启用 / 禁用

1. 修改规则文件 frontmatter 的 `status`。
2. 同步更新 `INDEX.md`。
3. 若规则依赖配置开关，同时检查对应配置路径是否完整。

## 新增规则

规则文件命名：`R<NNN>-<kebab-name>.md`，包含：id、status、name、applies-to、规则内容、检查时机、违规处理和配置依赖。

## 删除规则

删除规则文件并从索引移除；执行前检查其他文档是否引用该规则。

## 执行机制

阶段开始时筛选 `enabled` 且 applies-to 匹配的规则。规则引用的配置为空或关闭时，按规则定义选择跳过、降级或阻止；不得用旧项目值补全。
````````

### `.agent/skills/registry.yaml`

````````yaml
# Skill 新增与注册说明见 docs/ADDING_SKILLS.md
# 路径约定：entry/usage/readme/grader/project_config/rules_index/references_root 相对项目根目录；
# graph_bindings/auxiliary_routes 中的 reference 相对对应 Skill 根目录。

version: 1

default_skill: model-skill

skills:
  model-skill:
    entry: .agent/skills/model-skill/SKILL.md
    usage: .agent/skills/model-skill/USAGE.md
    readme: .agent/skills/model-skill/README.md
    grader: .agent/skills/model-skill/agents/grader.md
    project_config: .evospec/module.config.yaml
    rules_index: .evospec/rules/INDEX.md
    references_root: .agent/skills/model-skill/references

    graph_bindings:
      requirement:
        - references/us-requirements.md
      development:
        - references/us-feature-dev.md
        - references/us-build.md
      bugfix:
        - references/us-bug-fix.md
        - references/debug-commands.md
        - references/us-build.md
      compile-debug:
        - references/us-build.md
        - references/env-setup.md
      qa:
        - references/project-info.md
      docs:
        - references/us-code-analysis.md

    auxiliary_routes:
      build: references/us-build.md
      board-deploy: references/us-board-deploy.md
      git-submit: references/us-git-submit.md
      debug-commands: references/debug-commands.md
      project-info: references/project-info.md
      env-setup: references/env-setup.md
      code-analysis: references/us-code-analysis.md
      rules: references/us-rules.md

precedence:
  - Graph Router selects the macro task route and permissions.
  - Graph nodes and loops control iteration, verification, review, and refresh behavior.
  - The selected skill reference defines the stage-specific project workflow.
  - .evospec/module.config.yaml supplies project-specific values.
  - .evospec/rules supplies enabled project constraints.
  - Deterministic verifier evidence overrides worker self-report.

loading_policy:
  progressive_reading: true
  load_only_selected_references: true
  require_config_before_execution: true
  require_rules_index_before_mutating_actions: true
  unresolved_markers_block_execution: true
````````

### `.agent/state-template.json`

````````json
{
  "run_id": "",
  "created_at": "",
  "updated_at": "",
  "task": {
    "goal": "",
    "user_request": "",
    "constraints": [],
    "assumptions": [],
    "definition_of_done": []
  },
  "routing": {
    "selected_graph": "",
    "selection_reason": "",
    "current_node": "",
    "next_node": "",
    "status": "ACTIVE"
  },
  "skill": {
    "selected_skill": "",
    "selected_skill_route": "",
    "entry": "",
    "references": [],
    "project_config": ".evospec/module.config.yaml",
    "rules_index": ".evospec/rules/INDEX.md",
    "loaded_rules": [],
    "unresolved_fields": [],
    "preflight_status": "NOT_RUN"
  },
  "loop": {
    "type": "",
    "iteration": 0,
    "max_iterations": 0,
    "stop_condition": "",
    "last_action": "",
    "last_verification": "",
    "last_error_signature": "",
    "same_error_count": 0,
    "no_progress_count": 0
  },
  "context": {
    "files_inspected": [],
    "symbols": [],
    "requirements": [],
    "unknowns": []
  },
  "plan": {
    "status": "NOT_STARTED",
    "tasks": [],
    "risks": [],
    "rollback": ""
  },
  "implementation": {
    "changed_files": [],
    "completed_tasks": [],
    "remaining_tasks": []
  },
  "verification": {
    "build": {
      "status": "NOT_RUN",
      "command": "",
      "exit_code": null,
      "evidence": ""
    },
    "test": {
      "status": "NOT_RUN",
      "command": "",
      "exit_code": null,
      "evidence": ""
    },
    "lint": {
      "status": "NOT_RUN",
      "command": "",
      "exit_code": null,
      "evidence": ""
    },
    "reproduction": {
      "status": "NOT_RUN",
      "evidence": ""
    }
  },
  "review": {
    "reviewer_id": "",
    "attempt": 0,
    "verdict": "NOT_RUN",
    "blocking_findings": [],
    "non_blocking_findings": [],
    "risks": []
  },
  "refresh_history": [],
  "final": {
    "status": "NOT_DONE",
    "summary": "",
    "remaining_risks": [],
    "blockers": []
  }
}
````````

### `.agent/verdict-schema.yaml`

````````yaml
version: 2

allowed_verdicts:
  PASS:
    meaning: 所有强制门禁通过，无 blocking finding。
    route: next_or_done

  PASS_WITH_RISK:
    meaning: 核心目标达到，但有未验证环境、非阻断风险或无法运行的检查。
    route: coordinator_accept_or_user_decision

  FAIL_LOCAL:
    meaning: 方向正确，存在局部可修复问题。
    route: same_agent_fix_within_budget

  FAIL_STRUCTURAL:
    meaning: 需求理解、架构、状态机、接口或整体方案错误。
    route: return_to_plan_and_refresh_implementer

  NEED_USER_DECISION:
    meaning: 存在无法从项目证据解决的产品、需求、风险或兼容性选择。
    route: ask_one_blocking_question

  BLOCKED_ENVIRONMENT:
    meaning: 缺少工具链、硬件、权限、服务、密钥或外部依赖。
    route: report_blocker_and_recovery_steps

required_fields:
  - verdict
  - summary
  - evidence
  - blocking_findings
  - non_blocking_findings
  - residual_risks
  - recommended_route

finding_fields:
  - severity
  - file
  - symbol
  - issue
  - evidence
  - violated_requirement
  - suggested_direction

rules:
  - build_or_required_test_failure_cannot_be_PASS
  - worker_self_report_is_not_independent_evidence
  - no_blocking_finding_for_PASS
  - unavailable_required_verification_must_be_risk_or_blocked
  - unresolved_required_config_cannot_be_PASS_for_affected_stage
  - high_impact_action_without_explicit_authorization_cannot_execute
````````

### `.claude/agents/coordinator.md`

````````markdown
---
name: coordinator
description: Coordinates the project Graph + Loop protocol, delegates to specialized agents, maintains run state, and routes verification and review verdicts.
tools: Agent(explorer, implementer, debugger, verifier, reviewer, second-reviewer), Read, Grep, Glob, Bash, Write, Edit
model: inherit
maxTurns: 60
---

Read `AGENTS.md`, the selected Graph, `.agent/skills/registry.yaml`, and the selected Skill/config/rules before acting.
Own graph selection, Skill route selection, run-state updates, bounded delegation, evidence aggregation, and verdict routing.
Do not hide missing verification and do not let an implementer approve its own work.
Use a fresh reviewer and apply `.agent/refresh-policy.yaml` when progress stalls.
````````

### `.claude/agents/debugger.md`

````````markdown
---
name: debugger
description: Diagnoses runtime, compile, link, test, and CI failures from root cause before making minimal fixes.
tools: Read, Grep, Glob, Edit, Write, Bash
model: inherit
maxTurns: 35
---

Classify the failure, load only relevant `.evospec` build/debug configuration, normalize its signature, form a falsifiable hypothesis, gather evidence, and fix the smallest root cause.
Never bypass failures by disabling behavior or weakening tests.
Report repeated signatures and no-progress conditions to the Coordinator.
````````

### `.claude/agents/explorer.md`

````````markdown
---
name: explorer
description: Read-only explorer for code, requirements, symbols, build files, tests, call paths, and impact analysis.
tools: Read, Grep, Glob
model: inherit
permissionMode: plan
maxTurns: 20
---

Remain read-only. Return concise evidence with file paths, symbols, and relevant `.evospec` configuration sources. Map requirements and call paths, identify unknowns, and avoid implementation or broad refactoring suggestions unless requested by the Coordinator.
````````

### `.claude/agents/implementer.md`

````````markdown
---
name: implementer
description: Implements one bounded approved plan task at a time and performs targeted local verification.
tools: Read, Grep, Glob, Edit, Write, Bash
model: inherit
maxTurns: 35
---

Follow the assigned task contract, `.agent/loops/implementation-loop.md`, selected Skill reference, and enabled `.evospec` rules.
Make minimal changes, preserve interfaces and style, and avoid unrelated refactors.
Do not self-approve. Report plan conflicts instead of silently expanding scope.
````````

### `.claude/agents/reviewer.md`

````````markdown
---
name: reviewer
description: Fresh read-only reviewer for requirement coverage, correctness, regressions, embedded risks, and missing tests.
tools: Read, Grep, Glob, Bash
model: inherit
permissionMode: plan
maxTurns: 25
---

Review independently using the task contract, selected Skill reference, enabled `.evospec` rules, diff, verifier evidence, and necessary source.
Return exactly one allowed verdict from `.agent/verdict-schema.yaml` with concrete file/symbol evidence.
Do not edit files. Do not make style-only blocking findings.
````````

### `.claude/agents/second-reviewer.md`

````````markdown
---
name: second-reviewer
description: Tie-break fresh reviewer for structural failures, conflicting evidence, or high-risk decisions.
tools: Read, Grep, Glob, Bash
model: inherit
permissionMode: plan
maxTurns: 25
---

Start from first principles. Focus on disputed findings and compare them with explicit requirements and deterministic evidence.
Do not assume the first reviewer or implementer is correct. Do not edit files.
````````

### `.claude/agents/verifier.md`

````````markdown
---
name: verifier
description: Runs deterministic build, test, lint, and reproduction checks independently without editing source files.
tools: Read, Grep, Glob, Bash
model: inherit
permissionMode: default
maxTurns: 20
---

Do not edit source, tests, requirements, or configuration. Normal build/test artifacts are allowed.
Record exact commands or dry-run renderings, exit codes, scope, and decisive evidence.
A failed required check cannot be reported as PASS.
````````

### `.claude/settings.json`

````````json
{
  "hooks": {
    "SessionStart": [
      {
        "matcher": "compact",
        "hooks": [
          {
            "type": "command",
            "command": "printf '%s\\n' 'After compaction, re-read AGENTS.md, .agent/protocol.md, the selected graph, Skill registry/reference, relevant .evospec config/rules, and the active run state before continuing.'"
          }
        ]
      }
    ]
  }
}
````````

### `.claude/settings.stop-gate.example.json`

````````json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "prompt",
            "prompt": "Check the active task against AGENTS.md, .agent/project.yaml, the selected graph, selected Skill route, .evospec preflight status, and the run state's definition_of_done. If required configuration, authorization, build/test/review evidence is missing, return {\"ok\": false, \"reason\": \"State exactly what verification or review remains.\"}. If no complex task is active or the conditions are satisfied, return {\"ok\": true}. If completion is impossible because of an external environment blocker, return {\"ok\": false, \"impossible\": true, \"reason\": \"State the blocker and required recovery step.\"}."
          }
        ]
      }
    ]
  }
}
````````

### `.claude/skills/graph-loop-runner/SKILL.md`

````````markdown
---
name: graph-loop-runner
description: Runs complex project tasks through the repository's Graph Router, project Skill registry, .evospec configuration/rules, node loops, verifier, independent reviewer, and fresh-agent policy.
argument-hint: "<task description>"
---

Use this skill for non-trivial requirement analysis, feature development, bug fixing, compile/test debugging, refactoring, review, or registered project-Skill auxiliary workflows.

1. Read `AGENTS.md`, `.agent/project.yaml`, `.agent/router.yaml`, and `.agent/protocol.md`.
2. Classify `$ARGUMENTS` and select exactly one parent Graph.
3. Read `.agent/skills/registry.yaml`; select the Graph binding or auxiliary route from the registered Skill; do not assume every route belongs to model-skill.
4. Load only the selected reference, the selected Skill's registry-declared project configuration, and enabled stage rules.
5. Run Skill preflight; unresolved configuration blocks execution or limits it to safe dry-run.
6. Create or load a run state under `.agent/runs/`, including the `skill` section.
7. Execute the graph node by node; each node uses the referenced loop.
8. Delegate noisy or specialized work to project subagents.
9. Keep Verifier and Reviewer separate from Implementer.
10. Apply `.agent/refresh-policy.yaml` when retry/no-progress/structural conditions are met.
11. Require explicit user authorization for deploy, push, target removal, process stop, or remote overwrite.
12. Finish with `.agent/nodes/report.md` format.
````````

### `.codex/agents/coordinator.toml`

````````toml
name = "coordinator"
description = "Coordinates the project Graph + Loop protocol, maintains run state, delegates bounded work, and routes verifier/reviewer verdicts."
developer_instructions = """
Read AGENTS.md, the selected .agent graph, .agent/skills/registry.yaml, and the selected skill/config/rules before acting.
Own task classification, graph selection, skill route selection, state updates, delegation, evidence aggregation, and routing.
Keep noisy exploration and logs in subagents.
Do not treat worker self-reports as proof.
Use fresh reviewer contexts and refresh agents according to .agent/refresh-policy.yaml.
Do not make high-impact product or compatibility decisions without evidence or user approval.
"""
````````

### `.codex/agents/debugger.toml`

````````toml
name = "debugger"
description = "Root-cause-focused debugger for runtime bugs, compile failures, test failures, and CI evidence."
sandbox_mode = "workspace-write"
developer_instructions = """
Classify the failure before editing and load only the relevant build/debug configuration from .evospec.
Form one falsifiable root-cause hypothesis, gather evidence, and make the smallest root-cause fix.
Never bypass failures by deleting behavior, commenting out calls, skipping tests, or weakening expectations.
Track normalized error signatures and report when refresh criteria are met.
"""
````````

### `.codex/agents/explorer.toml`

````````toml
name = "explorer"
description = "Read-only codebase and requirement explorer for mapping files, symbols, call paths, build configuration, tests, and impact."
sandbox_mode = "read-only"
developer_instructions = """
Stay read-only.
Search narrowly and return evidence with file paths, symbols, and relevant .evospec configuration sources.
Map requirements to modules, interfaces, state, tasks, interrupts, configuration, diagnostics, build targets, and tests.
Return concise summaries instead of raw logs.
Do not implement fixes or broaden the task.
"""
````````

### `.codex/agents/implementer.toml`

````````toml
name = "implementer"
description = "Implementation worker for one approved plan task at a time, with minimal targeted changes and local verification."
sandbox_mode = "workspace-write"
developer_instructions = """
Read the assigned task contract, relevant graph/loop files, selected skill reference, and enabled .evospec rules.
Implement one bounded plan task at a time only after skill preflight allows the action.
Keep unrelated files untouched and preserve existing style and interfaces.
Run the smallest useful verification, but do not approve your own work.
If the plan conflicts with repository reality, stop and report the conflict to the coordinator.
"""
````````

### `.codex/agents/reviewer.toml`

````````toml
name = "reviewer"
description = "Fresh read-only owner-level reviewer for requirement coverage, correctness, embedded risks, regressions, and missing tests."
sandbox_mode = "read-only"
developer_instructions = """
Review independently from the implementer.
Use the task contract, selected skill reference, enabled .evospec rules, diff, deterministic verification evidence, and necessary source files.
Prioritize real blocking issues: requirement gaps, correctness, state transitions, error paths, concurrency/interrupt safety, memory/resources, API compatibility, and missing tests.
Return only an allowed verdict from .agent/verdict-schema.yaml with concrete file/symbol evidence.
Do not edit files and do not issue style-only blocking findings.
"""
````````

### `.codex/agents/second-reviewer.toml`

````````toml
name = "second_reviewer"
description = "Independent tie-break reviewer used only for structural failures, conflicting evidence, or high-risk decisions."
sandbox_mode = "read-only"
developer_instructions = """
Approach the task from first principles and do not assume the first review or implementation direction is correct.
Focus on the disputed findings and compare them against deterministic evidence and explicit requirements.
Return PASS, PASS_WITH_RISK, FAIL_LOCAL, FAIL_STRUCTURAL, NEED_USER_DECISION, or BLOCKED_ENVIRONMENT.
Do not edit files.
"""
````````

### `.codex/agents/verifier.toml`

````````toml
name = "verifier"
description = "Independent deterministic verifier that runs build, tests, lint, and reproduction commands without editing source files."
sandbox_mode = "workspace-write"
developer_instructions = """
Do not edit source, tests, requirements, or configuration.
You may create normal build/test artifacts and logs.
Run the exact verification or dry-run commands from the graph/config, record exit codes and scope, and summarize decisive evidence.
A passing build does not prove requirement coverage; a failing required check cannot be reported as PASS.
"""
````````

### `.codex/config.toml`

````````toml
[agents]
enabled = true
max_concurrent_threads_per_session = 6
interrupt_message = true
````````

### `.evospec/input/prd/.gitkeep`

````````text

````````

### `.evospec/module.config.yaml`

````````yaml
schema_version: 2

module:
  id: REQUIRED
  name: REQUIRED
  description: ""
  root: .
  platform: REQUIRED
  framework: ""
  runtime_processes: []

paths:
  architecture_sources: []
  requirement_input: .evospec/input/prd
  design_output: .evospec/output/design
  bug_log_output: .evospec/output/bug-log
  push_log_output: .evospec/output/push-log
  code_analysis_output: .evospec/output/code-analysis

work_item:
  system: REQUIRED
  id_label: Task ID
  id_pattern: "^.+$"
  filename_template: "{date}-{task.id}-{summary}.md"

architecture:
  style: REQUIRED
  flow: []
  layers: []
  related_modules: []

build:
  enabled: true
  default_strategy: local
  strategies:
    local:
      enabled: true
      host_shell: REQUIRED
      description: REQUIRED
      commands: [REQUIRED]
  clean_command: ""
  common_errors: []

artifacts: []

deploy:
  enabled: false
  transport: REQUIRED
  host_shell: REQUIRED
  preflight_commands: []
  prepare_commands: []
  stop_process_command_template: ""
  processes: []
  scenarios: {}
  post_commands: []
  verification:
    commands: []
    success_criteria: []

debug:
  log_command: REQUIRED
  clear_log_command: ""
  save_log_command_windows: ""
  filter_commands: {}
  log_tags: []
  process_query_command_template: ""
  config_files: []

git:
  enabled: true
  commit:
    template: "{task.id}: {task.summary}"
    summary_language: zh-CN
    max_summary_length: 72
  push:
    provider: REQUIRED
    remote: origin
    target_branch: REQUIRED
    command_template: "git push {remote} HEAD:{target_branch}"
  branch_patterns: []
  forbidden_paths: [build/, dist/, out/, "*.o", "*.so", "*.bin"]

development:
  languages: []
  build_file_patterns: []
  logging:
    enabled: false
    include: ""
    namespace: ""
    macros: {}
    fixed_tag: ""
    required_points: []
    high_frequency_policy: change_or_rate_limited
  comments:
    enabled: true
    language: zh-CN
    mode: meaningful_blocks
  high_frequency_calls:
    enabled: false
    function_hints: [poll, refresh, tick, loop]
    call_patterns: []
    cache_prefix: last_
  extension_contract:
    enabled: false
    base_type: ""
    factory_functions: []
    registration_file: ""
    registration_key: ""

code_analysis:
  index_mode: discover
  preferred_documents: []

templating:
  unresolved_markers: [REQUIRED, PLACEHOLDER, TODO_CONFIG]
````````

### `.evospec/output/bug-log/.gitkeep`

````````text

````````

### `.evospec/output/code-analysis/.gitkeep`

````````text

````````

### `.evospec/output/design/.gitkeep`

````````text

````````

### `.evospec/output/push-log/.gitkeep`

````````text

````````

### `.evospec/rules/INDEX.md`

````````markdown
# 规则索引

| ID | 规则名 | 适用阶段 | 状态 | 文件 |
|----|--------|----------|------|------|
| R001 | commit-format | git-submit | ✅ enabled | R001-commit-format.md |
| R002 | log-required | bug-fix, git-submit | ✅ enabled | R002-log-required.md |
| R003 | plugin-base | feature-dev | ✅ enabled | R003-plugin-base.md |
| R004 | build-before-deploy | board-deploy | ✅ enabled | R004-build-before-deploy.md |
| R005 | no-build-artifacts | git-submit | ✅ enabled | R005-no-build-artifacts.md |
| R006 | log-in-generated-code | feature-dev, bug-fix | ✅ enabled | R006-log-in-generated-code.md |
| R007 | chinese-comments | feature-dev, bug-fix | ✅ enabled | R007-chinese-comments.md |
| R008 | no-redundant-ui-call | feature-dev, bug-fix | ✅ enabled | R008-no-redundant-ui-call.md |

> 状态以规则文件 frontmatter 为准；修改状态时同步更新本表。规则中的项目差异必须引用 `.evospec/module.config.yaml`，不得硬编码。
````````

### `.evospec/rules/R001-commit-format.md`

````````markdown
---
id: R001
status: enabled
name: commit-format
applies-to: git-submit
---

# R001 · Commit Message 格式规范

## 配置依赖

- `git.commit.template`
- `git.commit.summary_language`
- `git.commit.max_summary_length`
- `work_item.id_pattern`

## 规则内容

Commit message 必须由配置模板渲染；所有变量必须有真实来源。任务编号缺失或格式不匹配时阻止提交，不得使用历史编号或示例值代替。

## 检查时机

执行 `git commit` 前。

## 违规处理

展示未满足的配置路径或变量，并保留已暂存内容，不执行 commit。
````````

### `.evospec/rules/R002-log-required.md`

````````markdown
---
id: R002
status: enabled
name: log-required
applies-to: bug-fix, git-submit
---

# R002 · 操作记录必须生成

## 配置依赖

- `paths.bug_log_output`
- `paths.push_log_output`
- `work_item.filename_template`

## 规则内容

- Bug 修复完成并验证通过后，提交前生成修复记录。
- push 成功后生成提交记录。
- 记录必须包含任务编号、修改文件、验证证据和实际结果；不能只写“已修复”。

## 违规处理

缺少记录时阻止进入下一阶段，并按对应 reference 的模板生成。
````````

### `.evospec/rules/R003-plugin-base.md`

````````markdown
---
id: R003
status: enabled
name: plugin-base
applies-to: feature-dev
---

# R003 · 扩展/插件契约

## 配置依赖

`development.extension_contract`

## 规则内容

当 `enabled: true` 时，新增扩展必须满足配置中的 `base_type`、`factory_functions`、`registration_file` 和 `registration_key`。当 `enabled: false` 时，本规则跳过，不假设项目采用插件架构。

## 检查时机

创建新插件、驱动适配器、策略实现或同类扩展点时。

## 违规处理

指出缺少的契约项，并优先参考仓库中的同类实现；不生成项目不存在的基类或注册文件。
````````

### `.evospec/rules/R004-build-before-deploy.md`

````````markdown
---
id: R004
status: enabled
name: build-before-deploy
applies-to: board-deploy
---

# R004 · 部署前必须完成本次构建

## 规则内容

部署前必须有证据表明所选 artifact 是本次代码变更后的构建结果，包括成功退出状态、产物存在和更新时间合理。仅口头假设或旧产物不满足条件。

## 检查时机

执行部署配置中的 prepare/remove/transfer 命令前。

## 违规处理

停止部署，引导执行 `@references/us-build.md`；不删除目标端旧文件。
````````

### `.evospec/rules/R005-no-build-artifacts.md`

````````markdown
---
id: R005
status: enabled
name: no-build-artifacts
applies-to: git-submit
---

# R005 · 禁止提交生成产物

## 配置依赖

`git.forbidden_paths` 与 `artifacts[*].local_path`

## 规则内容

暂存区不得包含配置列出的生成产物或禁止路径，除非用户明确说明该仓库就是产物仓库且规则已被正式禁用。

## 检查时机

`git add` 后、`git commit` 前，通过 `git diff --cached --name-only` 检查。

## 违规处理

仅对违规路径执行取消暂存，保留用户其他暂存内容，并建议完善 `.gitignore`。
````````

### `.evospec/rules/R006-log-in-generated-code.md`

````````markdown
---
id: R006
status: enabled
name: log-in-generated-code
applies-to: feature-dev, bug-fix
---

# R006 · 生成或修改代码的日志要求

## 配置依赖

`development.logging`

## 规则内容

当 `enabled: true` 时：

- 使用配置中的日志 include、namespace 和 macros，或复用仓库现有同类实现。
- 覆盖 `required_points` 指定的关键位置。
- 高频路径遵守 `high_frequency_policy`，仅在状态变化、首次/恢复或限频条件下打印。
- 禁止引入与项目日志体系并行的临时打印方式。

当 `enabled: false` 时跳过本规则。

## 违规处理

指出缺少日志的位置和应使用的配置级别；不凭空创造未配置的宏。
````````

### `.evospec/rules/R007-chinese-comments.md`

````````markdown
---
id: R007
status: enabled
name: chinese-comments
applies-to: feature-dev, bug-fix
---

# R007 · 代码注释策略

## 配置依赖

`development.comments.enabled`、`language`、`mode`

## 规则内容

- `enabled: false`：跳过。
- `mode: every_nontrivial_line`：除纯括号、include/using 等自解释结构外，新增或修改的非平凡代码行使用配置语言说明意图。
- `mode: meaningful_blocks`：只注释复杂意图、边界、协议、单位、并发和非显然原因，避免逐句复述代码。
- 优先解释“为什么”，保持与代码同步。

## 违规处理

仅补充缺失且有价值的注释，不改动无关业务逻辑。
````````

### `.evospec/rules/R008-no-redundant-ui-call.md`

````````markdown
---
id: R008
status: enabled
name: no-redundant-ui-call
applies-to: feature-dev, bug-fix
---

# R008 · 高频路径禁止无条件执行高开销调用

## 配置依赖

`development.high_frequency_calls`

## 规则内容

当 `enabled: true` 时，在命中 `function_hints` 的循环、轮询、定时器或帧回调中，配置 `call_patterns` 指定的调用只能在输入实际变化时执行，或改为事件驱动。缓存变量使用配置的 `cache_prefix`。

本规则不限于 UI；项目可把网络发送、磁盘写入或昂贵计算加入 `call_patterns`。

## 违规处理

指出具体调用点，添加变化检测、去重、限频或事件驱动方案，并验证行为与性能未回退。
````````

### `.evospec/scripts/deploy_from_config.py`

````````python
#!/usr/bin/env python3
"""Execute deploy scenarios declared in .evospec/module.config.yaml.

This helper contains no project-specific path, process, transport, or command.
It is intentionally conservative: unresolved placeholders, missing artifacts,
and failed commands stop execution before later destructive steps.
"""
from __future__ import annotations

import argparse
import re
import subprocess
import sys
from pathlib import Path
from typing import Any, Iterable

try:
    import yaml  # type: ignore
except ImportError:
    print("[ERROR] PyYAML is required: python -m pip install pyyaml", file=sys.stderr)
    raise SystemExit(2)

TOKEN_RE = re.compile(r"\{([^{}]+)\}")


def load_config(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        data = yaml.safe_load(handle)
    if not isinstance(data, dict):
        raise ValueError("module.config.yaml must contain a mapping")
    return data


def nested_get(data: dict[str, Any], dotted: str) -> Any:
    cur: Any = data
    for part in dotted.split("."):
        if not isinstance(cur, dict) or part not in cur:
            raise KeyError(dotted)
        cur = cur[part]
    return cur


def render(value: str, context: dict[str, Any]) -> str:
    def replace(match: re.Match[str]) -> str:
        key = match.group(1)
        try:
            return str(nested_get(context, key))
        except KeyError as exc:
            raise ValueError(f"unresolved template variable: {{{key}}}") from exc

    rendered = TOKEN_RE.sub(replace, value)
    unresolved = context.get("templating", {}).get("unresolved_markers", [])
    for marker in unresolved:
        if marker and str(marker) in rendered:
            raise ValueError(f"unresolved marker '{marker}' in command: {rendered}")
    return rendered


def as_commands(value: Any) -> list[str]:
    if value is None:
        return []
    if isinstance(value, str):
        return [value]
    if isinstance(value, list) and all(isinstance(item, str) for item in value):
        return value
    raise ValueError("command field must be a string or list of strings")


def run_commands(commands: Iterable[str], context: dict[str, Any], cwd: Path, dry_run: bool) -> None:
    for raw in commands:
        command = render(raw, context)
        print(f"[CMD] {command}")
        if dry_run:
            continue
        completed = subprocess.run(command, shell=True, cwd=cwd)
        if completed.returncode != 0:
            raise RuntimeError(f"command failed with exit code {completed.returncode}: {command}")


def main() -> int:
    parser = argparse.ArgumentParser(description="Run a config-driven deploy scenario")
    parser.add_argument("scenario", nargs="?", help="scenario id from deploy.scenarios")
    parser.add_argument("--list", action="store_true", help="list available scenarios")
    parser.add_argument("--dry-run", action="store_true", help="render commands without executing")
    parser.add_argument("--config", type=Path, help="override module.config.yaml path")
    args = parser.parse_args()

    script_path = Path(__file__).resolve()
    evospec_dir = script_path.parent.parent
    module_root = evospec_dir.parent
    config_path = args.config.resolve() if args.config else evospec_dir / "module.config.yaml"
    config = load_config(config_path)

    deploy = config.get("deploy", {})
    if not isinstance(deploy, dict) or not deploy.get("enabled", False):
        print("[ERROR] deploy.enabled is false or missing", file=sys.stderr)
        return 2

    scenarios = deploy.get("scenarios", {})
    if not isinstance(scenarios, dict) or not scenarios:
        print("[ERROR] deploy.scenarios is empty", file=sys.stderr)
        return 2

    if args.list:
        for scenario_id, spec in scenarios.items():
            description = spec.get("description", "") if isinstance(spec, dict) else ""
            print(f"{scenario_id}: {description}")
        return 0

    if not args.scenario:
        parser.error("scenario is required unless --list is used")
    if args.scenario not in scenarios:
        print(f"[ERROR] unknown scenario: {args.scenario}", file=sys.stderr)
        return 2

    scenario = scenarios[args.scenario]
    if not isinstance(scenario, dict):
        print("[ERROR] scenario must be a mapping", file=sys.stderr)
        return 2

    artifact_id = scenario.get("artifact_id")
    artifacts = config.get("artifacts", [])
    artifact = next((item for item in artifacts if isinstance(item, dict) and item.get("id") == artifact_id), None)
    if not artifact:
        print(f"[ERROR] artifact not found: {artifact_id}", file=sys.stderr)
        return 2

    context: dict[str, Any] = dict(config)
    context["artifact"] = artifact
    context["scenario"] = scenario

    local_path = Path(str(artifact.get("local_path", "")))
    resolved_artifact = local_path if local_path.is_absolute() else (module_root / local_path).resolve()
    context["artifact"] = dict(artifact)
    context["artifact"]["local_path"] = str(resolved_artifact)

    if not args.dry_run and not resolved_artifact.exists():
        print(f"[ERROR] local artifact does not exist: {resolved_artifact}", file=sys.stderr)
        return 3

    try:
        run_commands(as_commands(deploy.get("preflight_commands")), context, module_root, args.dry_run)
        run_commands(as_commands(deploy.get("prepare_commands")), context, module_root, args.dry_run)

        stop_template = deploy.get("stop_process_command_template")
        if stop_template:
            for process in deploy.get("processes", []):
                process_context = dict(context)
                process_context["process"] = process
                run_commands([str(stop_template)], process_context, module_root, args.dry_run)

        run_commands(as_commands(scenario.get("remove_commands")), context, module_root, args.dry_run)
        run_commands(as_commands(scenario.get("transfer_command")), context, module_root, args.dry_run)
        run_commands(as_commands(deploy.get("post_commands")), context, module_root, args.dry_run)

        verification = deploy.get("verification", {})
        if isinstance(verification, dict):
            run_commands(as_commands(verification.get("commands")), context, module_root, args.dry_run)
    except (ValueError, RuntimeError) as exc:
        print(f"[ERROR] {exc}", file=sys.stderr)
        return 4

    print("[OK] dry-run completed" if args.dry_run else "[OK] deploy commands completed")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
````````

### `.evospec/scripts/push_to_board.bat`

````````batch
@echo off
setlocal
where python >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Python 3 not found in PATH.
  exit /b 2
)
python "%~dp0deploy_from_config.py" %*
exit /b %errorlevel%
````````

### `.evospec/skills/README.md`

````````markdown
# Skill 专用项目配置

当独立 Skill 具有不适合放入 `.evospec/module.config.yaml` 的专用参数或独立 schema 时，将配置放在本目录：

```text
.evospec/skills/<skill-id>.config.yaml
```

配置路径必须登记在 `.agent/skills/registry.yaml` 的 `project_config` 字段中。

规则：

- 公共模块信息优先复用 `.evospec/module.config.yaml`，不要重复维护。
- 专用配置只保存项目参数，不保存密码、Token 或私钥。
- 未确认值使用 `REQUIRED`、`PLACEHOLDER` 或 `TODO_CONFIG`。
- 高影响能力默认增加 `enabled: false`。
- 每个独立 schema 应提供对应的 `scripts/validate-<skill-id>.py`，或在 CI 中执行等价校验。

完整新增流程见 `docs/ADDING_SKILLS.md`。
````````

### `.gitignore`

````````gitignore
.agent/runs/*.json
!.agent/runs/.gitkeep
.agent/logs/
build/
.codex-log/
.claude/settings.local.json
__pycache__/
*.pyc
````````

### `.pi/prompts/fresh-agent-handoff.md`

````````markdown
读取 .agent/prompts/fresh-agent-handoff.md，并基于以下任务创建一个干净交接包：$@
不要复制旧 session 的全部对话，只保留事实、证据、尝试摘要、已否定方向、约束和完成条件。
````````

### `.pi/prompts/graph-bugfix.md`

````````markdown
请按 Bugfix Graph 执行并使用 model-skill：$@

加载 us-bug-fix.md、按需 debug-commands.md/us-build.md 和相关 .evospec 配置/规则。先复现或静态追踪，定位 root cause，再做最小修复。相同错误签名连续两次或无进展两轮时，创建 fresh debugger session，并使用 .agent/prompts/fresh-agent-handoff.md。
````````

### `.pi/prompts/graph-compile-debug.md`

````````markdown
请按 Compile Debug Graph 执行：$@

加载 us-build.md、按需 env-setup.md 和 .evospec 构建配置。先分类和定位 root cause，再做最小修复并重新构建。不得猜测工具链/clean 命令，不得注释功能或删除调用绕过失败。达到刷新条件时切换 fresh debugger session。
````````

### `.pi/prompts/graph-development.md`

````````markdown
请按项目 Graph + Loop + Skill 协议执行开发任务：$@

读取 AGENTS.md、.agent/project.yaml、.agent/router.yaml、.agent/graphs/development.graph.md、.agent/skills/registry.yaml、绑定的 model-skill references、相关 .evospec 配置/规则，以及引用的 nodes/loops。
当前 Pi session 作为 Coordinator。将 Explorer、Implementer、Verifier、Reviewer 工作拆成独立、有界阶段；需要真正 fresh context 时使用 /fork、/clone、独立 Pi session、tmux 或项目安装的多 Agent extension。
必须维护 run state，运行 build/test，并使用 fresh reviewer handoff。未经授权不部署、不 commit、不 push。
````````

### `.pi/prompts/graph-requirement.md`

````````markdown
请按 Requirement Analysis Graph 只读执行：$@

加载 model-skill 的 us-requirements.md、相关 .evospec 配置和启用规则。输出需求契约、影响矩阵、实现方案、假设和风险。跨模块、安全关键或高歧义任务必须使用独立 fresh review session。
````````

### `.pi/prompts/graph-review.md`

````````markdown
请作为 fresh、read-only Reviewer，按 .agent/graphs/review.graph.md 和 .agent/verdict-schema.yaml 审查：$@

同时读取任务绑定的 Skill reference、启用的 .evospec rules 和 Verifier 证据。不要修改文件；给出文件、符号、证据、风险和推荐路由。
````````

### `.pi/prompts/graph-skill-workflow.md`

````````markdown
请按 .agent/graphs/skill-workflow.graph.md 执行 model-skill 辅助任务：$@

从 .agent/skills/registry.yaml 选择一个 auxiliary route，只加载对应 reference 和 .evospec 配置/规则。先 preflight。部署、push、目标端删除、停止进程和远端覆盖默认只做 dry-run，除非用户明确授权。
````````

### `.pi/settings.json`

````````json
{
  "skills": ["skills"],
  "prompts": ["prompts"],
  "enableSkillCommands": true
}
````````

### `.pi/skills/graph-loop-runner/SKILL.md`

````````markdown
---
name: graph-loop-runner
description: Applies this repository's Graph Router, project Skill registry, .evospec configuration/rules, node loops, deterministic verification, independent review, and fresh-session policy to complex tasks.
---

Read `AGENTS.md` and `.agent/protocol.md`, classify the task with `.agent/router.yaml`, then execute the selected Graph.

Before executing a stage, read `.agent/skills/registry.yaml`, the selected central Skill under `.agent/skills/`, its registry-declared reference and project configuration, and enabled stage rules. Do not treat unresolved markers as real values. Deployment, push, target removal, process stop, and remote overwrite require explicit user authorization and should begin with dry-run.

Pi core should not be assumed to provide built-in subagents. Represent roles using bounded phases in the current session, separate `/fork` or `/clone` sessions, external terminal sessions, or an installed extension/package. A Reviewer that judges an Implementer's work must use a fresh context whenever practical.

Use `.agent/prompts/fresh-agent-handoff.md` when switching sessions.


Do not duplicate central Skill logic under `.pi/skills/`; Pi-specific Skills must be thin adapters. See `docs/ADDING_SKILLS.md`.
````````

### `AGENTS.md`

````````markdown
# Project Agent Instructions

本项目使用 `.agent/` 下的 **Graph + Loop + Multi-Agent + Skill 协议**，并使用与 `.agent/` 同级的 `.evospec/` 保存项目参数、规则、输入和输出。

## 启动规则

处理非简单任务前，必须依次读取：

1. `.agent/project.yaml`
2. `.agent/router.yaml`
3. Router 选中的 `.agent/graphs/*.graph.md`
4. `.agent/skills/registry.yaml`
5. 当前 Graph 绑定的 `.agent/skills/<skill>/SKILL.md` 与最小必要 reference
6. registry 为选中 Skill 声明的 `project_config`；默认 model-skill 使用 `.evospec/module.config.yaml`
7. registry 为选中 Skill 声明的 `rules_index` 与当前阶段启用的规则文件
8. Graph 引用的 `.agent/nodes/*.md`
9. Graph 引用的 `.agent/loops/*.md`
10. 当前 `.agent/runs/*.json`；若不存在且任务复杂，创建一个 run state

简单解释、单文件查找或无需执行动作的问题可使用 `qa` Graph，不必创建 run state。即使是简单任务，也不得把 `.evospec` 中的占位符当成真实项目事实。

## Graph、Skill 与配置的职责

- **Graph Router**：选择宏观任务路线、权限和停止条件。
- **Graph / Node / Loop**：控制阶段顺序、迭代、验证、审查和 fresh Agent 路由。
- **Skill Registry**：将 Graph 或辅助任务绑定到稳定的 Skill reference。
- **Registered Skills**：`.agent/skills/` 中的可复用阶段流程；`model-skill` 是当前默认 Skill。
- **Skill project_config**：registry 声明的项目参数来源；默认 model-skill 使用 `.evospec/module.config.yaml`。
- **Skill rules_index**：registry 声明的项目约束入口；默认使用 `.evospec/rules/INDEX.md`。

优先级：Graph 的权限和质量门禁不能被 Skill 覆盖；Skill 不能凭空补全 `.evospec` 缺失值；确定性验证不能被 Worker 自述覆盖。

## 角色

- **Coordinator**：主线程。选 Graph、选择 Skill route、维护状态、调度 Agent、合并结果、决定路由。
- **Explorer**：只读搜索代码、文档、测试、构建配置和 `.evospec` 证据。
- **Implementer**：按已确认计划实施最小改动。
- **Debugger**：先定位 root cause，再实施最小修复。
- **Verifier**：运行构建、测试、静态检查、复现和安全 dry-run；不修改源代码。
- **Reviewer**：独立、只读、fresh context；输出结构化 Verdict。

Skill 自己的 grader 只评估路由、配置、规则和输出契约，不能代替代码 Reviewer 或 Verifier。

## 强制执行顺序

所有非简单任务的节点内部遵循：

```text
Observe → Decide → Act → Verify → Update State → Route
```

代码发生非平凡变更时，完成条件至少包括：

1. 需求或任务覆盖可追踪。
2. 构建通过，或明确标记环境阻塞。
3. 相关测试通过，或明确标记未验证风险。
4. 独立 Reviewer 给出 `PASS`；否则按路由规则处理。
5. 输出 changed files、验证证据和剩余风险。

## Skill 执行规则

1. 只加载当前 Graph/route 需要的 reference，不一次性读取整个 Skill。
2. 执行前检查 registry 声明的 `project_config` 及 unresolved markers；未声明配置的 Skill 不得被强行绑定到 module.config。
3. 当前阶段只应用 registry 声明的 `rules_index` 中启用且 `applies-to` 匹配的规则。
4. `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG`、空命令或未确认目标不得作为真实命令执行。
5. 部署、push、目标端删除、停止进程、覆盖文件等高影响动作，必须配置完整且获得用户明确授权；默认先 dry-run。
6. Skill reference 中的阶段跳转仍需经过当前 Graph 的 Verifier、Reviewer 和停止条件。

新增 Skill 的配置、Graph 接入和平台薄适配器必须遵循 `docs/ADDING_SKILLS.md`。

## 正确性证据优先级

```text
确定性执行结果 > 明确需求/接口契约 > 可复现行为 > 独立 Reviewer > Worker 自述
```

Worker 的“我认为完成了”不能覆盖失败的 build/test，也不能替代独立审查。

## Reviewer Verdict

只允许：

- `PASS`
- `PASS_WITH_RISK`
- `FAIL_LOCAL`
- `FAIL_STRUCTURAL`
- `NEED_USER_DECISION`
- `BLOCKED_ENVIRONMENT`

详细字段见 `.agent/verdict-schema.yaml`。

## 刷新新 Agent

满足任一条件时，Coordinator 应启动 fresh Agent，而不是让原 Agent 无限重试：

- 达到该 Loop 的重试上限。
- 相同错误签名连续出现 2 次。
- 连续 2 轮没有可测量进展。
- Reviewer 判断为 `FAIL_STRUCTURAL`。
- 修改范围持续扩大但验证结果没有改善。
- Agent 无法清晰解释 root cause 或反复改变核心假设。
- 上下文被大量日志和失败尝试污染。

Fresh Agent 必须使用 `.agent/prompts/fresh-agent-handoff.md` 的干净交接包，不能直接继承旧 Agent 的全部长对话。

## 安全与范围

- `qa`、`requirement`、`review` Graph 默认为只读。
- 不做无关重构。
- 不通过注释功能、删除行为或削弱测试绕过失败。
- 不执行发布、push、部署、删除大范围文件、修改凭证等高影响动作，除非用户明确授权。
- 专用硬件、服务器、密钥、供应商 SDK 等信息缺失时，记录 blocker；只有真正阻塞时才询问用户。
- `.evospec/scripts/deploy_from_config.py` 会执行配置中的 shell 命令；非 dry-run 使用前必须检查渲染结果和目标。

## 最终输出

复杂任务最终必须报告：

1. Selected Graph 与选择理由
2. Selected Skill / route、加载的 reference 和规则
3. 最终 Graph Node / Loop iteration
4. 需求和实现摘要
5. Changed files
6. Build/Test/Lint/复现/dry-run 结果
7. Reviewer Verdict
8. Fresh Agent 是否发生及原因
9. Remaining risks / blockers / unresolved configuration
````````

### `CLAUDE.md`

````````markdown
# Claude Code Project Instructions

本项目的权威流程定义位于：

- `AGENTS.md`
- `.agent/project.yaml`
- `.agent/router.yaml`
- `.agent/graphs/`
- `.agent/nodes/`
- `.agent/loops/`
- `.agent/skills/registry.yaml`
- `.agent/skills/`（当前默认包含 `model-skill`）
- `.evospec/module.config.yaml`
- `.evospec/rules/`

Claude Code 处理复杂任务时：

1. 主会话担任 Coordinator，或使用 `.claude/agents/coordinator.md` 作为主 Agent。
2. 先选 Graph，再从 registry 选择 Skill，加载最小必要 reference 及该 Skill 声明的 `.evospec` 配置/规则。
3. 将搜索、日志分析、实现、验证和审查分配给对应项目级 subagent。
4. Reviewer 必须使用独立上下文，且不能编辑文件。
5. Verifier 可以执行会生成构建产物的命令，但不能修改源代码。
6. 所有 Agent 使用 `.agent/state-template.json` 约定的状态字段，包括 `skill` 字段。
7. 达到刷新条件时，不继续恢复原 Agent；启动同角色 fresh Agent，并提供干净 handoff。
8. 部署、push 和目标端破坏性动作默认只做配置检查/dry-run，除非用户明确授权。

可直接调用项目 Skill：

```text
/graph-loop-runner <任务描述>
```

项目级 Stop Hook 默认为关闭状态。需要 Stop 门禁时，参考 `.claude/settings.stop-gate.example.json`，审阅后再合并到 `.claude/settings.json`。

新增 Claude Skill 时，业务实现必须保留在 `.agent/skills/<skill-id>/`；`.claude/skills/` 只放薄适配器。完整步骤见 `docs/ADDING_SKILLS.md`。
````````

### `README.md`

````````markdown
# Graph + Loop + Skill 多 Agent 工程框架

这是一套可移植到新项目的项目级 Agent 工程模板，适用于 Codex、Claude Code 和 Pi。

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
- **Skill**：`.agent/skills/` 是跨工具中央 Skill 目录；当前默认 `model-skill` 提供需求、开发、修复、构建、部署、Git、调试、项目资源、环境、代码分析和规则管理流程，后续可注册独立 Skill。
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

Graph 的权限和质量门禁优先。Skill 不能绕过只读 Graph、Build/Test/Review 或用户授权。

## 快速开始

1. 把本目录内容复制到项目根目录。
2. 编辑 `.agent/project.yaml`，填入项目类型、门禁和重试预算。
3. 编辑 `.evospec/module.config.yaml`，填入模块、构建、部署、调试和 Git 参数；未确认能力保持禁用。
4. 编辑 `scripts/project-commands.sh`，使 wrapper 与 `.evospec` 中的真实构建环境保持一致。
5. 根据需要删除不使用的平台适配目录，例如只用 Codex 时可删除 `.claude/` 和 `.pi/`。
6. 运行：

```bash
python3 scripts/validate-skills.py
python3 scripts/validate-framework.py
python3 scripts/validate-evospec.py
python3 scripts/new-run.py "验证 Graph + Loop + Skill 框架"
```

模板初始配置含 `REQUIRED`，`validate-evospec.py` 默认给出 WARN 而不失败；项目交付前可执行：

```bash
python3 scripts/validate-evospec.py --strict
```

7. 在 CLI 中输入：

```text
请按项目里的 Graph + Loop + Skill 协议执行。
先读取 AGENTS.md、.agent/router.yaml、选中的 Graph、Skill registry、绑定的 reference、.evospec 配置/规则和当前 run state。
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
````````

### `docs/ADDING_SKILLS.md`

````````markdown
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
description: 收集项目测试结果、校验输入完整性并生成结构化测试报告；适用于用户要求汇总测试结果、生成测试报告或检查报告缺失项的任务。
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

长流程放在 reference 中，`SKILL.md` 只保留入口、职责、路由和通用协议，避免每次加载过多上下文。

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
description: 通过项目 Graph Router 和中央 test-report-skill 生成或校验测试报告。
argument-hint: "<任务描述>"
---

Read `AGENTS.md`, `.agent/router.yaml`, and `.agent/skills/registry.yaml`.
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
````````

### `docs/ARCHITECTURE.md`

````````markdown
# 架构说明

## 分层

```text
Project Instructions: AGENTS.md / CLAUDE.md
        ↓
Graph Router: .agent/router.yaml
        ↓
Task Graphs: .agent/graphs/
        ↓
Skill Registry: .agent/skills/registry.yaml
        ↓
Stage Workflow: .agent/skills/<selected-skill>/
        ↓
Project Configuration + Rules: .evospec/
        ↓
Reusable Nodes: .agent/nodes/
        ↓
Local Loops: .agent/loops/
        ↓
Roles: Coordinator / Explorer / Implementer / Debugger / Verifier / Reviewer
        ↓
Harness: Filesystem / Shell / Git / Build / Test / CI / MCP
        ↓
State + Evidence + Verdict + Refresh Policy
```

## 为什么是多个 Graph

不同任务具有不同目标、权限和停止条件。需求分析不应默认改代码；代码审查不应由 Reviewer 自动修复；编译调试的核心完成标准是 build，而新功能开发还需要需求覆盖、测试和独立审查。

## 为什么仍然需要 Skill

Graph 描述宏观状态机，但不适合保存每种能力的详细执行方法。Skill 提供可复用阶段流程，registry 负责绑定，`.evospec` 将项目差异配置化，避免把服务器、路径、进程和分支写进通用 Graph。`model-skill` 是当前默认 Skill，后续独立能力可按 `docs/ADDING_SKILLS.md` 注册。

## 当前 Graph 与 model-skill 的组合

- `requirement` → `us-requirements.md`
- `development` → `us-feature-dev.md` + `us-build.md`
- `bugfix` → `us-bug-fix.md` + `debug-commands.md` + `us-build.md`
- `compile-debug` → `us-build.md` + `env-setup.md`
- 辅助构建、部署、Git、环境、代码分析和规则管理 → `skill-workflow` Graph

绑定关系见 `.agent/skills/registry.yaml`。

## 为什么 Verifier 与 Reviewer 分开

- Verifier 回答“命令和行为证据是什么”。
- Reviewer 回答“这些证据和改动是否满足任务契约、Skill 规则，是否存在遗漏风险”。
- Coordinator 将两者合并后路由。
- `model-skill/agents/grader.md` 只检查 Skill 分发和配置渲染，不替代二者。

## 为什么刷新 Agent

同一 Agent 的上下文可能被旧假设、重复日志和失败修复锚定。Fresh Agent 接收精简事实包，可以独立重新判断。但刷新不能解决产品需求或部署目标本身的歧义，这类问题必须交给用户或负责人。


## 多 Skill 扩展

新增 Skill 时，中央实现放在 `.agent/skills/<skill-id>/`。现有 Graph 可通过 `graph_bindings` 调用；短辅助流程使用全局唯一的 `auxiliary_routes`；具有独立权限、Loop 或停止条件的任务应新建 Graph。Codex、Claude 和 Pi 的平台目录只提供薄入口。
````````

### `docs/CUSTOMIZE.md`

````````markdown
# 新项目移植与定制

## 必改项

1. `.agent/project.yaml`
   - 项目名、领域、门禁、重试预算和高影响动作策略。
2. `.evospec/module.config.yaml`
   - 模块身份、路径、任务编号、架构、构建、产物、部署、调试、Git 和开发规则参数。
   - 无法确认的服务器、目标设备、进程、push 目标和凭据来源不得猜测。
3. `scripts/project-commands.sh`
   - 真实 build/test/lint wrapper，并与 `.evospec` 的构建环境保持一致。
4. `AGENTS.md`
   - 项目特有安全规则、分支规则、编码规范和不可修改目录。
5. `.agent/graphs/`
   - 删除无用 Graph；增加项目特有 Graph，例如 HIL、发布或需求入库。
6. `.agent/nodes/impact-analysis.md`
   - 加入项目特有影响维度，例如 CAN、诊断、NVM、标定、AUTOSAR、芯片寄存器。
7. `.evospec/rules/`
   - 检查 R001–R008 是否适用；不适用时修改 frontmatter 状态并同步 `INDEX.md`，不要让默认规则悄悄约束项目。
8. `.agent/skills/`
   - 新增独立能力时按 `docs/ADDING_SKILLS.md` 创建中央 Skill、注册 registry，并选择 Graph binding、auxiliary route 或独立 Graph。

## model-skill 的保护边界

- 保持 `.agent/skills/model-skill/references/` 中 11 个 Markdown 文件的文件名、数量和职责稳定。
- 改服务器、芯片、路径、进程、日志宏、分支：改 `.evospec/module.config.yaml`。
- 改项目强制约束：改 `.evospec/rules/`。
- 只有所有项目都需要改变同一通用流程时，才修改 reference。
- 只有新增真正独立的阶段意图时，才修改 `SKILL.md` 路由表和 `.agent/skills/registry.yaml`。

## 配置职责，避免双重来源

- `.agent/project.yaml`：Agent 编排、质量门禁、重试和安全策略。
- `.evospec/module.config.yaml`：项目/模块的真实参数和命令来源。
- `scripts/project-commands.sh`：给框架 Verifier 使用的稳定 shell wrapper；内容应与 `.evospec` 一致。

## 验证

```bash
python3 scripts/validate-skills.py
python3 scripts/validate-framework.py
python3 scripts/validate-evospec.py
python3 scripts/validate-evospec.py --strict   # 配置完成后
```

部署首次只运行：

```bat
.evospec\scripts\push_to_board.bat --list
.evospec\scripts\push_to_board.bat <scenario-id> --dry-run
```

## 可选项

- Codex：给 agent 文件配置特定 model、reasoning effort 或 MCP。
- Claude Code：启用 Stop Hook、限制工具、预加载 runner skill。
- Pi：安装多 Agent extension/package，或用多个 session/tmux 实现角色隔离。

## 不建议做的事

- 把所有细节都塞进 AGENTS.md，导致每轮上下文过大。
- 每个需求创建一个全新 Graph。
- 复制 `model-skill` 到多个平台目录后分别修改，造成版本漂移。
- 把 Reviewer 和 Implementer 合并成一个角色。
- 只按“多数 Agent 赞成”判断正确，而不看执行证据。
- 在 `.evospec` 里保存密码、Token 或私钥。


## 后续新增 Skill

不要直接复制到各 CLI 平台目录。按照 [`ADDING_SKILLS.md`](ADDING_SKILLS.md) 执行：

1. 判断是配置/Rules 变化，还是确实需要新 Skill。
2. 在 `.agent/skills/<skill-id>/` 创建唯一实现。
3. 在 `.agent/skills/registry.yaml` 注册。
4. 接入现有 Graph、辅助 route 或新 Graph。
5. 项目参数放 `.evospec`；平台目录只放薄适配器。
6. 运行 `validate-skills.py` 和完整框架校验。
````````

### `docs/EXAMPLES.md`

````````markdown
# 完整提问示例

## 1. PowerManager 需求分析

```text
请按项目里的 Graph + Loop + Skill 协议执行。

读取：
- AGENTS.md
- .agent/router.yaml
- .agent/skills/registry.yaml
- .evospec/module.config.yaml
- .evospec/rules/INDEX.md

任务：
分析 .evospec/input/prd 中与 PowerManager 最相关的需求，只运行到 PLAN，不修改代码。

要求：
1. 选择 Requirement Graph。
2. 使用 model-skill 的 us-requirements.md。
3. Explorer 只读搜索源码、架构文档、构建文件和测试。
4. 输出需求基线、影响矩阵、实现方案、验证方案、假设和阻塞项。
5. 无法确认的任务编号使用可见占位符，不得编造。
```

## 2. 功能开发

```text
请按 Development Graph 执行，并使用 model-skill。

任务：
根据已批准的 PowerManager 设计方案实现代码框架。

执行：
- 加载 us-feature-dev.md 和 feature-dev 启用规则。
- Implementer 每轮只完成一个计划任务。
- 构建阶段加载 us-build.md。
- Verifier 独立运行 scripts/verify.sh。
- Reviewer 使用 fresh context，检查需求覆盖、状态机、并发、中断、资源和测试。
- 不执行部署、commit 或 push。
```

## 3. Bug 修复

```text
请按 Bugfix Graph 执行，并使用 model-skill 的 us-bug-fix.md 与 debug-commands.md。

问题：车辆下电后未进入 Sleep，下面是原始日志：……

要求：
1. 先读取已有设计和代码分析输出。
2. 固化复现条件，定位第一个错误状态。
3. 每个 root-cause 假设给出支持证据、反证和验证方式。
4. 只做最小修复。
5. 生成 Bug 修复记录，但记录不能替代 build/test/review。
```

## 4. 普通构建

```text
请使用 skill-workflow Graph 的 build route。
先运行 scripts/validate-evospec.py；如果构建配置仍含 REQUIRED，只报告缺失字段，不构造命令。
配置完整时运行默认 build strategy，报告命令、exit code、首个错误和 artifact 状态。
不要部署。
```

## 5. 部署 dry-run

```text
请使用 skill-workflow Graph 的 board-deploy route。
只执行：
1. Skill preflight
2. 场景列表
3. scenario=code_only 的 dry-run

不要删除目标文件、停止进程、传输产物或重启服务。
输出所有未解析变量和需要我确认的目标信息。
```

## 6. Git 提交检查

```text
请使用 git-submit route，只读检查当前工作区：
- git status
- diff
- 禁止路径
- 任务编号是否满足 pattern
- 建议 commit message

不执行 git add、commit 或 push。
```

## 7. 规则适配

```text
请使用 rules route，分析 .evospec/rules/R001-R008 是否适合当前项目。
只输出建议，不修改规则。
重点指出默认 enabled 但当前配置会跳过的规则，以及可能需要禁用或调整的规则。
```
````````

### `docs/MODEL_SKILL_ANALYSIS.md`

````````markdown
# model-skill 模板分析与整合说明

## 1. 原始模板组成

上传包由三部分组成：

1. `.codex/skills/model-skill/`
   - `SKILL.md`：按用户意图分发到 11 个稳定 reference。
   - `references/`：需求、开发、Bug、构建、部署、Git、调试、项目资源、环境、代码分析和规则管理。
   - `USAGE.md`：给人看的迁移说明，以及给 Agent 看的初始化协议。
   - `agents/grader.md`：评估 Skill 分发、配置渲染和规则加载。
2. `.evospec/`
   - `module.config.yaml`：模块、路径、工作项、架构、构建、产物、部署、调试、Git 和开发参数。
   - `rules/`：R001–R008 独立规则及索引。
   - `input/`、`output/`：需求输入和设计/Bug/提交/分析输出。
   - `scripts/`：配置驱动的部署脚本。
3. `.codex/settings.local.json`
   - 空权限白名单，本身不提供业务能力。

## 2. 核心设计优点

- 流程与项目参数分离，跨项目时主要修改 `.evospec/module.config.yaml`。
- 11 个 reference 职责稳定，适合渐进读取，避免一个 Skill 文件过大。
- 使用 unresolved markers 阻止把模板占位符当成真实命令。
- 部署默认 `enabled: false`，并提供 `--list` / `--dry-run`。
- 规则使用独立 frontmatter，可按阶段启用或禁用。
- `USAGE.md` 明确区分可自动填写、需用户确认和必须由用户提供的信息。

## 3. 原始模板的限制与风险

### 3.1 单平台路径耦合

原始 Skill 放在 `.codex/skills/model-skill/`，会把通用流程绑到单一 CLI。当前框架需要同时服务 Codex、Claude Code 和 Pi，因此迁移到 `.agent/skills/model-skill/`，由各平台入口显式加载。

### 3.2 模板不能直接执行

`module.config.yaml` 初始包含多个 `REQUIRED`：模块 ID、平台、任务系统、架构风格、构建 shell/命令、调试命令和 Git push 目标。未完成配置前，只能做静态分析或安全 dry-run。

### 3.3 构建配置与框架 wrapper 可能重复

原框架通过 `scripts/project-commands.sh` 提供 Build/Test/Lint wrapper；model-skill 把构建策略放在 `.evospec`。整合后的职责是：

- `.evospec` 是项目参数的权威来源；
- `scripts/*.sh` 是 Verifier 的稳定入口；
- 两者必须在项目初始化时对齐，不能分别维护互相矛盾的命令。

### 3.4 部署脚本具有高影响能力

`deploy_from_config.py` 会用 `shell=True` 执行配置命令。虽然部署默认关闭且会检查未解析标记，但真实执行前仍必须审查渲染命令、目标、产物、进程和回滚条件。框架因此增加用户授权门禁，并默认 dry-run。

### 3.5 Grader 不等于 Reviewer

`agents/grader.md` 检查的是 Skill 是否分发正确、是否使用配置和规则，不能证明业务代码正确。整合后仍保留独立 Verifier 和 fresh Reviewer。

### 3.6 部分规则需要项目级确认

- R003、R006、R008 默认 enabled，但配置开关为 false 时会跳过。
- R007 默认要求中文有意义注释，未必适用于所有团队。
- R002 要求生成 Bug/提交记录，可能影响轻量项目。

迁移时必须逐条检查并同步规则 frontmatter 与 `INDEX.md`。

### 3.7 原模板缺少自动一致性校验

整合后增加 `scripts/validate-evospec.py`，检查：

- YAML/schema_version 和顶层配置节；
- unresolved markers；
- 11 个 reference 的数量和名称；
- 规则 frontmatter 与索引一致性；
- deploy scenario 与 artifact 引用；
- 是否残留旧 `.codex/skills/model-skill` 路径。

## 4. 整合后的目录决策

```text
<project-root>/
├─ .agent/
│  ├─ skills/
│  │  ├─ registry.yaml
│  │  └─ model-skill/
│  ├─ graphs/
│  ├─ nodes/
│  └─ loops/
├─ .evospec/
├─ .codex/
├─ .claude/
└─ .pi/
```

满足要求：原 `.codex/skills` 内容进入 `.agent/skills`；`.evospec` 与 `.agent` 同级。

原 `.codex/settings.local.json` 没有复制，因为当前框架已有自己的 `.codex/config.toml` 和权限边界，复制空白 local settings 可能造成覆盖或误导。

## 5. 两套路由如何避免冲突

- Graph Router 先判断任务的宏观类型和权限。
- 核心 Graph 根据 `.agent/skills/registry.yaml` 绑定 model-skill reference。
- 普通构建、部署、Git、环境、代码分析和规则管理走 `skill-workflow` Graph，再由 model-skill 选择辅助 route。
- Skill reference 的阶段跳转不能跳过当前 Graph 的 Loop、Verifier、Reviewer 或用户授权。

## 6. 最终映射

| Graph | model-skill reference |
|---|---|
| requirement | `us-requirements.md` |
| development | `us-feature-dev.md`、`us-build.md` |
| bugfix | `us-bug-fix.md`、`debug-commands.md`、`us-build.md` |
| compile-debug | `us-build.md`、`env-setup.md` |
| qa | 按需 `project-info.md` |
| docs | 按需 `us-code-analysis.md` |
| skill-workflow | build/deploy/git/debug/project-info/env/code-analysis/rules 辅助 routes |
````````

### `docs/SOURCES.md`

````````markdown
# 参考依据（截至 2026-08-27）

本模板的工具适配部分参考以下官方能力模型：

- OpenAI Codex：AGENTS.md discovery、项目级 `.codex/config.toml`、`.codex/agents/*.toml` custom agents 和 subagent workflows。
- Anthropic Claude Code：项目级 `.claude/agents/*.md`、YAML frontmatter、tools/permissionMode/maxTurns、skills 和 hooks。
- Pi Agent Harness：AGENTS.md/CLAUDE.md context files、`.pi/settings.json`、skills、prompt templates、extensions；Pi 核心保持最小，不假设内置 subagents。

`model-skill`、`.evospec` 配置、规则和部署脚本来自用户提供的 `model-skill-portable-template-with-usage.tar.gz`，本框架只做路径迁移、Graph/Skill 绑定、安全门禁和一致性校验，不改变 11 个 reference 的职责集合。

建议迁移到新版本工具时重新核对各工具官方配置文档，尤其是模型名称、权限模式、Hook 和 extension API。
````````

### `docs/USAGE.md`

````````markdown
# 使用方法

## 自动选 Graph + Skill binding

```text
请按项目 Graph Router 执行：分析 .evospec/input/prd 中的 PowerManager 需求影响。
```

预期：选择 `requirement` Graph，并绑定 `model-skill/references/us-requirements.md`。

## 显式选 Graph

```text
请按 Development Graph 执行：根据 PowerManager 需求实现模块代码框架。
```

预期：加载 `us-feature-dev.md`、相关 `.evospec` 配置和 feature-dev 规则；构建阶段加载 `us-build.md`。

## 显式使用 model-skill

```text
请按项目 Graph Router 执行，并使用 model-skill：分析这个需求。
```

指定 Skill 不会跳过 Graph Router；最终目标仍决定走 `requirement`、`development`、`bugfix` 或 `skill-workflow`。

## 只运行到 Plan

```text
请按 Development Graph 执行，但只运行到 PLAN，不进入 IMPLEMENT。
```

## 从错误节点恢复

```text
请从 Compile Debug Graph 的 CLASSIFY_ERROR 开始。下面是 build log：……
```

## 普通构建

```text
请按项目 Graph Router 执行，并使用 model-skill 运行默认构建策略。先校验 .evospec 配置，不做部署。
```

无失败证据时走 `skill-workflow` 的 `build` route；已有构建错误时走 `compile-debug`。

## 部署 dry-run

```text
请按 skill-workflow Graph 执行 board-deploy route。
只运行配置检查、场景列表和 dry-run，不执行目标端删除、进程停止、传输或重启。
```

## 真实部署

```text
请按 skill-workflow Graph 执行 board-deploy route。
我明确授权执行 scenario=<id> 的真实部署；执行前展示完整脱敏命令、目标、产物和回滚条件，任一步失败立即停止。
```

## Git 检查与提交

只检查：

```text
请执行 git-submit route，只检查 status、diff、禁止路径和 commit message，不执行 commit 或 push。
```

执行写操作时必须明确给出任务编号和授权：

```text
任务编号是 ABC-123。我授权提交本次任务相关文件，但不授权 push。
```

## 强制 Fresh Reviewer

```text
实现和验证完成后，启动一个不继承 Implementer 推理的 fresh Reviewer，只读审查当前 diff、Skill 规则和验证证据。
```

## 强制刷新 Debugger

```text
当前错误签名已连续两轮不变。停止原 Debugger，按照 fresh-agent-handoff 模板启动新 Debugger，重新判断 root cause。
```

## 初始化/迁移 model-skill

```text
读取 .agent/skills/model-skill/USAGE.md 的“给 Agent 看的初始化协议”。
扫描当前仓库证据，填写可确定的 .evospec/module.config.yaml 字段；无法确认的服务器、部署目标、任务系统和 push 目标集中询问我。高风险能力保持 disabled。
```

## 配置验证

```bash
python3 scripts/validate-evospec.py
python3 scripts/validate-evospec.py --strict
```

默认模式允许模板中的 unresolved markers，以 WARN 返回；`--strict` 用于项目配置完成后的交付检查。

## Pi 中的角色隔离

Pi 原生工作流可用当前 session 作为 Coordinator；对需要 fresh context 的 Reviewer/Debugger，使用 `/fork`、`/clone`、独立 Pi 进程或外部 tmux pane，并复制精简 handoff，而非整个聊天历史。

## 新增 Skill 后检查

完整步骤见 [`ADDING_SKILLS.md`](ADDING_SKILLS.md)。新增后先做静态注册检查：

```bash
python3 scripts/validate-skills.py
python3 scripts/validate-framework.py
```

再让 Agent 验证路由：

```text
请只做静态检查：列出 .agent/skills/registry.yaml 中的所有 Skill、Graph bindings、auxiliary routes、配置和规则路径，不执行项目命令。
```

新 Skill 需要自然语言自动选择时，还必须更新 `.agent/router.yaml` 和 `.agent/graph-decision-table.md`。
````````

### `scripts/build.sh`

````````bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/project-commands.sh"
mkdir -p .agent/logs
LOG=".agent/logs/build-$(date +%Y%m%d-%H%M%S).log"

run() {
  echo "+ $*" | tee "$LOG"
  bash -lc "$*" 2>&1 | tee -a "$LOG"
}

if [[ -n "$PROJECT_BUILD_CMD" ]]; then
  run "$PROJECT_BUILD_CMD"
elif [[ -f CMakeLists.txt ]]; then
  run "cmake -S . -B build && cmake --build build --parallel"
elif [[ -f Makefile || -f makefile ]]; then
  run "make -j${JOBS:-2}"
elif [[ -f package.json ]]; then
  run "npm run build"
else
  echo "No build command configured. Edit scripts/project-commands.sh." | tee "$LOG" >&2
  exit 2
fi
````````

### `scripts/check-run-state.py`

````````python
#!/usr/bin/env python3
from pathlib import Path
import json, sys

ALLOWED_VERDICTS = {
    'NOT_RUN', 'PASS', 'PASS_WITH_RISK', 'FAIL_LOCAL', 'FAIL_STRUCTURAL',
    'NEED_USER_DECISION', 'BLOCKED_ENVIRONMENT'
}
ALLOWED_FINAL = {'NOT_DONE', 'DONE', 'DONE_WITH_RISK', 'BLOCKED', 'CANCELLED'}

if len(sys.argv) != 2:
    raise SystemExit('usage: check-run-state.py .agent/runs/<run>.json')
path = Path(sys.argv[1])
data = json.loads(path.read_text(encoding='utf-8'))
required = ['run_id', 'task', 'routing', 'skill', 'loop', 'verification', 'review', 'final']
missing = [k for k in required if k not in data]
errors = []
if missing:
    errors.append(f'missing top-level keys: {missing}')
if data.get('review', {}).get('verdict') not in ALLOWED_VERDICTS:
    errors.append('invalid review.verdict')
if data.get('final', {}).get('status') not in ALLOWED_FINAL:
    errors.append('invalid final.status')

preflight = data.get('skill', {}).get('preflight_status')
if preflight not in {'NOT_RUN', 'EXECUTABLE', 'DRY_RUN_ONLY', 'NEED_USER_DECISION', 'BLOCKED_ENVIRONMENT'}:
    errors.append('invalid skill.preflight_status')
if data.get('final', {}).get('status') == 'DONE':
    for gate in ('build', 'test'):
        status = data.get('verification', {}).get(gate, {}).get('status')
        if status not in {'PASS', 'NOT_REQUIRED'}:
            errors.append(f'final DONE but verification.{gate}.status={status!r}')
    if data.get('review', {}).get('verdict') != 'PASS':
        errors.append('final DONE requires review.verdict PASS')
if errors:
    print('INVALID')
    for e in errors:
        print(f'- {e}')
    raise SystemExit(1)
print('VALID')
````````

### `scripts/install-to-project.ps1`

````````powershell
param(
    [Parameter(Mandatory = $true)]
    [string]$Target,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$SourceRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
New-Item -ItemType Directory -Force -Path $Target | Out-Null
$Target = (Resolve-Path $Target).Path
$Stamp = Get-Date -Format "yyyyMMdd-HHmmss"

function Copy-FrameworkItem {
    param([string]$RelativePath)
    $Source = Join-Path $SourceRoot $RelativePath
    $Destination = Join-Path $Target $RelativePath

    if (Test-Path $Destination) {
        if (-not $Force) {
            Write-Host "SKIP existing: $Destination"
            return
        }
        $Backup = "$Destination.backup.$Stamp"
        Move-Item -Path $Destination -Destination $Backup
        Write-Host "BACKUP: $Destination -> $Backup"
    }

    $Parent = Split-Path -Parent $Destination
    if ($Parent) { New-Item -ItemType Directory -Force -Path $Parent | Out-Null }
    Copy-Item -Path $Source -Destination $Destination -Recurse
    Write-Host "COPY: $RelativePath"
}

@("AGENTS.md", "CLAUDE.md", ".agent", ".evospec", ".codex", ".claude", ".pi") | ForEach-Object {
    Copy-FrameworkItem $_
}

@(
    "scripts/project-commands.sh",
    "scripts/build.sh",
    "scripts/test.sh",
    "scripts/lint.sh",
    "scripts/verify.sh",
    "scripts/new-run.py",
    "scripts/check-run-state.py",
    "scripts/validate-framework.py",
    "scripts/validate-evospec.py"
) | ForEach-Object {
    Copy-FrameworkItem $_
}

Write-Host ""
Write-Host "Installed Graph + Loop framework into: $Target"
Write-Host "Next:"
Write-Host "  1. Edit .agent/project.yaml"
Write-Host "  2. Edit .evospec/module.config.yaml"
Write-Host "  3. Edit scripts/project-commands.sh"
Write-Host "  4. Run python scripts/validate-framework.py"
````````

### `scripts/install-to-project.sh`

````````bash
#!/usr/bin/env bash
set -euo pipefail

SOURCE_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TARGET="${1:-}"
MODE="${2:-}"

if [[ -z "$TARGET" ]]; then
  echo "usage: $0 <target-project-directory> [--force]" >&2
  exit 2
fi

mkdir -p "$TARGET"
TARGET="$(cd "$TARGET" && pwd)"

items=(AGENTS.md CLAUDE.md .agent .evospec .codex .claude .pi)
for item in "${items[@]}"; do
  src="$SOURCE_ROOT/$item"
  dst="$TARGET/$item"
  if [[ -e "$dst" && "$MODE" != "--force" ]]; then
    echo "SKIP existing: $dst"
    continue
  fi
  if [[ -e "$dst" && "$MODE" == "--force" ]]; then
    backup="$dst.backup.$(date +%Y%m%d-%H%M%S)"
    mv "$dst" "$backup"
    echo "BACKUP: $dst -> $backup"
  fi
  cp -a "$src" "$dst"
  echo "COPY: $item"
done

mkdir -p "$TARGET/scripts"
for script in project-commands.sh build.sh test.sh lint.sh verify.sh new-run.py check-run-state.py validate-framework.py validate-evospec.py; do
  src="$SOURCE_ROOT/scripts/$script"
  dst="$TARGET/scripts/$script"
  if [[ -e "$dst" && "$MODE" != "--force" ]]; then
    echo "SKIP existing: $dst"
  else
    if [[ -e "$dst" && "$MODE" == "--force" ]]; then
      mv "$dst" "$dst.backup.$(date +%Y%m%d-%H%M%S)"
    fi
    cp -a "$src" "$dst"
    echo "COPY: scripts/$script"
  fi
done

cat <<MSG

Installed Graph + Loop framework into:
  $TARGET

Next:
  1. Edit .agent/project.yaml
  2. Edit .evospec/module.config.yaml
  3. Edit scripts/project-commands.sh
  4. Run python3 scripts/validate-framework.py
MSG
````````

### `scripts/lint.sh`

````````bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/project-commands.sh"
mkdir -p .agent/logs
LOG=".agent/logs/lint-$(date +%Y%m%d-%H%M%S).log"

run() {
  echo "+ $*" | tee "$LOG"
  bash -lc "$*" 2>&1 | tee -a "$LOG"
}

if [[ -n "$PROJECT_LINT_CMD" ]]; then
  run "$PROJECT_LINT_CMD"
elif [[ -f package.json ]] && grep -q '"lint"' package.json; then
  run "npm run lint"
elif command -v ruff >/dev/null 2>&1 && [[ -f pyproject.toml ]]; then
  run "ruff check ."
elif command -v clang-format >/dev/null 2>&1 && find . -path './build' -prune -o \( -name '*.c' -o -name '*.h' \) -print -quit | grep -q .; then
  echo "clang-format found, but no project lint command is configured; skipping mutation-based formatting." | tee "$LOG"
else
  echo "No lint command configured; lint gate skipped." | tee "$LOG"
fi
````````

### `scripts/new-run.py`

````````python
#!/usr/bin/env python3
from pathlib import Path
from datetime import datetime, timezone
import json, re, sys

root = Path(__file__).resolve().parents[1]
template = json.loads((root / '.agent/state-template.json').read_text(encoding='utf-8'))
task = ' '.join(sys.argv[1:]).strip() or 'Unnamed task'
now = datetime.now(timezone.utc)
slug = re.sub(r'[^a-zA-Z0-9\u4e00-\u9fff]+', '-', task).strip('-')[:50] or 'task'
run_id = f"{now.strftime('%Y%m%d-%H%M%S')}-{slug}"
template['run_id'] = run_id
template['created_at'] = now.isoformat()
template['updated_at'] = now.isoformat()
template['task']['goal'] = task
template['task']['user_request'] = task
out_dir = root / '.agent/runs'
out_dir.mkdir(parents=True, exist_ok=True)
out = out_dir / f'{run_id}.json'
out.write_text(json.dumps(template, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(out.relative_to(root))
````````

### `scripts/project-commands.sh`

````````bash
#!/usr/bin/env bash
# Edit this file for the real project. Environment variables override defaults.
# Keep these wrappers consistent with .evospec/module.config.yaml build/environment settings.

PROJECT_BUILD_CMD="${PROJECT_BUILD_CMD:-}"
PROJECT_TEST_CMD="${PROJECT_TEST_CMD:-}"
PROJECT_LINT_CMD="${PROJECT_LINT_CMD:-}"

# Examples:
# PROJECT_BUILD_CMD="cmake -S . -B build && cmake --build build --parallel"
# PROJECT_TEST_CMD="ctest --test-dir build --output-on-failure"
# PROJECT_LINT_CMD="clang-tidy src/*.c -- -Iinclude"
````````

### `scripts/test.sh`

````````bash
#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"
source "$ROOT/scripts/project-commands.sh"
mkdir -p .agent/logs
LOG=".agent/logs/test-$(date +%Y%m%d-%H%M%S).log"

run() {
  echo "+ $*" | tee "$LOG"
  bash -lc "$*" 2>&1 | tee -a "$LOG"
}

if [[ -n "$PROJECT_TEST_CMD" ]]; then
  run "$PROJECT_TEST_CMD"
elif [[ -d build && -f build/CTestTestfile.cmake ]]; then
  run "ctest --test-dir build --output-on-failure"
elif [[ -f pytest.ini || -f pyproject.toml || -d tests ]]; then
  if command -v pytest >/dev/null 2>&1; then run "pytest -q"; else echo "pytest not installed" >&2; exit 2; fi
elif [[ -f package.json ]]; then
  run "npm test -- --runInBand"
elif [[ -f Makefile || -f makefile ]]; then
  run "make test"
else
  echo "No test command configured. Edit scripts/project-commands.sh." | tee "$LOG" >&2
  exit 2
fi
````````

### `scripts/validate-evospec.py`

````````python
#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print("[ERROR] PyYAML is required: python -m pip install pyyaml", file=sys.stderr)
    raise SystemExit(2)

EXPECTED_REFERENCES = {
    "debug-commands.md",
    "env-setup.md",
    "project-info.md",
    "us-board-deploy.md",
    "us-bug-fix.md",
    "us-build.md",
    "us-code-analysis.md",
    "us-feature-dev.md",
    "us-git-submit.md",
    "us-requirements.md",
    "us-rules.md",
}
EXPECTED_TOP_LEVEL = {
    "schema_version", "module", "paths", "work_item", "architecture", "build",
    "artifacts", "deploy", "debug", "git", "development", "code_analysis", "templating"
}


def load_yaml(path: Path) -> Any:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def walk(value: Any, path: str = ""):
    if isinstance(value, dict):
        for key, child in value.items():
            child_path = f"{path}.{key}" if path else str(key)
            yield from walk(child, child_path)
    elif isinstance(value, list):
        for idx, child in enumerate(value):
            yield from walk(child, f"{path}[{idx}]")
    else:
        yield path, value


def frontmatter(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError("missing YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end < 0:
        raise ValueError("unterminated YAML frontmatter")
    data = yaml.safe_load(text[4:end])
    if not isinstance(data, dict):
        raise ValueError("frontmatter must be a mapping")
    return data


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate portable model-skill and .evospec configuration")
    parser.add_argument("--strict", action="store_true", help="fail when unresolved markers remain")
    parser.add_argument("--root", type=Path, help="framework/project root")
    args = parser.parse_args()

    root = args.root.resolve() if args.root else Path(__file__).resolve().parents[1]
    config_path = root / ".evospec/module.config.yaml"
    refs_dir = root / ".agent/skills/model-skill/references"
    rules_dir = root / ".evospec/rules"
    errors: list[str] = []
    warnings: list[str] = []

    if not config_path.exists():
        errors.append(f"missing config: {config_path.relative_to(root)}")
        config: dict[str, Any] = {}
    else:
        try:
            loaded = load_yaml(config_path)
            if not isinstance(loaded, dict):
                raise ValueError("root must be a mapping")
            config = loaded
        except Exception as exc:
            errors.append(f"invalid YAML {config_path.relative_to(root)}: {exc}")
            config = {}

    if config:
        if config.get("schema_version") != 2:
            errors.append(f"unsupported schema_version: {config.get('schema_version')!r}; expected 2")
        missing_sections = sorted(EXPECTED_TOP_LEVEL - set(config))
        if missing_sections:
            errors.append(f"missing config sections: {missing_sections}")
        markers = set(str(x) for x in config.get("templating", {}).get("unresolved_markers", []))
        markers.update({"REQUIRED", "PLACEHOLDER", "TODO_CONFIG"})
        unresolved = []
        for dotted, value in walk(config):
            if dotted.startswith('templating.unresolved_markers'):
                continue
            if isinstance(value, str) and any(marker and marker in value for marker in markers):
                unresolved.append(dotted)
        if unresolved:
            message = "unresolved configuration fields: " + ", ".join(unresolved)
            (errors if args.strict else warnings).append(message)

        artifacts = {
            item.get("id") for item in config.get("artifacts", [])
            if isinstance(item, dict) and item.get("id")
        }
        scenarios = config.get("deploy", {}).get("scenarios", {})
        if isinstance(scenarios, dict):
            for sid, spec in scenarios.items():
                if isinstance(spec, dict) and spec.get("artifact_id") not in artifacts:
                    errors.append(f"deploy.scenarios.{sid}.artifact_id does not match an artifact")

    if not refs_dir.exists():
        errors.append(f"missing references directory: {refs_dir.relative_to(root)}")
    else:
        actual = {p.name for p in refs_dir.glob("*.md")}
        if actual != EXPECTED_REFERENCES:
            errors.append(
                "reference set mismatch: missing=" + str(sorted(EXPECTED_REFERENCES - actual))
                + " extra=" + str(sorted(actual - EXPECTED_REFERENCES))
            )

    index_path = rules_dir / "INDEX.md"
    if not index_path.exists():
        errors.append("missing .evospec/rules/INDEX.md")
    else:
        index_text = index_path.read_text(encoding="utf-8")
        indexed: dict[str, tuple[str, str]] = {}
        for line in index_text.splitlines():
            match = re.match(r"\|\s*(R\d+)\s*\|.*?\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?\.md)\s*\|", line)
            if match:
                rid, applies, status, filename = match.groups()
                indexed[rid] = (status.strip(), filename.strip())
        for rule_path in sorted(rules_dir.glob("R*.md")):
            try:
                meta = frontmatter(rule_path)
            except Exception as exc:
                errors.append(f"invalid rule {rule_path.name}: {exc}")
                continue
            rid = str(meta.get("id", ""))
            status = str(meta.get("status", ""))
            if rid not in indexed:
                errors.append(f"rule not listed in INDEX.md: {rule_path.name}")
                continue
            index_status, index_file = indexed[rid]
            if index_file != rule_path.name:
                errors.append(f"INDEX filename mismatch for {rid}: {index_file} != {rule_path.name}")
            expected_label = "enabled" if status == "enabled" else "disabled"
            if expected_label not in index_status:
                errors.append(f"INDEX status mismatch for {rid}: frontmatter={status}, index={index_status}")

    skill_root = root / ".agent/skills/model-skill"
    for path in skill_root.rglob("*.md") if skill_root.exists() else []:
        if ".codex/skills/model-skill" in path.read_text(encoding="utf-8"):
            errors.append(f"stale source path in {path.relative_to(root)}")

    if warnings:
        print("EvoSpec validation: WARN")
        for warning in warnings:
            print(f"- {warning}")
    if errors:
        print("EvoSpec validation: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1
    if not warnings:
        print("EvoSpec validation: PASS")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
````````

### `scripts/validate-framework.py`

````````python
#!/usr/bin/env python3
from pathlib import Path
import json
import re
import subprocess
import sys
import tomllib

try:
    import yaml
except ImportError:
    print('Framework validation: FAIL')
    print('- PyYAML is required: python -m pip install pyyaml')
    raise SystemExit(2)

root = Path(__file__).resolve().parents[1]
errors = []

for p in root.rglob('*.json'):
    try:
        json.loads(p.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'JSON {p.relative_to(root)}: {e}')

for p in root.rglob('*.toml'):
    try:
        tomllib.loads(p.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'TOML {p.relative_to(root)}: {e}')

for p in root.rglob('*.yaml'):
    try:
        yaml.safe_load(p.read_text(encoding='utf-8'))
    except Exception as e:
        errors.append(f'YAML {p.relative_to(root)}: {e}')

for p in (root / 'scripts').glob('*.sh'):
    result = subprocess.run(['bash', '-n', str(p)], capture_output=True, text=True)
    if result.returncode:
        errors.append(f'Bash {p.relative_to(root)}: {result.stderr.strip()}')

python_files = list((root / 'scripts').glob('*.py'))
python_files.extend((root / '.evospec/scripts').glob('*.py'))
for p in python_files:
    try:
        compile(p.read_text(encoding='utf-8'), str(p), 'exec')
    except Exception as exc:
        errors.append(f'Python {p.relative_to(root)}: {exc}')

required = [
    'AGENTS.md', 'CLAUDE.md', '.agent/router.yaml', '.agent/protocol.md',
    '.agent/skills/registry.yaml', '.agent/skills/model-skill/SKILL.md',
    '.agent/graphs/development.graph.md', '.agent/graphs/skill-workflow.graph.md',
    '.agent/loops/review-loop.md', '.evospec/module.config.yaml',
    '.evospec/rules/INDEX.md', '.codex/agents/reviewer.toml',
    '.claude/agents/reviewer.md', '.pi/skills/graph-loop-runner/SKILL.md',
    'scripts/validate-evospec.py', 'scripts/validate-skills.py',
    'docs/ADDING_SKILLS.md', '.evospec/skills/README.md'
]
for rel in required:
    if not (root / rel).exists():
        errors.append(f'missing required file: {rel}')

# Validate basic Claude frontmatter.
for p in (root / '.claude/agents').glob('*.md'):
    text = p.read_text(encoding='utf-8')
    if not text.startswith('---\n') or '\n---\n' not in text[4:]:
        errors.append(f'invalid Claude frontmatter: {p.relative_to(root)}')
    if not re.search(r'^name:\s*\S+', text, re.M):
        errors.append(f'missing Claude agent name: {p.relative_to(root)}')

# Validate project Skill frontmatter and source-path migration.
skill = root / '.agent/skills/model-skill/SKILL.md'
if skill.exists():
    text = skill.read_text(encoding='utf-8')
    if not text.startswith('---\n') or '\n---\n' not in text[4:]:
        errors.append('invalid model-skill frontmatter')
for p in (root / '.agent/skills/model-skill').rglob('*.md') if (root / '.agent/skills/model-skill').exists() else []:
    if '.codex/skills/model-skill' in p.read_text(encoding='utf-8'):
        errors.append(f'stale .codex skill path: {p.relative_to(root)}')

for validator in ('validate-skills.py', 'validate-evospec.py'):
    result = subprocess.run(
        [sys.executable, str(root / 'scripts' / validator), '--root', str(root)],
        capture_output=True,
        text=True,
    )
    if result.returncode:
        errors.append(f'{validator} failed: ' + (result.stdout + result.stderr).strip())

if errors:
    print('Framework validation: FAIL')
    for e in errors:
        print(f'- {e}')
    sys.exit(1)
print('Framework validation: PASS')
````````

### `scripts/validate-skills.py`

````````python
#!/usr/bin/env python3
from __future__ import annotations

import argparse
import re
import sys
from collections import defaultdict
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:
    print("[ERROR] PyYAML is required: python -m pip install pyyaml", file=sys.stderr)
    raise SystemExit(2)

SKILL_ID_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
ROOT_PATH_FIELDS = (
    "entry",
    "usage",
    "readme",
    "grader",
    "project_config",
    "rules_index",
    "references_root",
)


def load_yaml(path: Path) -> Any:
    return yaml.safe_load(path.read_text(encoding="utf-8"))


def parse_frontmatter(path: Path) -> dict[str, Any]:
    text = path.read_text(encoding="utf-8")
    if not text.startswith("---\n"):
        raise ValueError("missing YAML frontmatter")
    end = text.find("\n---\n", 4)
    if end < 0:
        raise ValueError("unterminated YAML frontmatter")
    data = yaml.safe_load(text[4:end])
    if not isinstance(data, dict):
        raise ValueError("frontmatter must be a mapping")
    return data


def as_mapping(value: Any, label: str, errors: list[str]) -> dict[str, Any]:
    if value is None:
        return {}
    if not isinstance(value, dict):
        errors.append(f"{label} must be a mapping")
        return {}
    return value


def as_reference_list(value: Any, label: str, errors: list[str]) -> list[str]:
    if isinstance(value, str):
        return [value]
    if isinstance(value, list) and all(isinstance(item, str) for item in value):
        return value
    errors.append(f"{label} must be a string or a list of strings")
    return []


def main() -> int:
    parser = argparse.ArgumentParser(description="Validate .agent/skills registry and central Skill packages")
    parser.add_argument("--root", type=Path, help="framework/project root")
    args = parser.parse_args()

    root = args.root.resolve() if args.root else Path(__file__).resolve().parents[1]
    registry_path = root / ".agent/skills/registry.yaml"
    router_path = root / ".agent/router.yaml"
    errors: list[str] = []
    warnings: list[str] = []

    if not registry_path.exists():
        print("Skill validation: FAIL")
        print("- missing .agent/skills/registry.yaml")
        return 1

    try:
        registry = load_yaml(registry_path)
    except Exception as exc:
        print("Skill validation: FAIL")
        print(f"- invalid registry YAML: {exc}")
        return 1

    if not isinstance(registry, dict):
        print("Skill validation: FAIL")
        print("- registry root must be a mapping")
        return 1

    skills = as_mapping(registry.get("skills"), "skills", errors)
    default_skill = registry.get("default_skill")
    if not isinstance(default_skill, str) or not default_skill:
        errors.append("default_skill must be a non-empty string")
    elif default_skill not in skills:
        errors.append(f"default_skill is not registered: {default_skill}")

    graph_ids: set[str] = set()
    if router_path.exists():
        try:
            router = load_yaml(router_path)
            if isinstance(router, dict):
                rules = router.get("rules", [])
                if isinstance(rules, list):
                    for item in rules:
                        if isinstance(item, dict) and isinstance(item.get("graph"), str):
                            graph_ids.add(item["graph"])
        except Exception as exc:
            errors.append(f"cannot parse .agent/router.yaml: {exc}")
    else:
        errors.append("missing .agent/router.yaml")

    route_owners: dict[str, list[str]] = defaultdict(list)

    for skill_id, raw_spec in skills.items():
        label = f"skills.{skill_id}"
        if not isinstance(skill_id, str) or not SKILL_ID_RE.fullmatch(skill_id):
            errors.append(f"invalid Skill ID {skill_id!r}; use lowercase kebab-case")
            continue
        spec = as_mapping(raw_spec, label, errors)
        entry_value = spec.get("entry")
        if not isinstance(entry_value, str) or not entry_value:
            errors.append(f"{label}.entry is required")
            continue

        entry_path = root / entry_value
        expected_root = root / ".agent/skills" / skill_id
        if not entry_path.exists():
            errors.append(f"missing {label}.entry: {entry_value}")
            skill_root = expected_root
        else:
            skill_root = entry_path.parent
            try:
                entry_path.resolve().relative_to(expected_root.resolve())
            except ValueError:
                errors.append(
                    f"{label}.entry must be inside .agent/skills/{skill_id}/; got {entry_value}"
                )

            try:
                meta = parse_frontmatter(entry_path)
            except Exception as exc:
                errors.append(f"invalid frontmatter in {entry_value}: {exc}")
            else:
                if meta.get("name") != skill_id:
                    errors.append(
                        f"frontmatter name mismatch in {entry_value}: {meta.get('name')!r} != {skill_id!r}"
                    )
                description = meta.get("description")
                if not isinstance(description, str) or len(description.strip()) < 12:
                    errors.append(f"frontmatter description is missing or too vague in {entry_value}")

        for field in ROOT_PATH_FIELDS:
            value = spec.get(field)
            if value is None:
                continue
            if not isinstance(value, str) or not value:
                errors.append(f"{label}.{field} must be a non-empty project-root-relative path")
                continue
            candidate = Path(value)
            if candidate.is_absolute():
                errors.append(f"{label}.{field} must be project-root-relative: {value}")
                continue
            path = root / candidate
            try:
                path.resolve().relative_to(root.resolve())
            except ValueError:
                errors.append(f"{label}.{field} escapes the project root: {value}")
                continue
            if not path.exists():
                errors.append(f"missing {label}.{field}: {value}")

        graph_bindings = as_mapping(spec.get("graph_bindings"), f"{label}.graph_bindings", errors)
        for graph_id, raw_refs in graph_bindings.items():
            if graph_ids and graph_id not in graph_ids:
                errors.append(f"{label}.graph_bindings references unknown graph: {graph_id}")
            refs = as_reference_list(raw_refs, f"{label}.graph_bindings.{graph_id}", errors)
            for ref in refs:
                ref_candidate = Path(ref)
                if ref_candidate.is_absolute():
                    errors.append(f"reference must be Skill-root-relative for {label}.graph_bindings.{graph_id}: {ref}")
                    continue
                ref_path = skill_root / ref_candidate
                try:
                    ref_path.resolve().relative_to(skill_root.resolve())
                except ValueError:
                    errors.append(f"reference escapes Skill root for {label}.graph_bindings.{graph_id}: {ref}")
                    continue
                if not ref_path.exists():
                    errors.append(f"missing reference for {label}.graph_bindings.{graph_id}: {ref}")

        auxiliary_routes = as_mapping(spec.get("auxiliary_routes"), f"{label}.auxiliary_routes", errors)
        for route_id, raw_ref in auxiliary_routes.items():
            if not isinstance(route_id, str) or not SKILL_ID_RE.fullmatch(route_id):
                errors.append(f"invalid auxiliary route {route_id!r} in {label}; use kebab-case")
            route_owners[str(route_id)].append(skill_id)
            refs = as_reference_list(raw_ref, f"{label}.auxiliary_routes.{route_id}", errors)
            for ref in refs:
                ref_candidate = Path(ref)
                if ref_candidate.is_absolute():
                    errors.append(f"reference must be Skill-root-relative for {label}.auxiliary_routes.{route_id}: {ref}")
                    continue
                ref_path = skill_root / ref_candidate
                try:
                    ref_path.resolve().relative_to(skill_root.resolve())
                except ValueError:
                    errors.append(f"reference escapes Skill root for {label}.auxiliary_routes.{route_id}: {ref}")
                    continue
                if not ref_path.exists():
                    errors.append(f"missing reference for {label}.auxiliary_routes.{route_id}: {ref}")

        if skill_root.exists():
            expected_dir_name = skill_root.name
            if expected_dir_name != skill_id:
                errors.append(
                    f"Skill directory mismatch: registry key={skill_id}, directory={expected_dir_name}"
                )
            for markdown_path in skill_root.rglob("*.md"):
                text = markdown_path.read_text(encoding="utf-8")
                if ".codex/skills/" in text:
                    errors.append(
                        f"platform-specific central Skill path found in {markdown_path.relative_to(root)}; "
                        "use .agent/skills/ as the canonical path"
                    )

    for route_id, owners in sorted(route_owners.items()):
        if len(owners) > 1:
            errors.append(
                f"auxiliary route {route_id!r} is registered by multiple Skills: {', '.join(owners)}; "
                "route IDs must be globally unique"
            )

    if warnings:
        print("Skill validation: WARN")
        for warning in warnings:
            print(f"- {warning}")

    if errors:
        print("Skill validation: FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"Skill validation: PASS ({len(skills)} registered Skill(s))")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
````````

### `scripts/verify.sh`

````````bash
#!/usr/bin/env bash
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

status=0

echo "===== evospec ====="
if python3 "$ROOT/scripts/validate-evospec.py"; then
  echo "evospec: PASS/WARN"
else
  code=$?
  echo "evospec: FAIL (exit $code)" >&2
  status=1
fi

for step in lint build test; do
  echo "===== $step ====="
  if "$ROOT/scripts/$step.sh"; then
    echo "$step: PASS"
  else
    code=$?
    echo "$step: FAIL (exit $code)" >&2
    status=1
  fi
done
exit "$status"
````````
