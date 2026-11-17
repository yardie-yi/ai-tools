# Graph + Loop + Skill 执行协议

## 1. 需要持续追踪的复杂任务生命周期

```text
CLASSIFY
  ↓
SELECT_GRAPH
  ↓
SELECT_SKILL_BINDING_OR_ROUTE (如需项目 Skill)
  ↓
LOAD_RELEVANT_CONFIG_AND_RULES (如使用 Skill)
  ↓
CREATE_OR_LOAD_STATE (如需跨阶段恢复)
  ↓
EXECUTE_NODE_LOOP
  ↓
COLLECT_EVIDENCE
  ↓
INDEPENDENT_REVIEW (高风险时)
  ↓
ROUTE_VERDICT
  ↓
DONE / RETRY / REFRESH_AGENT / USER_DECISION / BLOCKED
```

## 2. 分层职责

```text
Graph Router      → 任务宏观路线、权限和停止条件
Graph/Node/Loop   → 需要时管理阶段、迭代、验证、审查和刷新
Skill Registry    → Graph 与阶段 reference 的绑定
Registered Skill  → 显式触发或项目专有阶段的可复用流程；model-skill 是内置 Skill，不是每次任务必选项
.evospec config   → 项目/模块参数
.evospec rules    → 当前阶段启用的项目约束
Verifier/Reviewer → 独立正确性证据
```

任何 Skill 都不得扩大 Graph 的编辑权限、跳过质量门禁或把未配置字段解释为真实值。

## 3. Universal Node Loop

使用 Graph/Loop 的节点按需执行；局部任务无需为套用 Loop 而创建状态文件：

1. **Observe**：只读取当前任务需要的 state（若有）、文件、日志、Skill reference（若选中）和证据。
2. **Decide**：形成一个可证伪的下一步假设或动作。
3. **Act**：只执行一个边界清楚的动作。
4. **Verify**：运行最小但有效的确定性检查。
5. **Update State**：若创建了 state，记录动作、已选 Skill route、证据、错误签名、变更文件和剩余问题。
6. **Route**：退出节点、继续本 Loop、调用子图、刷新 Agent 或升级用户。

## 4. Skill 加载协议

仅在任务显式调用项目 Skill，或确实需要 `.evospec` 专有流程时：

1. 读取 `.agent/skills/registry.yaml`。
2. 核对 Graph 的 `graph_bindings`；辅助阶段使用 `auxiliary_routes`。
3. 读取选中 Skill 的 entry，并只读取选中的 reference。
4. 读取 registry 为该 Skill 声明的 `project_config`；没有项目配置的 Skill 可省略。
5. 读取 registry 声明的 `rules_index`，再加载匹配 route 且 enabled 的规则；未声明 rules index 时不猜测默认规则。
6. 执行 `.agent/nodes/skill-preflight.md`。
7. 若本次使用 run state，将 `selected_skill`、`selected_skill_route`、references、rules 和 unresolved fields 写入 state。

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

- 目标清楚时直接实施；若选择了项目 Skill，先完成必要的 preflight。
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

- 在高风险、跨模块或用户要求独立审查时使用 fresh context、只读。
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
- 执行真实部署、push、远端删除、停止远端进程或覆盖远端文件。

任务范围内的本地编辑、定向检查、构建和测试可直接执行；不因例行本地验证反复询问授权。完成标准是目标结果已交付、相关验证有证据、已知失败与剩余风险已说明；不要求固定全库扫描、全量测试或一律独立 Reviewer。


## 10. 新增 Skill

新增、迁移或扩展 Skill 时，必须遵循 `docs/ADDING_SKILLS.md`。中央实现放在 `.agent/skills/<skill-id>/`，在 `registry.yaml` 注册，并通过 Graph binding、auxiliary route 或独立 Graph 接入。平台目录只允许薄适配器。
