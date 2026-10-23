# DBus、生成信号绑定与线程取消核查

当日志停在发送、forward、complete 或 timer 附近时使用。先查当前版本；以下 21L 路径与行号是 4101 调查所核本地快照，不保证部署版本一致。通用流程见 [调查流程](investigation-workflow.md)。

## 1. 画三种边，不能只画一条“发消息”

- **本地直接调用**：普通 C/C++、GObject 默认 signal/closure 在当前调用栈执行；不能因为命名 signal 就假设跳线程。
- **队列/事件派发**：明确 producer、consumer、队列对象、目标 context、Qt 连接类型和对象线程归属。AutoConnection 是否排队要看实际线程，不能直接称 UI 主线程。
- **跨进程 DBus**：区别同步 method、method reply、signal。服务端 complete 只提交回复；业务队列执行与对端拿到回复是另外两件事。

## 2. 从业务发送追过生成代码

本地快照的可核链：

| 层次 | 文件与关键位置 | 查什么 |
|---|---|---|
| 构造业务文件 | `app-vr/src/analysis/app_vr_model_z.cpp:8740,1114` | JSON cmd 与附加信息 ID 是否不同；写文件和通知先后 |
| 构包并发信号 | `app-vr/src/engine/app_vr_send_to_dten.cpp:1248,1274,1080,1095` | `ADDITIONAL_INFO_REQ` 宏、原字节、len/opc/from/to；OUT 在 emit 前 |
| generated wrapper | `app-vr/dbus/app_vr_dbus_gen.c:844,852` | `com_app_vr_emit_hmi_dten_info_callback` 直接 `g_signal_emit_by_name` |
| GObject 信号注册 | 同文件 `com_app_vr_default_init:665`、`g_signal_new:780` | 名称 `hmi-dten-info-callback`、`G_SIGNAL_RUN_LAST`、接口字段 offset |
| skeleton 类型与接口实现 | 同文件 `1939–1945,1994–1998` | `G_IMPLEMENT_INTERFACE` 指定初始化函数；`iface->hmi_dten_info_callback` 指向 `_com_app_vr_on_signal_hmi_dten_info_callback` |
| 实际 DBus emitter | 同文件 `1870–1895` | 获取 export 连接，封装参数，调用 `g_dbus_connection_emit_signal` |
| skeleton 与连接来源 | `app-vr/src/app_vr.cpp:337,194–211` | `g_bus_own_name(G_BUS_TYPE_SESSION)` → `on_bus_acquired(connection)` → skeleton_new → export |

这个“隐藏绑定”是接口槽和 class closure，不要求另有应用 `g_signal_connect`。不要把生成 wrapper 名称当成最终发送实现。

本地 GObject 信号名使用连字符；线上 DBus member `hmi_dten_info_callback` 使用下划线。`app_vr.h:11–12` 定义总线名 `com.app.vr` 和对象路径 `/com/app/vr`。

业务数据先装成 `a(y)`（单字节 tuple 数组），generated 用 `(@a(y)iiii)` 包进消息体；`@` 是构造格式标记，四个整数是 len/opc/from/to。它们不是 DBus 路由地址；generated 发射时 destination 参数为 NULL。检查 export 是否成功和连接列表是否存在，不能仅凭创建对象推定已经联网可发。

## 3. 同步范围和异步写出的分界

本地 SDK GLib 2.54.3 的 `gobject/gsignal.c:3487` 直接调用 `g_signal_emit_valist`，本地 closure 调用沿当前线程执行。进入 `gio/gdbusconnection.c` 后：

```text
g_dbus_connection_emit_signal:5526/5574
 → g_dbus_connection_send_message:1717
 → CONNECTION_LOCK:1730
 → send_message_unlocked:1583（1617 序列化）
 → _g_dbus_worker_send_message:1668
 → gdbusprivate.c:1630 获取 write_lock
 → schedule_writing_unlocked:1559 / 1565 入 write_queue
 → 条件成立时 1591 把 source 挂到 worker context
 → 正常解锁并逐层返回
```

后续 worker 写出是异步调度；锁获取、序列化、队列提交仍由业务调用线程执行。generated wrapper 忽略 emit 的布尔结果并返回 void，因此后置日志不证明 HMI 收到或处理完成。

用户关注取消竞争时，这个分界很关键：timer pthread 可以亲自进入连接锁/worker 锁路径。它是代码可达性，不是该次现场已进入这些锁的证明。

