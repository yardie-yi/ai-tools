# Verification skill 的本机 Pi / Claude / 其他来源调研

扫描日期：2026-11-03（Asia/Shanghai）。本报告只读检查历史，不修改历史或配置；统计文件与代表案例可复查。不包含凭证摘录。历史中出现的主机、路径、硬件参数只用于说明“需要绑定实际环境”，不能作为新任务默认值。

## 实际覆盖

| 来源 | 程序覆盖 | 时间范围与结果 |
|---|---|---|
| Pi `~/.pi/agent/sessions/**/*.jsonl` | 50 文件，101,383,263 字节，11,605 JSONL 记录；10,641 message | UTC 2026-09-25T01:28:25.297Z 到 2026-11-03T06:28:34.063Z；0 JSON 解析错误 |
| Pi 角色 | system 98；user 422；assistant 4,328；toolResult 5,793 | 50 文件内有 11 个嵌套 subagent `session.jsonl`；16 个 user-role 是子 agent 任务/steering，不能归给真人；顶层 user-role 为 406，仍含少量技能展开/重复输入 |
| Claude / Claude Code | `~/.claude/sessions` 空；`~/.claude/projects` 不存在 | 未找到可读对话；`~/.local/share/claude/versions` 是安装二进制，不是历史，不读取 |
| VS Code chatSessions | 34 文件（27 JSONL、7 JSON），19,574 字节，34 记录 | creationDate UTC 2025-12-04 到 2026-11-02；全部 `requests=[]`，0 解析错误，没有可分析对话正文 |
| VS Code agent-host.db | 只读查询会话表数量 | sessions、sessions_v2、session_chat_catalogs、session_chats 均 0；global state index 另有一个 New Chat，isEmpty=true |
| VS Code Remote Copilot session-store.db | 只读查询会话/轮次/检查点数量 | sessions、turns、checkpoints、session_files、session_refs 均 0 |
| Cursor | `.cursor` 与 `.cursor-server/data/User` 文件名清单 | 只有 IDE 状态和检索索引，未发现会话正文；`.config/Cursor/User` 不存在 |
| OpenCode / crush / goose | 配置目录及常规数据目录存在性、文件名清单 | 相应 `.local/share` 数据目录不存在；配置目录未发现历史 |
| Lingma | 文件名清单与 `index_meta.json` | 发现 `index/chat/.../store/root.bolt`、`.zap`；metadata 为 boltdb/scorch；`index/meta/v7/index.db` 不是 SQLite，**未解析这些专用索引，不声称没有历史** |
| 其他发现的 agent 目录 | `other-store-inventory.json` 记录 51 个候选根的存在性、文件名、遍历错误 | 多为技能目录/空目录；没有据目录存在就推断存在对话 |

所有 50 Pi JSONL 都经过 JSON 解析，并对非 system 消息的文本做验证相关关键词筛查，得到 3,032 个候选消息；没有把 AGENTS/skill 模板重复出现当真人案例。98 个 system 消息、29 个 compaction 等结构记录纳入总数但不作为用户偏好证据。并非对 11,605 条记录逐字语义精读：语义精读集中在下面 12 组真实 user / toolResult / assistant 对照及其上下文。未扫描浏览器登录数据、认证文件、密钥、无关个人文档、远端服务器和云端账户；历史中若含认证行，候选摘录予以遮蔽，最终案例不包含这些内容。`~/chatgpt.log` 仅看元数据（22 字节），未当作对话来源。Pi sessions 下另有 9 个非 JSONL 输出/辅助文件，未按独立对话重复计数；missions 20 个 JSON 索引未当对话正文。

## 12 组可复用案例

### 1. 明确的人类证据规则，只计一次

`E:7` 是用户要求写入全局 AGENTS 的原始请求，明确列出：验证步骤、实际命令、结果/日志、适用时前后对比、剩余限制；“应该修复了”、代码改动本身、没有测量的性能改善均不算证据。同一条还要求重要约束/硬件配置/接口契约持久化。这不是从后续系统模板推导的偏好。

**规则**：交付成功声明必须能对应观察结果；持久文件记录关键约束及来源、适用版本、确认时间。

### 2. “主机测试通过”必须解释测试环境与替身

`H:192` 用户追问：“这个测试你是怎么做的，在哪里做的”。`H:194` 工具回读测试源码开头为 `Uses the host-only transport fixture, not a real Android connection`；`H:196` 是 CTest 实际输出；`H:198` 工具解码得到 `interval_us: [1000003, 999997]`。`H:199` 是助手对证据范围的解释：Linux 编译服务器，正式 IVICommManager + fixture 插件，模拟成功回调，无真实 Android 握手。

**规则**：报告必须列运行地点/平台/被测正式代码/模拟边界。fixture 能证明调度、编码、队列等已断言项，不能证明目标系统已收到。工具日志是证据；助手“测试通过”的自述不是独立证据。

### 3. 源码中的“已确认”不能代替硬件来源

