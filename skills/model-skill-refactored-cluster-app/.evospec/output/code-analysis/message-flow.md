# 消息流与按键处理链路分析

- 最后分析时间：2026-05-11
- 源文件：`src/Model/src/dataDispatcher.h/cpp`, `src/Model/src/basic/basicData.h/cpp`, `src/Controller/src/basic/basicController.h/cpp`, `src/Controller/src/state/stateController.h/cpp`

---

## 一、车辆数据接收流程（LINUX_ENV）

```
MCU / CAN 总线
    │
    ▼ VehicleInterfaceBase::notify(MessageID)
DataDispatcher::notify()
    ├─ CAN UP 消息 → mCanUpNotifyQueue.push()
    │                → mCanUpQueueCond.notify_one()
    │                → canUpWorkerThreadFunc() [异步线程] → processNotifyImpl()
    │
    └─ 普通消息 → processNotifyImpl() [同步]
                    │
                    ├─ 更新 mGaugeData（加 mDataMutex 锁）
                    ├─ 更新 mTelltalesStates[LIGHT_MAX]
                    ├─ 更新 mBasicData / mCarBitData
                    ├─ 更新 mWarningData
                    ├─ 更新 mPowerData / mOTAData / mTripComputerData
                    └─ （特定消息）调用对应 ModelData 子类方法

━━━ 主线程（每帧） ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

AwtkHmi::onUpdate(deltaTime)
    ├─ ControllerDispatcher::dispatch()
    │     └─ 遍历所有 Controller::onControl()
    │           ├─ BasicController → 消费按键队列
    │           ├─ StateController → 按键分发
    │           └─ 各子模块 Controller 处理业务逻辑
    │
    └─ PresentationDispatcher::dispatch()
          └─ 遍历所有 Presentation::onUpdate()
                └─ 各 Presentation 调用 DataDispatcher::getXxx() 拉取数据 → 更新 UI
```

---

## 二、按键处理完整链路

### 2.1 硬件层 → 数据层

```
/dev/input/event1（GPIO 设备文件）
    │  [BasicData GPIO 监听线程，LINUX_ENV]
    ▼
BasicData::handleInputEvent()
    ├─ EV_KEY + KEY_DOWN → handleKeyPress(keyCode)
    │     ├─ 记录 press_time
    │     ├─ 检测双击（间隔 < TIME_DOUBLE_CLICK_MAX=0.35s，仅 OK/UP/DOWN）
    │     └─ 启动长按计时
    │
    └─ EV_KEY + KEY_UP → handleKeyRelease(keyCode)
          ├─ 计算持续时间
          ├─ < 0.5s  → KEY_TYPE_SHORT_PRESS
          ├─ 1~2s    → KEY_TYPE_LONG_PRESS
          ├─ > 2s    → KEY_TYPE_ULTRA_LONG_PRESS
          └─ 加入 enqueueKeyEvent() → mKeyQueue（加 mKeyMutex 锁）
```

**按键硬件值映射**：
```cpp
E_KEY_HW_BACK  = 1  // 返回键
E_KEY_HW_UP    = 2  // 上键（长按连续触发，间隔 0.2s）
E_KEY_HW_DOWN  = 3  // 下键（长按连续触发，间隔 0.2s）
E_KEY_HW_OK    = 4  // 确认键（支持双击）
E_KEY_HW_HOME  = 5  // 主页键
```

**双击支持矩阵**：

| 按键 | 短按 | 长按 | 超长按 | 双击 |
|------|------|------|--------|------|
| BACK | ✅ | ✅ | ✅ | ❌ |
| UP | ✅ | ✅（连续） | ❌ | ✅ |
| DOWN | ✅ | ✅（连续） | ❌ | ✅ |
| OK | ✅ | ✅ | ✅ | ✅ |
| HOME | ✅ | ✅ | ❌ | ❌ |

---

### 2.2 数据层 → 控制层

```
BasicData::mKeyQueue（每帧消费一条）
    │
    ▼ BasicController::onControl()
BasicController::getNextKeyValue(sBasicKeyData&)
    ├─ lock_guard(mKeyMutex)
    ├─ mKeyQueue.front() → outKeyData
    └─ mKeyQueue.pop()

BasicController 保存到：
    int mPendingKeyValue  ← keyInfoHardware
    int mPendingKeyType   ← keyType
```

