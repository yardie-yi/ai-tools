# model-skill 通用模板使用说明

- 文档版本：1.0
- 适用配置版本：`.evospec/module.config.yaml` → `schema_version: 2`
- 适用对象：模板使用者、负责初始化或迁移模板的 Agent

## 0. 文档目的

`model-skill` 将项目开发流程与项目参数分离：

- 通用流程位于 `.codex/skills/model-skill/`；
- 项目参数位于 `.evospec/module.config.yaml`；
- 项目强制约束位于 `.evospec/rules/`；
- 需求、设计、Bug、部署和代码分析记录位于 `.evospec/input/`、`.evospec/output/`；
- `references/` 只保存稳定的阶段流程，不保存服务器、芯片、路径、进程、日志宏、分支等项目常量。

本文分为两部分：

1. **给人看的迁移说明**：在新模块或新项目中需要复制、修改、补充和验证什么。
2. **给 Agent 看的初始化协议**：Agent 应如何读取代码、填写配置、向用户询问无法确认的信息，并完成验证。

---

# 第一部分：给人看的使用说明

## 1. 适用场景

以下情况可以使用本模板：

- 为一个新模块建立统一的需求、开发、构建、部署和提交工作流；
- 将已有项目的专用 Skill 改造成配置驱动的通用 Skill；
- 在同一代码仓库中，为不同模块分别维护构建、产物、部署和调试参数；
- 将模板从一个项目复制到另一个项目，同时避免携带旧项目的服务器、路径、进程或分支信息。

## 2. 目录放置方式

将模板复制到新项目或新模块的根目录。推荐结构如下：

```text
<module-root>/
├─ .codex/
│  └─ skills/
│     └─ model-skill/
│        ├─ SKILL.md
│        ├─ README.md
│        ├─ USAGE.md
│        ├─ agents/
│        └─ references/          # 保持现有 11 个 Markdown 文件
├─ .evospec/
│  ├─ module.config.yaml         # 当前模块的唯一主配置
│  ├─ rules/                     # 项目约束
│  ├─ scripts/                   # 通用辅助脚本
│  ├─ input/prd/                 # 需求输入
│  └─ output/
│     ├─ design/
│     ├─ bug-log/
│     ├─ push-log/
│     └─ code-analysis/
└─ <项目源码与构建文件>
```

### 模块级与项目级放置

- **一个仓库只有一个主要模块**：放在仓库根目录。
- **一个仓库包含多个相对独立模块**：每个模块可各自维护一份 `.evospec/module.config.yaml`；Skill 可以共用，也可以跟随模块复制。
- `module.root` 应指向配置所描述模块的根目录。优先使用相对路径，避免写入个人电脑绝对路径。

## 3. 迁移时不得随意修改的内容

### 3.1 `references/` 的保护边界

`references/` 中以下 11 个 Markdown 文件应保持文件名、数量和职责稳定：

| 文件 | 职责 |
|---|---|
| `us-requirements.md` | 需求分析与设计文档 |
| `us-feature-dev.md` | 功能开发 |
| `us-bug-fix.md` | Bug 定位、修复与回归 |
| `us-build.md` | 构建流程 |
| `us-board-deploy.md` | 部署与验证 |
| `us-git-submit.md` | Git 提交与推送 |
| `debug-commands.md` | 调试命令 |
| `project-info.md` | 项目资源导航 |
| `env-setup.md` | 环境检查 |
| `us-code-analysis.md` | 代码架构分析 |
| `us-rules.md` | 规则管理 |

迁移到新项目时：

- 不新增、删除或重命名这些文件；
- 不把项目服务器、账号、绝对路径、进程名、芯片名、日志宏或分支写进这些文件；
- 只有当所有项目都需要改变同一套通用流程时，才修改对应 reference；
- 项目差异优先写入配置文件，其次写入规则文件。

### 3.2 `SKILL.md` 路由表

通常不需要修改路由表。只有新增了真正独立的工作阶段或意图类别，且现有 11 个阶段无法承载时，才评估修改；普通项目差异不属于修改路由表的理由。

## 4. 新项目必须修改的主配置

主配置文件：

```text
.evospec/module.config.yaml
```

