---
name: graph-loop-runner
description: Run an explicitly requested Graph/Loop workflow or resume a tracked multi-stage task in this repository; not for routine Q&A or small edits.
---

Follow `AGENTS.md`. For `$ARGUMENTS`, select the relevant Graph from `.agent/router.yaml` and read only its needed nodes or loops. Load `.agent/skills/registry.yaml` and a central Skill only when the task needs a configured project workflow; do not automatically load every Graph binding.

Use `.agent/runs/` for work that genuinely needs tracking across stages or sessions. Run the smallest relevant checks, then continue fixing related failures until the requested outcome is verified or a real blocker remains. Use an independent, read-only reviewer when risk warrants one; use fresh context only when it adds value. High-impact remote actions still require explicit user authorization.
