# 功能开发

## 适用场景

- 新增界面模块（Controller / Presentation / Data 层）
- 新增车辆信号处理逻辑
- 扩展现有界面功能或状态机

---

## 新增信号处理模块（最常见场景）

cluster-app 采用 MVC 分层结构：`Data → Controller → Presentation`

### 步骤 1：在 Data 层订阅信号

在对应 `*Data.cpp` 中订阅 PPS/VehicleInterface 信号：

```cpp
// 参考 OBJ_DATA_* 枚举，在 DataXxx::init() 中注册
void DataBasic::init() {
    SLOG_INFO("DataBasic::init begin");
    // 订阅车速信号
    ppsReader_->subscribe("vehicle_speed", [this](const PpsValue& val) {
        onSpeedChanged(val.toInt());
    });
    SLOG_INFO("DataBasic::init done");
}
```

### 步骤 2：在 Controller 层处理业务逻辑

在对应 `*Controller.cpp` 中实现状态处理：

```cpp
void ControllerBasic::onSpeedChanged(int speed) {
    SLOG_DEBUG("onSpeedChanged: speed=%d, prev=%d", speed, speed_);
    if (speed < 0) {
        SLOG_ERROR("Invalid speed: %d", speed);
        return;
    }
    speed_ = speed;
    SLOG_INFO("Speed state updated: %d km/h", speed_);
    GET(PresentationBasic, OBJ_PRESENTATION_BASIC)->updateSpeed(speed_);
}
```

### 步骤 3：在 Presentation 层更新 AWTK 控件

```cpp
void PresentationBasic::updateSpeed(int speed) {
    SLOG_DEBUG("updateSpeed: speed=%d", speed);
    widget_t* label = widget_lookup(win_, "speed_label", true);
    if (!label) {
        SLOG_ERROR("updateSpeed: widget 'speed_label' not found");
        return;
    }
    widget_set_text_utf8(label, std::to_string(speed).c_str());
}
```

### 步骤 4：在 CMakeLists 中确认文件已加入编译

参考当前 `CMakeLists.txt` 中的 `target_sources` 或 `add_library`，确认新增 .cpp 已包含。

---

## 日志规范（R006 检查点）

> **R006 强制要求**：生成代码时以下四类位置必须加日志，缺少任一类别需补充后再交付。

```cpp
#include "common/src/commonProj.h"
using namespace ClusterhmiCommon;
```

| 位置 | 宏 | 示例 |
|------|-----|------|
| 关键函数入口 | `SLOG_DEBUG` | `SLOG_DEBUG("onSpeedChanged: speed=%d", speed);` |
| 错误返回 / 控件找不到 | `SLOG_ERROR` | `SLOG_ERROR("widget '%s' not found", widgetName);` |
| 关键状态变化 | `SLOG_INFO` | `SLOG_INFO("Speed updated: %d km/h", speed_);` |
| 初始化 / 注册完成 | `SLOG_INFO` | `SLOG_INFO("DataBasic::init done");` |
| 超时 / 降级 / 使用默认值 | `SLOG_WARN` | `SLOG_WARN("Signal timeout, fallback to last: %d", last_);` |

**违规示例（禁止）：**

```cpp
// ❌ 用 printf 替代
printf("speed=%d\n", speed);

// ❌ 错误分支不打印原因
if (!label) return;

// ❌ 仅 init 有日志，业务函数全无

// ❌ 定时器回调内无限制打印（16ms 触发，每秒 60+ 条日志）
static ret_t onTimer(const timer_info_t* info) {
    SLOG_DEBUG("onTimer: speed=%d", speed_);  // 刷屏
    updateDisplay();
    return RET_REPEAT;
}
```

**循环 / 高频回调中的日志写法（必须限频）：**