模板中的 `REQUIRED` 表示尚未配置。使用相关功能前必须替换；不得把 `REQUIRED` 当成真实命令、路径或名称执行。

### 4.1 模块基本信息：`module`

| 配置项 | 需要填写的内容 | 常见来源 |
|---|---|---|
| `module.id` | 稳定、简短、可用于文件或日志标识的模块 ID | 模块目录名、构建目标名 |
| `module.name` | 人类可读名称 | README、产品或模块名称 |
| `module.description` | 模块职责简述 | README、架构文档、源码入口 |
| `module.root` | 模块根目录，建议相对路径 | 模板放置位置 |
| `module.platform` | OS、芯片平台、MCU、SoC 或运行平台 | 工具链、构建脚本、项目文档 |
| `module.framework` | 主要框架或运行体系，可为空 | 源码、依赖和构建文件 |
| `module.runtime_processes` | 运行时进程、服务或任务名称 | 服务文件、启动脚本、板端实测 |

### 4.2 文档路径：`paths`

根据当前项目的目录习惯填写：

- `architecture_sources`：架构文档、接口文档、README 等来源；
- `requirement_input`：需求或 PRD 输入目录；
- `design_output`：设计方案输出目录；
- `bug_log_output`：Bug 修复记录目录；
- `push_log_output`：提交和推送记录目录；
- `code_analysis_output`：代码分析文档目录。

若没有既有目录，建议保留模板中的 `.evospec/input` 和 `.evospec/output` 结构。路径优先使用相对路径。

### 4.3 任务编号：`work_item`

| 配置项 | 说明 |
|---|---|
| `system` | Jira、禅道、GitHub Issue、内部需求系统或 `manual` |
| `id_label` | 文档中展示的编号名称，例如“需求编号”“Task ID” |
| `id_pattern` | 编号校验正则；不确定时可暂用宽松规则 |
| `filename_template` | 设计、Bug 和提交记录的文件命名模板 |

如果团队没有任务系统，可配置：

```yaml
work_item:
  system: manual
  id_label: Task ID
  id_pattern: "^.+$"
  filename_template: "{date}-{task.id}-{summary}.md"
```

Agent 不得自行编造任务编号。用户没有提供编号时，应保留可见占位符或询问用户。

### 4.4 架构信息：`architecture`

- `style`：分层架构、事件驱动、插件式、客户端/服务端、裸机任务模型等；
- `flow`：核心数据或控制流，按发生顺序填写；
- `layers`：主要层级、目录或职责；
- `related_modules`：本模块经常交互或可能受影响的模块。

架构配置用于帮助 Agent 导航，不能替代源码事实。代码与配置不一致时，应以代码和正式架构文档为依据，并更新配置或记录差异。

### 4.5 构建配置：`build`

至少要确认：

- 是否允许自动构建：`enabled`；
- 默认构建策略：`default_strategy`；
- 每种策略使用的宿主 Shell；
- 工具链初始化方式；
- 构建命令；
- 清理命令；
- 常见错误及处理方式。

一个项目可以同时配置多个策略，例如：

- `local`：本机编译；
- `remote`：SSH 到编译服务器；
- `container`：Docker 或开发容器；
- `ci`：只提供 CI 触发或复现步骤。

示例结构：

```yaml
build:
  enabled: true
  default_strategy: local
  strategies:
    local:
      enabled: true
      host_shell: bash
      description: 本机增量构建
      commands:
        - cmake --build build --target demo
      manual_steps: []
    remote:
      enabled: false
      host_shell: bash
      description: 远程编译服务器构建
      commands: []
      manual_steps: []
  clean_command: "cmake --build build --target clean"
  common_errors: []
```

远程服务器地址、用户名、端口和远端工作目录无法从仓库可靠确认时，必须由用户提供。密码、Token 和私钥不得写入配置。

### 4.6 构建产物：`artifacts`

每个需要验证或部署的产物都应有独立 ID：

```yaml
artifacts:
  - id: main_binary
    description: 主程序
    build_strategy: local
    local_path: build/bin/demo
    target_path: /opt/demo/bin/demo
```

每项至少确认：