---

### 2.3 控制层内部分发

```
StateController::onControl()
    │
    ▼ StateController::onKeyManagement()
    ├─ keyValue = BasicController::consumeKeyValue()
    ├─ keyType  = BasicController::consumeKeyType()
    │
    ├─ E_KEY_HW_OK   → onKeyOk(keyType)
    ├─ E_KEY_HW_BACK → onKeyBack(keyType)
    ├─ E_KEY_HW_UP   → onKeyUp(keyType)
    ├─ E_KEY_HW_DOWN → onKeyDown(keyType)
    └─ E_KEY_HW_HOME → onKeyHome(keyType)
         │
         └─ dispatchKeyToSubModule(keyValue, keyType)
               ├─ MenuController::onKeyManagement()
               ├─ PageController::onKeyManagement()
               ├─ MediaController::onKeyManagement()
               ├─ SettingController::onKeyManagement()
               └─ 其他有按键需求的 Controller
```

**PageController 按键消费**：
```cpp
// PagePresentation 主动拉取
int PageController::consumeKeyValue();  // 取出后清零
int PageController::consumeKeyType();
```

---

### 2.4 控制层 → 表示层

```
Presentation::onUpdate()（每帧，主线程）
    ├─ GET(PageController, OBJ_CONTROLLER_PAGE)->consumeKeyValue()
    ├─ GET(DataDispatcher, ...)->getGaugeData()   // 拉取仪表数据
    ├─ GET(DataDispatcher, ...)->getWarningData() // 拉取警告数据
    └─ widget_set_prop_xxx(widget, value)         // 更新 UI 控件
```

---

## 三、数据下行（HMI → 总线）

```cpp
// Controller 层调用，下发控制命令
DataDispatcher::publishToVehicleInterface(int32_t messageID, int32_t value);
DataDispatcher::publishTcsSelect(int32_t value);
DataDispatcher::publishRideMode(uint8_t driveModeSet, uint8_t driveModeSetECM);
```

已知下行消息：

| 消息 ID 宏 | 触发场景 |
|-----------|---------|
| MSG_ID_HMITOCARBIT_ON_PAGE_CHANGE | 页面切换 |
| MSG_ID_HMITOCARBIT_PHONE_TYPE | 蓝牙手机类型上报 |
| MSG_ID_HMITOCARBIT_MAINTENANCE_MILEAGE | 保养里程写入 |
| MSG_ID_HMITOCARBIT_TCS_Select_ACK_P701 | P701 TCS 模式选择 |

---

## 四、线程安全机制汇总

| 共享资源 | 保护机制 | 写入方 | 读取方 |
|---------|---------|--------|--------|
| DataDispatcher 数据缓存 | `mDataMutex`（std::mutex） | notify 线程（LINUX）/ 数据线程 | Presentation（主线程） |
| BasicData::mKeyQueue | `mKeyMutex` | GPIO 监听线程 | BasicController（主线程） |
| CAN UP 队列 | `mCanUpQueueMutex` + condition_variable | notify 线程 | canUpWorkerThread |

**风险点**：DataDispatcher 使用单锁保护全部数据字段，在数据更新密集场景下可能成为竞争热点。

---

## 五、主题切换流程

```
用户按键（OK/设置菜单操作）
    │
    ▼ SettingController::onKeyManagement()
ThemeData::setThemeMode() / setThemeStyle()
    │
    ▼ ThemePresentation::updateThemeDisplay()
navigator_replace(targetPageName)
    │
    ▼ AWTK 加载新页面 XML
新页面 onInstantiate() → PresentationDispatcher 重新绑定 widget
```

**页面名称选择逻辑**（`startPage()` / `ThemePresentation`）：
```
车型 P701:
    SDMS_A → "p701_A_HomePage_Light"
    其他   → "p701_B_HomePage_Light"
车型 SC2E/SC26:
    CLASSIC + 夜间 → "classicPage_Dark"
    CLASSIC + 日间 → "classicPage"
    DYNAMIC + 夜间 → "dynamicPage_Dark"
    DYNAMIC + 日间 → "dynamicPage"
```
