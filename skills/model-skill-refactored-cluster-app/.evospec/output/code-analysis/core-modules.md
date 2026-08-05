# 核心模块分析

- 最后分析时间：2026-05-11
- 源文件：`src/awtkhmi.h`, `src/awtkhmi.cpp`, `src/Model/src/dataDispatcher.h`, `src/Controller/src/controllerDispatcher.h`, `src/Presentation/src/presentationDispatcher.h`, `src/common/objectAbstract.h`, `src/common/commonProj.h`

---

## 一、AwtkHmi — 主应用管理类

**文件**：`src/awtkhmi.h` / `src/awtkhmi.cpp`

**职责**：应用全生命周期管理、集中持有 24+个 Data/Controller/Presentation 实例、定时器与线程管理、内存监控。

**关键成员变量**：
```cpp
ObjectAbstract* object[ClusterCommon::OBJ_SUM]; // 全局对象数组（索引式访问）
// 24 个 Data 指针：m_*DataPtr
// 25 个 Controller 指针：m_*ControllerPtr
// 22 个 Presentation 指针：m_*PresentationPtr
SelfTimer m_selfTimer;           // 软件定时器
Thread m_dataThread;             // 数据采集后台线程
static uint64_t s_lastMemoryPrintTime; // 内存打印节流（间隔 MEMORY_PRINT_INTERVAL_MS=5000ms）
```

**关键方法**：

| 方法 | 位置（行） | 说明 |
|------|-----------|------|
| `getInstance()` | awtkhmi.cpp:88 | Meyer's Singleton |
| `init()` | awtkhmi.cpp:176 | 阶段一：创建 Data+Controller，启动数据线程 |
| `initLater()` | awtkhmi.cpp:240 | 阶段二：创建 Presentation，在首帧 onUpdate 后调用 |
| `initViews()` | awtkhmi.cpp:274 | 触发 PresentationDispatcher::initViews()，绑定 widget |
| `deinit()` | awtkhmi.cpp:280 | 停线程→反初始化 Dispatcher→delete 实例 |
| `registerInstance()` | awtkhmi.cpp:485 | new 24个Data + 25个Controller，写入 object[] |
| `registerInstanceLater()` | awtkhmi.cpp:302 | new 22个Presentation，写入 object[] |
| `unregisterInstance()` | awtkhmi.cpp:668 | delete 全部实例，置 nullptr |
| `onUpdate(deltaTime)` | awtkhmi.cpp:749 | 每帧驱动 ControllerDispatcher + PresentationDispatcher dispatch |
| `getObject(index)` | awtkhmi.cpp:777 | 通过枚举索引取对象（供 GET 宏使用） |
| `createTimer/startTimer/stopTimer` | awtkhmi.cpp:786-799 | 封装 SelfTimer，供各层使用 |

**两阶段初始化原因**：Bluetooth 初始化顺序有严格依赖（BluetoothData → MediaData → PhoneData），且 Presentation 层需要等 AWTK widget 树构建完成后才能绑定控件。

**访问宏**：
```cpp
#define APPLICATION AwtkHmi::getInstance()
#define GET(CLASS, num) static_cast<CLASS*>(APPLICATION->getObject(num))
// 示例：BasicData* p = GET(BasicData, OBJ_DATA_BASIC);
```

---

## 二、DataDispatcher — 数据调度器

**文件**：`src/Model/src/dataDispatcher.h` / `dataDispatcher.cpp`

**职责**：继承 VehicleInterfaceBase，订阅 CAN/MCU 消息，线程安全缓存车辆数据，提供 getter 供 Presentation 拉取。

**关键成员变量**：
```cpp
std::vector<ModelData*> objVector;  // 所有 ModelData 实例

// 数据缓存（全部受 mDataMutex 保护）
mutable std::mutex mDataMutex;
ClusterCommon::sGaugeData mGaugeData;
int mTelltalesStates[LIGHT_MAX];
sBasicData mBasicData;
sCarBitData mCarBitData;
sOTAData mOTAData;
sTripComputerData mTripComputerData;
sPowerData mPowerData;
std::vector<sWarningData> mWarningData;

// CAN UP 异步处理
std::queue<uint32_t> mCanUpNotifyQueue;
std::mutex mCanUpQueueMutex;
std::condition_variable mCanUpQueueCond;
std::thread mCanUpWorkerThread;
bool mCanUpWorkerStop;
```

**关键方法**：

| 方法 | 说明 |
|------|------|
| `getInstance()` | 单例 |
| `addObject(ModelData*)` | 注册 ModelData 实例 |
| `init() / deinit()` | 初始化/反初始化（含订阅信号槽） |
| `dispatch()` | 遍历 objVector 调用 ModelData::onData() |
| `notify(MessageID)` | CAN 消息回调入口（LINUX_ENV） |
| `processNotifyImpl()` | 解包消息，更新数据缓存 |
| `canUpWorkerThreadFunc()` | CAN UP 消息专用异步线程 |
| `getGaugeData()` | 返回 sGaugeData 副本（加锁） |
| `getTelltalesStatesCopy(states[])` | 复制指示灯数组（加锁） |
| `getWarningData()` | 返回 warning 列表副本（加锁） |
| `publishToVehicleInterface(msgID, value)` | 下发消息到总线 |

**已知消息 ID（LINUX_ENV）**：
- `MSG_ID_HMITOCARBIT_ON_PAGE_CHANGE` — 页面切换通知
- `MSG_ID_HMITOCARBIT_PHONE_TYPE` — 手机类型
- `MSG_ID_HMITOCARBIT_MAINTENANCE_MILEAGE` — 保养里程
- `MSG_ID_HMITOCARBIT_TCS_Select_ACK_P701` — P701 TCS 响应

