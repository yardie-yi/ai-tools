# Node: ROUTE_FAILURE

Coordinator 按以下顺序判断：

1. 环境是否阻塞？是 → `BLOCKED_ENVIRONMENT`。
2. 是否需求/产品选择不明确？是 → `NEED_USER_DECISION`。
3. 是否局部且方向正确？是 → 原 Agent 修复，但受预算限制。
4. 是否重复错误、无进展或结构性失败？是 → Fresh Agent。
5. 是否 Reviewer/Verifier 证据冲突？是 → Second Reviewer 或用户决策。
6. 其余情况 → 停止并报告证据不足，不盲目继续。
