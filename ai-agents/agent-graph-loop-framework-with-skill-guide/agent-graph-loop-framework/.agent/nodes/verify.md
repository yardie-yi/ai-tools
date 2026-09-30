# Node: VERIFY

按任务风险选择验证者；高风险改动的 Verifier 应独立于 Implementer：

1. 检查工作区和 changed files。
2. 运行与改动相关的 lint、构建、测试或复现；不因本节点存在而运行全部命令。
3. 对照 Definition of Done 和需求追踪矩阵。
4. 输出确定性证据，不修改源代码。
5. 若本次使用 run state，将结果写入 `verification`；否则在最终报告中保留命令与结论。

若使用 Reviewer，其意见不能替代失败的确定性验证；只运行过的检查才可记录为 PASS。
