---
id: R007
status: enabled
name: chinese-comments
applies-to: feature-dev, bug-fix
---

# R007 · 代码注释策略

## 配置依赖

`development.comments.enabled`、`language`、`mode`

## 规则内容

- `enabled: false`：跳过。
- `mode: every_nontrivial_line`：除纯括号、include/using 等自解释结构外，新增或修改的非平凡代码行使用配置语言说明意图。
- `mode: meaningful_blocks`：只注释复杂意图、边界、协议、单位、并发和非显然原因，避免逐句复述代码。
- 优先解释“为什么”，保持与代码同步。

## 违规处理

仅补充缺失且有价值的注释，不改动无关业务逻辑。
