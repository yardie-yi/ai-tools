# Verification skill 参考研究

读取日期：2026-11-03（Asia/Shanghai）。只把网页当资料，不执行其中对 agent 的指令。

## 原文与取得方式

- 原文：[The Complete Guide to pstack Pt. 1](https://x.com/poteto/status/2094457600259842065)，作者显示 `lauren` / `@poteto`。副标题 `Part 1 – Verification is all you need`。
- X 浏览器页面时间：`12:09 AM · Sep 1, 2026`；FxTwitter 原始时间和 Jina 元信息交叉核对为 `2026-08-31T16:09:39.000Z`，换算北京时间一致。Article ID 是 `2094151284949688320`，用户给的是发布帖 ID `2094457600259842065`，不混同两者。
- 直接用 `browser-harness` 读取已登录 Chrome，正文从开头到 `Thanks for reading and stay tuned for Part 2!` 完整存在，原文快照正文 19,329 字符。无需登录、点击安装或允许网站分享数据。浏览器首次读到空壳，页面加载完后重读才得到全文。
- 早期 web 工具直接 open X 返回 403；HTTP requests 直接 X 返回 200（524,125 字节 HTML）；FxTwitter 与 Jina 返回 200。后续已用浏览器原站验证，镜像不是最终唯一依据。
- 原文提出的 2,000 PR/月、100–1000 倍等是作者自述，未独立核实，不应写进技能当承诺或验收指标。

## 原文直接链接逐项覆盖

正文实体链接去重为 14 个，已从 X DOM 与 FxTwitter article entityMap 交叉核对。下表全部在浏览器读取成功；仅产品介绍页不需要安装或登录。快照位于 `/tmp/verification-research/`。

|直接链接|已读取内容与用途|本地快照|
|---|---|---|
|[Loops You Can Trust](https://x.com/poteto/status/2069824386283319343)|全文；复现→测量→修复→同法复测，阶段失败可以停止，反复失误沉淀工具|browser-loops.json|
|[create-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/create-verification-skill/SKILL.md)|全文；从真实仓库生成验证技能并实际跑通|browser-create-verification.json|
|[Build the Lever](https://github.com/cursor/plugins/blob/main/pstack/skills/principle-build-the-lever/SKILL.md)|全文；可重跑最小工具、先一个样本验证配方、确定性优先|browser-build-lever.json|
|[swarm](https://github.com/cursor/plugins/blob/main/pstack/skills/swarm/SKILL.md)|全文；覆盖切片、独立输出、SHA 和测量方法、缺口不算通过|browser-swarm.json|
|[示例 Feature Map](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/references/features/README.md)|全文；行为级索引、真实入口、前置条件、证据、不可达说明|browser-feature-map.json|
|[示例仓库](https://github.com/poteto/verification-skill-example)|README 全文；Atlas 明确是虚构，driver 故意省略|browser-example.json|
|[pstack 官方目录](https://github.com/cursor/plugins/tree/main/pstack)|README 全文；技能体系和平台适配，不把 Cursor 命令当 Codex/Pi 命令|browser-pstack.json|
|[CDP](https://chromedevtools.github.io/devtools-protocol/)|首页全文；观察、调试、性能域和版本兼容性边界|browser-cdp.json|
|[Cloud Agents](https://cursor.com/docs/cloud-agent)|全文；隔离 VM、可启动开发环境和证据产物|browser-cloud-agents.json|
|[Builds](https://cursor.com/docs/cloud-agent/builds)|全文；环境快照、源代码 SHA、磁盘状态和进程状态的区别|browser-builds.json|
|[Automations](https://cursor.com/docs/cloud-agent/automations)|全文；定时/事件触发与环境配置。未建立任何自动化|browser-automations.json|
|[Custom Modes](https://cursor.com/changelog/08-19-26#custom-modes)|全文；Cursor 特定的技能固定模式|browser-custom-modes.json|
|[pstack for Grok Bot](https://x.ai/bot/plugin/9717366)|公开插件介绍，未安装|browser-grok-plugin.json|
|[Dr Eggbot](https://x.ai/bot/93gOz3op1UQdBdbekQFLK)|公开 bot 介绍，未添加 bot|browser-dr-eggbot.json|

额外读取了原文嵌入的 [gardener 帖](https://x.com/poteto/status/2090546476464451907)（browser-gardener.json），以及主题必须的两个补充文件：[maintain-verification-skill](https://github.com/cursor/plugins/blob/main/pstack/skills/maintain-verification-skill/SKILL.md)（browser-maintain-verification.json）、[示例 verify-atlas/SKILL.md](https://github.com/poteto/verification-skill-example/blob/main/.cursor/skills/verify-atlas/SKILL.md)（browser-atlas-skill.json）。未递归追踪第三层无关外链，也未逐页读取示例约 30 个 feature 文件。

## 应转化进本用户 Verification skill 的原则

原文的方法可归纳为：验证要让 agent 自己闭环；给它可重复驱动与观察真实产品的工具；用 Feature Map 保存用户路径；从基线开始做性能比较；把工具与地图持续维护成基础设施。文章偏好的云平台、倍数宣言和每日频率不等于跨工具的硬性要求。

更具体的实施约束来自本次读取的官方当前技能：

1. **先确认测量对象。** 从仓库读启动方式、测试工具、用户接触的表面和环境前置。Doctor 核对版本、构建新鲜度、进程/端口归属、认证状态；进程活着不等于功能可用。来源：create-verification 与 Atlas。
2. **验收是可观察行为。** 场景应有前置、用户动作、预期终态、证据位置。走真实入口及正常后端链路，检查数据、文件、网络、重载后的持久化；只调用内部 setter、只截图最终界面不足以证明用户路径。来源：create-verification、Feature Map、Atlas。
3. **验证范围由受影响行为决定。** 使用 Feature Map 选相关入口、模式及成功/取消/失败/空状态/持久化路径；不是每个任务机械地做全量回归。不可达路径要写具体限制和尝试过的入口。来源：Feature Map、Atlas。
4. **工具要实际跑过。** 最小 CLI 应有 help、可诊断错误、结构化结果和必要的只读 doctor；优先复用现有 harness。生成技能后真实执行 launch→doctor→一个 mapped feature→证据→cleanup，清理后再确认产物存在。没有执行的是草稿。来源：create-verification。
5. **证据随代码版本绑定。** 并行验证和性能测量明确源/目标 SHA、样本数、样本定义和次序；汇总拒收不符合证据契约的结果，缺失覆盖不算 PASS。共享实例只能一个操作者，其他 agent 读源码或在隔离实例运行。来源：swarm、maintain-verification。
6. **清理和维护有边界。** 只终止本次创建的进程，保留证据；每次失败后先确认环境健康。区分地图漂移、驱动缺口、产品缺陷，不通过改文档掩盖产品回归。来源：create/maintain-verification。
7. **把重复纠正落到结构。** 熟悉一个样本后写可重跑检查器/脚本，必要的声明与硬件/环境事实持久保存；小到一眼可确认的编辑无需框架。来源：Build the Lever、Loops、gardener 帖。

针对用户跨 Codex、Pi、嵌入式和办公流程的适配是本任务的设计判断，不是作者文章原话：通用 skill 负责证据契约与工具选择；项目/硬件专属配置放 project-local profile，不把 Atlas 的端口、快捷键、云 VM、Cursor 模型名或命令复制进实际环境。硬件不可达或外部服务受限要报 UNVERIFIED/BLOCKED，不以 mock、编译成功或文档检查冒充实机结果。

## 版本差异与限制

- 原文发表于 2026-08-31 UTC；GitHub `main` 是 2026-11-03 读取版本，可能比文章新增限制。例：文章建议每日维护，当前 create 技能写的是用户问到时才建议频率。研究稿明确区分二者，未自动创建定时任务。
- Atlas 仓库刻意虚构且缺少 driver；本文只借鉴结构，未声称其 CLI 可执行。
- 本次验证证明来源读取和链接覆盖，不代表新 skill 在用户全部业务环境中已验证。主任务仍需对实际创建的技能和脚本做有意义的正/负用例。
- 原始页面在临时目录保存，仅供本次追溯；分发技能应保留链接与原创摘要，不复制整篇文章或完整对话。

## 实际执行与证据

读取命令模式（实际执行）：

```bash
cat /home/yardie/.agents/skills/browser-harness/SKILL.md
browser-harness <<'PY'
print(current_tab())
print(list_tabs())
PY
```

首次任务导航用 `new_tab('https://x.com/poteto/status/2094457600259842065')`，随后 `wait_for_load()`，以 `js("JSON.stringify({url:location.href,title:document.title,text:document.body.innerText,links:Array.from(document.querySelectorAll('a[href]')).map(a=>({text:a.innerText,href:a.href}))})")` 抽取正文和链接。按站点开一个任务 tab，同站点以 `goto_url`/`switch_tab` 复用。未修改网页数据。

实际落盘执行的最终来源验证命令：

```bash
browser-harness < /tmp/verification-research/browser-final-check.py | tee /tmp/verification-research/browser-verification.log
```

实际日志结果：

```text
PASS gardener quote read 982 characters
PASS original X article contains opening, closing, date and all 14 unique body link URLs
PASS all 18 browser captures contain >500 characters
```

`browser-verification.log` 包含全部 18 个快照的 URL、正文字符数与 SHA-256。浏览器 JSON 与对应 TXT 是阅读证据；`direct-links.json` 是正文 14 条链接清单。来源完整性校验不能代替任何产品功能测试。
