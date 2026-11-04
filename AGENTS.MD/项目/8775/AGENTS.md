# SA8775 项目约束

## Git 操作
- 所有 Git 操作（包括 status、diff、log 等只读查询）必须通过 SSH 在服务器 `172.19.160.73` 的实际仓库目录执行，不在本机 SMB 挂载目录运行 Git。

## 远程编译
- 必须在服务器编译，不在本机 SMB 目录编译。SSH：`ssh yiwanming@172.19.160.73`；**服务器密码为一个 ASCII 空格（U+0020），不是空密码**，在密码提示中输入一个空格再回车；勿写入命令行或日志，认证失败即停止确认。
- 本地源码：`app/embedded-software/autoai-services`。登录后确认服务器实际绝对路径，不使用 SMB URI 代替。
- 在源码 `build-script/` 下，同一 Bash shell 执行 `source env_setup.sh sa8775 && make <目标>`；目标先查 Makefile。仅用户要求全量清理编译时执行 `source env_setup.sh sa8775 && make clean && make`。
- 记录命令、退出码、日志及本次产物路径、时间、大小；失败即停止，不使用旧产物冒充成功。仅要求编译时不部署。

## 板端登录与部署
- 在连接板卡的主机依次执行 `adb devices -l`、`adb root`、`adb wait-for-device`、`adb shell`；多设备须指定 `adb -s <serial>`。在 Android shell 执行 `qnx`，失败则用 `busybox telnet 172.16.80.6 -a`；以实际连接为准，用 `uname -a` 确认 QNX。
- 覆盖文件及服务重启须获当前请求授权。仅部署成功构建的产物；先备份目标、记录校验值和权限、确认停启方案，避免截断使用中的文件；失败即停止并说明备份位置和恢复方法。
- 仅需写入时在 QNX 执行 `mount -wu /mnt/`，只读检查不改挂载。可执行文件放 `/mnt/autoai_platform/bin/`，共享库放 `/mnt/autoai_platform/lib/`；保留权限和必要符号链接，仅替换授权文件。
- `adb push` 仅到 Android，转入 QNX 的通道须验证。部署后在 QNX 核对大小及校验值；未完成授权重启与日志/功能检查时报告“已部署，运行未验证”。
- 报告已完成阶段、验证证据及未验证项；编译成功不代表板端运行或 MCU 通信正常。
