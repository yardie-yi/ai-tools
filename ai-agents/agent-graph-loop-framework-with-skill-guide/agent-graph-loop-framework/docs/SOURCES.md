# 参考依据（截至 2026-08-27）

本模板的工具适配部分参考以下官方能力模型：

- OpenAI Codex：AGENTS.md discovery、项目级 `.codex/config.toml`、`.codex/agents/*.toml` custom agents 和 subagent workflows。
- Anthropic Claude Code：项目级 `.claude/agents/*.md`、YAML frontmatter、tools/permissionMode/maxTurns、skills 和 hooks。
- Pi Agent Harness：AGENTS.md/CLAUDE.md context files、`.pi/settings.json`、skills、prompt templates、extensions；Pi 核心保持最小，不假设内置 subagents。

`model-skill`、`.evospec` 配置、规则和部署脚本来自用户提供的 `model-skill-portable-template-with-usage.tar.gz`，本框架只做路径迁移、Graph/Skill 绑定、安全门禁和一致性校验，不改变 11 个 reference 的职责集合。

建议迁移到新版本工具时重新核对各工具官方配置文档，尤其是模型名称、权限模式、Hook 和 extension API。
