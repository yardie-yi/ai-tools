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
