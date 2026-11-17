# Project Skill Workflow Graph

**用途**：处理现有核心 Graph 未单独建图的已注册 Skill 辅助阶段。当前默认包括 model-skill 的普通构建、部署/推板、Git 提交与 push、调试命令、项目资源、环境检查、代码分析和规则管理；后续 Skill 可按 `docs/ADDING_SKILLS.md` 增加 route。

```text
START
  → LOAD_SKILL_CONTEXT
  → SELECT_SKILL_ROUTE
  → SKILL_PREFLIGHT
      ├─ configuration complete → EXECUTE_SKILL_ROUTE
      ├─ safe read-only/dry-run possible → EXECUTE_SAFE_PART
      └─ blocking configuration missing → NEED_USER_DECISION / BLOCKED
  → VERIFY_STAGE_OUTPUT
  → OPTIONAL_REVIEW
  → REPORT
  → DONE
```

## 引用节点

- `.agent/nodes/load-skill-context.md`
- `.agent/nodes/skill-preflight.md`
- `.agent/nodes/execute-skill-route.md`
- `.agent/nodes/report.md`
- `.agent/loops/universal-loop.md`

## 路由来源

1. 读取 `.agent/skills/registry.yaml`。
2. 根据用户显式选择、任务目标和全局唯一的 `auxiliary_routes` 选择 Skill 与 route。
3. 读取选中 Skill 的 entry；不得默认所有 route 都属于 model-skill。
4. 只加载该 route 对应的 reference、registry 声明的配置文件和当前阶段启用规则。

## 当前 model-skill route 的权限边界

- `project-info`、`env-setup`、`code-analysis`、`rules` 默认只读；用户明确要求生成分析文档或修改规则时，按目标范围受控写入。
- `build` 可执行构建，但不得自行清理未知目录。
- `board-deploy` 默认先 `--list` / `--dry-run`；真实部署、删除目标端文件或重启进程需要用户明确授权且配置完整。
- `git-submit` 默认只检查 status/diff 和生成建议；执行 commit、push 前必须有真实任务编号、目标分支和用户授权。
- `debug-commands` 只运行配置中存在的非破坏性命令，不猜测进程名、设备路径或凭据。

新增 Skill route 的权限必须在本 Graph 或专用 Graph 中补充，Skill 自身不得扩大权限。

## 完成条件

- 已记录 `selected_skill`、`selected_skill_route`、加载的 reference 和规则。
- 配置占位符没有被当成真实命令执行。
- 执行结果包含命令、exit code、关键输出或明确的未执行原因。
- 高风险动作具有用户授权和对应验证证据。
