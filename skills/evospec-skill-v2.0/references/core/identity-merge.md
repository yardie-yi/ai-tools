# 规则身份识别与合并决策

## 一、规则身份识别机制

### 1.1 为什么需要身份识别？

**问题场景**：
```
用户纠正："这个ViewModel应该叫WeatherVM"
→ 创建规则 G016: "ViewModel后缀使用VM"

下次用户说："ViewModel用VM后缀"
→ 创建规则 G017: "ViewModel用VM后缀"  ← 重复！
```

**解决方案**：通过标准化身份哈希识别相同规则，避免重复创建。

### 1.2 身份哈希计算

```
identity_hash = hash(normalize(content + trigger_pattern))

归一化算法：
1. 小写转换
2. 去除标点符号
3. 分词并按字母排序
4. 拼接后计算MD5（取前16位）

示例：
content: "ViewModel后缀使用VM"
trigger: "ViewModel"
→ normalize: "viewmodel viewmodel后缀使用vm"
→ hash: "a1b2c3d4e5f6"
```

### 1.3 相似度判断（简化版）

**不使用精确Jaccard计算，改为语义判断**：

```
判断相似度：
├── 完全相同：identity_hash相同 → 必须合并
├── 高度相似：核心意图相同，表述略有不同 → 建议合并
├── 部分相似：涉及相同关键词，但约束不同 → 询问用户
└── 不相似：完全不同的规则 → 新建

示例判断：
"ViewModel后缀使用VM" vs "ViewModel用VM后缀"
→ 核心意图相同 → 高度相似 → 建议合并

"ViewModel后缀使用VM" vs "ViewModel使用全称"
→ 约束相反 → 部分相似（同一主题）→ 询问用户
```

---

## 二、合并决策逻辑

### 2.1 决策流程

```
用户纠正 → 提取规则候选 → 计算identity_hash → 检查相似规则

决策分支：
├── identity_hash相同（完全匹配）
│   └── AskUserQuestion: "已有相同规则{ID}，是否更新版本？"
│
├── 高度相似（核心意图相同）
│   └── AskUserQuestion: "与规则{ID}相似，建议合并。是否合并？"
│
├── 部分相似（涉及相同关键词，约束不同）
│   └── AskUserQuestion: "与规则{ID}相关。选择：合并/新建/跳过"
│
└── 不相似（完全不同）
    └── 直接创建新规则，无需询问
```

### 2.2 合并策略

**启发式合并（默认）**：
```
保留：
├── name/id: 使用已有规则ID
├── trigger_pattern: 合并关键词（去重）
├── keywords: 合并列表（去重）

更新：
├── content: 选择更完整/更准确的表述
├── action: 选择更具体的动作描述
├── version: patch +1
├── updated_at: 当前时间

记录：
├── history: 添加历史快照
└── merge_source: 记录合并来源
```

**合并示例**：
```yaml
# 原规则
- id: G004
  content: "ViewModel后缀使用VM"
  trigger_pattern: "ViewModel"
  version: "0.1.0"

# 用户纠正："ViewModel用VM后缀，比如WeatherVM"
# 合并后
- id: G004
  content: "ViewModel后缀使用VM，如WeatherVM"  # 更完整
  trigger_pattern: "ViewModel"
  version: "0.1.1"
  history:
    - version: "0.1.0"
      content: "ViewModel后缀使用VM"
      source: default
      created_at: "2026-04-09"
    - version: "0.1.1"
      content: "ViewModel后缀使用VM，如WeatherVM"
      source: user_correction
      merge_from: "用户纠正: ViewModel用VM后缀"
      created_at: "2026-04-09"
```

### 2.3 版本号规则

```
语义版本号：v{major}.{minor}.{patch}

major: 不兼容变更（规则完全改写）
minor: 功能增强（新增约束或扩展）
patch: 小修改（表述优化、关键词扩展）

示例演进：
v0.1.0 → 初始创建
v0.1.1 → 添加示例说明
v0.1.2 → 扩展trigger_pattern关键词
v0.2.0 → 新增约束条件
v1.0.0 → 规则重构（原规则废弃）
```

---

## 三、规则状态机

### 3.1 状态定义

```
status:
├── enabled   - 规则生效，正常加载
├── disabled  - 规则暂停，不加载但保留
├── deprecated - 规则废弃，有替代版本
└── archived  - 规则归档，历史记录
```

### 3.2 状态转换

```
enabled ────────┬────────→ disabled（人工禁用）
                │
                └────────→ deprecated（有新版本替代）
                              │
                              └────────→ archived（归档历史）
                              
disabled ──────────────────→ enabled（人工启用）

deprecated ────────────────→ enabled（回滚）
```

### 3.3 废弃与替代

```yaml
# 新版本规则替代旧版本
- id: G004
  content: "ViewModel后缀使用VM（强制）"
  version: "1.0.0"
  status: enabled
  replaces: "G004-v0.1.2"  # 替代的旧版本
  
# 旧版本标记废弃
- id: G004
  version: "0.1.2"
  status: deprecated
  deprecated_at: "2026-04-09"
  replaced_by: "G004-v1.0.0"
  reason: "强制约束更明确"
```

---

## 四、实施算法（伪代码）

### 4.1 身份识别

