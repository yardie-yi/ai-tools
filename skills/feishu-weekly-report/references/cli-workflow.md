# CLI 操作与核验

进入对应阶段时读取本文件及当前版本的官方 domain skill。先读 reference 或运行目标命令 `--help`，以实际帮助和服务端 schema 为准。所有业务命令显式 `--as user`。

## 群中定位周报与读取工作消息

已知群 ID 直接使用；首次按群名定位：

```bash
lark-cli im +chat-search --query '<群名>' --as user
lark-cli im +chat-messages-list --chat-id '<已确认群ID>' --page-size 50 --as user
```

每次运行都执行 `+chat-messages-list`，不能因为配置中已有上次链接而跳过。按消息发送时间倒序查找“周报/本周工作/填写”等消息中的真实链接；当前页没有有效目标时继续分页，直到找到最新的有效周报填写消息或穷尽可用结果。保存本轮消息 ID、发送时间和解析后的文档链接，供回读核验与下次比较。

搜索为空时放宽关键词或让用户补群信息，不使用列出全部群的接口替代搜索。核对消息发送时间、文档标题和正文日期；只有催填提醒而没有目标文档的消息无效。若较新的消息更正或替换了链接，使用较新的可访问链接；同一链接重复发布时仍记录最新消息，但写入前比较现有内容，保持重复调用幂等。

工作消息查询使用 `+messages-search` 的发送人、时间和群过滤，必要时 `--query ''`；报告汇总需完整分页。补上下文时针对相关会话/讨论，避免读取全账号的无关历史。附件只有确实需要佐证时再下载。

## 周报局部写入

先读 `lark-doc` 的 fetch/update/XML reference。Wiki 链接可由 `docs +fetch` 读取，实际资源若为 Sheets/Base，则按其类型转到对应 skill。

```bash
lark-cli docs +fetch --doc '<本期周报URL>' --scope outline --max-depth 3 --as user
lark-cli docs +fetch --doc '<本期周报URL>' --scope keyword --keyword '<本人姓名>' --detail full --as user
```

用返回的人员 `open_id` 验证本人；姓名关键词只是定位入口。局部结果可能是表格切片，项目名称来自合并单元格时按 table ID 读取完整所需区域，再确定归属。

优先替换具体列表项/段落。同一直接父节点下连续范围可使用 `block_replace --start-block-id ... --end-block-id ...`，列表项范围的 XML 用 `<li>...</li>`，新增普通列表用 `<ul><li>...</li></ul>`。多行内容用 stdin 或 CLI 允许的相对 `@file`，不拼接含工作文本的 shell 命令。

写前保存必要快照，若支持则使用当前 `--revision-id` 检测并发。每轮修改后 fetch 检查；旧 block ID 失效时用最新结果重新定位。只修改本人目标区域，避免重建整张表或全文覆盖。

## 工时应用与底层数据

先读 `lark-base`；`/app/` 为 BaseApp，读取其“应用模式与 Workspace” reference。用真实 URL 解析，不能把 app_token 当 base_token：

```bash
lark-cli base +url-resolve --url '<工时URL>' --as user
lark-cli base +app-get --app-token '<返回的app_token>' --as user
lark-cli base +app-block-list --app-token '<app_token>' --page-id '<page_id>' --as user
```

从可读取的说明文本组件取得填写规则；从 `ref` / 组件数据源取得 Base/Table。对列表标为 `unsupported` 的组件不调用其详情、计算数据或更新接口；继续走可访问的底层 Table/Record 能力。

```bash
lark-cli base +table-list --base-token '<数据源base_token>' --as user
lark-cli base +field-list --base-token '<base_token>' --table-id '<工时表ID>' --as user
```

核对姓名、项目、工作简述、工时数值、周期、锁定、重复提示及累计有效工时字段。不要根据 UI 标题猜字段类型，或给只读公式写值。

读取记录优先选必要字段并输出到任务私有目录下的相对 NDJSON 文件：

```bash
lark-cli base +record-list --base-token '<base_token>' --table-id '<table_id>' \
  --field-id '<姓名字段>' --field-id '<项目字段>' \
  --field-id '<工作内容字段>' --field-id '<占比字段>' \
  --format ndjson --output records-before.ndjson --as user
```

读取完整分页并按 `open_id` 筛选本人。大表使用受支持的服务端 filter，再本地处理。目标记录已知时用 `+record-get`。

### 项目不在已有填报行

- 单选字段：`+field-search-options` 查询实际已有选项。
- 动态选项字段：读取 `dynamic_options_source` 的项目表及字段，查正式项目名称/简称。
- 关联字段：读取 link/lookup 的目标表，取得真实项目记录 ID。
- 页面有“添加该项目”按钮时，核对按钮填充的字段/关联及周期规则，通过受支持的 CLI Record 创建操作完成相同业务数据；不尝试调用 unsupported 组件，也不改变组件配置。

若项目目录在另一个可访问的 Base，从应用引用或 Workspace 目录定位；不凭空猜 token。项目不唯一时执行主流程的项目确认。只需新增本人填报行时，`+record-batch-create` 按实际 schema 提交项目、姓名、周期和内容；提前按本人+项目+周期查重。

### 项目字段显示空但并非业务上没有项目

本次流程观察到：CLI 项目标签返回 `[]`，同时动态选项来源不可读取，但原有行及历史仍对应真实项目，且系统累计有效工时公式仍能正确计算。不能据此确定空标签的具体原因。**仅凭 `[]` 不新建行、不清空或重写项目关联。**

优先使用用户已确认的项目映射、可访问项目目录及本人历史填报交叉定位。确需查看记录变更历史时，先读 `lark-base` 的 history reference，只查询已明确的目标记录，不扫全表审计。历史内容与归属仍不能唯一对应时请用户确认。

## 批量写入与回读

只提交改变的可写字段，例如：

```json
{
  "update_records": {
    "已核实的本人记录ID": {
      "本周工作内容简述": "有来源的本期工作内容",
      "本周工时占比": 0.6
    }
  }
}
```

字段名仅作格式示例，实际使用已读取的字段名或 ID。先 dry-run 检查目标/字段/数值；再执行 `+record-batch-update --json @payload.json --as user`。同一表串行写入，批大小遵循当前 CLI 限制。

成功信封以 `ok == true` 判断；检查 `ignored_fields`、warnings 和部分失败信息。更新响应可能不校验 record_id 是否真实存在，因此统一回读目标记录，比较实际值、项目/用户/周期及累计有效工时。只有公式确认达到要求且无重复，才可称工时填报完成。

有界重试：写入超时/结果未知时先查询现状；记录已存在或内容已匹配就不重发创建。读取尚未反映异步变更时最多短暂重读三次，仍不一致则报告具体未核验项。

调用遇到缺少权限时转 [授权处理](setup.md#复用应用并完成授权)，不要切换身份或绕过锁定。现有命令确实无法覆盖必要操作时，可按可用的 `lark-openapi-explorer` 技能查官方规范，再用 `lark-cli api` 调用；飞书业务操作仍只用 CLI。