---

## 三、ModelData — 数据模块基类

**文件**：`src/Model/src/modelData.h`

```cpp
class ModelData : public ObjectAbstract {
    virtual bool init() = 0;
    virtual void deinit() = 0;
    virtual void onData();  // DataDispatcher::dispatch() 中调用
};
```

**子类清单（24 个）**：
`AdasData` / `AnimationData` / `BasicData` / `BluetoothData` / `WifiData` / `ChargeData` / `GaugeData` / `IlluminationData` / `MediaData` / `MenuData` / `PageData` / `NavigationData` / `OtaData` / `PowerData` / `StateData` / `TelltalesData` / `ThemeData` / `TripComputerData` / `WarningData` / `HomeData` / `PhoneData` / `ScreenData` / `SettingData` / `VehicleData`

**BasicData 特殊说明**：
```cpp
// 按键队列（GPIO 线程写入，Controller 主线程消费）
std::queue<sBasicKeyData> mKeyQueue;
std::mutex mKeyMutex;

// 按键时间阈值
TIME_SHORT_PRESS_MAX    = 0.5s
TIME_LONG_PRESS_MIN     = 1.0s
TIME_DOUBLE_CLICK_MAX   = 0.35s   // 仅 OK/UP/DOWN 支持双击
TIME_RAPID_CHANGE_INTERVAL = 0.2s  // 长按连续触发（仅 UP/DOWN）
```

---

## 四、Controller — 控制器基类

**文件**：`src/Controller/src/controller.h`

```cpp
class Controller : public ObjectAbstract {
    virtual bool init() = 0;
    virtual void deinit() = 0;
    virtual void onControl();                     // 每帧业务逻辑
    virtual void onKeyManagement(int keyValue = -1, int keyType = -1);
};
```

**ControllerDispatcher**：
```cpp
static std::vector<Controller*> objVector;
void dispatch();  // 遍历调用所有 Controller::onControl()
```

**关键子类职责**：

| 控制器 | 核心职责 |
|--------|---------|
| BasicController | 消费按键队列（consumeKeyValue/consumeKeyType），管理音量 |
| StateController | **全局状态协调，按键分发中心**（dispatch key 到各子模块） |
| GaugeController | 处理仪表数据，速度单位转换（km/h ↔ mph） |
| PageController | 页面状态管理，OTA 状态查询 |
| MediaController | 媒体可见性，音量，音乐状态回调 |
| ThemeController | 读取主题风格，组合显示模式 |
| WarningController | 警告数据获取，界面可见性控制 |
| ChimeController | 蜂鸣器控制，无对应 Presentation |
| PowerController | 电源状态管理，无对应 Presentation |
| StateController | 全局状态（蓝牙/OTA/投屏），无对应 Presentation |

---

## 五、Presentation — 表示层基类

**文件**：`src/Presentation/src/presentation.h`

```cpp
class Presentation : public ObjectAbstract {
    virtual bool init();
    virtual void deinit();
    virtual void onUpdate();          // 每帧 UI 更新（主动拉取 Controller 数据）
    virtual void onInstantiate();     // UI 实例化
    virtual void initViews();         // 查找并缓存 widget 指针
    virtual void onViewEnter();       // 进入页面
    virtual void onViewBack();        // 离开页面
    virtual void onKeyManagement(int keyValue = -1, int keyType = -1);
};
```

**PresentationDispatcher**：
```cpp
static std::vector<Presentation*> objVector;
void initViews();  // 调用所有 Presentation::initViews()
void dispatch();   // 调用所有 Presentation::onUpdate()
```

**BasicPresentation 关键成员**：
```cpp
// UI 缓存值（避免每帧重复写入相同值）
int mGearValue, mODOValue, mTempValue;
int mTimeHour, mTimeMinute;
std::string mSoftwareVersion;
uint8_t mLoTempFlashCnt, mTimeFlashCnt;

// 更新方法
void updateGear();
void updateODOTrip();
void updateTemp();
void updateTime();
void updateVolumeDisplayUI();
void updateLoTempTip();  // 低温结冰图标
```

---

## 六、定时器 ID 分配（selfTimerID 枚举）

| ID | 用途 | 使用者 |
|----|------|--------|
| SELF_TIMER_ID1 | 油表闪烁 | GaugePresentation |
| SELF_TIMER_ID2 | 快速换挡计时 | TelltalesPresentation |
| SELF_TIMER_ID24 | 时间闪烁 | BasicPresentation |
| SELF_TIMER_ID25 | 诊断模式结果变化 | WarningPresentation |
| SELF_TIMER_ID26 | 水温表闪烁 | GaugePresentation |

（完整列表约 30+ 个，详见 `commonProj.h` 的 selfTimerID 枚举）

---

## 七、对象枚举 → 类型映射

详见 `架构设计.md` § 14.1，或 `commonProj.h` 的 `ObjectEnum`。

快速索引：
- `OBJ_DATA_*` (OBJ_DATA_BASIC ~ OBJ_DATA_VEHICLE) — 24 个 ModelData
- `OBJ_CONTROLLER_*` (OBJ_CONTROLLER_BASIC ~ OBJ_CONTROLLER_VEHICLE) — 25 个 Controller
- `OBJ_PRESENTATION_*` (OBJ_PRESENTATION_HOME ~ OBJ_PRESENTATION_WIFI) — 22 个 Presentation
