---
stack_id: qnx
language: cpp
secondary_languages: [c]
framework: qnx_neutrino
build_system: make_cmake
build_command: "make"
test_command: "./run_tests.sh"
---

# QNX 技术栈规则

## 架构风格

```
推荐架构: 分层架构 + 消息传递

组件：
├── Application Layer: 应用逻辑
├── Service Layer: 后台服务
├── HAL: 硬件抽象层
├── Driver Layer: 设备驱动
└── Communication: QNX消息传递/共享内存
```

## 命名规范

```
文件命名：
├── 类: PascalCase.cpp / PascalCase.h
├── 接口: I{功能}.h (如: IWeatherService.h)
├── 结构体: {功能}_t (如: weather_data_t)
└── 枚举: {功能}_e (如: weather_state_e)

类命名：
├── Service: {功能}Service (如: WeatherService)
├── Manager: {功能}Manager
├── Handler: {功能}Handler
├── Client: {功能}Client
└── Server: {功能}Server

变量命名：
├── 成员变量: m_{name} (如: m_temperature)
├── 静态变量: s_{name}
├── 常量: k{ConstantName} 或 UPPER_SNAKE_CASE
└── 局部变量: snake_case
```

## 代码模式

```
消息传递模式：
// 服务器端
int main(int argc, char* argv[]) {
    name_attach_t* attach = name_attach(NULL, "weather_service", 0);
    if (!attach) return EXIT_FAILURE;
    
    while (true) {
        int rcvid = MsgReceive(attach->chid, &msg, sizeof(msg), NULL);
        // 处理消息
        MsgReply(rcvid, EOK, &reply, sizeof(reply));
    }
    name_detach(attach, 0);
}

// 客户端端
int weather_get_data(weather_data_t* data) {
    int server_coid = name_open("weather_service", 0);
    if (server_coid == -1) return -1;
    
    weather_msg_t msg = {.type = GET_DATA};
    int status = MsgSend(server_coid, &msg, sizeof(msg), data, sizeof(*data));
    name_close(server_coid);
    return status;
}

资源管理器模式：
// QNX资源管理器
void* resmgr_context;
resmgr_attr_t resmgr_attr = RESMGR_ATTR_INITIALIZER;
resmgr_connect_funcs_t connect_funcs = RESMGR_CONNECT_FUNCS_INIT;
resmgr_io_funcs_t io_funcs = RESMGR_IO_FUNCS_INIT;
```

## 目录结构

```
project/
├── src/
│   ├── app/               # 应用层
│   │   └── {feature}/
│   ├── service/           # 服务层
│   ├── hal/               # 硬件抽象层
│   ├── driver/            # 驱动层
│   └── common/            # 公共代码
├── include/
│   ├── public/            # 公开接口
│   └── internal/          # 内部接口
├── lib/                   # 库文件
├── tests/
│   ├── unit/
│   └── integration/
└── build/
    ├── makefiles/
    └── out/
```

## 错误处理模式

```
错误码规范：
├── 0: 成功
├── 正数: 警告（继续执行）
└── 负数: 错误（需要处理）

错误处理宏：
#define CHECK_NULL(ptr) \
    do { \
        if ((ptr) == NULL) { \
            slogf(_SLOG_SETCODE(_SLOGC_TEST, 0), _SLOG_ERROR, \
                  "%s:%d: NULL pointer", __func__, __LINE__); \
            return EINVAL; \
        } \
    } while(0)

异常处理：
├── QNX不使用C++异常（资源受限环境）
├── 使用返回码 + errno
└── 关键操作使用断言
```

## 测试规范

```
测试框架：
├── 单元测试: Unity / CppUTest
├── 集成测试: 自定义脚本
└── 覆盖率: gcov / lcov

测试命名：
├── 测试文件: test_{module}.cpp
├── 测试函数: test_{function}_{scenario}
└── 示例: test_weather_get_data_valid_input

Mock策略：
├── HAL层Mock: 替换函数指针
├── 消息传递Mock: 使用test channel
└── 时间Mock: 重定义ClockCycles()
```

## 常见编译错误与修复

| 错误类型 | 常见原因 | 修复方式 |
|---------|---------|---------|
| Undefined reference | 链接顺序错误 | 调整Makefile中库顺序 |
| Implicit declaration | 缺少头文件 | 添加#include |
| Type mismatch | C/C++混用 | 添加extern "C" |
| Memory alignment | 结构体对齐 | 添加__attribute__((packed)) |
| Resource busy | 未释放资源 | 检查name_close/munmap |

## 构建检查

```bash
# 编译检查
make clean && make all

# 静态分析
cppcheck --enable=all src/

# 内存检查
valgrind --leak-check=full ./app

# 测试执行
./run_tests.sh
```

## QNX特有约束

```
实时性要求：
├── 关键路径禁止动态内存分配
├── 使用内存池预分配
├── 避免阻塞调用（使用非阻塞IO）
└── 优先级继承锁

安全性要求：
├── 输入验证（CAN/以太网数据校验）
├── 边界检查（数组越界）
├── 资源限制（文件描述符、内存）
└── 权限控制（root/非root）
```