# model-skill 使用说明 — cluster-app

> 适用工具：**Codex**（`.codex/skills/`）
> 触发方式：**手动调用**（必须先在对话中说出调用关键词）

---

## 1. 这是什么

`model-skill` 是 **cluster-app 仪表盘 HMI 应用模块**的开发维护入口。它扮演一个调度层的角色：接收用户的开发意图，自动判断当前开发阶段，读取对应子 skill 文件，按规范流程完成任务。

cluster-app 基于 **AWTK 框架**，主进程为 `awtkhmi`，运行于 ac8215e 平台。

> **重要**：skill 不会自动激活。每次开始开发任务前，必须先在对话中显式调用它。
>
> **注意**：本目录（`.codex/skills/`）供 **Codex** 使用。Claude Code 用户请使用 `.claude/skills/model-skill/`，两者内容保持同步。

---

## 2. 如何调用

### 第一步：在会话中说出调用关键词

在 Codex 对话框中输入以下任一表达，即可激活 model-skill：

```
使用 model-skill
调用 model-skill
model-skill，帮我 xxx
/model-skill
```

**完整示例：**

```
使用 model-skill，仪表盘车速不更新，logcat 有日志
```

```
model-skill，我要新增一个 ADAS 显示模块
```

```
使用 model-skill 帮我提交代码
```

> 不说调用关键词直接描述问题，skill 不会介入，AI 会按普通对话回答。

### 第二步：描述开发意图（阶段自动识别）

调用后，skill 根据你的描述自动识别开发阶段并分发：

| 你的描述 | 自动进入 |
|---|---|
| "分析这个 PRD / 设计接口" | 需求分析 |
| "新增一个功能 / 实现某接口" | 功能开发 |
| "有个 bug / 报错了 / 修复一下" | Bug 修复 |
| "编译 / make / ssh 到服务器" | 编译构建 |
| "推板 / adb / 部署验证" | 推板验证 |
| "提交 / commit / push / git" | Git 管理 |
| "怎么调 log / 看串口" | 调试命令 |
| "环境怎么配 / 工具链" | 环境配置 |
| "分析这段代码 / 看下架构" | 代码分析 |
| "查看规则 / 添加规则" | 规则管理 |

> 如果阶段不明确，skill 会主动询问："你当前在哪个阶段？"

---

## 3. 执行流程

skill 被触发后，内部按以下顺序执行：

```
① 读取 .evospec/module.config.yaml   ← 加载所有配置变量（服务器、路径、编译目标）
② 读取 .evospec/rules/INDEX.md       ← 加载当前阶段适用的 enabled 规则
③ 读取对应 references/us-*.md        ← 按子文件指引执行具体任务
④ 在规则检查点验证规则约束
```

> 所有路径、服务器地址、产物名称均从 `module.config.yaml` 动态读取，不使用硬编码值。

---

## 3. 使用示例：修复一个 Bug

### 场景

仪表盘上的车速显示不更新了，但其他信号（转速、水温）还是正常的。

### 第一步：调用 skill 并描述现象

在对话中先说调用关键词，再附上日志或现象描述：

```
使用 model-skill，仪表盘车速不更新，日志如下：

仪表盘车速一直显示 0，转速和水温显示正常。
logcat 里没看到明显报错，但也没看到车速相关的更新日志。

05-12 10:15:32 I AWTKHMI: rpm update: 1200
05-12 10:15:32 I AWTKHMI: water_temp update: 85
05-12 10:15:32 D VehicleInterface: recv msg VEHICLE_SPEED value=60
（之后没有 AWTKHMI 侧的 speed update 日志）
```

### 第二步：skill 自动执行以下动作

1. 读取 `.evospec/module.config.yaml`（加载模块配置）
2. 读取 `.evospec/rules/INDEX.md`（R002 log-required 在 bug-fix 阶段 enabled）
3. 检查 `.evospec/output/design/` 和 `.evospec/output/code-analysis/` 下已有的分析文档
4. 根据现象"消息收到但 UI 未更新"定位可疑路径，输出初步结论：
   ```
   涉及模块：VehicleInterface → AWTK 数据绑定层
   可疑代码段：消息回调注册 / 车速绑定变量更新
   定位依据：VehicleInterface 侧日志有 VEHICLE_SPEED，但 AWTKHMI 侧无对应 update，
             怀疑车速信号的回调未注册或绑定变量名不匹配
   ```
