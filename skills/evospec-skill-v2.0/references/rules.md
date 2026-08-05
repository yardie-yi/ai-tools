# 规则管理

添加、禁用、查看、分析规则。支持自进化机制：身份识别、智能合并、版本追踪。

---

## 一、添加规则（含自进化机制）

### 1.1 完整流程

```
用户纠正："这个ViewModel应该叫WeatherVM"

Step 1: 自动提取
├── trigger: ViewModel
├── action: 使用VM后缀
├── phase: [code]
├── scope: 推测（global/module）
├── content: "ViewModel后缀使用VM"

Step 2: 计算identity_hash
├── normalize: "viewmodel viewmodel后缀使用vm"
├── hash: MD5取前8位 → "a1b2c3d4"

Step 3: 检查相似规则
├── 查找相同identity_hash → 完全匹配
├── 语义相似度判断

Step 4: 决策分支
├── 完全匹配 → AskUserQuestion: 更新版本？
├── 高相似 → AskUserQuestion: 合并？
├── 中相似 → AskUserQuestion: 合并/新建？
└── 不相似 → 直接新建
```

### 1.2 相似度判断（语义判断）

```
简化判断方法：
├── 完全相同：identity_hash相同 → 必须合并
├── 高度相似：核心意图相同，表述略有不同 → 建议合并
├── 部分相似：涉及相同关键词，但约束不同 → 询问用户
└── 不相似：完全不同的规则 → 新建

示例：
"ViewModel后缀使用VM" vs "ViewModel用VM后缀"
→ 核心意图相同 → 高度相似 → 建议合并

"ViewModel后缀使用VM" vs "ViewModel使用全称"
→ 约束相反 → 部分相似 → 询问用户
```

### 1.3 合并执行

```
选择合并时：
├── 保留: id, identity_hash
├── 选择: 更完整的content表述
├── 合并: keywords, trigger_pattern（去重）
├── 更新: version patch +1 (0.1.1 → 0.1.2)
├── 添加: history记录
└── 输出: ✅ 规则G004已更新（v0.1.2）
```

---

## 二、禁用规则

```
用户: "禁用规则G003"

执行：
1. Read rules-global.yaml
2. 找到id: G003
3. Edit: status: enabled → disabled
4. 输出确认信息
```

---

## 三、查看规则

### 3.1 查看规则列表

```
用户: "查看所有规则"

输出：
┌────────────────────────────────────────┐
│ 规则列表                                │
│                                        │
│ Global (12条)                          │
│ ├─ G001: ViewModel后缀VM [v0.1.1]     │
│ ├─ G002: Repository全称 [v0.1.0]      │
│ └─ G003: 私有变量_前缀 [disabled]      │
│                                        │
│ Module: weather (3条)                  │
│ └─ M001: 使用AIDL通信 [v0.1.0]        │
└────────────────────────────────────────┘
```

### 3.2 查看规则历史

```
用户: "查看规则G004的历史"

执行：
1. Read rules-global.yaml
2. 提取history字段
3. 输出演变历程
```

---

## 四、分析规则

```
用户: "为什么G001没有生效？"

执行：
1. Read规则定义
2. 分析当前上下文
3. 检查匹配条件

输出：
┌────────────────────────────────────────┐
│ 规则 G001 分析                          │
│                                        │
│ 规则: ViewModel后缀使用VM               │
│ trigger_pattern: ViewModel              │
│ status: enabled                         │
│                                        │
│ 当前上下文:                             │
│ ├─ phase: code ✓                       │
│ ├─ scope: global ✓                      │
│ └─ trigger匹配: ❌ 未找到ViewModel      │
│                                        │
│ 结论: 上下文中未出现ViewModel关键词     │
└────────────────────────────────────────┘
```

---

## 五、版本演进规则

```
v{major}.{minor}.{patch}

major: 不兼容变更（规则完全改写）
minor: 功能增强（新增约束或扩展）
patch: 小修改（表述优化、关键词扩展）

示例演进：
v0.1.0 → 初始创建
v0.1.1 → 添加示例说明
v0.1.2 → 扩展trigger_pattern关键词
```

---

## 六、详细参考

身份识别算法详解：Read `references/core/identity-merge.md`