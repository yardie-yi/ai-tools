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
