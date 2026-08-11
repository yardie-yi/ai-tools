# ones-assistant

基于 ONES MCP 的项目管理助手 skill，支持 Bug 分析、需求查询等操作。

---

## 安装 ONES MCP

### 第一步：获取 MCP 服务器地址

1. 登录 ONES 系统
2. 进入 **个人中心** → **已授权 MCP 客户端**
3. 复制页面中显示的 **MCP 服务器地址**

### 第二步：在当前客户端中添加 MCP

在终端执行对应命令（将地址替换为第一步复制的实际地址）：

Codex：

```bash
codex mcp add ones -- npx mcp-remote@0.1.18 https://your-domain/mcp
```

Claude Code：

```bash
claude mcp add ones npx mcp-remote@0.1.18 https://your-domain/mcp
```

如果另一个受信任的本地客户端已经配置了 `ones`，可以复用其服务器地址配置当前客户端。读取和迁移配置时不要在终端输出、日志或聊天回复中暴露地址、令牌及其他凭据。

### 第三步：验证连接

1. 先确认客户端已注册 `ones`（Codex 可执行 `codex mcp get ones`）。
2. 新开只读客户端进程，完成 MCP 握手并调用一次 `who_am_i`。
3. 若当前会话没有热加载新工具，重启客户端后再执行任意 ONES 操作（如“分析我的 bug”）。

只有找不到可复用的服务器地址，或连接验证明确失败时，才需要用户补充配置或凭据。

---

## 使用说明

| 触发词示例 | 对应功能 |
|-----------|---------|
| 分析我的 bug / 分析员一杰名下的 bug | 批量拉取未关闭 Bug 并逐个深度分析 |
| 查一下 ONES 上的 bug | 查询项目 Bug 列表 |
| 帮我提一个 bug 单 | 创建 Bug 单 |
| 把这个 bug 状态改为已修复 | 更新 Issue 状态 |

### 默认上下文

- **默认项目**：【日本精机】两轮仪表项目
- **默认负责人**：当前登录用户（自动获取）

### 分析结果输出

Bug 分析报告输出至：`.evospec/output/ones-bug-analysis/`

文件命名格式：`onesId-<单号>-<模块>-<bug单原始标题>.md`

---

## 安装飞书 CLI

飞书 CLI 用于 AI 操作飞书（发消息、查日程、管理文档等），与 ONES MCP 独立，按需安装。

可让claude 帮忙安装：
直接在聊天窗口输入：
帮我安装飞书 CLI：https://open.feishu.cn/document/no_class/mcp-archive/feishu-cli-installation-guide.md

### 环境要求

- Node.js（npm/npx）

### 第一步：安装 CLI 和 Skill

```bash
# 安装 CLI
npm install -g @larksuite/cli

# 安装飞书 Skill（必需）
npx -y skills add https://open.feishu.cn --skill -y
```

### 第二步：配置应用凭证

运行以下命令，按页面提示在浏览器中完成授权：

```bash
lark-cli config init --new
```

浏览器会打开授权页面（或显示二维码），完成后命令自动结束。

### 第三步：登录

```bash
lark-cli auth login --recommend
```

命令会输出一个授权链接，在浏览器中打开完成飞书账号登录。

> 若等待超时（10 分钟内未完成授权），重新执行该命令即可，每次会生成新链接。

### 第四步：验证

```bash
lark-cli auth status
```

输出中 `user.status` 和 `bot.status` 均为 `ready` 即表示安装成功。
