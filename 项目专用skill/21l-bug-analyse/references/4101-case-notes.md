# 4101 案例笔记：已修正的判断与可迁移教训

复盘日期：2026-10-16。范围是用户最初的 2026-09-21 中国时间 14:50–15:20 显示 0x280/0x290 问题，及截至 2026-10-15 的延伸核查。此页保存校准示例与陷阱，不给其他 21L 项目预设时区、宏配置、正常延迟或 timer 根因。完整演进见本机 [独立中文复盘](/home/yardie/4101-independent-audit-20261013/4101_调查全流程复盘与21L方法沉淀_20261016.md)。

## 1. 从显示超时到多流边界

先将故障窗口 A 的 VR+LogStorage 与窗外 B 的 HMI 分开。HMI 原生最早覆盖中国 15:36:22，不能补作 14:57 事故线程证据。独立核查别人 `vr_black_screen_analysis.md` 后，保留 DCU 等待超时事实，撤回“只凭 WebEngine 字样/其他线程在跑即可排除 app-vr”“SYS 长间隔已定位某个锁”的强结论。见 [A/B 独立核查](/home/yardie/4101-independent-audit-20261013/4101_A_B_独立核查报告.md:5)。

3357 是独立案例。会话回顾已撤回“617秒与正常4–6秒”比较，因为电源阶段不等；本轮未重新计算3357。其旧时区、微秒和所谓无界同步等待表述也不能迁移到4101。

已核 native logger 用 UTC+9 前缀，按用户规则减1h；微秒是整数 tv_usec。DLT 取存储头中国时间，内嵌2025日期保留。SDK/MD/TTS按具体段单独锚定。原生已完成292的正常/亚秒样本不排除事故消息未派发：596个HMI handler候选中591个非负，最大33.233ms，5个负值保留；这是 handler 观察跨度，不是单次RPC。见 [原生292核查](/home/yardie/4101-independent-audit-20261013/native292_audit/跨时段原生HMI_VR_292核查.md:30)。

## 2. 扩大统计后必须纠正的数字

- Boot01626完整观察：38个显式等待阶段、37个主类 PreIntervAns timeout、538条显示280打印（含重试）、6条290局部推进；35条显示层TimeoutDispComp不能再加成另一批故障。晚到ACK和timeout后OK文本不等于本阶段及时成功。
- 15:11代表样本没有96/97，不能推广全Boot；37个超时阶段中26个含共142条96/97入口。全Boot原生96/97各141，已见后续banner处理，反对简单“事件风暴把队列堵死”。
- common原7019–7301共283行，实际是282条decoder_callback加1条GPS相关process_nlu_result；旧报告“全callback”是错误，已在后续深度报告纠正，旧文件保留历史快照。
- SDK目标全集从2524修正为2544，边界相同，补回20条混合时钟/无标签/音频异常与恢复记录，不是扩大窗口。
- autoai_log全部328文件被盘点：VR10、common10、HMI10、Decode2、MD294、TTS1、cache1。唯一整文件重复HMI .3/.4；物理行、记录头和业务条数分开。

依据：[全Boot统计与纠错](/home/yardie/4101-independent-audit-20261013/event96_280_deep_20261014/4101_全472行与异常280_深度报告.md:764)、[全目录映射](/home/yardie/4101-independent-audit-20261013/event96_280_deep_20261014/4101_全472行与异常280_深度报告.md:983)。这些数字不是未来案件的阈值。

## 3. 对照窗口不能偷换

14:57与15:20分别是异常与恢复实例；新main、系统BootID和电源序列要联合使用。正常Boot01627在15:29附近进入停机，尾部13个280无290单列；下一main约15:33，15:37样本属于另一Boot。不能拿稳定业务和停机阶段的等待直接比较，也不能称15:20后全时段健康。见 [实例边界](/home/yardie/4101-independent-audit-20261013/event96_280_deep_20261014/重启前后对照/native_agent/native_reboot_comparison.md:11)。

正常实例同样先发2012，且2001批处理前已有显示ACK。因此“未消费2001”不是显示失败的充分原因。异常早期六次导航startup错误、两侧后来Open OK/OPENCOMP均应保留，缺系统实现时不能指定它们造成2012延迟。

## 4. 设置、导航和外层协议的准确分层

