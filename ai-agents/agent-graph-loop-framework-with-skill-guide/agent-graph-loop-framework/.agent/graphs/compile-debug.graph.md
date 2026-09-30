# Compile Debug Graph

**用途**：编译、链接、CMake/Make、include、宏、类型和符号错误。

```text
START
  → READ_BUILD_LOG
  → CLASSIFY_ERROR
  → SEARCH_SYMBOLS_AND_CONFIG
  → ROOT_CAUSE
  → FIX_MINIMAL
  → BUILD
      ├─ PASS → CHANGE_REVIEW_IF_NEEDED → DONE
      ├─ FAIL/new_error → NEXT_ITERATION
      ├─ FAIL/same_error_twice → FRESH_DEBUGGER
      └─ RETRY_EXHAUSTED → BLOCKED_OR_FRESH_DEBUGGER
```

使用 `.agent/loops/compile-debug-loop.md`。

错误分类至少包括：

- include/path
- macro/config
- syntax/type
- undefined/duplicate symbol
- link order/library
- generated code
- build target/source list
- toolchain/environment

禁止：注释调用、删除功能或放宽告警策略来伪造构建通过，除非任务明确要求且有证据。

## Skill 绑定

- 构建流程：`.agent/skills/model-skill/references/us-build.md`
- 环境检查：`.agent/skills/model-skill/references/env-setup.md`
- 项目命令和工具链来自 `.evospec/module.config.yaml`；配置缺失时不得猜测远程服务器、shell 或 clean 命令。
