# 环境配置

> 环境配置来源为 `.evospec/module.config.yaml` → `build`、`deploy`、`debug`、`git`。

## 初始化步骤

1. 确认宿主系统、所需工具和版本。
2. 对每个启用的 build strategy 检查其 shell、命令、远端连接与工具链初始化方式。
3. 检查部署 transport 可用性和目标设备连接。
4. 检查 Git remote、凭据和目标分支。
5. 不在仓库配置中保存密码、token 或私钥；只允许保存凭据来源或操作提示。

## 构建环境

展示 `<config: build.strategies>` 中启用策略的 description 和 manual_steps。自动命令执行失败时区分：网络、认证、工具缺失、工具链未初始化和源码错误。

## 部署环境

运行 `<config: deploy.preflight_commands>`；只做连接检查，不在环境配置阶段执行删除、覆盖或重启命令。

## 可移植性检查

迁移到其他项目后至少确认：

- `module.root` 与 paths 均相对模块根目录解析
- build 命令不含旧项目地址、用户、目标名或芯片名
- artifacts 与 deploy scenarios 一一对应
- debug TAG、进程名和配置文件路径已替换
- git push 模板与仓库托管方式一致
