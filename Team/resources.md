# Team 资源路由

以下链接是本仓库可读取的依据。执行时优先使用当前环境已提供的同名 Skill，并阅读其正文与必要引用；仓库副本用于定位和核对。发现版本差异时核对任务所需规则，不混用相互矛盾的流程。路径存在不代表工具、账号、服务器或板卡已就绪。

| 工作 | 主办角色 | 入口与使用条件 |
| --- | --- | --- |
| 所有任务的完成证据、持久约束 | Lead / 所有成员 | 当前全局 AGENTS.md；仓库源为 [全局规则](../AGENTS.MD/全局/AGENTS.md) |
| 复杂需求、架构与开发六步主线 | Lead + Analyst | [原工作流交接](../ai-agents/workflow/复杂需求与架构输入_Agent开发流程交接_20261021.md)；Team 将其角色化，历史“尚未实施”不当成环境已部署 |
| 需求、开发、构建、部署维护 | Engineer | [model-skill](../skills/model-skill/SKILL.md)；目标项目具备相应 `.evospec` 配置时使用，缺配置不伪造命令 |
| 21L DCU/MEU/HMI/VR 故障 | Engineer | [21l-bug-analyse](../项目专用skill/21l-bug-analyse/SKILL.md)；按本次源码、会话和日志范围执行 |
| SA8775 服务器及板端操作 | Engineer / Quality | [8775 项目规则](../AGENTS.MD/项目/8775/AGENTS.md)；仍需读取目标项目实际规则，不将这些配置用于其他项目 |
| 协议表合入、生成、构建、契约同步 | Engineer | [vehicle-service-protocol-sync](../skills/vehicle-service-protocol-sync/SKILL.md) |
| 头文件接口登记到飞书 | Engineer | [vehicle-interface-api](../skills/vehicle_interface_api-skill/SKILL.md)；独立调用不默认改源码或编译 |
| UI 设计与代码同步 | Analyst + Engineer | [ui-design-code-sync](../skills/ui-design-code-sync/SKILL.md)；先有用户指定的设计入口 |
| 递归资料整理、开发指南和知识库 | Work Assistant | [project-doc-organizer](../skills/project-doc-organizer/SKILL.md)；依据本次来源范围与输出目标 |
| 周报与工时 | Work Assistant | [feishu-weekly-report](../skills/feishu-weekly-report/SKILL.md)；按当前账号、本期入口与模式执行 |
| iTalent 餐补 | Work Assistant | [italent-meal-allowance](../skills/italent-meal-allowance/SKILL.md)；核对本次月份和人员，不把历史表信息当新目标 |
| 团队设计依据 | Lead | [Lauren 帖文及评论笔记](../doc/workflow/poteto-bot-team-notes.md)；采用已核对建议，第三方反馈仅作为待验证线索 |

飞书业务动作复用当前环境 lark-* Skill 和 CLI；浏览器操作复用当前 browser-harness 或支持的浏览器工具。账号认证、真实服务器参数、目标链接和板卡身份留在对应配置或任务记录，Team 仅保留入口。
