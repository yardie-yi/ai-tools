# 推板验证

## 前提条件

- 编译已完成（产物在 `..\build\autoai-services\bin\awtkhmi` 下，相对模块根目录）
- 板端已通过 USB 连接，Windows 命令行下 `adb devices` 可见设备
- 运行环境：**Windows**

## 推板方式

**方式 A：手动双击运行脚本（需在 cmd.exe 中执行，不适合 Claude Code 自动化）**

```bat
.evospec\scripts\push_to_board.bat
```

脚本在 cmd.exe 中可正常交互选择场景：
- `1` — 仅修改了代码（只推二进制）
- `2` — 修改了资源文件，如图片等（推整个 awtkhmi 目录）

脚本无报错输出即为推板成功。

> Claude Code 运行在 PowerShell 环境，bat 脚本含中文且依赖 `set /p` 交互输入，管道传参方式不可靠。
> 在 Claude Code 中执行推板时，直接使用下方"手动推板步骤"中的 adb 命令。

---

## 手动推板步骤

在 Windows 命令行（cmd）中按顺序执行，任意一条异常则停止排查。

> 说明：以下路径中 `%~dp0` 为 `.evospec\scripts\` 目录，`%~dp0..\..\..\` 即 `autoai-services\` 目录。
> 手动执行时可先 `set SERVICES_DIR=<autoai-services 绝对路径>\` 替代 `%~dp0..\..\..\`。

### 第一阶段：解除写保护 + 清理旧进程（两种场景通用）

```bat
adb shell "echo clear_all_wp > /proc/nand_wp"
adb shell sync
adb shell "mount -o remount,rw /dev/root /"
adb shell 'killall appmgr; true'
adb shell 'killall awtkhmi; true'
```

> 该板端为 production build，不支持 `adb root`（报 "unable to connect for root: closed"）。
> 直接在 shell 内执行 `mount -o remount,rw /dev/root /` 解除根分区只读保护。

---

### 场景一：仅修改了代码

#### 第二阶段：删除板端旧二进制

```bat
adb shell rm -f /mnt/autoai_platform/bin/awtkhmi/bin/awtkhmi
adb shell sync
```

> `-f` 必须加，否则 rm 弹出交互式确认，在 Claude Code 自动化流程中会卡住。

#### 第三阶段：推送新二进制

```bat
set SERVICES_DIR=%~dp0..\..\..\
adb push %SERVICES_DIR%build\autoai-services\bin\awtkhmi\bin\awtkhmi /mnt/autoai_platform/bin/awtkhmi/bin/awtkhmi
adb shell chmod -R 777 /mnt/autoai_platform/bin
adb shell sync
```

---

### 场景二：修改了资源文件（图片等）

#### 第二阶段：删除板端旧目录

```bat
adb shell rm -rf /mnt/autoai_platform/bin/awtkhmi
adb shell sync
```

#### 第三阶段：推送完整 awtkhmi 目录

```bat
set SERVICES_DIR=%~dp0..\..\..\
adb push %SERVICES_DIR%build\autoai-services\bin\awtkhmi  /mnt/autoai_platform/bin
adb shell chmod -R 777 /mnt/autoai_platform/bin
adb shell sync
```

---

**判断标准：所有 adb 命令无异常返回值即为推板成功。**

## 验证方法

推板后手动启动服务确认：

```bat
adb shell PLACEHOLDER -c PLACEHOLDER -d
```

观察日志：

```bat
adb logcat | findstr PLACEHOLDER
```

期望看到：`PLACEHOLDER（cluster-app 启动成功日志待确认）`

## 推板后

验证通过 → 提交代码：`@references/us-git-submit.md`

验证失败 → 返回 Bug 修复：`@references/us-bug-fix.md`
