# 数据类型与 Mapping 联合填写

构造或复核候选行前完整阅读本文件，同时读取当前仓库的 `VehicleMapping填写说明.md` 和生成器。以下规则经目标工作簿 revision 375（2026-10-09）的三张业务表及 `gen_libapi.py`、`gen_business.py` 核对；实际接口名、成员、枚举值和容量以本轮在线表及权威协议为准。示例用于说明格式，不作为其他帧的协议依据。

## 三张表分别表达什么

- `Interface定义表.data_type`：公开 API 的完整类型。基础类型直接填写；命名枚举/结构体填写准确类型名，与类型表大小写一致。它不是线字段宽度，也不由 field/method 或上下行决定。
- `Data_type定义表`：命名类型及成员。声明行写 `类型名,-,struct/enum,定义`；结构体随后逐行写成员。新成员行显式重复所属类型名，避免空类型名单元格继承错组。保留已有成员顺序，顺序决定 IPC 编码。
- `VehicleMapping.字段布局`：API 值或成员与外部 payload 的对应关系，格式为 `绑定名@零基偏移:线类型[/LE或BE]`。约束前缀必须使用相同绑定名。每条布局和约束独占单元格内一行。

| API data_type | 类型表写法 | Mapping 绑定名与线类型 |
| --- | --- | --- |
| uint8、uint32、float 等基础类型 | 无需新增命名类型 | `value@0:uint8`、`value@0:uint32/LE` 等，线类型按协议填写 |
| PowerState 等独立枚举 | `PowerState,-,enum,0=Sleep 1=NormalRun ...`，展开全部权威值 | `value@0:uint8`；API 是枚举，线类型仍是协议规定的基础类型 |
| DateTimeInfo 等结构体 | 一条 struct 声明，随后一成员一行 | `year@0:uint16/LE`、`month@2:uint8` 等真实成员名 |
| bytes（直接作为接口类型） | 无需命名类型 | `value@0:bytes[*]`，长度 dynamic，`value.max_bytes=...` |
| bytes[N]（直接作为接口类型） | 无需命名类型 | `value@0:bytes[N]`，固定载荷长度 |
| LyricsData 等包含 bytes 的结构体 | `LyricsData,-,struct,...` 和 `LyricsData,data,bytes,...` | `data@0:bytes[*]`，长度 dynamic，`data.max_bytes=...`；只有一个成员仍用 data |

结构体不能用类型名、接口名、`Type.member` 或 `in.member` 作绑定名。真实成员名恰为 value 时，value 才表示该成员。线布局不能把 enum、结构体名或 std::vector 写在线类型位置。多字节数值显式填写 LE/BE；单字节和 bytes 不写端序。

## 枚举与结构体

独立枚举的定义列写空白分隔的 `值=标签`，例如 `0=OFF 1=ON`；十六进制可用 `0xFF=INVALID`。范围须逐值展开，标签非空，每个枚举值唯一且在 int32 范围内。检查生成后的 C++ 名称合法且不冲突。不要在此列混入自由说明文字或未展开的 `1~25`。

结构体成员可引用已有命名枚举，或使用内联枚举：当前 DateTimeInfo 的 time_type 成员类型为 `enum`，定义列为完整的 `0=NONE 1=GPS ... 0xFF=INVALID`。内联枚举生成首字母大写的类型名，须检查与其他类型或内联枚举重名；有冲突时使用明确命名的枚举。普通数值成员的定义列只是说明，写“1~12”不会自动产生范围校验；真正限制应写入 Mapping，例如 `month.min=1`、`month.max=12`。

结构体采用平面成员：基础类型、命名/内联枚举、bytes[N] 或末尾 bytes；当前生成器不支持嵌套结构体、string 或任意变长数组。所有需公开的有效业务字段都须声明并绑定，不能为省事简化成一个标量。协议仅列一个枚举值不等于固定常量；常量须由文档明确规定。保留既有权威 API 类型，不能仅因说明中出现状态名称而将基础类型改成枚举。

枚举定义决定合法 API 值，Mapping 的 allowed 是额外限制，不能扩充枚举。invalid 针对原始线值；min/max/allowed 针对 API 值。枚举在 IPC 中按 int32 占 4 字节，不能按外部 uint8 的 1 字节计算 API 容量。

