---
id: R002
status: enabled
name: log-required
applies-to: bug-fix, git-submit
---

# R002 · 操作记录必须生成

## 配置依赖

- `paths.bug_log_output`
- `paths.push_log_output`
- `work_item.filename_template`

## 规则内容

- Bug 修复完成并验证通过后，提交前生成修复记录。
- push 成功后生成提交记录。
- 记录必须包含任务编号、修改文件、验证证据和实际结果；不能只写“已修复”。

## 违规处理

缺少记录时阻止进入下一阶段，并按对应 reference 的模板生成。