```cpp
// ✅ 方式 A：信号值变化时才打印（首选，适合 PPS 轮询）
void onSpeedPoll() {
    int new_speed = ppsReader_->get("vehicle_speed").toInt();
    if (new_speed != last_speed_) {
        SLOG_INFO("Speed changed: %d -> %d km/h", last_speed_, new_speed);
        last_speed_ = new_speed;
    }
}

// ✅ 方式 B：计数器限频（适合 AWTK 定时器）
static ret_t onTimer(const timer_info_t* info) {
    static int cnt = 0;
    if (++cnt >= 60) {          // 16ms × 60 ≈ 每秒打一次
        SLOG_DEBUG("Timer: speed=%d, rpm=%d", speed_, rpm_);
        cnt = 0;
    }
    updateDisplay();
    return RET_REPEAT;
}

// ✅ 方式 C：首次 + 恢复（适合信号丢失监控）
if (!signal_ok && !err_reported_) {
    SLOG_ERROR("Signal lost: %s", signalName);
    err_reported_ = true;
} else if (signal_ok && err_reported_) {
    SLOG_INFO("Signal recovered: %s", signalName);
    err_reported_ = false;
}
```

---

## 循环中的 AWTK 接口调用规范（R008 检查点）

> **R008 强制要求**：在 `onUpdate`、定时器回调、PPS 轮询等高频循环中，AWTK UI 接口（`widget_move`、`widget_set_value`、`widget_set_visible` 等）**只在数据实际变化时才调用**，禁止每帧无条件调用。

循环中每次都调用这些接口，即使数据没变化，AWTK 也会触发重绘和布局计算，在 16ms 帧周期内持续消耗 CPU，导致界面卡顿或功耗升高。

**违规示例（禁止）：**

```cpp
// ❌ 每帧无条件设置位置，即使坐标没变化
static ret_t onUpdate(const timer_info_t* info) {
    auto* self = (PresentationBasic*)info->ctx;
    widget_move(self->needle_, self->x_, self->y_);  // 每帧都跑，浪费性能
    return RET_REPEAT;
}
```

**正确写法（变化才调用）：**

```cpp
// ✅ 方式 A：缓存上次值，有变化才调用接口（适合定时器轮询）
static ret_t onUpdate(const timer_info_t* info) {
    auto* self = (PresentationBasic*)info->ctx;
    if (self->x_ != self->last_x_ || self->y_ != self->last_y_) {  // 变化检测
        widget_move(self->needle_, self->x_, self->y_);              // 只在变化时移动
        self->last_x_ = self->x_;                                    // 更新缓存值
        self->last_y_ = self->y_;
    }
    return RET_REPEAT;
}

// ✅ 方式 B：回调驱动（推荐）—— 用信号变化回调代替轮询，天然只在变化时触发
void PresentationBasic::onSpeedChanged(int speed) {
    if (speed == last_speed_) return;          // 相同值直接返回，双重保护
    last_speed_ = speed;                        // 更新缓存
    widget_set_value(needle_, speed);           // 变化时才调用 AWTK 接口
}
```

**需要变化检测的常见接口：**

| 接口 | 开销 |
|------|------|
| `widget_move` / `widget_resize` | 触发布局重算 |
| `widget_set_value` / `widget_set_text_utf8` | 触发重绘 |
| `widget_set_visible` / `widget_set_opacity` | 触发属性更新+重绘 |
| `image_set_image` | 触发图片解码+重绘 |

**成员变量命名惯例**：缓存值用 `last_` 前缀，如 `last_speed_`、`last_x_`、`last_visible_`。

---

## 中文注释规范（R007 检查点）

> **R007 强制要求**：生成的每一行非空代码（除单独括号和 `#include`）必须附中文注释。

| 注释位置 | 格式 | 适用情况 |
|----------|------|----------|
| 行尾 `//` | `代码;  // 说明` | 代码行 ≤ 60 字符 |
| 行前 `//` | 独立一行写在代码上方 | 代码行较长或逻辑复杂 |

```cpp
// ✅ 正确示例
int last_speed_ = 0;                         // 上次车速，用于变化检测避免刷屏
speed_ = speed;                              // 保存最新车速
if (!label) {                                // 控件不存在，可能布局文件未加载
    SLOG_ERROR("widget not found: speed_label"); // 打印控件名方便定位
    return;                                  // 提前退出，避免空指针崩溃
}
// 通知 Presentation 层刷新仪表盘，speed_ 已更新
GET(PresentationBasic, OBJ_PRESENTATION_BASIC)->updateSpeed(speed_);

// ❌ 违规示例（无注释）
int last_speed_ = 0;
speed_ = speed;
if (!label) {
    SLOG_ERROR("widget not found");
    return;
}
```

## 完成后

进入编译阶段：`@references/us-build.md`
