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