- `id`：供部署场景引用；
- `description`：产物用途；
- `build_strategy`：由哪个构建策略生成；
- `local_path`：本地产物路径；
- `target_path`：目标设备路径，若不部署可留空。

不要仅凭文件扩展名判断哪个产物应部署；存在多个候选文件时应由用户确认。

### 4.7 部署配置：`deploy`

部署涉及覆盖、删除和重启，必须保守配置。

只有以下信息完整且验证过时，才把 `deploy.enabled` 设置为 `true`：

- 传输方式，如 adb、scp、rsync、串口工具或厂商工具；
- 执行命令所使用的宿主 Shell；
- 设备连接检查命令；
- 文件系统准备或挂载命令；
- 需要停止和恢复的进程或服务；
- 每个部署场景对应的 artifact；
- 目标端删除、传输和恢复命令；
- 部署后的验证命令和成功标准。

推荐为不同改动范围配置不同场景：

```yaml
deploy:
  enabled: true
  transport: adb
  host_shell: cmd
  preflight_commands:
    - adb get-state
  prepare_commands: []
  stop_process_command_template: "adb shell pkill -f {process}"
  processes:
    - demo_service
  scenarios:
    code_only:
      description: 仅部署主程序
      artifact_id: main_binary
      remove_commands:
        - adb shell rm -f {artifact.target_path}
      transfer_command:
        - adb push {artifact.local_path} {artifact.target_path}
  post_commands: []
  verification:
    commands:
      - adb shell ps | grep demo_service
    success_criteria:
      - 目标进程正常运行
      - 日志中没有持续错误
```

以上命令只是结构示例，不能直接复制到不了解的项目。

如果目标设备、序列号、板端路径、进程名、停止/启动方式或权限要求不确定：

1. 保持 `deploy.enabled: false`；
2. 让 Agent 列出待确认项；
3. 用户确认后再启用；
4. 首次执行必须先 `--dry-run`。

### 4.8 调试配置：`debug`

需要按项目填写：

- 实时日志命令；
- 清空、保存日志命令；
- 不同宿主系统的过滤命令；
- 日志 TAG；
- 进程查询命令模板；
- 常用配置文件路径。

如果项目没有统一日志工具，可以复用仓库现有调试方式；不要为了填满配置而创造新的日志体系。

### 4.9 Git 配置：`git`

确认：

- Commit Message 格式；
- 描述语言和长度；
- Git 托管或评审方式；
- remote；
- 目标分支或 review ref；
- push 命令模板；
- 允许的分支模式；
- 禁止提交的构建目录和产物。

示例：

```yaml
git:
  enabled: true
  commit:
    template: "{task.id}: {task.summary}"
    summary_language: zh-CN
    max_summary_length: 72
  push:
    provider: git
    remote: origin
    target_branch: refs/heads/main
    command_template: "git push {remote} HEAD:{target_branch}"
  branch_patterns: []
  forbidden_paths:
    - build/
    - out/
    - "*.o"
    - "*.bin"
```

不能仅根据当前本地分支猜测正式推送目标。Gerrit review ref、受保护分支或特殊 push option 必须由仓库规范或用户确认。

### 4.10 开发规则参数：`development`

该配置描述项目代码约束，不描述业务需求。

- `languages`：主要编程语言；
- `build_file_patterns`：新增源码时可能需要修改的构建文件；
- `logging`：日志 include、命名空间、宏、固定 TAG 和必打点位置；
- `comments`：注释语言和粒度；
- `high_frequency_calls`：循环、轮询、定时器等高频路径中的高开销调用；
- `extension_contract`：插件、驱动、策略等扩展点的基类、工厂函数和注册方式。

若项目没有某种机制，应将对应 `enabled` 设置为 `false`，不要为满足模板而虚构接口。

### 4.11 代码分析配置：`code_analysis`

- `index_mode`：通常保持 `discover`；
- `preferred_documents`：可为高频问题配置关键词与优先分析文档。

这部分可为空，不影响基础开发流程。

## 5. 哪些内容应写到哪里

