# TypeSafe 辅助生成速度实验

比较同一主题的两条流程：

- A：16 段固定 Ponytail 资料直接交给 Codex 生成。
- B：TypeSafe Jev 一次判断 16 段相关性，代码保留必需资料和 noul >= 0.7 的其他资料，再交给同一 Codex 生成。

两组均要求：Windows / Codex / Ponytail 首次上手说明，四个步骤、约 300–450 个汉字，保留同样的安装、激活与验证要点。三对顺序为 AB、BA、AB。材料是本次已核查资料的人工摘要，不含私人项目代码。

写作后端为本机已登录的 Codex CLI，模型 `gpt-6-astra`，推理档位 `medium`。仅在本次 CLI 调用中配置 HTTPS provider、禁用插件、忽略用户 config.toml、禁用 web_search。不会改写用户配置文件。CLI 仍会携带内置／发现的技能元数据和系统上下文，因此总 input token 不只包含资料本身。

## 运行

```powershell
python benchmark.py
python report.py
```

需要当前用户的 Codex 登录状态，以及 `TYPESAFE_API_KEY`。脚本优先读取进程环境；Windows 下再读取当前用户环境。不在脚本或结果里记录 Key。再次运行将覆盖同名结果文件。

查看 `comparison.html`、`results.json`、`summary.json` 和六份 `A1.md` / `B1.md` 等输出。

## 计时含义

使用 `time.perf_counter()`。A 包含 CLI 进程启动、认证、网络、模型调用及输出解析；B 另包含 TypeSafe HTTP 调用与资料筛选。这里没有首 token 时间指标，不以总体时间除 token 数伪装成纯模型解码速度。

TypeSafe 返回其实际模型版本、相关性判断及用量。Codex JSONL 返回写作结果、用量和可见错误／工具事件；原始用量字段保留到结果中。

八项关键要点检查是字符串检查，不是完整质量评测。需结合真实文字、篇幅、遗漏及错误做判断。三对样本无法给出稳健的泛化收益或统计显著性结论。

## 已排除的连接问题

原配置的第三方写作网关返回 HTTP 503，未用作基线。最初 Codex 自动选择 WebSocket，超时后回退 HTTPS：完成的 A1、B1 被保存在 `excluded-transport-runs.json`，不纳入正式统计。连通性探测及中断的运行也不计入三轮成绩。

本次用户配置的 Key 已通过 TypeSafe 官方 endpoint 成功发起真实调用。Jev 本身不生成介绍文章；这是判断模型参与资料筛选后的端到端比较，不是 Jev 与 GPT 两个文本生成模型的比较。

## 方法来源

- https://docs.typesafe.ai/api
- https://docs.typesafe.ai/cookbooks/rerank_typesafe
- https://docs.typesafe.ai/concepts/system-one
- https://github.com/DietrichGebert/ponytail
