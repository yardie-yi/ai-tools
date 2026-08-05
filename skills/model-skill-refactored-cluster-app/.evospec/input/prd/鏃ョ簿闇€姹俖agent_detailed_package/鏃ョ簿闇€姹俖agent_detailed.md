---
title: "日精需求 - TFT仪表总成机能式样书 Agent版"
source_file: "日精需求.doc"
source_format: "Microsoft Word 97-2003 .doc"
converted_format: "Markdown + media assets"
doc_type: "需求文档 / 机能式样书 / 仪表功能规范"
product: "5’TFT+LED 方形仪表平台、升级 BT、WiFi"
project: ["SC2E-1", "SC26-1F", "P701", "P701-A"]
part_numbers:
  SC2E-1: "34100H7Z110"
  SC26-1F: "34100H98300"
  P701: "34100H61000"
  P701-A: "34100H61100"
certification:
  SC2E-1: "H982"
  SC26-1F: "H982"
  P701: "H610"
  P701-A: "H610"
version_latest_detected: "V0.3"
latest_detected_date: "2025-09-17"
author_detected: "孙元春"
reviewer_detected: "林明达"
language: "zh-CN"
domain: ["motorcycle", "instrument_cluster", "TFT", "CAN", "Bluetooth", "WiFi", "OTA"]
conversion_stats:
  source_pages_detected_by_parser: 140
  media_assets_extracted: 160
  headings_indexed: 109
  can_or_numeric_ids_indexed: 24
  signal_names_indexed: 103
conversion_notes:
  - "已从 .doc 转换为 .docx，再通过 pandoc 转为 GFM Markdown。"
  - "复杂合并单元格、嵌入图片、图标和部分版式以 HTML 表格或 media 图片方式保留。"
  - "正文中插入 AGENT_SECTION 注释，方便 Agent 按功能、显示项、通信项检索。"
  - "图片资源位于 package 内 media/ 目录；单独使用 .md 时图片需与 media 目录保持相对路径。"
---

# Agent 使用说明

本文档是《日精需求.doc》的 Agent 可读 Markdown 版本，目标是方便代码 Agent / 需求分析 Agent / 测试用例生成 Agent 对仪表功能进行检索、拆分和追踪。

## 推荐检索方式

- 按功能名检索：如 `车速`、`骑行模式`、`TCS设置`、`快速换档QS`、`定速巡航`、`胎压/胎温显示`。
- 按通信关键词检索：如 `CAN数据帧`、`输出报文`、`UDS`、`Bootloader`、`OTA`、具体信号名。
- 按故障策略检索：如 `通信异常`、`故障代码显示`、`报警显示`、`自检动作`。
- 按 UI/页面检索：如 `页面切换`、`主/从页面切换`、`设置`、`背光设置`、`语言选择`。
- 遇到 HTML 表格时，优先把 `<td>` 内容视为同一需求单元；合并单元格代表原 Word 中的合并行/列。

## Agent 解析约定

- `AGENT_SECTION` 注释用于表示后续章节类型，字段包括：`id`、`type`、`title`、`keywords`。
- `type=indicator`：独立 LED 或 TFT 内指示/警告灯。
- `type=display_metric`：速度、里程、油量、水温、电池电压、胎压等数值显示。
- `type=vehicle_feature`：骑行模式、TCS、IMU、QS、定速巡航等车辆功能。
- `type=ui_navigation`：页面切换、设置菜单、主题、背光、单位、语言等 UI 操作。
- `type=communication`：CAN、UDS、Bootloader、BT、WiFi、OTA 等通信/升级相关需求。

## 自动章节索引

| 层级 | 章节/主题 |
| --- | --- |
| H1 | 要求 |
| H2 | 一般规定： |
| H2 | 外装规格： |
| H2 | 液晶屏 |
| H2 | 防护面板玻璃印刷 |
| H2 | 指示灯要求 |
| H2 | 接插件及端口定义 |
| H2 | 按键及其功能定义 |
| H2 | 仪表开关机自检动作 |
| H2 | 仪表输出报文 |
| H2 | 仪表诊断及保护 |
| H1 | 机能式样 |
| H2 | 独立LED指示灯 |
| H2 | TFT内显示内容 |
| H2 | 无线通信专项功能 |
| H2 | 仪表端口向外供电 |
| H1 | 页面切换 |
| H2 | 页面简介 |
| H2 | 主/从页面切换 |
| H2 | 主页面内容切换 |
| H2 | 车辆信息 |
| H2 | 投屏导航 |
| H2 | 音乐 |
| H2 | 电话 |
| H2 | 设置 |
| H2 | 智能钥匙应急模式 |
| H1 | 通信式样要求 |
| H2 | 有线通信 |
| H2 | 无线通讯 |
| H1 | App |
| H1 | 其它： |

## 自动功能索引

| 层级 | 功能/主题 | 检索关键词 |
| --- | --- | --- |
| H4 | 变更记录表 |  |
| H2 | 指示灯要求 | 指示灯 |
| H2 | 仪表诊断及保护 | 诊断 |
| H2 | 独立LED指示灯 | 指示灯 |
| H3 | 左/右转向指示灯 | 指示灯 |
| H3 | OBD指示灯 | 指示灯 |
| H3 | ABS警报指示灯 | 指示灯 |
| H3 | 光传感器 |  |
| H3 | 换档提示灯 | 换档 |
| H3 | N档指示灯 | 指示灯 |
| H3 | TCS指示灯 | 指示灯、TCS |
| H3 | 智能钥匙指示灯 | 指示灯、钥匙 |
| H3 | 车头锁警告灯（红色） |  |
| H3 | 预留指示灯 | 指示灯 |
| H3 | 车速 | 车速 |
| H3 | 平均车速 | 车速 |
| H3 | 总里程 | 里程 |
| H3 | 计程表A、B |  |
| H3 | 平均油耗A、B | 油耗 |
| H3 | 转速 | 转速 |
| H3 | 油量表 | 油量 |
| H3 | 水温表 | 水温 |
| H3 | 水温指示灯 | 指示灯、水温 |
| H3 | 档位 | 档位 |
| H3 | 时间 | 时间 |
| H3 | 电池电压 | 电池 |
| H3 | 环境温度显示 | 温度 |
| H3 | 油压指示灯 | 指示灯 |
| H3 | 位置灯 |  |
| H3 | 远光指示灯 | 指示灯 |
| H3 | 近光指示灯 | 指示灯 |
| H3 | 保养指示灯 | 指示灯、保养 |
| H3 | 换档转速提示灯&换挡转速提示功能启用符号 | 转速、换档 |
| H3 | 边撑开关指示符 |  |
| H3 | 胎压警报指示灯 | 指示灯、胎压 |
| H3 | 故障代码显示 | 故障 |
| H3 | 加热手把 | 加热 |
| H3 | 骑行模式 | 骑行 |
| H3 | 快速换档QS | 换档 |
| H3 | 定速巡航 | 定速 |
| H3 | 通用故障指示灯 | 指示灯、故障 |
| H3 | 灯具、喇叭、BCM关联故障报警显示 | 故障 |
| H3 | TCS设置 | TCS、设置 |
| H3 | 软硬件版本 |  |
| H3 | TCU预留显示 |  |
| H3 | VVL | VVL |
| H3 | 自动大灯 |  |
| H3 | IMU | IMU |
| H3 | 弹射起步 | 弹射 |
| H3 | 跑圈计时 | 跑圈 |
| H3 | 风挡玻璃 | 风挡 |
| H3 | AISS怠速启停指示灯 | 指示灯、AISS |
| H3 | 功能简介 |  |
| H3 | 电话 | 电话 |
| H3 | 投屏导航 | 导航 |
| H3 | 音乐 | 音乐 |
| H3 | 天气 | 天气 |
| H3 | 使用场景需求 |  |
| H2 | 仪表端口向外供电 | 供电 |
| H1 | 页面切换 | 页面 |
| H2 | 页面简介 | 页面 |
| H2 | 主/从页面切换 | 页面 |
| H2 | 主页面内容切换 | 页面 |
| H3 | 多功能区 |  |
| H3 | 主页面下的骑行模式切换 | 骑行、页面 |
| H3 | 快捷设置 | 设置 |
| H2 | 投屏导航 | 导航 |
| H2 | 音乐 | 音乐 |
| H2 | 电话 | 电话 |
| H2 | 设置 | 设置 |
| H3 | 设备管理 |  |
| H3 | 主题风格 |  |
| H3 | TCS设置 | TCS、设置 |
| H3 | 可选内容 |  |
| H3 | 背光设置 | 设置、背光 |
| H3 | 保养提示 | 保养 |
| H3 | 换档提示 | 换档 |
| H3 | 时间设置 | 时间、设置 |
| H3 | 自动大灯 |  |
| H3 | 弹射起步 | 弹射 |
| H3 | 单位设置 | 设置、单位 |
| H3 | 语言选择 | 语言 |
| H3 | 恢复出厂设置 | 设置 |
| H2 | 智能钥匙应急模式 | 钥匙 |
| H3 | CAN BUS | CAN |
| H3 | UDS 诊断功能 | 诊断 |
| H3 | 控制器同步休眠唤醒 |  |
| H3 | Bootloader软件升级功能 | Bootloader |
| H3 | 蓝牙BT | 蓝牙 |
| H3 | WiFi | WiFi |
| H3 | OTA升级功能 | OTA |

## 自动 CAN/数值 ID 索引

| 序号 | CAN/数值ID |
| --- | --- |
| 1 | 0x0400 |
| 2 | 0x0800 |
| 3 | 0x123400 |
| 4 | 0x12B |
| 5 | 0x12F |
| 6 | 0x134 |
| 7 | 0x135 |
| 8 | 0x136 |
| 9 | 0x137 |
| 10 | 0x160 |
| 11 | 0x180 |
| 12 | 0x1C0 |
| 13 | 0x320 |
| 14 | 0x321 |
| 15 | 0x330 |
| 16 | 0x340 |
| 17 | 0x350 |
| 18 | 0x356 |
| 19 | 0x360 |
| 20 | 0x400 |
| 21 | 0x523 |
| 22 | 0x92 |
| 23 | 0xFF |
| 24 | 0xFFFFFFFF |

## 自动报文/信号名索引

| 序号 | 报文/信号名 |
| --- | --- |
| 1 | ABS_1 |
| 2 | ABS_2 |
| 3 | ABS_3 |
| 4 | ABS_DASH_Drive_Mode_Rsp |
| 5 | ABS_Lean_Angle |
| 6 | ABS_MTC_ModeChangePermission |
| 7 | ABS_MTC_Warning_Lamp |
| 8 | ABS_Rear_Speed |
| 9 | ABS_Warning_IND |
| 10 | BCM_1 |
| 11 | BCM_2 |
| 12 | BCM_BrakeLampFail |
| 13 | BCM_HeatedHandFail |
| 14 | BCM_HeatedHandleLevel |
| 15 | BCM_HiBeamFail |
| 16 | BCM_HornFail |
| 17 | BCM_LTurnLampFail |
| 18 | BCM_LicenseLampFail |
| 19 | BCM_LowBeamFail |
| 20 | BCM_PosLampFail |
| 21 | BCM_RTurnlampFail |
| 22 | BCM_RearPosLampFail |
| 23 | BCM_SystemFail |
| 24 | Button_L |
| 25 | Button_R |
| 26 | Cc_VspWithOffset |
| 27 | DIAGMODE_Result |
| 28 | DTC_Info |
| 29 | ECM_1 |
| 30 | ECM_2 |
| 31 | ECM_3 |
| 32 | ECM_5 |
| 33 | ECM_Battery_Voltage |
| 34 | ECM_Cc_CondtionStatus |
| 35 | ECM_Cc_Master_Switch |
| 36 | ECM_Cc_RunStatus |
| 37 | ECM_Cc_Switch_Check |
| 38 | ECM_Cc_Vsp |
| 39 | ECM_DTC |
| 40 | ECM_Dash_Drive_Mode_Ack |
| 41 | ECM_EngWaTemp |
| 42 | ECM_Eng_Rpm |
| 43 | ECM_Engine |
| 44 | ECM_EngineTemp |
| 45 | ECM_Engine_Temp_IND |
| 46 | ECM_FuelConsumption |
| 47 | ECM_Fuel_Consumption |
| 48 | ECM_Gear_Position |
| 49 | ECM_Idle_Stop_Sts |
| 50 | ECM_MILLampSts |
| 51 | ECM_MIL_IND |
| 52 | ECM_MTR_TCS_Req_Ack |
| 53 | ECM_PowerModeChangePermission |
| 54 | ECM_QSUnavalb_failure |
| 55 | ECM_QickShifSts |
| 56 | ECM_Side |
| 57 | ECM_TCSWarningLamp |
| 58 | ECM_Temperature_Water |
| 59 | ECM_VBattery |
| 60 | ECM_system_unavailable_failure |
| 61 | ECM_system_unavalb_failure |
| 62 | ECU_Cc_Vsp |
| 63 | FUEL_SIG |
| 64 | Front_pressure |
| 65 | Front_pressure_warning |
| 66 | Front_t |
| 67 | Front_temperature_warning |
| 68 | HI_BEAM |
| 69 | MTR_DriveModeSet |
| 70 | MTR_DriveModeSetECM |
| 71 | MTR_EMG_REG_OP_Sts |
| 72 | MTR_FOB_ID |
| 73 | MTR_Hw_Version |
| 74 | MTR_Info |
| 75 | MTR_Out_1 |
| 76 | MTR_Out_2 |
| 77 | MTR_QickShifSet |
| 78 | MTR_Sw_Version |
| 79 | MTR_TCS_Req |
| 80 | Rear_pressure |
| 81 | Rear_sensor_lost |
| 82 | Rear_temperature |
| 83 | Rear_temperature_warnin |
| 84 | Rear_voltage_warning |
| 85 | SMRKY_1 |
| 86 | SMRKY_EMG_Input_Sts |
| 87 | SMRKY_EMG_STS |
| 88 | S_OUT_1 |
| 89 | Sensor_u |
| 90 | Stand_SW |
| 91 | TPMS_Indicator |
| 92 | TPMS_OU |
| 93 | TPMS_OUT_1 |
| 94 | TURN_L |
| 95 | TURN_R |
| 96 | Tbox_DateTime |
| 97 | Temp_IND |
| 98 | Time_Day |
| 99 | Time_Hour |
| 100 | Time_Min |
| 101 | Time_Month |
| 102 | Time_Sec |
| 103 | Time_Year |

---

# 原始文档转换正文

|--------------------------------------------------------|
| **TFT仪表通用机能式样书**                              |
| 【SC】SC2E-1、SC26-1F【BB】 P701、P701-A项目 CAN通信版 |
|                                                        |
| 5’TFT+LED 方形仪表平台、升级BT、WiFi                   |
| 四颗按键操控仪表版本                                   |
| **孙元春**                                             |
| **2025/9/17**                                          |
|                                                        |

<img src="media/image1.png"
style="width:2.42847in;height:0.76181in" />

**TFT仪表总成机能式样书**

**（ 5’TFT+LED** **方形仪表平台、升级BT、WiFi）**

|          |             |        |
|----------|-------------|--------|
| 车型名称 | 大长江图号  | 认证号 |
| SC2E-1   | 34100H7Z110 | H982   |
| SC26-1F  | 34100H98300 | H982   |
| P701     | 34100H61000 | H610   |
| P701-A   | 34100H61100 | H610   |

**编制： 孙 元 春 **

**校核： 孙 元 春 **

**审定： 林 明 达 **

**批准：**

<!-- AGENT_SECTION id="S001" type="section" title="变更记录表" keywords="" -->
##### 变更记录表

|          |          |            |            |                                        |
|----------|----------|------------|------------|----------------------------------------|
| **版本** | **阶段** | **日期**   | **编辑者** | **更改描述**                           |
|          |          |            |            |                                        |
| V0.1     | 系统制定 | 2025-07-12 | 孙元春     | 初版（项目启动用）                     |
| V0.2     | 系统制定 | 2025-09-12 | 孙元春     | 根据交流结果补充信息，请按此式样开发。 |
| V0.3     | 系统制定 | 2025-09-17 | 孙元春     | 补上P701                               |
| V0.4     | 功能样件 |            |            |                                        |
| V0.5     | 功能样件 |            |            |                                        |
| V0.6     | 功能样件 |            |            |                                        |
| V0.7     | 功能样件 |            |            |                                        |
|          |          |            |            |                                        |
|          |          |            |            |                                        |

<!-- AGENT_SECTION id="S002" type="section" title="目录" keywords="" -->
## 目录

