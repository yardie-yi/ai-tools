---
id: R001
status: enabled
name: commit-format
applies-to: git-submit
---

# R001 · Commit Message 格式规范

## 配置依赖

- `git.commit.template`
- `git.commit.summary_language`
- `git.commit.max_summary_length`
- `work_item.id_pattern`

## 规则内容

Commit message 必须由配置模板渲染；所有变量必须有真实来源。任务编号缺失或格式不匹配时阻止提交，不得使用历史编号或示例值代替。

## 检查时机

执行 `git commit` 前。

## 违规处理

展示未满足的配置路径或变量，并保留已暂存内容，不执行 commit。
