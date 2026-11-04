# Verification skill：来源、实现与验证记录

日期：2026-11-03，Asia/Shanghai。交付入口：[SKILL.md](../../skills/verification/SKILL.md)。

## 交付与使用

新建可复用的 `verification` Skill，核心流程为：确定独立验收依据 → 选择并执行适当检查 → 观察真实后置状态 → 修复/复测或准确报告失败 → 保存证据和项目约束。

支持工程/板端/性能、远端写入与文档等不同分支；项目专属硬件、地址、接口与控制工具由项目资料提供。附带一个已执行测试的 Python 标准库命令记录器，保留退出码、输入前后指纹、完整日志与时间，不把退出码 0 自动解释为业务通过。

唯一源目录为仓库 `skills/verification`。下列入口均是指向它的符号链接，避免多份规则漂移：

- `/home/yardie/.codex/skills/verification`
- `/home/yardie/.pi/agent/skills/verification`
- `/home/yardie/.claude/skills/verification`

Codex 可显式请求：`使用 $verification 验证当前改动，给出实际命令、结果、前后对比和未验证项。` 其他宿主可按其技能调用方式使用 `verification`，或直接要求读取上述 `SKILL.md`。保留自动选择默认设置；未改全局 AGENTS/CLAUDE 配置，未新增定时任务、插件或云资源。

## 历史检查范围

方法是**全量程序解析/筛选 + 代表性上下文精读**，不是逐字人工阅读所有记录。以下是扫描时快照，当前聊天会继续增长；同一任务的 fork/投影不能按独立事件重复计算。

| 来源 | 实际覆盖 | 边界 |
| --- | --- | --- |
| Codex | 131 份 JSONL：128 活跃目录、3 归档；42,733 行，解析错误 0；2026-08-04 至 2026-11-03 | 包含当前研究文件，5 份排除出历史案例；核对 115 个 state 线程的 rollout，补扫 11,952 个 thread_history 投影 |
| Pi | 50 份 JSONL，11,605 条记录，解析错误 0；2026-09-25 至 2026-11-03 | 包含 11 个嵌套子 agent 会话；区分真人请求、子任务指令、助手自述与工具证据 |
| Claude | 本地 sessions 为空，projects 不存在 | 未发现可读对话，不推断云端状态 |
| VS Code / Copilot | 34 份聊天快照均无请求；只读数据库会话表为空 | 不能据此声称用户从未使用这些工具 |
| Cursor / OpenCode 等 | 发现目录或检查常用路径，未取得可读正文 | 51 个候选根的存在性和文件名清单已记录 |
| Lingma | 发现 Bolt/scorch 专用索引 | 未解析，属于明确覆盖缺口 |

没有扫描凭证库、浏览器登录数据或远程主机/云端全历史。未逐条语义精读，关键词筛选可能遗漏隐含案例。历史中的 PASS 仅说明历史结果，本轮未重跑那些项目的编译或实机测试。

详细摘要、来源行号、统计和扫描脚本见 [Codex 研究](verification-evidence-2026-11-03/research/codex-history.md)、[Pi 与其他来源研究](verification-evidence-2026-11-03/research/other-history.md)。它们保留原执行路径；所需脚本/统计在同目录有持久镜像。没有把整份私人对话打包进 Skill。

实际扫描命令：

```bash
python /tmp/verification-research/codex-scan.py > /tmp/verification-research/codex-scan-output.txt
python3 /tmp/verification-research/scan_other_history.py
python3 /tmp/verification-research/build_other_report.py
```

采纳的关键案例：回归失败不能被编译成功覆盖；主机 fixture 不证明实机握手；引脚/接口依据要绑定当前硬件与契约；入队不等于对端完成；读取失败后的默认值不是测量值；测试全绿仍可能漏掉性能目标；用户限定主机验收时不扩大到上板。

## 网页与文章链接

