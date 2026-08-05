# Git 提交管理

## 提交前检查

1. 板端验证已通过
2. 只提交与本次改动相关的文件（不提交 `build/`、`package/update.iso`、`package/update.bin` 等产物）
3. 确认 `git diff` 中没有调试用的临时代码

## Commit Message 格式

```
ones id : #<任务ID> <简短描述改动内容>
```

**示例：**
```
ones id : #695377 新增BT插件DFU超时重试逻辑
ones id : #686625 修复MCU升级进度回调未触发问题
ones id : #701234 升级流程增加SOC分区校验步骤
```

**规则：**
- `ones id :` 固定前缀（注意冒号后有空格）
- `#` 后接 ONES 任务 ID（纯数字）
- 描述用中文，说明**改了什么**，不超过 50 字

## 提交步骤

```bash
# 1. 查看改动
git status
git diff

# 2. 暂存目标文件（避免用 git add . 误提交产物）
git add <具体文件路径>

# 3. 提交（ones_id 从 module.config.yaml 的 git.ones_id 读取，当前值：695377）
git commit -m "ones id : #695377 描述改动内容"

# 4. 推送到 Gerrit（必须用 refs/for 格式，普通 git push 会被仓库拒绝）
git push origin HEAD:refs/for/dev/adcj_20251201
```

> 若网络不通（Gerrit 服务器内网访问），将上述命令提供给用户，说明需在内网或 VPN 环境下手动执行，**不要停在网络检查步骤**。

## 分支规范

- 当前开发分支格式参考历史：`dev/adcj_YYYYMMDD`
- 本地测试分支：`localbranch`（不推送）

## 常见 .gitignore 产物（不应提交）

```
build/
package/update.iso
package/update.bin
package/update/
*.so
```

如发现这些文件被 `git add` 暂存，用 `git reset HEAD <文件>` 撤销。

## 生成提交记录（必须）

git push 成功后，在 `.evospec/output/push-log/` 下生成记录文件。

**文件命名**：`YYYYMMDD-<ones-id>-<简短描述>.md`
例：`20260509-701234-SOC分区校验.md`

**记录模板**：

```markdown
# 提交记录

- 日期：YYYY-MM-DD
- ONES ID：#XXXXXX
- 分支：dev/adcj_YYYYMMDD
- Commit：（粘贴 git log 最新一条的 hash 前8位）

## Commit Message

ones id : #XXXXXX 描述改动内容

## 提交文件列表

（粘贴 git diff --name-only HEAD~1 的输出）

| 文件 | 改动说明 |
|------|----------|
| `xxx/xxx.cpp` | 简述本文件改了什么 |

## 板端验证结论

（简述推板验证的结果，如：MCU/BT/SOC升级均正常，日志无异常）
```
