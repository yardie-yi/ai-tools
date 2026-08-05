# awtkhmi 进程初始化流程与时序分析

> 反向生成（代码 → 文档）  
> 源码路径：`cluster-app/awtk/awtkhmi/src/`  
> 核心文件：`main.c` / `application.cpp` / `awtkhmi.cpp`

---

## 一、整体架构

awtkhmi 采用三层 MVC 架构：

```
Model（Data）      ← 原始信号数据，22 个模块
Controller         ← 业务逻辑，25 个模块
Presentation       ← UI 绑定，22 个模块
```

初始化分为**两阶段**，目的是让窗口尽快显示、避免等待数据线程就绪：

| 阶段 | 时机 | 内容 |
|------|------|------|
| 阶段一（`init`） | `application_init` 同步调用 | Model + Controller + Dispatcher + 数据线程 |
| 阶段二（`initLater`） | idle 回调检测到第一次 `onUpdate` 后调用 | Presentation + UI 绑定 |

---

## 二、完整时序图

```
进程启动
  │
  ▼
[main.c] awtk_main.inc → AWTK 框架初始化（LCD / 事件循环 / 资源管理器）
  │
  ▼
[application.cpp:363] application_init()          ← 框架调用，程序唯一入口
  │
  ├─ [awtkhmi.cpp:176] AwtkHmi::init()
  │     ├─ registerInstance()                      ← 创建 24个Data + 25个Controller 并注册到 object[]
  │     ├─ DataDispatcher::init()                  ← 初始化数据分发器（订阅信号槽）
  │     ├─ ControllerDispatcher::init()            ← 初始化控制器分发器
  │     └─ m_dataThread.run(DataDispatcher::run)   ← 启动数据采集后台线程
  │
  ├─ idle_add(application_on_idle)                 ← 注册主循环空闲回调
  ├─ g_process_start_time = getCurrentTimeMs()     ← 记录进程启动时间戳
  ├─ custom_widgets_register()                     ← 注册自定义控件
  └─ 检测 OTA 升级文件（决定是否隐藏 rootNode）
       └─ mStartUpdateCount = 1

━━━ AWTK 主循环开始 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[application.cpp:216] application_on_idle()        ← 每帧调用，返回 RET_REPEAT
  │
  ├─ [第一次调用] startPage()                       ← 根据车型/主题/显示模式打开初始页面
  │     ├─ SettingController → 读取车型/主题/显示模式
  │     ├─ navigator_to(startPage)                  ← 导航到目标页面（UI 窗口加载）
  │     └─ getIGNStatusFromArm2()                   ← 从 devicetree 读取点火状态
  │
  ├─ [持续调用] 帧时间计算（delta_time）
  │
  ├─ [检测到 rootNode 首次出现]
  │     ├─ 记录 "进程启动→窗口可见" 时间
  │     ├─ windowVisibleDetected = true
  │     └─ [IGN=4 时] 设置 Node_ACC_ON opacity=0（隐藏开机动画节点）
  │
  ├─ [窗口可见 10 帧后]
  │     ├─ 记录 "进程启动→首帧渲染完成" 时间
  │     └─ system("cat /proc/bootprof")             ← 写入 bootprof 性能数据
  │
  ├─ [windowVisibleDetected && mStartUpdateCount >= 1]
  │     ├─ AwtkHmi::onUpdate(delta_time)            ← 驱动 Controller + Presentation 分发
  │     │
  │     └─ [mStartUpdateCount == 1，即首次 onUpdate]
  │           ├─ application_on_launch()            ← 阶段二初始化（仅执行一次）
  │           │     ├─ AwtkHmi::initLater()
  │           │     │     ├─ registerInstanceLater() ← 创建 22 个 Presentation 实例
  │           │     │     └─ PresentationDispatcher::init()
  │           │     └─ AwtkHmi::initViews()
  │           │           └─ PresentationDispatcher::initViews() ← UI 组件绑定
  │           │
  │           └─ McuLogService::getInstance()->Init() ← 初始化 MCU 日志服务
  │
  └─ FPS 统计（每 ~10 秒打印一次）
```

---

## 三、函数逐一注释

### 3.1 `main.c` — 框架入口

#### `main.c`（通过 `awtk_main.inc` 展开）
- **位置**：`main.c:19`
- **作用**：AWTK 框架的真实 `main()` 实现，负责 LCD 初始化、资源加载、事件循环启动，完成后回调 `application_init()`。
- **关键宏定义**：

```c
#define APP_LCD_ORIENTATION LCD_ORIENTATION_0   // 屏幕方向：横屏0度
#define APP_TYPE APP_SIMULATOR                   // 运行类型（模拟器/嵌入式）
#define APP_NAME "awtkhmi"                       // 应用名称
```

