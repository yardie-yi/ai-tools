# 规则管理

规则位于 `.evospec/rules/`，每条规则独立启用或禁用。项目参数由 `.evospec/module.config.yaml` 提供，规则文件只描述通用约束和读取方式。

## 查看规则

读取 `.evospec/rules/INDEX.md`，按阶段、状态和文件展示规则；随后核对规则 frontmatter 与索引是否一致。

## 启用 / 禁用

1. 修改规则文件 frontmatter 的 `status`。
2. 同步更新 `INDEX.md`。
3. 若规则依赖配置开关，同时检查对应配置路径是否完整。

## 新增规则

规则文件命名：`R<NNN>-<kebab-name>.md`，包含：id、status、name、applies-to、规则内容、检查时机、违规处理和配置依赖。

## 删除规则

删除规则文件并从索引移除；执行前检查其他文档是否引用该规则。

## 执行机制

阶段开始时筛选 `enabled` 且 applies-to 匹配的规则。规则引用的配置为空或关闭时，按规则定义选择跳过、降级或阻止；不得用旧项目值补全。
