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
