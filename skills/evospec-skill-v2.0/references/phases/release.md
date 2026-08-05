# 版本发布阶段

执行S6.1代码提交和S6.2影响分析。

---

## S6.1 代码提交

### 输入
- S5.1集成测试报告

### 执行
```
1. Read .evospec/outputs/integration-test/report.md
2. Read .evospec/memory/change_log.md
3. 收集变更
   - git status
   - git diff
4. 生成commit message
5. 更新CHANGELOG
6. 执行git commit
```

### Commit Message格式
```
{type}({scope}): {subject}

type: feat/fix/refactor/docs/style/test/chore
scope: 模块名
subject: 简短描述（<50字符）

示例:
feat(auth): implement login feature
fix(weather): resolve null pointer in update
```

### CHANGELOG格式
```markdown
# Changelog

## [Unreleased]

### Added
- {新增功能}

### Fixed
- {修复问题}

### Changed
- {变更}
```

---

## S6.2 影响分析

### 输入
- S6.1代码提交
- S2.2模块概要设计

### 执行
```
1. Read本次变更
2. Read模块关系图
3. 分析影响范围
4. 评估风险等级
5. Write .evospec/outputs/impact-analysis/report.md
```

### 产出物
```markdown
# 影响分析报告

## 变更概述
| 文件 | 类型 | 说明 |
|------|------|------|
| {文件} | 新增/修改 | 说明 |

## 影响范围
### 直接影响
| 模块 | 原因 | 风险 |
|------|------|------|
| {模块} | {原因} | 高/中/低 |

### 间接影响
| 模块 | 路径 | 风险 |
|------|------|------|
| {模块} | {路径} | 中/低 |

## 风险评估
**风险等级**: {高/中/低}

| 风险 | 等级 | 措施 |
|------|------|------|
| {风险} | {等级} | {措施} |

## 回归测试范围
| 模块 | 测试类型 | 优先级 |
|------|----------|--------|
| {模块} | {类型} | P0 |
```

---

## 输出格式

```
📐 S6.{N} 完成

提交: {commit hash}
变更: {N}文件
影响: {N}模块

风险等级: {高/中/低}
下一步: 发布或继续开发
```