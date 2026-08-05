# EvoSpec 快速上手指南

**让AI写代码更规范、更可控、更高效**

---

## 一、安装

### 1. 下载并解压

```bash
# 下载 evospec-skill-v2.0.zip
# 解压到 Claude Code 的 skills 目录：

# Windows
C:\Users\{你的用户名}\.claude\skills\evospec\

# Mac/Linux
~/.claude/skills/evospec/
```

### 2. 验证安装

重启 Claude Code 后，输入：

```
初始化项目
```

如果看到项目初始化流程，说明安装成功。

---

## 二、两种开发模式

### 敏捷模式 - 快速修改

**适用场景**：修bug、小功能、快速迭代

```
你说："修复登录验证的bug"
你说："给天气模块加个缓存"
你说："这个ViewModel改成用VM后缀"
```

**AI会做什么**：
1. 自动加载相关规则
2. 按规则约束修改代码
3. 编译验证
4. 记录变更到 `.evospec/memory/change_log.md`

### 流程模式 - 完整开发

**适用场景**：新项目、正式流程、需要文档

```
你说："开始开发流程，PRD在 docs/prd.md"
```

**AI会执行17步流程**：

| Phase | 步骤 | 产出物 |
|-------|------|--------|
| 需求分析 | S1.1需求分析 → S1.2功能拆解 | 需求spec、功能清单 |
| 概要设计 | S2.1架构分析 → S2.2模块概要 | 架构图、模块清单 |
| 详细设计 | S3.1-S3.5 | 类设计、时序图、接口定义 |
| 编码开发 | S4.1-S4.5 | 代码、单元测试、测试报告 |
| 集成测试 | S5.1 | 集成测试报告 |
| 版本发布 | S6.1-S6.2 | 提交记录、影响分析 |

---

## 三、常用命令速查

| 你说 | AI执行 |
|------|--------|
| `"初始化项目"` | 创建 `.evospec/` 目录和默认文件 |
| `"开始开发流程"` | 执行17步完整流程 |
| `"修bug"` / `"快速修复"` | 敏捷模式修复 |
| `"需求分析"` | 分析PRD文档 |
| `"架构设计"` | 设计模块结构 |
| `"生成代码"` | 编写代码 |
| `"查看规则"` | 列出所有规则 |
| `"禁用规则G003"` | 关闭某条规则 |
| `"生成文档"` | 从代码反向生成设计文档 |

---

## 四、自定义模板

### 4.1 模板文件位置

```
evospec/
└── assets/                    # 模板目录
    ├── config.yaml            # 项目配置模板
    ├── rules-global.yaml      # 默认规则模板
    ├── memory/                # 状态存储模板
    └── protocols/             # 协议示例
```

### 4.2 修改默认配置

**config.yaml** - 项目基础配置：

```yaml
project:
  name: "MyProject"
  stack: "android"           # android / qnx / linux / cpp
  modules: []

synonyms:
  "跨进程": ["IPC", "AIDL", "Binder"]
  "协程": ["coroutine", "async"]

build:
  command: "./gradlew assembleDebug"
  test_command: "./gradlew test"
```

**修改方法**：直接编辑 `assets/config.yaml`，初始化项目时会自动复制。

### 4.3 修改默认规则

**rules-global.yaml** - 默认15条规则：

```yaml
rules:
  - id: G001
    content: "遵循MVVM架构模式"
    category: architecture
    phase: [code]
    trigger_pattern: "架构|分层|MVC|MVP"
    status: enabled
    
  - id: G002
    content: "ViewModel后缀使用VM"
    category: interface
    phase: [code]
    trigger_pattern: "ViewModel"
    action: "使用VM后缀，如WeatherVM"
    status: enabled
    
  # ... 更多规则
```

**修改方法**：
- 禁用规则：`status: disabled`
- 修改规则：直接编辑内容
- 新增规则：添加新的规则条目

### 4.4 添加技术栈模板

创建 `assets/stacks/{技术栈}.yaml`：

```yaml
# assets/stacks/flutter.yaml
build:
  command: "flutter build apk"
  test_command: "flutter test"

default_rules:
  - id: F001
    content: "使用BLoC状态管理"
    phase: [code]
    trigger_pattern: "状态|State"
```

---

## 五、规则维护

### 5.1 查看规则

```
你说："查看所有规则"
```

输出：
```
┌────────────────────────────────────────┐
│ 规则列表                                │
│                                        │
│ Global (15条)                          │
│ ├─ G001: 遵循MVVM架构 [enabled]       │
│ ├─ G002: ViewModel后缀VM [enabled]    │
│ └─ G003: 私有变量_前缀 [disabled]      │
│                                        │
│ Module: weather (3条)                  │
│ └─ M001: 使用AIDL通信 [enabled]       │
└────────────────────────────────────────┘
```

