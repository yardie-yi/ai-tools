# Bug 修复

> 执行前读取 `.evospec/module.config.yaml` 中的 `paths`、`architecture`、`debug`、`development`，并加载 bug-fix 阶段启用规则。

## 适用场景

- 功能异常、错误日志、崩溃、卡死或性能退化
- 回调、消息、接口或界面未按预期工作
- 偶现问题、回归问题或环境相关问题

## 排查流程

### 0. 文档优先

1. 列出 `<config: paths.design_output>`，读取与现象相关的设计文档。
2. 列出 `<config: paths.code_analysis_output>`，按 `<config: code_analysis.preferred_documents>` 的关键词选择相关分析文档。
3. 输出初步定位：涉及模块、可疑路径、设计预期、已知证据和仍缺信息。

目录为空时可跳过，但不得把缺少文档解释为“没有设计”。

### 1. 固化现象

记录：触发步骤、期望结果、实际结果、发生频率、首个异常时间点、环境、版本、最近相关改动和原始日志。

### 2. 建立证据链

使用 `@references/debug-commands.md` 中由配置渲染的命令抓取日志；结合源码、调用链、配置值和版本差异逐步缩小范围。优先找到“第一个错误状态”，不要只修复最终表象。

### 3. 提出并验证根因假设

每个假设都应包含：支持证据、反证、验证方法和结论。修改前先确认根因能够解释全部主要现象。

### 4. 最小修复

只修改根因相关代码，并执行 R006、R007、R008 等启用规则。修复不得静默吞错、扩大副作用或用硬编码绕过配置。

### 5. 回归验证

至少验证：原问题、相邻正常路径、异常路径、重复执行、重启/重新初始化（适用时）以及性能/日志量（适用时）。构建与部署分别进入 `@references/us-build.md` 和 `@references/us-board-deploy.md`。

### 6. 生成修复记录

验证通过后，在 `<config: paths.bug_log_output>` 生成文件，命名遵循 `<config: work_item.filename_template>`。

```markdown
# Bug 修复记录

- 日期：YYYY-MM-DD
- <任务编号标签>：#XXXXXX
- 涉及模块：

## 问题现象
## 复现条件
## 根因与证据
## 修改点
| 文件 | 修改内容 |
|---|---|
## 验证结果
## 回归范围
## 风险与回滚
```

生成记录后进入 `@references/us-git-submit.md`。
