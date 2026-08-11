---
name: ones-assistant
description: ONES 项目管理平台操作助手。核心功能：自动拉取当前用户名下所有未关闭/未解决的 Bug，逐个进行深度分析（问题原因、代码定位、修改建议），结果输出到 .evospec/output/ones-bug-analysis/ 目录。也支持 Bug 单查询/创建/更新、需求管理、状态流转等手动操作。当用户提到 ONES、bug单、需求单、工单、缺陷、分析bug、查bug、提bug、创建需求、更新状态等关键词时触发此 skill。即使用户没有明确说"用ONES"，只要意图是管理或查询项目工作项，也应主动调用此 skill。
---

# ONES 项目管理助手

## 前置检查：确认 MCP 可用

在执行任何 ONES 操作前，先确认 `mcp__ones__who_am_i` 工具可用。

如果 ONES MCP 工具不可用，不要立即终止。工具未加载通常只说明当前客户端尚未注册 ONES MCP，不代表本机没有可复用的连接信息。先按以下顺序自动恢复，减少可避免的人工中断：

1. 读取同目录 `README.md` 的“安装 ONES MCP”章节，识别当前运行环境是 Codex 还是 Claude Code。
2. 检查当前项目及用户级可信配置（如 `~/.claude.json`、`~/.codex/config.toml`）中是否已有名为 `ones` 的 MCP 配置。
3. 若找到可复用的 ONES MCP 地址，使用当前客户端的原生命令完成配置；不得在命令输出或回复中暴露服务器地址、令牌或其他凭据。
4. 新开只读客户端进程，通过 MCP 握手、`tools/list` 和一次 `who_am_i` 调用验证连接。当前会话无法热加载新工具时，提示用户重启客户端后继续原任务。
5. 只有在本机没有可信的 ONES MCP 地址，或自动配置/验证明确失败时，才停止受影响阶段并向用户说明具体缺失项；需要地址时，引导用户从 ONES **个人中心 → 已授权 MCP 客户端** 获取。

确认可用后，调用 `mcp__ones__who_am_i` 获取当前用户的 ID、姓名、时区，后续操作全程需要用到。

---

## 默认上下文

用户没有明确指定时，使用以下默认值：

| 参数 | 默认值 |
|------|--------|
| 项目 | 【日本精机】两轮仪表项目（projectID: `Ld6hAnDVBnwS4BR6`） |
| 负责人 | 当前登录用户（通过 `who_am_i` 获取） |

如果用户指定了其他项目名称，用 `mcp__ones__search_for_projects` 搜索，找到后使用其 projectID。

---

## 核心功能：批量 Bug 分析

> **触发时机**：用户说"分析我的bug"、"分析未解决的bug"、"帮我看看ONES上的bug"等，或用户未明确指令但意图是批量处理 bug 时。

### 整体流程

```
拉取 Bug 列表 → 去重（跳过已有分析）→ 逐个分析 → 输出分析文件
```

### 第一步：拉取当前用户未关闭的 Bug

1. 调用 `mcp__ones__get_issue_fields` 确认项目下 Bug 类型的 issue_type_uuid（项目级 type 与全局不同，须以实际查询结果为准）
2. 用 OneSQL 查询目标用户所有 Bug（不加状态过滤，OneSQL 不支持 NOT IN）：

```sql
SELECT uuid, summary, status_uuid
FROM issue
WHERE project_uuid = "Ld6hAnDVBnwS4BR6"
  AND issue_type_uuid = "<项目级bug_type_uuid>"
  AND assign = "<user_id>"
  AND v$cursor > ""
LIMIT 1000, 50
```

> OneSQL 字段名规则：`project_uuid`、`issue_type_uuid`、`status_uuid`（不是 `project`/`issue_type`/`status`）

3. 调用 `mcp__ones__get_issue_status` 获取已关闭状态 ID 列表，在内存中过滤掉 status_uuid 属于已关闭的条目
4. 向用户展示过滤后的未关闭 Bug 列表（标题、状态），共 N 条

### 第二步：去重——跳过已有分析

列出 `.evospec/output/ones-bug-analysis/` 目录下的已有文件：

```powershell
ls .evospec/output/ones-bug-analysis/
```

文件命名规则为 `<单号>-<模块>-<标题描述>.md`，通过匹配单号前缀判断是否已分析。

- 文件名以该 Bug 的 uuid（或 ONES 编号）开头 → **跳过，不重复分析**
- 不存在匹配文件 → 加入待分析队列

告知用户：共 N 条 Bug，已有分析 M 条，本次新增分析 K 条。

### 第三步：逐个深度分析（参照 model-skill bug 分析流程）

对每条待分析 Bug，执行以下步骤，**不修改任何代码**：

#### 3-0. 获取 Bug 完整信息

