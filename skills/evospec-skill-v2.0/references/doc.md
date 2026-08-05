# 文档生成

按需生成V2产出物文档。**权重LOW（可选）**。

---

## 一、文档类型

| 类型 | 来源 | 模板 | 输出路径 |
|------|------|------|---------|
| 需求spec | PRD + change_log | req-spec.md | outputs/docs/ |
| 架构分析 | 代码结构 + rules | arch-analysis.md | outputs/docs/ |
| 模块设计 | 代码 + rules-module | module-design.md | outputs/docs/{模块}/ |
| 详细设计 | 类/方法代码 | detail-design.md | outputs/docs/{模块}/ |
| 接口定义 | 代码接口 | interface-def.md | outputs/docs/{模块}/ |
| 变更报告 | change_log.md | change-report.md | outputs/docs/ |

---

## 二、反向生成流程

```
用户："生成WeatherVM的设计文档"

执行：
1. Read代码 → WeatherVM.kt
2. 分析结构 → 类名、方法、依赖
3. Read规则 → 命名来源、架构依据
4. Read模板 → detail-design.md
5. 生成文档 → Write outputs/docs/weather-vm-design.md
```

---

## 三、生成策略

| 特性 | 说明 |
|------|------|
| 生成时机 | 用户主动请求 |
| 权重 | LOW（可选） |
| 方向 | 反向（代码→文档） |
| 规则追溯 | 必须引用规则ID |
| 代码优先 | 文档内容与代码一致 |

---

## 四、详细设计模板

```markdown
# 详细设计: {类名}

## 类职责
{从代码推断}

## 方法设计
| 方法 | 参数 | 返回值 | 说明 |
|------|------|--------|------|
| {方法} | {参数} | {返回} | {说明} |

## 依赖关系
{Mermaid图}

## 设计依据
| 规则ID | 内容 | 应用 |
|--------|------|------|
| G001 | ViewModel后缀VM | 命名来源 |

## 代码示例
{关键代码}
```

---

## 五、批量生成

```
用户："生成天气模块完整文档"

执行：
1. Read模块所有代码
2. Read模块规则
3. 生成：模块设计 + 详细设计 + 接口定义
4. Write到outputs/docs/weather/

用户："生成项目完整文档"

执行：
1. Read change_log.md
2. Read所有代码
3. Read所有规则
4. 生成完整文档集
```

---

## 六、与敏捷协作

```
敏捷开发 → change_log.md记录变更
用户请求文档 → 文档生成
代码变更后 → 可重新生成文档（更新匹配代码）
```

---

## 输出格式

```
📄 文档生成完成

类型: {文档类型}
来源: {代码/change_log}
产出: {文档路径}

内容: 类设计 {N}个 / 方法设计 {N}个 / 规则追溯 {N}条
```