# Q&A Graph

**用途**：解释、定位、比较、总结；默认只读。

```text
START → CONTEXT → ANSWER → DONE
```

- `CONTEXT`：使用 `.agent/nodes/context.md`；必要时调用 Explorer。
- `ANSWER`：基于实际文件和符号回答，不猜测不存在的实现。
- `DONE`：无需 build/test；但若声称行为正确，必须说明证据范围。

停止条件：用户问题得到直接回答，且不遗漏关键不确定性。

## Skill 绑定

当问题涉及模块身份、文档目录、构建/部署/调试配置导航时，可加载 `.agent/skills/model-skill/references/project-info.md`；普通代码解释无需加载 Skill。
