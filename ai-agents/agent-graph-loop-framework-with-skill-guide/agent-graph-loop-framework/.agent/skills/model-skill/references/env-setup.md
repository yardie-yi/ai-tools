# 环境配置

> 环境配置来源为 `.evospec/module.config.yaml`；只读取本次目标对应的 `build`、`deploy`、`debug` 或 `git` 节。

## 初始化步骤

1. 确认宿主系统、所需工具和版本。
2. 仅当目标是构建时，检查所选 build strategy 的 shell、命令、远端连接与工具链初始化方式。
3. 仅当目标是部署时，检查部署 transport 和目标设备连接。
4. 仅当目标是提交或推送时，检查 Git remote、凭据和目标分支。
5. 不在仓库配置中保存密码、token 或私钥；只允许保存凭据来源或操作提示。

## 构建环境

展示所选 `<config: build.strategies.<id>>` 的 description 和 manual_steps。自动命令执行失败时区分：网络、认证、工具缺失、工具链未初始化和源码错误。

## 部署环境

仅在部署环境检查时运行安全的 `<config: deploy.preflight_commands>`；不在环境配置阶段执行删除、覆盖或重启命令。

## 可移植性检查

迁移到其他项目后至少确认：

- `module.root` 与 paths 均相对模块根目录解析
- build 命令不含旧项目地址、用户、目标名或芯片名
- artifacts 与 deploy scenarios 一一对应
- debug TAG、进程名和配置文件路径已替换
- git push 模板与仓库托管方式一致