`B:177` 用户问“为什么是GPIO68”；`B:179` 工具读到宏默认值及“已确认”注释。`B:180` 助手承认尚未找到原理图/原始确认依据。`B:182` 真人随后明确：“硬件变了，把GPIO68改为GPIO9”；`B:271` 又明确使用 spi4。`B:194` 工具日志显示 SRQ 已低但 `SPI transfer failed/short, errno=260`，证明跨过一个阶段不等于通信恢复。

**规则**：绑定板号/硬件版本/当前 BSP/部署物/接口参数；旧注释和历史确认必须核对版本。阶段性改善与端到端成功分别报告。不要把 GPIO9 或 spi4 固化成 Verification 通用默认值。

### 4. 区分入队、发送、对端收到、业务完成

`A:253` 真人贴出 `sendIpclMessageToIVI` 入队实现，质疑助手“空实现”表述。`A:245` 的工具回读是底层 FDBUS `writeIpclMsgData` 返回 `-1`。`A:254` 助手更正为管理器入队成功，但最终插件透传未实现，并说明未核对设备实际加载 `.so`。

**规则**：异步链路按层给证据，不把入队返回 0 或接口存在写成发送成功；源码结论不冒充目标设备运行结论。对照消费者、最终实现和回执，而非只看入口。

### 5. 时间/启动会话校准先于跨日志推论

`L:121` 真人明确要求先在中国时间 14:50–15:20 找到 DLT/HMI/VR 对应日志再分析；`L:246` 要求检查前缀/正文相差一小时的代码原因；`L:314` 在该案例确认 hmi/vr 减一小时后，继续要求按 tid/T 变化核实线程/进程与重启。

**规则**：日志证据记录时区、日期、时钟来源、boot/session、PID/TID；用共同事件校准。不把这里的“减一小时”做成所有项目规则。未见一条日志不直接证明事件没发生，要先界定采样窗口与日志覆盖。

### 6. 接口契约不能靠实现自圆其说

`A:66` 真人要求生成代码只按协议字段布局，不加入业务值约束；`A:112` 又拒绝助手迁移一个协议并未规定的长度限制，要求完全按协议。

**规则**：验收 oracle 来自当前需求/协议/业务约定；测试不能仅复制当前实现的假设。不得为通过测试或“更安全”无依据地增加项目业务约束。此案例不意味着取消一般内存边界检查；应区分协议业务限制与安全解析边界。

### 7. 实际资源揭示“绿灯测试”漏测

`P:125` 工具测得旧代码真实背景峰值 `7,449,562 B`；`P:135` 测试虽然输出 PASS，但真实 Adam7 `background_cast.png` 仍是 `peak=7,445,936 / extra=3,751,734 B`。`P:140` 助手识别测试没覆盖故障资源的内存目标；`P:142` 在真实四张背景用例增加 `assert(peak-live<512*1024)`；`P:145` 正常与 ASan/UBSan 日志中真实 day 背景峰值 `3,759,463 B`、cast `3,759,536 B`。

**规则**：性能声明要同口径 baseline、真实/代表性数据、目标断言和测量；PASS 输出不足以证明验收条件存在。涵盖异常路径、真实输入格式、资源峰值。这里是历史工具日志，不是本轮复跑，也不能外推为板端整机内存结果。

### 8. 验证深度服从已授权的验收边界

`Q:147` 真人明确现阶段仅主机验收、实机列待办，并要求模拟完整 PowerManager 与 MCU/Android 流程。`M:1390` 在另一任务明确不需要写测试程序，QNX/Android 尚未完成，只验 MCU 握手。

**规则**：先确定本轮成功条件，再选最小充分验证；不因 Verification skill 自动扩大到实机或强制新建测试。完整主机流程可以在已约定范围通过，同时保留实机未验证项。

### 9. 修复/验证必须绑定最新对象

`F:242` 真人：“代码已经被修改，在新的代码基础上重新分析”；`F:324` 要求只关注已改为默认的新接口并更新文档。

**规则**：记录 repo/cwd、revision/dirty diff、配置与环境；代码、配置、依赖、板子或需求变更后，判断哪些旧证据失效，重跑受影响检查。不能把旧结论套到新分支/另一目录。

### 10. 构建链每阶段的产物与消费路径需核实

`I:127` 真人纠正“缺头文件”的解释，指出安装日志已出现 zstd.h。`I:129` 工具日志同时展示 `Installing: .../prebuilt_sa8775/include/zstd.h` 与后续编译 `fatal error: zstd.h`。`I:131` 浏览器工具因 `cdp_disconnected` 失败；`I:132` 助手明确使用已下载日志，并承认未取得 Jenkins 当次 flags.make。

**规则**：区分生成、安装、打包、部署、运行/消费，不把上游一步成功当最终成功；路径要对照最终消费者。数据源降级/缓存及未取得的现场产物要说明。

### 11. “打印前置日志”不等于调用完成或根因已定