---

### 3.2 `application.cpp` — 应用层生命周期

#### `application_init()` — 主初始化入口
- **位置**：`application.cpp:363`
- **调用时机**：AWTK 框架启动完成后回调，全程只执行一次。
- **作用**：完成阶段一初始化，注册 idle 回调，设置启动时间戳，检测 OTA 状态。
- **执行顺序**：

```
1. AwtkHmi::init()          → MVC 阶段一初始化
2. idle_add(on_idle)        → 注册每帧回调
3. g_process_start_time     → 记录启动时间戳
4. custom_widgets_register  → 注册自定义控件
5. OTA 文件检测             → 决定 rootNode 是否隐藏
6. mStartUpdateCount = 1    → 允许 initLater 在首帧 onUpdate 后触发
```

---

#### `application_on_launch()` — 阶段二初始化（单次触发）
- **位置**：`application.cpp:56`
- **调用时机**：idle 回调中检测到 `windowVisibleDetected && mStartUpdateCount == 1` 时触发，仅执行一次。
- **作用**：在窗口已可见、首帧已更新后，安全地初始化 Presentation 层和 UI 绑定，避免初始化时 widget 尚未加载。

```c
AwtkHmi::getInstance()->initLater();   // 创建 22 个 Presentation 实例
AwtkHmi::getInstance()->initViews();   // 触发 UI 组件绑定
```

---

#### `application_on_idle()` — 主循环驱动（每帧调用）
- **位置**：`application.cpp:216`
- **调用时机**：AWTK 主循环每帧触发，返回 `RET_REPEAT` 保持循环。
- **作用**：承担整个运行期的帧调度职责。按帧状态分段执行：

| 条件 | 执行动作 |
|------|---------|
| `!mStartPageFlag` | 调用 `startPage()` 打开初始页面（仅一次） |
| `rootNode` 首次出现 | 记录窗口可见时间，处理动画节点透明度 |
| 窗口可见满 10 帧 | 记录首帧渲染时间，写 bootprof |
| `windowVisibleDetected && count >= 1` | 驱动 `onUpdate`，触发 `application_on_launch` |
| 持续运行 | FPS 统计，约每 10 秒输出一次 |

- **关键局部变量**：

```cpp
static uint64_t lastUpdateTime       // 上一帧时间戳，计算 delta_time
static bool firstFrameLogged         // 是否已记录首帧时间
static bool windowVisibleDetected    // rootNode 是否已检测到
static int frameCountAfterVisible    // 窗口可见后帧计数（等10帧确认渲染完成）
```

---

#### `application_on_exit()` — 进程退出清理
- **位置**：`application.cpp:133`
- **调用时机**：AWTK 框架退出时回调，全程只执行一次。
- **作用**：调用 `AwtkHmi::deinit()` 释放全部 MVC 资源，停止数据线程。

---

#### `startPage()` — 初始页面选择与跳转
- **位置**：`application.cpp:143`
- **调用时机**：idle 回调首帧调用。
- **作用**：根据车型、主题、显示模式三个维度选择目标页面并跳转。

```
车型 == P701:
    主题 == SDMS_A  →  "p701_A_HomePage_Light"
    主题 == SDMS_B  →  "p701_B_HomePage_Light"
车型 == SC2E/SC26:
    主题 == CLASSIC:
        夜间模式  →  "classicPage_Dark"
        日间模式  →  "classicPage"
    主题 == DYNAMIC:
        夜间模式  →  "dynamicPage_Dark"
        日间模式  →  "dynamicPage"
```

读取 IGN 状态：`/sys/firmware/devicetree/base/chosen/ignstatus`

---

#### `getIGNStatusFromArm2()` — 读取点火状态
- **位置**：`application.cpp:82`
- **调用时机**：`startPage()` 内同步调用。
- **作用**：从 devicetree 节点文件读取 arm2 上报的点火（IGN）状态整数值，默认值为 `POWER_STATUS_NORMAL_RUN`。
- **返回值**：整型，`4` 表示某特定 IGN 状态（触发动画节点隐藏逻辑）。

---

#### `custom_widgets_register()` — 注册自定义控件
- **位置**：`application.cpp:42`
- **调用时机**：`application_init()` 中同步调用。
- **作用**：向 AWTK 控件系统注册两个项目专用控件：

| 控件 | 函数 | 用途 |
|------|------|------|
| 标准圆弧进度条 | `standard_arc_progress_register()` | 经典主题仪表盘 |
| 异形进度条 | `progress_polygon_register()` | 动感/P701 主题 |

---