[1 要求 9](#要求)

> [1.1 一般规定： 9](#一般规定)
>
> [1.2 外装规格： 10](#外装规格)
>
> [1.3 液晶屏 11](#液晶屏)
>
> [1.4 防护面板玻璃印刷 12](#防护面板玻璃印刷)
>
> [1.5 指示灯要求 12](#指示灯要求)
>
> [1.6 接插件及端口定义 13](#接插件及端口定义)
>
> [1.7 按键及其功能定义 14](#按键及其功能定义)
>
> [1.8 仪表开关机自检动作 15](#仪表开关机自检动作)
>
> [1.9 仪表输出报文 16](#仪表输出报文)
>
> [1.10 仪表诊断及保护 16](#仪表诊断及保护)

[2 机能式样 17](#机能式样)

> [2.1 独立LED指示灯 17](#独立led指示灯)

[2.1.1
左/右转向指示灯<img src="media/image2.png"
style="width:0.23889in;height:0.29097in" /><img src="media/image3.png"
style="width:0.26111in;height:0.28264in" /> 18](#左右转向指示灯)

[2.1.2 OBD指示灯<img src="media/image4.png"
style="width:0.29236in;height:0.19583in" />
19](#__RefHeading___Toc209077539)

[2.1.3
ABS警报指示灯<img src="media/image5.png"
style="width:0.25417in;height:0.17986in" /> 21](#abs警报指示灯)

[2.1.1 光传感器 22](#光传感器)

[2.1.2 换档提示灯<img src="media/image6.png"
style="width:0.20764in;height:0.20208in" /> 22](#换档提示灯)

[2.1.3 N档指示灯<img src="media/image7.png"
style="width:0.22917in;height:0.23958in" /> 23](#n档指示灯)

[2.1.4 TCS指示灯<img src="media/image8.png"
style="width:0.23958in;height:0.22222in" />
<img src="media/image9.png"
style="width:0.31042in;height:0.22708in" />
<img src="media/image10.png"
style="width:0.28611in;height:0.22847in" /> 24](#tcs指示灯)

[2.1.5
智能钥匙指示灯<img src="media/image11.png"
style="width:0.35764in;height:0.28194in" /> 26](#智能钥匙指示灯)

[2.1.6
车头锁警告灯（红色）<img src="media/image12.png"
style="width:7.26736in;height:0.30486in" /> 27](#车头锁警告灯红色)

[2.1.7 预留指示灯 27](#预留指示灯)

> [2.2 TFT内显示内容 28](#tft内显示内容)

[2.2.1 车速 28](#车速)

[2.2.2 平均车速 29](#平均车速)

[2.2.3 总里程 30](#总里程)

[2.2.4 计程表A、B 31](#计程表ab)

[2.2.5 平均油耗A、B 32](#平均油耗ab)

[2.2.6 转速 34](#转速)

[2.2.7 油量表 36](#油量表)

[2.2.8 水温表 38](#水温表)

[2.2.9 水温指示灯<img src="media/image13.png"
style="width:0.32431in;height:0.25in" /> 40](#水温指示灯)

[2.2.10 档位<img src="media/image14.png"
style="width:0.24722in;height:0.29097in" /> 41](#档位)

[2.2.11 时间<img src="media/image15.png"
style="width:0.88472in;height:0.23681in" /> 42](#时间)

[2.2.12 电池电压 43](#电池电压)

[2.2.13 环境温度显示 44](#环境温度显示)

[2.2.14 油压指示灯<img src="media/image16.png"
style="width:0.52014in;height:0.29583in" /> 47](#油压指示灯)

[2.2.15 位置灯<img src="media/image17.png"
style="width:0.41806in;height:0.25in" /> 48](#位置灯)

[2.2.16 远光指示灯<img src="media/image18.png"
style="width:0.29792in;height:0.25972in" /> 49](#远光指示灯)

[2.2.17 近光指示灯<img src="media/image19.png"
style="width:0.37708in;height:0.24861in" /> 50](#近光指示灯)

[2.2.18 保养指示灯
<img src="media/image20.png"
style="width:0.50972in;height:0.25972in" /> 51](#保养指示灯)

[2.2.19
换档转速提示灯&换挡转速提示功能启用符号<img src="media/image21.png"
style="width:0.27847in;height:0.21458in" />
52](#换档转速提示灯换挡转速提示功能启用符号)

[2.2.20
边撑开关指示符<img src="media/image22.png"
style="width:0.75in;height:0.32153in" /> 53](#边撑开关指示符)

[2.2.21
胎压警报指示灯<img src="media/image23.png"
style="width:0.29167in;height:0.26389in" /> 54](#胎压警报指示灯)

[2.2.22
胎压/胎温显示<img src="media/image24.png"
style="width:1.02708in;height:0.10347in" /> 55](#胎压胎温显示)

[2.2.23 故障代码显示 58](#故障代码显示)

[2.2.24 加热手把 61](#加热手把)

[2.2.25 骑行模式 62](#骑行模式)

[2.2.26 快速换档QS<img src="media/image25.png"
style="width:0.53056in;height:0.19722in" /> 73](#快速换档qs)

[2.2.27 定速巡航<img src="media/image26.png"
style="width:0.35208in;height:0.33542in" /> 77](#定速巡航)

[2.2.28
通用故障指示灯<img src="media/image27.png"
style="width:0.39514in;height:0.33264in" /> 85](#通用故障指示灯)

[2.2.29 灯具、喇叭、BCM关联故障报警显示
86](#灯具喇叭bcm关联故障报警显示)

[2.2.30 TCS设置
87](#tcs设置)

[2.2.31 软硬件版本 91](#软硬件版本)

[2.2.32 TCU预留显示 91](#tcu预留显示)

[2.2.33 VVL 92](#vvl)

[2.2.34 自动大灯 <img src="media/image28.png"
style="width:0.30833in;height:0.28125in" /> 93](#自动大灯)

[2.2.35 IMU 94](#imu)

[2.2.36 弹射起步 95](#弹射起步)

[2.2.37 跑圈计时 97](#跑圈计时)

[2.2.38 风挡玻璃 99](#风挡玻璃)

[2.2.39
AISS怠速启停指示灯<img src="media/image29.png"
style="width:0.42708in;height:0.35in" /> 100](#aiss怠速启停指示灯)

> [2.3 无线通信专项功能 101](#无线通信专项功能)

[2.3.1 功能简介 101](#功能简介)

[2.3.2 电话 <img src="media/image30.png"
style="width:0.24028in;height:0.24028in" /> 103](#电话)

[2.3.3 投屏导航<img src="media/image31.png"
style="width:0.32292in;height:0.29514in" /> 104](#投屏导航)

[2.3.4 音乐<img src="media/image32.png"
style="width:0.24444in;height:0.28681in" /> 105](#音乐)

[2.3.5 天气 106](#天气)

[2.3.6 使用场景需求 106](#使用场景需求)

> [2.4 仪表端口向外供电 108](#仪表端口向外供电)

[3 页面切换 108](#页面切换)

> [3.1 页面简介 108](#页面简介)
>
> [3.2 主/从页面切换 109](#主从页面切换)
>
> [3.3 主页面内容切换 110](#主页面内容切换)

[3.3.1 多功能区 110](#多功能区)

[3.3.2 主页面下的骑行模式切换 111](#主页面下的骑行模式切换)

[3.3.3 快捷设置 112](#快捷设置)

> [3.2 车辆信息<img src="media/image33.png"
> style="width:0.22569in;height:0.21875in" /> 113](#车辆信息)
>
> [3.3 投屏导航 113](#投屏导航-1)
>
> [3.4 音乐 114](#音乐-1)
>
> [3.4 电话 115](#电话-1)
>
> [3.5 设置 <img src="media/image34.png"
> style="width:0.20833in;height:0.20833in" /> 116](#设置)

[3.5.1 设备管理 117](#设备管理)

[3.5.2 主题风格 118](#主题风格)

[3.5.3 TCS设置 119](#tcs设置-1)

[3.5.4 可选内容 120](#可选内容)

[3.5.5 背光设置 121](#背光设置)

[3.5.6 保养提示 123](#保养提示)

[**3.5.7** **换档提示** 125](#换档提示)

[3.5.8 时间设置 127](#时间设置)

[3.5.9 自动大灯 128](#自动大灯-1)

[3.5.10 弹射起步 128](#弹射起步-1)

[3.5.11 单位设置 129](#单位设置)

[3.5.12 语言选择 130](#语言选择)

[**3.5.13** **恢复出厂设置** 130](#恢复出厂设置)

> [3.7 智能钥匙应急模式 131](#智能钥匙应急模式)

[**4** 133](#__RefHeading___Toc209077622)

[5 通信式样要求 136](#通信式样要求)

> [5.1 有线通信 136](#有线通信)

[5.1.1 CAN BUS 136](#can-bus)

[5.1.2 UDS 诊断功能 138](#uds-诊断功能)

[5.1.3 控制器同步休眠唤醒 138](#控制器同步休眠唤醒)

[5.1.4 Bootloader软件升级功能 138](#bootloader软件升级功能)

> [5.2 无线通讯 139](#无线通讯)

[5.2.1 蓝牙BT 139](#蓝牙bt)

[5.2.2 WiFi 139](#wifi)

[5.2.3 OTA升级功能 140](#ota升级功能)

[6 App 140](#app)

[7 其它： 140](#其它)

<!-- AGENT_SECTION id="S003" type="section" title="要求" keywords="" -->
## 要求

<!-- AGENT_SECTION id="S004" type="section" title="一般规定：" keywords="" -->
### 一般规定：

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<tbody>
<tr class="odd">
<td>项 目</td>
<td>式 样</td>
</tr>
<tr class="even">
<td>动作温度范围</td>
<td>大气温度（为自然环境温度，非仪表内部温度）：-30℃～+65℃，仪表均需正常动作。</td>
</tr>
<tr class="odd">
<td>保存温度范围</td>
<td>大气温度（为自然环境温度，非仪表内部温度）：-40℃ ～ 85℃ 。</td>
</tr>
<tr class="even">
<td>抗震性试验</td>
<td>加速度：10G（需体现在 2D
图纸上,特殊情况开发前单独申请认可），安装姿态为实车安装角度。显示期间不可有段码发黑、LCD内部显示受共振影响异常。</td>
</tr>
<tr class="odd">
<td>重量</td>
<td>仪表单体重量目标≤600g，承制方需提出轻量化设计提案共同商定方案。</td>
</tr>
<tr class="even">
<td>可靠度要求</td>
<td>符合豪爵研发中心的<em>HES Q
H9502000b</em>电子式仪表试验规格，并明确表示在2D图内。</td>
</tr>
<tr class="odd">
<td>环保要求</td>
<td>符合HES N
2402《环境有害物质使用限制》的规定，并明确标示在2D图纸内。</td>
</tr>
<tr class="even">
<td>额定电压</td>
<td>DC 13±0.1V、正常工作电压DC 15±0.5V。</td>
</tr>
<tr class="odd">
<td>暗电流</td>
<td><p>≤0.3mA (DC 13±0.1 V ， 20±5 ℃情况下）,要求尽量低。</p>
<p>如差异微小需单独提出与研发讨论并获得书面认可。</p></td>
</tr>
<tr class="even">
<td>消费电流</td>
<td>≤1000mA （在DC 13±0.1 V ， 20±5 ℃情况下，全功率工作模式下）</td>
</tr>
<tr class="odd">
<td>零件要求</td>
<td><p>要求全车规等级芯片（非车规芯片需单独提出并注明无料可选或非选原因，与研发讨论并获得书面认可）；</p>
<p>选型时需考虑寿命周期和供货稳定，有国产PIN to
PIN替代芯片规格优先。</p></td>
</tr>
<tr class="even">
<td>语言</td>
<td>默认：中文、英文、日文、韩文，未来依不同销售国可家变更搭载语言。</td>
</tr>
<tr class="odd">
<td>UI</td>
<td>2～3种背景风格，每种风格含黑夜/白天模式</td>
</tr>
<tr class="even">
<td rowspan="2"><p>电源逻辑</p>
<p>要求</p></td>
<td>BATT+ <em>ON</em> &amp; IGN+ <em>ON</em> 🡪
仪表工作于一般工作模式</td>
</tr>
<tr class="odd">
<td><ol type="1">
<li><p>需要在 IGN OFF 时允许 CAN
通信报文唤醒仪表(如:智能钥匙应急模式)</p></li>
<li><p>手把开关要求在 IGN OFF 时也能操作(如:智能钥匙应急模式,
CAN通信报文唤醒仪表后允许手把开关操作输入密码)
，设计上要预留和注意省电。</p></li>
<li><p>仪表屏幕的按键不要求 IGN OFF 时操作有效。</p></li>
</ol></td>
</tr>
<tr class="even">
<td>出厂默认</td>
<td>举例：显示单位：km（miles），出厂默认为km，备选项为miles</td>
</tr>
<tr class="odd">
<td>注意</td>
<td>发现此office软件有频繁将嵌入表格内的字母或数字丢失现象，承制单位如发现本机能书有错漏时，请及时提醒DCJ修正。</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S005" type="section" title="外装规格：" keywords="" -->
### 外装规格：

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr class="odd">
<td>外观</td>
<td><ol type="1">
<li><p>显示内容按照效果图、外观造型数据</p></li>
<li><p>LCD和指示灯关闭时观察需看起来一体黑效果</p></li>
<li><p>玻璃和上壳间隙不可看到明显溢胶</p></li>
<li><p>玻璃和间隙要均匀</p></li>
<li><p>上壳和下壳间隙不可看到溢胶</p></li>
<li><p>上壳和下壳间隙要均匀</p></li>
<li><p>皮纹要均匀，不可看到缩水、变形、反光问题</p></li>
<li><p>如对上述要求详细指标存在疑问，双方可请质量部门提早介入，针对现品进行评价或封样。</p></li>
</ol></td>
</tr>
<tr class="even">
<td>精度</td>
<td>严格按照提供的面数据，3D数据偏差 ≤ 0.1mm</td>
</tr>
<tr class="odd">
<td>仪表按键</td>
<td><del>仪表防护面板（玻璃）上布置上、下、OK、返回四颗触摸按键。</del></td>
</tr>
<tr class="even">
<td>壳体结构</td>
<td>目标：仪表下壳体使用可反复拆卸结构，不能满足要求时需单独提出与研发讨论并获得书面认可。</td>
</tr>
<tr class="odd">
<td>耐候</td>
<td>外装零件（包含外观可视的所有零部件）需提供材质耐候和耐温报告，以及相同材质在市场使用三年以上实绩产品佐证，不能满足需求时需单独提出与研发讨论</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S006" type="section" title="液晶屏" keywords="" -->
### 液晶屏

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr class="odd">
<td>液晶屏</td>
<td><ul>
<li><p>视角（通用平台需满足多角度视认性要求）：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 28%" />
<col style="width: 71%" />
</colgroup>
<tbody>
<tr class="odd">
<td>显示图案</td>
<td>按效果图、动画文件</td>
</tr>
<tr class="even">
<td>液晶屏型式</td>
<td>TFT-LCD，彩色IPS屏</td>
</tr>
<tr class="odd">
<td>液晶屏尺寸</td>
<td>5英寸</td>
</tr>
<tr class="even">
<td>液晶屏UI范围</td>
<td><p>仪表承制方需提供下图示意的.PSD文件</p>
<p>TFT屏全显区域</p>
<p>长*宽尺寸</p></td>
</tr>
<tr class="odd">
<td>TFT白屏亮度</td>
<td>≥1000 cd/</td>
</tr>
<tr class="even">
<td>分辨率2</td>
<td>800 x 480</td>
</tr>
<tr class="odd">
<td>刷新频率</td>
<td>≥50 Hz</td>
</tr>
<tr class="even">
<td>可视角（U/D/R/L）</td>
<td>45°/45°</td>
</tr>
<tr class="odd">
<td>与防护面板贴合工艺45°/45°</td>
<td>OB（Optically Bonded光学胶）</td>
</tr>
<tr class="even">
<td>视角</td>
<td>待后续布置确定后提示</td>
</tr>
<tr class="odd">
<td><p>液晶屏接收标准</p>
<p>品质要求及价格影响</p></td>
<td><p>请先向DCJ 质量部门、采购本部提出接收标准。</p>
<p>例如行业内普遍关注的坏点大小、数量及检查距离等指标、不同接收标准对应的阶梯价格。</p>
<p>在B2前商定完毕。</p></td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S007" type="section" title="防护面板玻璃印刷" keywords="" -->
### 防护面板玻璃印刷

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr class="odd">
<td>防护面板玻璃印刷</td>
<td><p>材料要求：无机玻璃，直接裸漏在外使用；</p>
<p>玻璃表面：AG
雾面防镜像处理，暂定雾度值5±3%,光泽度90±10,表面粗糙度0.11±0.05um。</p>
<p>对应车型没有的功能外观上需不可见</p>
<p>指示灯布置具体依照UI图。承制方如有借用量产件降本方案可提出商讨。</p>
<p><img src="media/image36.png"
style="width:3.73264in;height:4.45833in" /></p>
<p>SC2E-1</p>
<p>SC26-1F</p>
<p>P701</p>
<p>P701-A</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S008" type="indicator" title="指示灯要求" keywords="指示灯" -->
### 指示灯要求

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr class="odd">
<td>指示灯</td>
<td><p>按照效果图，同时厂家需具备相关法规的校核能力，发现问题及时反馈修正。</p>
<p>信号装置、指示器的图形符号应符合</p>
<ol type="1">
<li><p>EU 3 2014附件Ⅷ
驾驶员操纵包括操纵件、信号装置和指示器识别的适用要求</p></li>
<li><p>Annex VIII amended by EU 2016/1824附件Ⅰ修正(EU)No
3∕2014附件Ⅷ</p></li>
<li><p>布置上颜色相同的指示灯应尽量避免相邻（具体按UI）</p></li>
<li><p>暗室环境下指示灯均匀且不得眩目，白天阳光下指示灯需清晰可见，且照明均匀。</p></li>
</ol></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 6%" />
<col style="width: 13%" />
<col style="width: 21%" />
<col style="width: 30%" />
<col style="width: 27%" />
</colgroup>
<tbody>
<tr class="odd">
<td colspan="3">车型</td>
<td rowspan="2"><strong>P701</strong></td>
<td rowspan="2"><p><strong>SC2E-1、SC26-1F</strong></p>
<p>　</p></td>
</tr>
<tr class="even">
<td>序号</td>
<td>英文简写</td>
<td>端口定义</td>
</tr>
<tr class="odd">
<td>1</td>
<td><p>Gear 4-</p>
<p>/Lock-</p></td>
<td><p>档位线输入 4</p>
<p>/<mark>车头锁警告灯</mark></p></td>
<td>←预留电路，但不贴片</td>
<td><p><mark>车头锁警告灯（红色）</mark></p>
<p><mark>Lock-</mark>,通用电路，但不贴片</p></td>
</tr>
<tr class="even">
<td>2</td>
<td>Gear 3-</td>
<td>档位线输入 3</td>
<td>←预留电路，但不贴片</td>
<td>←</td>
</tr>
<tr class="odd">
<td>3</td>
<td><p>Gear 2-</p>
<p>/Button_R-</p></td>
<td><p>档位线输入 2</p>
<p>/操作按键（右）</p></td>
<td>Gear 2-/操作按键（右）, 接地信号输入,通用电路，但不贴片</td>
<td>←</td>
</tr>
<tr class="even">
<td>4</td>
<td><p>Gear 1-</p>
<p>/Button_L-</p></td>
<td><p>档位线输入 1</p>
<p>/操作按键（左）</p></td>
<td>Gear 1-/操作按键（左）,接地信号输入,通用电路，但不贴片</td>
<td>←</td>
</tr>
<tr class="odd">
<td>5</td>
<td>HI_BEAM+</td>
<td>远光指示灯</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="even">
<td>6</td>
<td>NEUTRAL-</td>
<td>空档指示符</td>
<td>←预留电路，但不贴片<br />
(跨骑车LED为绿色)</td>
<td><p><mark>←预留电路，但不贴片</mark></p>
<p><mark>指示灯PAD兼容黄色/红色</mark></p></td>
</tr>
<tr class="odd">
<td>7</td>
<td>TURN_L+</td>
<td>左转向灯</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="even">
<td>8</td>
<td>TURN_R+</td>
<td>右转向灯</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="odd">
<td>9</td>
<td>GND-</td>
<td>地</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="even">
<td>10</td>
<td>ILLUMI+</td>
<td>位置灯开关信号</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="odd">
<td>11</td>
<td>IGN+</td>
<td>点火开关(锁)</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="even">
<td>12</td>
<td>BATT+</td>
<td>蓄电池+</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="odd">
<td>13</td>
<td><mark>VCC_ OUT</mark></td>
<td><mark>电源输出</mark></td>
<td>←预留电路，但不贴片</td>
<td>←预留电路，但不贴片</td>
</tr>
<tr class="even">
<td>14</td>
<td>Button4-</td>
<td>操作按键（确认ok）</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="odd">
<td>15</td>
<td>Button3-</td>
<td>操作按键（返回↖）</td>
<td>操作按键（返回↖）</td>
<td>←</td>
</tr>
<tr class="even">
<td>16</td>
<td>Button2-</td>
<td>操作按键（下）</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="odd">
<td>17</td>
<td>Button1-</td>
<td>操作按键（上）</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="even">
<td>18</td>
<td>CAN-H</td>
<td>CAN 通信口</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="odd">
<td>19</td>
<td>CAN-L</td>
<td>CAN 通信口</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="even">
<td>20</td>
<td>OIL-</td>
<td>水冷线控油压警告灯</td>
<td>←</td>
<td>←预留电路，但不贴片</td>
</tr>
<tr class="odd">
<td>21</td>
<td>SMRKY -</td>
<td>智能钥匙指示灯</td>
<td>←预留电路，但不贴片</td>
<td>有</td>
</tr>
<tr class="even">
<td>22</td>
<td>FUEL_SIG</td>
<td>油量信号</td>
<td>←</td>
<td>←</td>
</tr>
<tr class="odd">
<td>23</td>
<td>Gear 6-</td>
<td>档位线输入 6</td>
<td><p><mark>←预留电路，但不贴片</mark></p>
<p><mark>可通过贴片与右侧二选一</mark></p></td>
<td><mark>环境温度<br />
（负性电阻型信号输入）</mark>←预留电路，但不贴片</td>
</tr>
<tr class="even">
<td>24</td>
<td>Gear 5-</td>
<td>档位线输入 5</td>
<td><p><mark>←预留电路，但不贴片</mark></p>
<p><mark>可通过贴片与右侧二选一</mark></p></td>
<td><mark>环境温度<br />
（负性电阻型地线输入）</mark>←预留电路，但不贴片</td>
</tr>
<tr class="odd">
<td colspan="5"><p><img
src="media/image37.png"
style="width:1.04028in;height:0.84167in" />JAE、型号：MX34024UF1、24端子接插件。</p>
<p>预留端口及相应检测电路，实物元器件默认不用贴片。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S009" type="section" title="接插件及端口定义" keywords="" -->
### 接插件及端口定义

<!-- AGENT_SECTION id="S010" type="section" title="按键及其功能定义" keywords="" -->
### 按键及其功能定义

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>短按: &lt;0.5s ； 长按： 1-2s ； 超长按：＞2s</p>
<p>双击：在0.5s时间间隔内，接着完成第二次单击，判定为双击，两次点击的时间间隔在0.2s到0.5s之间。具体需考虑人机交互感觉，可提出具体参数和模拟软件讨论。</p>
<p>未定义的区间仪表可不响应；</p>
<p>达到按键操作时，即使按键未松开，相关显示内容可切换显示。</p>
<p>快速移动时每格的停留时间为0.2±0.1s；</p>
<p>遇到数值选择默认：按键长按或超长按时可快速切换（每过0.2s数值变化1），具体参照各机能；</p>
<p>骑行模式、TCS、快速换档需要在主页面直接操作(不用进入菜单)。</p></td>
</tr>
<tr class="even">
<td><ol type="1">
<li><p>整车侧手把开关按键：</p></li>
</ol>
<p><img src="media/image38.wmf" /> 颜色含义：
<img src="media/image39.wmf" /></p>
<table>
<colgroup>
<col style="width: 30%" />
<col style="width: 69%" />
</colgroup>
<tbody>
<tr class="odd">
<td>实车侧电路</td>
<td>规格</td>
</tr>
<tr class="even">
<td><img src="media/image40.wmf"
style="width:1.86389in;height:2.57639in" /></td>
<td><ol type="1">
<li><p>手把开关类型：微动开关</p></li>
</ol>
<blockquote>
<p>（均为点动接触ON，松开复位OFF）</p>
</blockquote>
<ol start="2" type="1">
<li><p>手把开关允许的电流： 1mA～50mA,建议检测电流≥4.5mA</p></li>
</ol>
<p><img src="media/image41.png"
style="width:3.60764in;height:2.07778in" /></p>
<ol start="3" type="1">
<li><p>开关漏电流：无</p></li>
</ol>
<p>4、开关接触电阻：0.5Ω max（初期），5Ω max（耐久后）</p></td>
</tr>
</tbody>
</table>
<p><strong>注：</strong>仪表要支持整车侧手把开关按键在IGN+
OFF期间工作，以支持IGN OFF期间功能操作。</p>
<ol start="2" type="1">
<li><p>仪表内部按键：仪表防护面板（玻璃）上布置上、下、OK、返回四颗触摸按键。具体功能待定</p></li>
</ol>
<p><img src="media/image42.png"
style="width:4.23542in;height:0.46111in" /></p>
<p><strong>注：</strong>仪表内部按键不需要要支持IGN+ OFF期间工作。</p>
<blockquote>
<p>在达到一定车速时(暂定1km/h)，需要屏蔽仪表内部按键功能，以免误触发。</p>
</blockquote></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S011" type="section" title="仪表开关机自检动作" keywords="" -->
### 仪表开关机自检动作

<table>
<colgroup>
<col style="width: 20%" />
<col style="width: 79%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>信号动作</strong></td>
<td><strong>仪表响应动作</strong></td>
</tr>
<tr class="even">
<td><strong>IGN+</strong>：OFF 🡪 ON</td>
<td><p>IGN+ ON
后0.5秒开始，根据我司提供的自检动画（开机动画+衔接动画）显示。</p>
<p>开机动画长度：2-4秒，全屏显示。</p>
<p>IGN+ OFF后，根据我司提供的关机动画显示。</p>
<p>关机动画长度：2-4秒，全屏显示。</p>
<p>（关机动画过程中如果IGN ON，这个时候就转换为开机动画）</p>
<ul>
<li><p>附注：</p></li>
</ul>
<ol type="1">
<li><p>IGN+ ON
后0.5秒开始，仪表按实车接收到的信息驱动可控制的灯点亮动作自检（硬线直驱类指示灯不作要求）。</p></li>
</ol>
<ul>
<li><p>LED灯；</p></li>
<li><p>TFT内（按当前页面包含的指示灯，除实车接收到的信息驱动可控制的灯点亮外，保养提示需要亮灯）。</p></li>
</ul>
<p>待增加UI设计。承制方可依照理解提供开机动画时序-显示内容的对照图承认。</p>
<p>仪表可控的 LED 灯与待机实时动画时机同步。</p>
<ol start="2" type="1">
<li><p>初期动作期间，按键的操作无效。</p></li>
<li><p>初期动作期间，接收到IGN+ OFF信号时，仪表所有功能停止。</p></li>
<li><p>换挡提示灯在开机动画期间设置为开， LED
点亮时的照明亮度按仪表此灯设置的亮度进行。如换挡提示灯已设置为关闭，则按关闭前亮度点亮。</p></li>
<li><p>动画播放过程中有车速输入时，立即回到正常画面显示车速。暂定当显示车速&gt;5km/h（对应
3～4 之间的 mile，可以只参照km/h）时。</p></li>
</ol></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S012" type="section" title="仪表输出报文" keywords="" -->
### 仪表输出报文

<table>
<colgroup>
<col style="width: 16%" />
<col style="width: 83%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>信号动作</strong></td>
<td><strong>仪表响应动作</strong></td>
</tr>
<tr class="even">
<td>输出报文</td>
<td><table>
<colgroup>
<col style="width: 50%" />
<col style="width: 50%" />
</colgroup>
<tbody>
<tr class="odd">
<td>跨骑车</td>
<td>踏板车</td>
</tr>
<tr class="even">
<td><p>MTR_Info</p>
<p>MTR_Out_*</p>
<p>发送时间：仪表被唤醒后(IGN ON)持续发送，仪表进入休眠时（IGN
OFF）停止发送。</p></td>
<td>←</td>
</tr>
<tr class="odd">
<td>/</td>
<td><p>IGN OFF后，</p>
<p>仅在应急模式才会发送NM_MTR</p>
<p>仅在应急模式才会发送MTR_Out_2</p></td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S013" type="section" title="仪表诊断及保护" keywords="诊断" -->
### 仪表诊断及保护

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>1.仪表内部过热，降低LCD背光、功耗自我保护功能。</p>
<p>注意过热保护的策略不能是背光直接关闭（进入黑屏模式），建议将背光调整为最低亮度。</p>
<p>此时LCD显示提醒：仪表进入热保护模式(预留功能)，同时记录故障代码。</p>
<p>注：仪表需要将LCD的监测温度值发送到CAN总线上。</p>
<p>2.发动机转速≦500RPM期间， LCD背光、功耗降低保护车身电瓶。</p>
<p>建议同上述1采取过热保护方案。</p>
<p>3.BT/WiFi连接工作期间，侦测到车身电压过低，LCD显示报警提示功能</p>
<p>同2.2.12 电池电压：增加低电压警示功能</p>
<p>4.遥控器丢失IGN OFF期间输入密码，LCD
BT/WiFi关闭、LCD背光依双方指定亮度降低功耗</p>
<p>5.按其他控制器CAN通信数据显示故障(预留，非必要功能)</p>
<p>(1)BCM控制关联零部件故障，以故障代码或对话弹框UI显示</p>
<p>(2)ABS、FI-ECU、TCU故障代码</p>
<p>(3)TPMS报警信息: 胎压、胎温异常，传感器丢失、低电量</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S014" type="section" title="机能式样" keywords="" -->
## 机能式样

<!-- AGENT_SECTION id="S015" type="indicator" title="独立LED指示灯" keywords="指示灯" -->
### 独立LED指示灯

|      |                  |                            |
|------|------------------|----------------------------|
| 序号 | 显示内容         | 对应切换内容               |
| 1    | 左转向灯指示灯   | 开启-亮绿灯；关闭-熄灭     |
| 2    | 右转向灯指示灯   | 开启-亮绿灯；关闭-熄灭     |
| 3    | OBD故障指示灯    | 警报-亮黄灯；正常-熄灭     |
| 4    | ABS警报指示灯    | 警报-亮黄灯；正常-熄灭     |
| 5    | 光传感器         | /                          |
| 6    | 换档提示灯       | 开启-亮白灯；关闭-熄灭     |
| 7    | N档提示灯        | 开启-亮绿灯；关闭-熄灭     |
| 8    | TCS牵引力指示灯  | 开启-亮黄灯；关闭-熄灭     |
| 9    | 智能钥匙指示灯   | 开启-亮黄灯；关闭-熄灭     |
| 10   | ~~车头锁警告灯~~ | ~~开启-亮红灯；关闭-熄灭~~ |

<!-- AGENT_SECTION id="S016" type="indicator" title="左/右转向指示灯" keywords="指示灯" -->
#### 左/右转向指示灯

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>左/右转向指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><p>绿色LED，左右转向灯各一个</p>
<p>FMVSS NO.108（尺寸规定）：发光面积应大于等于直径3/16英寸的圆
※1英寸=2.54cm</p></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><p>右转(TURN_R)： PIN 8</p>
<p>左转(TURN_L)： PIN 7</p></td>
</tr>
<tr class="even">
<td>实车侧电路</td>
<td><p>输入最大电压：15V</p>
<p>最大工作电流（13V）：典型工作电流10mA左右。</p></td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><img src="media/image44.wmf"
style="width:3.57361in;height:1.88611in" /></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S017" type="indicator" title="OBD指示灯" keywords="指示灯" -->
#### OBD指示灯

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示方式</td>
<td><ul>
<li><p>黄色LED指示灯</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入信号</td>
<td><p>故障代码在设置页面的显示方案不做，在主页面需要显示故障代码。但是指示灯需要根据要求指示。</p>
<ul>
<li><p>CAN数据帧-诊断</p></li>
</ul>
<p>SC：</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_2</td>
<td>DIAGMODE</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>BB：</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_DTC</td>
<td>DIAGMODE</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: User mode</p>
<p>0x1: Current DTC mode</p>
<p>0x2: History DTC mode</p>
<p>0x3: Learning Value clear mode</p>
<ul>
<li><p>CAN 数据帧-指示灯</p></li>
</ul>
<blockquote>
<p>SC：</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x134</td>
<td>ECM_1</td>
<td>ECM_MIL_IND</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>BB：</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x134</td>
<td>ECM_1</td>
<td>ECM_MILLampSts</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>按以下方式动作：</p>
<p><img src="media/image45.png"
style="width:6.24444in;height:7.00903in" /></p></td>
</tr>
<tr class="odd">
<td>电路</td>
<td>/</td>
</tr>
<tr class="even">
<td><p>输入及</p>
<p>响应</p></td>
<td></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S018" type="indicator" title="ABS警报指示灯" keywords="指示灯" -->
#### ABS警报指示灯

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>ABS警报指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>黄色LED。 FMVSS
NO.122（尺寸规定）：字高＞3/32英寸≈2.38mm</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号及响应</td>
<td><ul>
<li><p>CAN数据帧- ABS_Warning_IND</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x12B</td>
<td>ABS_1</td>
<td>ABS_Warning_IND</td>
<td>RX</td>
</tr>
</tbody>
</table>
<table>
<colgroup>
<col style="width: 57%" />
<col style="width: 42%" />
</colgroup>
<tbody>
<tr class="odd">
<td><em>仪表接收到CAN信息</em></td>
<td><em>仪表ABS指示灯动作</em></td>
</tr>
<tr class="even">
<td>0x0: Off: Lamp 'off'</td>
<td>指示灯OFF</td>
</tr>
<tr class="odd">
<td>0x1: On-1 : Lamp 'on' due to ABS failure</td>
<td>指示灯ON</td>
</tr>
<tr class="even">
<td>0x2: ABS ECU in Diagnostic Mode ( Test Mode )</td>
<td>指示灯ON</td>
</tr>
<tr class="odd">
<td>0x3: ABS disabled by rider(reserved)</td>
<td>保留位，收到此值仪表滤除，维持最近一笔有效数字显示</td>
</tr>
<tr class="even">
<td>0x4: Not defined, reserved</td>
<td>↑</td>
</tr>
<tr class="odd">
<td>0x5: Lamp 'on' due self diagnostic</td>
<td>指示灯ON</td>
</tr>
<tr class="even">
<td>0x6: Not defined, reserved</td>
<td>保留位，收到此值仪表滤除，维持最近一笔有效数字显示</td>
</tr>
<tr class="odd">
<td>0x7: MSC Failure(CABS failure)</td>
<td>指示灯ON ，同时UI提示“弯道ABS/TCS失效”与“倾倒熄火功能无效”
–UI首选可同时显示。</td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S019" type="section" title="光传感器" keywords="" -->
#### 光传感器

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>光传感器</td>
</tr>
<tr class="even">
<td>输入信号</td>
<td>自然光线</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><p>根据外界光强调整屏幕亮度；根据外界光强调整白天/夜晚显示模式</p>
<p>黑白屏切换不得有明显的人眼视觉突兀感觉，具体依主观评价结果。</p>
<p>参考DCJ量产仪表，要求承制方具备对标分析能力。</p>
<p>根据对标结果，确定防护面板玻璃印刷油墨深度、导光结构，以及感光传感器芯片选型。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S020" type="indicator" title="换档提示灯" keywords="换档" -->
#### 换档提示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>换档提示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>LED指示灯</p></li>
<li><p>指示符形式（按照效果图）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>换档提示灯配置数据 &amp; 转速</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>CAN数据帧-- ECM_Eng_Rpm</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x135</td>
<td>ECM_2</td>
<td>ECM_Eng_Rpm</td>
<td>RX</td>
</tr>
</tbody>
</table>
<ul>
<li><p>换档提示灯动作流程：</p></li>
</ul>
<blockquote>
<p>当转速&gt;设定转速时，换档指示灯点亮/闪烁；</p>
<p>当转速≤设定转速时，换档指示灯熄灭。</p>
</blockquote>
<ul>
<li><p>换档提示灯配置功能在设置页面中，详情请参考设置页面。</p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S021" type="indicator" title="N档指示灯" keywords="指示灯" -->
#### N档指示灯

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 85%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>N档指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>绿色LED指示灯</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>同档位CAN通信报文，PIN 6：</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>电路板PAD可兼容黄色/红色LED。</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td>与TFT内“N”符号同步显示。但是在开机动画期间需要根据实车报文实时响应亮/灭。</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S022" type="indicator" title="TCS指示灯" keywords="指示灯,TCS" -->
#### TCS指示灯

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>TCS 指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>黄色 LED 灯</p></li>
<li><p>显示动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><p>SC：</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x136</td>
<td>ECM_3</td>
<td>ECM_TCSWarningLamp</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>BB：</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x12F</td>
<td>ABS_2</td>
<td>ABS_MTC_Warning_Lamp</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: Off: Lamp 'off' 指示灯关闭</p>
<p>0x1: On-1 : Lamp 'on' due to MTC/MSR failure
指示灯ON、TCS故障符号(有!)ON</p>
<p>0x2: ON，ECU in Diagnostic Mode ( Test Mode)</p>
<p>0x3: MTC disabled by rider 指示灯ON+TCS关闭符号ON</p>
<p>0x4: Not defined, reserved（维持上一个状态）</p>
<p>0x5: Lamp 'on' due self diagnostic or Engine
Kill指示灯ON+TCS关闭符号ON</p>
<p>0x6: Lamp blink due to MTC/MSR working</p>
<p>指示灯闪烁(320ms ON/ 320ms OFF)+TCS ON符号</p>
<p>0x7: MM5.10 EOL lock mode指示灯闪烁(320ms ON/ 320ms OFF)+TCS
ON符号</p>
<p>详见下表：</p>
<p><img src="media/image46.wmf"
style="width:6.25in;height:6.49514in" /></p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S023" type="indicator" title="智能钥匙指示灯" keywords="指示灯,钥匙" -->
#### 智能钥匙指示灯

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 85%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>智能钥匙指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>黄色LED指示灯</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>智能钥匙信号：PIN 21</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td><table>
<colgroup>
<col style="width: 51%" />
<col style="width: 48%" />
</colgroup>
<tbody>
<tr class="odd">
<td><img src="media/image47.png"
style="width:3.02153in;height:2.60417in" /></td>
<td><p>VL max：0.5V</p>
<p>最大工作电流（15V）：≤80mA。</p></td>
</tr>
</tbody>
</table></td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p>外部信号接地时：指示灯点亮</p>
<p>外部信号断开时：指示灯熄灭</p>
<p>注：该指示灯需要在IGN OFF时点灯</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S024" type="indicator" title="车头锁警告灯（红色）" keywords="" -->
#### 车头锁警告灯（红色）

<table>
<colgroup>
<col style="width: 14%" />
<col style="width: 85%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>车头锁警告灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>红色LED指示灯</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>智能钥匙信号：PIN 1</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td><table>
<colgroup>
<col style="width: 51%" />
<col style="width: 48%" />
</colgroup>
<tbody>
<tr class="odd">
<td><img src="media/image47.png"
style="width:3.02153in;height:2.60417in" /></td>
<td><p>VL max：0.5V</p>
<p>最大工作电流（15V）：≤80mA。</p></td>
</tr>
</tbody>
</table></td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p>外部信号接地时：指示灯点亮</p>
<p>外部信号断开时：指示灯熄灭</p>
<p>注：该指示灯需要在IGN OFF时点灯</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S025" type="indicator" title="预留指示灯" keywords="指示灯" -->
#### 预留指示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>预留提示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>LED指示灯，指示符形式（按照效果图）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>CAN数据帧—预留，待定</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td></td>
<td></td>
<td></td>
<td>RX</td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S026" type="section" title="TFT内显示内容" keywords="" -->
### TFT内显示内容

<!-- AGENT_SECTION id="S027" type="display_metric" title="车速" keywords="车速" -->
#### 车速

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>车速</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示。注意车速显示都不能被遮挡。</p></li>
<li><p>显示动画：按照效果图（数码显示/指针式显示）</p></li>
<li><p>显示范围： 0～199，速度表的数字高度14mm以上</p></li>
</ul>
<blockquote>
<p>0x1BC8以上(相当于400km/h以上)的CAN信号输入是无效的，仪表显示最大值199km/h</p>
</blockquote>
<ul>
<li><p>显示单位：km/h （mph），1mph = 1.6km/h</p></li>
<li><p>显示分辨率：1</p></li>
<li><p>显示保持时间：300±33.33ms</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据帧：ABS_Rear_Speed</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x12B</td>
<td>ABS_1</td>
<td>ABS_Rear_Speed</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>ABS_Rear_Speed无效值是0xFFFE</p>
<p>精度Factor: 0.05625</p>
<p>示例：当收到ABS_Rear_Speed = 0x400时，仪表转化过程如下：</p>
<p><em>Ex: 0x0400 × 0.05625 = 256 × 4 ×0.5625 = 57.6km/h🡪(显示57
km/h)</em></p>
<p><em>（显示时舍弃小数点后的数字，实际累积里程时需按照实际速度计算）</em></p>
<ul>
<li><p>软件设定值-km/h</p></li>
</ul>
<table style="width:100%;">
<colgroup>
<col style="width: 17%" />
<col style="width: 7%" />
<col style="width: 6%" />
<col style="width: 10%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>标准指度</p>
<p>km/h</p></td>
<td>20</td>
<td>30</td>
<td>40</td>
<td>60</td>
<td>80</td>
<td>100</td>
<td>120</td>
<td>140</td>
<td>160</td>
<td>180</td>
</tr>
<tr class="even">
<td><p>公差</p>
<p>km/h</p></td>
<td><p>+ 3</p>
<p>+1</p></td>
<td><p>+ 4</p>
<p>+ 2</p></td>
<td><p>+ 5</p>
<p>+ 2</p></td>
<td><p>+ 7</p>
<p>+ 3</p></td>
<td><p>+ 9</p>
<p>+ 3</p></td>
<td><p>+ 11</p>
<p>+ 3</p></td>
<td><p>+ 12</p>
<p>+ 4</p></td>
<td><p>+ 14</p>
<p>+ 4</p></td>
<td><p>+ 15</p>
<p>+ 5</p></td>
<td><p>+17</p>
<p>+5</p></td>
</tr>
<tr class="odd">
<td>软件设定中心值 km/h</td>
<td></td>
<td><p>22</p>
<p>33</p></td>
<td>44</td>
<td></td>
<td><p>65</p>
<p>86</p></td>
<td>107</td>
<td>1</td>
<td><p>08</p>
<p>149</p></td>
<td>170</td>
<td>191</td>
</tr>
</tbody>
</table>
<ul>
<li><p>软件设定值mph</p></li>
</ul>
<table style="width:100%;">
<colgroup>
<col style="width: 20%" />
<col style="width: 7%" />
<col style="width: 7%" />
<col style="width: 6%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
<col style="width: 8%" />
</colgroup>
<tbody>
<tr class="odd">
<td>标准指度</td>
<td><p>mph</p>
<p>20</p></td>
<td>25</td>
<td>40</td>
<td>60</td>
<td>80</td>
<td>100</td>
<td>120</td>
<td>140</td>
<td>160</td>
<td>180</td>
</tr>
<tr class="even">
<td>公差mph</td>
<td><p>+ 3</p>
<p>+1</p></td>
<td><p>+ 3</p>
<p>+1</p></td>
<td><p>+ 5</p>
<p>+ 2</p></td>
<td><p>+ 6</p>
<p>+ 2</p></td>
<td><p>+ 8</p>
<p>+</p></td>
<td><p>3</p>
<p>+ 9</p>
<p>+ 3</p></td>
<td><p>+ 10</p>
<p>+ 4</p></td>
<td><p>+ 12</p>
<p>+ 4</p></td>
<td><p>+ 15</p>
<p>+ 5</p></td>
<td><p>+17</p>
<p>+5</p></td>
</tr>
<tr class="odd">
<td>软件设</td>
<td><p>中心值 mph</p>
<p>22</p></td>
<td>27</td>
<td></td>
<td><p>44</p>
<p>64</p></td>
<td>86</td>
<td>106</td>
<td>127</td>
<td>148</td>
<td>170</td>
<td>191</td>
</tr>
</tbody>
</table></td>
</tr>
<tr class="even">
<td>电路</td>
<td></td>
</tr>
<tr class="odd">
<td><p>输入</p>
<p>及响应</p></td>
<td><p>需要根据实车数据波动情况，调整车速的响应软件。</p>
<p>车速开始输入起500msec不进行计数。</p>
<p>异常处理:</p>
<p>1、通信异常(参考CAN总线协议中关于通信异常的节点丢失loss
communication、DLC≠8、BUS
OFF等具体要求)时显示0km/h；通信异常确认前维持当前显示（异常确认的时间和条件请参考CAN总线协议）；</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S028" type="display_metric" title="平均车速" keywords="车速" -->
#### 平均车速

|                                                                                                                                       |
|---------------------------------------------------------------------------------------------------------------------------------------|
| 平均车速：车辆处于IGN ON的总时间内，总计行驶的距离。即行驶这么长距离用了总时间是多少来计算平均车速。跟随TRIP A和B清零。~~不能清零。~~ |

<!-- AGENT_SECTION id="S029" type="display_metric" title="总里程" keywords="里程" -->
#### 总里程

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>总里程</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示动画：按照效果图，总里程/区间里程表的数字高度4mm以上。</p></li>
<li><p>显示范围： 0～+999999
，前位0都要显示。例如123km时显示为000123km。</p></li>
<li><p>显示分辨率：1</p></li>
<li><p>显示单位：km（miles），其中：1 mile =1.6 km</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>速度信号 &amp; 时间</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>依据车速输入信号积算里程Distance，显示数据Distance_Total=Distance×1.02（+2%补偿值）</p></li>
<li><p>公制（km）累计到999999km，但英制（miles）未达到999999miles的，英制单位下继续累计总里程。</p></li>
<li><p>里程累计超出最大值999999时，锁定为最大值，不再改变。</p></li>
<li><p>总里程不能清零和调整。</p></li>
<li><p>误差需求</p></li>
</ul>
<ol type="1">
<li><p>IGN ON⇔OFF时的显示及累计误差为±0(km or miles)。</p></li>
<li><p>IGN OFF→ON时，显示上一次IGN OFF前的数据。</p></li>
<li><p>电池更换时的显示误差为±0km，电池更换时的累计误差为±1km以内。</p></li>
</ol>
<ul>
<li><p>异常警报：</p></li>
</ul>
<ul>
<li><p>IGN ON时、如果无法取得正常数据,
按最大位数填入“-”（如果有小数点的机能，小数点也要显示），总里程表停止累计。</p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S030" type="section" title="计程表A、B" keywords="" -->
#### 计程表A、B

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>计程表显示（TRIP A &amp; TRIP B）</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示(在固定的显示区域内显示)。</p></li>
<li><p>显示动画：按照效果图，总里程/区间里程表的数字高度4mm以上。</p></li>
<li><p>显示范围： 0 ～
+9999.9，前位0不需要显示。例如99km时显示为99km。</p></li>
<li><p>显示分辨率：0.1</p></li>
<li><p>显示单位：km（miles）,与总里程显示单位相同。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>速度信号&amp;对应行驶时间</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td><p>输入</p>
<p>及响应</p></td>
<td><ul>
<li><p>同总里程。</p></li>
<li><p>误差需求</p>
<ol type="1">
<li><p>IGN ON⇔OFF时的显示及累计误差为±0.1 (km or miles)。</p></li>
</ol></li>
</ul>
<blockquote>
<p>小数点第二位数据在IGN
OFF时或仪表整体断电时<del>舍弃处理</del>存储数据，精确到0.01km。需要ODO和Trip采用相同策略。</p>
<p>2、IGN OFF→ON时，显示上一次IGN OFF前的数据。</p>
<p>3、电池更换时的累计误差为±1km以内。</p>
<p>4、计程表需循环累积，0.0🡪9999.9🡪0.0
（km、miles显示时均需符合此要求）</p>
</blockquote>
<ul>
<li><p>异常警报：</p></li>
</ul>
<ul>
<li><p>IGN ON时、如果无法取得正常数据,
按最大位数填入“-”（如果有小数点的机能，小数点也要显示），计程表表停止动作，与总里程同步停止动作。</p></li>
</ul></td>
</tr>
<tr class="even">
<td>关联操作</td>
<td><ul>
<li><p>相关计程表清零功能在车辆信息页面，<em>详情请参考 4.5.1
里程信息</em></p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S031" type="display_metric" title="平均油耗A、B" keywords="油耗" -->
#### 平均油耗A、B

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>平均油耗(Avg fuel cons._A &amp; Avg fuel cons._B)</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示动画：按照效果图</p></li>
<li><p>显示范围： 0.1～99.9</p></li>
<li><p>显示分辨率：0.1</p></li>
<li><p>显示单位：L/100km（km/L），当车速单位为km/h时；</p></li>
</ul>
<blockquote>
<p>MPG US（MPG IMP)，当车速单位为mph时；</p>
</blockquote>
<ul>
<li><p>显示更新周期： 计程表每累计达0.1（km or
miles）更新显示。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN通信：ECM_Fuel_Consumption</p></li>
</ul>
<blockquote>
<p>SC:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x134</td>
<td>ECM_1</td>
<td>ECM_FuelConsumption</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>Factor: 0.015625 单位： cc/sec</p>
<p>Note:数据内容:过去1秒钟内喷油量(
ECM_Fuel_Consumption)cc，每200ms更新一次，ECM是每20ms发送一笔数据到CAN总线（即200ms内发送10笔相同的数据）。</p>
<blockquote>
<p>BB:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 24%" />
<col style="width: 26%" />
<col style="width: 23%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x136</td>
<td>ECM</td>
<td><p>3</p>
<p>ECM_FuelConsumption</p></td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>Factor: 0.01 单位： cc/sec</p>
<p>Note:数据内容:过去1秒钟内喷油量(
ECM_Fuel_Consumption)cc，每200ms更新一次，ECM是每20ms发送一笔数据到CAN总线（即200ms内发送10笔相同的数据）。</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td><p>输入</p>
<p>及响应</p></td>
<td><ul>
<li><p>计程表与平均油耗对应联动，其中一个重置则对应功能都重置。（同P3A5）</p></li>
<li><p>计程表重置后，直到检出行驶0.1（km or
mile）为止，按最大位数填入“-”（如果有小数点的机能，小数点也要显示）。</p></li>
</ul>
<blockquote>
<p>1、如果计算结果不足0.1km/L(MPG US、MPG IMP)，显示0.1。</p>
<p>2、如果计算结果不足0.1km/L，显示0.1。</p>
<p>3、如果计算结果不足0.1L/100km，显示0.1。</p>
<p>4、如果计算结果超过99.9(km/L、L/100km)，显示99.9。</p>
<p>5、如果计算结果超过99.9(MPG US、MPG IMP)，显示99.9。</p>
</blockquote>
<ul>
<li><p>IGN ON←→OFF计算值不会改变。</p></li>
<li><p>电池再连接时重置该数据</p></li>
<li><p>计算方法</p></li>
</ul>
<blockquote>
<p>(1)IGN ON后、累计收到的油耗数据。(油耗数据单位：cc/s)</p>
<p>(2)计算方法</p>
</blockquote>
<p><img src="media/image48.png"
style="width:5.9125in;height:0.76181in" /></p>
<ul>
<li><p>显示误差： 理论值±3%以内； <img
src="media/image49.png"
style="width:1.30625in;height:0.45208in" /></p></li>
<li><p>通信异常处理：</p></li>
</ul>
<blockquote>
<p>1、 IGN
ON后，ABS或ECM在通信异常(参考CAN总线协议中关于通信异常的节点丢失loss
communication、DLC≠8、BUS
OFF等具体要求)时停止积算，按最大位数填入“-”（如果有小数点的机能，小数点也要显示）,且通信异常时，停止平均油耗计算用的行驶距离和燃料消费数据的累计。</p>
</blockquote></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S032" type="display_metric" title="转速" keywords="转速" -->
#### 转速

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>转速</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示(仅在固定的显示区域内显示)。</p></li>
<li><p>显示动画：按照效果图（数字显示/指针式显示/段码显示等）</p></li>
<li><p>显示范围： 0～+12000 r/min</p></li>
<li><p>显示分辨率：±25rpm（UI每0.5°更新一次）</p></li>
<li><p>显示保持时间： 33.33(0,＋33.33)ms（和动画设计有关）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><ul>
<li><p>转速数据帧</p></li>
</ul>
<blockquote>
<p>SC:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 28%" />
<col style="width: 28%" />
<col style="width: 19%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x134</td>
<td>ECM_1</td>
<td>ECM_Eng_Rpm</td>
<td>RX</td>
</tr>
</tbody>
</table>
<blockquote>
<p>ECM_Engine_Rpm无效值是0xFFFF。</p>
<p>Factor: 0.390625 Offset：0</p>
<p>BB:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 26%" />
<col style="width: 26%" />
<col style="width: 26%" />
<col style="width: 20%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x135</td>
<td>ECM</td>
<td><p>2</p>
<p>ECM_Eng_Rpm</p></td>
<td>RX</td>
</tr>
</tbody>
</table>
<blockquote>
<p>ECM_Engine_Rpm无效值是0XFFFF.</p>
<p>Factor: 1 Offset：0 , 最大物理值为20000 RPM</p>
<p>Ex:当收到ECM_Engine_RPM = 0x800时，仪表解算实车侧为2048 RPM</p>
<p>0x0800 x 0.25 = 256 x 8 = 2048 RPM</p>
</blockquote>
<ul>
<li><p>显示允差：</p></li>
</ul>
<table style="width:100%;">
<colgroup>
<col style="width: 31%" />
<col style="width: 10%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 10%" />
<col style="width: 9%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>标准指度(实际输入)</p>
<p>r/</p></td>
<td><p>in</p>
<p>1250</p></td>
<td>2000</td>
<td>4000</td>
<td>6000</td>
<td>8000</td>
<td>10000</td>
<td>12000</td>
</tr>
<tr class="even">
<td><p>仪表公差</p>
<p>r/m</p></td>
<td><p>n</p>
<p>+250</p>
<p>-250</p></td>
<td><p>+250</p>
<p>0</p></td>
<td><p>+500</p>
<p>+250</p></td>
<td><p>+500</p>
<p>+250</p></td>
<td><p>+750</p>
<p>+500</p></td>
<td><p>+1000</p>
<p>+750</p></td>
<td>-</td>
</tr>
<tr class="odd">
<td><p>仪表软件设定中心值</p>
<p>r/min</p></td>
<td>1250</td>
<td>2125</td>
<td>4375</td>
<td>6375</td>
<td>8625</td>
<td>10875</td>
<td>-</td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>转速红区警报：<strong>BB有，SC没有红区警报</strong></p></li>
</ul>
<p>当转速显示≥设定的阈值（阈值为仪表显示的10000rpm）时动作。</p>
<p>对应的实际转速约为9222rpm(9111rpm～9333rpm)，具体动画根据效果图。</p>
<ul>
<li><p>怠速显示稳定性：（依照实车匹配测试结果调整）</p></li>
</ul>
<blockquote>
<p>怠速区域设定为1500rpm～2200rpm</p>
</blockquote>
<ul>
<li><p>通信异常(参考CAN总线协议中关于通信异常的节点丢失loss
communication、DLC≠8、BUS OFF等具体要求)时显示0 rpm</p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S033" type="display_metric" title="油量表" keywords="油量" -->
#### 油量表

<table>
<colgroup>
<col style="width: 13%" />
<col style="width: 86%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>油量表显示 &amp; 燃油不足警报</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>动画方式：按照效果图</p></li>
<li><p>显示范围：E🡪F (0% 🡪 100%)</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p><img src="media/image50.png"
style="width:1.58472in;height:1.83958in" />油量传感器电阻信号 ：PIN
22</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td><ul>
<li><p>实车侧参考电路：</p></li>
</ul>
<p>仪表侧不需间断供电</p>
<p>输入电阻值范围： 10（F 点）～ 216（E 点）Ω</p>
<p>外部电压16V, 油量传感器输出0 Ohm给油表sensor电流&gt;=60mA。</p>
<ul>
<li><p>5格段显示式样：SC2E-1、SC26-1F、P701-A</p></li>
</ul>
<table>
<colgroup>
<col style="width: 23%" />
<col style="width: 28%" />
<col style="width: 47%" />
</colgroup>
<tbody>
<tr class="odd">
<td colspan="3"><strong>指度规格</strong></td>
</tr>
<tr class="even">
<td>格段</td>
<td>切换阻值范围（Ω）</td>
<td>动画</td>
</tr>
<tr class="odd">
<td>5→</td>
<td>37.5±3.</td>
<td rowspan="4"><p>按UI</p>
<p>按UI</p>
<p>按UI</p>
<p>按UI</p></td>
</tr>
<tr class="even">
<td>4→3</td>
<td>64.5±4.1</td>
</tr>
<tr class="odd">
<td>3→2</td>
<td>106.1±5.9</td>
</tr>
<tr class="even">
<td>2→1</td>
<td>153.8±8.4</td>
</tr>
<tr class="odd">
<td>1→低油量警报</td>
<td>196.0±10.9</td>
<td>按UI（油壶符号和1格段同频1Hz点灭闪烁）</td>
</tr>
</tbody>
</table>
<ul>
<li><p>6格段显示式样：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 21%" />
<col style="width: 31%" />
<col style="width: 47%" />
</colgroup>
<tbody>
<tr class="odd">
<td colspan="3"><strong>指度规格</strong></td>
</tr>
<tr class="even">
<td>格段</td>
<td>切换阻值范围（Ω）</td>
<td>动画</td>
</tr>
<tr class="odd">
<td>6→5</td>
<td>29±3</td>
<td></td>
</tr>
<tr class="even">
<td>5→4</td>
<td>50±4</td>
<td rowspan="4"><p>按UI</p>
<p>按UI</p>
<p>按UI</p>
<p>按UI</p></td>
</tr>
<tr class="odd">
<td>4→3</td>
<td>75±5</td>
</tr>
<tr class="even">
<td>3→2</td>
<td>106.1±5.9</td>
</tr>
<tr class="odd">
<td>2→1</td>
<td>153.8±8.4</td>
</tr>
<tr class="even">
<td>1→低油量警报</td>
<td>196.0±10.9</td>
<td>按UI（油壶符号和1格段同频1Hz点灭闪烁）</td>
</tr>
</tbody>
</table>
<p><mark></mark></p></td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>一般动作</p></li>
</ul>
<ol type="1">
<li><p>IGN ON后，开机动画结束时立刻显示正确油量；</p></li>
<li><p>IGN ON时，油量表的更新时间为：16±0.5s /级</p></li>
</ol>
<ul>
<li><p>异常警报(5±0.2s间连续检出下列状态时触发警报)：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 24%" />
<col style="width: 59%" />
</colgroup>
<tbody>
<tr class="odd">
<td>类别</td>
<td>状态</td>
<td>动画</td>
</tr>
<tr class="even">
<td>短路检出</td>
<td>阻值&lt;2±1.5Ω</td>
<td>按UI</td>
</tr>
<tr class="odd">
<td>断路检出</td>
<td>阻值≥2k±1kΩ</td>
<td>按UI</td>
</tr>
</tbody>
</table>
<ul>
<li><p>警报解除：</p></li>
</ul>
<p>5±0.2s间连续侦测到正常油量阻值，解除异常，根据输入阻值直接显示正确油量。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S034" type="display_metric" title="水温表" keywords="水温" -->
#### 水温表

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>发动机冷却液温度显示</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>显示动画：按照效果图</p></li>
<li><p>更新时间为：2s±33.33ms /级(后续实车评价确定)，</p></li>
</ul>
<blockquote>
<p>(数据为更新显示前上一笔的有效数据)</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据帧—ECM_EngWaTemp</p></li>
</ul>
<blockquote>
<p>SC:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x136</td>
<td>ECM_3</td>
<td>ECM_EngineTemp</td>
<td>RX</td>
</tr>
</tbody>
</table>
<ol type="1">
<li><p>偏移量offset：-40，精度factor：1，物理单位：℃</p></li>
</ol>
<p>2、范例：Ex：当收到0x50时，水温显示 = -40+5×16×1=40℃</p>
<blockquote>
<p>BB:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x137</td>
<td>ECM_5</td>
<td>ECM_Temperature_Water</td>
<td>RX</td>
</tr>
</tbody>
</table>
<ol start="2" type="1">
<li><p>偏移量offset：-50，精度factor：0.75，物理单位：℃</p></li>
</ol>
<p>2、范例：Ex：当收到0x50时，水温显示 = -50+5×16×0.75=10℃</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p>1、IGN ON后根据输入进行显示。</p>
<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 0%" />
<col style="width: 26%" />
<col style="width: 23%" />
<col style="width: 27%" />
</colgroup>
<tbody>
<tr class="odd">
<td></td>
<td colspan="4"><strong>指度规格</strong></td>
</tr>
<tr class="even">
<td colspan="2">格段</td>
<td>上升时温度范围（℃）</td>
<td>下降时温度范围（℃）</td>
<td>动画</td>
</tr>
<tr class="odd">
<td colspan="2">5<strong>↔︎</strong>5格闪烁</td>
<td><em>注1</em></td>
<td><em>注2</em></td>
<td rowspan="6">根据效果图</td>
</tr>
<tr class="even">
<td colspan="2">4<strong>↔︎</strong>5</td>
<td>115</td>
<td>113</td>
</tr>
<tr class="odd">
<td colspan="2">3<strong>↔︎</strong>4</td>
<td>95</td>
<td>93</td>
</tr>
<tr class="even">
<td colspan="2">2<strong>↔︎</strong>3</td>
<td>75</td>
<td>73</td>
</tr>
<tr class="odd">
<td colspan="2">1<strong>↔︎</strong>2</td>
<td>60</td>
<td>58</td>
</tr>
<tr class="even">
<td colspan="2">0<strong>↔︎</strong>1</td>
<td>40</td>
<td>38</td>
</tr>
</tbody>
</table>
<p>注：1、当连续收到两帧<strong>ECM_Engine_Temp_IND=0x1</strong>时，发动机冷却液温度指示灯和第5格格段同步开始闪烁，闪烁频率1Hz，50Duty，具体动画以效果图为准；</p>
<p>2、当连续收到两帧<strong>ECM_Engine_Temp_IND=0x0</strong>时，发动机冷却液温度指示灯和第5格格段同步停止闪烁，具体动画以效果图为准。</p>
<ul>
<li><p>一般动作: IGN ON后，开机动画结束时立刻显示正确温度；</p></li>
</ul>
<ul>
<li><p>异常处理:</p></li>
</ul>
<p>1、通信异常(参考CAN总线协议中关于通信异常的节点丢失loss
communication、DLC≠8、BUS
OFF等具体要求)时按照效果图进行显示；通信异常确认前维持当前显示（异常确认的时间和条件请参考CAN总线协议）；</p></td>
</tr>
<tr class="even">
<td>迁移画面</td>
<td>按照效果图</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S035" type="indicator" title="水温指示灯" keywords="指示灯,水温" -->
#### 水温指示灯

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>水温指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT 指示符</p></li>
<li><p>指示符形式：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN 数据帧-- ECM_Engine_Temp_IND</p></li>
</ul>
<p>SC:</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x134</td>
<td>ECM_1</td>
<td>ECM_Engine</td>
<td><p>Temp_IND</p>
<p>RX</p></td>
</tr>
</tbody>
</table>
<p>BB:</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x137</td>
<td>ECM_5</td>
<td>ECM_Engine</td>
<td><p>Temp_IND</p>
<p>RX</p></td>
</tr>
</tbody>
</table>
<ul>
<li></li>
</ul>
<p>0x0: 指示灯 OFF</p>
<p>0x1: 指示灯 ON</p>
<p>0x2: 保留位，收到此值仪表滤除，维持最近一笔有效数字显示(0x0,0x1)</p>
<p>0x3:
保留位，收到此值仪表滤除，维持最近一笔有效数字显示(0x0,0x1)</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S036" type="section" title="档位" keywords="档位" -->
#### 档位

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>档位表</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示动画：按照效果图，N档法规要求为绿色，其它档位宜使用不同颜色区别</p></li>
<li><p>显示范围： N，1～6</p></li>
<li><p>显示分辨率：1</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>档位数据</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x135</td>
<td>ECM_2</td>
<td>ECM_Gear_Position</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: N档</p>
<p>0x1: 1档</p>
<p>0x2: 2档</p>
<p>0x3: 3档</p>
<p>0x4: 4档</p>
<p>0x5: 5档</p>
<p>0x6: 6档</p>
<p>0x7: 未检测到档位信号，显示空白’’</p>
<p>0x8：同时检测到俩个以上档位信号，显示’-’</p>
<p>0x9～0xE: Reserved value ，显示’-’</p>
<p>0xF: Invalid，显示’-’</p></td>
</tr>
<tr class="even">
<td>输入及响应</td>
<td><ul>
<li><p>正常动作</p></li>
</ul>
<ol type="1">
<li><p>LCD需显示档位对应的数字；</p></li>
<li><p>如收到0x7～0xF，显示“ -
”通信异常(参考CAN总线协议中关于通信异常的节点丢失loss
communication、DLC≠8、BUS OFF等具体要求)时显示 “ - ”</p></li>
</ol></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S037" type="section" title="时间" keywords="时间" -->
#### 时间

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>时间</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td>数码式/指针式</td>
</tr>
<tr class="odd">
<td>显示图案</td>
<td>按效果图</td>
</tr>
<tr class="even">
<td>显示范围</td>
<td><p>00:00→23:59（24 小时制）</p>
<p>01:00→12:59（12 小时制），出厂默认 12 小时制。</p></td>
</tr>
<tr class="odd">
<td>分辨率</td>
<td>0.1s</td>
</tr>
<tr class="even">
<td>精度</td>
<td><p>± 2s/day (at 20ﾟC)</p>
<p>± 6s/day (at -10ﾟC ～ 60ﾟC)</p>
<p>承制方需出具晶振匹配报告，以及时钟精度确认结果。</p></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><p>1、RTC IC</p>
<p>2、CAN报文（有报文时，报文时间优先。纠正时间的时候，需要1S内闪烁三次后更新显示）</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x356</td>
<td>Tbox_DateTime</td>
<td><p>Time_Year</p>
<p>Time_Month</p>
<p>Time_Hour</p>
<p>Time_Day</p>
<p>Time_Min</p>
<p>Time_Sec</p></td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>3、手机App：根据BLE交互协议更新。</p>
<p>注：1、优先级：手机App＞CAN报文＞RTC IC</p>
<p>2、在仪表IGN ON后如果出现手工按键调整时间的情况，在IGN
OFF前应保持此手工按键调整的时间优先。</p></td>
</tr>
<tr class="even">
<td>电池更换</td>
<td><p>1、电池更换（BAT &amp; IGN
同时OFF）时，时钟恢复初始值1:00（恢复时间需不限定）；</p>
<p>2、BAT掉电后第一次上电 ,IGN
ON后时钟区块1Hz闪烁10s提示用户重新设定。</p></td>
</tr>
<tr class="odd">
<td>关联操作</td>
<td>时间设置功能在设置页面中</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S038" type="display_metric" title="电池电压" keywords="电池" -->
#### 电池电压

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>电池电压</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示内容：电池电压</p></li>
<li><p>显示精度：0.1V</p></li>
<li><p>更新时间：1s±33.33ms (数据为更新显示前上一笔的有效数据)</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>电池电压信息- ECM_Battery_Voltage</p></li>
</ul>
<p>SC：</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_2</td>
<td>ECM_VBattery</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>BB：</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_DTC</td>
<td>ECM_VBattery</td>
<td>RX</td>
</tr>
</tbody>
</table>
<blockquote>
<p>物理单位：V</p>
</blockquote>
<ul>
<li><p>仪表要侦测电瓶电压，精度误差要求: ≦±0.2V</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><p>1、IGN ON 后，根据收到的报文显示电池电压。</p>
<p>2、低电压提醒： 暂按如下参数设定。</p>
<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 20%" />
<col style="width: 21%" />
<col style="width: 19%" />
<col style="width: 21%" />
</colgroup>
<tbody>
<tr class="odd">
<td>发动机状态</td>
<td>判定电压（v）</td>
<td>判定时间(s)</td>
<td>复归电压（V）</td>
<td>判定时间（S）</td>
</tr>
<tr class="even">
<td>静止</td>
<td>11.8</td>
<td>20</td>
<td>12.6</td>
<td>3</td>
</tr>
<tr class="odd">
<td>运行</td>
<td>12.5</td>
<td>10</td>
<td>13.2</td>
<td>3</td>
</tr>
</tbody>
</table>
<p>3、UI：</p>
<p>1）主页面的多功能区自动切换到电池电压显示画面，显示数字和“V”1Hz闪烁提醒。</p>
<p>2）或集成在弹窗内提醒，具体依照UI提示资料。</p>
<p>4、异常处理：</p>
<p>IGN ON
后未收到相关报文，按最大位数填入“-”（如果有小数点的机能，小数点也要显示）。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S039" type="display_metric" title="环境温度显示" keywords="温度" -->
#### 环境温度显示

<table>
<colgroup>
<col style="width: 18%" />
<col style="width: 81%" />
</colgroup>
<tbody>
<tr class="odd">
<td>项 目</td>
<td>式 样</td>
</tr>
<tr class="even">
<td><p>显示方式</p>
<p>数字字体</p>
<p>文字字体</p>
<p>显示范围</p>
<p>显示分辨率</p>
<p>显示单位</p>
<p>转换关系</p>
<p>输入信号</p>
<p>信号处理方法</p>
<p>显示更新周期</p>
<p>显示特性</p>
<p>超过范围的显示</p>
<p>结冰提示</p>
<p>IGN ON时的显示</p>
<p>异常判定值</p>
<p>异常检出及解除条件</p></td>
<td><p>数字2位、符号（-）、 °C /°F、 线框</p>
<p>最前位的“0”不显示</p>
<p>-20 ～+50°C ; -4 ～ +122ﾟF</p>
<table>
<colgroup>
<col style="width: 47%" />
<col style="width: 52%" />
</colgroup>
<tbody>
<tr class="odd">
<td>Lo</td>
<td>HI</td>
</tr>
<tr class="even">
<td><img src="media/image52.png"
style="width:0.62639in;height:0.34722in" /></td>
<td><img src="media/image53.png"
style="width:0.70417in;height:0.38194in" /></td>
</tr>
</tbody>
</table>
<p>1</p>
<p>°C 或 °F</p>
<p>°F=°C*1.8+32</p>
<p>输入信号A：RTC电阻。</p>
<p><img src="media/image54.png"
style="width:3.79097in;height:2.06111in" /></p>
<p>输入信号B：手机App</p>
<p>详见“1 DCJ豪爵 手机App &amp; 仪表 BLE数据协议V0.0”</p>
<p>优先级：暂定以获取到的较低的值数据值优先。</p>
<p>每0.5s 采样数据 (TEMPdate)，用10次的采样数据算出平均值</p>
<p>(TEMPave)再进行显示。</p>
<p>温度上升时：30 ± 0.5 s</p>
<p>温度下降时：5 ± 0.5 s</p>
<p><del>显示值的更新按照每个分辨率进行。</del></p>
<p><img src="media/image55.png"
style="width:3.94792in;height:1.05208in" /></p>
<ul>
<li><p>检测到 TEMPave 未达到 -20°C时，显示“ Lo ”。</p></li>
<li><p>检测到 TEMPave 超过了 +50°C时，显示“ HI ”。</p></li>
<li><p>检测到 TEMPave 的输入达到显示范围内时，立刻开始显示。</p></li>
<li><p>当环境温度低于3℃时，将显示结冰警告<img
src="media/image56.png"
style="width:0.65in;height:0.71806in" />，2Hz闪烁5秒后常显（即使达到解除条件也至少要闪烁显示完毕再解除）。</p></li>
</ul>
<p>(ISO 2575-2021)。如果出现结冰警告，表示路面湿滑危险增加。</p>
<ul>
<li><p>解除条件：当环境温度高于4℃时，将取消结冰警告显示。</p></li>
</ul>
<p>IGN ON时，显示为初次的 TEMPave 值。</p>
<p>IGN ON到 TEMPave 决定前显示为“- - ”。</p>
<p>出现下列输入时，判断为异常，显示警告。</p>
<p>·断线检出：33 k ± 4 k Ω以上</p>
<p>·短路检出：162 ± 20 Ω以下</p>
<p>·5±0.5 s内连续检测到断线或短路时，判断为异常。</p>
<p>·5±0.5 s内连续正常时解除。(结冰警告解除判定承制方可提供建议值)</p>
<p>·从断线/短路状态的输入开始到延迟时间结束为止，保持显示断线/短路前的状态。</p>
<p>·解除条件成立时，外气温显示由解除时的输入值开始显示。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S040" type="indicator" title="油压指示灯" keywords="指示灯" -->
#### 油压指示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>油压指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示动画：（按照效果图）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>油压开关：PIN 20</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td><ul>
<li><p>实车侧参考电路：</p></li>
<li><p><img src="media/image57.png"
style="width:6.18472in;height:2.82986in" /></p></li>
</ul>
<p>指示灯点亮工作电流≥4.5mA。</p></td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><ol type="1">
<li><p>当油压开关断开时，油压指示灯立即熄灭；</p></li>
<li><p>当油压开关接地时，油压指示灯延迟2±0.5s后点亮；</p></li>
</ol></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S041" type="indicator" title="位置灯" keywords="" -->
#### 位置灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>位置灯指示符</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>位置灯开关信号：PIN 10</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td><ul>
<li><p>实车侧参考电路：</p></li>
</ul>
<p><img src="media/image58.png"
style="width:2.15556in;height:1.66944in" /></p></td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>TFT画面 根据ILLUMI SW 状态进行动作：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 53%" />
<col style="width: 46%" />
</colgroup>
<tbody>
<tr class="odd">
<td>位置灯开关信号</td>
<td>LCD显示</td>
</tr>
<tr class="even">
<td>OFF</td>
<td>符号熄灭</td>
</tr>
<tr class="odd">
<td>ON</td>
<td>符号点亮</td>
</tr>
</tbody>
</table>
<p>注：当位置灯开关信号
状态为OFF时，任何时候（包含开机动画等）LCD都不能显示位置灯符号。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S042" type="indicator" title="远光指示灯" keywords="指示灯" -->
#### 远光指示灯

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>远光指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><p>蓝色</p>
<p>FMVSS NO.108（尺寸规定）：发光面积应大于等于直径3/16英寸的圆
※1英寸=2.54cm</p></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td>远光灯信号（HI_BEAM）：PIN 5</td>
</tr>
<tr class="even">
<td>实车侧电路</td>
<td><p>输入最大电压：15V</p>
<p>最大工作电流（13V）：典型工作电流10mA左右。</p>
<p>如在LCD内显示，电路需承制方单独提出讨论。</p></td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><img src="media/image60.wmf"
style="width:3.64028in;height:1.97986in" /></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S043" type="indicator" title="近光指示灯" keywords="指示灯" -->
#### 近光指示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>近光指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图，法规要求指示灯，UI形状没有限定，颜色为绿色。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x360</td>
<td>BCM_2</td>
<td>待定</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: OFF灭灯</p>
<p>0x1: 点亮</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><ol type="1">
<li><p>IGN ON后，根据接收到的报文显示</p></li>
<li><p>如未接收到CAN通信报文，仪表默认为不显示近光指示灯</p></li>
</ol></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S044" type="indicator" title="保养指示灯" keywords="指示灯,保养" -->
#### 保养指示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>保养指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>指示符形式（（按照效果图）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>总里程数据 &amp; 设定的阈值</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>动作内容：</p></li>
</ul>
<blockquote>
<p>1、当保养剩余里程≤0km 时，保养指示灯点灯。</p>
<p>2、保养指示灯点灯后，每次 IGN ON 开机后，保养指示灯闪烁
10S（1Hz，</p>
<p>50%DUTY）后保持点灯状态。 或集成在弹窗显示，具体按UI提示资料</p>
<p>3、可通过设置流程重置保养剩余里程，剩余里程＞0km 保养指示灯熄灭。</p>
</blockquote></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S045" type="indicator" title="换档转速提示灯&换挡转速提示功能启用符号" keywords="转速,换档" -->
#### 换档转速提示灯&换挡转速提示功能启用符号

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>换档提示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>LED灯:换档转速提示灯，参考为<img
src="media/image61.png"
style="width:0.38264in;height:0.36111in" />，非法规要求指示灯，UI形状和颜色没有限定。</p></li>
</ul>
<ul>
<li><p>TFT指示：换挡转速提示功能启用符号:非法规要求指示灯，企业习惯用<img
src="media/image21.png"
style="width:0.37153in;height:0.31389in" />表示。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>换档提示灯配置数据 &amp; 转速</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><ul>
<li><p>CAN数据帧—同转速。</p></li>
</ul>
<ul>
<li><p>换档提示灯动作流程：</p></li>
</ul>
<blockquote>
<p>当转速&gt;设定转速时，换档指示灯点亮/闪烁；</p>
<p>当转速≤设定转速时，换档指示灯熄灭。</p>
<p>建议中间设置缓冲带，避免频繁闪灭，具体以实车标定为准。</p>
</blockquote>
<ul>
<li><p>换档提示灯配置功能在设置页面中。</p></li>
<li><p>1-6档的每个档位都可以单独设置提示的转速值。</p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S046" type="section" title="边撑开关指示符" keywords="" -->
#### 边撑开关指示符

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>边撑开关指示符</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示（法规要求，边撑指示符不能遮档车速显示）</p></li>
<li><p>显示/切换动画：按照效果图，非法规要求指示灯，UI形状没有限定，颜色为黄色。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x134</td>
<td>ECM_1</td>
<td>ECM_Side</td>
<td><p>Stand_SW</p>
<p>RX</p></td>
</tr>
</tbody>
</table>
<p>0x0:边撑收起 🡪 边撑指示符点熄灭</p>
<p>0x1:边撑打下 🡪 边撑指示符点亮</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><ol start="3" type="1">
<li><p>IGN ON后，根据接收到的报文显示</p></li>
</ol></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S047" type="indicator" title="胎压警报指示灯" keywords="指示灯,胎压" -->
#### 胎压警报指示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>胎压警报指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内</p></li>
<li><p>指示符形式（按照效果图）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据帧—TPMS_OUT_1</p></li>
</ul>
<ul>
<li><p>TPMS 指示灯</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OUT_1</td>
<td>TPMS_Indicator</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>数据内容：（以下状态每次都会发送至少6s，然后才会切换至下一个状态，使仪表有充足的时间响应指示灯动作）</p>
<p>0x0：OFF灭灯</p>
<p>0x1：ON常亮</p>
<p>0x2：ON常亮</p>
<p>0x3：连续闪烁，闪烁频率：500ms ON→500ms OFF</p>
<p>0x4：连续闪烁，1s ON →1s OFF</p>
<p>0x5：闪烁ON 250ms→OFF 250ms，闪烁5次</p>
<p>（连续采集到2帧后，闪烁5次，然后熄灭）</p>
<p>0x6：连续闪烁，闪烁频率：100ms ON→100ms OFF</p>
<p>0x7：invalid ，收到此数据维持上一笔输入</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td>/</td>
</tr>
</tbody>
</table>

###

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>胎压/胎温显示</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内：按照效果图，各警报的显示按UI提示资料</p></li>
<li><p>显示单位：kPa（bar、psi）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据帧—TPMS_OUT_1</p></li>
</ul>
<ul>
<li><p>前轮胎压</p></li>
</ul>
<blockquote>
<p>前轮胎压</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OUT_1</td>
<td>Front_pressure</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>1、Offset ：0 精度：2 物理单位： kPa</p>
<p>0xFF
：初始值和无效值，收到该笔数据，按最大位数填入“-”（如果有小数点的机能，小数点也要显示）。</p>
<p>范例：收到0x7D =125 🡪 前轮胎压125×2=250kPa</p>
<blockquote>
<p>后轮胎压</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OUT_1</td>
<td>Rear_pressure</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>1、Offset ：0 精度2 物理单位： kPa</p>
<p>0xFF
：初始值和无效值，收到该笔数据，按最大位数填入“-”（如果有小数点的机能，小数点也要显示）。</p>
<p>范例：收到0x7D =125 🡪 后轮胎压125×2=250 kPa</p>
<ul>
<li><p>胎压警报</p></li>
</ul>
<blockquote>
<p>前轮胎压警报：</p>
</blockquote>
<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 27%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 12%" />
<col style="width: 9%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TP</td>
<td><p>S_OUT_1</p>
<p>Front_pressure_warning</p></td>
<td>RX</td>
<td>200</td>
<td><p>s</p>
<p>1 bit</p></td>
<td>49</td>
<td>0～0x1</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p>
<blockquote>
<p>后轮胎压警报：</p>
</blockquote>
<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 26%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 10%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OU</td>
<td><p>1</p>
<p>Rear_pressure</p></td>
<td><p>warning</p>
<p>RX</p></td>
<td>200ms</td>
<td>1</td>
<td><p>it</p>
<p>53</p></td>
<td>0～0x1</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p>
<ul>
<li><p>电压警报</p></li>
</ul>
<blockquote>
<p>前轮电压警报：</p>
</blockquote>
<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 24%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 9%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OUT_1</td>
<td>Fron</td>
<td><p>_voltage_warning</p>
<p>RX</p></td>
<td>200</td>
<td><p>s</p>
<p>1 bi</p></td>
<td>50</td>
<td>0～0x1</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p>
<blockquote>
<p>后轮低电压报警</p>
</blockquote>
<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 24%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x</td>
<td><p>50</p>
<p>TPMS_OUT_1</p></td>
<td>Rear_voltage_warning</td>
<td>RX</td>
<td>200ms</td>
<td>1 bit</td>
<td>54</td>
<td>0～0x1</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p>
<ul>
<li><p>传感器丢失报警</p></li>
</ul>
<blockquote>
<p>前轮传感器丢失报警：</p>
</blockquote>
<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 24%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OUT_1</td>
<td>Fr</td>
<td><p>nt_s</p>
<p>nsor_l</p>
<p>st</p>
<p>RX</p></td>
<td>200ms</td>
<td>1 b</td>
<td><p>t</p>
<p>51</p></td>
<td>0～0x1</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p>
<blockquote>
<p>后轮传感器丢失报警：</p>
</blockquote>
<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 24%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OU</td>
<td><p>_1</p>
<p>Rear_sensor_lost</p></td>
<td>RX</td>
<td>200ms</td>
<td>1 bit</td>
<td>55</td>
<td>0～0x1</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p>
<ul>
<li><p>传感器未配置：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 13%" />
<col style="width: 24%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPM</td>
<td><p>_OUT_1</p>
<p>Sensor_u</p></td>
<td><p>config_ warning</p>
<p>RX</p></td>
<td>200ms</td>
<td>1 bit</td>
<td>60</td>
<td>0～0x1</td>
</tr>
</tbody>
</table>
<p>1、0x0：已配置</p>
<p>2、0x1：未配置</p>
<p><strong>以下为胎温专项：（是否显示按UI资料）</strong></p>
<ul>
<li><p>胎温胎温</p></li>
</ul>
<blockquote>
<p>前轮胎温</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td></td>
<td><p>x350</p>
<p>TPMS_OUT_1</p></td>
<td>Front_t</td>
<td><p>mperature</p>
<p>RX</p></td>
</tr>
</tbody>
</table>
<p>1、Offset ：-50 精度：1 物理单位：℃</p>
<p>0xFF
：初始值和无效值，收到该笔数据，按最大位数填入“-”（如果有小数点的机能，小数点也要显示）。</p>
<blockquote>
<p>后轮胎温</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OUT_1</td>
<td>Rear_temperature</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>1、Offset ：-50 精度：1 物理单位：℃</p>
<p>0xFF
：初始值和无效值，收到该笔数据，按最大位数填入“-”（如果有小数点的机能，小数点也要显示）。</p>
<ul>
<li><p>胎温报警</p></li>
</ul>
<blockquote>
<p>前轮胎温报警</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 18%" />
<col style="width: 31%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TP</td>
<td><p>S_OUT_1</p>
<p>Front_temperature_warning</p></td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p>
<blockquote>
<p>后轮胎温报警</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 23%" />
<col style="width: 26%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x350</td>
<td>TPMS_OUT_1</td>
<td>Rear_temperature_warnin</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>1、0x0：报警解除</p>
<p>2、0x1：报警</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td>IGN ON后，按照接收的报文响应（具体显示按效果图）</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S048" type="section" title="故障代码显示" keywords="故障" -->
#### 故障代码显示

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>故障代码</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内(此功能仅在主页面时需要显示)</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN 数据帧-- DTC_Info</p></li>
</ul>
<blockquote>
<p>SC:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_2</td>
<td>DTC_Info</td>
<td>RX</td>
</tr>
<tr class="odd">
<td>0x340</td>
<td>ECM_2</td>
<td>DIAGMODE</td>
<td>RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_2</td>
<td>DIAGMODE_Result</td>
<td>RX</td>
</tr>
</tbody>
</table>
<blockquote>
<p>BB:</p>
</blockquote>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_DTC</td>
<td>DTC_Info</td>
<td>RX</td>
</tr>
<tr class="odd">
<td>0x340</td>
<td>ECM</td>
<td><p>DTC</p>
<p>DIAGMODE</p></td>
<td>RX</td>
</tr>
<tr class="even">
<td>0x340</td>
<td>ECM_DTC</td>
<td>DIAGMODE_Result</td>
<td>RX</td>
</tr>
</tbody>
</table>
<ul>
<li><p>CAN 数据帧—DIAGMODE，参考OBD 指示灯。</p></li>
<li><p>CAN 数据帧-- ECM_MIL_IND，参考OBD 指示灯。</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td><ul>
<li><p>故障显示模式 DIAGMODE 转化规则如下：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 48%" />
</colgroup>
<tbody>
<tr class="odd">
<td colspan="2">DIAGMODE</td>
<td>LCD display</td>
</tr>
<tr class="even">
<td>0</td>
<td>1</td>
<td>C</td>
</tr>
<tr class="odd">
<td>1</td>
<td>0</td>
<td>H</td>
</tr>
</tbody>
</table>
<ul>
<li><p>故障代码DTC_Info 转化规则如下：</p></li>
</ul>
<p><img src="media/image63.wmf"
style="width:5.97153in;height:1.90833in" /></p>
<ul>
<li><p>LCD显示示例：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 27%" />
<col style="width: 41%" />
<col style="width: 30%" />
</colgroup>
<tbody>
<tr class="odd">
<td>DTC_Info</td>
<td>DIAGMODE</td>
<td>LCD 显示</td>
</tr>
<tr class="even">
<td>0x123400</td>
<td>0x2</td>
<td>P123400H</td>
</tr>
<tr class="odd">
<td>0</td>
<td><p>923</p>
<p>00</p>
<p>0x1</p></td>
<td>B123400C</td>
</tr>
<tr class="even">
<td>0x523</td>
<td><p>00</p>
<p>0x2</p></td>
<td>C123400H</td>
</tr>
<tr class="odd">
<td></td>
<td><p>xD23400</p>
<p>0x1</p></td>
<td>U123400C</td>
</tr>
</tbody>
</table>
<p>注：故障代码 DTC_Info 发送初始值 0X0 时代表无故障，仪表 LCD
不显示故障代码，维持正常显示。</p></td>
</tr>
<tr class="odd">
<td>输入及响应</td>
<td><p>IGN ON后根据输入进行显示，显示规则如下：</p>
<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 17%" />
<col style="width: 15%" />
<col style="width: 14%" />
<col style="width: 15%" />
<col style="width: 20%" />
</colgroup>
<tbody>
<tr class="odd">
<td>故障显示模式<br />
DIAGMODE</td>
<td>MIL灯状态<br />
ECM_MIL_IND</td>
<td><em><strong>MIL灯动作</strong></em></td>
<td>DIAGMODE_Result故障操作结果</td>
<td>故障代码<br />
DTC_Info</td>
<td><em><strong>LCD显示</strong></em></td>
</tr>
<tr class="even">
<td rowspan="3">0x0:User mode<br />
用户模式</td>
<td>0x0: 指示灯OFF</td>
<td>OFF</td>
<td rowspan="3">该模式下忽略此信息，不做任何处理</td>
<td rowspan="3">忽略此信息，不做任何处理</td>
<td rowspan="3">不显示故障代码</td>
</tr>
<tr class="odd">
<td>0x1: 指示灯</td>
<td><p>N</p>
<p>常亮不闪烁</p></td>
</tr>
<tr class="even">
<td>0x2: 指示灯闪烁</td>
<td>闪烁:ON 0.5s、OFF 0.5s</td>
</tr>
<tr class="odd">
<td rowspan="3">0x1:Current DTC mode<br />
现在故障模式</td>
<td>0x0: 指示灯OFF</td>
<td>OFF</td>
<td rowspan="3">该模式下忽略此信息，不做任何处理</td>
<td>忽略此信息，不做任何处理</td>
<td>不显示故障代码</td>
</tr>
<tr class="even">
<td>0x1: 指示灯ON</td>
<td>常亮不闪烁</td>
<td>接收ECM故障代码</td>
<td><em><strong>显示故障代码</strong></em></td>
</tr>
<tr class="odd">
<td>0x2: 指示灯闪烁</td>
<td>OFF，<br />
该模式下忽略此信息</td>
<td>忽略此信息，不做任何处理</td>
<td>不显示故障代码</td>
</tr>
<tr class="even">
<td rowspan="3">0x2:History DTC mode<br />
过去故障模式</td>
<td>0x0: 指示灯O</td>
<td><p>F</p>
<p>OFF</p></td>
<td rowspan="3">该模式下忽略此信息，不做任何处理</td>
<td>忽略此信息，不做任何处理</td>
<td>不显示故障代码</td>
</tr>
<tr class="odd">
<td>0x1: 指示灯ON</td>
<td>常亮不闪烁</td>
<td>接收ECM故障代码</td>
<td><em><strong>显示故障代码</strong></em></td>
</tr>
<tr class="even">
<td>0x2: 指示灯闪烁</td>
<td>OFF，<br />
该模式下忽略此信息</td>
<td>忽略此信息，不做任何处理</td>
<td>不显示故障代码</td>
</tr>
<tr class="odd">
<td rowspan="3">0x3:Learning Value clear mode<br />
学习值清除模式</td>
<td>0x0: 指示灯OFF</td>
<td rowspan="3">OFF</td>
<td rowspan="3">1.0x0: 初始值<br />
2.0x1: 清除成功</td>
<td rowspan="3">忽略此信息，不做任何处理</td>
<td rowspan="3">1. 收到DIAGMODE_Result =
0x0或0x01长里程都不显示Clr；<br />
<br />
2. 只有收到DIAGMODE_Result 0x0--&gt;0x1时，才显示"Clr" ，ON 0.5s，OFF
0.5s，只闪烁3次后恢复原显示内容</td>
</tr>
<tr class="even">
<td>0x1: 指示灯ON</td>
</tr>
<tr class="odd">
<td>0x2: 指示灯闪烁</td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S049" type="section" title="加热手把" keywords="加热" -->
#### 加热手把

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2"></th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>加热手把档、故障报警</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示(按照效果图)</p></li>
<li><p>显示动画：按照效果图（加热手把符号/加热档/报警信息）</p></li>
<li><p>显示范围：1∽5加热档</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>BCM加热手把档CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x180</td>
<td>BCM_1</td>
<td>BCM_HeatedHandleLevel</td>
<td>RX</td>
</tr>
</tbody>
</table>
<table>
<colgroup>
<col style="width: 41%" />
<col style="width: 58%" />
</colgroup>
<tbody>
<tr class="odd">
<td>仪表接收到CAN信息</td>
<td>仪表指示</td>
</tr>
<tr class="even">
<td>0x0: OFF</td>
<td>不显示加热手把的任何信息</td>
</tr>
<tr class="odd">
<td>0x1: Level 1</td>
<td>显示1档</td>
</tr>
<tr class="even">
<td>0x2: Level 2</td>
<td>显示2档</td>
</tr>
<tr class="odd">
<td>0x3: Level 3</td>
<td>显示3档，例如 <img src="media/image64.png"
style="width:0.49722in;height:0.46042in" />，具体依照UI</td>
</tr>
<tr class="even">
<td>0x4: Level 4</td>
<td>显示4档</td>
</tr>
<tr class="odd">
<td>0x5: Level 5</td>
<td>显示5档</td>
</tr>
<tr class="even">
<td><p>0x6: HeatedHandle fault</p>
<p>加热手把故障</p></td>
<td><p>加热手把符号保持1Hz点灭闪烁；</p>
<p>同时档位数字改为空白。</p></td>
</tr>
<tr class="odd">
<td>0x7: Reserved</td>
<td>以收到最近一笔有效数据显示</td>
</tr>
</tbody>
</table></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>网路和数据异常显示</td>
<td><ol type="1">
<li><p>IGN ON后，仪表根据根据接收到的报文显示</p></li>
<li><p>BCM_1数据能正常收到下，CAN
数据控制的加热档连续收到两帧相同的数据、加热手把故障数据可判断为有效，方可切换加热档显示（示例：仪表需连续收到两帧以上
BCM_HeatedHandleLevel: 0x1，加热手把切换为加热1档显示）</p></li>
</ol>
<p>3、通信异常(参考 CAN 总线协议中关于通信异常的节点丢失 loss
communication、DLC≠8、BUS OFF
等具体要求)时，UI通信异常（图标下的数字显示“-”）。</p>
<p>注意:
侦测到加热手把故障、通信异常可合并为0x6加热手把故障显示，显示方式相同</p></td>
</tr>
<tr class="even">
<td>功能配置开关</td>
<td><p>1、功能配置开关定义在诊断调查问券Read &amp; Write DID</p>
<p>2、功能配置打开可显示加热手把、加热档、故障时显示</p>
<p>3、功能配置关闭不显示加热手把关联功能</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S050" type="vehicle_feature" title="骑行模式" keywords="骑行" -->
#### 骑行模式

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>骑行模式</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内</p></li>
<li><p>显示动画：按照效果图</p></li>
<li><p>显示范围：运动(Sport或A)、城市(Road或B)、雨天(Rain或C)</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>输入信号</p>
<p>操控逻辑</p>
<p>其他说明</p>
<p>DCJ提供参考样例</p></td>
<td><ul>
<li><p><strong>仪表主动切换骑行模式状态过程（用户通过手把开关操控仪表）</strong></p></li>
</ul>
<p>在主页面下，双击<img
src="media/image65.png"
style="width:0.70764in;height:0.55139in" />按键，启用骑行模式切换功能（UI需做提示，例如原骑行模式的底色发生变化），按
<img src="media/image66.png"
style="width:0.51528in;height:0.32778in" />或<img
src="media/image67.png"
style="width:0.49931in;height:0.31458in" />选择骑行模式（按键短按松开时，UI画面骑行模式开始切换，长按松开后骑行模式不变）
，选定后双击<img src="media/image65.png"
style="width:0.51042in;height:0.39722in" />退出切换模式（UI需做退出模式提示）。</p>
<blockquote>
<p>A：运动 → B：街道 → C：雨天，此时再按下键则按以下顺序切换：</p>
<p>A：运动 ← B：街道 ← C：雨天，按上键按相反顺序切换</p>
</blockquote>
<p><img src="media/image68.wmf" /></p>
<p>注：</p>
<p>1、当UI显示响应超时提示时，按键操作无效。</p>
<p>2、仪表发送处切换数据后等待关联系统响应的330ms，如果再按一次按键，仪表不用重发数据（以避免显示慢，用户反复操作按键）。</p>
<p>3、为防止连按，仪表40ms内按一次按键判定。</p>
<p>4、进入选择模式后，按切换键后，仪表立即发出模式切换数据请求，原骑行模式保持显示，要等到ECM&amp;ABS响应执行后才能切换到按键切换想要的骑行模式。</p>
<p>5、进入选择模式后，按切换键后，仪表立即发出模式切换数据请求，原骑行模式保持显示，收到ECM&amp;ABS响应不能执行后，当前显示的骑行模式1s内闪烁3次。</p>
<p>6、进入选择模式后，即使有车速也不退出。</p>
<ul>
<li><p>手把按键输入:OK、BACK、UP▲、DOWN ▼</p></li>
</ul>
<p>1. 仪表检测到双击<img
src="media/image65.png"
style="width:0.51042in;height:0.39722in" />按键后，进入骑行模式操作启用状态。</p>
<p>(UI设计为当前显示的骑行模式的底色发生明显变化，例如A变为蓝底色)</p>
<p>2. 操作 UP▲或DOWN
▼按键后仪表输出骑行模式数据给ECM、ABS，是否允许切换由ECM、ABS判断，ECM和ABS会输出系统当前是否处于允许切换的permission数据和骑行模式反馈数据。</p>
<p>3. ABS接收仪表数据，ABS接收后输出：</p>
<p>ABS_MTC_ModeChangePermission &amp; ABS_DASH_Drive_Mode_Rsp</p>
<p>4.ECM接收仪表数据，ECM接收后输出：</p>
<p>Power Mode Change Permission &amp; ECM_Dash_Drive_Mode_Ack</p>
<p>5.仪表显示骑行模式切换成功条件：</p>
<p>ABS_MTC_ModeChangePermission = 0x1 &amp; Power Mode Change Permission
=0x1，</p>
<p>ABS_DASH_Drive_Mode_Rsp &amp;
ECM_Dash_Drive_Mode_Ack和仪表输出骑行模式的</p>
<p>数据相同，显示切换成功(UI设计)。</p>
<p>否则显示切换失败并保持在原来骑行模和CAN通信数据输出。（UI：当前显示模式1秒内闪烁3次后恢复当前显示）。5.切换失败仪表UI提示异常，维持在原来显示模式。</p>
<p>6.仪表发送请求如果ECM或
ABS任一电控单元330ms内超时不响应，仪表UI提示异常，维持在原来显示模式（UI：当前显示模式1秒内闪烁3次后恢复当前显示）。</p>
<p>7.IGN ON开机动画完成后，仪表监测到 ECM_Dash_Drive_Mode_Ack 或ABS
ABS_DASH_Drive_Mode_Rsp与仪表要求的不一致，当前模式保持闪烁1Hz。建议每200ms监测一次，维持5次判定成立后实施。</p>
<p>8.初始模式：仪表初次上电工作，默认输出为标准Road模式数据（MTR_DriveModeSet、MTR_DriveModeSetECM发送初始值（ROAD））。</p>
<p>9.记忆骑行模式： IGN
OFF（电门锁关闭）后仪表记忆骑行模式数据，例如</p>
<p>IGN ON→OFF前，仪表显示的是运动(Sport)模式，OFF后仪表记忆此模式。</p>
<p>当下次IGN
OFF→ON后仪表输出骑行模式为上次记忆的运动(Sport)模式报文；</p>
<p>10.仪表IGN OFF→ON后即发送骑行模式数据。</p>
<p>到开机动画完成时，如果接收到ABS和电喷ECM返回的响应与请求一致，则开机动画完成后界面显示对应的骑行模式;</p>
<p>否则开机动画完成后上次的显示模式提示异常后显示默认模式</p>
<p>(非road模式：开解动画完成后1s内闪烁3次后切换到ROAD显示；</p>
<p>ROAD模式：不闪烁，直接显示ROAD即可)，</p>
<p>MTR_DriveModeSet和MTR_DriveModeSetECM发送默认模式ROAD请求值。</p>
<p><img src="media/image69.wmf" /><img
src="media/image70.wmf" /></p>
<p>11.IGN OFF→ON后仪表输出IGN
OFF关机前的骑行模式报文，但是TC等级应根据此骑行模式的应有等级来显示和输出报文。</p>
<p>12.开机动画期间，MODE按键不需响应。 ABS &amp;
ECM在接收到仪表输出运动(Sport)模式报文后再依仪表模式数据切换。</p>
<p>13.骑行模式切换成功后200ms内可以响应再一次的骑行模式切换。</p>
<p>14.行驶过程中，如果ECM&amp;ABS不能按照仪表发送的Mode状态执行（例如Mode系统零件有故障），那么仪表应按ECM&amp;ABS发送的报文做出相应的警告提示。</p>
<p>15.不同骑行模式需根据下表进行发送不同请求信号值：</p>
<table>
<colgroup>
<col style="width: 22%" />
<col style="width: 48%" />
<col style="width: 29%" />
</colgroup>
<tbody>
<tr class="odd">
<td>骑行模式</td>
<td>MTR_DriveModeSet</td>
<td>MTR_DriveModeSetECM</td>
</tr>
<tr class="even">
<td>运动(Sport)</td>
<td>0</td>
<td>0</td>
</tr>
<tr class="odd">
<td>城市(Road)</td>
<td>1</td>
<td>1</td>
</tr>
<tr class="even">
<td>雨天(Rain)</td>
<td>2</td>
<td>2</td>
</tr>
<tr class="odd">
<td>TCS OFF</td>
<td>3</td>
<td>N/A</td>
</tr>
</tbody>
</table>
<p>举例说明：</p>
<p>当需切换到城市(Road)模式时，MTR_DriveModeSet和MTR_DriveModeSetECM需同时发送值1。</p>
<p>当切换到TCS OFF时，MTR_DriveModeSet
发送值3，MTR_DriveModeSetECM保持不变。</p>
<p><del>R</del>行模式按键时，忽略请求,不执行任何动作。 况：TCS 在IGN
OFF前设置为关闭状态时，按如下：</p>
<ul>
<li><p>DCJ提供参考样例</p></li>
</ul>
<p>各种骑行模式对应的MTR_DriveModeSet及MTR_DriveModeSetECM发送值如下,下表中的值可配置：</p>
<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 13%" />
<col style="width: 14%" />
<col style="width: 20%" />
<col style="width: 35%" />
</colgroup>
<tbody>
<tr class="odd">
<td>RMTable index</td>
<td>状态图名称</td>
<td>界面显示名称</td>
<td>MTR_DriveModeSet值</td>
<td>MTR_DriveModeSetECM值</td>
</tr>
<tr class="even">
<td>0</td>
<td>Mode0</td>
<td>SPORT</td>
<td>0</td>
<td>0</td>
</tr>
<tr class="odd">
<td>1</td>
<td>Mode1</td>
<td>Standard</td>
<td>1</td>
<td>1</td>
</tr>
<tr class="even">
<td>2</td>
<td>Mode2</td>
<td>RAIN</td>
<td>2</td>
<td>2</td>
</tr>
</tbody>
</table>
<p>其中，界面显示名称、MTR_DriveModeSet及MTR_DriveModeSetECM会在项目开发过程中更改。</p>
<ul>
<li><p>通用需求</p></li>
</ul>
<p>骑行模式切换等待ABS和ECM响应超时时间为TwaitAck为330ms。</p>
<p>modeReq 默认值为0；</p>
<p>当检测到Up按键时，modeReq = 1(up);</p>
<p>当检测到down按键时，modeReq = 2 (down);</p>
<p>当检测到OK按键被按下时，</p>
<p>如果bIsModeSelected = 0，则设置bIsModeSelected =
1并界面提示骑行模式被选中；</p>
<p>如果bIsModeSelected = 1，则设置bIsModeSelected =
0并界面取消骑行模式被选中。</p>
<p>对于接收到的报文，仪表只有连续接收到相同俩帧信号值时，才判断为有效。</p>
<p>周期检测以下条件，如果所有条件同时满足，设置ModeChangePermission =
1；否则设置ModeChangePermission = 0：</p>
<p>ABS_MTC_ModeChangePermission = 1</p>
<p>AND ECM_PowerModeChangePermission = 1</p>
<p>以骑行模式任务执行周期检测，满足以下条件时设置 bECURespConsist
=1，否则设置 bECURespConsist = 0：</p>
<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 6%" />
<col style="width: 6%" />
<col style="width: 78%" />
</colgroup>
<tbody>
<tr class="odd">
<td rowspan="4">&amp;&amp;</td>
<td colspan="3">ECM_Dash_Drive_Mode_Ack == MTR_DriveModeSetECM</td>
</tr>
<tr class="even">
<td rowspan="3">||</td>
<td colspan="2">ABS_DASH_Drive_Mode_Rsp == MTR_DriveModeSet</td>
</tr>
<tr class="odd">
<td rowspan="2">&amp;&amp;</td>
<td>TCSOffFlag == 1</td>
</tr>
<tr class="even">
<td>ABS_DASH_Drive_Mode_Rsp == TCSOFFValue</td>
</tr>
</tbody>
</table>
<ul>
<li><p>状态转换示意图：</p></li>
</ul>
<blockquote>
<p><img src="media/image71.wmf"
style="width:5.62222in;height:3.55625in" /></p>
</blockquote>
<table style="width:100%;">
<colgroup>
<col style="width: 14%" />
<col style="width: 30%" />
<col style="width: 31%" />
<col style="width: 11%" />
<col style="width: 12%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>参数名称</strong></td>
<td><strong>描述</strong></td>
<td><strong>值描述</strong></td>
<td><strong>默认值</strong></td>
<td><strong>存储类型</strong></td>
</tr>
<tr class="even">
<td>RideMode</td>
<td><p>设置成功的骑行模式，用于记忆上次使用的骑行模式</p>
<p>（默认为standard 模式）</p></td>
<td><p>0x0: sport mode</p>
<p>0x1: standard mode (default mode)<br />
0x2: rain mode</p></td>
<td>0</td>
<td>EEPROM?</td>
</tr>
<tr class="odd">
<td>modeReq</td>
<td>骑行模式按键信号</td>
<td><p>0：Not Pressed</p>
<p>1：Pressed</p></td>
<td>0</td>
<td>RAM</td>
</tr>
<tr class="even">
<td>ModeChangePermission</td>
<td>骑行模式运行切换条件</td>
<td><p>0：mode change is not allowed</p>
<p>1：mode change is allowed</p></td>
<td>0</td>
<td>RAM</td>
</tr>
<tr class="odd">
<td>TCSOffFlag</td>
<td>TCS OFF 标志</td>
<td><p>0：TCS ON is selected</p>
<p>1：TCS OFF is selected</p></td>
<td>0</td>
<td>RAM</td>
</tr>
<tr class="even">
<td>TCSOFFValue</td>
<td>TCS OFF 时CAN信号MTR_DriveModeSet 信号值</td>
<td>3：TCS OFF</td>
<td>3</td>
<td>ROM</td>
</tr>
<tr class="odd">
<td>bECURespConsist</td>
<td>各ECU响应正确时的响应标志</td>
<td><p>0：NG</p>
<p>1：OK</p></td>
<td>0</td>
<td>RAM</td>
</tr>
</tbody>
</table>
<ul>
<li><p>各详细条件请查看如下说明（参考）:</p></li>
</ul>
<p>Tr0：</p>
<p>条件：</p>
<p>IG OFF ==&gt; ON</p>
<p>执行：</p>
<p>bIsModeSelected = 0</p>
<p>modeReq = 0</p>
<p>切换至Init状态</p>
<p>从EEPROM中获取RideMode的值。此动作可在上电初始化等地方执行。</p>
<p>如果 RideMode &gt;2，则RideMode = 1。 (
RideMode异常时，恢复默认模式)</p>
<p>Note：IG ON后首次切换完骑行模式前，不响应按键信号。</p>
<p>Tr1：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;ModeChangePermission != 1</p>
<p>&amp;&amp;开机动画预完成</p>
<p>执行：</p>
<p>RideMode = 1（standard mode）</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}提示切换条件不满足</p>
<p>切换界面至Mode1模式</p>
<p>Tr3：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;ModeChangePermission == 1</p>
<p>执行：</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>切换至WaitAck状态并开启TwaitAck定时器</p>
<p>Tr4：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;( (&amp;&amp; bIsModeSelected == 0</p>
<p>&amp;&amp; modeReq == 0 (IG ON后首次进行模式切换)</p>
<p>&amp;&amp; TwaitAck超时 )</p>
<p>)</p>
<p>)</p>
<p>执行：</p>
<p>RideMode = 1 (standard mode)</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>设置错误提示</p>
<p>切换至Error状态</p>
<p>Note：IG ON后首次切换完骑行模式前，不响应按键信号。</p>
<p>Tr5：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; bIsModeSelected == 1</p>
<p>&amp;&amp; ( (modeReq == 1) || (modeReq == 2) )</p>
<p>&amp;&amp;TwaitAck超时（也包括切换条件不允许的情况）</p>
<p>执行：</p>
<p>按顺序执行以下判断条件：</p>
<p>If (modeReq == 1),则执行 RideMode = RideMode +1</p>
<p>Else if (modeReq == 2), 则执行 RideMode = RideMode -1</p>
<p>If ( (RideMode &gt; 2) || (RideMode &lt; 0) )，则执行 RideMode = 1
(异常状态，恢复默认模式)</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>设置错误提示</p>
<p>切换至Error状态</p>
<p>Tr6：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; RideMode == 0</p>
<p>执行：</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>切换界面至Mode0模式</p>
<p>切换至Mode0状态</p>
<p>modeReq = 0</p>
<p>Tr7：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; RideMode == 1</p>
<p>执行：</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>切换界面至Mode1模式</p>
<p>切换至Mode1状态</p>
<p>modeReq = 0</p>
<p>Tr8：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; RideMode == 2</p>
<p>执行：</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>切换界面至Mode2模式</p>
<p>切换至Mode2状态</p>
<p>modeReq = 0</p>
<p>Tr10：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;( bIsModeSelected == 1)</p>
<p>&amp;&amp; ( modeReq ==2)（检测到短按down按键）</p>
<p>&amp;&amp; ModeChangePermission == 1</p>
<p>执行：</p>
<p>RideMode = RideMode +1</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>切换至WaitACK状态并开启TwaitAck定时器</p>
<p>Tr11：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; bECURespConsist ==1</p>
<p>&amp;&amp; RideMode == 0</p>
<p>&amp;&amp;ModeChangePermission == 1</p>
<p>执行：</p>
<p>取消TwaitAck定时器</p>
<p>切换界面至Mode0模式</p>
<p>切换至Mode0状态</p>
<p>modeReq = 0</p>
<p>Tr12：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;(bIsModeSelected ==1)</p>
<p>&amp;&amp;(( modeReq ==1) ||( modeReq ==2))（检测到短按up or
down按键）</p>
<p>&amp;&amp;ModeChangePermission != 1</p>
<p>执行：</p>
<p>modeReq = 0</p>
<p>提示切换条件不满足</p>
<p>Tr13：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;(bIsModeSelected ==1)</p>
<p>&amp;&amp;(( modeReq ==1) ||( modeReq ==2))（检测到短按up or
down按键）</p>
<p>&amp;&amp;ModeChangePermission == 1</p>
<p>执行：</p>
<p>if(modeReq == 1) RideMode = RideMode -1</p>
<p>if(modeReq == 2) RideMode = RideMode +1</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>切换至WaitACK状态并开启TwaitAck定时器</p>
<p>Tr14：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; bECURespConsist == 1 &amp;&amp; RideMode == 1</p>
<p>&amp;&amp;ModeChangePermission == 1</p>
<p>执行：</p>
<p>取消TwaitAck定时器</p>
<p>切换界面至Mode1模式</p>
<p>切换至Mode1状态</p>
<p>modeReq = 0</p>
<p>Tr15：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;(bIsModeSelected ==1)</p>
<p>&amp;&amp;(( modeReq ==1) ||( modeReq ==2))（检测到短按up or
down按键）</p>
<p>&amp;&amp;ModeChangePermission != 1</p>
<p>执行：</p>
<p>提示切换条件不满足</p>
<p>modeReq = 0</p>
<p>Tr16：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;(bIsModeSelected ==1)</p>
<p>&amp;&amp;( modeReq ==1)（检测短按up按键）</p>
<p>&amp;&amp;ModeChangePermission == 1</p>
<p>执行：</p>
<p>RideMode = RideMode – 1</p>
<p>MTR_DriveModeSetECM = RMTable[RideMode][1]</p>
<p>If(TCSOffFlag == 0)</p>
<p>{</p>
<p>MTR_DriveModeSet = RMTable[RideMode][0]</p>
<p>}</p>
<p>Else</p>
<p>{</p>
<p>MTR_DriveModeSet = TCSOFFValue</p>
<p>}</p>
<p>切换至WaitACK状态并开启TwaitAck定时器</p>
<p>Tr17：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; bECURespConsist == 1</p>
<p>&amp;&amp; RideMode == 2</p>
<p>&amp;&amp;ModeChangePermission == 1</p>
<p>执行：</p>
<p>取消TwaitAck定时器</p>
<p>切换界面至Mode2模式</p>
<p>切换至Mode2状态</p>
<p>modeReq = 0</p>
<p>Tr18：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp;(bIsModeSelected ==1)</p>
<p>&amp;&amp;(( modeReq ==1) ||( modeReq ==2))（检测到短按up or
down按键）</p>
<p>&amp;&amp;ModeChangePermission != 1</p>
<p>执行：</p>
<p>modeReq = 0</p>
<p>提示切换条件不满足</p>
<p>Tr21：</p>
<p>条件：</p>
<p>IG ON</p>
<p>&amp;&amp; (ECM_system_unavailable_failure ==0)</p>
<p>执行：</p>
<p>bIsModeSelected = 0</p>
<p>modeReq = 0</p>
<p>切换至Init状态</p>
<p>如果 RideMode &gt;2，则RideMode = 1。 (
RideMode异常时，恢复默认模式)</p>
<p>Tr22：</p>
<p>条件：</p>
<p>IG OFF</p>
<p>|| ECM_system_unavailable_failure ==1</p>
<p>|| ECM节点丢失</p>
<p>|| ABS节点丢失</p>
<p>|| BusOFF</p>
<p>执行：</p>
<p>取消TwaitAck定时器</p>
<p>切换至Deinit状态</p>
<p>modeReq = 0</p>
<p>if( (ECM_system_unavalb_failure == 1) &amp;&amp; (IG ON))</p>
<p>{</p>
<p>UI提示出现影响骑行故障（例如骑行模式和TC显示空白）；</p>
<p>}</p>
<p>注意事项：优先级为Tr11 &gt; Tr14 &gt; Tr17 &gt; Tr4 &gt; Tr5</p></td>
</tr>
</tbody>
</table>

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<tbody>
<tr class="odd">
<td>输入响应、操控逻辑</td>
<td><ol type="1">
<li><p>IGN ON后根据输入进行显示。</p></li>
</ol>
<p>仪表输出CAN报文</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x320</td>
<td>MTR_Out_1</td>
<td>MTR_DriveModeSet</td>
<td>TX</td>
</tr>
<tr class="odd">
<td>0x320</td>
<td>MTR_Out_1</td>
<td>MTR_DriveModeSetECM</td>
<td>TX</td>
</tr>
</tbody>
</table>
<p>0x0: sport mode</p>
<p>0x1: road mode (default)</p>
<p>0x2: rain mode</p>
<p>0x3: OFF</p>
<p>0x4～0x7: Reserved</p>
<p>MTR_DriveModeSetECM，输出给ECM做动力等级输出</p>
<p>0x0: sport mode</p>
<p>0x1: road mode (default)</p>
<p>0x2: rain mode</p>
<p>0x3～0x7: ReservediveModeSet，输出给ABS做TCS介入程度</p>
<blockquote>
<p>ABS输出CAN报文</p>
</blockquote>
<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 18%" />
<col style="width: 30%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x12F</td>
<td>ABS_2</td>
<td>ABS_DASH_Drive_Mode_Rsp</td>
<td>RX</td>
</tr>
<tr class="odd">
<td>0x12F</td>
<td>ABS_2</td>
<td>ABS_MTC_ModeChangePermission</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>ABS_DASH_Drive_Mode_Rsp, 输出给仪表当前骑行模式</p>
<p>0x0: sport mode</p>
<p>0x1: road mode (default)</p>
<p>0x2: rain mode</p>
<p>0x3: OFF</p>
<p>0x4～0x7: Reserved</p>
<p>ABS_MTC_ModeChangePermission, 输出系统当前是否处于允许切换状态。</p>
<p>0x0: MTC/DTC mode change is not allowed</p>
<p>0x1: MTC/DTC mode change is allowed</p>
<ul>
<li><p>ECM 输出CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 18%" />
<col style="width: 31%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x135</td>
<td>ECM_2</td>
<td>ECM_Dash_Drive_Mode_Ack</td>
<td>RX</td>
</tr>
<tr class="odd">
<td>0x135</td>
<td>ECM_2</td>
<td>ECM_PowerModeChangePermission</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>ECM_Dash_Drive_Mode_Ack, 输出给仪表当前骑行模式</p>
<p>0x0: sport mode</p>
<p>0x1: road mode (default)</p>
<p>0x2: rain mode</p>
<p>0x3～0x7: Reserved</p>
<p>Power Mode Change Permission,输出系统当前是否处于允许切换状态。</p>
<p>0x0: Power mode change is not allowed</p>
<p>0x1: Power mode change is allowed</p>
<ul>
<li><p>异常处理:</p></li>
</ul>
<ol type="1">
<li><p>通信异常(参考CAN总线协议中关于通信异常的节点丢失loss
communication、DLC≠8、BUS
OFF等具体要求)时（UI要提示骑行模式变成空白或空白框，表示不能选择）</p></li>
</ol>
<blockquote>
<p>异常又恢复正常时，仪表应该恢复正常显示。</p>
</blockquote>
<p>2、仪表接收到ECM、ABS输出允许切换permission但模式数据和仪表不同，以骑行模式切换失败显示，之后保持原来模式</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S051" type="vehicle_feature" title="快速换档QS" keywords="换档" -->
#### 快速换档QS

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2"></th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td><ul>
<li><p>TFT屏内主页面显示(按照效果图)</p></li>
<li><p>显示动画：开启、关闭、异常提示。按照效果图</p></li>
<li><p>进入QS选择模式需UI提示（例如底色发生变化）</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入信号</td>
<td><ul>
<li><p>ECM快速换档功能打开/关闭CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x135</td>
<td>ECM_2</td>
<td>ECM_QickShifSts</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: 快速换档功能关闭OFF</p>
<p>0x1: 快速换档功能打开ON</p>
<ul>
<li><p>ECM快速换挡系统不可用故障报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x135</td>
<td>ECM_2</td>
<td>ECM_QSUnavalb_failure</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: Normal</p>
<p>0x1: Failure</p>
<p>接到0x1:
Failure时仪表显示空白【如果此时恰好在执行收到ECM响应不能执行后，当前显示的状态闪烁三次（1s内）时，待执行完毕后再显示空白】。</p>
<ul>
<li><p>MTR快速换档功能打开/关闭CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x321</td>
<td>MTR_Out_ 3</td>
<td>MTR_QickShifSet</td>
<td>TX</td>
</tr>
</tbody>
</table>
<p>0x0: Disable</p>
<p>0x1: Enable</p>
<p>ECM_QickShifSts:
0x1快速换档功能打开,快速换档”QS”符号+”ON”符号显示</p></td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><ul>
<li><p>快速换档开关，进入主页面内快速换档的开启/关闭设置。</p></li>
<li><p>仪表不设限制条件，骑乘期间可进入</p></li>
</ul>
<p>1.仪表依手把开关输入切换打开、关闭功能，输出MTR_QickShifSet数据</p>
<blockquote>
<p>2.ECM收到MTR_QickShifSet切换ECM_QickShifSts数据，如ECM判断不可切换则维持原来打开/关闭数据，仪表输出MTR_QickShifSet后达330ms秒侦测到ECM_QickShifSts未切换，则闪烁显示(表示切换失败，需要设计UI)</p>
</blockquote>
<ul>
<li><p>IGN
OFF（电门锁关闭）后仪表记忆骑行请示QS开启/关闭数据，例如：</p></li>
</ul>
<p>1.IGN ON→OFF时，仪表显示的是QS关闭。</p>
<p>2.IGN OFF→ON后仪表输出QS关闭报文；</p>
<p>3.IGN OFF→ON后ECM在接收到仪表输出QS关闭报文后再依仪表数据切换。</p>
<p>4.仪表在330ms内收到ECM切换为QS关闭报文后，自检动画完成后，QS关闭UI。</p>
<p>5.仪表在330ms内收到ECM报文为非QS关闭（与仪表请求的模式不一致）报文后，自检动画完成后，仪表UI提示异常。</p>
<ul>
<li><p>行驶过程中：如果ECM不能按照仪表发送的QS状态执行（例如QS系统零件有故障），那么仪表应按ECM发送的报文做出相应的警告提示（例如警告灯报警）。</p></li>
<li><p>开机自检过程</p></li>
</ul>
<p><img src="media/image72.wmf" /><img
src="media/image73.wmf" /></p>
<ul>
<li><p>仪表主动切换QS状态过程（用户通过手把开关操控仪表）</p></li>
</ul>
<blockquote>
<p>仪表主页面进入QS选择模式</p>
</blockquote>
<p>短按 Button UP▲或DOWN ▼切换ON/OFF（长按松开后QS模式不变）</p>
<p><img src="media/image74.wmf" /></p>
<p>注：</p>
<p>1、出厂默认设置为QS ON。</p>
<p>2、当UI显示响应超时提示时，按键操作无效。</p>
<p>3、仪表发送处切换数据后等待关联系统响应的330ms，如果再按一次按键，仪表不用重发数据（以避免显示慢，用户反复操作按键）。</p>
<p>4、为防止连按，仪表40ms内按一次按键判定。</p>
<p>5、进入选择模式后，按切换键后，仪表立即发出切换数据请求，原状态保持显示，要等到ECM响应执行后才能切换显示。</p>
<p>6、进入选择模式后，按切换键后，仪表立即发出切换数据请求，原状态保持显示，收到ECM响应不能执行后，当前显示的状态闪烁三次（1s内）。</p>
<p>7、进入选择模式后，即使有车速也不退出。</p></td>
</tr>
<tr class="even">
<td>网路和数据异常显示</td>
<td><p>1、IGN ON后，根据接收到的报文显示</p>
<p>2、开机动画结束后，通信异常(参考 CAN 总线协议中关于通信异常的节点丢失
loss communication、DLC≠8、BUS OFF
等具体要求)时，通信异常时<del>维持当前显示</del></p>
<p><del>“ QS” 、“
ON/OFF”不闪烁</del>。UI提示异常（建议QS字符消失不显示，底色可以更深颜色变化）</p></td>
</tr>
<tr class="odd">
<td>功能配置开关</td>
<td><p>1、功能配置开关定义在诊断调查问券Read &amp; Write DID</p>
<p>2、功能配置打开可显示快速换档功能</p>
<p>3、功能配置关闭不显示快速换档功能</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S052" type="vehicle_feature" title="定速巡航" keywords="定速" -->
#### 定速巡航

<table>
<colgroup>
<col style="width: 13%" />
<col style="width: 86%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2"></th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>定速巡航开关状态、巡航功能工作状态、目标巡航车速</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>输入信号和显示</p>
<p>显示逻辑</p>
<p>DCJ提供参考样例</p></td>
<td><ul>
<li><p>CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x137</td>
<td>ECM_5</td>
<td>ECM_Cc_Master_Switch</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: 定速巡航主开关OFF</p>
<p>0x1: 定速巡航主开关ON</p>
<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 12%" />
<col style="width: 12%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>0x137</td>
<td>ECM_5</td>
<td>ECM_Cc_Switch_Check</td>
<td>RX</td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<p>0x0: 巡航主开关有效标志位normal, 表示主开关回路正常</p>
<p>0x1: 巡航主开关有效标志位failure, 表示主开关回路异常</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x137</td>
<td>ECM_5</td>
<td>ECM_Cc_CondtionStatus</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: 巡航条件状态inactive</p>
<p>0x1: 巡航条件状态active and set</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x137</td>
<td>ECM_5</td>
<td>ECM_Cc_RunStatus</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: Closed or standby</p>
<p>0x1: decelerate</p>
<p>0x2: stable(Cruise)</p>
<p>0x3: accelerate</p>
<p>0x4: resume</p>
<p>0x5: step accelerate</p>
<p>0x6: step decelerate</p>
<p>0x7: Reserved</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x137</td>
<td>ECM_5</td>
<td>ECM_Cc_Vsp</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>目标巡航车速, 无效值0x0000</p>
<p>精度 Factor: 0.05625,</p>
<p>示例：当收到 ABS_Rear_Speed = 0x400 时，仪表转化过程如下：</p>
<p>Ex: 0x0400 × 0.05625 = 256 × 4 ×0.5625 = 57.6km/h</p>
<p>注意:
目标巡航车速、巡航车速限制范围由ECM逻辑控制，仪表依接收数据显示，ABS和ECM输出的车速和目标巡航是原始数值，仪表接收ECM的目标巡航车速后依各车速指度范围补偿(需要灌水)</p>
<p>显示逻辑:</p>
<ul>
<li><p>整车定速巡航模式介绍（便于理解仪表功能）：</p></li>
</ul>
<p><img src="media/image75.png"
style="width:2.20764in;height:2.43681in" /> <img
src="media/image76.png"
style="width:2.28611in;height:1.72153in" /></p>
<p>巡航主开关</p>
<p>手把开关：</p>
<p>1、按下巡航主开关时，如果不满足巡航条件，①亮黄色<img
src="media/image77.png"
style="width:0.37292in;height:0.33889in" />；</p>
<p>如果满足巡航条件，①亮绿色<img
src="media/image26.png"
style="width:0.35208in;height:0.33542in" />。</p>
<p>2、整车按SET-按键，成功设置巡航车速后，②显示绿色符号<img
src="media/image78.png"
style="width:0.42639in;height:0.22847in" />和巡航目标车速③；</p>
<p>整车临时退出巡航时②<img
src="media/image78.png"
style="width:0.42639in;height:0.22847in" />符号消失，巡航车速③也消失。</p>
<p>整车按RES+ 恢复巡航时，②<img
src="media/image78.png"
style="width:0.42639in;height:0.22847in" />符号恢复显示，巡航车速③也恢复显示。</p>
<p>3、按巡航主开关退出巡航模式，①<img
src="media/image26.png"
style="width:0.35208in;height:0.33542in" />消失、②<img
src="media/image78.png"
style="width:0.42639in;height:0.22847in" />消失、巡航车速③消失。</p>
<p>4、目标巡航需要有状态待定:UI目标巡航车速也是数字+km/h, mph单位,
挨在定速巡航符号旁边,车速和目标巡航车速会在两个地方显示,
比车速显示文字小。</p>
<p>5、总体上，仪表只根据从CAN通讯中得到的讯息做相应显示，不具备判定功能。</p>
<ul>
<li><p>CAN信号：</p></li>
</ul>
<p>ECM_Cc_Master_Switch</p>
<p>ECM_Cc_CondtionStatus</p>
<p>ECM_Cc_Switch_Check</p>
<p>ECM_Cc_RunStatus</p>
<p>ECM_Cc_Vsp</p>
<p>以下为DCJ提供参考样例：</p>
<ul>
<li><p>参数：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 54%" />
<col style="width: 4%" />
<col style="width: 9%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>参数名称</strong></td>
<td><strong>描述</strong></td>
<td><strong>值</strong></td>
<td><strong>默认值</strong></td>
<td><strong>存储类型</strong></td>
</tr>
<tr class="even">
<td>Cc_VspWithOffset</td>
<td>经仪表转换后的目标巡航车速，用于显示在仪表屏上</td>
<td></td>
<td>0</td>
<td>RAM</td>
</tr>
<tr class="odd">
<td>CCspDevC</td>
<td>取消显示目标巡航车速偏差</td>
<td></td>
<td>3</td>
<td>ROM</td>
</tr>
<tr class="even">
<td>CCspDevD</td>
<td>显示目标巡航车速偏差</td>
<td></td>
<td>4</td>
<td>ROM</td>
</tr>
</tbody>
</table>
<ul>
<li><p>状态转换示意图：</p></li>
</ul>
<p><img src="media/image79.wmf"
style="width:5.76806in;height:4.97431in" /></p>
<p>Tr1：</p>
<p>条件：</p>
<p>ECM_Cc_Master_Switch == 1</p>
<p>&amp;&amp; ECM_Cc_Switch_Check == 0</p>
<p>&amp;&amp; ECM_Cc_CondtionStatus == 1</p>
<p>&amp;&amp; ECM_Cc_RunStatus == 0</p>
<p>&amp;&amp; IG ON</p>
<p>执行：</p>
<p>巡航指示图标<img src="media/image26.png"
style="width:0.35208in;height:0.33542in" /> 绿色长亮</p>
<p>SET符号不显示</p>
<p>目标巡航车速不显示</p>
<p>切换至ConditionOK状态</p>
<p>Cc_VspWithOffset = 0</p>
<p>Tr2：</p>
<p>条件：</p>
<p>ECM_Cc_Master_Switch == 1</p>
<p>&amp;&amp; ECM_Cc_Switch_Check == 0</p>
<p>&amp;&amp; ECM_Cc_CondtionStatus == 0</p>
<p>&amp;&amp; ECM_Cc_RunStatus == 0</p>
<p>&amp;&amp; IG ON</p>
<p>执行：</p>
<p>巡航指示图标<img src="media/image77.png"
style="width:0.37292in;height:0.33889in" /> 黄色长亮</p>
<p>SET符号不显示</p>
<p>目标巡航车速不显示</p>
<p>切换至ConditionNG状态</p>
<p>Cc_VspWithOffset = 0</p>
<p>Tr3：</p>
<p>条件：</p>
<p>ECM_Cc_Master_Switch == 1</p>
<p>&amp;&amp; ECM_Cc_Switch_Check == 0</p>
<p>&amp;&amp; ECM_Cc_CondtionStatus == 1</p>
<p>&amp;&amp; (0&lt; ECM_Cc_RunStatus &lt; 7)</p>
<p>&amp;&amp; IG ON</p>
<p>执行：</p>
<ol type="1">
<li><p>巡航指示图标<img
src="media/image26.png"
style="width:0.35208in;height:0.33542in" /> 绿色长亮</p></li>
<li><p>SET符号 绿色长亮</p></li>
<li><p>显示目标巡航车速，值为Cc_VspWithOffset，并最少维持3s</p></li>
<li><p>进入CruisingSet状态</p></li>
</ol>
<p>CruisingSet状态时执行以下事情：</p>
<p>1).按照以下公式转换目标巡航车速，用于目标巡航车速显示:</p>
<blockquote>
<p>Cc_VspWithOffset = ECU_Cc_Vsp + offset</p>
<p>其中offset值请参考仪表车速显示偏移值。</p>
</blockquote>
<p>2).在仪表屏上更新目标巡航车速值为Cc_VspWithOffset</p>
<p>3).当目标巡航车速有增加或减少时，显示目标巡航车速，并最少维持3S。</p>
<p>目标巡航车速的是否有变化的判断标准为增加或减少值大于0.875 Km/h。</p>
<p>4).当实际车速在目标巡航车速±CCspDevC（TBD）内时，取消显示目标巡航车速</p>
<p>当实际车速在目标巡航车速±CCspDevD ( TBD) 外时，显示目标巡航车速</p>
<p>Tr4：</p>
<p>条件：</p>
<p>ECM_Cc_Master_Switch == 1</p>
<p>&amp;&amp; ECM_Cc_Switch_Check == 0</p>
<p>&amp;&amp; ECM_Cc_CondtionStatus == 1</p>
<p>&amp;&amp; ECM_Cc_RunStatus == 0</p>
<p>&amp;&amp; IG ON</p>
<p>执行：</p>
<p>巡航指示图标 <img src="media/image26.png"
style="width:0.35208in;height:0.33542in" /> 绿色长亮</p>
<p>SET<img src="media/image78.png"
style="width:0.42639in;height:0.22847in" />符号不显示</p>
<p>不显示目标巡航车速</p>
<p>切换至ConditionOk状态</p>
<p>Tr5：</p>
<p>条件：</p>
<p>IG OFF</p>
<p>OR (ECM_Cc_Master_Switch == 0 &amp;&amp; ECM_Cc_Switch_Check ==
0)</p>
<p>OR (ECM_Cc_Switch_Check == 1)</p>
<p>执行：</p>
<p>切换至Idle状态</p>
<p>Cc_VspWithOffset = 0</p>
<ul>
<li><p>IG OFF时全部不显示</p></li>
<li><p>(ECM_Cc_Master_Switch == 0 &amp;&amp; ECM_Cc_Switch_Check ==
0)时，原显示内容1s内闪烁3次后不显示，km/h最后也不显示。</p></li>
<li><p>(ECM_Cc_Switch_Check == 1)时，取消显示Set<img
src="media/image78.png"
style="width:0.42639in;height:0.22847in" />符号，取消显示巡航指示图标<img
src="media/image26.png"
style="width:0.35208in;height:0.33542in" /></p></li>
</ul>
<p>km/h一直闪烁。</p>
<p>Tr6：</p>
<p>条件：</p>
<p>ECM_Cc_Master_Switch == 1</p>
<p>&amp;&amp; ECM_Cc_Switch_Check == 0</p>
<p>&amp;&amp; ECM_Cc_CondtionStatus == 1</p>
<p>&amp;&amp; ECM_Cc_RunStatus == 0</p>
<p>&amp;&amp; IG ON</p>
<p>执行：</p>
<p>巡航指示图标<img src="media/image26.png"
style="width:0.35208in;height:0.33542in" /> 绿色长亮</p>
<p>SET符号不显示</p>
<p>取消显示目标巡航车速</p>
<p>切换至ConditionOk状态</p>
<p>Tr7：</p>
<p>条件：</p>
<p>ECM_Cc_Master_Switch == 1</p>
<p>&amp;&amp; ECM_Cc_Switch_Check == 0</p>
<p>&amp;&amp; ECM_Cc_CondtionStatus == 0</p>
<p>&amp;&amp; IG ON</p>
<p>执行：</p>
<p>巡航指示图标<img src="media/image77.png"
style="width:0.37292in;height:0.33889in" />显示黄色长亮</p>
<p>取消显示Set<img src="media/image78.png"
style="width:0.42639in;height:0.22847in" />符号</p>
<p>取消显示目标巡航车速</p>
<p>进入ConditionNG状态</p>
<p>Tr8：</p>
<p>条件：</p>
<p>ECM_Cc_Master_Switch == 1</p>
<p>&amp;&amp; ECM_Cc_Switch_Check == 0</p>
<p>&amp;&amp; ECM_Cc_CondtionStatus == 0</p>
<p>&amp;&amp; IG ON</p>
<p>执行：</p>
<p>巡航指示图标<img src="media/image77.png"
style="width:0.37292in;height:0.33889in" />显示黄色长亮</p>
<p>取消显示Set<img src="media/image78.png"
style="width:0.42639in;height:0.22847in" />符号</p>
<p>取消显示目标巡航车速</p>
<p>切换至ConditionNG状态</p>
<ul>
<li><p>关联故障</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>网路和数据异常显示</td>
<td><ol type="1">
<li><p>IGN ON后，根据接收到的报文显示</p></li>
</ol>
<p>2、网路和数据异常显示逻辑:</p>
<p><img src="media/image80.jpeg"
style="width:6.21319in;height:1.29444in" /></p>
<p>上表异常又恢复正常时，仪表应该恢复正常显示。</p></td>
</tr>
</tbody>
</table>





<!-- AGENT_SECTION id="S053" type="indicator" title="通用故障指示灯" keywords="指示灯,故障" -->
#### 通用故障指示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>通用故障指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>黄色三角符号<img
src="media/image27.png"
style="width:0.39514in;height:0.33264in" />，与需要提示的内容设计在同一个UI提示框内，尽量弹窗提醒</p></li>
<li><p>注意弹窗不能覆盖车速和指示灯。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td>根据实车信号响应</td>
</tr>
<tr class="even">
<td>输入响应</td>
<td><p>当仪表收到以下任意一个报警信息时，该指示灯一起点亮：</p>
<p>1、发动机冷却液温度指示灯</p>
<p>2、油压指示灯</p>
<p>3、胎压警报指示灯</p>
<p>4、BCM故障信号</p>
<p>注：对于部分车型，若无相关功能，应通过配置功能取消相关功能的报警功能。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S054" type="indicator" title="灯具、喇叭、BCM关联故障报警显示" keywords="故障" -->
#### 灯具、喇叭、BCM关联故障报警显示

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2">BCM关联故障报警显示</th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>灯具、喇叭、BCM关联故障报警</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>液晶屏显示: 按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据帧—灯具故障内容</p></li>
</ul>
<table>
<colgroup>
<col style="width: 8%" />
<col style="width: 12%" />
<col style="width: 27%" />
<col style="width: 7%" />
<col style="width: 9%" />
<col style="width: 10%" />
<col style="width: 13%" />
<col style="width: 10%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_LTurnLampFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>0</td>
<td>0x0～0x1</td>
</tr>
<tr class="odd">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_RTurnlampFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>1</td>
<td>0x0～0x1</td>
</tr>
<tr class="even">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_HiBeamFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>2</td>
<td>0x0～0x1</td>
</tr>
<tr class="odd">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_LowBeamFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>3</td>
<td>0x0～0x</td>
</tr>
<tr class="even">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_PosLampFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>4</td>
<td>0x0～0x1</td>
</tr>
<tr class="odd">
<td>0x360</td>
<td>BC</td>
<td><p>_2</p>
<p>BCM_BrakeLampFail</p></td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>5</td>
<td>0x0～0x1</td>
</tr>
<tr class="even">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_HornFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>6</td>
<td>0x0～0x1</td>
</tr>
<tr class="odd">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_RearPosLampFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>7</td>
<td>0x0～0x1</td>
</tr>
<tr class="even">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_HeatedHandFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>8</td>
<td>0x0～</td>
</tr>
<tr class="odd">
<td>0x360x</td>
<td>BCM_2</td>
<td>BCM_LicenseLampFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>11</td>
<td>0x0～0x1</td>
</tr>
<tr class="even">
<td>0x360</td>
<td>BCM_2</td>
<td>BCM_SystemFail</td>
<td>RX</td>
<td>100ms</td>
<td>1</td>
<td>10</td>
<td>0x0～0x1</td>
</tr>
</tbody>
</table>
<p>0x0: No failure正常</p>
<p>0x1: Malfunction有故障</p>
<p>故障信号定义:</p>
<p>BCM_LTurnLampFail: 左方向灯故障</p>
<p>BCM_RTurnlampFail: 右方向灯故障</p>
<p>BCM_HiBeamFail: 远光灯故障</p>
<p>BCM_LowBeamFail: 近光灯(前大灯)故障</p>
<p>BCM_PosLampFail: 位置灯故障</p>
<p>BCM_BrakeLampFail: 剎车灯故障</p>
<p>BCM_HornFail: 喇叭故障</p>
<p>BCM_RearPosLampFail: 后位置灯故障</p>
<p>BCM_HeatedHandFail: 加热手把故障</p>
<p>BCM_LicenseLampFail: 牌照灯故障</p>
<p>BCM_SystemFail: BCM系统异常</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S055" type="ui_navigation" title="TCS设置" keywords="TCS,设置" -->
#### TCS设置

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>可选项：ON(OFF)</p></li>
</ul>
<blockquote>
<p>TCS系统响应超时！</p>
</blockquote>
<ul>
<li><p>指示灯形式：按照效果图，注：如TC关闭，UI应有明显的颜色或画面提示，提醒驾驶者注意滑倒。</p></li>
</ul>
<ul>
<li><p>设定过程动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>电路</td>
<td>/</td>
</tr>
<tr class="even">
<td>输入响应</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输出</td>
<td><ul>
<li><p>SC:</p></li>
</ul>
<p>仪表TCS 请求输出（配置）</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x320</td>
<td>MTR_Out_1</td>
<td>MTR_TCS_Req</td>
<td>TX</td>
</tr>
</tbody>
</table>
<p>0x0: TCS OFF🡪TCS 功能关闭</p>
<p>0x1: TCS ON🡪 TCS功能开启</p>
<p>TCS 响应回复报文</p>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 14%" />
<col style="width: 35%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x136</td>
<td>ECM_3</td>
<td>ECM_MTR_TCS_Req_Ack</td>
<td>TX</td>
</tr>
</tbody>
</table>
<p>0x0: TCS OFF 🡪TCS 功能关闭</p>
<p>0x1: TCS ON 🡪 TCS功能开启</p>
<p>0x2~0x6: reserved</p>
<p>0x7: Invald</p>
<ul>
<li><p>BB:</p></li>
</ul>
<blockquote>
<p>仪表TCS 请求输出</p>
</blockquote>
<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 25%" />
<col style="width: 35%" />
<col style="width: 19%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>ID</strong></td>
<td><strong>Msg.name</strong></td>
<td><strong>Signal Name</strong></td>
<td><strong>T/RX</strong></td>
</tr>
<tr class="even">
<td>0x320</td>
<td>MTR_Out_1</td>
<td>MTR_DriveModeSet</td>
<td>TX</td>
</tr>
</tbody>
</table>
<p>0x0: sport mode</p>
<p>0x1: standard mode (default)</p>
<p>0x2: rain mode</p>
<p>0x3: OFF</p>
<p>0x4～0x7: Reserved</p>
<ul>
<li><p>ABS牵引力控制功能骑行模式/关闭CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 14%" />
<col style="width: 62%" />
<col style="width: 12%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>ID</strong></td>
<td><strong>Msg.name</strong></td>
<td><strong>Signal Name</strong></td>
<td><strong>T/RX</strong></td>
</tr>
<tr class="even">
<td>0x12F</td>
<td>ABS_2</td>
<td>ABS_MTC_ModeChangePermission</td>
<td>RX</td>
</tr>
<tr class="odd">
<td>0x12F</td>
<td>ABS_2</td>
<td>ABS_DASH_Drive_Mode_Rsp</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p><strong>ABS_DASH_Drive_Mode_Rsp</strong></p>
<p>0x0: sport mode</p>
<p>0x1: road mode (default)</p>
<p>0x2: rain mode</p>
<p>0x3: OFF</p>
<p>0x4～0x7: Reserved</p>
<p><strong>ABS_MTC_ModeChangePermission</strong></p>
<p>0x0: MTC/DTC mode change is not allowed</p>
<p>0x1: MTC/DTC mode change is allowed</p></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p>详见“4.3.3快捷设置”部分。</p>
<p>SC：</p>
<p><img src="media/image81.wmf" /></p>
<p>BB:</p>
<p><img src="media/image82.wmf" /></p>
<p><img src="media/image83.wmf" /></p>
<p>注：</p>
<p>1、出厂默认设置为TCS ON。</p>
<p>2、每次IGN OFF后，重新IGN ON后，仪表均重置为TCS ON。</p>
<p>3、当UI显示响应超时提示时，按键操作无效。</p>
<p>4、仪表发送处切换数据后等待关联系统响应的330ms，如果再按一次按键，仪表不用重发数据（以避免显示慢，用户反复操作按键）。</p>
<p>5、为防止连按，仪表40ms内按一次按键判定。</p>
<p>6、在主页面进行TC切换时，如果切换失败，则当前显示模式1秒内闪烁3次后恢复当前显示（不需显示“TCS系统响应超时！”）。</p></td>
</tr>
<tr class="odd">
<td>网路和数据异常显示</td>
<td>开机动画结束后，通信异常(参考 CAN 总线协议中关于通信异常的节点丢失
loss communication、DLC≠8、BUS OFF 等具体要求)时， <img
src="media/image84.png"
style="width:0.41597in;height:0.34028in" />要显示。</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S056" type="section" title="软硬件版本" keywords="" -->
#### 软硬件版本

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><ul>
<li><p>软、硬件版本：按示例格式，并输出信息至CAN总线。</p></li>
</ul>
<p>例如：软件版本 F13.2</p>
<p>硬件版本 A01.2</p>
<p>如有成熟量产规则，可与研发沟通商定修改。</p>
<ul>
<li><p>版本号变更需求：只要有变更，就一定要在版本号上有体现。</p></li>
</ul>
<ul>
<li><p>软件及硬件版本号输出：</p></li>
</ul>
<table>
<colgroup>
<col style="width: 25%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>Msg Type</td>
</tr>
<tr class="even">
<td>0x1C0</td>
<td>MTR_Info</td>
<td>MTR_Sw_Version</td>
<td>Event</td>
</tr>
<tr class="odd">
<td>0x1C0</td>
<td>MTR_Info</td>
<td>MTR_Hw_Version</td>
<td>Event</td>
</tr>
</tbody>
</table>
<ul>
<li><p>发送时间：仪表在每次IGN上电后，以50ms间隔连续发送3帧CAN message
“MTR_Info”(0x1C0)。 （发送第一帧的时间在IGN ON 后5s内即可）</p></li>
</ul>
<blockquote>
<p><img src="media/image85.jpeg"
style="width:6.49028in;height:1.06458in" /></p>
</blockquote></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S057" type="section" title="TCU预留显示" keywords="" -->
#### TCU预留显示

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td><p>TCU预留显示</p>
<p><del>TCU 、</del>D、M<del>、S</del></p>
<p><img src="media/image86.png"
style="width:0.5375in;height:0.55903in" /> <img
src="media/image87.png"
style="width:0.52708in;height:0.51181in" />(ISO 2575-2021)</p></td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT，指示符形式（按照效果图）</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入及响应</td>
<td><ul>
<li><p>CAN数据帧—预留，待定</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>待定</td>
<td>待定</td>
<td>待定</td>
<td>RX</td>
</tr>
</tbody>
</table></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S058" type="vehicle_feature" title="VVL" keywords="VVL" -->
#### VVL

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>VVL</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图，非法规要求指示灯，UI形状和颜色没有限定。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>待定</td>
<td>待定</td>
<td>待定</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: OFF灭灯</p>
<p>0x1: 点亮</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td>IGN ON后，根据接收到的报文显示</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S059" type="indicator" title="自动大灯" keywords="" -->
#### 自动大灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>自动大灯符号</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图，非法规要求指示灯，UI形状和颜色参考现有车辆。</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>BCM_1</td>
<td>待定</td>
<td>待定</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: 自动大灯功能关闭OFF</p>
<p>0x1: 自动大灯功能启用ON</p>
<p>注：当接到0x1:
自动大灯功能启用ON报文时，远光指示灯和或近光指示灯的符号内需要增加“A”,如下图示意：</p>
<p><img src="media/image88.png"
style="width:1.44097in;height:0.87222in" /> <img
src="media/image89.png"
style="width:1.19167in;height:0.94444in" /></p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p>注：</p>
<p>1、IGN ON后，根据接收到的报文显示。</p>
<p>2、<del>每次IGN OFF后，仪表记忆显示状态，重新IGN
ON后，按记忆状态显示并发送报文。</del></p>
<p>3、当UI显示响应超时提示时，按键操作无效。</p>
<p>4、仪表发送处切换数据后等待关联系统响应的330ms，如果再按一次按键，仪表不用重发数据（以避免显示慢，用户反复操作按键）。</p>
<p>5、为防止连按，仪表40ms内按一次按键判定。</p>
<p>6、在设置页面进行自动大灯功能切换时，如果切换失败，则当前显示模式1秒内闪烁3次后恢复当前显示（显示“系统响应超时！”）。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S060" type="vehicle_feature" title="IMU" keywords="IMU" -->
#### IMU

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>IMU车身倾斜角度</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图，非法规要求内容，UI形状和颜色可自定义。</p></li>
</ul>
<blockquote>
<p>参考图例<img src="media/image90.png"
style="width:1.39514in;height:1.19583in" /></p>
</blockquote></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 24%" />
<col style="width: 25%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x92</td>
<td>ABS_3</td>
<td>ABS_Lean_Angle</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>负值代表偏向左侧的角度，正值代表偏向右侧的角度。</p>
<p>数据精度：0.1°</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p>IGN ON后，根据接收到的报文显示。</p>
<p>无有效数据时，显示- -</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S061" type="vehicle_feature" title="弹射起步" keywords="弹射" -->
#### 弹射起步

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>设置菜单可选项：ON(OFF)、系统响应超时！</p></li>
<li><p>主页面显示：当为ON状态是，弹射起步图标（非法规图标，可自定义）的周围显示可用的启动次数。</p></li>
<li><p>形式：按照效果图，</p></li>
<li><p>设定过程动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>电路</td>
<td>/</td>
</tr>
<tr class="even">
<td>输入响应</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输出</td>
<td><ul>
<li><p>SC:</p></li>
</ul>
<blockquote>
<p>无此功能。</p>
</blockquote>
<ul>
<li><p>BB:</p></li>
</ul>
<blockquote>
<p>仪表请求输出</p>
</blockquote>
<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 25%" />
<col style="width: 35%" />
<col style="width: 19%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>ID</strong></td>
<td><strong>Msg.name</strong></td>
<td><strong>Signal Name</strong></td>
<td><strong>T/RX</strong></td>
</tr>
<tr class="even">
<td>0x320</td>
<td>MTR_Out_1</td>
<td>待定</td>
<td>TX</td>
</tr>
</tbody>
</table>
<p>0x0:弹射起步功能关闭OFF(default)</p>
<p>0x1:弹射起步功能开启</p>
<p>0x2～0x7: Reserved</p>
<ul>
<li><p>ABS电子弹射起步功能/关闭CAN报文</p></li>
</ul>
<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 14%" />
<col style="width: 62%" />
<col style="width: 12%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>ID</strong></td>
<td><strong>Msg.name</strong></td>
<td><strong>Signal Name</strong></td>
<td><strong>T/RX</strong></td>
</tr>
<tr class="even">
<td>0x12F</td>
<td>ABS_2</td>
<td>mode待定</td>
<td>RX</td>
</tr>
<tr class="odd">
<td>0x12F</td>
<td>ABS_2</td>
<td>Permission</td>
<td></td>
</tr>
<tr class="even">
<td>0x12F</td>
<td>ABS_2</td>
<td>剩余可使用次数</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p><strong>mode待定</strong></p>
<p>0x0:弹射起步功能关闭OFF(default)</p>
<p>0x1:弹射起步功能开启</p>
<p>0x2～0x7: Reserved</p>
<p><strong>Permission</strong></p>
<p>0x0: mode change is not
allowed，仪表设置菜单内UI提示不满足激活条件。</p>
<p>0x1: mode change is allowed</p>
<p><strong>剩余可使用次数</strong></p>
<p>0x0: 0</p>
<p>0x1: 1</p>
<p>0x2: 2</p>
<p>0x3: 3</p></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p>注：</p>
<p>1、出厂默认设置为弹射起步功能关闭OFF。</p>
<p>2、每次IGN OFF后，仪表记忆显示状态，重新IGN
ON后，按记忆状态显示并发送报文。</p>
<p>3、当UI显示响应超时提示时，按键操作无效。</p>
<p>4、仪表发送处切换数据后等待关联系统响应的330ms，如果再按一次按键，仪表不用重发数据（以避免显示慢，用户反复操作按键）。</p>
<p>5、为防止连按，仪表40ms内按一次按键判定。</p>
<p>6、在设置页面进行电子弹射起步功能切换时，如果切换失败，则当前显示模式1秒内闪烁3次后恢复当前显示（显示“系统响应超时！”）。</p></td>
</tr>
<tr class="odd">
<td>网路和数据异常显示</td>
<td>开机动画结束后，通信异常(参考 CAN 总线协议中关于通信异常的节点丢失
loss communication、DLC≠8、BUS OFF 等具体要求)时，
UI要显示为不可用状态（例如灰底色）。</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S062" type="section" title="跑圈计时" keywords="跑圈" -->
#### 跑圈计时

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>UI：按照效果图</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="odd">
<td><p>功能说明</p>
<p>操作逻辑</p></td>
<td><p>它的主要作用是记录摩托车通过赛道的时间和圈数，以及提供实时数据反馈，使驾驶者可以通过数据分析来调整自己的驾驶习惯和技术。</p>
<p>前置条件：仪表屏幕处于主界面，且已进入到跑圈计时页面（详见“多功能区”部分说明），以下为具体内容：</p>
<p><img src="media/image91.png"
style="width:6.03056in;height:3in" /></p>
<p>1 ：时间（显示范围0′0″00-59′59″99）</p>
<p>2 ：最佳圈数</p>
<p>3 ：最佳圈数所对应的时长</p>
<p>4 ：总圈数（显示范围00-30）</p>
<p>5 ：总圈数所对应的总时长</p>
<table>
<colgroup>
<col style="width: 17%" />
<col style="width: 18%" />
<col style="width: 63%" />
</colgroup>
<tbody>
<tr class="odd">
<td>动作</td>
<td>计时器状态</td>
<td>动作后显示</td>
</tr>
<tr class="even">
<td rowspan="3"><p>短按“左键”</p>
<p><img src="media/image92.wmf" /></p></td>
<td>未计时</td>
<td>开始计时</td>
</tr>
<tr class="odd">
<td>暂停</td>
<td>继续计时</td>
</tr>
<tr class="even">
<td>计时过程中</td>
<td><p>序号4圈数加1，序号5加上本次所计时间。</p>
<p>序号1重新开始计时。（前一数值保持2S显示，2S后显示新的计时时间）。</p>
<p>序号2和序号3根据实际情况判断是否更新。</p>
<p>特殊情况：在显示上一值的2S内再次短按“左键”，序号1显示变为新时间。</p></td>
</tr>
<tr class="odd">
<td><p>长按“下键”</p>
<p><img src="media/image93.wmf" /></p></td>
<td>/</td>
<td>清零</td>
</tr>
<tr class="even">
<td rowspan="2"><p>短按“下键”</p>
<p><img src="media/image94.wmf" /></p></td>
<td>若在计时过程中</td>
<td>暂停</td>
</tr>
<tr class="odd">
<td>若不在计时过程中</td>
<td>进入仪表其它部分要求的相应功能</td>
</tr>
<tr class="even">
<td rowspan="3"><p>长按</p>
<p>“上键”</p>
<p><img src="media/image95.wmf" /></p></td>
<td>若在计时过程中</td>
<td>无效</td>
</tr>
<tr class="odd">
<td>若不在计时过程中</td>
<td><p>进入查询历史圈数及时间状态：序号4文案改变，数字闪烁。序号5显示左侧圈数对应的时间。</p>
<p>通过短按“△”或“▽”，序号4圈数+1或-1，序号5随之变化。短按可以循环切换。</p></td>
</tr>
<tr class="even">
<td>若在查询历史圈数及时间的状态</td>
<td>退出历史查询状态。</td>
</tr>
</tbody>
</table>
<p>跑圈计时功能下按键优先级：</p>
<p>1.“BACK”键：挂断来电﹥挂断通话﹥跑圈（开始/暂停）。</p>
<p>2.进入查询圈数及时间状态时，“△”和“▽”按键功能仅为调整圈数。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S063" type="section" title="风挡玻璃" keywords="风挡" -->
#### 风挡玻璃

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>设置菜单可选项：上升、下降、系统响应超时！</p></li>
<li><p>设定过程动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入信号</td>
<td>按键信号</td>
</tr>
<tr class="odd">
<td>电路</td>
<td>/</td>
</tr>
<tr class="even">
<td>输入响应</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输出</td>
<td><blockquote>
<p>仪表请求输出</p>
</blockquote>
<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 25%" />
<col style="width: 35%" />
<col style="width: 19%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>ID</strong></td>
<td><strong>Msg.name</strong></td>
<td><strong>Signal Name</strong></td>
<td><strong>T/RX</strong></td>
</tr>
<tr class="even">
<td>0x320</td>
<td>MTR_Out_1</td>
<td>待定</td>
<td>TX</td>
</tr>
</tbody>
</table>
<p>0x0:上升</p>
<p>0x1:下降</p>
<p>0x2～0x7: Reserved</p>
<ul>
<li><p>BCM响应</p></li>
</ul>
<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 14%" />
<col style="width: 62%" />
<col style="width: 12%" />
</colgroup>
<tbody>
<tr class="odd">
<td><strong>ID</strong></td>
<td><strong>Msg.name</strong></td>
<td><strong>Signal Name</strong></td>
<td><strong>T/RX</strong></td>
</tr>
<tr class="even">
<td></td>
<td>BCM</td>
<td></td>
<td>RX</td>
</tr>
<tr class="odd">
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
</tbody>
</table>
<p><strong>待定</strong></p>
<p>0x0:</p>
<p>0x1:</p>
<p>0x2～0x7: Reserved</p>
<p><strong>Permission</strong></p>
<p>0x0: change is not allowed，仪表设置菜单内UI提示不满足激活条件。</p>
<p>0x1: change is allowed</p></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p>注：</p>
<p>1、当UI显示响应超时提示时，按键操作无效。</p>
<p>2、在切换时，如果切换失败，则当前显示模式1秒内闪烁3次后恢复当前显示（显示“系统响应超时！”）。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S064" type="indicator" title="AISS怠速启停指示灯" keywords="指示灯,AISS" -->
#### AISS怠速启停指示灯

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2">AISS怠速启停指示灯</th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>AISS 怠速启停指示灯</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT符号显示，绿色</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据帧-- ECM_Idle_Stop_Sts</p></li>
</ul>
<table style="width:100%;">
<colgroup>
<col style="width: 17%" />
<col style="width: 22%" />
<col style="width: 47%" />
<col style="width: 13%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
</tr>
<tr class="even">
<td>0x134</td>
<td>ECM_1</td>
<td>ECM_Idle_Stop_Sts</td>
<td>RX</td>
</tr>
</tbody>
</table>
<p>0x0: 指示灯OFF</p>
<p>0x1: 指示灯ON</p>
<p>0x2:指示灯闪烁 (1Hz, 50% Duty)</p>
<p>0x3:
保留位，收到此值仪表滤除，维持最近一笔有效数字显示(0x0,0x1,0x2)</p></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S065" type="communication" title="无线通信专项功能" keywords="" -->
### 无线通信专项功能

<!-- AGENT_SECTION id="S066" type="section" title="功能简介" keywords="" -->
#### 功能简介

<table style="width:100%;">
<colgroup>
<col style="width: 6%" />
<col style="width: 6%" />
<col style="width: 16%" />
<col style="width: 20%" />
<col style="width: 13%" />
<col style="width: 14%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>No</td>
<td colspan="2">功能分类</td>
<td><p>符号、示例</p>
<p>（参考）</p></td>
<td><p>经典蓝牙</p>
<p>BT</p></td>
<td><p>低功耗蓝牙</p>
<p>BLE</p></td>
<td>WiFi</td>
<td><p>APP</p>
<p>支持</p></td>
</tr>
<tr class="even">
<td>1</td>
<td rowspan="7">电话</td>
<td>来电号码显示</td>
<td>13422785388</td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>2</td>
<td>接听/拒接</td>
<td><img src="media/image96.png"
style="width:0.58889in;height:0.53056in" /> <img
src="media/image97.png"
style="width:0.52014in;height:0.53958in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>3</td>
<td>联系人</td>
<td><img src="media/image98.png"
style="width:0.78125in;height:0.42639in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td></td>
<td>通信录</td>
<td><img src="media/image99.png"
style="width:1.36458in;height:0.92014in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>4</td>
<td>通话记录</td>
<td><img src="media/image100.png"
style="width:1.29097in;height:0.71736in" /></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>5</td>
<td>音量加减</td>
<td><img src="media/image101.png"
style="width:1.08333in;height:0.38472in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td>通话时长</td>
<td><img src="media/image102.png"
style="width:1.17708in;height:0.47847in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>6</td>
<td rowspan="7">音乐</td>
<td>音乐名称</td>
<td><img src="media/image103.png"
style="width:1.08333in;height:0.15486in" /></td>
<td></td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>7</td>
<td>音乐歌词</td>
<td><img src="media/image104.png"
style="width:1.11458in;height:0.26806in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td></td>
<td>上一首</td>
<td><img src="media/image105.png"
style="width:0.34306in;height:0.37986in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>8</td>
<td>下一首</td>
<td><img src="media/image106.png"
style="width:0.28056in;height:0.34444in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>9</td>
<td>音量加减</td>
<td><img src="media/image101.png"
style="width:1.08333in;height:0.38472in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>10</td>
<td>音乐播放</td>
<td><img src="media/image107.png"
style="width:0.17639in;height:0.23889in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td></td>
<td>音乐暂停</td>
<td><img src="media/image108.png"
style="width:0.20764in;height:0.30139in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>11</td>
<td rowspan="4">手机<br />
信息</td>
<td>蓝牙连接状态</td>
<td><img src="media/image109.png"
style="width:0.275in;height:0.36667in" />或<img
src="media/image110.png"
style="width:0.30278in;height:0.36667in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>12</td>
<td>信号强度</td>
<td><img src="media/image111.png"
style="width:0.56181in;height:0.38472in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td>13</td>
<td>手机电量</td>
<td><img src="media/image112.png"
style="width:0.57222in;height:0.32222in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="odd">
<td>14</td>
<td>Wifi信号等级</td>
<td><img src="media/image113.png"
style="width:0.36806in;height:0.36806in" /></td>
<td>√</td>
<td></td>
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td>二维码</td>
<td><p>绑定仪表二维码</p>
<p>(用于WiFi投屏)</p></td>
<td><img src="media/image114.png"
style="width:0.65278in;height:0.64653in" /></td>
<td></td>
<td></td>
<td>√</td>
<td>√</td>
</tr>
<tr class="odd">
<td>15</td>
<td rowspan="2">导航</td>
<td>简易导航</td>
<td><img src="media/image115.png"
style="width:1.19722in;height:0.57569in" /></td>
<td></td>
<td>√</td>
<td></td>
<td>√</td>
</tr>
<tr class="even">
<td>16</td>
<td>全景地图</td>
<td><img src="media/image116.png"
style="width:1.25972in;height:0.70625in" /></td>
<td></td>
<td></td>
<td>√</td>
<td>√</td>
</tr>
<tr class="odd">
<td>17</td>
<td>天气</td>
<td>天气图标显示</td>
<td><p><img src="media/image117.png"
style="width:0.64514in;height:0.61389in" /></p>
<p>35℃</p></td>
<td></td>
<td>√</td>
<td></td>
<td>√</td>
</tr>
<tr class="even">
<td>18</td>
<td>App</td>
<td>显示</td>
<td><img src="media/image118.png"
style="width:1.20833in;height:2.22222in" /></td>
<td></td>
<td>√</td>
<td></td>
<td>√</td>
</tr>
<tr class="odd">
<td>19</td>
<td>App</td>
<td>设置</td>
<td></td>
<td></td>
<td>√</td>
<td></td>
<td>√</td>
</tr>
<tr class="even">
<td colspan="8">仪表显示App功能遵循 “1-1 附录 手机App和仪表
显示信息”</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S067" type="section" title="电话" keywords="电话" -->
#### 电话

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>电话</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><blockquote>
<p>见UI</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td>根据BT模组接收到的信号响应，及发送相关回馈信号给手机</td>
</tr>
<tr class="even">
<td>输入响应</td>
<td><p>当仪表通过蓝牙连接手机且接到电话时，UI区域显示来电人信息（姓名、电话号码），并按下图示进行操作。</p>
<p><img src="media/image119.wmf" /></p>
<p>注：通信录、通话记录需进入菜单内操作。</p>
<p>挂断电话按不同状态可细分为拒接电话，通话中挂断电话。</p>
<p>所有音量条在无音量调整后2S自动消失。</p>
<p>通话结束后，挂断电话提示框3S自动消失。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S068" type="section" title="投屏导航" keywords="导航" -->
#### 投屏导航

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>手机互联</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><p>二维码 <img src="media/image120.png"
style="width:0.83333in;height:0.825in" /></p>
<p>提示用户信息：打开Haojue APP ﹥ 点击开始连接﹥
扫一扫使用手机投屏</p></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td>手机、APP、仪表二维码。</td>
</tr>
<tr class="even">
<td>输入响应</td>
<td><p>使用手机打开APP,扫描仪表二维码，完成手机互联，连通后可使用投屏功能。</p>
<p><img src="media/image121.png"
style="width:1.25903in;height:1.19583in" /> <img
src="media/image122.png"
style="width:1.25903in;height:1.24653in" /><img
src="media/image123.png"
style="width:0.9875in;height:1.75417in" /> <img
src="media/image124.png"
style="width:1.87014in;height:1.3in" /></p>
<p>图例展示，非实物图片</p>
<p>在手机互联界面中，用户可通过无感连接（仅限车主）或扫描二维码完成手机互联，连通后可使用投屏功能。</p>
<p>车主只需打开手机上的“我的豪爵” APP；</p>
<p>进入时会有两个选项：</p>
<p>1. 无感连接</p>
<p>2. 扫描二维码</p>
<p>车主可点击选项</p>
<p>1：无感连接，直接进入投屏页面；</p>
<p>2：其他用户需进入菜单操作连接手机互联；
扫描二维码，通过扫码进入投屏页面。</p>
<p>当用户关闭APP或断开互联时，此时仪表上的界面会直接返回到主界面；</p>
<p>当在投屏界面时，短按返回按键，界面返回至缩略图（30S
无按键操作，自动返回主界面），再次短按返回按键，界面返回至菜单，反之想返回投屏界面可重复短按两次ok键。</p>
<p>在互联成功的前提下，仪表在菜单或主界面时，手机APP
端发起一个导航路径，也可进入到投屏界面。</p>
<p>所有音量条在无音量调整后2S自动消失。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S069" type="section" title="音乐" keywords="音乐" -->
#### 音乐

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>音乐</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><blockquote>
<p>见UI</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td>手机与仪表进行蓝牙连接，头盔与仪表进行蓝牙连接</td>
</tr>
<tr class="even">
<td>输入响应</td>
<td><p>UI设计需进入菜单界面，找到音乐菜单。或者在主页面内集成显示音乐内容。</p>
<p>在音乐界面下，用户可通过蓝牙播放手机内的歌曲，配合左手把开关按键进行上一首，下一首，暂停，继续播放，音量调节等功能。</p>
<p>短按△或▽键选择歌曲，短按ok键进入音乐播放界面，再次短按ok键音乐暂停播放；</p>
<p>通过手机播放音乐。</p>
<p>当仪表通过蓝牙连接手机且接到电话时，UI区域显示来电。</p>
<p>按键优先级：电话＞音乐＞其它</p>
<p><img src="media/image125.wmf" /></p>
<p>所有音量条在无音量调整后2S自动消失。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S070" type="section" title="天气" keywords="天气" -->
#### 天气

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>天气</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><blockquote>
<p>见UI（建议只显示图标和温度℃）</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><p>手机与仪表进行蓝牙连接，BLE数据传输</p>
<p>遵循 “2-1 DCJ豪爵 手机App和仪表 BLE数据协议”</p></td>
</tr>
<tr class="even">
<td>输入响应</td>
<td>遵循 “2-1 DCJ豪爵 手机App和仪表 BLE数据协议”</td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S071" type="section" title="使用场景需求" keywords="" -->
#### 使用场景需求

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><strong>场景一：头盔对话</strong></p>
<p>前置条件：两个头盔同时连接仪表，手机连接仪表。</p>
<p>操作：通过按键操作，点击进入到通话模式（需要提供UI式样）。</p>
<p>表现：此时两个头盔之间可以相互对话，头盔播放的音频，只有两个头盔之间对话的音频，如果有多媒体或者投屏导航音的话，也不会通过头盔进行播放。</p>
<p>后置：通过物理按键，点击退出通话模式，此时头盔按照要求，正常播放头盔的声音。</p>
<p> </p>
<p><strong>场景二：蓝牙音乐</strong></p>
<p>前置条件：两个头盔同时连接仪表，手机连接仪表。</p>
<p>操作：此时手机播放蓝牙音乐。</p>
<p>表现：此时两个头盔都可以听到手机的蓝牙音乐。</p>
<p>后置：待蓝牙音乐结束，主副驾驶头盔按照要求正常播放声音。</p>
<p> </p>
<p><strong>场景三：蓝牙电话</strong></p>
<p>前置条件：两个头盔同时连接仪表，手机连接仪表。</p>
<p>操作：此时手机接听蓝牙电话。</p>
<p>表现：此时主驾驶，通过头盔正常进行蓝牙通话，主驾驶除了电话的通话声音以外，所有的音源禁止；副驾驶的头盔静音此时听不到任何声音。</p>
<p>后置：待通话结束（挂断），主副驾驶头盔按照要求正常播放声音。</p>
<p><strong>场景四：地图投屏</strong></p>
<p>前置条件：两个头盔同时连接仪表，手机连接仪表。</p>
<p>操作：此时手机投屏导航。</p>
<p>表现：此时主副驾驶的耳机，同时播放导航的声音。</p>
<p>后置：待地图导航结束，主副驾驶头盔按照要求正常播放声音。</p>
<p> </p>
<p><strong>场景五：手机同时音乐和导航</strong></p>
<p>前置条件：两个头盔同时连接仪表，手机连接仪表。</p>
<p>操作：此时手机投屏导航，并且播放音乐。</p>
<p>表现：此种情况可以做音源仲裁，出现导航音的时候，媒体音抑制<del>或者媒体音停播</del>，但是主副驾驶的头盔播放的声音一定是一致的。</p>
<p>后置：导航音结束后，媒体音恢复音量。</p>
<p> </p>
<p><strong>场景六：对话模式下接听电话</strong></p>
<p>前置条件：两个头盔同时连接仪表，手机连接仪表，并且进入到对话模式下。</p>
<p>操作：此时接通了手机的电话。</p>
<p>表现：主副驾驶不可以通过头盔进行对话，此时的主驾驶，通过头盔正常进行蓝牙通话，主驾驶除了电话的通话声音以外，所有的音源禁止；副驾驶的头盔静音此时听不到任何声音。</p>
<p>后置：挂断电话后，恢复到对话模式。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S072" type="section" title="仪表端口向外供电" keywords="供电" -->
### 仪表端口向外供电

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>Pin 13</p>
<p>VCC_ OUT ：在IGN 13V时输出电压10.7±1.0 V ，额定工作电流15mA min。</p>
<p>建议电路：</p>
<p><img src="media/image126.png"
style="width:3.74931in;height:1.9125in" /></p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S073" type="ui_navigation" title="页面切换" keywords="页面" -->
## 页面切换

<!-- AGENT_SECTION id="S074" type="ui_navigation" title="页面简介" keywords="页面" -->
### 页面简介

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td>显示内容</td>
</tr>
<tr class="even">
<td><p>主页面</p>
<p>（硬件平台包含至少支持三种风格UI、包含电话、音乐）</p></td>
</tr>
<tr class="odd">
<td>车辆信息</td>
</tr>
<tr class="even">
<td>音乐</td>
</tr>
<tr class="odd">
<td>导航</td>
</tr>
<tr class="even">
<td>电话</td>
</tr>
<tr class="odd">
<td>设置</td>
</tr>
<tr class="even">
<td>智能钥匙应急模式</td>
</tr>
</tbody>
</table>

注：在上表各页面内都必须包含行车必要的信息和警示灯，参考2 机能式样

<!-- AGENT_SECTION id="S075" type="ui_navigation" title="主/从页面切换" keywords="页面" -->
### 主/从页面切换

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><img src="media/image127.wmf" /></p>
<p>注 1：</p>
<p>1、主页面切换至其他页面的动画按照效果图执行；</p>
<p>2、其他页面切换至主页面的动画按照效果图执行。</p>
<p>3、设置页面和车辆信息页面切换的动画按照效果图执行。</p>
<p>4、画面迁移未注事项参考 UI 资料。</p>
<p><del>注 2：</del></p>
<p><del>1、当且仅当车速为 0 时，方可从主页面切换至其他页面；</del></p>
<p><del>2、当车速&gt;5km/h（对应 3～4 之间的
mile）时，应从其他页面自动切换回主页面。</del></p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S076" type="ui_navigation" title="主页面内容切换" keywords="页面" -->
### 主页面内容切换

<!-- AGENT_SECTION id="S077" type="section" title="多功能区" keywords="" -->
#### 多功能区

在主页面下，切换顺序如下：

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><img src="media/image128.wmf" /></p>
<p>注：</p>
<p>1、具体可切换显示的内容由设置页面各功能定义。</p>
<p>如果勾选了不显示，则切换显示时跳过该项，进入下一项的循环。</p>
<p>2、主页面多功能区只显示英文（没有中文显示）。</p>
<p>3、出厂时默认显示为ODO，且为多功能区的必选项。</p>
<p>4、切换至其他显示后IGN ON→OFF，应保持上一次的设定值。</p>
<p>5、可循环选择菜单。</p>
<p>6、按键优先级：电话＞音乐＞其它，即在无电话和音乐时，可进行此操作。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S078" type="ui_navigation" title="主页面下的骑行模式切换" keywords="骑行,页面" -->
#### 主页面下的骑行模式切换

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p><img src="media/image129.wmf" /></p>
<p>进入模式时、按键优先级：＞电话＞音乐＞其它。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S079" type="ui_navigation" title="快捷设置" keywords="设置" -->
#### 快捷设置

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>允许操作单独分配的功能。</p>
<p><img src="media/image130.wmf" /></p>
<p>注：</p>
<p>1、在IGN OFF时记忆之前的快捷设置选项；</p>
<p>2、选中的项目有明显的UI提示，例如前面加●；</p>
<p>3、按键优先级：电话＞音乐＞其它。</p>
<p>4、3S 无操作自动退出</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S080" type="section" title="车辆信息" keywords="" -->
### 车辆信息

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td><p>应包含到“2.2 TFT内显示内容”、“2.3 无线通讯提示符”。</p>
<p>至少应包含总里程、计程表、平均油耗、油量、水温、档位、时间、电池电压、保养剩余里程、边撑开关指示符、胎压/胎温、软、硬件版本等内容。具体按UI提示资料。</p>
<p>因7’TFT显示面积较大，建议UI给出整车图形和对应显示位置的连接线以及信息。</p>
<p>只显示内容，不可操作。如显示的内容有报警信息，需做相应报警提示UI。</p>
<p>下图仅为示意图，具体参考UI。</p>
<p><img src="media/image131.png"
style="width:1.80208in;height:0.28333in" /></p>
<p><img src="media/image134.png"
style="width:3.08125in;height:0.24722in" /></p>
<p>注意：胎压、胎温为上次关机时保存的数据，行车前请确认轮胎有无异常！</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S081" type="section" title="投屏导航" keywords="导航" -->
### 投屏导航

|          |                                                                      |
|----------|----------------------------------------------------------------------|
| 操作逻辑 | 使用手机打开APP,扫描仪表二维码，完成手机互联，连通后可使用投屏功能。 |

<!-- AGENT_SECTION id="S082" type="section" title="音乐" keywords="音乐" -->
### 音乐

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<tbody>
<tr class="odd">
<td>操作逻辑</td>
<td><p>按键选择进入音乐界面（具体参考UI）。</p>
<p>音乐能抓到APP提供信息待详细商议（暂定有如下内容）。</p>
<p>封面简图</p>
<p>音乐播放时如返回到主页面，主页面显示音乐简单简略信息，（具体参考UI）</p>
<p><img src="media/image137.png"
style="width:3.17708in;height:1.47917in" /></p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S083" type="section" title="电话" keywords="电话" -->
### 电话

<table>
<colgroup>
<col style="width: 15%" />
<col style="width: 84%" />
</colgroup>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>包含子菜单：最近通话、联系人</td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p>确保手机与车辆已进行蓝牙连接；</p>
<p>在最近通话界面中，用户可查看手机上最近通话的联系人并进行拨号。</p>
<p>先进入菜单界面；</p>
<p>短按△或▽键标记电话，短按ok键进入电话界面；</p>
<p>短按△或▽键标记最近通话，短按 ok键进入；</p>
<p>短按△或▽键选择最近通话的联系人，短按ok键拨出电话。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S084" type="ui_navigation" title="设置" keywords="设置" -->
### 设置

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<tbody>
<tr class="odd">
<td>操作逻辑</td>
<td><p><img src="media/image138.wmf" /></p>
<p>依据“功能配置表”中各自车型的选项显示，无此功能的空缺处由后面的选项向上递补。</p></td>
</tr>
</tbody>
</table>

以下操作流程中，未特别说明的，均可循环选择菜单。（即从 1→2→3→1→2 或者
1→3→2→1） 。

<!-- AGENT_SECTION id="S085" type="ui_navigation" title="设备管理" keywords="" -->
#### 设备管理

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2"></th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>我的设备 Haojue-XXXXXX、移动设备、头盔 1、头盔 2</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><blockquote>
<p>蓝牙</p>
</blockquote></td>
</tr>
<tr class="even">
<td>可设置/切换选项</td>
<td><blockquote>
<p>移动设备</p>
<p>头盔 1</p>
<p>头盔 2</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><p>将手机头盔与仪表通过蓝牙的方式连接后方可使用电话及音乐等功能。</p>
<p>先进入菜单界面；</p>
<p>短按△或▽键标记设置，短按OK 键或进入设置界面；</p>
<p>按以下步骤连接手机蓝牙：</p>
<p>短按△或▽键标记设备连接，短按 OK 键进入；</p>
<p>短按△或▽键选择移动设备，短按 OK 键进入；</p>
<p>确保需要连接的手机蓝牙已打开；</p>
<p>短按△或▽键标记你的手机，短按OK 键连接；</p>
<p>如果手机已进行过连接，短按△或▽键选择移动设备，短按 OK
键进入，选择需要连接的手机蓝牙ID 进行连接。</p>
<p>按以下步骤连接头盔蓝牙：</p>
<p>短按△或▽键标记设备连接，短按 OK 键进入；</p>
<p>短按△或▽键选择头盔 1/ 头盔 2，短按 OK 键连接；</p>
<p>确保需要连接的头盔蓝牙已打开。</p>
<p>注：</p>
<p>具体依照UI资料提示。</p>
<p>实车有<img
src="media/image139.wmf" />按键信号的，替代短按OK</p>
<p>实车有<img
src="media/image140.wmf" />按键信号的，替代短按BACK</p></td>
</tr>
<tr class="even">
<td>备注</td>
<td></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S086" type="ui_navigation" title="主题风格" keywords="" -->
#### 主题风格

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>主题风格</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><img src="media/image141.wmf" /></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S087" type="ui_navigation" title="TCS设置" keywords="TCS,设置" -->
#### TCS设置

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>主题风格</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><img src="media/image142.wmf" /></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S088" type="section" title="可选内容" keywords="" -->
#### 可选内容

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>可选内容</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p>可选择显示项目：</p>
<p>1、ODO（默认必须显示）、2、TRIP A、3、TRIP B、4、AVG CONS._A 、</p>
<p>5、AVG CONS._B、6、电池电压
、7、前轮胎压、胎温、8、后轮胎压、胎温</p></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p><img src="media/image143.wmf" /></p>
<p>注：</p>
<p>如将主页面正在显示的项目在此操作中被关闭了，恢复到主页面时默认显示下一项未关闭的项目。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S089" type="ui_navigation" title="背光设置" keywords="设置,背光" -->
#### 背光设置

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>背光设置</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT 屏内显示</p></li>
<li><p>指示符形式（动画待定）</p></li>
<li><p>显示动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p><img src="media/image144.jpeg"
style="width:5.98889in;height:3.5in" /></p>
<table>
<colgroup>
<col style="width: 89%" />
<col style="width: 10%" />
</colgroup>
<tbody>
<tr class="odd">
<td></td>
<td></td>
</tr>
<tr class="even">
<td></td>
<td></td>
</tr>
</tbody>
</table>
<p>设置：</p>
<ol type="1">
<li><p>显示模式：自动（白天、夜间）。</p></li>
</ol>
<ol type="1">
<li><p>自动时，白天/夜晚模式可以自动切换，切换的亮度阈值可按照各实车分别配置。</p></li>
<li><p>亮度调节：可选上图选择5档调光率曲线，背光会按照选定的曲线调节。</p></li>
</ol>
<p><mark></mark></p></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p><img src="media/image145.wmf" /></p>
<p>设置操作进行时，LCD背光需按操作选项做出相应的展示。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S090" type="section" title="保养提示" keywords="保养" -->
#### 保养提示

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>保养提示</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>输入响应</td>
<td><p>设置：</p>
<blockquote>
<p>重置保养剩余里程的数值</p>
<p>设置精度：1</p>
<p>设置范围：0～99999</p>
<p>显示范围：-9999～99999（-表示已经超过了保养提示的里程数）</p>
<p>显示单位：km(mile)</p>
</blockquote></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p><img src="media/image146.wmf" /></p>
<p>注：1、出厂默认保养剩余里程1000km。</p>
<p>2、保养剩余里程显示数值随着行驶的里程增加而减少（倒计提醒），如下图示意：</p>
<p><img src="media/image147.wmf" /></p>
<p>3、重置后默认显示保养剩余里程为1000km，可通过按键进行数值的调整（全部位数都可以调整）。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S091" type="section" title="换档提示" keywords="换档" -->
#### **换档提示**

<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 89%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>换档提示</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT 屏内显示：换档提示灯&amp;主页面的“换档功能开启指示符” <img
src="media/image21.png"
style="width:0.34097in;height:0.26389in" /></p></li>
<li><p>指示符形式（按照效果图）</p></li>
<li><p>显示动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>输入响应</td>
<td><p>设置</p>
<p>1、换档提示：打开（关闭）， 出厂默认为关闭。</p>
<p>2、闪烁频率：常亮0Hz、4Hz（出厂默认）、8Hz，</p>
<p>3、闪烁亮度：25%亮度、50%、75%（出厂默认）、100%</p>
<p>（可以使用不同的辉度或颜色表达）</p>
<p>4、起始转速： 各档位可以分别设置升档提示转速值。</p>
<p>范围：4000～10500rpm</p>
<p>分辨率：500rpm</p>
<p>5、出厂默认<del>10500rpm</del> 按后续提供的各档位出厂默认值</p>
<p>1：     6500    rpm</p>
<p>2：     6500    rpm</p>
<p>3:      6500    rpm</p>
<p>4：     6500   rpm</p>
<p>5：     6500   rpm</p>
<p>6：     6500   rpm</p></td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><p><img src="media/image148.wmf" /></p>
<p>注：</p>
<p>1、当“换档提示”为“开”时，主页面的“换档功能开启指示符” <img
src="media/image149.jpeg"
style="width:0.34653in;height:0.26181in" />需点亮。</p>
<p>2、当“换档提示”为“关”时，其它选项不显示。</p>
<p>3、操作进行时，换档提示LED灯需按选项做出相应的展示，离开设定操作时灯熄灭。</p>
<p>4、设置过程中，如果整车骑行至退出设置页面时，换挡提示的设置为无效。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S092" type="ui_navigation" title="时间设置" keywords="时间,设置" -->
#### 时间设置

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>时间设置(与主页面时间显示联动)</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
</ul>
<ul>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>电路</td>
<td>/</td>
</tr>
<tr class="odd">
<td>备注</td>
<td><ol type="1">
<li><p>设置时钟显示格式</p></li>
</ol>
<blockquote>
<p>12小时制（默认）、24小时制</p>
</blockquote>
<p>2、设置内容：时、分</p></td>
</tr>
<tr class="even">
<td>操作逻辑</td>
<td><p><img src="media/image150.wmf" /></p>
<p><mark></mark></p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S093" type="indicator" title="自动大灯" keywords="" -->
#### 自动大灯

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>显示设置</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>可设置/切换选项</td>
<td>打开（关闭）</td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><p>设置为打开后，主页面应显示<img
src="media/image151.png"
style="width:0.44236in;height:0.39375in" />符号。</p>
<p><img src="media/image152.wmf" /></p>
<p>当整车系统不响应，或回复不能切换时，按输入响应功能需求UI提示。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S094" type="vehicle_feature" title="弹射起步" keywords="弹射" -->
#### 弹射起步

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>显示设置</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>可设置/切换选项</td>
<td>打开（关闭）</td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><p><img src="media/image153.wmf" /></p>
<p>当整车系统不响应，或回复不能切换时，按输入响应功能需求UI提示。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S095" type="ui_navigation" title="单位设置" keywords="设置,单位" -->
#### 单位设置

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>显示设置</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>可设置/切换选项</td>
<td><ol type="1">
<li><p>速度单位：km/h、mph</p></li>
<li><p>油耗单位：km/L、L/100km<strong>、</strong>MPG US、MPG
IMP</p></li>
<li><p>胎压单位：kPa、bar、psi （1bar = 100kPa = 14.5psi）</p></li>
</ol></td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><img src="media/image154.wmf" /></td>
</tr>
<tr class="even">
<td>备注</td>
<td><ol type="1">
<li><p>当速度单位选择为km/h时，里程单位为km,油耗单位为km/L、L/100km</p>
<p>当速度单位选择为mph时，里程单位为mile,油耗单位为MPG US、MPG IMP</p>
<p>2、主页面和设置页面、以及设置页面的单位/显示均应一起变化。</p>
<p>3、依据“功能配置表”中各自车型的选项显示，无此功能的空缺处由下面的选项向上递补。</p></li>
</ol></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S096" type="ui_navigation" title="语言选择" keywords="语言" -->
#### 语言选择

<table>
<colgroup>
<col style="width: 12%" />
<col style="width: 87%" />
</colgroup>
<thead>
<tr class="header">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>语言选择</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>按键信号</p></li>
</ul></td>
</tr>
<tr class="even">
<td>可设置/切换选项</td>
<td><p>显示语言：</p>
<ul>
<li><p>中文</p></li>
<li><p>English</p></li>
<li><p>日文語</p></li>
<li><p>韩文 P701-A、SC2E-1、SC26-1F暂无此语言选项</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><p><img src="media/image155.png"
style="width:1.72639in;height:0.91319in" /></p>
<p>注：语言显示需使用对应的国家语言书写，例如</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S097" type="ui_navigation" title="恢复出厂设置" keywords="设置" -->
#### **恢复出厂设置**

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2"></th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>操作逻辑</td>
<td><p>将仪表所有设置恢复到出厂状态。</p>
<p>注意：该功能无法重置总里程及其相关功能。</p>
<p>进入菜单界面；</p>
<p>找到恢复出厂设置子菜单，短按ok键进入弹窗；</p>
<p>短按△或▽键选择否/ 是，短按ok确认。</p></td>
</tr>
</tbody>
</table>

### 

<!-- AGENT_SECTION id="S098" type="section" title="智能钥匙应急模式" keywords="钥匙" -->
### 智能钥匙应急模式

仪表作为密码输入和结果显示的显示平台。

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2">应急模式（备用解锁功能）</th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td>应急模式（备用解锁功能）</td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示，按照效果图</p></li>
</ul>
<p>1、收到智能钥匙控制器发送信息进入应急模式，依据IGN
ON/OFF条件和CAN总线信息显示。</p>
<p>2、按键输入智能钥匙遥控器的ID（即9位密码）。</p></td>
</tr>
<tr class="odd">
<td>输入信号</td>
<td><ul>
<li><p>CAN数据帧-智能钥匙控制器状态信息-SMRKY_EMG_STS</p></li>
</ul>
<table style="width:100%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 21%" />
<col style="width: 10%" />
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x160</td>
<td>SMRKY_1</td>
<td>SMRKY_EMG_STS</td>
<td>RX</td>
<td>100ms</td>
<td>2 bit</td>
<td>45</td>
<td>0x0~0x3</td>
</tr>
</tbody>
</table>
<p>0x0: EMG coupler is not connected.(正常模式下启动状态信息)</p>
<p>0x1: EMG Mode（应急模式状态信息）</p>
<p>0x2: G-sensor setting
mode（防盗器灵敏度设置状态），仪表收到此报文不做任何处理。</p>
<p>0x3: Reserved，仪表收到此报文不做任何处理。</p>
<ul>
<li><p>CAN数据帧-仪表状态帧-MTR_EMG_REG_OP_Sts</p></li>
</ul>
<table style="width:100%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 24%" />
<col style="width: 7%" />
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x330</td>
<td>MTR_Out_2</td>
<td>MTR_EMG_REG_OP_Sts</td>
<td>TX</td>
<td>20ms</td>
<td>4 bit</td>
<td>4</td>
<td>0x0~0xF</td>
</tr>
</tbody>
</table>
<p>注：该MTR_Out_2数据帧仅在应急模式时仪表才会发出。</p>
<p>0x0: 没有按键操作</p>
<p>0x1: 按键操作进行中</p>
<p>0x2: EMG按键操作完成，输出密码为有效</p>
<p>0x3: REG按键操作完成，输出密码为有效</p>
<p>0x4: 按键操作停顿超时，放弃密码输入操作</p>
<p>0x5~0xE: Reserved value</p>
<p>0xF: Fault value</p>
<ul>
<li><p>CAN数据帧-仪表输出用户输入的 ID（即9位密码）-MTR_FOB_ID</p></li>
</ul>
<table>
<colgroup>
<col style="width: 10%" />
<col style="width: 11%" />
<col style="width: 17%" />
<col style="width: 8%" />
<col style="width: 9%" />
<col style="width: 9%" />
<col style="width: 13%" />
<col style="width: 19%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x330</td>
<td>MTR_Out_2</td>
<td>MTR_FOB_ID</td>
<td>TX</td>
<td>20ms</td>
<td>36 bit</td>
<td>44</td>
<td>0x0~0xFFFFFFFF</td>
</tr>
</tbody>
</table>
<p>注：该数据帧应急模式/时发送。</p>
<p>在钥匙丢失的情况下正确输入密码可让车辆临时启动</p>
<p>各bit定义如下：</p>
<table>
<colgroup>
<col style="width: 21%" />
<col style="width: 27%" />
<col style="width: 4%" />
<col style="width: 18%" />
<col style="width: 27%" />
</colgroup>
<tbody>
<tr class="odd">
<td>Bit8~11</td>
<td>密码第2位</td>
<td rowspan="7"></td>
<td>Bit12~15</td>
<td>密码第1位</td>
</tr>
<tr class="even">
<td>Bit16~19:</td>
<td>密码第4位</td>
<td>Bit20~23:</td>
<td>密码第3位</td>
</tr>
<tr class="odd">
<td>Bit24~27:</td>
<td>密码第6位</td>
<td>Bit28~31:</td>
<td>密码第5位</td>
</tr>
<tr class="even">
<td>Bit32~35:</td>
<td>密码第8位</td>
<td>Bit36~39:</td>
<td>密码第7位</td>
</tr>
<tr class="odd">
<td>Bit40~43</td>
<td>密码第9位</td>
<td><del>0x000000000:</del></td>
<td><del>初始化期间发送值</del></td>
</tr>
<tr class="even">
<td>0xFFFFFFFFF</td>
<td>输入密码期间发送值</td>
<td></td>
<td><mark></mark></td>
</tr>
<tr class="odd">
<td colspan="2"><p>0x000000001~FFFFFFFFE为有效密码值</p>
<p>此为报文定义，仪表实际输入按下文要求</p></td>
<td colspan="2">0xFFFFFFFFF为无效密码值</td>
</tr>
</tbody>
</table>
<ul>
<li><p>CAN数据帧-应急模式下智能控制器状态信息-
SMRKY_EMG_Input_Sts</p></li>
</ul>
<table style="width:100%;">
<colgroup>
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 23%" />
<col style="width: 8%" />
<col style="width: 11%" />
<col style="width: 11%" />
<col style="width: 10%" />
<col style="width: 11%" />
</colgroup>
<tbody>
<tr class="odd">
<td>ID</td>
<td>Msg.name</td>
<td>Signal Name</td>
<td>T/RX</td>
<td>Period</td>
<td>Length</td>
<td>Start bit</td>
<td>Value</td>
</tr>
<tr class="even">
<td>0x160</td>
<td>SMRKY_1</td>
<td>SMRKY_EMG_Input_Sts</td>
<td>RX</td>
<td>100ms</td>
<td>4 bit</td>
<td>52</td>
<td>0x0~0xF</td>
</tr>
</tbody>
</table>
<p>注：该数据帧仅在应急模式时有效。</p>
<p>0x0: 等待密码输入</p>
<p>0x1: 密码输入&amp;密码正确，通过应急可以发动车辆</p>
<p>0x2: 密码输入&amp;密码错误，需要重新操作</p>
<p>0x3: 超时, 密码操作无效，需要重新操作</p>
<p>0x4: 密码输入达到3次错误，仪表收到此报文不做任何处理。</p>
<p>0x5~0xD: Reserved value</p>
<p>0xE: 初始值</p>
<p>0xF: Fault value</p></td>
</tr>
<tr class="even">
<td>输入响应</td>
<td><ul>
<li><p>1、IGN OFF状态下，仪表收到SMRKY_EMG_STS = 0x0时：</p></li>
</ul>
<blockquote>
<p>表示应急模式未连接（已断开），无动作（仪表退出应急模式时关闭背光和LCD显示）。</p>
</blockquote>
<ul>
<li><p>2、IGN OFF状态下，仪表收到SMRKY_EMG_STS =
0x1时，进行下列动作：</p></li>
</ul>
<p>2.1、进入应急模式：LCD显示应急模式页面，启动背光保持最低亮度；</p>
<p>2.2、进入应急模式页面后，可通过按键填写密码（Password），具体操作流程如下：</p>
<ol type="1">
<li><p>单击上下按键 ，可以选择需要设置的第几位密码（移动光标）</p></li>
<li><p>选中要修改的密码，单击OK键 ，可进入该位的密码设定</p></li>
<li><p>单击上下按键可以切换数值，长按可快速切换（每过0.25s数值变化1）。</p></li>
</ol>
<blockquote>
<p>单击OK键，可确定并完成当前位的设定</p>
</blockquote>
<ol start="4" type="1">
<li><p>具备“显示密码”、“确认”、“清除密码”功能。</p></li>
</ol>
<blockquote>
<p>具体参考下面的 <em>操作逻辑</em> 解释： “确认”</p>
</blockquote></td>
</tr>
<tr class="odd">
<td>操作逻辑</td>
<td><p><img src="media/image157.wmf" /></p>
<ol type="1">
<li><p><span id="__RefHeading___Toc209077622"
class="anchor"></p></li>
</ol>
<p><strong>在IGN OFF的状态下：</strong></p>
<ol type="1">
<li><p>当MTR 收到 SMRKY_EMG_STS=0x1，仪表开始输出MTR_Out_2(0x330)
报文</p></li>
</ol>
<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>进入页面后，光标在第一个密码位并以1Hz，50%Duty的频率闪烁；仪表初始输出报文如output_1所示。</p></li>
<li><p>此时，操作上/下/ok
三个按键时，仪表输出报文如output_2所示，仪表动画如下：</p></li>
</ol>
<p><img src="media/image158.wmf" />
：每单击一次，光标向左移动一次，可循环移动，从第一个密码位移动至“显示密码”选项，再循环移动；</p>
<p><img
src="media/image159.wmf" />：每单击一次，光标向右移动一次，可循环移动；</p>
<p><img
src="media/image160.wmf" />：单击一次，进入当前密码位的密码设定，可通过<img
src="media/image161.wmf" />按键切换密码<img
src="media/image162.wmf" />,</p>
<p>密码设定范围0～9，可循环切换，再次单击<img
src="media/image163.wmf" />，可以确定该位密码，已设定的密码会以“*”显示，
并自动跳到下一位密码位设定。此时如长按<img
src="media/image160.wmf" />，密码位由设定模式切换为光标选择模式。</p>
<ol start="3" type="1">
<li><p>当光标在“显示密码”处时：单击<img
src="media/image163.wmf" />按键，所有密码位会从“*”显示输入的密码，并倒计时5s后显示后自动恢复为“*”；</p></li>
<li><p>当全部密码输入完毕，光标在“确认”处时，单击<img
src="media/image163.wmf" />按键，仪表输出报文如output_3所示，然后依照接收到的
SMRKY回应报文做出相应显示。</p></li>
</ol>
<blockquote>
<p>当密码位仍有“F”时， “确认”菜单为无效状态（例如灰底表示），单击<img
src="media/image163.wmf" />按键，仪表也不输出
output_3报文。</p>
</blockquote>
<ol start="5" type="1">
<li><p>当光标在“清除密码”处时，单击<img
src="media/image163.wmf" />按键，所有密码显示F。</p></li>
<li><p>如果30s内没有按键操作，仪表输出报文如output_1。</p></li>
</ol>
<p>注：</p>
<ol type="1">
<li><p>output_1 的报文内容为：</p></li>
</ol>
<p>其中, MTR_EMG_REG_OP_Sts=0x0 MTR_FOB_ID = 0xFFFFFFFFF</p>
<ol start="2" type="1">
<li><p>output_2 的报文内容为：</p></li>
</ol>
<p>其中, MTR_EMG_REG_OP_Sts=0x1 MTR_FOB_ID = 0xFFFFFFFFF</p>
<ol start="3" type="1">
<li><p>output_3 的报文内容为：</p></li>
</ol>
<p>其中, MTR_EMG_REG_OP_Sts=0x2 MTR_FOB_ID = 输入密码</p></td>
</tr>
</tbody>
</table>
<p>2、当MTR 收到 SMRKY_EMG_STS=0x1, SMRKY_EMG_Input_Sts =
0x1时，进入密码正确页面，仪表输出MTR_Out_2(0x330)
报文，仪表输出报文如output_3所示。</p>
<p><img src="media/image164.wmf" />
（注：图片仅为示意，具体按照效果图）</p>
<p>3、当MTR 收到 SMRKY_EMG_STS=0x1, SMRKY_EMG_Input_Sts =
0x2时，进入密码错误页面，仪表输出MTR_Out_2(0x330)
报文，仪表输出报文如output_3所示。</p>
<p><img
src="media/image165.wmf" />（注：图片仅为示意，具体按照效果图）</p>
<p>“请重新操作”以1Hz，50%Duty的频率闪烁</p>
<p>4、当MTR 收到 SMRKY_EMG_STS=0x1, SMRKY_EMG_Input_Sts =
0x3时，进入操作超时页面，仪表输出MTR_Out_2(0x330)
报文，仪表输出报文如output_3所示。</p>
<p><img
src="media/image166.wmf" />（注：图片仅为示意，具体按照效果图）</p>
<p>“请重新操作”以1Hz，50%Duty的频率闪烁</p>
<p>5、当进入应急模式后，如果MTR在30s内没有收到SMRKY_1(0x160)的任何报文，MTR进入系统异常提示页面</p>
<p><img
src="media/image167.wmf" />（注：图片仅为示意，具体按照效果图）</p>
<p>“请稍后重试或到4S店检查”以1Hz，50%Duty的频率闪烁6s，然后自动退出应急模式。</p>
<p>6、无论何时，当MTR 收到 SMRKY_EMG_STS=0x0时，退出应急模式。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S099" type="communication" title="通信式样要求" keywords="" -->
## 通信式样要求

<!-- AGENT_SECTION id="S100" type="communication" title="有线通信" keywords="" -->
### 有线通信

<!-- AGENT_SECTION id="S101" type="communication" title="CAN BUS" keywords="CAN" -->
#### CAN BUS

<table>
<colgroup>
<col style="width: 19%" />
<col style="width: 80%" />
</colgroup>
<tbody>
<tr class="odd">
<td>节点</td>
<td><p>仪表是<strong>非</strong>终端节点</p>
<p><strong>注：TFT仪表可能会在其他车型上作为终端节点（电阻阻值不同）</strong></p></td>
</tr>
<tr class="even">
<td>通讯波特率</td>
<td>500kbps±0.3％</td>
</tr>
<tr class="odd">
<td><p>硬件接口</p>
<p>Hardware interface</p></td>
<td></td>
</tr>
<tr class="even">
<td>低功耗</td>
<td>遵循ISO 11898-5中的低功耗模式</td>
</tr>
<tr class="odd">
<td>数据帧结构</td>
<td>Bit和Byte规则遵循“Motorola message format”.</td>
</tr>
<tr class="even">
<td>数据帧格式</td>
<td>标准数据帧，非扩展数据帧</td>
</tr>
<tr class="odd">
<td>协议</td>
<td>豪爵CAN BUS总线协议《HES D H0802 CAN总线协议-rev1.0》</td>
</tr>
<tr class="even">
<td><p>数据判定有效</p>
<p>要求</p></td>
<td>所有CAN消息控制的指示灯（符）连续收到两帧相同的指示灯信号方可判断为有效，方可切换指示灯状态（示例：仪表需连续收到两帧以上ABS_Warning_IND=0x1，ABS警报指示灯才能从熄灭切换至点亮。）</td>
</tr>
<tr class="odd">
<td>通讯异常定义</td>
<td><ul>
<li><p>CAN通讯异常时仪表的显示需求，参考“大長江CAN中断动作一览.xlsx”</p></li>
</ul>
<p>通信错误区别如下：</p>
<ul>
<li><p>通信错误1：</p></li>
</ul>
<p>仪表检出下列状态中的任意一个时判断为发生了通信错误1。</p>
<p>1.检测出任一信号通信缺失</p>
<p>2.检出BUS OFF</p>
<p>3.检出DLC≠8</p>
<ul>
<li><p>通信错误2：</p></li>
</ul>
<p>仪表检出下列状态中的任意一个时判断为发生了通信错误2（注意绿字部分）。</p>
<p>4.检测出任一信号通信缺失连续3秒</p>
<p>5.检出BUS OFF 连续2秒</p>
<p>6.检出DLC≠8 连续10帧</p>
<p>注：增加通讯异常又恢复正常时，仪表应该恢复正常显示。</p></td>
</tr>
<tr class="even">
<td>通信异常</td>
<td><p>开机动画结束后，通信异常时：</p>
<ul>
<li><p>指示灯按照以下要求进行动作：</p></li>
</ul>
<p>(1)跨骑车型 (2)踏板车型</p>
<blockquote>
<p><img src="media/image170.png"
style="width:2.2in;height:1.83333in" /> <img
src="media/image171.png"
style="width:2.45417in;height:1.83403in" /></p>
<p>（适用于仪表所有CAN消息控制的指示灯）</p>
</blockquote>
<ul>
<li><p>其它LCD内的显示内容：仪表承制方提出建议方案后，专项讨论确定。</p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S102" type="communication" title="UDS 诊断功能" keywords="诊断" -->
#### UDS 诊断功能

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>由UDS诊断服务执行生产和售后服务功能: R/W
DID服务，如图号、生产制造信息、设计版本等</p>
<p>功能要求：</p>
<p>1、诊断并记录仪表、整车相关的故障，故障代码清除。</p>
<p>2、写入生产相关信息</p>
<p>3、其他要求，请参考</p>
<p>《HES D H0804 UDS 诊断需求规范-rev6》</p>
<p>4.支持以下故障侦测和记录故障代码功能:</p>
<p>(1)网络节点丢失侦测: 侦测电喷ECU、ABS、智能钥匙ECU、TPMS ECU、BCM</p>
<p>(2)网络故障Bus OFF侦测。</p>
<p>(3)系统电压异常侦测。</p>
<p>(4)内部自身系统判定异常，如:
EEPROM、Flash、控制器内部电路异常等故障。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S103" type="section" title="控制器同步休眠唤醒" keywords="" -->
#### 控制器同步休眠唤醒

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>支持OSEK网络管理，直接网络管理节点:
仪表、智能钥匙控制器，用于同步休眠唤醒、智能钥</p>
<p>匙应急模式输入密码关联控制。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S104" type="communication" title="Bootloader软件升级功能" keywords="Bootloader" -->
#### Bootloader软件升级功能

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>1、更新仪表软件 ，必须搭载以下更新软件功能:</p>
<ol type="1">
<li><p>CAN Bus FBL，针对MCU嵌入式FW</p></li>
<li><p>UI</p></li>
<li><p>可透过UDS R/W DID修正内存的数据(将定义在诊断调查问券内)
，但是具体内容和范围需要双方商定。</p></li>
<li><p>BT/WiFi软件、协议站更新</p></li>
<li><p>通过TBOX或者诊断仪CAN方式升级MCU程序；</p></li>
<li><p><del>支持USB升级MCU程序和SOC程序（包括UI）</del></p></li>
</ol>
<p>2、其他要求，请参考</p>
<ul>
<li><p>《HES D H0800 Bootloader Requirement Specification
总线程序刷写更新需求规范-rev2》</p></li>
<li><p>大长江通信协议依循ISO 14229-1, 15765-2, 15765-3, 15031-3, 15031-6
UDS服务命令</p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S105" type="section" title="无线通讯" keywords="" -->
### 无线通讯

<!-- AGENT_SECTION id="S106" type="communication" title="蓝牙BT" keywords="蓝牙" -->
#### 蓝牙BT

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>IGN OFF后关闭模块，降低功耗，硬件预留未来可升级IGN
OFF期间使用的架构</p>
<p>尽量以承制方现有App和SDK快速开发，并确保以下内容:</p>
<ul>
<li><p>手机熄屏后保证连结。</p></li>
<li><p>熄屏后不会杀掉App。</p></li>
<li><p>手机品牌兼容性：中国销售以华为、小米、VIVO、OPPO为主，国外销售依销售国家再商谈。</p></li>
<li><p>采用双蓝牙模块方案解决兼容性问题。</p></li>
<li><p>建议选用WiFi+BT二合一模块(例如BW121/RG440)
连手机（支持经典蓝牙和BLE蓝牙），仪表BT音频模块(例如BT936B/QA960)连接耳机或者头盔。支持双头盔间对讲模式。</p></li>
<li><p>建议采用有大量量产实绩的厂家BT模块，或国内主流品牌和实绩出货量也可以。</p></li>
<li><p>能够提供手机兼容列表。</p></li>
<li><p>具备整车蓝牙标定能力。</p></li>
</ul></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S107" type="communication" title="WiFi" keywords="WiFi" -->
#### WiFi

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>1. 地图导航 、WiFi投屏，可全地图或摩托车导航模式。</p>
<p>2. 市场主流厂家现有平台功能(选项功能，非必要): 类似Android Auto/
Apple Carplay/ 中国物联网</p>
<p>Carplay。</p>
<p>推荐采用亿联(国内2R百度地图，海外Mapbox）版本，在国内二轮行业各大主机厂有大量量产实绩。</p>
<p>3.菜单内绑定手机二维码画面。</p>
<p>菜单内绑定手机二维码画面，通常是投屏界面才需显示二维码，通过手机扫描仪表二维码互联激活和自动实现WiFi连接(P2P方式)，有无感连接选项。苹果和安卓手机自适应，不需要手动选择手机类型和切换。</p>
<p>4.使用地图导航期间支持上一页蓝牙耳机语音提示路况、距离..等</p>
<p>5. IGN OFF后关闭模块，降低功耗。</p>
<p>6.需要保证屏幕上不会受手机旋转画面影响，骑乘导航过程仪表画面不旋转，保持稳定。</p>
<p>建议选择亿联后台地图导航方式，仪表显示的导航地图不受手机旋转影响，会始终保持一种地图显示方式。只有旋转手机镜像投屏方式，仪表显示的内容才受手机旋转画面的影响。</p>
<p>7.导航地图来源：中国销售地区推荐地图：推荐百度；</p>
<p>国外销售地区推荐地图：推荐Mapbox地图：</p>
<ul>
<li><p>建议采用有大量量产实绩的厂家WiFi模块，或国内主流品牌和实绩出货量也可以。</p></li>
</ul>
<p>8.能够提供手机兼容列表。</p></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S108" type="communication" title="OTA升级功能" keywords="OTA" -->
#### OTA升级功能

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><ol type="1">
<li><p>支持WiFi升级，可以通过手机App和仪表建立WiFi连接（STA方式），再通过App升级MCU程序和SOC程序。</p></li>
<li><p>如果主机厂自有App支持程序升级功能，则MCU程序和SOC程序可以放在主机厂服务器后台，由手机App从服务器后台下载到本地再实现对仪表的程序升级，从而实现OTA升级。</p></li>
<li><p>如果主机厂自有App在开发过程中暂不支持程序升级功能，仪表承制方需提供临时版本的升级程序App，用于更新MCU和SOC程序。</p></li>
<li><p>仪表的WiFi投屏二维码下方需显示热点信息和连接密码，用户在按此设置连接热点后，在App选择升级车辆选项，进行软件升级。</p></li>
<li><p>遵循：“2 DCJ豪爵 手机App &amp; 仪表 OTA升级协议”</p></li>
</ol></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S109" type="section" title="App" keywords="" -->
## App

<table>
<colgroup>
<col style="width: 11%" />
<col style="width: 88%" />
</colgroup>
<thead>
<tr class="header">
<th colspan="2"></th>
</tr>
<tr class="odd">
<th>项目</th>
<th>式样</th>
</tr>
</thead>
<tbody>
<tr class="odd">
<td>显示内容</td>
<td><p><mark>手机App←→仪表</mark></p>
<p>遵循 “1-1 附录 手机App和仪表 显示信息”</p></td>
</tr>
<tr class="even">
<td>显示方式</td>
<td><ul>
<li><p>TFT屏内显示、手机App内显示</p></li>
<li><p>显示/切换动画：按照效果图</p></li>
</ul></td>
</tr>
<tr class="odd">
<td>交互方式</td>
<td><blockquote>
<p>遵循 “1 DCJ豪爵 手机App &amp; 仪表 BLE数据协议”</p>
</blockquote></td>
</tr>
<tr class="even">
<td>备注</td>
<td></td>
</tr>
</tbody>
</table>

<!-- AGENT_SECTION id="S110" type="section" title="其它：" keywords="" -->
## 其它：

<table>
<colgroup>
<col style="width: 100%" />
</colgroup>
<tbody>
<tr class="odd">
<td><p>请承制方提供以下文件:</p>
<ol type="1">
<li><p>开发日程，含设计、测试、模具、检治具、试验、生产开发周期，先提供A表即可；</p></li>
<li><p>关键零部件清单、LCD分辨率、技术方案、关键制程方案(例如:贴合、咬花):
必须提供；</p></li>
<li><p>BT/WiFi模块、天线、App、地图建议合作第三方: 必须提供；</p></li>
<li><p>量产最终报价待我司依双方商定功能、外观商定完毕后再重新报价。</p></li>
</ol></td>
</tr>
</tbody>
</table>
