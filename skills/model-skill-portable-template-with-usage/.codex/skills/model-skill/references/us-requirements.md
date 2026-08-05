# 需求分析

> 执行前读取 `.evospec/module.config.yaml` 中的 `module`、`paths`、`work_item`、`architecture` 和 `development`。

## 适用场景

- 收到新需求、PRD 或变更说明
- 评估影响范围、接口或配置变化
- 输出可实施、可验证的设计方案

## 分析步骤

### 1. 读取输入与现状

1. 从 `<config: paths.requirement_input>` 读取与任务最相关的最新需求材料。
2. 读取 `<config: paths.architecture_sources>` 和现有代码分析文档。
3. 从用户描述或任务系统中获取 `<config: work_item.id_label>`；缺失时使用可见占位符，不虚构编号。

### 2. 建立需求基线

明确：目标、范围、非目标、验收标准、异常路径、兼容性和待确认项。区分“需求事实”“现有实现”“分析假设”。

### 3. 评估影响范围

按照 `<config: architecture.layers>` 和仓库实际结构检查：

- 需要新增或修改哪些模块、接口、消息、配置和数据结构？
- 是否影响 `<config: architecture.related_modules>`？
- 是否影响构建、部署、日志、测试或回滚？
- 是否存在版本兼容、性能、安全或资源约束？

### 4. 输出设计方案

在 `<config: paths.design_output>` 生成文档，文件名遵循 `<config: work_item.filename_template>`。

```markdown
# 设计方案

- 日期：YYYY-MM-DD
- <任务编号标签>：#XXXXXX
- 需求摘要：
- 需求来源：

## 目标与非目标

## 现状与约束

## 影响范围

| 模块/层级 | 文件或接口 | 改动类型 | 影响说明 |
|---|---|---|---|

## 设计方案

### 数据与控制流
### 接口/消息变更
### 配置变更
### 异常与降级

## 验证方案

## 风险与待确认项

## 预估工作量
```

### 5. 进入开发前检查

设计必须能够映射到文件、接口和验收步骤；未确认项不可伪装成确定结论。完成后进入 `@references/us-feature-dev.md`。
