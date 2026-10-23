# 数据类型与 Mapping 联合填写

构造或复核候选行前完整阅读本文件，同时读取当前仓库的 `VehicleMapping填写说明.md` 和生成器。以下规则对应仅按字段布局编解码的生成器；实际接口名、成员、枚举值和容量以本轮在线表及权威协议为准。示例用于说明格式，不作为其他帧的协议依据。

## 三张表分别表达什么

- `Interface定义表.data_type`：公开 API 的完整类型。基础类型直接填写；命名枚举/结构体填写准确类型名，与类型表大小写一致。它不是线字段宽度，也不由 field/method 或上下行决定。
- `Data_type定义表`：命名类型及成员。声明行写 `类型名,-,struct/enum,定义`；结构体随后逐行写成员。新成员行显式重复所属类型名，避免空类型名单元格继承错组。保留已有成员顺序，顺序决定 IPC 编码。
- `VehicleMapping.字段布局`：API 值或成员与外部 payload 的对应关系，格式为 `绑定名@零基偏移:线类型[/LE或BE]`。每条布局独占单元格内一行。

| API data_type | 类型表写法 | Mapping 绑定名与线类型 |
| --- | --- | --- |
| uint8、uint32、float 等基础类型 | 无需新增命名类型 | `value@0:uint8`、`value@0:uint32/LE` 等，线类型按协议填写 |
| PowerState 等独立枚举 | `PowerState,-,enum,0=Sleep 1=NormalRun ...`，展开全部权威值 | `value@0:uint8`；API 是枚举，线类型仍是协议规定的基础类型 |
| DateTimeInfo 等结构体 | 一条 struct 声明，随后一成员一行 | `year@0:uint16/LE`、`month@2:uint8` 等真实成员名 |
| bytes（直接作为接口类型） | 无需命名类型 | `value@0:bytes[*]`，长度 dynamic |
| bytes[N]（直接作为接口类型） | 无需命名类型 | `value@0:bytes[N]`，固定载荷长度 |
| LyricsData 等包含 bytes 的结构体 | `LyricsData,-,struct,...` 和 `LyricsData,data,bytes,...` | `data@0:bytes[*]`，长度 dynamic；只有一个成员仍用 data |

结构体不能用类型名、接口名、`Type.member` 或 `in.member` 作绑定名。真实成员名恰为 value 时，value 才表示该成员。线布局不能把 enum、结构体名或 std::vector 写在线类型位置。多字节数值显式填写 LE/BE；单字节和 bytes 不写端序。

## 枚举与结构体

独立枚举的定义列写空白分隔的 `值=标签`，例如 `0=OFF 1=ON`；十六进制可用 `0xFF=INVALID`。范围须逐值展开，标签非空，每个枚举值唯一且在 int32 范围内。检查生成后的 C++ 名称合法且不冲突。不要在此列混入自由说明文字或未展开的 `1~25`。

结构体成员可引用已有命名枚举，或使用内联枚举：当前 DateTimeInfo 的 time_type 成员类型为 `enum`，定义列为完整的 `0=NONE 1=GPS ... 0xFF=INVALID`。内联枚举生成首字母大写的类型名，须检查与其他类型或内联枚举重名；有冲突时使用明确命名的枚举。普通数值成员的定义列只是说明，写“1~12”不会自动产生范围校验；业务取值由应用或对端处理。

结构体采用平面成员：基础类型、命名/内联枚举、bytes[N] 或末尾 bytes；当前生成器不支持嵌套结构体、string 或任意变长数组。所有需公开的有效业务字段都须声明并绑定，不能为省事简化成一个标量。协议仅列一个枚举值不等于固定常量；常量须由文档明确规定。保留既有权威 API 类型，不能仅因说明中出现状态名称而将基础类型改成枚举。

枚举定义仅生成命名常量，未列出的枚举值和协议无效码也按底层类型收发。枚举在 IPC 中按 int32 占 4 字节，外部线宽由布局决定；int32 转 uint8 时允许 0～255，但拒绝无法表示的 -1、256，不静默截断。

