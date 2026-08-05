# 改法模式库：四类根因对应怎么改

每一类给 2 个 before/after 示例。目的是让你看到实际的修改粒度，避免"改得太大"或"改得太虚"。

通用原则：
- **改动最小**：只碰与本次纠正直接相关的几行
- **写 WHY**：新增约束旁边用一行说明理由
- **避免堆命令式**：少用 `MUST / ALWAYS`，多写"因为 X 所以通常 Y"

---

## 1. trigger —— 改 `SKILL.md` frontmatter `description`

### 示例 A：该触发却没触发

用户抱怨 "你怎么修 bug 的时候没走 evospec 的敏捷流程"。

**Before**
```yaml
description: |
  EvoSpec 开发流程。

  触发场景：
  - "初始化项目"
  - "开始开发流程"
```

**After**（补上缺失的触发词）
```yaml
description: |
  EvoSpec 开发流程。

  触发场景：
  - "初始化项目"、"开始开发流程"
  - "修 bug"、"快速修复"、"改一下代码"    # ← 新增：覆盖敏捷模式入口
  - 用户在 EvoSpec 项目目录下做任何代码修改请求
```

### 示例 B：不该触发却触发了

用户抱怨"只是问个概念，你一上来就跑了一套完整流程"。

**Before**
```yaml
description: |
  ...触发词 "需求分析"...
```

**After**（加反向边界）
```yaml
description: |
  ...触发词 "需求分析"...

  不要触发：
  - 用户只是在**询问概念**（"什么是需求分析"），不是在做需求分析
  - 用户没有可分析的 PRD/需求文档
```

---

## 2. flow —— 改 `SKILL.md` 正文

### 示例 A：漏了一步

用户每次都要手动提醒"先看一下当前分支"。

**Before**（正文）
```markdown
## 提交流程
1. 收集 diff
2. 生成 commit message
3. 执行 commit
```

**After**
```markdown
## 提交流程
1. 确认当前分支（避免误提到主干 / 错误的 feature 分支）
2. 收集 diff
3. 生成 commit message
4. 执行 commit
```

### 示例 B：判断条件缺失

用户说"如果已经有编译产物就别再编译一次"。

**Before**
```markdown
### Step 3 · 编译验证
执行 build 命令，失败则报错退出。
```

**After**
```markdown
### Step 3 · 编译验证
1. 先看 `build/` 是否存在且较新（改动文件均早于构建产物）。
   **Why**：重复编译大型 C++ 工程要几分钟，跳过能显著缩短敏捷迭代。
2. 需要编译时才执行 build；失败则报错退出。
```

---

## 3. detail —— 改 `references/*.md`

命中这类时，说明 SKILL.md 正文不是问题，某个**具体阶段/变体**的细节文档需要调整。

### 示例 A：技术栈差异

用户在 QNX 项目里纠正"我们编译命令不是 cmake --build，是 qmake"。

**Before** `references/stacks/qnx.md`
```markdown
build:
  command: "cmake --build build"
```

**After**
```markdown
build:
  command: "qmake && make"     # QNX 的约定：qmake 生成 Makefile 后 make
  # Why: QNX Momentics 默认工具链走 qmake，cmake 需要额外配置，本项目没有
```

### 示例 B：术语/单位

用户纠正"我们把 ViewModel 叫 VM 后缀，不是 ViewModel 后缀"。

**Before** `references/phases/code.md`
```markdown
### 命名约定
- ViewModel 使用 `XxxViewModel` 后缀
```

**After**
```markdown
### 命名约定
- ViewModel 使用 `XxxVM` 后缀（项目约定，详见规则 G002）
```

---

## 4. template —— 改 `assets/*`

### 示例 A：默认配置文件不对

用户每次初始化后都要改 `assets/config.yaml` 里的 stack。

**Before** `assets/config.yaml`
```yaml
project:
  stack: "android"
```

**After**
```yaml
project:
  stack: "linux/cpp"   # 本机常见项目类型；初始化时可被 AskUserQuestion 覆盖
```

### 示例 B：commit message 模板

用户纠正"我们的 commit 不用 emoji、不加 Co-Authored-By"。

**Before** `assets/commit_message_template.md`
```
✨ feat({scope}): {summary}

Co-Authored-By: Claude <noreply@anthropic.com>
```

**After**
```
feat({scope}): {summary}

{body}
```

---

## 什么时候**新建**一个文件而不是改现有文件

- 某类细节在现有 `references/` 里没有对应文档 → 新建一个 `references/{topic}.md`，并在 SKILL.md 正文"按需参考"表里加一行指针
- 新的模板/默认配置 → 新建 `assets/{name}`
- 绝大多数情况应当**改现有文件**，只有当你要加的东西明显不属于任何现有文件时才新建

---

## 多处命中怎么办

一次纠正可能同时是 flow + detail（例如"流程里漏了编译这一步，而且我们的编译命令是 X"）。做法：

1. 分别落到各自文件（SKILL.md 加步骤，`references/stacks/*.md` 改命令）
2. change_log 里分两条记录，根因分类分别标注
