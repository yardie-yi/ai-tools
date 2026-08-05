# 规则系统详解

---

## 一、规则格式

```yaml
- id: G001                           # 规则ID
  content: "ViewModel后缀使用VM"      # 规则内容
  scope: global                       # global / module:{模块名}
  phase: [code]                       # 适用阶段
  trigger_pattern: "ViewModel"        # 触发模式
  action: "使用VM后缀，如UserVM"       # 执行动作
  status: enabled                     # enabled / disabled

  # 来源记录
  source: user                        # user / default
  created_at: 2026-04-09

  # 协议引用（可选）
  data_ref: null

  # ===== 自进化字段 =====
  identity_hash: "a1b2c3d4"           # 身份哈希
  version: "0.1.2"                    # 语义版本号
  history:                            # 版本历史（可选）
    - version: "0.1.0"
      content: "ViewModel后缀使用VM"
      source: default
      created_at: "2026-04-01"
    - version: "0.1.2"
      content: "ViewModel后缀使用VM，如WeatherVM"
      source: user_correction
      created_at: "2026-04-09"
```

---

## 二、规则分类

| 分类 | 说明 | 示例 |
|------|------|------|
| communication | 通信协议 | IPC方式、接口协议、超时重试 |
| data | 数据规范 | 数据格式、缓存策略、持久化 |
| business | 业务约束 | 业务规则、状态管理、错误处理 |
| interface | 接口规范 | 对外API、参数定义、命名规范 |
| architecture | 架构约束 | 分层设计、依赖关系、模块边界 |

---

## 三、规则优先级

- **critical**: 必须遵守，违反拒绝代码
- **high**: 强烈建议，违反需警告
- **medium**: 推荐遵守，可灵活处理
- **low**: 可选，提供参考

---

## 四、规则加载机制

### 4.1 加载判断（满足任一即加载）

```
├── 任务描述包含规则的keywords → 加载
├── 任务类型匹配规则的category → 加载
├── 规则priority=critical → 优先加载
└── 规则phase包含当前阶段 → 可加载
```

### 4.2 分层加载

| 层级 | 判断条件 | 加载策略 | Token预算 |
|------|---------|---------|----------|
| required | 满足2+个条件 或 priority=critical | 必须加载 | ~2k |
| recommended | 满足1个条件 | 推荐加载 | ~1k |
| backup | 无匹配 | 不加载 | 0 |

---

## 五、trigger_pattern匹配

| 格式 | 示例 | 说明 |
|------|------|------|
| 精确 | `ViewModel` | 完全匹配 |
| OR | `private\|私有` | 任一匹配 |
| 正则 | `^get[A-Z]` | 正则匹配 |

---

## 六、模块复杂度评估

### 6.1 评估维度（各0-10分）

| 维度 | 说明 | 评估要点 |
|------|------|---------|
| communication | 通信复杂度 | IPC方式、跨进程次数 |
| data | 数据复杂度 | 缓存策略、持久化 |
| business | 业务复杂度 | 业务规则数量、状态管理 |
| dependency | 依赖复杂度 | 依赖模块数量 |
| interface | 接口复杂度 | 对外接口数量 |

### 6.2 复杂度等级与规则上限

| 总分 | 等级 | 规则上限 |
|------|------|---------|
| 0-10 | simple | 10条 |
| 11-25 | medium | 20条 |
| 26-40 | complex | 30条 |
| 41-50 | high_complex | 30条 |

---

## 七、Token消耗估算

| 场景 | global规则 | module规则 | 协议 | 总计 |
|------|-----------|-----------|------|------|
| 敏捷模式(无模块) | ~1.0k | 0 | 0 | ~1.0k |
| 敏捷模式(有模块) | ~1.0k | ~1.5k | ~2.0k | ~4.5k |
| 流程code阶段 | ~1.0k | ~1.5k | ~2.0k | ~4.5k |

**单场景最大约4.5k tokens**

---

## 八、默认规则

初始化时自动创建15条默认规则：

| ID | 内容 | 分类 |
|----|------|------|
| G001 | 遵循MVVM架构模式 | architecture |
| G002 | ViewModel后缀使用VM | interface |
| G003 | Repository使用全称 | interface |
| G004 | 私有变量使用_前缀 | interface |
| G005 | LiveData使用私有MutableLiveData | data |
| G006 | 协程使用viewModelScope | business |
| G007 | 按功能模块分包 | architecture |
| G008 | 使用Result封装错误 | business |
| G009 | 网络请求使用协程 | communication |
| G010 | 日志使用统一工具类 | business |
| G011 | 资源文件命名规范 | interface |
| G012 | 布局文件命名规范 | interface |
| G013 | 字符串资源化 | data |
| G014 | 避免内存泄漏 | architecture |
| G015 | 单元测试覆盖核心逻辑 | business |

---

## 九、详细参考

- **身份识别算法**: Read references/core/identity-merge.md
- **默认规则详情**: Read references/core/defaults/rules-global.yaml
- **模块规则示例**: Read references/core/defaults/rules-module/weather.yaml