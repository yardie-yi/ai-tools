# 编译构建

> 所有构建方式和命令来自 `.evospec/module.config.yaml` → `build`；禁止把项目命令写回本文件。

## 执行步骤

1. 确认 `<config: build.enabled>` 为 true。
2. 选择用户指定策略；未指定时使用 `<config: build.default_strategy>`。
3. 读取对应 `<config: build.strategies.<id>>`，检查 `enabled` 和未解析占位符。
4. 记录当前 commit、工作区状态和构建开始时间。
5. 执行 `command` 或按顺序执行 `commands`。
6. 检查退出码、首个错误和 `<config: artifacts>` 中对应产物的存在性与更新时间。

## 失败处理

- 先保留完整输出，再定位第一个有效错误。
- 匹配 `<config: build.common_errors>` 时执行对应 action。
- 自动方式因网络、凭据或外部环境失败时，可展示 `<config: build.strategies.<id>.manual_steps>`，但不得宣称构建成功。
- 清理构建只能使用 `<config: build.clean_command>` 或项目现有可靠命令，不自行猜测。

## 构建结论格式

```text
构建策略：<id>
执行命令：<已脱敏命令>
结果：成功 / 失败 / 未执行
产物：<artifact id、路径、时间>
关键日志：<首个错误或成功摘要>
```

成功后进入 `@references/us-board-deploy.md`；仅需本地验证时可在此结束。