### 3.3 `awtkhmi.cpp` — MVC 主控类

#### `AwtkHmi::getInstance()` — 单例获取
- **位置**：`awtkhmi.cpp:88`
- **作用**：Meyer's Singleton，返回唯一的 `AwtkHmi` 实例。

---

#### `AwtkHmi::AwtkHmi()` — 构造函数
- **位置**：`awtkhmi.cpp:94`
- **作用**：将全部 Data / Controller / Presentation 指针初始化为 `nullptr`，将 `object[]` 数组清零。不执行任何业务逻辑。

---

#### `AwtkHmi::init()` — 阶段一初始化（同步）
- **位置**：`awtkhmi.cpp:176`
- **调用时机**：`application_init()` 直接调用。
- **作用**：创建并注册 Model 和 Controller 实例，初始化分发器，启动数据采集线程。
- **内存打点**：在各步骤间调用 `printMemoryUsage()` 记录内存增长。

```
Step 1: registerInstance()           → new 24个Data + 25个Controller
Step 2: DataDispatcher::init()       → 初始化数据订阅/分发机制
Step 3: ControllerDispatcher::init() → 初始化控制器调度
Step 4: (已注释) PresentationDispatcher::init()
Step 5: m_dataThread.run(DataDispatcher::run) → 启动后台数据采集线程
```

---

#### `AwtkHmi::initLater()` — 阶段二初始化（延迟）
- **位置**：`awtkhmi.cpp:240`
- **调用时机**：`application_on_launch()` 中调用，在首帧 `onUpdate` 后执行。
- **作用**：创建 22 个 Presentation 实例，初始化表示层分发器。与阶段一分离的原因：确保 AWTK widget 树已完整构建后再进行 UI 绑定。

```
registerInstanceLater()                → new 22个Presentation
PresentationDispatcher::init()         → 初始化表示层分发
```

---

#### `AwtkHmi::initViews()` — UI 组件绑定
- **位置**：`awtkhmi.cpp:274`
- **调用时机**：`application_on_launch()` 中调用，紧接 `initLater()` 后执行。
- **作用**：调用 `PresentationDispatcher::initViews()`，让各 Presentation 查找并绑定对应的 AWTK widget。

---

#### `AwtkHmi::onUpdate(deltaTime)` — 每帧驱动
- **位置**：`awtkhmi.cpp:749`
- **调用时机**：`application_on_idle()` 中每帧调用（窗口可见后）。
- **作用**：驱动 Controller 和 Presentation 两层的分发（dispatch），以及内部定时器处理和定期内存打印。

```cpp
ControllerDispatcher::getInstance()->dispatch();   // 控制器逻辑更新
PresentationDispatcher::getInstance()->dispatch(); // UI 数据绑定刷新
m_selfTimer.timerHandle();                         // 软件定时器处理
```

---

#### `AwtkHmi::registerInstance()` — 阶段一实例注册
- **位置**：`awtkhmi.cpp:485`
- **作用**：创建 24 个 Data 实例和 25 个 Controller 实例，并写入 `object[]` 全局数组。
- **蓝牙特殊顺序**：`BluetoothData → MediaData → PhoneData`（依赖 AVRCP / PBAP / HFP 初始化顺序）。

---

#### `AwtkHmi::registerInstanceLater()` — 阶段二实例注册
- **位置**：`awtkhmi.cpp:302`
- **作用**：创建 22 个 Presentation 实例并写入 `object[]` 数组的 Presentation 区段。Data 和 Controller 部分已被注释掉（阶段一已完成）。

---

#### `AwtkHmi::unregisterInstance()` — 实例销毁
- **位置**：`awtkhmi.cpp:668`
- **调用时机**：`deinit()` 中调用。
- **作用**：`delete` 全部 Data / Controller / Presentation 指针，并置 `nullptr`，防止悬空指针。

---

#### `AwtkHmi::deinit()` — 全量反初始化
- **位置**：`awtkhmi.cpp:280`
- **调用时机**：`application_on_exit()` → `AwtkHmi::deinit()`。
- **作用**：按正确顺序拆解资源：先停数据线程，再反初始化各 Dispatcher，最后销毁所有实例。

```
DataDispatcher::deinit()           → 设 isRunning=false，通知线程退出
m_dataThread.wait()                → 等待线程结束
ControllerDispatcher::deinit()
PresentationDispatcher::deinit()
unregisterInstance()               → delete 全部实例
```

---

#### `AwtkHmi::getObject(index)` — 全局对象访问
- **位置**：`awtkhmi.cpp:777`
- **作用**：通过枚举索引（`OBJ_DATA_*` / `OBJ_CONTROLLER_*` / `OBJ_PRESENTATION_*`）从 `object[]` 数组取出对应实例，供外部通过 `GET()` 宏访问。

