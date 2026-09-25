import os
import time

from typesafe_sdk import Choice, Noul, Score, TypeSafeClient


if not os.environ.get("TYPESAFE_API_KEY"):
    raise SystemExit(
        "当前 Python 进程未读取到 TYPESAFE_API_KEY，"
        "请先在启动它的 PowerShell 中执行第 2 步。"
    )

# 人工编写的演示报告，不是真实硬件测试结果
report = (
    "SPI DMA capture stops intermittently under heavy load. "
    "The test cannot continue until the board is reset. "
    "The firmware version and exact reproduction steps are missing."
)

started = time.perf_counter()

with TypeSafeClient() as client:
    response = client.system_one(
        model="jev-latest",
        state=report,
        questions={
            "owner": Choice(
                instructions=(
                    "Which team should investigate this report first? "
                    "Select an investigation queue, not a confirmed root cause."
                ),
                criteria={
                    "driver": "Peripheral, DMA, or interrupt investigation",
                    "build": "Compilation, linking, or packaging failures",
                    "unknown": "Insufficient information or no suitable team",
                },
            ),
            "blocked": Noul(
                instructions=(
                    "Does the report explicitly say "
                    "the current test cannot continue?"
                ),
            ),
            "completeness": Score(
                instructions=(
                    "How complete is the report "
                    "for independently reproducing the failure?"
                ),
                criteria=[
                    "Symptoms only; no useful reproduction conditions",
                    "Some conditions are given, but essential details are missing",
                    "Setup and ordered reproduction steps are fully specified",
                ],
            ),
        },
    )

elapsed = time.perf_counter() - started

owner = response.choices["owner"]
blocked = response.nouls["blocked"]
completeness = response.scores["completeness"]

print("实际模型：", response.model)
print("首接调查队列：", owner.choice)
print("队列概率分布：", owner.probabilities)
print("队列 confidence：", owner.confidence)
print("报告描述测试中断的概率：", blocked.noul)
print("复现材料完整度：", completeness.score)
print("完整度等级：", completeness.legend)
print("Token 用量：", response.usage)
print(f"请求耗时（含网络）：{elapsed:.3f} 秒")

# 仅用于学习流程的阈值，未在真实工单数据上校准
if owner.choice == "unknown" or owner.confidence < 0.8:
    print("处理建议：人工复核首接队列")
else:
    print("处理建议：分流到", owner.choice)

if completeness.confidence < 0.8 or completeness.score < 1.5:
    print("补充材料：固件版本、硬件版本、复现步骤、相关日志")