`D:37` 真人要求三次 OUT 日志的具体文件行号；`D:42` 追问“OUT 日志打印在实际 DBus emit 之前，不表示发送函数已经返回”的具体发送函数。

**规则**：每个关键事件标明入口/调用前/返回后/回调完成；用代码位置解释日志能证明哪一步。症状、推断原因、排除项与实证分开；没有出口日志时，应列出取消、阻塞、丢日志等仍可能的解释及能区分它们的下一项观察。

### 12. 要核对最终打包/覆盖路径，不能只检查编辑处

`P:438` 真人要求确认所有 SDK 修改是否已放入 `project/F710S_620S/configure_sdk`。`P:440` 工具结果逐一给出四组 `MATCH sdk/... <=> project/.../configure_sdk/sdk/...`。

**规则**：枚举变更必须到达的位置（生成源、生成物、覆盖目录、安装副本、运行副本）；用内容比较/hash/回读证明一致。写入成功响应只能证明调用返回，不能代替内容/最终产物回读。

## 适合主 skill 的约束

1. Claim → acceptance criterion → independent observation → command/tool + object/environment → result → limitation，保持短小可执行。
2. 观察结果优先于助手自述；引用历史助手总结时明确“未独立核验”。子 agent 的结论仍需源证据，不以多模型一致代替事实。
3. 最少充分验证，与用户当前授权匹配；非代码交付可用回读、结构校验、渲染检查、前后 diff，不机械要求编译。
4. Bug 修复优先能区分旧/新的反例或回归；不能复现则准确报告未验证部分，不虚构红绿测试。性能优化必须测量。
5. 运行中的等待、执行成功、测试通过、功能达成是不同状态；必须确认实际完成和结果，避免提前结案。
6. 本机无法取得的硬件/云端证据作为明确剩余验收，不用假数据填补，也不把此技能变成无限审批门。

## 可复现核验命令与本轮实际结果

实际执行 `python3 /tmp/verification-research/scan_other_history.py`：上述 50 Pi / 34 VS Code 文件全部 JSON 解析成功；0 解析错误；3,032 个关键词候选。

实际执行的只读 SQLite 查询包括 `SELECT count(*) FROM sessions`、`SELECT count(*) FROM turns`、`SELECT count(*) FROM session_chats`，连接使用 `sqlite3.connect("file:<path>?mode=ro", uri=True)`；空表结果如覆盖表。Lingma 同样尝试 SQLite schema 查询，返回 `sqlite3.DatabaseError: file is not a database`，因此明确列为未解析专有索引。

实际执行 `python3 /tmp/verification-research/build_other_report.py`：按原始物理 JSONL 行号复查下列引用的 role；全部通过。详细引用路径映射如下。统计脚本、清单、报告都只写入 `/tmp/verification-research`。

## 来源路径映射

- `E` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775--/2026-10-28T02-57-12-591Z_01a18070-b58e-712b-9f9b-64bff2f95e80.jsonl`
- `H` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775--/2026-10-28T06-52-35-101Z_01a18148-339d-73cc-b82c-5171f9f52ea7.jsonl`
- `B` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775--/2026-10-23T09-17-18-762Z_01a1680c-e827-74db-9655-a4cda7cf3ad3.jsonl`
- `A` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775-app-embedded-software-autoai-services-vehicle-service--/2026-10-13T06-33-59-635Z_01a133f7-ca52-7242-9f19-254698a24800.jsonl`
- `L` = `/home/yardie/.pi/agent/sessions/--home-yardie-Desktop-21L--/2026-10-12T02-20-30-691Z_01a12de9-5c63-73c4-9000-1cc192dbb396.jsonl`
- `P` = `/home/yardie/.pi/agent/sessions/--home-yardie-Desktop-9868-ite_sdk--/2026-09-25T10-21-11-121Z_01a0d815-5250-70eb-9eda-e2fcdf7fdb22.jsonl`
- `I` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775--/2026-10-23T06-32-35-389Z_01a16776-193c-77cd-b998-af59aa2a6a1b.jsonl`
- `Q` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775--/2026-10-27T08-02-51-717Z_01a17c62-2ec4-7134-a3bd-2f9cebfb9df8.jsonl`
- `M` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775--/2026-10-13T10-54-24-332Z_01a134e6-344a-77cb-9da4-6a8dcbb8499e.jsonl`
- `F` = `/home/yardie/.pi/agent/sessions/--run-user-1000-gvfs-smb-share-server=172.19.160.73,share=yiwanming,user=yiwanming-8775--/2026-10-12T01-49-19-671Z_01a12dcc-cfb6-738c-b8e2-145fa8ffc2dc.jsonl`
- `D` = `/home/yardie/.pi/agent/sessions/--home-yardie-Desktop-21L--/2026-10-16T02-31-42-967Z_01a1428d-0e76-7122-bc47-c1b01670fc96.jsonl`

引用核验：38 个原始物理行号/角色匹配通过。
