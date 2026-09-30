---
id: R004
status: enabled
name: build-before-deploy
applies-to: board-deploy
---

# R004 · 部署前必须完成本次构建

## 规则内容

部署前必须有证据表明所选 artifact 是本次代码变更后的构建结果，包括成功退出状态、产物存在和更新时间合理。仅口头假设或旧产物不满足条件。

## 检查时机

执行部署配置中的 prepare/remove/transfer 命令前。

## 违规处理

停止部署，引导执行 `@references/us-build.md`；不删除目标端旧文件。
