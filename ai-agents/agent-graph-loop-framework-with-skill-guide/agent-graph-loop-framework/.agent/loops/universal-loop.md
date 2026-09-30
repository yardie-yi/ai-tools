# Universal Loop

```text
OBSERVE → DECIDE → ACT → VERIFY → UPDATE → ROUTE
```

每轮约束：

- 一个清晰目标。
- 一个主要假设或动作。
- 一个可观察验证。
- 若本任务使用 run state，则在关键决策和结果后更新；短任务无需创建状态文件。
- 未产生新证据的重复动作计为 no-progress。
- 退出、继续、刷新和升级必须说明依据。
- 使用 Skill 时，每轮只读取当前 route 的最小 reference/config/rules，并记录 preflight 状态。
