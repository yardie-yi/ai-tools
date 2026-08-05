---
stack_id: linux
language: c_cpp
secondary_languages: [python, bash]
framework: linux_native
build_system: cmake_make
build_command: "make"
test_command: "make test"
---

# Linux 平台技术栈规则

## 架构风格

```
推荐架构: 守护进程 + 服务架构

组件：
├── Daemon: 后台守护进程
├── Service: 业务服务
├── Library: 共享库
├── Config: 配置管理
└── IPC: 进程间通信（DBus/Socket/SharedMem）
```

## 命名规范

```
文件命名：
├── 源文件: snake_case.c / snake_case.cpp
├── 头文件: snake_case.h
├── 私有头: snake_case_internal.h
└── 文档: README.md / INSTALL.md

可执行文件：
├── 守护进程: {name}d (如: weatherd)
├── 工具: {name}-tool
└── CLI: {name}-cli

库命名：
├── 共享库: lib{name}.so
├── 静态库: lib{name}.a
└── 版本: lib{name}.so.1.0.0

变量命名：
├── 宏: UPPER_SNAKE_CASE
├── 枚举: UPPER_SNAKE_CASE
├── 全局变量: g_{name}
├── 静态变量: s_{name}
└── 局部变量: snake_case
```

## 代码模式

```
守护进程模式：
void daemonize() {
    pid_t pid = fork();
    if (pid < 0) exit(EXIT_FAILURE);
    if (pid > 0) exit(EXIT_SUCCESS);  // 父进程退出
    
    if (setsid() < 0) exit(EXIT_FAILURE);
    
    // 捕获信号
    signal(SIGCHLD, SIG_IGN);
    signal(SIGHUP, SIG_IGN);
    
    pid = fork();
    if (pid < 0) exit(EXIT_FAILURE);
    if (pid > 0) exit(EXIT_SUCCESS);
    
    umask(0);
    chdir("/");
    
    // 关闭标准文件描述符
    for (int x = sysconf(_SC_OPEN_MAX); x >= 0; x--) {
        close(x);
    }
}

信号处理：
static volatile sig_atomic_t running = 1;

void signal_handler(int sig) {
    switch (sig) {
        case SIGTERM:
        case SIGINT:
            running = 0;
            break;
    }
}

int main() {
    signal(SIGTERM, signal_handler);
    signal(SIGINT, signal_handler);
    
    while (running) {
        // 主循环
    }
    return 0;
}

DBus服务模式：
// 注册DBus服务
GDBusConnection* conn = g_bus_get_sync(G_BUS_TYPE_SYSTEM, NULL, NULL);
guint registration_id = g_dbus_connection_register_object(
    conn,
    "/com/example/Weather",
    introspection_data->interfaces[0],
    &interface_vtable,
    NULL, NULL, NULL
);
```

## 目录结构

```
project/
├── src/
│   ├── main.c              # 主入口
│   ├── daemon/             # 守护进程
│   ├── service/            # 服务逻辑
│   ├── ipc/                # 进程间通信
│   └── utils/              # 工具函数
├── include/
│   └── {project}/
├── lib/
├── config/
│   ├── {project}.conf
│   └── {project}.service   # systemd服务文件
├── scripts/
│   ├── install.sh
│   └── start.sh
├── tests/
├── docs/
├── Makefile
└── README.md
```

## 错误处理模式

```
系统调用错误处理：
int fd = open(path, O_RDONLY);
if (fd < 0) {
    syslog(LOG_ERR, "Failed to open %s: %s", path, strerror(errno));
    return -errno;
}

日志规范：
#include <syslog.h>

void init_logging(const char* name) {
    openlog(name, LOG_PID | LOG_NDELAY, LOG_DAEMON);
}

void log_info(const char* fmt, ...) {
    va_list args;
    va_start(args, fmt);
    vsyslog(LOG_INFO, fmt, args);
    va_end(args);
}

// 日志级别
LOG_EMERG    // 系统不可用
LOG_ALERT    // 必须立即处理
LOG_CRIT     // 严重错误
LOG_ERR      // 错误
LOG_WARNING  // 警告
LOG_NOTICE   // 正常但重要
LOG_INFO     // 信息
LOG_DEBUG    // 调试信息
```

## 测试规范

```
测试框架：
├── C: Unity / CMocka
├── C++: Google Test
└── 集成测试: Shell脚本

测试目录结构：
tests/
├── unit/
│   ├── test_module1.c
│   └── test_module2.c
├── integration/
│   └── test_service.sh
└── mocks/
    └── mock_dbus.c

Makefile测试目标：
test: $(TEST_BINARIES)
	@for test in $(TEST_BINARIES); do \
		./$$test || exit 1; \
	done
	@echo "All tests passed"
```

## 进程间通信

```
DBus接口：
├── System Bus: 系统级服务
├── Session Bus: 用户会话
└── 推荐库: libdbus / GDBus / sd-bus

Unix Socket：
int create_socket(const char* path) {
    int fd = socket(AF_UNIX, SOCK_STREAM, 0);
    struct sockaddr_un addr = {
        .sun_family = AF_UNIX
    };
    strncpy(addr.sun_path, path, sizeof(addr.sun_path) - 1);
    bind(fd, (struct sockaddr*)&addr, sizeof(addr));
    listen(fd, 5);
    return fd;
}

共享内存：
int shm_fd = shm_open("/weather_data", O_CREAT | O_RDWR, 0666);
ftruncate(shm_fd, sizeof(WeatherData));
void* ptr = mmap(NULL, sizeof(WeatherData), 
                 PROT_READ | PROT_WRITE, MAP_SHARED, shm_fd, 0);
```

## 常见编译错误与修复

| 错误类型 | 常见原因 | 修复方式 |
|---------|---------|---------|
| Permission denied | 权限不足 | chmod/chown 或 sudo |
| Address already in use | 端口/Socket被占用 | 检查进程/更换端口 |
| Library not found | 缺少依赖 | apt install / 修改LD_LIBRARY_PATH |
| Symbol lookup error | 库版本不匹配 | 更新库/重新编译 |
| Segmentation fault | 内存错误 | gdb调试/valgrind检查 |

## 构建检查

```bash
# 编译
make clean && make all

# 测试
make test

# 静态分析
cppcheck --enable=all src/

# 动态分析
valgrind --leak-check=full --show-leak-kinds=all ./build/app

# 覆盖率
gcov *.gcda
lcov --capture --directory . --output-file coverage.info
genhtml coverage.info --output-directory coverage
```

## 部署规范

```
Systemd服务文件：
[Unit]
Description=Weather Service
After=network.target

[Service]
Type=simple
ExecStart=/usr/bin/weatherd
Restart=on-failure
RestartSec=5

[Install]
WantedBy=multi-user.target

安装流程：
├── make install
├── systemctl daemon-reload
├── systemctl enable weatherd
└── systemctl start weatherd
```