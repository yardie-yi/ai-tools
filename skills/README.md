# Skills catalog

This directory contains **14 top-level skills** plus **3 skill copies embedded in example project bundles**. A skill is identified by a `SKILL.md` file; supporting folders such as `references/`, `scripts/`, `assets/`, `agents/`, and `docs/` provide material used by that skill.

## Project and workflow skills

| Folder | Skill name | Purpose |
| --- | --- | --- |
| [`21l-bug-analyse/`](21l-bug-analyse/) | `21l-bug-analyse` | Investigates 21L DCU/MEU/HMI/voice failures using native logs, DLT/LogStorage, and source code. It aligns clocks and sessions, traces protocol/thread/DBus boundaries, compares healthy cases, and produces evidence-backed root-cause candidates. |
| [`buglist-assistant/`](buglist-assistant/) | `buglist-assistant` | Reads bugs from a user-provided Buglist page through an authenticated browser, downloads relevant evidence, and analyzes logs and project code. It produces analysis and repair suggestions but deliberately leaves code changes to `model-skill`. |
| [`evospec-skill-v2.0/`](evospec-skill-v2.0/) | `evospec` | Provides a rule-driven software-development workflow covering project initialization, requirements and design, implementation, testing, bug fixes, and reusable project rules. It supports both a full staged process and a faster agile mode. |
| [`italent-meal-allowance/`](italent-meal-allowance/) | `italent-meal-allowance` | Checks monthly iTalent attendance for meal-allowance eligibility, shows the qualifying dates and total, then appends only missing employee records to the correct Feishu sheet while preserving existing data and formatting. |
| [`model-skill/`](model-skill/) | `model-skill` | Routes general project-maintenance work to focused procedures for requirements, feature development, bug fixing, builds, deployment, Git, debugging, code analysis, and rule management. Project-specific commands and paths come from `.evospec/module.config.yaml`. |
| [`skill-refiner/`](skill-refiner/) | `skill-refiner` | Turns corrections made during a conversation into durable improvements to the skill that caused the problem. It identifies the lesson, proposes a targeted diff for confirmation, updates the appropriate skill resources, and records the change. |
| [`ui-design-code-sync/`](ui-design-code-sync/) | `ui-design-code-sync` | Synchronizes an authenticated UI design page with a project's UI engine. It uses the design as visual evidence for layout and assets while treating existing XML/code as authoritative for controls, hierarchy, state, and business logic. |
| [`vehicle-service-protocol-sync/`](vehicle-service-protocol-sync/) | `vehicle-service-protocol-sync` | Runs the SA8775 Vehicle Service protocol merge pipeline: reads pending Feishu requests, updates three protocol tables, exports XLSX/CSV files, regenerates service code, and validates the result with a server build. |
| [`vehicle_interface_api-skill/`](vehicle_interface_api-skill/) | `vehicle-interface-api` | Extracts public C/C++ declarations from selected headers and adds missing interface-contract records to a Feishu Base. It preserves original declarations, maps parameters and descriptions, follows an existing row as the business-field template, and avoids duplicates. |

## System skills

These live under the hidden [`.system/`](.system/) directory and provide general Codex capabilities rather than project-specific workflows.

| Folder | Skill name | Purpose |
| --- | --- | --- |
| [`.system/imagegen/`](.system/imagegen/) | `imagegen` | Generates or edits raster images such as illustrations, photos, mockups, textures, sprites, and transparent cutouts. It chooses between the built-in image tool and an API/CLI fallback and includes asset-specific prompting and verification guidance. |
| [`.system/openai-docs/`](.system/openai-docs/) | `openai-docs` | Answers questions about OpenAI APIs, models, products, and Codex using current official documentation. It defines source priority, citation rules, model-selection guidance, and upgrade/migration workflows. |
| [`.system/plugin-creator/`](.system/plugin-creator/) | `plugin-creator` | Scaffolds and validates Codex plugins, including the required manifest, optional plugin structure, personal marketplace metadata, and the local update/reinstall workflow used during development. |
| [`.system/skill-creator/`](.system/skill-creator/) | `skill-creator` | Guides the creation or revision of a skill: choosing scope and triggers, designing progressive disclosure, adding scripts/references/assets, validating structure, and forward-testing behavior. |
| [`.system/skill-installer/`](.system/skill-installer/) | `skill-installer` | Lists and installs Codex skills from OpenAI's curated or experimental collections, or from a supplied GitHub repository path, including private repositories when credentials are available. |

## Embedded example bundles

The following directories are packaged project examples rather than additional top-level installed skills:

| Bundle | Embedded skills | Purpose |
| --- | --- | --- |
| [`model-skill-portable-template-with-usage/`](model-skill-portable-template-with-usage/) | `.codex/skills/model-skill` | A portable sample project showing how `model-skill`, `.evospec` configuration, rules, and deployment helpers fit together. Its bundled `model-skill` is a separate copy of the general workflow. |
| [`model-skill-refactored-cluster-app/`](model-skill-refactored-cluster-app/) | `.codex/skills/model-skill`, `.codex/skills/ones-assistant` | A refactored cluster-app example. Its `model-skill` copy matches the top-level version; `ones-assistant` retrieves and analyzes the current user's unresolved ONES bugs and also supports common ONES work-item operations. |

The adjacent `.tar` and `.tar.gz` files are packaged snapshots of these skills or examples, not separately discoverable skills.

## Quick selection guide

- For ordinary repository development or repair, start with **`model-skill`**.
- For a formal rules-based lifecycle from requirements through code, use **`evospec`**.
- For defect evidence gathering, choose **`buglist-assistant`**, **`ones-assistant`**, or **`21l-bug-analyse`** according to the source system and product area.
- For design-to-code work, use **`ui-design-code-sync`**.
- For the two automotive data-entry pipelines, use **`vehicle-service-protocol-sync`** or **`vehicle-interface-api`**.
- For creating, improving, installing, or packaging Codex extensions, use the corresponding system skill or **`skill-refiner`**.
