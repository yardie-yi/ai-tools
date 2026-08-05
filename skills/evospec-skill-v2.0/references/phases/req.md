# 需求分析阶段

执行S1.1需求分析和S1.2功能拆解。

---

## S1.1 需求分析

### 输入
- PRD文档（飞书链接/本地路径/文字描述）

### 执行
```
1. 获取需求文档
   - 飞书链接 → WebFetch
   - 本地路径 → Read
   - 文字描述 → 直接使用

2. Read模板
   - references/templates/req-template.md

3. 加载规则
   - Read .evospec/rules-global.yaml

4. 分析提取
   - 项目背景
   - 业务目标
   - 功能需求
   - 非功能需求
   - 约束条件
   - 潜在问题

5. Write产出
   - .evospec/outputs/req-analysis/report.md

6. Update状态
   - project_state.yaml: completed_steps添加S1.1
```

### 产出物格式
```markdown
# 需求分析报告

## 项目背景
{描述}

## 业务目标
- 目标1: {描述}
- 目标2: {描述}

## 功能需求
| ID | 功能 | 优先级 | 来源 |
|----|------|--------|------|
| F001 | {功能} | P0 | PRD-3.1 |

## 非功能需求
| ID | 类型 | 要求 |
|----|------|------|
| N001 | 性能 | {要求} |

## 问题清单
| ID | 问题 | 建议 |
|----|------|------|
| P001 | {问题} | {建议} |
```

---

## S1.2 功能拆解

### 输入
- S1.1产出

### 执行
```
1. Read .evospec/outputs/req-analysis/report.md

2. 拆解功能点
   - 核心功能（P0）
   - 重要功能（P1）
   - 辅助功能（P2）

3. 评估
   - 复杂度
   - 工时估算
   - 依赖关系

4. Write产出
   - .evospec/outputs/req-breakdown/list.md

5. Update状态
   - project_state.yaml: completed_steps添加S1.2
```

### 产出物格式
```markdown
# 功能拆解清单

## 核心功能（P0）
| ID | 功能 | 复杂度 | 工时 | 依赖 |
|----|------|--------|------|------|
| C001 | {功能} | 高 | 5d | - |

## 重要功能（P1）
| ID | 功能 | 复杂度 | 工时 | 依赖 |
|----|------|--------|------|------|
| I001 | {功能} | 中 | 3d | C001 |

## 开发顺序建议
1. C001 - {原因}
2. C002 - {原因}
```

---

## 输出格式

```
📐 S1.{N} 完成

产出: .evospec/outputs/{dir}/{file}
状态: project_state已更新

下一步: S2.1
```