# 板端调试命令

> **配置来源**：进程名、配置文件路径、日志 TAG 列表均来自 `.evospec/module.config.yaml`，使用前先读取该文件。

## adb 日志抓取

### 按模块过滤（推荐）

> 日志 TAG 列表见 `.evospec/module.config.yaml` → `debug.log_tags`

```bat
REM 按 config.debug.log_tags 逐一过滤，例如：
adb logcat | findstr "<config: debug.log_tags[0]>"
adb logcat | findstr "<config: debug.log_tags[1]>"
```

### 多模块同时过滤

```bat
REM 将 config.debug.log_tags 拼接为空格分隔的关键字
adb logcat | findstr /R "<config: debug.log_tags 空格拼接>"
```

### 保存日志到文件

```bat
adb logcat > C:\logs\debug_%date:~0,10%.log
```

### 清空日志缓冲

```bat
adb logcat -c
```

## 进程管理

```bat
REM 查看进程是否运行（进程名见 config.board.processes_to_kill）
adb shell pidof <config: board.processes_to_kill[i]>

REM 强制停止进程
adb shell "pidof <config: board.processes_to_kill[i]> && kill -9 $(pidof <config: board.processes_to_kill[i]>)"

REM 查看板端配置文件
adb shell cat <config: board.config_file>
```

## 常见异常快速定位

| 现象 | 命令 | 关注点 |
|------|------|--------|
| 服务未启动 | `adb shell pidof <config: board.processes_to_kill[0]>` | 返回空则未运行 |
| 启动失败 | `adb logcat \| findstr "<config: debug.log_tags[0]>"` | `Failed to initialize` |
| 动态库加载失败 | `adb logcat \| findstr "<config: debug.log_tags[0]>"` | `dlopen failed` |
| 查看完整日志 | `adb logcat > C:\logs\debug.log` | 搜索 ERROR / FATAL |