```python
import hashlib
import re

def normalize_text(text):
    """归一化文本用于身份识别"""
    text = text.lower()
    text = re.sub(r'[^\w\s]', '', text)
    tokens = sorted(text.split())
    return ' '.join(tokens)

def identity_hash(content, trigger_pattern):
    """计算规则身份哈希"""
    combined = f"{normalize_text(content)}|{normalize_text(trigger_pattern)}"
    return hashlib.md5(combined.encode()).hexdigest()[:16]

def jaccard_similarity(text1, text2):
    """计算Jaccard相似度"""
    set1 = set(normalize_text(text1).split())
    set2 = set(normalize_text(text2).split())
    intersection = len(set1 & set2)
    union = len(set1 | set2)
    return intersection / union if union > 0 else 0
```

### 4.2 合并决策

```python
def decide_merge_action(new_rule, existing_rules):
    """
    决策新规则的处理方式
    返回: ('add', None) | ('merge', rule_id) | ('ask', rule_id)
    """
    new_hash = identity_hash(new_rule.content, new_rule.trigger_pattern)
    
    for rule in existing_rules:
        # 完全匹配
        if rule.identity_hash == new_hash:
            return ('merge', rule.id)  # 直接合并
        
        # 高相似度
        norm_new = normalize_text(f"{new_rule.content} {new_rule.trigger_pattern}")
        norm_old = normalize_text(f"{rule.content} {rule.trigger_pattern}")
        similarity = jaccard_similarity(norm_new, norm_old)
        
        if similarity > 0.85:
            return ('merge', rule.id)  # 建议合并
        elif similarity > 0.7:
            return ('ask', rule.id)    # 询问用户
    
    return ('add', None)  # 创建新规则
```

### 4.3 合并执行

```python
def merge_rules(old_rule, new_content, new_action, new_keywords):
    """合并规则并更新版本"""
    
    # 选择更好的表述
    content = new_content if len(new_content) > len(old_rule.content) else old_rule.content
    
    # 合并关键词
    keywords = list(set(old_rule.keywords + new_keywords))
    
    # 更新版本
    version_parts = old_rule.version.split('.')
    new_version = f"{version_parts[0]}.{version_parts[1]}.{int(version_parts[2])+1}"
    
    # 创建历史记录
    history_entry = {
        'version': new_version,
        'content': content,
        'source': 'user_correction',
        'merge_from': new_content,
        'created_at': datetime.now().isoformat()
    }
    
    return {
        'id': old_rule.id,
        'content': content,
        'keywords': keywords,
        'version': new_version,
        'history': old_rule.history + [history_entry],
        'status': 'enabled'
    }
```

---

## 五、批量处理优化

### 5.1 阶段结束时批量确认

```
收集阶段内所有纠正 → 批量提取规则候选 → 批量决策

批量处理优势：
├── 减少AskUserQuestion次数
├── 可展示相似规则的对比
└── 用户可一键确认多个合并
```

### 5.2 批量确认界面

```
┌────────────────────────────────────────────────────────┐
│ 发现 3 条规则候选                                       │
│                                                        │
│ [1] 新规则: "ViewModel用VM后缀"                        │
│     → 与G004相似度0.92                                 │
│     建议: 合并到G004                                   │
│     [✓ 合并] [✎ 新建]                                  │
│                                                        │
│ [2] 新规则: "Repository用Repo简称"                     │
│     → 与G005冲突（相反约束）                           │
│     建议: 新建并标记冲突                               │
│     [✓ 新建] [✗ 跳过]                                  │
│                                                        │
│ [3] 新规则: "天气模块用AIDL通信"                       │
│     → 无相似规则                                       │
│     建议: 新建为module规则                             │
│     scope: module:weather                              │
│     [✓ 新建] [✎ 改scope]                               │
│                                                        │
│ [全部按建议处理] [逐条审核]                             │
└────────────────────────────────────────────────────────┘
```

---

## 六、规则DNA记录

### 6.1 项目DNA结构

```yaml
# .evospec/project_dna.yaml

identity:
  project_name: "WeatherApp"
  stack: "android"
  domain: ""
  
dna_signature:
  # 规则签名（记录所有生效规则的identity_hash）
  rule_hashes:
    - G001: "hash_abc123"
    - G004: "hash_def456"
    - MW001: "hash_ghi789"
  
  # 规则继承来源
  inheritance:
    - template: "android-standard"
      version: "1.2.0"
      inherited_at: "2026-04-09"
      rules_count: 15
  
  # 本地进化记录
  local_evolution:
    corrections_count: 5
    rules_created: 2
    rules_merged: 3
    last_evolution: "2026-04-09"

# DNA快照历史
snapshots:
  - version: "0.1.0"
    date: "2026-04-01"
    rule_hashes: [...]
    description: "初始化"
    
  - version: "0.2.0"
    date: "2026-04-09"
    rule_hashes: [...]
    description: "添加天气模块规则"
```

### 6.2 DNA用途

```
DNA用途：
├── 项目识别：通过规则签名区分项目特征
├── 状态恢复：从DNA快照恢复规则状态
├── 进化追溯：查看规则演变历程
├── 模板贡献：提取项目DNA贡献到模板
└── 冲突检测：与模板DNA对比发现冲突
```