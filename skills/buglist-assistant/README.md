# bugList-assistant

将整个 `buglist-assistant` 目录放到目标项目根目录的 `.codex/skills/` 下，并从该项目根目录使用。Skill 只分析所在项目根目录及其子目录中的代码；本次 `ite_sdk` 示例对应仪表代码。

从用户指定的 Buglist 页面读取待处理 Bug，下载相关日志，结合视频和项目代码生成分析报告。分析输出位于项目根目录 `.evospec/output/bug-log/<Bug单号>/`；代码修复交给 `model-skill`。

首次使用需提供 Buglist 链接和日志附件文件名关键字。配置保存在项目的 `.evospec/buglist-assistant.json`，之后调用时自动沿用；重新提供链接或关键字会更新配置。

浏览器访问使用 Browser Harness。Skill 自带检测及自动安装脚本。Jev 可用且设置 `TYPESAFE_API_KEY` 时，使用 TypeSafe API 对证据进行结构化判断，GPT 负责根因分析和修改建议。

使用示例、分析步骤、生成物说明及视频关键帧见 [使用说明](docs/buglist-assistant-使用说明.docx)。
