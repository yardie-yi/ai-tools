# change_log.md 格式说明

每个被 refine 的 skill 目录下维护一个 `change_log.md`。它是这个 skill"为什么长成现在这样"的真实记录，优先级高于任何推断。

## 文件整体结构

```markdown
# Change Log — {skill name}

> 本文件由 skill-refiner 自动维护。新条目追加在顶部（最新在上）。

## {YYYY-MM-DD} {一句话标题}
...（单条模板见 assets/change_log_entry.md）

## {YYYY-MM-DD} {一句话标题}
...
```

## 维护规则

1. **新增在顶部**：方便一眼看到最近改动。
2. **标题用人话**：例如 "补上敏捷模式触发词"、"改 commit 模板去掉 emoji"，而不是 "update SKILL.md"。
3. **一次 refine = 一个条目**：即使本次同时改了 3 个文件，也合并成一条，内部列出涉及文件即可。
4. **不删历史条目**：即便后来又反向改回去，也保留历史条目 —— 历史轨迹本身是重要信息。如果新改动逻辑上否定了旧条目，在新条目里显式引用旧条目日期。
5. **change_log.md 不进 description，也不进正文 context**：它只在下次跑 skill-refiner 时被读取，避免膨胀日常触发的 context。

## skill-refiner 使用 change_log 的时机

- **Step 1 定位目标后**：读一遍 change_log，了解历史改动脉络
- **Step 3 映射到文件时**：检查这次要加的约束是否与历史条目冲突。冲突则在 Step 4 的 diff 预览里明确告知用户
- **Step 5 写入**：追加新条目到顶部
