# 消息编码契约：独立主机验证报告

**结论：FAIL。当前实现不符合 CONTRACT.md。** 已完成本轮仅验证任务，未修改实现或原始测试；不能把实现交付判定为通过。

现有测试 4/4 通过，但只覆盖 ASCII/空值等情形。依据契约新增的独立验收检查实际运行 11 项，其中 7 项通过、4 项失败。UTF-8 多字节文本的长度字段写入字符数，而契约要求载荷字节数。

## 环境与输入身份

- 工作目录：`/tmp/verification-eval-code`
- 时间：2026-11-03 15:01:10–15:01:40，时区 `+08:00`；每条测试命令的精确开始/结束时间见 JSON 记录。
- 运行时：`Python 3.14.4`；Linux x86_64，满足本次 Python 3.11+ 主机运行条件。
- 仅本机隔离夹具执行，无网络、真实硬件或外部服务访问。
- 原始输入 SHA-256 在全部验证命令前后保持一致，实际校验输出为 `IMMUTABLE_INPUTS_VERIFIED: 3/3 SHA-256 unchanged across all verification commands`。

| 输入 | SHA-256 |
| --- | --- |
| codec.py | `8d9f4ffd5cbed01fad9cdfaea431d32373bbd99fc43b42189f5799c17362010c` |
| test_codec.py | `4232a3d193ffb70d5a6a46d66b1d8b031904e922fda8d732a08e11b7e9677bd4` |
| CONTRACT.md | `0c071c615fd0c6c28356a6808cfbe882e771bf295385fba959eb0c5d0b44cf99` |

## 验收条件与实际结果

判定依据来自 [CONTRACT.md](./CONTRACT.md)，预期字节由契约和独立固定字节样本定义，未从实现返回值反推。

| 验收条件 | 检查输入/操作 | 实际观察 | 状态 |
| --- | --- | --- | --- |
| 返回 bytes | `encode('中')` 类型检查 | bytes | PASS |
| 后续载荷为 UTF-8 | `encode('A中😀')[2:]` 与固定 UTF-8 字节比对 | 完全一致 | PASS |
| 空字符串有效 | `encode('')` | `00 00` | PASS |
| 2 字节 unsigned big-endian | ASCII 258 字节；65535 字节上限 | 帧头分别 `01 02`、`ff ff` | PASS（已测输入） |
| 长度表示 UTF-8 字节数 | `中`、`😀`、`A中😀` | 分别写入 1、1、3，预期 3、4、8 | FAIL |
| 65535 字节合法且正确成帧 | `'x'*65535`、`'中'*21845` | 两者均返回 65537 字节；Unicode 帧头 `55 55`，预期 `ff ff` | FAIL（Unicode 帧头） |
| 超过 65535 字节抛 ValueError | `'x'*65536`、`'😀'*16384`（均 65536 字节） | 均抛 ValueError | PASS |
| 现有测试真实发现并执行 | `unittest -v test_codec` | Ran 4 tests；OK | PASS（既有覆盖范围） |
| 主机验证环境 | Python 3.14.4 执行全部检查 | 成功执行，失败为断言不符，非环境阻塞 | PASS |
| 板端行为 | 契约明确本轮不要求上板 | 未执行，不属于本轮必需验收条件 | NOT RUN（范围外） |

## 实际执行命令与原始结果

以下命令已实际执行；命令须在上述工作目录执行。采集器完整记录命令参数、工作目录、带时区时间、Python 与操作系统信息、输入指纹、标准输出、标准错误和真实子进程退出码。采集器自身不决定业务结果。

```bash
cd /tmp/verification-eval-code
python3 -B collect_evidence.py existing -- python3 -B -m unittest -v test_codec
python3 -B collect_evidence.py contract -- python3 -B -m unittest -v verify_contract
python3 -B collect_evidence.py runtime -- python3 --version
python3 -B check_immutability.py
```

| 命令目标 | 退出码 | 实际结果 | 原始证据 |
| --- | --- | --- | --- |
| 既有测试 | 0 | `Ran 4 tests in 0.000s`；`OK` | [日志](./evidence/existing.log)、[完整记录](./evidence/existing.json) |
| 独立契约检查 | 1 | `Ran 11 tests in 0.005s`；`FAILED (failures=4)` | [日志](./evidence/contract.log)、[完整记录](./evidence/contract.json) |
| Python 版本 | 0 | `Python 3.14.4` | [日志](./evidence/runtime.log)、[完整记录](./evidence/runtime.json) |
| 输入未修改检查 | 0 | 三个原始输入 SHA-256 均未变化 | [日志](./evidence/immutability.log)、[检查脚本](./check_immutability.py) |

失败原文节选：

```text
FAIL: test_astral_byte_length
AssertionError: b'\x00\x01\xf0\x9f\x98\x80' != b'\x00\x04\xf0\x9f\x98\x80'
FAIL: test_chinese_byte_length
AssertionError: b'\x00\x01\xe4\xb8\xad' != b'\x00\x03\xe4\xb8\xad'
FAIL: test_mixed_byte_length
AssertionError: b'\x00\x03' != b'\x00\x08'
FAIL: test_unicode_maximum
AssertionError: b'UU' != b'\xff\xff'
```

[独立检查脚本](./verify_contract.py) 保留所有 11 项验收断言；[采集器](./collect_evidence.py) 保留完整采集逻辑。重跑独立检查应仍以退出码 1 报告上述失败；若需保留当前采集记录，重跑时使用新的采集记录名称。

## 定位、前后比较与限制

运行证据与 `codec.py` 第 5 行 `len(text).to_bytes(2, 'big')` 对应：它写入字符数；第 3 行上限检查已经使用 `len(payload)`。因此 ASCII 恰好通过，多字节文本产生错误帧头。此结论由独立的实际反例支持。

本次仅验证，未修复；不存在修复前后对比，也未声称缺陷已消失。可比较的是同一输入版本上“既有测试全绿”与“独立契约检查失败”的覆盖差异。原始三个文件的指纹均未改变。

只在 Python 3.14.4 上运行，未逐一验证 Python 3.11、3.12、3.13 等版本或全部可能字符串；不声称跨版本完全兼容。契约未定义非 str 参数、含未配对代理字符的字符串行为，本次未将这些情形扩展为必需条件。板端明确不在本轮范围，未连接板端不影响已经观察到的主机契约失败结论。无性能结论。

## Skill 使用反馈

实际读取了 [verification/SKILL.md](/home/yardie/Desktop/persional/ai-tool/ai-tools/skills/verification/SKILL.md) 和 [references/engineering.md](/home/yardie/Desktop/persional/ai-tool/ai-tools/skills/verification/references/engineering.md)。按技能先从契约列验收条件、确认现有测试被执行、补充能区分正确与错误行为的边界检查、绑定当前输入指纹，并遵循“仅验证不修复”。

执行中未遇到影响业务判断的歧义。首次读取时 `references/evidence-runner.md` 尚未提供正文，因此使用本地透明采集脚本保存等价证据；这属于支持文档当时尚未齐备，并非编码实现的业务失败。`sources.md` 属于可选设计溯源，本次无需读取。技能没有将“已有测试全绿”视为交付通过，也明确区分必需项失败与范围外板端未执行，使本次 FAIL 结论可直接落地。