## 固定与变长字节

- 类型表/Interface 写 `bytes`；Mapping 变长线字段写 `bytes[*]`。`bytes[*]` 不是 API 类型，Mapping 裸 `bytes` 也不是合法变长布局。
- 固定数组两侧写相同的 `bytes[N]`，N 为正整数；生成 std::array<uint8_t,N>。变长 bytes 生成 std::vector<uint8_t>。不写 string、uint8[N]、std::vector<uint8_t> 作为表格类型。
- 变长结构体恰有一个 bytes 成员且在最后；线布局也恰有一个 bytes[*] 尾字段并在最后。载荷长度写 `dynamic`，不是最大长度数字。
- 变长尾字段按实际字节数编解码，不配置接口专用的最小/最大长度，也不将旧限制迁移到载荷长度或其他列。
- 保留原始 0 字节，不自行假定 UTF-8、终止符、补齐、截断或清除语义。编解码允许空尾字段。
- 当前 IPC 规范值容量为 512 字节，RPC 重组 payload 容量为 6140 字节；它们是实现容量，不是歌词、SN 等协议字段的长度规定。底层 SHM 不支持零字节发布，不能把空尾字段可编解码等同于已支持空消息传输。
- CAN 绑定必须是实际信号的基础成员类型，不能使用这些复合类型；当前 CLU→CLU 不支持变长接口。

## 本工作簿核对样例

- LyricsReport / SetLyrics：API 是 LyricsData；data 成员为 bytes；Mapping 是 `data@0:bytes[*]`、长度 dynamic，按实际长度处理。
- TimeReport / SetTime：API 是 DateTimeInfo；year/month 等逐项绑定，time_type 是内联枚举。多字节字段声明端序，不附加业务取值过滤。
- KeySetting：API 是 KeySettingData，包含 key_type 与 key_state，分别绑定 Data0/Data1；Data2 才是 reserved。
- SoundValue：API 是 SoundValueData，包含 source_type/uint8 与 volume/uint8，分别绑定 `source_type@0:uint8` 和 `volume@1:uint8`；Data2 为 `reserved@2:uint8`。source_type 与 volume 均作为原始字段收发。不能将音源类型改为 const 而丢失 API 成员。
- PowerState 的已知状态 6/7 缺口及 IVI 电源的独立 OFF/ON 契约差异，在仓库说明中是待确认项；语法校验通过不代表已解决对端语义差异，不在普通类型检查中自行扩展或覆盖旧契约。

## 写入前与回读后的校验

使用无「约束规则」列的模板；不新增该列、不从协议说明或枚举名称生成值过滤规则。旧表尚未迁移时报告格式不匹配，在用户授权修改模板后继续。

1. 在临时目录形成完整的三张候选 CSV，按当前表头列名定位，保留多行单元格；记录每个接口的 API 类型、展开后的真实成员、对应布局及协议依据。
2. 使用仓库原生成器的 `parse_interfaces`、`parse_types` 和 `gen_business.prepare` 联合解析候选 CSV，CAN 目录使用当前实际目录。这一步只解析/验证输入，不生成或覆盖仓库文件；不能用 --check 代替，因为 --check 还会比较现有生成物。
3. 人工核对协议有效字段与 API 成员、线字段的完整对应关系；生成器可发现未知成员、类型/布局/容量错误，但不能证明被遗漏的业务字段已经完整公开。例外如 ignore 必须保留既有 API 依据或明确授权及备注。
4. 检查类型定义唯一、成员合法不重复、命名类型引用可解析、枚举编码完整、API 与字节线类型匹配、尾成员与动态长度/容量一致、布局不重叠且下行完整覆盖。字段布局按成员名逐行绑定，不在布局中附加业务范围或枚举白名单。
5. 全部通过后才写在线表；回读三张表重新执行相同联合校验，再按工作流导出四个文件、生成、--check、测试和编译。解析失败时先修正依据与候选表，不能绕过检查或用 reserved/const 填补遗漏的有效参数。
