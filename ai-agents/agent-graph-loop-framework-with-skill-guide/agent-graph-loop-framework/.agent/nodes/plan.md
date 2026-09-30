# Node: PLAN

计划必须具体到可分派任务：

- task id
- owner role
- files/symbols
- intended change
- dependency
- verification
- rollback
- risk

计划中的独立任务可以并行；修改同一文件或同一状态机的任务默认串行。

高风险计划在实施前调用独立 Reviewer；局部、低风险计划可以直接进入实现。
