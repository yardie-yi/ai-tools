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
