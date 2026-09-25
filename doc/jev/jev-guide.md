# Jev：把语义判断接入程序

> 面向嵌入式、Linux 与 Agent 开发者的说明与实践。资料核对日期：2026-09-20。HTML 与 Markdown 由同一正文生成；所有自编日志、数值与交互演示均为教学数据，不是实测结果。

## 1. 先理解它解决什么问题

**Jev 是 TypeSafe AI 的旗舰模型，也是该公司首个 System One 模型：输入上下文和事先定义的问题，输出程序可直接使用的类型化判断及概率。** 它适合判断“交给哪个模块”“这段材料是否支持某个说法”“某项指标处于什么程度”。官方接口提供 Choice、Noul、Score 三种原语。[官方介绍](https://docs.typesafe.ai/introduction)

对嵌入式工程师，可以把它类比为一个通过网络调用的“语义判断函数”：普通代码擅长判定 `error_code == ETIMEDOUT`；Jev 可以辅助判断“这段工单描述更适合先让驱动组还是构建组处理”。这个类比描述其使用方式，不代表它有本地函数的确定性、时延保证或运行位置。

```text
普通规则：精确字段 → 确定性条件 → 结果
Jev 判断：文本/状态 + 问题 + 候选答案 → 类型化结果 + 不确定性
业务执行：规则检查 + Jev 结果 + 应用策略 → 分流、排序或人工复核
```

System One 借用了“快速直觉判断”的概念。TypeSafe 将其训练方法称为 RLCD（Reinforcement Learning for Calibrated Decisions，面向校准决策的强化学习）。所谓校准，是在大量预测上检查概率和实际结果是否匹配；不能把单次 `0.9` 当成正确性保证。官方文档说明了训练目标，但不足以让我们推断模型参数量、所有架构细节或可在 MCU 上部署。[System One](https://docs.typesafe.ai/concepts/system-one) · [AI primer](https://docs.typesafe.ai/introduction/machine-learning-primer)

### 与已有工具怎样分工

| 需求 | 更合适的承担者 | 原因 |
| --- | --- | --- |
| 校验 CRC、比较寄存器位、计算超时次数 | 普通代码 | 结果可精确计算，无须语义推断 |
| 工单分流、证据相关性评分、文本条件判断 | Jev | 有语义歧义，但答案空间可以定义 |
| 写驱动、解释调用链、生成 RCA | 生成式/推理模型与工程师 | 需要开放式推理与文本生成 |
| 执行 shell、烧录、修改文件 | 受控执行器 | 权限、参数校验和执行结果由程序管理 |
| FreeRTOS 中断响应与实时控制 | 本地实时软件 | 网络模型调用不提供硬实时保证 |

生成式 LLM 也可以提供工具调用和结构化输出。Jev 的区别在于模型和 API 专门面向有限答案空间的判断，不只是给聊天提示词增加“请输出 JSON”。这里的类型化接口减少了自由文本解析问题，但没有消除语义误判。[System One](https://docs.typesafe.ai/concepts/system-one)

## 2. 如何理解用户给出的文章

用户指定的 [Sydney Runkle X 链接](https://x.com/sydneyrunkle/status/2100754364545761643) 在本次检索中返回 403，未直接取得全文。因此本文不声称逐字核对了该 X 文章。

可直接查证的一手材料是 Sydney Runkle 与 Hunter Lovell 于 2026-09-17 在 LangChain 官网发布的 [Building a Harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev)。它与用户所指主题相符，本文以这篇作者官方文章作为补充，并用 TypeSafe 当前文档核对技术细节。

文章的主要价值是指出：Agent 循环里有不少步骤只是分类判断，可以让 Jev 承担；开放式工作仍由生成式模型处理。文章展示了 `TypeSafeClassifier`，以及模型选择和工具风险检查两类中间件。文中“最高 200 倍推理速度、400 倍成本优势”属于引用的厂商分类任务宣传数据，不能外推为整个 Agent、编译流程或任意任务的端到端收益。[作者官方文章](https://www.langchain.com/blog/building-a-harness-with-jev)

```text
输入请求
   ↓
Jev：选择处理路径
   ↓
生成式模型：分析问题、提出工具调用
   ↓
Jev：提供工具风险判断 ──→ 不确定/有风险 → 复核
   ↓
执行器：检查实际权限与参数，执行允许的操作
   ↓
读取结果 → 继续分析或结束
```

这里的 harness 是管理模型、工具、状态和执行流程的程序框架。本文建议将模型意见与执行权限分开：分类器提供信号，执行器决定实际允许什么。安装 typesafe-ai skill 只会给编码助手提供使用指导；它不会自动把 Codex 底层模型切换成 Jev，也不会自动替换已有审批机制。

## 3. 一次调用由什么组成

| 字段 | 含义 | 实践建议 |
| --- | --- | --- |
| `state` | 本次要判断的材料 | 字符串、JSON 对象或数组；复杂情况用有名字的字段 |
| `model` | 模型 ID 或别名 | 学习可用 `jev-latest`；评估后固定实际版本 |
| `questions` | 问题 ID 到问题对象的映射 | 每个问题只承担一个明确判断 |
| `type` | `choice` / `noul` / `score` | 按答案含义选择 |
| `instructions` | 模型需要回答什么 | 包含完整问题及引用字段 |
| `criteria` | 选项或等级定义 | 说明边界、排除条件、无匹配出口 |

问题 ID 只是程序关联结果的键，不传给底层模型参与推断。例如键叫 `is_dma_failure`，但 instructions 只写“判断一下”，不能指望键名补全语义。Choice 的选项名称和描述则会参与判断。[HTTP API](https://docs.typesafe.ai/api) · [Choice](https://docs.typesafe.ai/primitives/choice)

```json
{
  "model": "jev-latest",
  "state": {
    "report": "Linux 网口启动后偶发连接中断，尚未提供完整日志。",
    "environment": "测试板，驱动升级后首次发现"
  },
  "questions": {
    "triage": {
      "type": "choice",
      "instructions": "根据 report 和 environment，选择最适合首先接手调查的队列；这不是根因判定。",
      "criteria": {
        "driver": "设备驱动和链路初始化相关问题",
        "build": "编译、链接或打包失败",
        "unknown": "信息不足或不属于上述队列"
      }
    }
  }
}
```

在复杂 state 中，instructions 可以引用 `ticket.messages[0].text` 这样的路径。将“现场观察”“已有假设”“参考规则”分开命名，能减少把怀疑当事实的机会。模型只能使用实际提供的材料，不能凭空访问你的板卡、日志文件或 Git 仓库。[State](https://docs.typesafe.ai/concepts/state)

## 4. 三个原语，三个不同问题

### 4.1 Choice：从候选集合中选一个

适合“由谁处理”“哪个候选值符合要求”“下一步先做哪种检查”。返回 `choice`、每个选项的 `probabilities` 和 `confidence`。概率总和为 1，`choice` 是最高概率选项。当前最多 255 个选项。[Choice](https://docs.typesafe.ai/primitives/choice) · [HTTP API](https://docs.typesafe.ai/api)

教学分布：驱动 `0.85`、构建 `0.05`、未知 `0.10`。这表达相对于给定候选项的判断，不能直接读成“驱动一定有 bug”。如果候选中没有“硬件”或“需要更多信息”，模型也无法选出它们。因此候选覆盖率是应用效果的一部分。

若一个报告可能同时涉及 DMA、缓存一致性和并发，应该给各标签分别定义 Noul，而不是强制一个 Choice 充当多选标签器。

### 4.2 Noul：某条件成立的概率

Noul 返回 `noul`，范围为 0–1，表示 yes 的概率，不另带 `confidence`。例如问“报告是否明确说采集已经停止”。`0.9` 表示模型倾向 yes；`0.1` 倾向 no；`0.5` 表示二者难以区分，**不表示采集停止了一半，也不是中等严重程度**。[Noul](https://docs.typesafe.ai/primitives/noul)

```text
P(yes) ≤ 0.2       0.2 < P(yes) < 0.8       P(yes) ≥ 0.8
倾向条件不成立       进入待核实区间              倾向条件成立
```

这些阈值只演示应用分支，不是官方推荐标准，也不是经过本项目数据校准的部署值。对精确错误码是否存在，直接用解析器；对文字是否表达某种含义，再考虑 Noul。

### 4.3 Score：在有序描述等级上评分

Score 的 `criteria` 是按顺序排列的等级描述，当前支持 2–10 级。若定义三档“正常 / 性能退化 / 功能不可用”，默认等级索引为 0、1、2，返回分数处于 0–2，而不是天然的百分数。[Score](https://docs.typesafe.ai/primitives/score)

```text
假设概率：P(0)=0.1，P(1)=0.3，P(2)=0.6
score = 0×0.1 + 1×0.3 + 2×0.6 = 1.5
若业务需要 0–1 归一化：normalized = score / 2
```

Score 返回 `score`、`legend`、`probabilities`、`confidence`。平均分相同不代表分布相同：全部集中在等级 1，和各半集中在等级 0、2，平均数都为 1，决策含义却不同。需要保留分布和置信度，尤其不能只看均值掩盖严重风险。

### 4.4 Confidence 怎样读

Choice/Score 的 confidence 是由答案概率分布计算出的 0–1 统计量。它便于程序决定是否复核，但不是独立证据，更不是整个工作流成功的概率。不要假定它等于最大选项概率，也不要把官方网页演示中的近似计算公式当成 API 的永久契约。[Confidence](https://docs.typesafe.ai/confidence)

工程上应分开记录：选了什么、完整概率、confidence、用了哪个模型、state 与问题版本。设置阈值时要用真实标签评估误分率与自动处理覆盖率；“设为 0.95 就有 95% 正确率”没有这种保证。

## 5. 多问题并行，代码组合

同一请求中所有问题共享 state，但独立求值；第二个问题看不到第一个问题的答案。可把分流、是否紧急、材料完整度放在一次调用里。若必须先定位某条记录，再从数据库取证据并评估，应分成两次请求。[Speculative fan-out](https://docs.typesafe.ai/patterns/fan-out)

```text
                    ┌─ Choice：哪个调查队列？ ─────┐
同一个报告 state ───┼─ Noul：是否描述业务中断？ ───┼─→ 代码组合 → 工单分流
                    └─ Score：复现材料完整度？ ────┘
```

“并行”不代表问题数量、上下文大小和成本没有限制。多问题仍增加输入 tokens。把所有历史日志原样塞入 state 也不一定提高准确率；应按具体判断保留相关上下文。

独立偏好维度可以加权，例如复现性与影响程度形成排序指标；硬性禁止条件应单独判断，不能让“其他指标很好”抵消它。这是应用策略设计，不是 Jev 自动推导出来的业务规则。

## 6. 最短上手路径

1. 在 [TypeSafe 控制台](https://console.typesafe.ai/keys) 获取可用 API key；可先到 [Playground](https://console.typesafe.ai/playground) 验证问题定义。
2. 准备 Python 3.10 或以上版本，创建虚拟环境并安装 SDK。
3. 在当前进程环境设置 `TYPESAFE_API_KEY`。
4. 先运行一个 Noul，再组合 Choice 和 Score。
5. 记录实际返回结果，使用自己的报告做评估。

安装与方法名依据 [Quick start](https://docs.typesafe.ai/introduction/quickstart) 和 [Python SDK](https://docs.typesafe.ai/sdk/python)。以下命令供用户执行，本次没有安装业务 SDK 或调用收费模型。

Windows PowerShell：

```powershell
python -m venv .venv
.\.venv\Scripts\python.exe -m pip install typesafe-sdk
$env:TYPESAFE_API_KEY = '<替换为你的 API key，仅在本机设置>'
.\.venv\Scripts\python.exe minimal.py
```

Linux shell：

```bash
python3 -m venv .venv
.venv/bin/python -m pip install typesafe-sdk
export TYPESAFE_API_KEY='<替换为你的 API key，仅在本机设置>'
.venv/bin/python minimal.py
```

将下面保存为 `minimal.py`；实际结果以运行返回为准，不在代码中假定概率值。

```python
from typesafe_sdk import Noul, TypeSafeClient

with TypeSafeClient() as client:
    result = client.system_one(
        model="jev-latest",
        state="The acquisition stopped and the current test cannot continue.",
        questions={
            "interrupted": Noul(
                instructions="Does the report explicitly say the current test cannot continue?"
            )
        },
    )
    print("model:", result.model)
    print("P(test interrupted):", result.answers["interrupted"].noul)
```

可以不使用 LangChain，直接用 SDK；也可以用 HTTP：`POST https://api.typesafe.ai/v1/systemone`，请求头包含 `Authorization: Bearer <API_KEY>` 与 `Content-Type: application/json`，请求体见第 3 节。HTTP 错误包括 401（认证）、422（参数）、429（限流）、529（服务过载）；后两类应退避重试。SDK 默认包含重试机制。超时或失败时应显式进入待处理状态，不伪造模型判断。[HTTP API](https://docs.typesafe.ai/api)

## 7. 示例一：嵌入式故障报告分流

### 目标与边界

目标是帮工程团队确定谁先调查、材料是否足够以及是否需要优先处理。**这里不自动确认根因，不自动修改驱动。** 以下是人为编写的演示报告，没有对应的真实板卡实验。

```python
from typesafe_sdk import Choice, Noul, Score, TypeSafeClient

state = {
    "report": (
        "On a FreeRTOS test build, SPI DMA capture stops intermittently "
        "under load. The test cannot continue until the board is reset. "
        "No DMA register snapshot or interrupt trace is attached."
    ),
    "observed": ["intermittent capture stop", "reset restores capture"],
    "unverified_hypotheses": ["DMA interrupt handling", "buffer ownership"],
}

questions = {
    "owner": Choice(
        instructions=(
            "Choose the first investigation queue for report. "
            "Do not treat unverified_hypotheses as confirmed root causes."
        ),
        criteria={
            "driver": "Peripheral, DMA, or interrupt investigation",
            "rtos": "Task scheduling or RTOS synchronization investigation",
            "build": "Compiler, linker, or packaging investigation",
            "unknown": "Insufficient evidence to choose one queue, or no queue fits",
        },
    ),
    "blocked": Noul(
        instructions="Does report explicitly say the current test cannot continue?"
    ),
    "completeness": Score(
        instructions="How complete is report for attempting an independent reproduction?",
        criteria=[
            "Only symptoms; no actionable trigger or reproduction conditions",
            "Some trigger or conditions are present, but essential setup or steps are missing",
            "Setup, ordered reproduction steps, and observable failure criteria are all present",
        ],
    ),
}

with TypeSafeClient() as client:
    result = client.system_one(
        state=state, questions=questions, model="jev-latest"
    )

owner = result.answers["owner"]
blocked = result.answers["blocked"].noul
completeness = result.answers["completeness"]

# 教学阈值：用于演示分支，部署前必须在本团队数据上评估。
queue = (
    owner.choice
    if owner.choice != "unknown" and owner.confidence >= 0.8
    else "manual_review"
)
impact = (
    "reported_test_blockage" if blocked >= 0.8
    else "no_clear_blockage" if blocked <= 0.2
    else "verify_impact"
)
need_details = completeness.confidence < 0.8 or completeness.score < 1.5

print({
    "model": result.model,
    "queue": queue,
    "queue_probabilities": owner.probabilities,
    "queue_confidence": owner.confidence,
    "impact": impact,
    "need_reproduction_details": need_details,
})
```

这里采用英文问题与演示报告，是因为官方表示英语当前效果最好；中文和混合日志需要独立评估。`blocked` 判断的是“报告是否如此描述”，不是远程测量设备真的停机。[Models](https://docs.typesafe.ai/models)

建议将下一步补充材料写成确定性模板：固件版本、硬件版本、复现步骤、时间戳、DMA 状态与中断轨迹。模板由工程师定义，Jev 只提供分流信号。若要进一步分析 DMA 根因，应查代码和现场证据，交给工程师或推理模型进行多步调查。

在实际系统中，板端只采集日志，由 PC 或 Linux 网关整理并调用 API；不在 ISR 或实时任务关键路径中等待网络推断。此部署方式是本文针对嵌入式工作的工程建议。

## 8. 示例二：让 Jev 选原文中的版本号

问题：“报告里有多个固件版本，哪个是失败构建？”普通代码先找出候选，Jev 判断语义角色，程序再从候选表取回原字符串。这遵循官方的“预解析候选值 → 选择 → 程序复制”模式。[候选值提取 Cookbook](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook)

```python
import re
from typesafe_sdk import Choice, TypeSafeClient

report = "v2.6.1 passed overnight testing. After upgrading to v2.7.0, capture stalls."
versions = list(dict.fromkeys(re.findall(r"\bv\d+\.\d+\.\d+\b", report)))
candidates = {f"v{i}": value for i, value in enumerate(versions)}

if not candidates:
    print("No version candidates: request more evidence")
else:
    criteria = {key: value for key, value in candidates.items()}
    criteria["none"] = "No listed candidate is identifiable as the failing build"
    with TypeSafeClient() as client:
        answer = client.system_one(
            model="jev-latest",
            state={"report": report, "candidates": candidates},
            questions={
                "failing_version": Choice(
                    instructions="Which candidate is reported as the failing build?",
                    criteria=criteria,
                )
            },
        ).answers["failing_version"]

    # 0.8 仍是教学阈值。
    value = candidates.get(answer.choice) if answer.confidence >= 0.8 else None
    print(value if value is not None else "Needs review")
```

人工阅读这个教学句子时，失败构建应是 `v2.7.0`，但本次没有模型实测结果。正则仅覆盖简单的 `v主.次.修订` 格式，不覆盖 RC、Git hash 等版本体系。若漏掉正确候选，Jev 无法补出；若候选齐全，它仍可能选错语义角色。该方法限制了值的来源，不保证选择正确。

## 9. 示例三：放进 LangChain 的 Agent

官方集成使用 `langchain-typesafe` 的 `TypeSafeClassifier`。它返回分类结果，不是聊天消息。下面展示与前面 TypeSafe 原生 SDK 不同的访问方式：`response.nouls[...]`。[LangChain 作者文章](https://www.langchain.com/blog/building-a-harness-with-jev)

```bash
python -m pip install langchain-typesafe
```

```python
from langchain_typesafe import Noul, TypeSafeClassifier

classifier = TypeSafeClassifier()
response = classifier.invoke(
    state="The test bench is blocked until someone investigates the capture failure.",
    questions={
        "urgent": Noul(
            instructions="Does this report describe an ongoing blockage needing prompt attention?"
        )
    },
)
print(response.nouls["urgent"].noul)
```

集成中的 `experimental.middleware` 提供 `ModelRouterMiddleware` 和 `AutoModeMiddleware`。前者选择模型，后者检查工具调用。它们带有 experimental 标记，应固定依赖版本并按照对应版本文档验证行为；本文不把它们当作稳定安全边界。

使用这两个中间件时，官方安装方式是 `python -m pip install "langchain-typesafe[experimental]"`。Router 根据最近用户消息为本次 run 选择模型；AutoMode 对指定工具的风险调用返回错误 ToolMessage，并不会自动发起人工批准。需要人工批准时应另行组合 HITL 中间件。[LangChain 官方集成文档](https://docs.langchain.com/oss/python/integrations/providers/typesafe)

对本人的开发工作，可采用以下自定义组合逻辑（伪代码，并非 SDK 接口）：

```text
on(request):
  check deterministic policy and configured access
  ask Jev which route fits: lookup / local_debug / deep_analysis / unknown
  if unknown or confidence below evaluated threshold:
    use review or capable reasoning fallback
  else:
    invoke the configured handler

before tool execution:
  validate exact arguments and permissions in code
  optionally ask Jev for contextual risk signals
  if policy denies, service fails, or evidence is insufficient:
    block or request review according to the application's policy
  otherwise:
    execute and record actual outcome
```

路由标签应对应你实际配置的处理器，而不是凭空填写模型名。简单查找可交给检索或脚本；需要跨驱动、调度与硬件证据的分析可交给推理模型。实际节约取决于分流准确率、回退比例以及任务分布。

## 10. 版本、成本与性能怎样评估

核对日官方 Models 页列出 `jev-1.13.0`，`jev-latest` 与 `jev-preview` 当时都指向它。官方输入价为 **$0.042 / 百万 tokens**，输出 tokens 免费。别名会移动，阈值经过验证后宜固定模型 ID，并记录响应的实际版本。[Models](https://docs.typesafe.ai/models)

示例算账：假设每个请求实际计费输入为 2,000 tokens：

```text
单次输入费用 = 2,000 / 1,000,000 × $0.042 = $0.000084
100,000 次费用 = $8.40
```

这是基于假设 token 数和当前单价的算术示例，不是账单或性能测试；不含重试、其他模型、存储和网络成本。业务总费用应按响应 usage 与平台账单统计。问题与选项也占用 token，不能只计算日志正文。

官方当前上下文限制为：单请求总量 64k tokens，且 state 加最长单个问题不能超过 32k。页面列出的 250,000 tokens/秒与 1,200 请求/分钟是服务限流说明，并注明动态调整，不是性能承诺。[Models](https://docs.typesafe.ai/models)

端到端时间包括状态整理、网络、排队、推断、程序组合和后续执行。假设原流程 80% 时间在编译和工具上，即便其余 20% 分类步骤无限加速，整体上限也只有 `1 / 0.8 = 1.25` 倍。这个算术例子说明为什么不能把分类加速倍数照搬给完整开发流程。

## 11. 已知限制与容易误解的地方

| 常见误解 | 更准确的理解 |
| --- | --- |
| 返回类型正确，所以事实一定正确 | 仍可能选择错误候选或给出错误判断 |
| Noul 的 0.5 是中等严重 | 它表示 yes/no 概率接近；程度用 Score |
| Score 的 0.8 一定是 80 分 | 数值范围由等级索引决定，要看 legend |
| confidence 高就有权限执行 | 权限来自用户授权与执行策略 |
| 可以直接给 Jev 截图、波形图片 | 当前支持文本；先转成适当文本或结构化特征 |
| 一次请求的后一个问题能读前一个答案 | 问题独立；依赖前一答案时应重建请求 |
| 安装 skill 就已经调用 Jev | skill 是指导；真实调用仍需 SDK/API 与 key |

官方针对 Jev 1.13 公布了包括算术、日期比较、长上下文、间接引用、对抗内容和跨问题一致性在内的已知薄弱点。因此数量计算、版本比较、地址范围判定应保留在代码中；分开问出的多个答案也可能互相冲突，需要由程序检查约束。[Jev 1.13 jaggedness](https://docs.typesafe.ai/model-jaggedness/jev-1.13)

工具风险检查尤其不能仅靠模型：待检查的命令、网页和文件可能包含影响判断的指令。将材料结构化能帮助表达边界，但不能保证免疫提示注入。对此应结合确定性权限控制与针对性测试；这也是将 Jev 用作工具门禁时必须考虑的实际限制。

当前公开使用路径是托管 API。本文查阅的资料不足以支持“可离线跑在开发板”“已提供开源权重”或“支持客户 LoRA 微调”等说法。官方说明通过 state、instructions、criteria 适配领域，而不是为每个客户微调权重。[Models](https://docs.typesafe.ai/models)

## 12. 面向你工作的落地方案

建议先试做“历史故障报告分流助手”。它与现有 FreeRTOS/Linux 工作贴近，结果容易复核，可以同时覆盖三种原语。

1. **整理样本**：选取历史已结案报告，保留原始描述、实际接手团队与复现信息；删除不应外发的数据。
2. **明确标签**：工程师定义首接队列、是否中断工作、复现材料完整度，允许 unknown 与有争议标签。
3. **建立基线**：比较关键词规则、现有人工流程和 Jev，避免把规则已能解决的问题复杂化。
4. **分开开发与验证**：在开发集调问题和阈值，在独立保留集评估。相同故障的重复报告避免跨集合泄漏。
5. **记录有用指标**：各队列误分情况、自动处理覆盖率、待复核比例、中文/英文差异、P50/P95 延迟和真实费用。
6. **影子运行**：先只输出建议，并与人工处理结果对照；通过后再接低风险工单分派。
7. **监控变更**：固定模型与问题版本；模型、候选集合或报告分布变化后重新评估。

测试材料至少覆盖：清晰单一问题、驱动与 RTOS 交叉问题、信息缺失、否定句、互相矛盾的描述、中文混合日志、异常长文本、诱导模型忽略规则的内容，以及 API 限流/超时。区分候选漏召回、输入证据缺失、模型误判、代码分支错误与服务错误，才能知道该改哪里。

## 13. 来源与验证状态

本文完成了官方接口与资料核对，并提供原创教学示例。未使用 API key，未调用 Jev 服务，未对延迟、准确率和费用进行实测。示例代码的语法验证不能替代实际 SDK/API 集成测试。HTML 的交互仅在本地演示概率与程序分支，不请求任何模型服务。

交付检查覆盖 Python 示例语法、HTML 标题/锚点/本地链接与交互分支逻辑。自动浏览器预览被本地文件 URL 安全策略阻止，未完成浏览器视觉验收。

| 来源 | 用途 |
| --- | --- |
| [用户指定 X 链接](https://x.com/sydneyrunkle/status/2100754364545761643) | 原始入口；本次 403，未直接取得全文 |
| [LangChain：Building a Harness with Jev](https://www.langchain.com/blog/building-a-harness-with-jev) | 作者一手文章；Agent 分工及集成方式 |
| [LangChain TypeSafe 集成](https://docs.langchain.com/oss/python/integrations/providers/typesafe) | Classifier 与实验性中间件的实际接口 |
| [TypeSafe Introduction](https://docs.typesafe.ai/introduction) | 产品定位与三种原语 |
| [System One](https://docs.typesafe.ai/concepts/system-one) · [AI primer](https://docs.typesafe.ai/introduction/machine-learning-primer) | 决策模型、RLCD 与校准 |
| [State](https://docs.typesafe.ai/concepts/state) · [Choice](https://docs.typesafe.ai/primitives/choice) | 输入组织、候选语义 |
| [Noul](https://docs.typesafe.ai/primitives/noul) · [Score](https://docs.typesafe.ai/primitives/score) · [Confidence](https://docs.typesafe.ai/confidence) | 概率、分数与置信度 |
| [Quick start](https://docs.typesafe.ai/introduction/quickstart) · [Python SDK](https://docs.typesafe.ai/sdk/python) · [HTTP API](https://docs.typesafe.ai/api) | 安装、请求、响应与错误处理 |
| [Speculative fan-out](https://docs.typesafe.ai/patterns/fan-out) | 独立问题并行与跨调用依赖 |
| [候选值提取 Cookbook](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook) | 先找候选、再选择、由代码复制 |
| [Models](https://docs.typesafe.ai/models) | 核对日版本、价格、限制和语言支持 |
| [Jev 1.13 jaggedness](https://docs.typesafe.ai/model-jaggedness/jev-1.13) | 当前版本已知限制 |
