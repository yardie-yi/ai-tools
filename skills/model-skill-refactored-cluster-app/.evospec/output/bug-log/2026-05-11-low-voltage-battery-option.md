# 低电压报警电池电压显示修复记录

## 问题

低电压报警触发时，如果用户在可选信息中勾选了电池电压显示，主界面 `node_Basic` 没有自动切换到 `home_view_battery`。

## 修改

- 在 `PagePresentation::onUpdate()` 中增加低电压报警可选信息同步。
- 新增 `PagePresentation::updateBatteryVoltageAlarmOptionView()`：
  - 低电压报警有效、当前在主界面、且电池电压可选信息已勾选时，强制显示 `home_view_battery`。
  - 报警解除后不主动恢复报警前的可选信息，保持当前电池电压显示，后续由用户按键切换。
- 继续修正：
  - 电池电压可选信息状态改为从 `SettingController` 读取，并同步回 `PageController`，避免页面缓存未及时更新。
  - 强制切换时隐藏全部可选信息视图后只显示 `home_view_battery`，避免当前索引不同步导致主界面残留在其他视图。
  - 增加状态变化日志，输出电压、RPM、报警状态、是否勾选电池项、是否触发强制显示、当前页面和索引。
- 日志补强：
  - 确认当前工作区曾缺失 `updateBatteryVoltageAlarmOptionView()` 调用和实现，已重新补回。
  - 日志等级由 `SLOG_INFO` 调整为 `SLOG_WARN`，并增加空控制器、窗口无效、可选信息为空、导航列表为空等早退日志，便于板端确认函数是否进入。
- 链路日志：
  - `DataDispatcher` 收到 `P701/SC2E/SC26_CANUP_0340` 后打印 `[BatteryVoltageFlow] recv`，包含信号值、缓存值、有效性和 RPM。
  - `TelltalesController::getBatteryVoltageState()` 打印 `[BatteryVoltageFlow] judge`，包含阈值、低压条件、持续时间和报警结果。
  - `PagePresentation::updateBatteryVoltageAlarmOptionView()` 打印 `[BatteryVoltageFlow] page`，包含报警结果、可选信息是否勾选电池电压、是否强制显示 `home_view_battery`。

## 影响范围

- `awtk/awtkhmi/src/Presentation/src/page/pagePresentation.cpp`
- `awtk/awtkhmi/src/Presentation/src/page/pagePresentation.h`

## 验证

- 已完成代码路径静态检查：
  - 低电压报警状态来自 `TelltalesController::getBatteryVoltageState()`。
  - 可选信息勾选状态来自 `PageController::getOptionInfoList()`。
  - 可见性切换复用现有 `AwtkUtil::setWidgetVisible()`。
- 未在当前 Windows shell 执行完整编译；项目配置要求通过上层 `build-script` 初始化 `ac8215e` 交叉环境后执行 `make cluster-app`。
