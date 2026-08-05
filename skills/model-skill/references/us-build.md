> **配置来源**：本文件所有服务器地址、路径、编译命令均来自 `.evospec/module.config.yaml`，执行前必须先读取该文件。

# 编译构建

## 方式一：SSH 远程交叉编译（正式产物，推荐）

详细环境配置见 `@references/env-setup.md`

Claude Code 直接执行（`bash -c` 确保 `source` 在非交互式 SSH 中生效）：

```powershell
ssh yiwanming@172.19.160.73 "bash -c 'cd ~/adcj/platform/autoai-services/build-script && source env_setup.sh ac8215e && make cluster-app 2>&1'"
```

> 若 SSH 返回 exit 255（连接超时/拒绝），通常是网络或 VPN 问题，
> 此时告知用户 SSH 不通，并提供以下手动步骤：
>
> ```bash
> ssh yiwanming@172.19.160.73   # 密码：一个空格
> cd ~/adcj/platform/autoai-services/build-script
> source env_setup.sh ac8215e
> make cluster-app
> ```

编译完成后产物同步到本地 `build/` 目录，再执行推板。

## 方式二：本地 CMake 构建（仅代码逻辑验证，不可推板）

```bash
cd <config: build.local_project_path>
mkdir build && cd build
cmake .. -DCMAKE_BUILD_TYPE=Debug
make -j4
```

> 本地产物为 x86 架构，无法在 ac8215e 板端运行。

## 构建选项

| 选项 | 默认 | 说明 |
|------|------|------|
| `-DBUILD_TESTS=ON` | ON | 编译测试程序 |
| `-DBUILD_SHARED_LIBS=ON` | ON | 编译为共享库 |

## 编译产物路径

编译产物路径见 `.evospec/module.config.yaml` → `artifacts` 列表，每项的 `local_path` 字段。

## 常见编译错误

| 错误 | 原因 | 处理 |
|------|------|------|
| `Bad permissions` / `Load key: bad permissions` / exit 255 | SSH 私钥权限过宽，`CodexSandboxUsers` 组有访问权 | `icacls "C:\Users\Administrator\.ssh\id_rsa" /inheritance:r /grant:r "Administrator:(R)"` |
| `autoaiLog.h: No such file` | 未 source 工具链环境 | 重新执行 `source env_setup.sh ac8215e` |
| `make: command not found` | SSH 会话环境变量丢失 | 重新 source 后再 make |
| `undefined reference to dlopen` | 未链接 dl 库 | CMakeLists.txt 中添加 `target_link_libraries(... dl)` |
| 产物未更新 | 增量编译未触发 | `make clean && make <config: build.make_target>` |

## 编译完成后

推板验证：`@references/us-board-deploy.md`
