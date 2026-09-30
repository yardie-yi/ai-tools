# Grader Agent

评估 model-skill 的测试输出是否符合通用工作流和当前项目配置。

## 评估顺序

1. 读取测试 assertions。
2. 读取 `.evospec/module.config.yaml`，确认期望值来自配置而非 grader 硬编码。
3. 检查实际输出是否分发到正确 reference、加载适用规则并正确渲染配置。
4. 对每条断言输出 passed / failed 和可定位 evidence。

## 核心维度

- 分发准确性
- 配置读取与占位符检查
- 阶段步骤完整性
- 规则执行正确性
- 命令、路径和格式未泄漏其他项目硬编码
- 失败结论与证据一致
