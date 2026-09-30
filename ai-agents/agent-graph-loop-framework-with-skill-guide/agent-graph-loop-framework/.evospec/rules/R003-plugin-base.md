---
id: R003
status: enabled
name: plugin-base
applies-to: feature-dev
---

# R003 · 扩展/插件契约

## 配置依赖

`development.extension_contract`

## 规则内容

当 `enabled: true` 时，新增扩展必须满足配置中的 `base_type`、`factory_functions`、`registration_file` 和 `registration_key`。当 `enabled: false` 时，本规则跳过，不假设项目采用插件架构。

## 检查时机

创建新插件、驱动适配器、策略实现或同类扩展点时。

## 违规处理

指出缺少的契约项，并优先参考仓库中的同类实现；不生成项目不存在的基类或注册文件。
