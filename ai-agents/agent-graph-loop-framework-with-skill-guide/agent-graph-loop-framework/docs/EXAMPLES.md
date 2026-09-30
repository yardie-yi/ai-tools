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
