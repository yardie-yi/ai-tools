# 字段和示例写法

以下只演示格式，不提供默认目标表、分组、模块或责任人。使用时替换为当前头文件中的声明和约束。

## 注册回调

源码：

```cpp
/** @brief 车速上报 */
virtual bool registerVehicleSpeedCbk(std::function<void(const float&)> cb) = 0;
```

- 接口名：`registerVehicleSpeedCbk`
- 规范接口名：`virtual bool registerVehicleSpeedCbk(std::function<void(const float&)> cb) = 0;`
- 关键参数：`std::function<void(const float&)> cb`

简单调用示例（队列和错误处理函数均为伪代码，非该库提供的 API）：

```cpp
// @brief 车速上报
auto* api = CVehicleApi::getInstance();
if (api == nullptr) { 处理实例获取失败(); return; }
bool ok = api->registerVehicleSpeedCbk([](const float& speed) {
    // 仅在当前头文件要求回调轻量非阻塞时使用此模式。
    if (!应用预分配队列.tryPushCopy(speed)) {
        原子记录队满计数();
    }
    非阻塞通知应用线程(); // 应用线程中处理日志、UI 和其他耗时业务
});
if (!ok) { 处理注册失败(); }
```

不要把引用直接捕获到异步任务中；跨线程时保存值的副本。复杂数据可能涉及分配，按头文件要求使用预分配或合适的非阻塞传递方式。

## 同组注销和读取

当组前 brief 为“车速上报”，并明确覆盖连续的注册、注销和读取接口时：

```cpp
// @brief 车速上报
// 注销先前注册的回调；在应用线程执行。
bool ok = api->unregisterVehicleSpeedCbk();
if (!ok) { 处理注销失败(); }
```

```cpp
// @brief 车速上报
// 在应用线程读取；阻塞/超时说明以当前头文件为准。
float out{};
if (api->getVehicleSpeed(out)) {
    使用车速(out);
} else {
    处理读取失败();
}
```

注销接口参数为空时，可沿用模板填写“无”；读取接口参数原样填写 `float& out`。示例里的 `api` 应在单元格内取得，或明确说明它是已获取且有效的实例。

## 设置和生命周期

- setter：`类型 in = 按协议准备有效输入();`，再调用真实 setter；只有类型定义或协议提供了有效值时才使用具体枚举/数字。
- 静态 `getInstance` / `freeInstance`：如果属于要求的公开接口范围，也应登记；头文件没有 brief 时写明缺失，不能沿用最近一个业务接口的 brief。
- 释放示例需遵守原头文件的线程和对象生命周期要求，不在回调内销毁禁止销毁的对象。

## 重载与原行冲突

`getValue(int& out)` 和 `getValue(float& out)` 应按两条签名去重，即使“接口名”都为 `getValue`。

如果一行接口名为 `registerPowerStateCbk`，声明却是 `registerVehicleSpeedCbk(...)`，先作为冲突处理。不得同时把这两个接口算作已存在。用户手动修正后重新读该行，再决定缺失集合；不自动覆盖用户手工内容。