| 层次 | 本案已核内容 |
|---|---|
| 设置请求 | 02A9，VR_UNIT=0x85 → VR_AGENT_UNIT=0x20085；HMI封包物理目标为DCU |
| 设置响应 | UISVCVR收到02A9、读取用户配置，UiSvcVrMeuCtrlSndMeu发送六字节02B9；SYS-TRIGGER来自data[3] |
| 首次2012 | 两实例均由02B9设置值触发；之后timer重发；不是必须先收2001才首次发送 |
| JSON | send_to_navi_systemtrigger写cmd=2012/systemtrigger；2001是另一启动状态协议 |
| 附加信息ID | send_cmd_to_navi直接req_additional_info(9099,0,file,logPrint)，没有额外Send包装 |
| 外层请求opcode | ADDITIONAL_INFO_REQ=0x0282；宏在app_vr_socket_def.h:20，实际传参在send_to_dten.cpp:1274 |
| 外层响应opcode | ADDITIONAL_INFO_RSP=0x0292；message_recive:639解析头，9099在676–677转process_dten_navi_result |
| 业务消费 | Z:5982 json_object_from_file，5985读内层cmd；发送路径日志不等于JSON生成者证明 |

设置系统证据：[RAS7253:L38012](/home/yardie/Desktop/21L/docs/4101log/dlt-4101/dlt/LogStorage/DRC_RAS.7253.txt:38012) 到38048、[正常RAS7259:L38570](/home/yardie/Desktop/21L/docs/4101log/dlt-4101/dlt/LogStorage/DRC_RAS.7259.txt:38570) 到38606；SYS-TRIGGER配置键为 `vehicle_user_profile.common_vehicle_settings.voice_recognition_settings.voice_ctrl_automatic_activation`。HMI有五字节全零超时兜底，但本案两侧实际六字节且有系统发送记录，不能混用。

## 5. 行号、双通道与包身份的反例

**两条L7933完全不同：**

```text
vr.log.4:L7933
[15:57:34.187223,INF][tid:0x2C010D50][send_to_navi_systemtrigger_timer_callback:8736]send_to_navi_systemtrigger timer:1

common_sys.log.1:L7933
[16:20:46.349305,SYS][tid:0x3358F450][349][app_vr_dten_msg_forward_send:1107][OUT] len : 35 opc : 0292 from : 00020085 to : 00000085
```

前者是异常重发1的回调尾，表中事实标注未错；后者是正常Boot的292转发。后者对应 `vr.log.3:L4439–4454`：9099、`/tmp/Navi2VR_Ntf_0.json`、业务cmd1004，随后direction251；系统 `DRC_RAS.7259.txt:L66934–66940` 给出同路径与len35发送。不能把common行当异常timer尾，也不能看到292就归2012。

common与VR是同一app-vr调用的不同日志通道：同函数的1106/1107是相邻两次宏输出，不是两次协议发送。OUT仅代表VR向HMI回转信号的本地发送前日志，from/to继续保持原始包20085→85。

## 6. 最后len36与后续len35：27秒的准确说法

2012实际消费包为len36：`vr.log.4:L8046–8058`，9099、`/tmp/Navi2VR_Rsp_1.json`、内层2012、取消后置和result0。系统 `DRC_RAS.7253.txt:L51922/L51926` 记录Rsp_1及len36发送。不能唯一指向首发或某次重试，也未确认响应JSON实际写文件进程。

后续SYS候选起止是另一条 **len35**：

- [DRC_SYS.9048.txt:L1544](/home/yardie/Desktop/21L/docs/4101log/dlt-4101/dlt/LogStorage/DRC_SYS.9048.txt:1544)：14:57:37.020200，recvDcuMsg start，292/20085→85/len35。
- [同文件:L2005](/home/yardie/Desktop/21L/docs/4101log/dlt-4101/dlt/LogStorage/DRC_SYS.9048.txt:2005)：14:58:04.130060，recvDcuMsg End，同header候选。

差值27.109860秒只是同header顺序候选的SYS采集间隔。缺TID/唯一事务ID，打点包围recvDcuMsg而非单次RPC，还受stdout批量采集影响。不能叫精确RPC或2012消费耗时。34秒和N×25秒同样不能由形状直接定性。详见 [最终简报的边界说明](/home/yardie/4101-independent-audit-20261013/event96_280_deep_20261014/4101_导航取消竞争_DBUS_HMI显示超时_简报.md:99)。

## 7. 原因链保留为候选

异常2012响应消费与第三次重发的可见窗口重叠；前两次有发送后置/回调尾，第三次未见。2012分支先cancel，再解析result；cancel后置已打印，不能说消费线程永远卡在该次join。`cancel_timer:0`是重置的计数值；g_thread_self不是pthread_t；线程取消API返回值未被调用者核验。

本地GObject信号会沿调用线程进入生成的DBus emitter，SDK存在条件性持锁取消点链；详见 [DBus专项方法](dbus-cancellation.md)。正常实例同样取消但继续通信，是必须保留的反例。浏览器锁通知函数返回后已释放，另有条件set_cmd_json_file_sync路径；不能把HMI的所有等待只归为一把锁或一个RPC。

截至复盘，已证的是显示等待超时、部分入口长期不可见、其他线程/SDK活动与局部ACK仍存在。缺现场版本、线程栈、锁owner、pthread退出点、DBus关联、文件当时内容等，**未证实现场DBus遗锁及完整因果传导**。
