# Node: LOAD_SKILL_CONTEXT

1. 读取 `.agent/skills/registry.yaml`。
2. 解析选中 Skill 的 entry、project config、rules index 和 reference 根目录。
3. 若本次维护 run state，将 `selected_skill`、候选 route、配置文件和规则索引写入其中。
4. 只读取当前 Graph 绑定或当前辅助 route 所需的 reference；禁止一次加载整个 Skill。
5. 若 Skill、配置或 rules index 缺失，输出 `BLOCKED_ENVIRONMENT`，不得静默降级为猜测。