| 变化类型 | 修改位置 |
|---|---|
| 模块名、平台、框架、目录 | `module.config.yaml` |
| 构建服务器、工具链、命令 | `module.config.yaml` → `build` |
| 产物和板端路径 | `module.config.yaml` → `artifacts`、`deploy` |
| 进程、日志命令、TAG | `module.config.yaml` → `module`、`debug`、`development.logging` |
| Commit 格式和推送分支 | `module.config.yaml` → `git` |
| 项目必须遵守的编码或提交规则 | `.evospec/rules/` 与配置开关 |
| 单个需求、设计、Bug 或分析结果 | `.evospec/input/`、`.evospec/output/` |
| 所有项目都应改变的阶段流程 | 对应 `references/*.md`，谨慎修改 |
| 意图分类或阶段路由 | `SKILL.md`，极少修改 |

## 6. 凭据和敏感信息

禁止把以下内容写入仓库配置：

- 密码；
- Access Token；
- SSH 私钥正文；
- Cookie；
- 设备解锁密钥；
- 内部服务的长期密钥。

配置中只允许保存：

- 服务器地址、端口和用户名（团队允许提交时）；
- 环境变量名称；
- SSH Host 别名；
- 凭据管理工具名称；
- “从何处获取凭据”的说明。

例如：

```yaml
credential_source: "SSH config host alias: build-server"
```

不要写：

```yaml
password: "123456"
```

## 7. 人工迁移流程

### 步骤 1：复制模板

复制以下目录和文件：

```text
.codex/skills/model-skill/
.evospec/rules/
.evospec/scripts/
.evospec/module.config.yaml
.evospec/input/
.evospec/output/
```

### 步骤 2：清理旧项目残留

全文检查并删除或替换：

- 旧项目名和模块名；
- 旧芯片、平台或框架名；
- 旧服务器地址、用户名和目录；
- 旧板端路径、进程和服务名；
- 旧 Git remote、分支和 Gerrit ref；
- 旧日志 TAG、宏和 include；
- 旧构建目标和产物名。

### 步骤 3：填写可确定配置

优先从当前仓库的 README、构建文件、脚本、CI、服务定义和同类模块中获取证据。

### 步骤 4：补充用户才能确认的信息

重点确认远程服务器、目标设备、部署权限、正式推送目标、任务系统规则和验收标准。

### 步骤 5：保持不完整功能关闭

- 构建未配置完整：将对应 strategy 的 `enabled` 设为 `false`；
- 部署未配置完整：保持 `deploy.enabled: false`；
- Git 推送未确认：可保留本地 commit 流程，但不得执行 push；
- 日志、插件或高频调用规则不适用：设置对应 `enabled: false`。

### 步骤 6：执行验收检查

- YAML 能正常解析；
- 没有 `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG` 被误当成真实值；
- 配置中的相对路径从模块根目录解析正确；
- 构建命令与仓库脚本一致；
- artifact 路径和构建结果一致；
- deploy scenario 引用的 artifact 均存在；
- 首次部署先运行 `--list` 和 `--dry-run`；
- Git push 目标已由仓库规范或用户确认；
- `references/` 的 11 个文件未增删、未改名；
- 配置和文档中没有密码、Token 或私钥。

## 8. 推荐的初始化请求

将模板复制到新项目后，可以对 Agent 使用以下请求：

```text
使用 model-skill 的通用模板初始化协议，分析当前模块代码和构建文件，完善
.evospec/module.config.yaml。能够从仓库可靠确定的内容直接填写；无法确定的内容
按 USAGE.md 的要求集中询问我。不要猜测服务器、板端路径、进程、部署命令、
正式 push 分支或凭据。保持 references 中现有 Markdown 文件不增不删、不改名。
完成后先做配置检查和 dry-run，不执行真实部署和 push。
```

---

# 第二部分：给 Agent 看的初始化协议

## 9. Agent 的任务定义

当用户要求“初始化模板”“迁移 Skill”“完善模块配置”“让 model-skill 适配当前项目”时，Agent 应执行本节协议。

Agent 的目标不是把所有字段机械填满，而是：

1. 从当前项目证据中提取可信配置；
2. 把项目差异写入 `.evospec/module.config.yaml` 或 `.evospec/rules/`；
3. 对无法可靠确定的信息向用户提问；
4. 对不完整或危险的功能保持禁用；
5. 验证配置能被读取，但在未经授权时不执行真实部署、远程构建或 push；
6. 保持 `references/` 路由文件集合稳定。

