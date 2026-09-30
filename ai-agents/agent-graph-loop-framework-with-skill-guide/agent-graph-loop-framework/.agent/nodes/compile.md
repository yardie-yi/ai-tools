# Node: COMPILE

- 按任务选用已确认有效的本地构建命令；若使用项目 wrapper `./scripts/build.sh` 或 `.evospec` 策略，先确认其真实行为、shell、目标和 artifact 与配置一致。模板中的默认命令不等于当前项目已可执行。
- 保存完整日志到 `.agent/logs/`，主状态只保留关键错误和签名。
- 记录命令、exit code、目标、配置和时间。
- Build PASS 只证明构建门禁，不证明需求完整。
