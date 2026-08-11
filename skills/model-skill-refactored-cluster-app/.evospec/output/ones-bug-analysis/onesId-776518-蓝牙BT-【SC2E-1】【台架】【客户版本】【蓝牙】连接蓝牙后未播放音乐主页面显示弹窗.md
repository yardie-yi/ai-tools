# Bug 分析报告

- ONES ID：#776518
- 分析日期：2026-08-11
- 所属模块：蓝牙BT
- 优先级：P1
- 严重程度：错误等级 B（严重程度字段未填写）
- 当前状态：问题提出

## 问题现象

- 前置条件：BAT ON、IGN ON、电压 13.5 V。
- 测试步骤：上电连接蓝牙后进入主页面，不播放音乐。
- 期望结果：仪表主页面正常显示，不出现媒体弹窗。
- 实际结果：连接蓝牙后即使未播放音乐，主页面仍显示媒体弹窗。
- 发生频率：偶尔。
- 环境版本：SOC 00.01.31、MCU 00.00.69、BT 01.03.03。
- 附件：`20260810-103822.jpg`；画面可见主页面左上角出现媒体信息层。
- 历史活动与关联代码提交：ONES 未提供可分析活动或关联提交。

## 原因分析

媒体弹窗的显示链路为：蓝牙服务音乐状态回调 → `BluetoothData` → `MediaData` → `MediaController::musicStateData()` → `StateController::onControlWinStatus()` → Presentation 层显示 `music_screen`。

`MediaController::musicStateData()` 当前仅判断 `stateInfo.state == MUSIC_STATE_PLAY`，随后直接把 `mMediaPlayState` 设为 `true`，没有区分连接会话内的启动同步状态和实际播放进度。`StateController::onControlWinStatus()` 又直接以该布尔值控制媒体弹窗，因此连接阶段只要收到一次未形成实际播放进度的 `PLAY` 同步回调，就会误显示弹窗。

蓝牙服务侧 `AvrcpHandler::doPlaybackDateUpdate()` 会把播放状态、当前进度和总时长一起回调给 HMI；AVRCP 注册完成后还会主动查询一次播放状态，查询响应与 HMI 回调注册存在异步时序窗口，这可以解释问题的偶发性。HMI 当前没有建立连接会话或播放进度基线，属于状态判定条件不完整。

分析阶段 `adb devices` 无已连接设备，无法取得本次复现时的原始板端日志；上述结论基于唯一置真路径、弹窗控制调用链及上下游接口定义，推板后需通过连接但不播放、正常播放、暂停/停止三组场景补充运行证据。

## 代码定位

| 文件 | 可疑位置 | 定位依据 |
|------|----------|----------|
| `awtk/awtkhmi/src/Controller/src/media/mediaController.cpp` | `MediaController::musicStateData()` | 任意 `PLAY` 回调都会把 `mMediaPlayState` 置真，忽略进度和总时长 |
| `awtk/awtkhmi/src/Controller/src/state/stateController.cpp` | `StateController::onControlWinStatus()` | 直接用 `getMediaCurrentState()` 驱动媒体弹窗可见性 |
| `awtk/awtkhmi/src/Presentation/src/media/mediaPresentation.cpp` | `MediaPresentation::updateMediaNodeVisible()` | 根据 Controller 的可见状态更新主界面媒体节点 |
| `awtk/awtkhmi/src/Presentation/src/screen/screenPresentation.cpp` | `ScreenPresentation::updateScreenMediaVisible()` | 投屏界面同样复用媒体可见状态 |

## 修改建议

在 `MediaController::onControl()` 中跟踪手机连接会话，每次连接变化都清空旧的播放进度和可见状态；在 `musicStateData()` 中将当前会话的首个 `PLAY` 回调仅作为进度基线，只有后续 `playingTime` 向前增长才确认正在播放，回退或回零仅更新基线。这样既能过滤冷启动同步和重连陈旧值，也能支持总时长未知但播放进度持续增长的流媒体。

同时用互斥锁保护蓝牙回调线程与主线程共同访问的播放状态，避免断连清零与状态回调并发覆盖。

只修改 Controller 层状态判定，不改变蓝牙协议、回调注册、UI 布局或弹窗优先级。

## 注意事项

- 回归连接蓝牙但不启动播放器，确认主界面和投屏界面均不显示媒体弹窗。
- 回归从 0 秒开始正常播放，允许弹窗在首次播放进度变化后显示。
- 回归暂停、停止、断连及重新连接，确认媒体状态及时清零。
- 关注总时长未知的流媒体：只要 `playingTime` 持续增长仍可显示，避免依赖总时长字段。
- R006：仅在状态变化时记录有效播放判定日志，避免高频位置回调刷屏。
- R007：新增注释使用中文说明判定原因。
- R008：不增加高频 UI 调用，仍由既有状态变化检测驱动界面更新。
