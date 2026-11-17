# Graph 选择表

| 主要目标 | 典型输入 | Graph | Skill binding/route | 默认编辑权限 | 完成证据 |
|---|---|---|---|---|---|
| 解释或查找 | 函数、模块、文档问题 | `qa` | `project-info`（需要项目配置导航时） | 只读 | 文件和符号证据 |
| 需求/影响分析 | 需求文档、变更项 | `requirement` | `us-requirements.md` | 只读 | 覆盖矩阵、影响范围、方案 |
| 新功能/模块实现 | 需求 + 实现目标 | `development` | `us-feature-dev.md` + `us-build.md` | 可写 | Build + Test + Review |
| 运行时 Bug | 日志、问题单、错误行为 | `bugfix` | `us-bug-fix.md` + `debug-commands.md` + `us-build.md` | 可写 | 复现/追踪 + 根因 + 回归验证 |
| 编译/链接失败 | build log、undefined reference | `compile-debug` | `us-build.md` + `env-setup.md` | 受控可写 | Build PASS |
| 测试/CI 失败 | test log、失败用例 | `test-debug` | 无专用 reference，使用核心 Loop | 受控可写 | 目标测试 + 必要回归 PASS |
| 代码/PR 审查 | diff、PR、模块风险 | `review` | 无，使用独立 Reviewer | 只读 | 结构化 Verdict |
| 行为保持重构 | baseline + cleanup/refactor | `refactor` | 可参考 `us-feature-dev.md` 的规则检查 | 可写 | Baseline + Build/Test + Review |
| 文档/注释 | README、设计、接口文档 | `docs` | `us-code-analysis.md`（代码分析文档时） | docs-only | 与源码/脚本一致 |
| 普通构建 | 无失败证据的 build 请求 | `skill-workflow` | route `build` | 执行构建 | exit code + artifact |
| 推板/部署 | ADB/SSH、目标板、产物传输 | `skill-workflow` | route `board-deploy` | 默认 dry-run | 授权 + preflight + deploy + 验证 |
| Git 提交/push | commit、push、提交记录 | `skill-workflow` | route `git-submit` | 默认检查；写操作需授权 | status/diff + commit/push evidence |
| 调试/日志/进程查询 | logcat、串口、进程、配置 | `skill-workflow` | route `debug-commands` | 只读/非破坏性执行 | 命令与原始证据 |
| 环境检查 | 工具链、服务器、凭据来源 | `skill-workflow` | route `env-setup` | 只读/preflight | 可用性与缺失项 |
| 代码架构分析 | 调用链、数据流、状态机 | `skill-workflow` | route `code-analysis` | 只读或分析文档可写 | 文件/符号/版本证据 |
| 规则管理 | 查看、启用、禁用规则 | `skill-workflow` | route `rules` | 规则文件受控写入 | 索引与 frontmatter 一致 |

## 冲突处理

1. 用户显式指定 Graph 时优先，但不能突破安全边界。
2. 用户只指定 `model-skill` 时，仍按最终目标选择 Graph；Skill 不是 Graph 的替代品。
3. 存在构建失败证据时用 `compile-debug`，不是普通 `build` route。
4. 部署、push、远端删除和停止进程必须经过用户授权；配置不完整时只做静态检查或 dry-run。
5. 一个任务可由父 Graph 调用 Skill reference，不必因为进入构建阶段切换整个父 Graph。
