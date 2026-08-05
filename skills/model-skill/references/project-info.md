# 项目资源索引

> **配置来源**：项目路径、板端路径、关联模块均来自 `.evospec/module.config.yaml`，使用前先读取该文件。

## 需求文档

| 类型 | 路径 |
|------|------|
| PRD / 需求文档 | `.evospec/input/prd/`（手动放入） |
| 详细设计文档 | `<config.module.id>-detail-design.md` |
| 下载子进程架构 | `download_package/ARCHITECTURE.md` |
| 插件开发指南 | `plugins/plugin_template/PLUGIN_BASE_GUIDE.md` |

> 分析需求时优先读 `.evospec/input/prd/` 下的最新 PRD 文件。

## 输出产物目录（.evospec/output）

| 目录 | 内容 | 生成时机 |
|------|------|----------|
| `.evospec/output/design/` | 需求设计方案文档 | 需求分析完成后 |
| `.evospec/output/bug-log/` | Bug 修复记录 | 推板验证通过后 |
| `.evospec/output/push-log/` | Git 提交记录 | git push 后 |

## 编译环境

- **方式**：SSH 连接远程编译服务器
- **详细步骤**：见 `@references/env-setup.md`

## 板端调试

- **详细命令**：见 `@references/debug-commands.md`

## 相关模块位置

关联模块路径见 `.evospec/module.config.yaml` → `related_modules` 列表。

| 配置项 | 引用 |
|------|------|
| 配置文件（板端） | `<config: board.config_file>` |
| 插件部署路径（板端） | `<config: board.plugin_deploy_path>` |

# cluster-app 不涉及 OTA 升级包，此项不适用
