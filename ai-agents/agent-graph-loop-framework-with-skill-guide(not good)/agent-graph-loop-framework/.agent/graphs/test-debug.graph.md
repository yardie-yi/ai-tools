# Test Debug Graph

**用途**：单元测试、集成测试、CI 测试或回归测试失败。

```text
START
  → READ_FAILURE
  → CLASSIFY_FAILURE
  → REPRODUCE_MINIMALLY
  → ROOT_CAUSE
  → DECIDE_CODE_OR_TEST
  → FIX_MINIMAL
  → RERUN_TARGET_TEST
      ├─ PASS → REGRESSION_TEST
      ├─ FAIL/same_signature_twice → FRESH_DEBUGGER
      └─ RETRY_EXHAUSTED → BLOCKED_OR_USER
  → REVIEW
  → DONE
```

使用 `.agent/loops/test-debug-loop.md`。

规则：

- 不通过删除断言、跳过用例或放宽期望来“修复”测试。
- 修改测试前必须说明原期望为何错误，并引用需求/接口证据。

## Skill 绑定

`model-skill` 当前没有独立测试调试 reference。本 Graph 以 `.agent/loops/test-debug-loop.md` 为权威；如测试依赖项目构建或环境，可按需加载 `us-build.md` 或 `env-setup.md`。
