---
name: skill-refiner
description: |
  根据本轮对话中的用户纠正，把经验沉淀回被调用的 skill 定义里，让同类问题下次不再发生。相当于给 skill 做"事后复盘补丁"。

  **触发场景（仅手动触发）**：
  - 用户说"优化刚才那个 skill"、"把这次的纠正沉淀进去"、"/skill-refiner"
  - 一段对话里用户反复纠正某个 skill 的输出，最终拿到满意结果，并要求"记住这次改法"
  - 用户指定 skill 路径或名字，要求根据最近对话改进它

  **不要在以下情况触发**：
  - 用户只是说"记住这个"但没指向某个 skill —— 那是 memory 的职责
  - 本次对话里没有任何 skill 被调用过 —— 没有优化对象
  - 用户只想要一次性修改输出，没说"以后都这样" —— 不用动 skill 本体
---

# skill-refiner

把"这次对话里用户纠正了什么"沉淀回目标 skill，避免下次重复踩坑。

核心理念：**skill 会在线上被用很多次，但只有用户在现场纠正时，我们才知道它哪里不够好**。这个 skill 的工作就是把一次纠正变成长期改进。

---

## 一、工作流程（5 步）

### Step 1 · 定位目标 skill

1. 回看对话历史，找出本轮被调用过、且收到过用户纠正的 skill。
2. 如果候选有多个，用 `AskUserQuestion` 让用户选一个。
3. 定位 skill 目录：
   - 用户自建：`C:\Users\Administrator\.claude\skills\<name>\`
   - 插件/marketplace 提供（路径含 `plugins/marketplaces/...`）：这类目录通常只读且会被插件更新覆盖。先把它复制到 `~/.claude/skills/<name>/`，告诉用户"已克隆到用户目录后再修改，避免被插件更新覆盖"。

### Step 2 · 归纳纠正点

读取 `references/diagnose.md`。对本次对话做一次复盘，为每一处纠正产出一行：

```
原输出 X  →  用户纠正为 Y  →  推测根因 Z  →  根因分类 [trigger/flow/detail/template]
```

**为什么要分类**：后面决定"改哪个文件"完全取决于根因分类，分类不清就会改错地方。

### Step 3 · 映射到文件

读取 `references/patch-patterns.md`。按根因分类决定改哪里：

| 根因 | 改哪里 | 典型场景 |
|---|---|---|
| trigger | `SKILL.md` 的 frontmatter `description` | 该触发没触发 / 不该触发却触发了 |
| flow | `SKILL.md` 正文 | 步骤缺失、顺序错、判断条件漏 |
| detail | `references/*.md` | 某阶段细节偏差（技术栈差异、领域术语、模板变体） |
| template | `assets/*` | 产出的模板、默认配置、示例文件不对 |

一次纠正可能命中多类 —— 分别记录、分别改。

### Step 4 · 给出 diff 预览并等用户确认

- 对每个要动的文件，输出 `before → after` 片段（不是整文件，只给上下文片段）
- 每条改动配一句话说明 **为什么要改（WHY）**，而不是"改成什么（WHAT）"—— 这决定了模型未来能不能举一反三
- 用 `AskUserQuestion` 让用户选：
  - **全部应用**
  - **部分应用**（再逐条确认）
  - **取消**
- 确认后用 `Edit` 落盘；`Edit` 不适用（例如新文件、整块追加）时才用 `Write`

### Step 5 · 写 change_log

在目标 skill 目录追加（或新建）`change_log.md`，套用 `assets/change_log_entry.md` 模板。

**为什么要写日志**：

1. 下次再来优化同一个 skill 时，先读 change_log 可以避免反复横跳（"上次为这个问题加了 A，这次又因为相反的抱怨要删 A"）。
2. 是对"为什么 skill 长成现在这样"最真实的记录，比 git blame 更贴近意图。

---

## 二、输出格式

```
🔧 skill-refiner

目标 skill: {name}  路径: {resolved path}
{若是 marketplace 克隆，注明 "已克隆到 ~/.claude/skills/{name}/"}

纠正归纳 ({N} 条):
  1. [flow]     {X → Y，1 行}
  2. [detail]   {X → Y，1 行}
  ...

待改动文件:
  ├── SKILL.md       ({M1} 处)
  └── references/xxx.md  ({M2} 处)

[展示 diff 片段]

[AskUserQuestion: 全部应用 / 部分应用 / 取消]

── 落盘后 ──

✅ 已更新 {skill name}
   修改文件: {list}
   日志:   {skill dir}/change_log.md (新增 1 条)
```

---

## 三、写作纪律（移植自 skill-creator）

1. **先解释 WHY，再写约束**。不要堆 `ALWAYS / MUST / NEVER`。LLM 懂理由时能举一反三，看到硬命令时只会机械应付。
2. **最小改动**。只修复本次纠正暴露的问题，不要顺手重构。skill 正文过长会拉高触发后的 context 成本。
3. **Token 意识**。如果一次改动让 `SKILL.md` 接近 500 行，考虑把细节下沉到 `references/`，正文留指针。
4. **description 要"略激进"但有边界**。正向列触发场景，反向列不触发场景，两者都要。

---

## 四、按需参考

| 需要 | 读取 |
|---|---|
| 如何从对话里推断根因分类 | `references/diagnose.md` |
| 四类根因对应改法的示例 | `references/patch-patterns.md` |
| change_log 固定格式 | `references/changelog-template.md` |
| change_log 单条模板 | `assets/change_log_entry.md` |