## 10. Agent 的硬性约束

Agent **必须**遵守：

1. 不新增、删除、重命名 `references/` 中现有 11 个 Markdown 文件。
2. 不因项目差异大改 `SKILL.md` 路由表。
3. 不把项目常量写入 `references/*.md`。
4. 不沿用其他项目、历史对话或模板示例中的服务器、路径、进程、芯片、日志宏或分支。
5. 不编造任务编号、构建命令、产物路径、部署命令、进程名或 push ref。
6. 不把密码、Token、私钥或 Cookie 写入配置、脚本、日志或文档。
7. 不覆盖用户已有且与本次初始化无关的修改。
8. 对删除、覆盖、停止进程、重启、真实部署、远程执行和 push 等动作保持保守；未获得明确授权时只分析、配置和 dry-run。
9. 证据冲突时不得静默选择，应列出冲突并向用户确认。
10. 用户已经提供过的信息不得重复询问。

## 11. Agent 的证据优先级

填写配置时按以下优先级判断：

1. 当前仓库可执行脚本、构建文件和 CI 配置；
2. 当前源码、服务文件、注册表和配置文件；
3. 当前仓库 README、架构文档和开发说明；
4. Git remote、分支配置和提交规范；
5. 同仓库同类型模块的稳定实现；
6. 用户明确提供的信息；
7. 命名和目录结构推断。

第 7 类只能形成候选，不能用于填写高风险字段。

## 12. Agent 初始化流程

### 阶段 A：定位范围

1. 确认当前仓库或模块根目录。
2. 查找 `.evospec/module.config.yaml`；不存在时从通用模板创建。
3. 读取 `SKILL.md`、本 `USAGE.md`、配置模板和规则索引。
4. 记录当前 Git 状态，避免覆盖用户修改。
5. 建立初始化清单，不立即执行构建、部署或 push。

### 阶段 B：扫描项目证据

按需检查：

- `README*`、`docs/`、架构说明；
- `CMakeLists.txt`、Makefile、Ninja、Meson、Gradle、Cargo、package 脚本等构建入口；
- `build*.sh`、`build*.bat`、PowerShell、Python 构建脚本；
- CI 文件、Dockerfile、开发容器配置；
- 启动脚本、systemd service、init 脚本、任务注册代码；
- 日志头文件、宏定义和同类模块日志用法；
- 插件基类、工厂函数和注册文件；
- `.git/config`、remote、团队提交说明；
- 既有产物输出目录和部署脚本；
- `.gitignore` 中的构建产物模式。

只读取与配置有关的必要范围，不无目的遍历大型仓库。

### 阶段 C：给配置项分级

Agent 必须把待填写内容分成三类。

#### C1. 可直接填写

只有在仓库证据唯一、明确且低风险时直接填写，例如：

- 模块目录名和已声明的构建 target；
- 源码语言；
- 已存在的本地构建脚本及其参数；
- 构建文件模式；
- 已明确声明的产物输出路径；
- 仓库中明确存在的日志宏和 include；
- 明确的插件基类和注册入口；
- `.gitignore` 中明确的生成目录；
- 模板自带的 `.evospec/input`、`.evospec/output` 路径。

填写时应保留证据位置，供最终报告说明。

#### C2. 可以提出候选，但需用户确认

存在多个合理值或环境差异时，Agent 应展示候选并询问用户，例如：

- 多个构建 target 中哪个是当前模块目标；
- Debug、Release 或产品变体哪个是默认策略；
- 多个产物中哪些需要部署；
- 多个进程或服务哪个属于当前模块；
- 多个 remote 或分支中哪个是正式推送目标；
- 多种部署脚本中哪个是团队当前使用方式；
- 架构风格、模块职责或关联模块的概括。

未经确认，不得把候选当成确定事实用于真实操作。

#### C3. 必须由用户输入或明确确认

以下信息无法从仓库可靠确定时，Agent 必须询问用户：

