# Evidence Requirements

Do not claim a task is complete without verifiable evidence.

The following are not evidence:

* Saying “the implementation is correct.”
* Saying “the bug should be fixed.”
* Showing code changes without executing relevant tests.
* Claiming that tests passed without providing actual results.
* Providing performance improvements without measurements.

For every completed task, provide:

1. The verification steps performed.
2. The actual commands executed.
3. The relevant test results or logs.
4. Before/after comparisons when applicable.
5. Any remaining limitations or unverified assumptions.

If verification cannot be performed, explicitly state what remains unverified.

A claim of success is not evidence of success.

# 持久化要求

重要约束、硬件配置、接口契约不能只依赖聊天记录，最好写入持久文件。

# Jev 与 GPT 分工

使用 typesafe-ai skill，并在适用时使用 jev-fanout、jev-guardrail、jev-route。自行判断任务中哪些子问题适合 Jev，实际调用 Jev API；其余开放式分析交给 GPT。最后说明分工和实际调用结果。
