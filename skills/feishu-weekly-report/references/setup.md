# 安装、授权与配置

仅在首次配置、CLI 缺失或认证/权限异常时读取本文件。

## 安装飞书 CLI

先运行 `command -v lark-cli`；已安装时复用。缺失时自动按用户指定的[飞书官方安装指南](https://open.feishu.cn/document/no_class/mcp-archive/feishu-cli-installation-guide.md)安装，先获取当时最新正文再执行。2026-10-16 核对的安装步骤为：

```bash
npm install -g @larksuite/cli
npx -y skills add https://open.feishu.cn --skill -y
```

检查 `node`、`npm`、`npx`。缺少运行环境时，通过现有包管理方式安装官方受支持版本；需要用户提供管理员凭据或环境无法安装时，说明具体障碍。Go/Python 仅官方文档选择源码构建时才需要，不要为了 npm 安装先安装完整源码工具链。

安装 CLI 之后安装官方 CLI skills，使后续操作可读取当前版本的 `lark-shared`、`lark-im`、`lark-doc`、`lark-base` 等说明。先按可用技能目录定位；CLI 已提供嵌入式文档时也可用 `lark-cli skills list` / `lark-cli skills read <name>`，先检查各命令的 `--help`。

## 复用应用并完成授权

先读取当前 `lark-shared` 及其身份/权限 reference，再运行：

```bash
lark-cli auth status --json --verify
```

验证 user 身份、登录姓名、`open_id` 及 token 状态。只保留必要身份字段，避免将所有权限及认证细节展开给用户。

- **已有有效用户身份：** 继续业务操作，显式使用 `--as user`。
- **CLI 首次安装、尚无应用配置：** 按当前 `lark-shared` 配置 reference 和 `lark-cli config init --help` 完成初始化；官方指南示例为 `lark-cli config init --new`。只有确实需要新的应用配置时才使用 `--new`，不重建已有配置。
- **未登录/授权失效：** 使用所需业务域或最小必要 scopes 发起用户授权。初始流程可按官方指南的推荐授权选择，使用非阻塞形式，例如 `lark-cli auth login --recommend --no-wait --json`；以当前 CLI help 为准。
- **业务调用返回缺少 scope：** 保持原 user 身份，用返回的 `missing_scopes` 增量申请，不改用 bot 规避访问限制。资源 ACL 被拒绝时，说明哪个资源不可读/写，不能用扩大应用授权冒充资源授权。

需要用户配合时，明确说明“正在请求什么权限、用于哪一步”。返回授权/配置 URL 时按 `lark-shared` 要求原样展示链接并用 `lark-cli auth qrcode` 生成 PNG，链接在前、二维码在后。路径使用 CLI 允许的相对路径。

设备授权采用分轮流程：当前轮发起、展示授权链接和二维码并交还用户；用户回复已授权后，Agent 亲自执行 `lark-cli auth login --device-code <本次返回值>` 完成登录，再验证身份并继续。授权是必需的用户动作，不能将超时当作同意，也不能把同轮等待藏在工具调用中使用户看不到链接。链接/设备码过期后重新发起所需授权，不复用过期值。

## 保存首次配置

配置放在 `${XDG_CONFIG_HOME:-$HOME/.config}/feishu-weekly-report/profiles/<app_id>__<open_id>.json`。先取得真实身份再选择该账号文件；目录仅当前用户可读写。配置与 skill 分离，便于升级及多账号使用。

建议结构：

```json
{
  "version": 1,
  "identity": {"app_id": "当前应用ID", "open_id": "当前用户ID", "display_name": "登录姓名"},
  "timezone": "用户环境时区",
  "weekly_report": {
    "source": "chat",
    "chat_id": "用户选定群ID",
    "chat_name": "群的真实名称",
    "directory_url": null,
    "last_report_url": null,
    "last_period": null
  },
  "timesheet": {"url": "用户提供的工时页面链接"},
  "project_mappings": [],
  "allocation": {"allow_estimate": false},
  "schedule": {
    "weekly_report": {"day_of_week": null, "time": null, "mode": "weekly_report_only"},
    "timesheet": {"day_of_week": null, "time": null, "mode": "timesheet_only"}
  }
}
```

这是结构说明，不把示例字符串写成有效配置。直接提供周报链接时，将 `source` 设为 `document`，保存链接、周期及可用的目录来源；下次仍需判断该链接是否对应本期。

项目映射可保存：工作别名、周报项目名称、工时正式项目名称、经核实的项目 ID/本人记录 ID、用户确认的范围和日期。每次使用缓存 ID 都检查资源仍存在、项目仍有效及用户/周期一致。不能将一个人的记录映射作为其他账号的默认值。

`allow_estimate` 只在用户明确允许按记录估分时设为 true。保存允许估分的偏好，不把某周的 60%/30%/10% 当成永久分配。

`schedule` 只在用户明确要求定时运行时保存，记录当前账号的本地星期、时间和运行模式。创建或更新自动任务时以该配置为准；不要把某个账号的执行日写成 Skill 的全局默认值。修改日程后同步更新个人配置和实际自动任务，并核对两者一致。

配置不包含 app secret、access/refresh token、密码或设备授权码；这些由 CLI 自己管理。
