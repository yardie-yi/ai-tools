# 规则索引

| ID | 规则名 | 适用阶段 | 状态 | 文件 |
|----|--------|----------|------|------|
| R001 | commit-format | git-submit | ✅ enabled | R001-commit-format.md |
| R002 | log-required | bug-fix, git-submit | ✅ enabled | R002-log-required.md |
| R003 | plugin-base | feature-dev | ✅ enabled | R003-plugin-base.md |
| R004 | build-before-deploy | board-deploy | ✅ enabled | R004-build-before-deploy.md |
| R005 | no-build-artifacts | git-submit | ✅ enabled | R005-no-build-artifacts.md |
| R006 | log-in-generated-code | feature-dev, bug-fix | ✅ enabled | R006-log-in-generated-code.md |
| R007 | chinese-comments | feature-dev, bug-fix | ✅ enabled | R007-chinese-comments.md |
| R008 | no-redundant-ui-call | feature-dev, bug-fix | ✅ enabled | R008-no-redundant-ui-call.md |

> 状态以规则文件 frontmatter 为准；修改状态时同步更新本表。规则中的项目差异必须引用 `.evospec/module.config.yaml`，不得硬编码。
