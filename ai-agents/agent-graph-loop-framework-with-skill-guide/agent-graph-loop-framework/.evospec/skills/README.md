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
