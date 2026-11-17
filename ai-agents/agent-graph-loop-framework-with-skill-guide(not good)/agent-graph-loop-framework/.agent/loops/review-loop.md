# Review Loop

仅当任务风险、跨模块影响或用户要求需要独立审查时启动；普通局部任务可由实现者完成定向自检。

1. Coordinator 准备精简审查包。
2. 启动 fresh、read-only Reviewer。
3. Reviewer 输出结构化 Verdict。
4. Coordinator 路由：
   - `PASS` → 下一节点/DONE
   - `PASS_WITH_RISK` → 风险接受决策
   - `FAIL_LOCAL` → 原 Agent 修复，最多配置的 review-fix 次数
   - `FAIL_STRUCTURAL` → 回到 PLAN + fresh Implementer
   - `NEED_USER_DECISION` → 用户
   - `BLOCKED_ENVIRONMENT` → blocker 报告
5. 修复后重新运行受影响的检查；仍有审查风险时再请 Reviewer 复核。

写代码的 Agent 不能是唯一 Reviewer。
