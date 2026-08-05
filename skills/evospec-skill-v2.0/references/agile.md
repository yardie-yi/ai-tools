# 敏捷模式详情

**核心：规则强制 + 代码优先 + 最小交互**

---

## 一、敏捷流程

```
用户输入任务
    ↓
1. 推断scope（智能推测）
    ↓
2. 加载规则（匹配分数过滤）
    ↓
3. 执行任务（规则强制约束）
    ↓
4. 编译验证（门控）
    ↓
5. 记录变更（change_log.md）
```

---

## 二、规则加载机制

### 2.1 加载流程

```
1. Read .evospec/config.yaml
2. Read .evospec/rules-global.yaml
3. 推断scope → 如有模块，Read rules-module/{模块}.yaml
4. 过滤：status = enabled
5. 计算匹配分数
6. 分层加载
7. 如有data_ref：Read protocols/{file}
```

### 2.2 规则加载判断

```
判断规则是否加载（满足任一即加载）：
├── 任务描述包含规则的keywords → 加载
├── 任务类型匹配规则的category → 加载
├── 规则priority=critical → 优先加载
└── 规则phase包含agile → 可加载
```

### 2.3 分层加载

| 层级 | 判断条件 | 加载策略 |
|------|---------|---------|
| required | 满足2+个匹配条件 或 priority=critical | 必须加载 |
| recommended | 满足1个匹配条件 | 推荐加载 |
| backup | 无匹配 | 不加载 |

---

## 三、Scope推断

```
从任务描述推断：
├── 明确提到模块名 → module:{模块名}
├── 涉及特定功能模块 → module:{推测模块}
├── 通用代码修改 → global
└── 无法确定 → global（默认）

加载策略：
├── scope=global → 仅rules-global.yaml（~1k tokens）
├── scope=module → rules-global.yaml + rules-module/{模块}.yaml + protocols（~4.5k tokens）
```

---

## 四、门控

| 门控 | 要求 | 失败处理 |
|------|------|---------|
| 编译 | 构建命令通过 | 分析错误→修复→重试（最多3次） |
| 规则 | critical规则全部遵守 | 拒绝代码→提示纠正 |

---

## 五、规则纠正

```
用户纠正："这个ViewModel应该叫WeatherVM"

自动提取：
├── trigger: ViewModel
├── action: 使用VM后缀
├── category: interface（推断）
├── priority: high（推断）
├── scope: 推测值（可修改）

AskUserQuestion确认：
[确认添加] [改scope] [跳过]

添加后：下次任务自动加载新规则
```

---

## 六、输入输出

### 输入
- 任务描述（文字）
- 可选：目标文件路径

### 输出
```
✅ 任务完成

类型：{修改/新增}
模块：{模块名}
文件：{文件路径}

规则加载：
├── required层: {N}条
├── recommended层: {N}条（如有）
└── 协议: {文件名}（如有）

门控：编译 ✅ 通过 / 规则 ✅ 全部遵守

变更：已记录到change_log.md
```