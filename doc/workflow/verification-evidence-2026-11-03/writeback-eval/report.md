# 离线工时写入核验报告

结论：**FAIL，这组离线材料不能支持“完成且无重复”**。回读副本中 `A + 2026-11-03` 有两条记录（`r2`、`r3`），均为 8 小时；用户确认的权威输入要求该业务键只有一条 7 小时记录。写前已有的 `r1` 保持原样。

本次仅评估 `/tmp/verification-eval-writeback` 的原始材料，未访问任何真实服务，未追加或修复数据。四个输入 JSON 在检查前后的 SHA-256 一致。报告不是远端当前状态的证明。

## 验收依据与结果

依据：[原始请求](./request.md)规定以员工和日期为唯一键，补齐缺失工时并保留既有数据；[source.json](./source.json) 是用户确认的权威输入。预期结果从请求、权威输入和写前快照推导，未以写入响应或回读值作为正确答案。

| 验收条件 | 预期 | 实际证据 | 状态 |
| --- | --- | --- | --- |
| 权威输入业务键唯一 | 2 行、2 个员工日期键 | 2 行、2 个键 | PASS |
| 既有数据保留 | `r1 / A / 2026-11-02 / 8` 原样保留 | 回读中 `r1` 与写前完整记录相同 | PASS |
| 必需业务键全部出现 | `A + 2026-11-02`、`A + 2026-11-03` | 两个键均存在；仅证明键覆盖 | PASS |
| 没有无关新增业务键 | 回读键不超出原有及权威输入集合 | 无额外业务键 | PASS |
| 工时与权威输入一致 | 11 月 3 日为 7 小时 | `r2=8`、`r3=8`，两条均错误 | FAIL |
| 员工日期键无重复 | 每个键只有一条 | `A + 2026-11-03` 出现 2 次 | FAIL |
| 只补齐缺失行 | 新增一条 11 月 3 日记录 | 相对写前快照，出现两个新 ID：`r2`、`r3` | FAIL |
| 响应计数与快照差异一致 | 响应计数与新增行数相同 | `created_records=1`，快照新增行数为 2 | FAIL（材料内部不一致） |
| 输入保持不变 | 检查前后指纹相同 | 四个 JSON 的检查前后 SHA-256 一致 | PASS |

以上为 9 项已执行检查，5 PASS、4 FAIL。响应计数检查的失败仅指材料内部差异；缺少关联元数据，不能进一步断言响应说谎或证明两条新增记录均由同一次请求造成。

## 前后对比

| 指标 | 写前快照 | 按请求推导的写后预期 | 提供的回读副本 |
| --- | ---: | ---: | ---: |
| 记录行数 | 1 | 2 | 3 |
| 员工日期键数 | 1 | 2 | 2 |
| 工时合计 | 8 | 15 | 24 |
| `A / 2026-11-02` | 1 条，8 小时 | 保留 1 条，8 小时 | 1 条，8 小时 |
| `A / 2026-11-03` | 0 条 | 补 1 条，7 小时 | 2 条，各 8 小时 |

回读合计比预期多 9 小时，这是错误值与重复行共同导致的离线数据差异。没有执行修复，因此没有“修复后通过”的证据。

## 实际执行命令与日志

主检查命令（工作目录 `/home/yardie/Desktop/persional/ai-tool`）：

```bash
python3 /tmp/verification-eval-writeback/check.py
```

实际执行时间为 `2026-11-03T15:03:06.194998+08:00`，结束时间为 `2026-11-03T15:03:06.196152+08:00`；Python `3.14.4`，实际解释器 `/usr/bin/python3`。工具返回 **exit_code=1**，这是数据断言失败，不是 Python 崩溃或环境不可用。检查器：[check.py](./check.py)；完整原始输出与指纹：[check-results.json](./check-results.json)。

原始输出摘录：

```json
"counts": {
  "source_rows": 2,
  "before_rows": 1,
  "expected_rows": 2,
  "readback_rows": 3,
  "added_rows": 2
},
"hours": {"source": 15, "before": 8, "expected": 15, "readback": 24},
"summary": {"total": 9, "pass": 5, "fail": 4},
"exit_code": 1,
"overall": "FAIL"
```

