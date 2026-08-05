# change_log — model-skill

## 2026-05-14 Bug 修复流程新增：关联已有 bug-log + 读取 PRD

- **问题**：Bug 修复开始时既未检查已有 bug-log，也未读取 PRD 文档，导致遗漏历史上下文和需求依据。
- **纠正**：在步骤 0 前新增步骤 -1（扫描 `.evospec/output/bug-log/` 并询问用户当前 bug 对应哪条 log）；在步骤 0-A 前新增步骤 0-PRD（读取 `.evospec/input/prd/` 下的 PRD 文档）。
- **根因分类**：flow
- **WHY**：已有 bug-log 记录了历史现象和原因，能避免重复定位；PRD 提供需求依据，让 AI 能判断"实现是否符合需求"而非单纯看代码。
- **改动文件**：
  - `references/us-bug-fix.md` — 新增步骤 -1 和步骤 0-PRD
- **会话摘要**：用户要求每次修 bug 时先查 bug-log 并读取 PRD，同步应用于 .claude 和 .codex 两个目录。

## 2026-05-12 编译改为 Claude Code 自动 SSH 执行，移除"手动编译"限制

- **问题**：上次将"SSH exit 255（连接失败）"误判为"source 不可用"，加了警告让用户手动在独立终端编译。
- **纠正**：输入"编译"后应自动 SSH 执行；用 `bash -c '...'` 解决非交互式 SSH 中 source 失效问题；连接失败时才退化为手动步骤。
- **根因分类**：flow, detail
- **WHY**：exit 255 是 SSH 连接本身失败（网络/VPN），与 source 无关；bash -c 可在非交互式会话中正确 source 环境变量；自动化优先，失败再提示手动。
- **改动文件**：
  - `references/us-build.md` — 移除手动限制警告，改为直接执行 SSH bash -c 命令，失败时提供手动步骤
- **会话摘要**：用户要求编译后能自动执行而非手动，发现上次的"限制"是误判，改为自动优先。

## 2026-05-12 修复编译/推板/push 三个环节的流程和命令问题

- **问题**：①编译：Claude Code 用 PowerShell 执行一行 SSH 命令，source 工具链失败导致编译出错；②推板：`adb root` 在该板端不支持，`rm` 不带 `-f` 触发交互式确认卡住；③push：`git push` 未使用 Gerrit `refs/for` 格式，且网络超时后直接停止而非提供正确命令。
- **纠正**：①编译在独立终端手动执行，Claude Code 等待结果；②推板用 `mount -o remount,rw /dev/root /` 替代 adb root，rm 加 `-f`；③push 固定为 `git push origin HEAD:refs/for/dev/adcj_20251201`，网络不通时给出命令让用户手动执行。
- **根因分类**：flow, detail
- **WHY**：PowerShell 非交互式 SSH 无法持久化 source 的环境变量；板端 production build 不允许 adb root；Gerrit 仓库必须用 refs/for 格式推送。
- **改动文件**：
  - `references/us-build.md` — 方式一下增加 Claude Code 执行限制说明
  - `references/us-board-deploy.md` — 第一阶段改为 mount remount，rm 加 -f
  - `references/us-git-submit.md` — push 命令改为 Gerrit refs/for 格式，加网络不通时的处理说明
- **会话摘要**：Bug 修复后依次走编译→推板→git提交流程，三个环节均遇到与 skill 描述不符的问题，用户逐一纠正后反馈。

## 2026-05-11 修复推板在 PowerShell 环境下的脚本失败和杀进程命令问题

- **问题**：Claude Code 推板时优先调用 bat 脚本（管道传参方式），导致 UTF-8/GBK 编码冲突乱码失败；杀进程命令使用双引号导致 PowerShell 本地展开 `$(pidof ...)`；板端不支持 `pkill`。
- **纠正**：推板推荐方式注明 bat 脚本仅适合 cmd.exe 手动运行，Claude Code 应直接执行 adb 手动命令；杀进程改为 `adb shell 'killall appmgr; true'`（单引号 + killall）。
- **根因分类**：flow, detail
- **WHY**：PowerShell 对双引号字符串内 `$()` 做本地展开；bat 脚本 `set /p` 交互输入在管道模式不可靠；ac8215e BusyBox 无 pkill 只有 killall；单引号阻止 PowerShell 展开，`; true` 保证进程不存在时不中断。
- **改动文件**：
  - `references/us-board-deploy.md` — 推板方式加 PowerShell 环境限制说明
  - `references/us-board-deploy.md` — 杀进程命令改为单引号 + killall
- **会话摘要**：用户要求推板，Claude Code 尝试通过 PowerShell 管道运行 bat 脚本失败，随后手动执行 adb 命令时发现杀进程命令因 PowerShell 展开和 pkill 不可用而需要调整，最终用 `killall` 成功完成推板。