- 远程编译服务器地址或 SSH Host 别名；
- 远程用户名、端口、远端源码目录和工具链初始化方式；
- 凭据来源或认证方式，但不得索要密码、Token 或私钥正文；
- 目标设备类型、设备序列号或连接选择规则；
- 板端安装目录、可写分区和权限要求；
- 需要停止、启动或重启的进程/服务，以及安全命令；
- 正式部署场景和验证成功标准；
- Git/Gerrit 正式 push 分支、review ref 或 push option；
- 团队任务系统、任务编号格式和 Commit 规范；
- 用户期望启用或禁用的高风险自动化能力；
- 仓库外部的内部文档、服务器或设备信息。

## 13. Agent 的提问规则

### 13.1 什么时候提问

Agent 完成首轮代码扫描后再提问，避免询问可以从仓库确定的信息。

### 13.2 如何提问

- 将相关问题集中成一组；
- 每个问题注明为什么需要；
- 已发现候选时给出候选和证据；
- 允许用户回答“暂不配置”；
- 不询问秘密值，只询问凭据来源；
- 不使用模糊问题，如“还有别的吗”；
- 不重复询问用户已回答的内容。

推荐格式：

```text
以下字段无法从当前仓库可靠确定，请确认：

1. 默认构建方式
   - 发现候选：local_build.sh、CI remote-build
   - 请选择：local / remote / 两者都保留

2. 远程构建连接
   - 需要：SSH Host 别名、远端工作目录、工具链初始化命令
   - 不需要提供密码或私钥；可回答“暂不配置远程构建”

3. 部署目标
   - 需要：传输方式、目标路径、进程名、停止/恢复方式
   - 不确定时将保持 deploy.enabled: false

4. 正式推送目标
   - 当前只检测到 remote origin，无法确认正式 branch/ref
   - 请提供目标分支或回答“仅配置本地 commit”
```

### 13.3 用户暂时无法提供时

Agent 应：

- 保留空值或 `REQUIRED`；
- 将对应 strategy 或功能设为 `enabled: false`；
- 在最终报告中列出阻塞项；
- 继续完成不依赖该信息的配置；
- 不用模板示例或其他项目值代替。

## 14. Agent 修改文件的规则

### 14.1 优先修改

1. `.evospec/module.config.yaml`
2. `.evospec/rules/INDEX.md` 和已有规则文件的开关或项目约束
3. `.gitignore`，仅在用户允许且确有生成物遗漏时
4. `README.md`，仅补充当前模块如何调用 Skill 或链接本说明

### 14.2 谨慎修改

- `SKILL.md`：只允许补充“初始化时读取 USAGE.md”等通用入口，不因项目参数改路由。
- `.evospec/scripts/`：只修改通用解析能力，不写入项目常量。

### 14.3 默认不得修改

- `references/` 的文件集合、文件名和路由职责；
- 与当前初始化无关的业务代码；
- 用户已有的未提交改动；
- 凭据文件和个人环境配置。

## 15. 字段填写策略

### 15.1 `REQUIRED`、空值和 `enabled`

- `REQUIRED`：该功能使用前必须解决的阻塞配置；
- 空字符串或空数组：该项可选、暂未知或当前不适用；
- `enabled: false`：即使其他字段存在，也不得执行该能力；
- `enabled: true`：仅在必要字段完整、命令来源可信且已验证时设置。

不要为了消除 `REQUIRED` 而填入猜测值。

### 15.2 命令配置

- 优先引用仓库已有脚本，而不是在 YAML 中复制长命令；
- 命令应从 `module.root` 可稳定执行；
- 路径含空格时正确引用；
- 区分 Windows `cmd`、PowerShell 和 POSIX shell；
- 远程命令应明确本地层与远端层的引号边界；
- 破坏性命令必须有前置检查；
- 命令中不得包含秘密值。

### 15.3 模板变量

配置命令可使用：

- `{module.root}`、`{module.id}`、`{module.name}`；
- `{artifact.id}`、`{artifact.local_path}`、`{artifact.target_path}`；
- `{task.id}`、`{task.summary}`；
- 部署进程变量 `{process}`；
- 配置明确支持的其他变量。

Agent 在 dry-run 中必须检查所有变量已解析，不能把带 `{...}` 的未解析命令直接执行。

## 16. Agent 验证协议

### 16.1 静态检查

Agent 至少检查：