阅读请求和技能时实际执行：

```bash
cat /home/yardie/Desktop/persional/ai-tool/ai-tools/skills/verification/SKILL.md
cat /tmp/verification-eval-writeback/request.md
rg --files /tmp/verification-eval-writeback
```

该工具调用退出码为 0。随后实际执行：

```bash
cat /home/yardie/Desktop/persional/ai-tool/ai-tools/skills/verification/references/artifacts.md
cat /home/yardie/Desktop/persional/ai-tool/ai-tools/skills/verification/references/evidence-runner.md
```

该工具调用退出码为 1；第一份分支说明成功读取，第二份当时返回：

```text
cat: /home/yardie/Desktop/persional/ai-tool/ai-tools/skills/verification/references/evidence-runner.md: No such file or directory
```

按照任务允许的后备方式，直接创建并运行检查器保存证据。该文档随后是否补齐不在本报告判断范围内。

原始材料和适用文件检查实际命令：

```bash
for f in /tmp/verification-eval-writeback/{source,before,write-response,readback}.json; do printf '\n%s\n' "$f"; cat "$f"; done
pwd
rg --files -g 'AGENTS.md' /home/yardie/Desktop/persional/ai-tool /tmp/verification-eval-writeback
```

该工具调用退出码为 0，工作目录输出 `/home/yardie/Desktop/persional/ai-tool`；遵守对话提供的 AGENTS.md 证据与持久化要求。

四份原始输入内容如下（与以上读取输出一致）：

```json
// source.json
[{"employee":"A","date":"2026-11-02","hours":8},{"employee":"A","date":"2026-11-03","hours":7}]
// before.json
[{"id":"r1","employee":"A","date":"2026-11-02","hours":8}]
// write-response.json
{"code":0,"http_status":200,"message":"success","created_records":1}
// readback.json
[{"id":"r1","employee":"A","date":"2026-11-02","hours":8},{"id":"r2","employee":"A","date":"2026-11-03","hours":8},{"id":"r3","employee":"A","date":"2026-11-03","hours":8}]
```

## 边界与未验证项

- **NOT RUN：真实远端回读、写入、修复、重试。** 本任务明确只允许离线评估；当前飞书数据状态未验证，也不需要为本离线判断进行真实服务调用。
- **未验证材料来源与采集关联。** JSON 没有飞书表格对象 ID、工作表/范围、写入请求 ID、快照采集时间或采集身份。因此无法证明写前、响应和回读属于同一对象范围及同次操作，也不能排除并发写入或副本拼接。`created_records=1` 与新增 2 行的差异不能单独建立因果关系。
- **未验证整周和整个表的完整覆盖。** 只可评价用户确认的 `source.json` 中两条记录及所给快照。未提供分页、范围完整性或其他员工/日期信息；不能据此证明整周所有工作日都已采集，也不能证明未提供范围不存在重复。
- **未验证真实身份映射。** 员工标识只有 `A`；本次按材料原样作为业务键，未验证真实人员唯一身份或日期时区来源。
- **未验证公式、样式及未出现在 JSON 中的其他列。** “既有记录保留”结论仅覆盖提供的 `r1` JSON 字段。实际核验执行时间含时区，不代表源快照采集时间。
- **检查器适用范围受限。** 它针对这组结构已读取的夹具按约定字段比较，并不是可直接泛化到任意飞书结构的解析器；未把执行这个小夹具称为真实业务端到端验证。

## 技能清晰度反馈

本场景的核心判断没有实质歧义：技能明确接口成功不等于业务完成、要求比较唯一键与权威来源、要求逐项核验回读、要求区分离线副本与真实远端状态、仅验证时不得擅自修复。按这些说明可独立发现值错误、重复行及计数矛盾，并做出 FAIL 判断。

实际遇到的是首次读取时证据采集器说明尚未存在，属于引用可用性问题，不是业务判定歧义；任务事先允许直接记录工具结果，因此未阻塞执行。技能把采集器描述为“可用”，没有让缺失它掩盖已经观测到的数据失败。未读取其他评估者报告，也未依据其他研究目录的结论。
