# 证据、候选与报告修订模板

按任务规模选用字段，不为单个行号问答强制生成整套文件。原文是依据，统计表和模型判断是派生产物。

## 文件与覆盖清单

| 字段 | 要求 |
|---|---|
| input_path / archive_path / sha256 / bytes | 完整路径；解压产物与压缩源分开 |
| rotation / duplicate_of / overlap_rule | 原件保留；写明去重口径 |
| physical_lines / record_count | LF 物理行与记录头、多行载荷分别计 |
| first_raw / last_raw / min_raw / max_raw | 混合时钟不能用 min/max 冒充统一覆盖 |
| clock_rule / anchors / session_range | 转换依据和有效范围；未知留空 |
| writer / module / logger / destination | 业务函数、实际写盘线程、采集器分别列 |
| provenance_level | 本地源码 / 二进制或 DWARF / 现场身份未证 |
| decoded / unsupported / corrupt / skipped_bytes | 不把解码缺口当事件不存在 |

## 统一证据记录

```text
evidence_id, case_id, source_file, physical_line_start, physical_line_end,
dlt_archive, decompressed_offset, record_index,
raw_timestamp, clock_domain, normalization_rule, normalized_time,
boot_id_source, process_identity, thread_field_raw, thread_identity_kind,
function_logged, compiled_line, current_source_path, current_source_line,
from_unit, to_unit, opcode, payload_len, payload_raw_or_hash,
additional_info_id, json_path, json_cmd, sequence_or_serial,
phase, event_kind, raw_text, match_basis, evidence_level, limitation
```

行号只能连同文件名使用。`vr.log.4:L7933` 与 `common_sys.log.1:L7933` 不能简称成可互换的“7933”。二进制偏移、符号地址、DWARF 源行不放进 `physical_line`。

## 打点与证明能力

| 观察点 | 能证明 | 不能单独证明 |
|---|---|---|
| 函数入口 / OUT 位于 emit 前 | 到达该打印点 | 后续调用已进入、发送成功或返回 |
| queue_message 调用前打印 | 到达投递前 | 入队成功、消费开始 |
| consumer 的业务打印 | consumer 到达该点 | 整个处理函数返回 |
| DBus complete helper | 程序提交方法回复 | 对端收到、后续业务完成、连接未受阻 |
| signal emitter 正常返回 | 本地分发/发送提交路径返回 | HMI 回调或显示完成；若返回值未检查也不证明提交成功 |
| send_cmd_to_navi 后置日志 | 前面的调用已返回 | socket 全量写出、对端读到该 JSON |
| timer callback 末尾日志 | 回调到达末尾打点，前面的业务调用已返回 | pthread 生命周期完整结束、所有锁安全释放 |
| sendMsgToDcu 入口/End | wrapper 到达相应边界 | socket 完整写成功或 DCU 实收 |
| 对端协议确认 | 对端某阶段有确认处理 | 与最近请求唯一对应、整个会话恢复 |
| 无后续日志 | 指定覆盖和筛选内未检出 | 指定线程必然阻塞、退出或某行就是卡点 |

## 阶段统计口径

```text
phase_id, boot, power_phase, app_name, reqKind,
request_evidence, observation_end_evidence, end_kind,
raw_280_count_including_retries, ack_candidates, payload_match_level,
primary_timeout_count, downstream_timeout_count,
sdk_activity, vr_callback_activity, unmatched_events, coverage_gaps
```

表头写清起止区间的闭开性及正常停机裁剪。不能把同一事件的两层 timeout 累加成故障数；不能把 38 次显式等待中的 37 个主 timeout 直接称总体 37/38 失败率，除非剩余阶段结果、总体定义和删失都解决。

## 候选原因审查卡

每个候选至少回答：

1. **观察事实**：哪些原文直接支持，哪些反例不支持？
2. **源码条件**：版本、宏、配置、锁作用域、同步/异步边界、必要分支？
3. **因果缺口**：从前一端点到后一端点还缺哪一跳？
4. **可证伪检查**：什么栈、返回值、消息序号或正常对照会否定这个解释？
5. **替代解释**：队列未投递、主循环未派发、owner/路由、日志级别/覆盖、文件覆盖、其他独立锁？
6. **最小验证**：只提出能区分候选的观测，注明未上板执行和权限范围。

置信描述必须以证据类型为基础；外部模型分数不是事故概率。外部复核仅按主 skill 的既有要求及当前授权、连接条件执行，不得代替原始证据。

## 报告或 skill 修改

1. 读取目标及适用规则，列出允许改的文件；不要顺便改生产代码或原生日志。
2. 记录旧 SHA256/字节数并备份到有时间戳的独立目录；保留原结构和未涉及段落。
3. 暂存最小改动及 diff。明确“事实纠错”“引用补全”“结论降级”“新增案例”分别是什么。
4. 写入前核验旧哈希，防止覆盖他人同期修改；结果不明时先检查现状，不能盲目重写。
5. 验证 frontmatter、相对/绝对 Markdown 链接、源码行号与关键词、原文引述、时间算术、代码块闭合和遗留占位符。
6. 从最终目标回读字节并与暂存哈希比较；旧报告和原输入按声明的核验范围检查未变。
7. 交付变更文件、备份路径、验证结果、文件大小和 SHA256；说明检查覆盖与未验证现场条件。

保留历史报告时，新复盘要指出旧说法已被后续纠正，不能声称那些旧文件已全部同步更新。校验器通过只证明它实际检查的结构，不证明根因正确。