1. YAML 语法正确，根节点为 mapping；
2. `schema_version` 与模板兼容；
3. 所有启用节不存在未解决的 `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG`；
4. `build.default_strategy` 指向已存在且启用的策略；
5. `artifacts[*].id` 唯一；
6. 每个部署场景引用存在的 artifact；
7. 所有相对路径从模块根目录解析；
8. Git 禁止路径覆盖主要构建输出；
9. 配置中没有明显密码、Token、私钥或 Cookie；
10. `references/` 仍为原有 11 个 Markdown 文件。

### 16.2 安全 dry-run

在用户未要求真实执行时：

- 可以解析和展示构建命令，但不执行远程构建；
- 可以运行无副作用的版本、路径和连接检查；
- 部署仅运行：

```bat
.evospec\scripts\push_to_board.bat --list
.evospec\scripts\push_to_board.bat <scenario-id> --dry-run
```

- 不执行 remove、push、copy、stop、restart、reboot 等真实动作；
- 不执行 Git push。

若脚本依赖 PyYAML，应先检查依赖；缺少时报告安装命令，不宣称验证成功。

### 16.3 可执行性检查

只有用户明确要求并授权后，才执行实际构建、部署或 push。执行前仍需：

- 展示所选策略或场景；
- 确认工作区状态；
- 确认命令不含未解析字段；
- 确认产物属于本次构建；
- 对破坏性动作说明影响范围；
- 保存实际输出和结论。

## 17. Agent 完成后的输出格式

初始化完成后，Agent 应给出以下报告：

```markdown
# model-skill 初始化结果

## 已修改文件
- `.evospec/module.config.yaml`
- ...

## 自动识别并写入
| 配置路径 | 值 | 证据 |
|---|---|---|

## 用户确认后写入
| 配置路径 | 值 | 用户确认内容 |
|---|---|---|

## 保持禁用或未解决
| 配置路径 | 原因 | 需要用户提供 |
|---|---|---|

## 验证结果
- YAML：通过/失败
- 构建配置：通过/未验证
- 部署列表：通过/未配置
- 部署 dry-run：通过/未执行
- Git push 目标：已确认/未确认
- references 文件集合：未变化

## 未执行的高风险操作
- 未执行真实部署
- 未执行 Git push
- ...

## 下一步
- 用户需要补充的最少信息
- 可以安全执行的下一条命令
```

报告必须区分：

- 从代码确定的事实；
- Agent 的推断；
- 用户确认的信息；
- 尚未解决的内容；
- 实际执行过的命令；
- 仅展示但未执行的命令。

## 18. Agent 自检清单

初始化结束前逐项确认：

- [ ] 已读取本 `USAGE.md`
- [ ] 已读取当前配置和规则索引
- [ ] 已检查工作区状态并保护用户改动
- [ ] 已从当前仓库收集证据，没有复用旧项目值
- [ ] 可确定字段已填写并有证据
- [ ] 不确定字段已询问用户或保持禁用
- [ ] 未索要或保存秘密值
- [ ] 未新增、删除、重命名 references 文件
- [ ] 未因项目差异修改路由表
- [ ] 所有启用配置无未解析占位符
- [ ] 已完成 YAML 和路径检查
- [ ] 部署仅 dry-run，除非用户明确授权真实执行
- [ ] 未执行 Git push，除非用户明确授权
- [ ] 已输出初始化结果和未解决项

---

# 附录 A：最小可用配置范围

如果用户暂时只需要需求分析和本地代码开发，最小配置可以只完成：

- `module`；
- `paths`；
- `work_item`；
- `architecture` 的基本描述；
- `development`；
- 本地 `build` 策略；
- `git.commit`。

同时可以保持：

```yaml
deploy:
  enabled: false
```

并在 Git push 目标未确认时不执行 push。

# 附录 B：配置决策原则

遇到不确定项时按以下顺序选择：

1. **能从当前仓库唯一证明**：填写。
2. **存在多个候选**：展示候选并询问用户。
3. **涉及外部环境或破坏性操作**：必须询问用户。
4. **用户暂时不能确认**：保持禁用并记录。
5. **模板示例看起来可用但无项目证据**：不得使用。

