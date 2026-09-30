---
id: R008
status: enabled
name: no-redundant-ui-call
applies-to: feature-dev, bug-fix
---

# R008 · 高频路径禁止无条件执行高开销调用

## 配置依赖

`development.high_frequency_calls`

## 规则内容

当 `enabled: true` 时，在命中 `function_hints` 的循环、轮询、定时器或帧回调中，配置 `call_patterns` 指定的调用只能在输入实际变化时执行，或改为事件驱动。缓存变量使用配置的 `cache_prefix`。

本规则不限于 UI；项目可把网络发送、磁盘写入或昂贵计算加入 `call_patterns`。

## 违规处理

指出具体调用点，添加变化检测、去重、限频或事件驱动方案，并验证行为与性能未回退。