5. 查阅代码，找到根因，给出修改方案

### 第三步：确认修改，AI 生成 bug log

代码修改完成后，skill 会在 `.evospec/output/bug-log/` 自动生成记录文件：

```
20260512-<ONES ID>-车速消息回调未注册导致仪表盘不更新.md
```

### 第四步：自行验证（AI 不主动触发）

```
你：好，我去编译推板验证一下
```

编译和推板步骤参考 `references/us-build.md` 和 `references/us-board-deploy.md`。验证通过后，说"可以提交了"，skill 会进入 Git 管理阶段。

### 提问技巧

| 情况 | 推荐写法 |
|---|---|
| 有日志 | `使用 model-skill` + 贴日志 + 说明哪个信号异常 |
| 没有日志 | `使用 model-skill` + 描述哪个界面元素异常 + 其他正常的是什么 |
| 不知道哪个模块 | `model-skill，xxx 显示不对` — skill 会先查分析文档再定位 |
| 想指定排查方向 | `model-skill，怀疑是数据绑定那块的问题，帮我看一下` |

---

## 4. 子文件说明

| 文件 | 阶段 | 说明 |
|---|---|---|
| `references/us-requirements.md` | 需求分析 | PRD 解析、接口设计、方案评审 |
| `references/us-feature-dev.md` | 功能开发 | 新功能实现步骤、AWTK 组件开发规范 |
| `references/us-bug-fix.md` | Bug 修复 | 问题定位、修复流程、bug log 生成 |
| `references/us-build.md` | 编译构建 | SSH 远程编译、本地 CMake 构建、常见编译错误 |
| `references/us-board-deploy.md` | 推板验证 | adb 推板步骤、写保护解除、进程管理 |
| `references/us-git-submit.md` | Git 管理 | commit 格式要求、push 流程、log 生成 |
| `references/debug-commands.md` | 调试 | logcat 过滤、串口命令、常用 adb 调试命令 |
| `references/project-info.md` | 项目资源 | PRD 路径、模块位置、关联服务 |
| `references/env-setup.md` | 环境配置 | 工具链初始化、SSH 免密配置 |
| `references/us-code-analysis.md` | 代码分析 | AWTK 架构梳理、数据流分析、界面层结构 |
| `references/us-rules.md` | 规则管理 | 查看/新增/禁用规则 |

---

## 5. 配置说明

### 5.1 模块配置（`.evospec/module.config.yaml`）

所有运行时参数集中在此文件。**修改这里就能更新 skill 的行为，不需要改 skill 文件本身。**

```yaml
module:
  id: cluster-app

build:
  server:
    host: 172.19.160.73      # 编译服务器 IP
    user: yiwanming          # SSH 用户名
  remote_build_dir: ~/adcj/platform/autoai-services/build-script
  toolchain_init: source env_setup.sh ac8215e
  make_target: cluster-app

artifacts:
  # 仅修改代码时 → 只推二进制
  - id: main_bin
    local_path: ..\build\autoai-services\bin\awtkhmi\bin\awtkhmi
    board_path: /mnt/autoai_platform/bin/awtkhmi/bin/awtkhmi
  # 修改了资源文件时 → 推整个目录
  - id: awtkhmi_dir
    local_path: ..\build\autoai-services\bin\awtkhmi
    board_path: /mnt/autoai_platform/bin
```

**常见修改场景：**

| 场景 | 修改字段 |
|---|---|
| 编译服务器换 IP | `build.server.host` |
| 换登录用户名 | `build.server.user` |
| 产物路径变了 | `artifacts[*].local_path` |
| 板端部署路径变了 | `artifacts[*].board_path` |
| 需要补充日志 TAG | `debug.log_tags` |

### 5.2 规则管理（`.evospec/rules/`）

规则在各开发阶段的检查点强制执行。

