# 模块配置约定

`model-skill` 必须先读取当前模块 `.evospec/module.config.yaml`。本文件只定义字段语义，不保存任何模块专用值。

## 必填字段

```yaml
module:
  id: <模块唯一标识>
  name: <模块显示名>
  description: <模块职责简述>
  framework: <主要框架或技术栈>
  platform: <目标平台或板型>

build:
  server:
    host: <远程编译服务器>
    user: <用户名>
    password: <密码提示，可为空>
  remote_build_dir: <远程编译目录>
  toolchain_init: <工具链初始化命令>
  make_target: <编译目标>
  local_project_path: <本地模块根目录，相对 module_root>

artifacts:
  - id: <产物ID>
    description: <产物说明>
    local_path: <本地产物路径，相对 module_root>
    board_path: <板端目标路径>
    deploy_type: file|dir

board:
  write_protect_cmd: <解除写保护命令>
  remount_cmd: <重新挂载读写命令>
  processes_to_kill: [<进程名>]
  chmod_path: <推送后 chmod 的板端路径>
  config_file: <板端配置文件路径>
  plugin_deploy_path: <插件部署路径，如无则为空>
  verify_commands:
    - <推板后验证命令>

debug:
  log_tags: [<日志TAG或关键字>]
```

## 可选字段

```yaml
development:
  architecture: <分层架构说明>
  source_roots: [<源码根目录>]
  build_files: [<构建脚本或工程文件>]
  log_macros: [<日志宏或日志接口>]
  high_frequency_callbacks: [<高频回调名>]

package:
  artifacts:
    - id: <升级包或发布包ID>
      path: <产物路径>

related_modules:
  - name: <关联模块名>
    path: <关联模块路径>
```

## 使用规则

- 生成命令时使用配置值替换 `<config: ...>` 占位符。
- 配置缺失时先提示缺失字段，不要把当前模块值写入通用 skill。
- 需要新增模块差异时，优先扩展 `.evospec/module.config.yaml`，不要改 `references/` 通用流程。
