---
name: sa8775-build-deploy
description: SA8775 项目远程全量或模块编译，以及通过 ADB 登录 QNX、部署可执行文件和共享库。用于本项目编译、板端登录和部署任务。
---

# SA8775 编译与板端部署

按当前请求选择编译、登录或部署步骤；使用本 skill 不代表用户授权所有步骤。只读检查无需修改挂载。部署覆盖和服务重启须在当前请求授权范围内执行；仅要求编译时止于产物验证。

## 1. SSH 编译

编译必须在服务器执行，不能在本机 SMB 挂载目录直接编译。

```bash
ssh yiwanming@172.19.160.73
```

项目提供的 SSH 密码为**一个 ASCII 空格（U+0020）**，不是空密码；在交互式密码提示中输入一个空格再回车。避免把密码放进命令行或日志；认证失败时停止并确认凭据。

登录后先确认服务器上的项目绝对路径。当前客户端项目位于 SMB 共享 `yiwanming/8775`，源码相对当前项目目录为 `app/embedded-software/autoai-services`；SMB URI 不能作为服务器文件系统路径。找到实际 `embedded-software/autoai-services/build-script/env_setup.sh` 后，以其所在项目路径执行以下命令。

### 全量编译

在服务器源码父目录执行，使用 Bash，环境初始化与 make 保持在同一 shell：

```bash
cd embedded-software/autoai-services/build-script && source env_setup.sh sa8775 && make clean && make
```

`make clean` 会清理既有构建产物；仅在用户要求全量清理编译时使用。

### 模块编译

```bash
cd embedded-software/autoai-services/build-script && source env_setup.sh sa8775 && make xxx模块
```

`xxx模块` 是占位符：从该目录 Makefile 确认目标名后替换，不把模块目录名直接当作已验证的 make 目标。不为模块编译额外执行全量 clean。

完成条件：记录命令、退出码和日志位置，确认本次生成的产物路径、时间及大小。任一步失败就停止，不使用遗留产物冒充本次成功输出。

## 2. 从 Android 进入 QNX

在实际连接板卡、可访问 ADB 的主机执行（不默认是编译服务器）。多设备时先确认目标，后续命令使用 `adb -s <serial>`。

```bash
adb devices -l
adb root
adb wait-for-device
adb shell
```

进入 Android shell 后：

```sh
qnx
```

如果进入失败，在 Android shell 中执行：

```sh
busybox telnet 172.16.80.6 -a
```

用 `uname -a` 确认已进入 QNX，再执行 QNX 命令。`qnx` 封装脚本可能连接其他地址，以实际登录结果为准。

## 3. 部署到 QNX

确认产物来自成功的 SA8775 构建，并明确本次需要替换的文件和依赖库。覆盖前备份目标文件、记录校验值及权限；运行中程序或库的替换要先确认服务停止/重启方案，避免直接截断正在使用的文件。

仅在需要写入 `/mnt` 且已获部署授权时，在 **QNX shell** 执行：

```sh
mount -wu /mnt/
```

部署目的目录：

| 产物 | QNX 目的目录 |
| --- | --- |
| 可执行文件 | `/mnt/autoai_platform/bin/` |
| `.so` 共享库 | `/mnt/autoai_platform/lib/` |

传输方式需根据现场可用工具和共享路径确认。`adb push` 的目的端是 Android，不能直接当作写入 QNX；若先上传 Android，必须继续经已验证通道转入 QNX。保留库的必要符号链接及可执行权限，只替换本次授权文件。

完成条件：在 QNX 侧核对文件大小和校验值与构建产物一致。只有执行了授权的服务重启及日志/功能检查，才能报告运行验证通过；否则报告“已部署，运行未验证”。失败时停止后续操作并说明备份位置及恢复方法。

## 结果说明

报告实际完成的阶段、构建目标、产物及部署路径、验证结果和未执行项。编译成功不等于板端运行正常，也不等于 MCU 通信已验证。