**查看所有规则：**

```
.evospec/rules/INDEX.md
```

**当前规则一览：**

| ID | 名称 | 适用阶段 | 默认状态 |
|---|---|---|---|
| R001 | commit-format | git-submit | enabled |
| R002 | log-required | bug-fix, git-submit | enabled |
| R003 | plugin-base | feature-dev | enabled |
| R004 | build-before-deploy | board-deploy | enabled |
| R005 | no-build-artifacts | git-submit | enabled |
| R007 | chinese-comments | feature-dev, bug-fix | enabled |
| R006 | log-in-generated-code | feature-dev, bug-fix | enabled |

**启用 / 禁用规则（示例）：**

编辑 `.evospec/rules/R002-log-required.md`，将 frontmatter 中：

```yaml
status: enabled   →   status: disabled
```

然后同步更新 `INDEX.md` 对应行的状态列。

**新增规则：**

在 `.evospec/rules/` 下按格式 `R<NNN>-<kebab-name>.md` 创建文件：

```yaml
---
id: R006
status: enabled
name: my-rule
applies-to: feature-dev   # 适用阶段
---
```

并在 `INDEX.md` 追加该条目。

---

## 6. 目录结构

```
.codex/skills/model-skill/
├── SKILL.md              ← skill 主入口（AI 读取）
├── README.md             ← 本文档（人类阅读）
├── change_log.md         ← skill 迭代记录
├── references/           ← 各阶段子 skill（与 .claude 版本内容同步）
│   ├── us-requirements.md
│   ├── us-feature-dev.md
│   ├── us-bug-fix.md
│   ├── us-build.md
│   ├── us-board-deploy.md
│   ├── us-git-submit.md
│   ├── debug-commands.md
│   ├── project-info.md
│   ├── env-setup.md
│   ├── us-code-analysis.md
│   └── us-rules.md
└── agents/               ← 子 agent 定义（如有）
```

对应的配置目录（与 Claude Code 共享同一份配置）：

```
.evospec/
├── module.config.yaml    ← 所有可配置参数
├── rules/                ← 开发规则
│   ├── INDEX.md
│   ├── R001-commit-format.md
│   ├── R002-log-required.md
│   ├── R003-plugin-base.md
│   ├── R004-build-before-deploy.md
│   └── R005-no-build-artifacts.md
├── input/                ← PRD、需求输入文件
├── output/               ← bug-log、push-log 等输出
└── scripts/              ← 推板等辅助脚本
```

> `.evospec/` 目录由 cluster-app 下的 `.claude` 和 `.codex` 共享，改一份配置两个工具都生效。

---

## 7. 与 Claude Code 版本的同步说明

`.codex/skills/model-skill/references/` 中的文件与 `.claude/skills/model-skill/references/` 保持内容同步。当 skill 行为需要修改时，**两处文件需同时更新**。

已知同步记录见 `change_log.md`，每次变更均注明"同步文件"字段。

---

## 8. 常见问题

**Q：skill 识别错了阶段怎么办？**

直接补充说明，例如"我现在是要编译，不是推板"，skill 会重新判断。

**Q：推板时 bat 脚本执行失败？**

`.evospec/scripts/push_to_board.bat` 仅适合在 `cmd.exe` 手动双击运行。
在 AI 工具（Codex/Claude Code）中推板时，应直接使用 `references/us-board-deploy.md` 中的 adb 手动命令，避免脚本编码和交互输入问题。

**Q：adb shell 中杀进程命令怎么写？**

使用单引号，并用 `killall`（板端 BusyBox 无 pkill）：

```bash
adb shell 'killall awtkhmi; true'
adb shell 'killall appmgr; true'
```

**Q：如何修改 skill 行为？**

- **参数类**（服务器、路径等）：改 `module.config.yaml`
- **流程类**（步骤顺序、输出格式等）：改对应 `references/us-*.md`（同时更新 `.claude` 和 `.codex` 两份）
- **约束类**（规则增删改）：改 `.evospec/rules/`
- **入口分发逻辑**：改 `SKILL.md`（谨慎修改，两份同步）
