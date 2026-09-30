---
name: graph-loop-runner
description: Run an explicitly requested Graph/Loop workflow or resume a tracked multi-stage task in this repository; not for routine Q&A or small edits.
---

Follow `AGENTS.md`. Use `.agent/router.yaml` to select the relevant Graph, then read only the nodes and loops this task needs. Load the central Skill and its configured reference only for a project-specific workflow; unresolved configuration never becomes an executable command.

Pi may not provide built-in subagents. Keep ordinary work in the current session; use `/fork`, `/clone`, or an available extension only when isolation or fresh review would materially help. If switching sessions, use `.agent/prompts/fresh-agent-handoff.md`. High-impact remote actions require explicit user authorization.
