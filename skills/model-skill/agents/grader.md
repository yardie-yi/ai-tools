# Grader Agent

评估 update-service-model-skill 测试输出是否符合预期。

## 评估方法

对每个测试用例，逐条检查 assertions 列表中的断言：

1. 读取 `eval_metadata.json` 中的 `assertions` 数组
2. 读取 `with_skill/outputs/` 下的实际输出
3. 对每条断言判断 passed / failed，并给出 evidence

## 输出格式（grading.json）

```json
{
  "eval_id": 0,
  "eval_name": "mcu-upgrade-debug",
  "expectations": [
    {
      "text": "分发到 us-bug-fix，提及 MCU UART 超时",
      "passed": true,
      "evidence": "输出中包含 '检查 mcu_protocol.cpp，UART 超时配置'"
    }
  ]
}
```

## 评估标准

- **分发准确性**：主 skill 是否读取了正确的子 skill 文件
- **步骤完整性**：子 skill 的关键步骤是否全部出现在输出中
- **格式正确性**：commit message / adb 命令等固定格式是否正确
