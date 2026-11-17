# Git 提交管理

> Commit、push、分支和禁止提交项来自 `.evospec/module.config.yaml` → `git`、`work_item`、`paths`。

## 提交前检查

1. 查看 `git status`、`git diff` 和必要的测试/验证结果。
2. 只暂存本次任务相关文件，优先 `git add <具体路径>`。
3. 对照 `<config: git.forbidden_paths>` 和 R005 检查暂存区。
4. 若启用 R002 且这是 Bug 修复提交，确认 `<config: paths.bug_log_output>` 已生成记录。
5. 不修改或覆盖用户无关改动。

## Commit Message

使用 `<config: git.commit.template>`，将 `{task.id}` 与 `{task.summary}` 替换为真实值，并遵守语言与长度配置。任务编号缺失时不得编造。

示例仅展示模板变量，不代表固定项目格式：

```text
<rendered git.commit.template>
```

## 提交与推送

```bash
git status
git diff --cached
git commit -m "<rendered commit message>"
```

仅在用户明确请求并授权 push 时，由 `<config: git.push.command_template>` 渲染推送命令。执行前确认当前分支、remote 和目标分支；网络或权限失败时保留 commit，并给出相同的已渲染命令供用户在正确环境执行。Commit 本身也须符合 Graph 的授权边界；仅请求 commit 时不得连带 push。

## 生成提交记录

push 成功后，在 `<config: paths.push_log_output>` 生成文件，命名遵循 `<config: work_item.filename_template>`。

```markdown
# 提交记录

- 日期：YYYY-MM-DD
- <任务编号标签>：#XXXXXX
- 分支：
- Commit：

## Commit Message
## 提交文件列表
| 文件 | 改动说明 |
|---|---|
## 构建与验证结论
## 推送目标
```
