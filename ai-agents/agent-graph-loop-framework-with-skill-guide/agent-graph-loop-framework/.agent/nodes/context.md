# Node: CONTEXT

目标：用最小上下文确定项目结构、任务入口和相关证据。

动作：

1. 读取任务、当前 state、`.agent/project.yaml`、Skill registry 和相关 `.evospec` 项目配置。
2. 定位相关需求、源码、头文件、测试、构建文件和 CI。
3. 使用 Explorer 搜索调用链和符号，不把原始大日志全部返回主线程。
4. 记录 `files_inspected`、`symbols`、`unknowns`、配置来源和候选 Skill route。

退出条件：已经知道“改哪里/查哪里/如何验证”，或明确列出真正阻塞项。
