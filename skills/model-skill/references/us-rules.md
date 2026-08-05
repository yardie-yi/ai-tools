# 规则管理

规则存放在 `.evospec/rules/`，每条规则是独立文件，可单独启用/禁用。

## 查看规则

读取 `.evospec/rules/INDEX.md`，显示所有规则的 ID、名称、适用阶段和当前状态。

## 启用 / 禁用规则

1. 打开对应规则文件（如 `.evospec/rules/R001-commit-format.md`）
2. 修改 frontmatter 中的 `status` 字段：
   - `status: enabled` → 启用
   - `status: disabled` → 禁用
3. 同步更新 `.evospec/rules/INDEX.md` 中该行的状态列

## 新增规则

1. 在 `.evospec/rules/` 下创建文件，命名格式：`R<NNN>-<kebab-name>.md`
2. 填写 frontmatter（id / status / name / applies-to）和规则内容
3. 在 `INDEX.md` 追加一行

规则文件模板：

```markdown
---
id: R<NNN>
status: enabled
name: rule-name
applies-to: feature-dev / bug-fix / build / board-deploy / git-submit
---

# R<NNN> · 规则标题

## 规则内容

（描述具体约束）

## 检查时机

（在哪个步骤、什么条件下触发检查）

## 违规处理

（发现违规时如何处理，阻止/提示/自动修复）
```

## 删除规则

1. 删除对应规则文件
2. 从 `INDEX.md` 移除该行

## 规则执行机制

每个开发阶段开始前，读取 `.evospec/rules/INDEX.md`，筛选出 `status: enabled` 且 `applies-to` 包含当前阶段的规则，逐条读取规则文件并在对应检查时机执行验证。
