---
id: R006
status: enabled
name: log-in-generated-code
applies-to: feature-dev, bug-fix
---

# R006 · 生成或修改代码的日志要求

## 配置依赖

`development.logging`

## 规则内容

当 `enabled: true` 时：

- 使用配置中的日志 include、namespace 和 macros，或复用仓库现有同类实现。
- 覆盖 `required_points` 指定的关键位置。
- 高频路径遵守 `high_frequency_policy`，仅在状态变化、首次/恢复或限频条件下打印。
- 禁止引入与项目日志体系并行的临时打印方式。

当 `enabled: false` 时跳过本规则。

## 违规处理

指出缺少日志的位置和应使用的配置级别；不凭空创造未配置的宏。