## 固定与变长字节

- 类型表/Interface 写 `bytes`；Mapping 变长线字段写 `bytes[*]`。`bytes[*]` 不是 API 类型，Mapping 裸 `bytes` 也不是合法变长布局。
- 固定数组两侧写相同的 `bytes[N]`，N 为正整数；生成 std::array<uint8_t,N>。变长 bytes 生成 std::vector<uint8_t>。不写 string、uint8[N]、std::vector<uint8_t> 作为表格类型。
- 变长结构体恰有一个 bytes 成员且在最后；线布局也恰有一个 bytes[*] 尾字段并在最后。载荷长度写 `dynamic`，不是最大长度数字。
- 尾字段必须有整数 max_bytes，min_bytes 省略时为 1；满足 `1 ≤ min_bytes ≤ max_bytes` 及 `固定 IPC 成员字节数 + max_bytes ≤ 512`。固定头占 2 字节时最多允许 510 字节尾部，含枚举的固定头按 IPC 的 4 字节宽度计算。
- 最大长度限制尾字段的实际字节数，不是字符数或外部整个 payload 长度。外部尾偏移 + max_bytes 另须满足当前 6140 字节 payload 上限。固定 bytes[N] 不填写 min_bytes/max_bytes。
- 保留原始 0 字节，不自行假定 UTF-8、终止符、补齐、截断或空载荷清除语义。当前空变长尾不支持。
- CAN 绑定必须是实际信号的基础成员类型，不能使用这些复合类型；当前 CLU→CLU 不支持变长接口。

## 本工作簿核对样例

- LyricsReport / LyricsDown：API 是 LyricsData；data 成员为 bytes；Mapping 是 `data@0:bytes[*]`、长度 dynamic，约束 `data.min_bytes=1` 与 `data.max_bytes=512`。512 是现有本地容量约束，不能推断为其他私有帧的协议上限。
- TimeReport / AppTime：API 是 DateTimeInfo；year/month 等逐项绑定，time_type 是内联枚举。多字节字段声明端序；范围和无效值写到约束列。
- KeySetting：API 是 KeySettingData，包含 key_type 与 key_state，分别绑定 Data0/Data1；Data2 才是 reserved。
- SoundValue：API 是 SoundValueData，包含 source_type/uint8 与 volume/uint8，分别绑定 `source_type@0:uint8` 和 `volume@1:uint8`；Data2 为 `reserved@2:uint8`。约束为 `source_type.allowed=16` 与 `volume.invalid=255`。不能将音源类型改为 const 而丢失 API 成员。
- PowerState 的已知状态 6/7 缺口及 IVI 电源的独立 OFF/ON 契约差异，在仓库说明中是待确认项；语法校验通过不代表已解决对端语义差异，不在普通类型检查中自行扩展或覆盖旧契约。

## 写入前与回读后的校验

1. 在临时目录形成完整的三张候选 CSV，按当前表头列名定位，保留多行单元格；记录每个接口的 API 类型、展开后的真实成员、对应布局、约束及协议依据。
2. 使用仓库原生成器的 `parse_interfaces`、`parse_types` 和 `gen_business.prepare` 联合解析候选 CSV，CAN 目录使用当前实际目录。这一步只解析/验证输入，不生成或覆盖仓库文件；不能用 --check 代替，因为 --check 还会比较现有生成物。
3. 人工核对协议有效字段与 API 成员、线字段的完整对应关系；生成器可发现未知成员、类型/布局/容量错误，但不能证明被遗漏的业务字段已经完整公开。例外如 ignore 必须保留既有 API 依据或明确授权及备注。
4. 检查类型定义唯一、成员合法不重复、命名类型引用可解析、枚举编码完整、API 与字节线类型匹配、尾成员与动态长度/容量一致、布局不重叠且下行完整覆盖。约束用半角语法，多值列表用分号，不在规则中写中文、单位、注释或表达式。
5. 全部通过后才写在线表；回读三张表重新执行相同联合校验，再按工作流导出四个文件、生成、--check、测试和编译。解析失败时先修正依据与候选表，不能绕过检查或用 reserved/const 填补遗漏的有效参数。
