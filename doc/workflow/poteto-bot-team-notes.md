# Lauren 的 Bot 团队管理学习笔记

学习日期：2026 年 11 月 2 日。来源：[Lauren @poteto 原帖](https://x.com/poteto/status/2116576229319233596)。

核心启发：给 Agent 清楚的工作背景、可复用的流程和实际工具，让它稳定承担工作，减少人的重复指导和搬运。

## 原帖要点

1. 作者使用 Dr. Eggbot 帮助设计 Bot。
2. 少数优质 Bot 可能比庞大团队更实用、更易管理。
3. 教任务时让 Bot 编写 Skill，帮助长对话中的执行保持一致；可另存到私有 GitHub 仓库。
4. 配置连接器、Vault 和工作工具；独立邮箱与账号可用于隔离。
5. 从手工步骤和复制粘贴环节寻找自动化机会。
6. 像带实习生一样介绍自己、工作背景和正确做法，再讨论自动化。
7. 用语音充分表达，最后让 Bot 用自己的话复述，检查理解是否一致。

## 作者在评论中的补充

[Lauren 的补充帖](https://x.com/poteto/status/2116580481236115933)增加了五点：

1. 用定时任务或事件订阅触发工作，例如每天查新 Bug、收到特定客户邮件后整理反馈。
2. 高频触发会增加成本。她建议定时任务最频繁按小时运行，事件订阅先过滤事件。这是作者的使用建议，不是产品硬限制，也不是所有任务的统一频率要求。
3. 把适合自动化的步骤写成脚本并保存到私有仓库，减少每次由模型逐步操作的 token 消耗。原帖没有提供节省比例的测量。
4. 团队方案下可通过 Slack 分享已有 Bot，复用同事维护的工作流程。
5. 以管理者视角设定交付质量，让 Bot 达到自己完成工作的水平，腾出时间处理更有挑战的事情。

## 已核对原评论的讨论

### 明确职责和完成证据

[Cobalt 的评论](https://x.com/CobaltHere/status/2116577664173531309)补充：每个 Bot 应有清楚的职责、受限的权限和证明任务完成的方法；增加 Bot 也会增加协调成本。Skill 帮助保持一致，验证帮助建立信任。追求的是能可靠交付的最小团队。Lauren [回复认可](https://x.com/poteto/status/2116577801725952157)。

这与当前 AGENTS.md 的证据要求一致。对我们的应用是：流程不仅记录怎么做，也记录怎样判定完成；不能用 Agent 自报成功代替测试或产物核验。

### 主动发现需求

[Fernando 的评论](https://x.com/Fdfdz90/status/2116580629118656575)希望 Bot 主动识别信息需求、提出信息源配置或做有价值的延展研究，并以 SOUL.md 类比这种行为约定。Lauren [回应正在改进主动性](https://x.com/poteto/status/2116581185594020022)，并提到 Parker Smith 的工作。这是需求建议与研发回应，不能据此认定所有相关能力已经可靠实现。

对我们的应用是：发现反复搬运、重复查询或缺少验收步骤时，主动指出改进机会；明确的任务范围与授权仍然约束实际执行。

### 混合语言语音输入

[Vishal 的评论](https://x.com/vishalsingh2972/status/2116576545875886525)反馈印地语与英语切换、混说时识别困难；Lauren [提及同事跟进](https://x.com/poteto/status/2116577946010100204)。这是个人反馈，未见该回复承诺已修复。它提醒我们：语音输入后仍需核对关键术语、数字和目标，复述不能省略。

## 第三方整理中的待核实反馈

[中文评论区整理](https://haowenji.com/articles/x-2116768110397251584)还转述了以下使用反馈；本次未取得对应原评论全文及直接链接，不将其视为已验证的产品事实：

- @sergehere 称部分定时提醒没有触发。
- @Bouabdallah1870 反映自建 Agent 速度慢、执行漏步，询问如何改进验证。
- @brisyramshere 讨论与 Muse 加 Codex 的体验差异，并担忧不能新建会话和长对话带来的额度消耗。具体会话机制、计费方式与因果关系仍需官方资料或实际测量验证。

这些反馈提供了验收方向：检查任务是否实际触发、步骤是否完成，以及每次运行的耗时和用量。它们不支持平台优劣排名，也不支持直接断言上下文越长必然按固定规律增加费用。

## 在当前工作中的应用建议

以下是结合现有协作要求的推导，不是作者原话，也不自动改变全局规则。

- 复杂任务开始时，简短复述目标、输入、约束、交付物和验收方式；只有缺失信息会影响结果时才追问，不给简单任务增加确认步骤。
- 重复流程先复用已有 Skill。经过实际执行验证后，再把稳定步骤、常见失败处理和验收方法补入对应文件。
- 持久化时按用途存放：通用约束放 AGENTS.md，重复流程放 Skill，硬件配置和接口契约放项目文档；避免让聊天成为唯一信息源。
- 发现复制粘贴步骤时，先查已有连接器或 CLI 能力，结合明确输入和输出设计自动化。
- 已稳定、可重复的步骤优先考虑脚本；需要判断的部分交给模型。设计自动任务时明确触发条件、事件过滤、运行频率和验收记录，再用实际用量评估成本。
- 完成任务时提供实际命令、测试结果或回读证据。是否提效要靠同类任务的耗时、人工介入次数和返工情况验证。
- 根据任务需要和既有授权使用 Agent 与工具；文章中的建仓、注册账号和团队配置建议不等于本次执行授权。

适合复杂需求的提示语：

> 先用你自己的话复述目标、约束、预期产物和验收标准。指出会影响执行的缺失信息，其余部分继续推进。完成后给出验证证据；将验证过的可复用流程补入合适的现有 Skill。

## 核验记录与限制

直接网页抓取返回 403，随后通过 browser-harness 读取 X 页面正文，并用公开文本镜像核对英文。浏览器自动翻译将“少数优质 Bot 更实用、更易管理”的比较方向翻反。用户关闭翻译后，再次读取原帖英文正文，与镜像及本笔记逐项核对一致。

实际执行的读取命令：

```bash
browser-harness <<'PY'
new_tab('https://x.com/poteto/status/2116576229319233596')
wait_for_load()
print(js('document.body.innerText'))
PY

browser-harness <<'PY'
print(js('document.body.innerText'))
PY

curl -L --max-time 20 -sS 'https://api.fxtwitter.com/status/2116576229319233596'

browser-harness <<'PY'
print(js('Array.from(document.querySelectorAll("[data-testid=tweetText]")).map(e=>e.innerText)'))
PY
```

读取结果：浏览器返回作者、帖文正文及链接卡片；镜像返回 `code: 200`、一致的帖子 ID 与英文全文。核对英文中的原句为：“a few good bots can be more useful and easier to manage than a large team”。

评论区核验：通过页面 `article` 元素读取正文、作者和直接链接；对上文 7 条原评论及作者回应，通过公开文本镜像逐条核对帖子 ID、作者和正文。评论区内容有折叠与排序，滚动加载期间多次发生 `Input.dispatchMouseEvent` 超时，因此本次覆盖已加载的相关评论、作者补充及部分第三方整理线索，未穷尽全部评论或嵌套回复。

评论链接复核及文档回读命令（在工作区根目录执行）：

```bash
python3 - <<'PY'
from pathlib import Path
import concurrent.futures, json, urllib.request
expected = {
    '2116580481236115933': 'poteto',
    '2116580629118656575': 'Fdfdz90',
    '2116581185594020022': 'poteto',
    '2116577664173531309': 'CobaltHere',
    '2116577801725952157': 'poteto',
    '2116576545875886525': 'vishalsingh2972',
    '2116577946010100204': 'poteto',
}
def check(item):
    ident, author = item
    with urllib.request.urlopen('https://api.fxtwitter.com/status/' + ident, timeout=20) as r:
        data = json.load(r)
    tweet = data['tweet']
    assert data['code'] == 200 and tweet['id'] == ident
    assert tweet['author']['screen_name'] == author and tweet['text']
    return ident
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    checked = list(pool.map(check, expected.items()))
print(f'PASS: {len(checked)}/7 reply IDs, authors and non-empty texts verified')
note = Path('ai-tools/doc/workflow/poteto-bot-team-notes.md').read_text()
for ident in expected:
    assert '/status/' + ident in note
for heading in ['## 作者在评论中的补充', '## 已核对原评论的讨论', '## 第三方整理中的待核实反馈']:
    assert heading in note
assert sum(line.startswith('```') for line in note.splitlines()) % 2 == 0
assert not any(line.rstrip() != line for line in note.splitlines())
print('PASS: note readback, 7 source links, 3 comment sections and Markdown whitespace checks')
PY
```

执行结果：`PASS: 7/7 reply IDs, authors and non-empty texts verified`；`PASS: note readback, 7 source links, 3 comment sections and Markdown whitespace checks`。核对前笔记只包含主帖七点，核对后增加作者补充、原评论讨论和待核实反馈三部分。以上检查验证来源可读与文件保存，不验证评论里的使用体验是否普遍成立。

学习阶段的产物仅为笔记，未修改全局 AGENTS.md 或现有 Skill，未测试 Grok 专属功能，也未测量工作效率变化。文件持久化本身不会使未来所有会话自动加载这些建议。

首次落实中的全局规则修改已按用户要求回退，旧 subagents 内容已删除并重建为 Team。当前团队入口见 [Team](../../Team/README.md)，设计取舍和核验见 [Team 设置记录](team-setup-2026-11-02.md)；[首次改进记录](team-improvement-2026-11-02.md)仅保留历史状态。
