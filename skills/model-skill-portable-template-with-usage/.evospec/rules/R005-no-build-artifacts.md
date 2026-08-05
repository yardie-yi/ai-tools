---
id: R005
status: enabled
name: no-build-artifacts
applies-to: git-submit
---

# R005 · 禁止提交生成产物

## 配置依赖

`git.forbidden_paths` 与 `artifacts[*].local_path`

## 规则内容

暂存区不得包含配置列出的生成产物或禁止路径，除非用户明确说明该仓库就是产物仓库且规则已被正式禁用。

## 检查时机

`git add` 后、`git commit` 前，通过 `git diff --cached --name-only` 检查。

## 违规处理

仅对违规路径执行取消暂存，保留用户其他暂存内容，并建议完善 `.gitignore`。
