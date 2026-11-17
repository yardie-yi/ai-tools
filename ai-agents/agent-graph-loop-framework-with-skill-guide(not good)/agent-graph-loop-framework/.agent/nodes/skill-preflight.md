# Node: SKILL_PREFLIGHT

执行选中 Skill 阶段前检查：

1. 从 `.agent/skills/registry.yaml` 读取选中 Skill 的 `project_config`、`rules_index` 和 reference。
2. 若配置文件存在，确认其可解析且 schema/version 受支持；没有项目配置的纯流程 Skill 可省略该项。
3. 当前 route 所需配置节存在，命令、路径和标识中不存在 `REQUIRED`、`PLACEHOLDER`、`TODO_CONFIG` 等未解析标记。
4. 若配置了 rules index，确认索引与规则 frontmatter 一致，并只筛选当前 route 启用的规则。
5. 涉及部署、push、删除、停止进程、发布或覆盖文件时，确认用户授权、目标和回滚条件。
6. 可以安全完成的只读分析或 dry-run 不因无关字段缺失而停止。
7. 不把 registry 中不存在的默认配置路径写入 run state。

输出：`EXECUTABLE`、`DRY_RUN_ONLY`、`NEED_USER_DECISION` 或 `BLOCKED_ENVIRONMENT`。
