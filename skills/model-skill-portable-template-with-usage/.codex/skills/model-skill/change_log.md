# change_log — model-skill

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