调用 `mcp__ones__get_issue_details` 获取：
- 标题、描述、复现步骤、预期/实际结果
- 严重程度、优先级、所属模块/组件
- 附件（如有）

调用 `mcp__ones__get_issue_activities` 获取历史活动记录（状态变化、评论）。

#### 3-1. 确认现象

从 Bug 详情中提取：
- 故障表现（日志关键字、错误码、卡住阶段）
- 必现 / 偶现
- 关联的代码改动（从 activities 中查找）

#### 3-2. 关联已有 Bug Log

检查 `.evospec/output/bug-log/` 下是否存在同 ONES ID 的历史修复记录，若有则作为分析背景。

#### 3-3. 参考设计文档定位模块

按下表选择并读取相关文档（若目录为空则跳过）：

| 现象关键字 | 优先读取 |
|-----------|---------|
| 流程/阶段行为与预期不符 | `.evospec/output/design/*-flow.md` |
| 接口/消息格式问题 | `.evospec/output/design/ARCHITECTURE.md` |
| 不确定涉及哪个模块 | `.evospec/output/code-analysis/core-modules.md` |
| 回调/事件未触发 | `.evospec/output/code-analysis/plugin-system.md` |

读取后判断 Bug 现象是否与设计预期一致，记录结论。

#### 3-4. 代码定位

基于以上信息，在项目代码中定位可疑位置：

```
awtk/awtkhmi/src/
├── Controller/src/<module>/   # 业务逻辑层
├── Model/src/<module>/        # 数据层
└── Presentation/src/<module>/ # UI 层
```

- 根据 Bug 描述的模块名，搜索对应的 `*Controller.cpp`、`*Model.cpp`、`*Presentation.cpp`
- 定位可疑函数，分析调用链
- 确认关键前置条件是否满足（初始化顺序、回调注入、配置项）
- **不修改代码，只记录定位结果**

#### 3-5. 生成分析文件

在 `.evospec/output/ones-bug-analysis/` 下创建分析文件。

**文件命名**：`onesId-<ONES单号>-<所属模块>-<bug单原始标题>.md`
例：`onesId-695377-BacklightController-[B类问题]【SC2E】【实车】自动背光调为手动背光，选择日间黑夜模式时不显示太阳月亮图标.md`

> 标题部分必须与 ONES bug 单上的 `summary` 字段完全一致，不得缩略、改写或翻译。

**文件模板**：

```markdown
# Bug 分析报告

- ONES ID：#<单号>
- 分析日期：YYYY-MM-DD
- 所属模块：<模块名>
- 优先级：<优先级>
- 严重程度：<严重程度>
- 当前状态：<状态>

## 问题现象

（从 ONES 详情中提取的故障表现、复现步骤、预期vs实际结果）

## 原因分析

（根本原因推断，引用代码段或设计文档作为依据）

## 代码定位

| 文件 | 可疑位置 | 定位依据 |
|------|----------|----------|
| `path/to/file.cpp` | 函数名 / 行号 | 说明 |

## 修改建议

（具体说明应如何修改，但不实际改动代码）

## 注意事项

（修改时需关注的风险点、关联影响、R007/R008 检查要求）
```

分析完一条后告知用户进度，再继续下一条。

### 第四步：飞书通知（全部分析完成后）

所有 Bug 分析完成后，通过飞书发送汇总消息给当前用户本人。

#### 检查飞书 CLI 是否可用

```bash
lark-cli auth status 2>&1
```

- 若命令不存在或返回错误 → 提示用户：
  > 飞书 CLI 未配置，无法发送通知。安装方法参考 `ones-assistant/README.md` 中的"安装飞书 CLI"章节。

- 若返回 `user.status: ready` → 继续发送通知

#### 构造通知消息

消息格式：

```
【ONES Bug 分析完成】
项目：【日本精机】两轮仪表项目
负责人：<姓名>
分析时间：YYYY-MM-DD HH:mm

本次分析：共 K 条
<逐条列出>
• #<单号> [<优先级>] <bug标题> → <一句话根因>

分析报告已输出至 .evospec/output/ones-bug-analysis/
```

#### 发送消息

获取当前用户的飞书 open_id（`lark-cli auth status` 输出中的 `openId` 字段），然后发送：

```bash
lark-cli im +messages-send --user-id <openId> --text "<消息内容>" --as user 2>&1
```

若发送失败（权限不足），按提示执行 `lark-cli auth login --scope "im:message.send_as_user im:message"` 补充授权后重试。

## 字段 ID 获取规范

WHERE 条件中必须用 ID，不能用名称：

| 需求 | 工具 |
|------|------|
| issue 类型 ID | `search_for_issue_types` |
| 状态 ID | `get_issue_status`（传 projectID） |
| 字段选项 ID | `get_issue_fields` → options |
| 用户 ID | `search_for_users` |

---

## 参考文档

- `references/onesql-guide.md` — OneSQL 语法速查
