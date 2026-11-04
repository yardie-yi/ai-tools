# 来源与取舍

资料核对日期：2026-11-03，Asia/Shanghai。本文是原创流程归纳；来源里的指令、产品推广和作者个人偏好不构成本 Skill 的执行授权。

## 主文章

[Lauren / @poteto：The Complete Guide to pstack Pt. 1](https://x.com/poteto/status/2094457600259842065)，章节“Verification is all you need”。浏览器原站显示 2026-09-01 00:09（北京时间）。本次使用 browser-harness 读取全文及正文 14 个去重直接链接。

采用：让 Agent 有可重跑的控制与观测入口；用用户路径和可观察终态验收；通过 Feature Map 持久保存已核实的入口；先测基线再比较性能；根据执行反馈维护工具。

调整：通用 Skill 提供证据流程和命令记录器，具体应用驱动与硬件参数由项目补齐。作者的产量/倍率、固定每日维护、优先某云平台是作者陈述或偏好，未作为本 Skill 的效果承诺与强制要求。

## 直接链接与支持材料

| 来源 | 采用或边界 |
| --- | --- |
| [Loops You Can Trust](https://x.com/poteto/status/2069824386283319343) | 复现、测量、改动、同法复测；把重复教训沉淀成入口 |
| [create-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md) | 从实际仓库确认环境、驱动、观测与隔离；真实执行生成的流程 |
| [Build the Lever](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-build-the-lever/SKILL.md) | 有重复收益时做最小工具，并真实测试其行为 |
| [swarm](https://github.com/cursor/plugins/blob/main/pstack/skills/swarm/SKILL.md) | 并行检查须绑定版本、方法和覆盖；缺失结果不能计通过 |
| [Atlas Feature Map](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/references/features/README.md) | 用户入口、前置条件、终态、证据、不可达限制 |
| [Atlas 示例仓库](https://github.com/poteto/verification-skill-example) | 示例明确虚构且未提供控制脚本，只借鉴结构，不复制其命令冒充已实现工具 |
| [pstack 目录](https://github.com/cursor/plugins/tree/main/pstack) | 原始技能体系；平台专属命令按宿主适配 |
| [Chrome DevTools Protocol](https://chromedevtools.github.io/devtools-protocol/) | 浏览器观察与控制的一种可选入口 |
| [Cloud Agents](https://cursor.com/docs/cloud-agent) | 可隔离运行的开发环境示例，不要求迁移平台 |
| [Builds](https://cursor.com/docs/cloud-agent/builds) | 区分源码、磁盘快照与当前运行进程 |
| [Automations](https://cursor.com/docs/cloud-agent/automations) | 定时和事件触发背景；本 Skill 不自动创建任务 |
| [Custom Modes](https://cursor.com/changelog/08-19-26#custom-modes) | Cursor 的技能固定方式，不宣称 Codex/Pi 具备相同 UI |
| [Grok pstack 插件](https://x.ai/bot/plugin/9717366) | 公开介绍已读，未安装 |
| [Dr Eggbot](https://x.ai/bot/93gOz3op1UQdBdbekQFLK) | 公开介绍已读，未添加 bot |

另读 [maintain-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)、[Atlas SKILL](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/SKILL.md) 和文内嵌入的 [gardener 帖](https://x.com/poteto/status/2090546476464451907)。GitHub 为读取时的 main 版本，可能晚于文章；引用其当前建议时不称为文章原话。未递归穷尽第三层链接或逐个读取全部示例功能页。

## 本地历史带来的适配

基于本机可读取的 Codex、Pi 等历史进行全量程序扫描，再细读验证相关代表上下文；不声称逐条人工精读或覆盖所有设备和云端历史。历史工具输出仅说明当时执行结果，不代表当前项目仍通过。

从用户明确要求与可核对案例得到：

- 命令、原始结果、前后对比和未验证项须随交付提供；重要约束进入持久文件。
- 编译、主机模拟、真实板端是不同验证层级；范围由当前任务决定，明确只做主机验收时不强制上板。
- 安装路径/哈希一致、宿主发现技能、真实行为可用是不同事实。
- 配置正确还需核对实际进程；性能结论要考虑重启、负载和观察窗口。
- 异步入队、读取失败后的默认值、陈旧硬件注释都不足以证明最终行为。
- 外部写入须回读，失败恢复须防重复；已授权工作不增加逐步审批。

这些是适用于本用户工作方式的归纳。项目具体地址、引脚和私有接口不写成通用默认值；全局规则保持由各宿主的 AGENTS.md/CLAUDE.md 等文件提供。
