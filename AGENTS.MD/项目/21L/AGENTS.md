# Scope

本文件适用于本地 `/home/yardie/Desktop/21L` 工作区及其子目录。后续项目开发从此目录打开 agent；本会话操作下述服务器代码时，同样遵循本文件。

# 工作目录与代码操作

- 本地 `/home/yardie/Desktop/21L` 是 agent 入口，用于维护 `AGENTS.md`、项目技能、文档、日志与分析产物。本地根目录的 Git 仓库用于管理这些项目级资产。
- 业务代码的权威工作树位于服务器 `10.79.29.23` 的 `/opt/jenkins_agent/workspace/zhuxm_Integ/`。代码编辑、业务仓库 Git 操作、编译和构建验证均在该服务器目录及其实际模块仓库中完成。
- 通过 `ssh -p 5522 jenkins@10.79.29.23` 连接服务器。业务仓库 Git 操作前进入目标模块，执行 `pwd`、`git rev-parse --show-toplevel`、`git branch --show-current` 和 `git status --short`，确认仓库、分支和已有改动；不要默认集成目录本身是单一 Git 仓库。
- 需要编译时，在服务器集成目录执行 `source add_environment.sh` 和 `./agent_build_zxm_21up.sh clean all release`。记录实际分支/提交、构建命令、日志及生成物；本地检查不能替代服务器编译结果。
- 本地已有的 `application/`、`sdk/`、`package/` 等内容按本次任务用途使用。若作为代码副本参与分析，先核对其与服务器工作树的版本关系；业务代码修改以服务器工作树为准。
- 本地挂载仅是访问远端文件的方式；不可用时通过 SSH 继续。报告中注明命令在本地还是服务器执行，并保留对应的真实路径。

# 启动必读：21L 烧录与调试

每次在本工作区启动新的 agent 会话时，先读取本文件和飞书文档 [21L烧录&调试](https://navinfo.feishu.cn/wiki/DXf1w72ioiTlmbkGwGRcMNwZn7b?from=from_copylink)，再开展工作。链接是启动必读资料，不能仅记录链接而跳过正文。

- 使用 `lark-doc` 技能读取原文；已安装 `lark-cli` 时，可执行：

  ```bash
  lark-cli docs +fetch --doc 'https://navinfo.feishu.cn/wiki/DXf1w72ioiTlmbkGwGRcMNwZn7b?from=from_copylink' --doc-format markdown --as user
  ```

- 按当前任务查阅原文中的代码仓库、服务器编译、普强 SDK 更新、上板升级、版本确认、日志采集、主机系统烧录、车参配置或主机 Diag 取得方法章节。仅在任务涉及相应操作时执行其中的步骤。
- 无法读取时，明确说明访问失败及未核实事项；可继续不依赖该文档的工作，对依赖其中配置或流程的操作先补齐依据。
- 以下关键配置于 2026-10-30 按原文版本 `551` 核对。每次读取原文时核对；发现变更时更新本文件，并注明来源和核对日期。

| 项目 | 配置 |
| --- | --- |
| 代码仓库入口 | https://wdgit.autoai.com/agent |
| 当前处理分支 | `Lexus21MM_653D_OTA` |
| 编译服务器 | `10.79.29.23`，SSH 端口 `5522`，用户 `jenkins` |
| 服务器集成目录 | `/opt/jenkins_agent/workspace/zhuxm_Integ/` |
| AGENT/VR 版本号修改位置 | 集成目录中的 `agent_build_zxm_21up.sh`；涉及版本更新时按本次目标版本修改后再编译 |
| AGENT/VR 编译 | 在集成目录执行 `source add_environment.sh`，然后执行 `./agent_build_zxm_21up.sh clean all release` |
| 板端日志目录 | `/var/backups/autoai-vre/autoai_log` |

普强 SDK 更新时按原文核对发版邮件的 MD5、同步文件清单和版本号；SDK 未更新时无需重新处理普强包。升级后按原文读取 AGENT/VR、普强和主机版本，保留实际输出作为验证依据。

# 主机升级与日志采集

- 主机升级后的车参配置按原文依次处理 S.PARA 和 H.PARA。使用 U 盘中的实际目录及参数脚本；原文中的 `XXXXX` 是占位示例。参数选择须依据原文“车机参数说明”表格和目标车机配置；S.PARA 参数复制完成后执行 `sync`。
- 车机参数说明是原文内嵌电子表格（token：`P60Bsxgavhf79itad3cckjsGnqc`，sheet-id：`EZEIKR`）；任务涉及参数选择时，使用 `lark-sheets` 读取表格，按目标车机的实际机种及车机型号匹配同一行的 S.PARA/H.PARA；型号未确认或对应参数空白时先补齐依据，记录最终选择及依据。
- 主机 Diag 日志导出按原文“主机Diag取得方法”执行。等待 U 盘写入进度条变绿、点击 OK 并拔掉 U 盘后，才执行 `Delete REC DATA`，避免删除 U 盘中的内容；后续 `Recording ON/OFF` 和 ACC off→on 按原文完成。

# 项目技能

分析 21L DCU/MEU/HMI/app-vr 的通信、显示、启动或超时问题时，先读取本工作区的 [21l-bug-analyse](.agents/skills/21l-bug-analyse/SKILL.md)，按其中的触发条件查阅相关参考文件，并遵守当前任务的授权范围。

技能中的 `application/` 路径约定需映射到服务器集成目录下的实际模块（如 `hmi/`、`app-vr/`）；分析前核对源码分支/提交与日志对应固件版本。

# Evidence Requirements

Do not claim a task is complete without verifiable evidence.

The following are not evidence:

* Saying “the implementation is correct.”
* Saying “the bug should be fixed.”
* Showing code changes without executing relevant tests.
* Claiming that tests passed without providing actual results.
* Providing performance improvements without measurements.

For every completed task, provide:

1. The verification steps performed.
2. The actual commands executed.
3. The relevant test results or logs.
4. Before/after comparisons when applicable.
5. Any remaining limitations or unverified assumptions.

If verification cannot be performed, explicitly state what remains unverified.

A claim of success is not evidence of success.

# 持久化要求

重要约束、硬件配置、接口契约不能只依赖聊天记录，最好写入持久文件。

<!-- project-doc-organizer:begin -->
## 项目知识库

开发、编译、上板调试或 bug 分析前，读取[知识库索引](.project-knowledge/INDEX.md)，再按任务查对应短摘要、版本与未核验项。知识库覆盖用户指定7份文档及其递归引用；本文件的原文必读和服务器工作树约束继续适用。
<!-- project-doc-organizer:end -->