---

#### `AwtkHmi::createTimer / startTimer / stopTimer` — 软件定时器管理
- **位置**：`awtkhmi.cpp:786-799`
- **作用**：封装 `SelfTimer`，供 Controller / Presentation 层创建和控制周期性任务，不依赖 AWTK `timer_add`。

---

## 四、全局变量说明

| 变量 | 文件 | 初始值 | 用途 |
|------|------|--------|------|
| `g_process_start_time` | application.cpp:35 | `0` | 记录 `application_init` 被调用时的时间戳，用于启动耗时统计 |
| `mStartUpdateCount` | application.cpp:36 | `0`（init末尾置1） | 控制 `application_on_launch` 触发时机（==1 时触发，触发后递增） |
| `g_ign_status` | application.cpp:37 | `-1` | 从 arm2 读取的点火状态，`4` 表示特殊状态（隐藏开机动画） |
| `g_rootnode_need_to_visible` | application.cpp:38 | `true` | OTA 标志，全部升级文件存在时置 `false`，让 rootNode 不可见 |
| `mStartPageFlag` | application.cpp:142 | `false` | 防止 `startPage()` 在 idle 中被多次调用 |
| `AwtkHmi::s_lastMemoryPrintTime` | awtkhmi.cpp:86 | `0` | 控制内存打印间隔（`MEMORY_PRINT_INTERVAL_MS`） |

---

## 五、启动性能埋点

| 打点日志关键字 | 含义 |
|---------------|------|
| `application_init g_process_start_time` | 进程启动绝对时间戳 |
| `process to window visible` | 进程启动 → rootNode 首次出现的耗时 |
| `process to first frame rendered` | 进程启动 → 首帧渲染到屏幕的耗时（window 可见后 10 帧） |
| `start_init_Time` / `end_init_Time` | `initLater` + `initViews` 的执行耗时 |
| `FPS: %.1f` | 运行期帧率，每 ~10 秒打印一次 |
| `cat /proc/bootprof` | 调用系统命令写入 bootprof 节点，供平台 boot 分析工具采集 |

---

## 六、页面列表

| 页面名 | 车型 | 主题 | 显示模式 |
|--------|------|------|---------|
| `classicPage` | SC2E/SC26 | Classic | 日间 |
| `classicPage_Dark` | SC2E/SC26 | Classic | 夜间 |
| `dynamicPage` | SC2E/SC26 | Dynamic | 日间 |
| `dynamicPage_Dark` | SC2E/SC26 | Dynamic | 夜间 |
| `p701_A_HomePage_Light` | P701 | SDMS_A | — |
| `p701_B_HomePage_Light` | P701 | SDMS_B / 其他 | — |
| `emergencyPage` | 任意 | — | 应急模式 |
| `updatePage` | 任意 | — | OTA 升级 |
| `menuPage_sc` | SC 系 | — | 菜单 |

---

## 七、MVC 模块清单

### Data（24 个）
`AdasData` / `AnimationData` / `BasicData` / `BluetoothData` / `WifiData` / `ChargeData` / `GaugeData` / `IlluminationData` / `MediaData` / `MenuData` / `PageData` / `NavigationData` / `OtaData` / `PowerData` / `StateData` / `TelltalesData` / `ThemeData` / `TripComputerData` / `WarningData` / `HomeData` / `PhoneData` / `ScreenData` / `SettingData` / `VehicleData`

### Controller（25 个）
`AdasController` / `AnimationController` / `BasicController` / `BluetoothController` / `WifiController` / `ChargeController` / `ChimeController` / `GaugeController` / `IlluminationController` / `MediaController` / `MenuController` / `PageController` / `NavigationController` / `OtaController` / `PowerController` / `StateController` / `TelltalesController` / `ThemeController` / `TripComputerController` / `WarningController` / `HomeController` / `PhoneController` / `ScreenController` / `SettingController` / `VehicleController`

### Presentation（22 个）
`AdasPresentation` / `AnimationPresentation` / `BasicPresentation` / `BluetoothPresentation` / `WifiPresentation` / `ChargePresentation` / `GaugePresentation` / `HomePresentation` / `IlluminationPresentation` / `MediaPresentation` / `MenuPresentation` / `PagePresentation` / `NavigationPresentation` / `OtaPresentation` / `PhonePresentation` / `ScreenPresentation` / `SettingPresentation` / `TelltalesPresentation` / `ThemePresentation` / `TripComputerPresentation` / `VehiclePresentation` / `WarningPresentation`

---

*文档生成时间：2026-05-09*