## 4. 接收侧的两个 method 边界

在本地 970B 风格路径，HMI 原始包先走同步 `forward_dten_info`：

```text
app_vr.cpp:on_forward_dten_info:161
 → complete_forward_dten_info:187
 → forward_push:189 / send_to_dten.cpp:1043,1069
 → dten_forward_ctrl consumer:962,968
 → app_vr_dcu_response / 当前 banner worker
 → IGNORE 时 hmi_thread.cpp:64–65 forward_send
 → send_to_dten.cpp:1121 hmi_dten_info_forward signal
 → HMI hmi_dten_forward → recvMsgFromDcu → set_dten_info_sync
 → app_vr.cpp:on_set_dten_info:128
 → complete_set_dten_info:153
 → app_vr_dten_msg_push:155 / send_to_dten.cpp:1030 入队
 → app_vr_dten_msg_recive:911,916 → message_recive
```

`message_recive:639` 的 `ADDITIONAL_INFO_RSP` 是 0x0292；`ADDITIONAL_INFO_NTF` 是 0x0293。读取包头 cmdId/路径后，676–677 的 `NAVI_COMM_CMD=9099` 才调用 Z:5980 的 `process_dten_navi_result`；5982 读 JSON、5990 按内层 cmd 分发。

两个 complete 都早于业务队列执行。不能画成“当前同步 RPC 等 2012 的 cancel 做完才回复”；若主张该业务拖住其他 RPC，必须补齐共享连接、IO/主循环或后续派发受阻的中间链。还要检查独立的 `set_cmd_json_file_sync` 条件路径，不把所有等待都叫 forward。

## 5. 取消/锁候选必须逐项核查

1. 取消对象：timer ID、实际 pthread_t、创建者、running 标志和复用规则。日志 `g_thread_self()` 不是 pthread_t 或内核 TID 的可靠替代。
2. 业务触发：取消前后的实际顺序、是否读取 result 后才取消。4101 的 2012 分支先 cancel，后解析 result；不能称 result0 导致取消。
3. 调用返回：逐层检查 pthread_cancel/pthread_join 返回值、目标退出值、是否 self-join；`cancel_timer:0` 若是计数器重置打印，就不是 API 返回码。
4. 取消状态：enabled/disabled、deferred/asynchronous、实际取消点及 SDK/C 库版本。pthread_cancel 请求成功也不等于目标已经终止。
5. 持锁范围：callback 前 timer 自身锁是否已释放；下游 connection、write_lock、context 锁的具体嵌套与每个条件分支。
6. cleanup：取消点到正常 unlock 间是否有 cleanup/取消屏蔽；只检查有证据的路径，不笼统断言整个 GLib 不安全。
7. 现场命中：同版本 build-ID、取消目标、线程栈、锁对象/owner、发送序号、时间关系。没有这些只能保留候选。
8. 反例：安全 sleep 点取消、已经发完、目标句柄失效、正常 Boot 同样取消但继续通信、cancel 后置已出现。这些反例分别削弱“永久卡 join”“任何取消必挂”等过强说法。

4101 本机 SDK 存在条件链：write_queue 调度在 output_pending 条件下挂 source，context 需要唤醒时可进入 `write()` 取消点；若现场取消在持锁区生效且没有对应 cleanup，可能跳过正常 unlock。不能由此宣称现场 DBus 遗锁已证实。

## 6. HMI 传播与耗时的边界

HMI socket pthread 与 FIFO handler 分开。handler 同步等待可让后续消息排队，不代表 socket 未收包。280 的 ACK 还依赖 mode、显示队列或 first-paint 分支。

browser 的 RAII 锁按函数作用域核对：其通知函数返回后锁已经释放，后续同步 VR 转发不是仍持同一把 browser 锁。锁内另有 socket/通知动作可作为独立候选，不能与 VR 进程内锁合并。

`timeout=-1` 要继续查 proxy/default 设置，本机 SDK 默认 25 秒不代表无限等待，也不是包括前置锁等待的 wrapper 严格上限。SYS 的 recvDcuMsg start/end 包围 handler，含采集影响；27秒、34秒或 N×25秒的记录差不能命名为实测 RPC 时延。

最小补证建议：单调前后打点、DBus serial/unique owner、bool/GError、队列入出/深度、pthread 返回/退出值、锁地址与多线程栈、文件写读哈希。提出这些建议不代表获得板端操作授权。