### 5.2 禁用/启用规则

```
你说："禁用规则G003"
你说："启用规则G003"
```

### 5.3 自动学习规则

**触发时机**：当你纠正AI代码时说"以后都这样"

```
AI写的代码：class WeatherViewModel

你纠正："这个应该叫WeatherVM，以后都这样"

AI自动：
1. 提取规则：ViewModel后缀用VM
2. 确认scope：global
3. 写入 rules-global.yaml
4. 下次自动遵守
```

### 5.4 规则文件结构

```
.evospec/
├── rules-global.yaml        # 全局规则（所有项目通用）
└── rules-module/            # 模块规则（特定模块专用）
    ├── weather.yaml         # 天气模块规则
    └── navigation.yaml      # 导航模块规则
```

---

## 六、AI何时使用规则

### 6.1 自动加载时机

| 场景 | 加载规则 | 示例 |
|------|---------|------|
| 敏捷模式修复 | 任务相关规则 | "修复天气模块的AIDL bug" → 加载通信类规则 |
| 流程编码阶段 | code阶段规则 | 生成代码时加载命名、架构规则 |
| 用户纠正 | 提取新规则 | "以后ViewModel都用VM后缀" → 创建新规则 |

### 6.2 规则匹配逻辑

```
满足任一条件即加载：
├── 任务描述包含规则的keywords
├── 任务类型匹配规则的category  
├── 规则priority=critical（必须加载）
└── 规则phase包含当前阶段
```

### 6.3 规则优先级

| 优先级 | 说明 | 违反后果 |
|-------|------|---------|
| critical | 必须遵守 | AI拒绝生成代码，提示纠正 |
| high | 强烈建议 | AI警告，但仍可执行 |
| medium | 推荐遵守 | AI尽量遵守，可灵活处理 |
| low | 可选参考 | AI视情况参考 |

---

## 七、典型使用流程

### 场景1：新项目开发

```
1. 你说："初始化项目"
   → AI创建 .evospec/ 目录

2. 你说："开始开发流程，PRD在 docs/prd.md"
   → AI执行需求分析 → 架构设计 → 编码

3. 你纠正："这个Repository应该叫WeatherRepo"
   → AI记住规则，下次自动遵守

4. 你说："提交代码"
   → AI生成commit message，更新CHANGELOG
```

### 场景2：快速修复Bug

```
1. 你说："修复天气模块的AIDL连接超时问题"
   → AI加载AIDL相关规则
   → 修复代码
   → 编译验证
   → 记录到 change_log.md

2. 你说："查看规则"
   → 检查是否有相关规则需要调整
```

### 场景3：团队协作

```
1. 技术负责人配置 rules-global.yaml
2. 提交到Git仓库
3. 团队成员clone项目，自动获得相同规则
4. AI对所有成员遵守相同的代码规范
```

---

## 八、文件结构说明

### 初始化后的项目结构

```
你的项目/
├── .evospec/                 # EvoSpec配置目录
│   ├── config.yaml           # 项目配置
│   ├── PROJECT.md            # 项目说明
│   ├── rules-global.yaml     # 全局规则
│   ├── rules-module/         # 模块规则
│   │   └── weather.yaml
│   ├── memory/               # 状态存储
│   │   ├── project_state.yaml    # 当前阶段
│   │   └── change_log.md         # 变更记录
│   └── outputs/              # 产出物
│       ├── req-analysis/     # 需求分析
│       ├── module-outline/   # 模块概要
│       └── ...
├── src/                      # 你的代码
└── ...
```

---

## 九、常见问题

**Q：规则太多会不会影响性能？**

A：不会。规则采用按需加载，每次只加载相关规则，Token消耗约1-4.5k。

**Q：规则写错了怎么办？**

A：直接编辑 `.evospec/rules-global.yaml` 文件，或说"禁用规则G00X"。

**Q：如何让规则在团队间共享？**

A：把 `.evospec/` 目录提交到Git，团队成员clone后自动获得相同规则。

**Q：AI不遵守规则怎么办？**

A：检查规则的 `status` 是否为 `enabled`，以及 `trigger_pattern` 是否匹配当前上下文。说"为什么G001没生效？"让AI分析。

**Q：如何清空所有规则重新开始？**

A：删除 `.evospec/rules-global.yaml`，重新说"初始化项目"。

---

## 十、下一步

1. 尝试"初始化项目"体验基础功能
2. 准备一个PRD文档，执行"开始开发流程"
3. 在编码过程中纠正AI，观察规则自动学习
4. 根据团队规范修改 `assets/rules-global.yaml`

**开始使用：现在就说"初始化项目"！**