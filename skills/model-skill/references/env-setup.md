> **配置来源**：本文件所有服务器地址、路径、编译命令均来自 `.evospec/module.config.yaml`，执行前必须先读取该文件。

# 编译环境配置

## 编译方式：SSH 远程服务器交叉编译

### 服务器信息

服务器信息见 `.evospec/module.config.yaml` → `build.server` 节。

### 连接服务器

```bash
ssh <config: build.server.user>@<config: build.server.host>
# 密码：一个空格（直接按空格键后回车）
```

### 执行编译

```bash
cd <config: build.remote_build_dir>
<config: build.toolchain_init>
make <config: build.make_target>
```

> `env_setup.sh ac8215e` 设置 ac8215e 交叉工具链环境变量，每次新开终端都需要重新 source。

### 编译产物

编译完成后产物在本地项目的 `build/` 目录（通过 samba 挂载或 scp 同步到 Windows）：

编译产物路径见 `.evospec/module.config.yaml` → `artifacts` 列表，每项的 `local_path` 字段。

### 仅本地调试（不推板，Windows CMake）

```bash
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Debug
make -j4
```

> 本地编译产物为 x86 架构，**不可推板**，仅用于代码逻辑验证。

### 常见问题

| 问题 | 原因 | 处理 |
|------|------|------|
| `autoaiLog.h: No such file` | 未 source 工具链环境 | 重新执行 `source env_setup.sh ac8215e` |
| `make: command not found` | SSH 会话环境变量丢失 | 重新 source 后再 make |
| 产物未更新 | 增量编译未触发 | `make clean && make <config: build.make_target>` |
