# 调试命令

> 调试工具、日志标签、进程和配置文件均来自 `.evospec/module.config.yaml` → `debug`、`deploy`、`module`。

## 日志

- 实时日志：`<config: debug.log_command>`
- 清空日志：`<config: debug.clear_log_command>`
- 保存日志：`<config: debug.save_log_command_windows>`（按当前宿主系统选择）
- 过滤日志：从 `<config: debug.filter_commands>` 选择当前宿主系统模板，将 `{tags}` 替换为 `<config: debug.log_tags>` 拼接结果。

## 进程与服务

对 `<config: module.runtime_processes>` 或 `<config: deploy.processes>` 使用 `<config: debug.process_query_command_template>`；停止进程使用部署配置中的命令模板，不自行假设 `killall`、`pkill` 或 systemd 可用。

## 配置文件

若 `<config: debug.config_files>` 非空，先确认读取权限，再使用项目配置的传输/终端工具查看；为空时不构造路径。

## 常见定位顺序

1. 确认进程/服务是否存在。
2. 抓取未过滤的短窗口完整日志。
3. 用配置 TAG 缩小范围，并定位首个 ERROR/FATAL 或状态偏移。
4. 对照设计、代码分析和当前源码确认调用链。
5. 保存原始日志和复现时间，避免只保留筛选结果。