通过 `browser-harness` 读取 [原文](https://x.com/poteto/status/2094457600259842065)，核对作者、标题、日期及正文开头/结尾。读取全部 **14 个去重正文直接链接**；加上原文和 3 个相关补充，共 18 份浏览器快照。直接链接包括 create-verification、Build the Lever、swarm、Feature Map、Loops You Can Trust 及所引用的产品说明。

实际来源检查命令：

```bash
browser-harness < /tmp/verification-research/browser-final-check.py | tee /tmp/verification-research/browser-verification.log
```

实际输出：

```text
PASS original X article contains opening, closing, date and all 14 unique body link URLs
PASS all 18 browser captures contain >500 characters
```

逐项覆盖与适配判断见 [文章研究](verification-evidence-2026-11-03/research/article.md)，URL/字符数/哈希见 [浏览器核验日志](verification-evidence-2026-11-03/research/browser-verification.log)。保留原创摘要、URL 与校验信息；全文浏览器快照仍在本次临时目录，未将完整文章再分发到 Skill。

采用可重跑工具、真实路径、功能地图、版本绑定、测量基线和反馈维护。没有采纳作者的倍数宣称、固定每日维护或平台偏好作为硬性要求。Atlas 是虚构示例且缺少驱动实现；本次编写自己的实际可运行记录器。后续只读复核未发现错误归因。

## 实际验证结果

下表都来自已执行命令与保存日志，不能用静态检查结果替代业务验证。

| 验证层 | 实际命令（在所列目录执行） | 原始结果与证据 |
| --- | --- | --- |
| Skill 结构 | 仓库根：`python3 /home/yardie/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/verification` | exit 0，`Skill is valid!`；[日志](verification-evidence-2026-11-03/structure/stdout.log) |
| CLI 真实进程测试 | Skill 目录：`python3 -B -m unittest discover -s scripts -p test_record_check.py -v` | exit 0，`Ran 13 tests in 1.233s`、`OK`；[日志](verification-evidence-2026-11-03/script-tests/stderr.log) |
| Pi 原生发现 | 仓库根：`node doc/workflow/verification-evidence-2026-11-03/check_pi_loader.mjs` | exit 0，发现 1 个 verification，诊断为空；[日志](verification-evidence-2026-11-03/pi-loader/stdout.log) |
| 引用与安装回读 | 仓库根：`python3 -B doc/workflow/verification-evidence-2026-11-03/check_skill.py` | exit 0，5 个本地引用可读、UI 元信息、3 个链接与相同入口哈希通过；[日志](verification-evidence-2026-11-03/references-install/stdout.log) |

这些命令均由最终 `record_check.py` 执行并收集结果；相应目录的 `result.json` 保存完整 argv、cwd、时间、输入指纹与日志哈希。13 项测试覆盖成功、非零退出、启动失败、缺输入不执行、拒绝覆盖、字面参数、输入变化/删除/链接重定向、4.2 MB 二进制日志、权限和中断。

### 两个独立行为场景

使用独立新上下文执行者，只给 Skill、原始请求与隔离材料，不提供预期诊断。夹具含故意设置的缺陷，目标是检查 Skill 是否能拒绝虚假的成功；它们不是用户生产项目。

1. **协议编码。** 原有 `python3 -B -m unittest -v test_codec` 为 4/4 PASS。执行者对照契约编写并执行 `python3 -B -m unittest -v verify_contract`，11 项中 4 项失败：字符数量误当 UTF-8 字节长度；判定 FAIL，保留实现且没有扩大为实机任务。[报告与日志](verification-evidence-2026-11-03/code-eval/report.md)。
2. **离线写入回读。** `python3 /tmp/verification-eval-writeback/check.py` 返回 exit 1，9 项中 5 PASS、4 FAIL。接口响应成功，但回读有重复业务键、错误工时与计数矛盾；判定 FAIL，明确不能推断真实远端当前状态。[报告与结果](verification-evidence-2026-11-03/writeback-eval/report.md)。

行为测试时采集器说明正在编写，执行者各自保存了等价证据；最终补齐引用后，又用成品记录器运行两份独立检查。两次均正确保留 exit 1 和失败日志，输入前后指纹一致：[编码集成记录](verification-evidence-2026-11-03/integration-code/result.json)、[回读集成记录](verification-evidence-2026-11-03/integration-writeback/result.json)。这同时验证了最终工具与检查脚本可以衔接。

前后对比是“只有既有测试/成功响应”与“独立契约检查/回读比对”的结论差异；没有修复夹具，也没有声称生产性能或缺陷发生了改善。

## 当前结论与限制

Skill 文件、记录器、安装链接、Pi 原生发现，以及两个隔离行为场景已验证。重要证据与项目约束的持久化要求已写入 Skill。最终文件清单及指纹见 [file-manifest.json](verification-evidence-2026-11-03/file-manifest.json)。

尚未验证：Codex/Claude 新会话自动发现、Pi/Claude 实际模型调用、真实板卡/飞书写入/生产 UI 的完整业务流程、其他 Python/操作系统组合；本次没有真实性能提升测量。Pi 检查仅调用实际加载器并验证技能元信息进入提示，不发模型请求。符号链接可读不保证已经运行中的会话热加载。

记录器不是权限沙箱或业务验收器；参数和输出不自动脱敏，没有默认超时，Ctrl-C 只管理直接子进程，前后哈希不证明期间从未变化。使用时按当前任务选择具体检查和项目工具。历史范围仍受本机可读数据限制，不能声称已检查所有设备、云端及未解析专有索引。
