---
name: evospec
description: |
  EvoSpec - 确定性软件开发工作流。**规则驱动 + 自动化辅助 + 人工控制**。

  **触发场景（满足任一即触发）**：
  - 用户说"初始化项目"、"开始开发流程"、"EvoSpec"
  - 用户说"需求分析"、"分析PRD"、"架构设计"、"详细设计"
  - 用户说"生成代码"、"编码"、"写单元测试"
  - 用户说"修bug"、"快速修复"、"改一下代码"、"敏捷开发"
  - 用户说"添加规则"、"禁用规则"、"查看规则"
  - 用户有PRD/UE/需求文档需要转化为代码实现
  - 用户纠正代码并提到"以后都这样"、"记住这个"

  **核心能力**：规则强制约束、代码生成、完整流程、状态恢复。
---

# EvoSpec

**让AI写代码更规范、更可控、更高效。**

---

## 一、任务路由

根据用户请求类型，选择执行模式：

| 用户请求 | 执行模式 | 详细流程 |
|---------|---------|---------|
| "初始化项目" | 初始化 | 见「二、初始化项目」|
| "开始开发流程"、"完整流程"、"17流程" | 流程化 | Read references/flow.md |
| "修bug"、"快速修复"、"改一下代码" | 敏捷 | Read references/agile.md |
| "需求分析"、"分析PRD" | 阶段执行 | Read references/phases/req.md |
| "架构设计"、"概要设计" | 阶段执行 | Read references/phases/design.md |
| "详细设计"、"模块设计" | 阶段执行 | Read references/phases/detail.md |
| "生成代码"、"编码" | 阶段执行 | Read references/phases/code.md |
| "集成测试" | 阶段执行 | Read references/phases/test.md |
| "版本发布"、"提交代码" | 阶段执行 | Read references/phases/release.md |
| "添加规则"、"禁用规则"、"查看规则" | 规则管理 | Read references/rules.md |
| "生成文档"、"输出文档" | 文档生成 | Read references/doc.md |

---

## 二、初始化项目

```
用户: "初始化项目"

执行:
1. 检测技术栈
   Glob: build.gradle* → Android
   Glob: CMakeLists.txt → Linux/C++
   Glob: Makefile → QNX/C++

2. AskUserQuestion确认技术栈

3. 创建目录结构
   mkdir -p .evospec/memory
   mkdir -p .evospec/rules-module
   mkdir -p .evospec/outputs

4. Write默认文件（从skill的assets/目录复制到项目）
   - 复制 assets/config.yaml → 项目/.evospec/config.yaml
   - 复制 assets/rules-global.yaml → 项目/.evospec/rules-global.yaml
   - 复制 assets/memory/ → 项目/.evospec/memory/

5. Write .evospec/PROJECT.md

输出:
✅ 项目初始化完成

技术栈: {stack}
目录结构:
.evospec/
├── config.yaml
├── PROJECT.md
├── rules-global.yaml
├── rules-module/
├── memory/
│   └── project_state.yaml
└── outputs/

默认规则: 15条已启用
下一步: 提供PRD文档路径，执行需求分析
```

---

## 三、状态恢复

每次执行时检查状态：

```
1. Read .evospec/memory/project_state.yaml

2. 如果存在未完成阶段:
   - 输出: "上次停在{阶段}"
   - AskUserQuestion: [继续] [重新开始]

3. 如果无状态或已完成:
   - 根据用户请求路由到对应模式
```

---

## 四、规则系统基础

### 4.1 规则格式

```yaml
- id: G001
  content: "ViewModel后缀使用VM"
  scope: global              # global / module:{模块名}
  phase: [code]              # 适用阶段
  trigger_pattern: "ViewModel"  # 触发模式
  action: "使用VM后缀"
  status: enabled            # enabled / disabled

  # 自进化字段
  identity_hash: "a1b2c3d4"  # 身份哈希
  version: "0.1.0"           # 语义版本号
```

### 4.2 规则加载

```
每个阶段执行前:
1. Read .evospec/config.yaml
2. Read .evospec/rules-global.yaml
3. 如有当前模块: Read rules-module/{module}.yaml
4. 过滤: status=enabled AND phase包含当前阶段
5. 匹配: trigger_pattern匹配上下文
6. 注入: 所有匹配规则
```

**详细规则系统**: Read references/core/rules-system.md

---

## 五、文件结构

```
.evospec/
├── config.yaml              # 项目配置
├── PROJECT.md               # 项目信息
├── rules-global.yaml        # 全局规则（15条默认）
├── rules-module/            # 模块规则
│   └── {module}.yaml
├── protocols/               # 协议数据（按需加载）
├── memory/                  # 状态存储
│   ├── project_state.yaml
│   └── change_log.md
└── outputs/                 # 产出物
    ├── req-analysis/
    ├── module-outline/
    ├── module-design/
    └── ...
```

---

## 六、两种模式

### 6.1 流程化模式

完整17步流程，产出完整文档。

```
Phase 1: 需求分析 (S1.1需求分析 → S1.2功能拆解)
Phase 2: 概要设计 (S2.1架构分析 → S2.2模块概要)
Phase 3: 详细设计 (S3.1-S3.5)
Phase 4: 编码开发 (S4.1-S4.5)
Phase 5: 集成测试 (S5.1)
Phase 6: 版本发布 (S6.1-S6.2)
```

**详细流程**: Read references/flow.md

### 6.2 敏捷模式

快速代码修改，规则驱动但无需完整流程。

```
任务输入 → 加载规则 → 执行任务 → 编译验证 → 记录变更
```

**详细流程**: Read references/agile.md

---

## 七、详细参考

以下内容按需加载：

| 需要了解 | 读取文件 |
|---------|---------|
| 完整流程详情 | references/flow.md |
| 敏捷模式详情 | references/agile.md |
| 需求分析阶段 | references/phases/req.md |
| 概要设计阶段 | references/phases/design.md |
| 详细设计阶段 | references/phases/detail.md |
| 编码阶段 | references/phases/code.md |
| 测试阶段 | references/phases/test.md |
| 发布阶段 | references/phases/release.md |
| 规则管理 | references/rules.md |
| 文档生成 | references/doc.md |
| 规则系统详解 | references/core/rules-system.md |
| 身份识别算法 | references/core/identity-merge.md |
| 技术栈详情 | references/stacks/{android|qnx|linux|cpp}.md |
| 产出物模板 | references/templates/{req|design|detail|test}-template.md |

---

## 八、输出格式

### 阶段完成输出

```
📐 Phase {阶段} 完成

产出物:
├── {文件路径}

规则加载:
├── global: {N}条匹配
├── module: {N}条匹配（如有）
└── Token估算: ~{N}k

门控:
├── 编译: ✅ 通过（code阶段）
├── 测试: ✅ 通过（test阶段）

下一步: {下一阶段}
```

### 敏捷模式输出

```
✅ 任务完成

类型: {修改/新增}
模块: {模块名}
文件: {文件路径}

规则加载: required层 {N}条

门控: 编译 ✅ 通过 / 规则 ✅ 全部遵守

变更: 已记录到change_log.md
```