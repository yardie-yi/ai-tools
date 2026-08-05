# 详细设计阶段

执行S3.1-S3.5。

---

## S3.1 模块架构

### 输入
- S2.2模块概要设计

### 执行
```
1. Read .evospec/outputs/module-outline/design.md
2. Read .evospec/rules-module/{module}.yaml
3. 分层设计
4. 组件划分
5. Write .evospec/outputs/module-arch/{module}.md
```

### 产出物
```markdown
# 模块架构: {module}

## 分层设计
| 层 | 职责 | 组件 |
|----|------|------|
| UI | {职责} | {组件} |

## 组件交互
{Mermaid序列图}
```

---

## S3.2 设计模式

### 输入
- S3.1模块架构

### 执行
```
1. Read .evospec/outputs/module-arch/{module}.md
2. 分析业务场景
3. 候选模式对比
4. Write .evospec/outputs/design-pattern/selection.md
```

### 产出物
```markdown
# 设计模式选型

## 业务场景
{描述}

## 候选模式
| 模式 | 适用性 | 优点 | 缺点 |
|------|--------|------|------|
| {模式} | {适用} | {优点} | {缺点} |

## 推荐
**{模式}**: {理由}
```

---

## S3.3 模块详细设计

### 输入
- S3.1 + S3.2

### 执行
```
1. Read S3.1和S3.2产出
2. 类/结构设计
3. 方法设计
4. Write .evospec/outputs/module-design/{module}.md
```

### 产出物
```markdown
# 模块详细设计: {module}

## 类设计
| 类 | 职责 | 方法 |
|----|------|------|
| {类} | {职责} | {方法} |

## 类关系图
```mermaid
classDiagram
    class A { }
```
```

---

## S3.4 时序图

### 输入
- S3.3模块详细设计

### 执行
```
1. Read .evospec/outputs/module-design/{module}.md
2. 绘制主流程时序图
3. 绘制异常流程时序图
4. Write .evospec/outputs/seq-diagram/diagrams.md
```

---

## S3.5 接口定义

### 输入
- S3.3模块详细设计

### 执行
```
1. Read .evospec/outputs/module-design/{module}.md
2. 提取接口定义
3. 定义参数和返回值
4. Write .evospec/outputs/interface-def/interfaces.md
```

### 产出物
```markdown
# 接口定义

## I001: {接口名}

**描述**: {描述}

**参数**:
| 名 | 类型 | 必填 | 说明 |
|----|------|------|------|
| param | string | Y | 说明 |

**返回**:
| 名 | 类型 | 说明 |
|----|------|------|
| result | object | 说明 |

**示例**:
```
{代码示例}
```
```

---

## 并行执行

```
[S3.1, S3.2] 可并行
[S3.4, S3.5] 可并行（依赖S3.3）
```

---

## 输出格式

```
📐 S3.{N} 完成

产出: .evospec/outputs/{dir}/{file}
并行: {可并行的Steps}

下一步: S4.1
```