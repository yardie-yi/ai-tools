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
